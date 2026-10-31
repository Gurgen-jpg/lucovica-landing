import { afterEach, describe, expect, it, vi } from 'vitest'
import { escapeHtml } from '../../server/lib/escape-html.ts'
import { createRateLimiter } from '../../server/lib/rate-limit.ts'
import { withRetry } from '../../server/lib/retry.ts'
import { withTimeout } from '../../server/lib/timeout.ts'

afterEach(() => vi.useRealTimers())

describe('escapeHtml', () => {
  it('экранирует спецсимволы', () => {
    expect(escapeHtml(`<b>"А" & 'Б'</b>`)).toBe('&lt;b&gt;&quot;А&quot; &amp; &#39;Б&#39;&lt;/b&gt;')
  })
})

describe('withRetry', () => {
  it('повторяет до успеха', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValue('ok')
    await expect(withRetry(fn, 3, 0)).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('после всех попыток бросает последнюю ошибку', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('down'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('down')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('паузы 200 и 400 мс', async () => {
    vi.useFakeTimers()
    const fn = vi.fn().mockRejectedValue(new Error('down'))
    const p = withRetry(fn).catch((e: Error) => e)
    await vi.advanceTimersByTimeAsync(199)
    expect(fn).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(fn).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(400)
    expect(fn).toHaveBeenCalledTimes(3)
    await p
  })
})

describe('withTimeout', () => {
  it('отклоняет по таймауту', async () => {
    vi.useFakeTimers()
    const p = withTimeout(new Promise(() => {}), 1000, 'x')
    vi.advanceTimersByTime(1000)
    await expect(p).rejects.toThrow('x: timeout after 1000ms')
  })

  it('пропускает быстрый результат', async () => {
    await expect(withTimeout(Promise.resolve(1), 1000)).resolves.toBe(1)
  })
})

describe('rate limit', () => {
  it('6-й запрос за 60 с ограничен, после окна — снова можно', () => {
    vi.useFakeTimers()
    const limiter = createRateLimiter({ limit: 5, windowMs: 60_000, cleanupMs: 0 })
    for (let i = 0; i < 5; i++) expect(limiter.hit('1.1.1.1')).toBe(true)
    expect(limiter.hit('1.1.1.1')).toBe(false)
    expect(limiter.hit('2.2.2.2')).toBe(true)
    vi.advanceTimersByTime(60_000)
    expect(limiter.hit('1.1.1.1')).toBe(true)
  })

  it('скользящее окно: старые запросы выпадают по одному', () => {
    vi.useFakeTimers()
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, cleanupMs: 0 })
    limiter.hit('a')
    vi.advanceTimersByTime(600)
    limiter.hit('a')
    expect(limiter.hit('a')).toBe(false)
    vi.advanceTimersByTime(400)
    expect(limiter.hit('a')).toBe(true)
    expect(limiter.hit('a')).toBe(false)
  })

  it('очистка не ломает учёт', () => {
    vi.useFakeTimers()
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, cleanupMs: 500 })
    limiter.hit('a')
    vi.advanceTimersByTime(1500)
    expect(limiter.hit('a')).toBe(true)
  })
})
