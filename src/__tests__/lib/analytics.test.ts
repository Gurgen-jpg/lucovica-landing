import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { track, trackHit, trackWhenReady } from '@/lib/analytics'

describe('analytics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '12345')
    vi.stubGlobal('window', {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('track sends reachGoal', () => {
    const ym = vi.fn()
    Object.assign(window, { ym })
    track('complex_page_view')
    expect(ym).toHaveBeenCalledWith(12345, 'reachGoal', 'complex_page_view')
  })

  it('trackHit sends hit with referer', () => {
    const ym = vi.fn()
    Object.assign(window, { ym })
    trackHit('https://lucovica.ru/cert', 'https://lucovica.ru/')
    expect(ym).toHaveBeenCalledWith(12345, 'hit', 'https://lucovica.ru/cert', { referer: 'https://lucovica.ru/' })
  })

  it('trackWhenReady waits until the counter is loaded', () => {
    trackWhenReady('cert_page_view')
    const ym = vi.fn()
    Object.assign(window, { ym })
    vi.advanceTimersByTime(200)
    expect(ym).toHaveBeenCalledOnce()
    expect(ym).toHaveBeenCalledWith(12345, 'reachGoal', 'cert_page_view')
    vi.advanceTimersByTime(2000)
    expect(ym).toHaveBeenCalledOnce()
  })

  it('trackWhenReady gives up after the timeout and can be cancelled', () => {
    const cancel = trackWhenReady('cert_page_view', 1000)
    vi.advanceTimersByTime(1200)
    const ym = vi.fn()
    Object.assign(window, { ym })
    vi.advanceTimersByTime(1000)
    expect(ym).not.toHaveBeenCalled()
    cancel()
  })
})
