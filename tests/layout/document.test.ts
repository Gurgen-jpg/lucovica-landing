import { afterEach, describe, expect, it, vi } from 'vitest'
import { html } from '../../src/lib/html.ts'
import type { RenderContext } from '../../src/lib/page.ts'

const ctx: RenderContext = {
  path: '/sugaring',
  assets: { css: ['/assets/site-abc.css'], js: ['/assets/main-abc.js'], preload: [] },
  images: {},
}

async function load(env: Record<string, string> = {}) {
  vi.resetModules()
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v)
  return (await import('../../src/layout/document.ts')).document
}

afterEach(() => vi.unstubAllEnvs())

describe('document', () => {
  it('формирует метаданные из спеки seo-metadata', async () => {
    const document = await load()
    const out = document(
      { title: 'Шугаринг', description: 'Описание', jsonLd: [{ '@type': 'Service' }] },
      html`<h1>Шугаринг</h1>`,
      ctx,
    ).value
    expect(out).toMatch(/^<!doctype html>\n<html lang="ru">/)
    expect(out).toContain('<title>Шугаринг</title>')
    expect(out).toContain('<meta name="description" content="Описание">')
    expect(out).toContain('<link rel="canonical" href="https://lucovica.ru/sugaring">')
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:site_name']) {
      expect(out).toContain(`property="${p}"`)
    }
    expect(out).toContain('<meta property="og:locale" content="ru_RU">')
    expect(out).toContain('<meta property="og:image" content="https://lucovica.ru/og-image.jpg">')
    expect(out).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">')
    expect(out).toContain('<script type="application/ld+json">{"@type":"Service"}</script>')
    expect(out).toContain('<link rel="stylesheet" href="/assets/site-abc.css">')
  })

  it('noindex-страницы без canonical и с meta robots', async () => {
    const document = await load()
    const out = document({ title: 't', description: 'd', noindex: true }, html``, ctx).value
    expect(out).toContain('<meta name="robots" content="noindex, nofollow">')
    expect(out).not.toContain('rel="canonical"')
  })

  it('без YM_ID нет счётчика и пикселя', async () => {
    const document = await load({ YM_ID: '' })
    const out = document({ title: 't', description: 'd' }, html``, ctx).value
    expect(out).not.toContain('mc.yandex.ru')
  })

  it('с YM_ID — сниппет и noscript-пиксель', async () => {
    const document = await load({ YM_ID: '12345678' })
    const out = document({ title: 't', description: 'd', pageGoal: 'cert_page_view' }, html``, ctx).value
    expect(out).toContain('ym(12345678,"init"')
    expect(out).toContain('https://mc.yandex.ru/watch/12345678')
    expect(out).toContain('<body data-page-goal="cert_page_view">')
  })

  it('нецифровой YM_ID игнорируется', async () => {
    const document = await load({ YM_ID: '1);alert(1' })
    expect(document({ title: 't', description: 'd' }, html``, ctx).value).not.toContain('mc.yandex.ru')
  })
})
