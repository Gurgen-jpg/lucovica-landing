import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { fileForPath, sitemapXml } from '../../scripts/build.ts'
import { SITEMAP_LASTMOD } from '../../src/content/sitemap.ts'
import { html } from '../../src/lib/html.ts'
import type { Page } from '../../src/lib/page.ts'

const page = (path: string, sitemap?: Page['sitemap']): Page => ({
  path,
  sitemap,
  meta: { title: path, description: path },
  render: () => html``,
})

// Набор страниц, как он будет после всех изменений landing_v2
const pages: Page[] = [
  page('/', { priority: 1, changefreq: 'weekly' }),
  page('/laser-epil', { priority: 0.9, changefreq: 'monthly' }),
  page('/sugaring', { priority: 0.9, changefreq: 'monthly' }),
  page('/electro-epil', { priority: 0.9, changefreq: 'monthly' }),
  page('/complex', { priority: 0.8, changefreq: 'monthly' }),
  page('/cert', { priority: 0.8, changefreq: 'monthly' }),
  page('/privacy'),
  page('/welcome'),
  page('/welcome/back'),
  page('/404'),
]

describe('sitemap.xml', () => {
  const xml = sitemapXml(pages)

  it('содержит ровно шесть страниц с абсолютными URL', () => {
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
    expect(locs).toEqual([
      'https://lucovica.ru/',
      'https://lucovica.ru/electro-epil',
      'https://lucovica.ru/laser-epil',
      'https://lucovica.ru/sugaring',
      'https://lucovica.ru/cert',
      'https://lucovica.ru/complex',
    ])
  })

  it('служебные страницы не попадают', () => {
    expect(xml).not.toMatch(/welcome|privacy|404/)
  })

  it('lastmod — ручная дата, приоритеты по спеке', () => {
    expect([...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].every((m) => m[1] === SITEMAP_LASTMOD)).toBe(true)
    expect(xml).toContain('<priority>1.0</priority>')
    expect(xml.match(/<priority>0\.9<\/priority>/g)).toHaveLength(3)
    expect(xml.match(/<priority>0\.8<\/priority>/g)).toHaveLength(2)
  })

  it('валидная XML-структура', () => {
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/)
    expect(xml.match(/<url>/g)).toHaveLength(xml.match(/<\/url>/g)!.length)
  })
})

describe('robots.txt', () => {
  const robots = readFileSync('public/robots.txt', 'utf8')
  it('закрывает анкеты, указывает Host и Sitemap', () => {
    expect(robots).toContain('Disallow: /welcome\n')
    expect(robots).toContain('Disallow: /welcome/back')
    expect(robots).toContain('Host: lucovica.ru')
    expect(robots).toContain('Sitemap: https://lucovica.ru/sitemap.xml')
  })
})

describe('fileForPath', () => {
  it('отображает пути в файлы', () => {
    expect(fileForPath('/')).toBe('index.html')
    expect(fileForPath('/laser-epil')).toBe('laser-epil.html')
    expect(fileForPath('/welcome/back')).toBe('welcome/back.html')
  })
})
