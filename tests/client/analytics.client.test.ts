// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initAnalytics, track } from '../../src/client/analytics.ts'

beforeEach(() => {
  vi.useFakeTimers()
  delete window.ym
  delete window.__YM_ID
  document.body.innerHTML = ''
  delete document.body.dataset.pageGoal
})

afterEach(() => vi.useRealTimers())

describe('track', () => {
  it('без ID счётчика — пустая операция без ошибок', () => {
    window.ym = vi.fn()
    expect(() => track('click_phone')).not.toThrow()
    expect(window.ym).not.toHaveBeenCalled()
  })

  it('отправляет цель сразу, если ym есть', () => {
    window.__YM_ID = 123
    window.ym = vi.fn()
    track('click_phone')
    expect(window.ym).toHaveBeenCalledWith(123, 'reachGoal', 'click_phone')
  })

  it('ждёт загрузки счётчика и отправляет цель ровно один раз', () => {
    window.__YM_ID = 123
    track('header_phone_click')
    vi.advanceTimersByTime(2000)
    const ym = vi.fn()
    window.ym = ym
    vi.advanceTimersByTime(5000)
    expect(ym).toHaveBeenCalledTimes(1)
    expect(ym).toHaveBeenCalledWith(123, 'reachGoal', 'header_phone_click')
  })

  it('перестаёт ждать через 10 секунд', () => {
    window.__YM_ID = 123
    track('x')
    vi.advanceTimersByTime(10_500)
    const ym = vi.fn()
    window.ym = ym
    vi.advanceTimersByTime(1000)
    expect(ym).not.toHaveBeenCalled()
  })
})

describe('initAnalytics', () => {
  it('клик по элементу с data-goal (включая вложенный элемент)', () => {
    window.__YM_ID = 1
    window.ym = vi.fn()
    document.body.innerHTML = '<a href="tel:+7" data-goal="header_phone_click"><span id="t">тел</span></a>'
    initAnalytics(document)
    document.getElementById('t')!.click()
    expect(window.ym).toHaveBeenCalledWith(1, 'reachGoal', 'header_phone_click')
  })

  it('цель просмотра страницы из body[data-page-goal]', () => {
    window.__YM_ID = 1
    window.ym = vi.fn()
    document.body.dataset.pageGoal = 'cert_page_view'
    initAnalytics(document)
    expect(window.ym).toHaveBeenCalledWith(1, 'reachGoal', 'cert_page_view')
  })
})
