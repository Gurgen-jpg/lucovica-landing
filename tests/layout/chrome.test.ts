import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.doUnmock('../../src/content/site.ts')
  vi.resetModules()
})

describe('promoBar', () => {
  it('выводит текст акции из настроек', async () => {
    const { promoBar } = await import('../../src/layout/header.ts')
    expect(promoBar()?.value).toContain('Первый визит — подмышки бесплатно')
  })

  it('пустой текст акции — плашки нет', async () => {
    vi.resetModules()
    const real = await vi.importActual<typeof import('../../src/content/site.ts')>('../../src/content/site.ts')
    vi.doMock('../../src/content/site.ts', () => ({ ...real, site: { ...real.site, promo: '' } }))
    const { promoBar } = await import('../../src/layout/header.ts')
    expect(promoBar()).toBeNull()
  })
})

describe('footer', () => {
  it('копирайт с годом сборки и без ссылки на /offer', async () => {
    const { footer, BUILD_YEAR } = await import('../../src/layout/footer.ts')
    const out = footer().value
    expect(out).toContain(`© 2014 — ${BUILD_YEAR} · Студия эпиляции LUCOVICA`)
    expect(out).not.toContain('/offer')
  })
})
