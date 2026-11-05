import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { electroEpilPage } from '../../src/content/pages/electro-epil/index.ts'
import { laserEpilPage } from '../../src/content/pages/laser-epil/index.ts'
import { ZONES_MEN, ZONES_WOMEN } from '../../src/content/pages/laser-epil/zones.ts'
import { sugaringPage, ZONES_MEN as SUGAR_MEN, ZONES_WOMEN as SUGAR_WOMEN } from '../../src/content/pages/sugaring/index.ts'
import { priceOf } from '../../src/content/services.ts'
import { servicePage, type ServicePageDef } from '../../src/layout/service-page.ts'
import type { ImageManifest } from '../../src/lib/images.ts'

const PAGES: [string, ServicePageDef, string, string][] = [
  ['laser-epil', laserEpilPage, 'LaserEpilFAQ.data.ts', 'LaserEpilReviews.tsx'],
  ['sugaring', sugaringPage, 'SugaringFAQ.data.ts', 'SugaringReviews.tsx'],
  ['electro-epil', electroEpilPage, 'ElectroEpilFAQ.data.ts', 'ElectroEpilReviews.tsx'],
]

function oldSource(path: string): string | null {
  try {
    return execFileSync('git', ['show', `origin/main:${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  } catch {
    return null
  }
}

/** Литерал массива `const <name>[: Тип] = [...]`. */
function arrayLiteral(source: string, name: string): unknown[] {
  const start = source.indexOf('= [', source.indexOf(`const ${name}`)) + 2
  let depth = 0
  let end = start
  for (; end < source.length; end++) {
    if (source[end] === '[') depth++
    if (source[end] === ']' && --depth === 0) break
  }
  return new Function(`return ${source.slice(start, end + 1)}`)() as unknown[]
}

const hasGit = oldSource('src/components/laser-epil/LaserEpilFAQ.data.ts') !== null

describe.skipIf(!hasGit)('совпадение FAQ и отзывов с текущим сайтом', () => {
  for (const [slug, def, faqFile, reviewsFile] of PAGES) {
    it(`${slug}: 8 вопросов FAQ посимвольно`, () => {
      const src = oldSource(`src/components/${slug}/${faqFile}`)!
      const name = src.match(/export const (\w+)/)![1]!
      const old = arrayLiteral(src, name) as { q: string; a: string }[]
      expect(def.faq).toHaveLength(8)
      expect(def.faq).toEqual(old.map((f) => ({ question: f.q, answer: f.a })))
    })

    it(`${slug}: 6 отзывов посимвольно`, () => {
      const old = arrayLiteral(oldSource(`src/components/${slug}/${reviewsFile}`)!, 'reviews') as { name: string; date: string; text: string }[]
      expect(def.reviews).toHaveLength(6)
      expect(def.reviews!.map(({ name, date, text }) => ({ name, date, text }))).toEqual(old.map(({ name, date, text }) => ({ name, date, text })))
    })
  }
})

describe('зоны ↔ прайс', () => {
  it('каждый priceRef указывает на существующую позицию прайса', () => {
    for (const z of [...ZONES_WOMEN, ...ZONES_MEN, ...SUGAR_WOMEN, ...SUGAR_MEN]) {
      if (z.priceRef) expect(priceOf(z.priceRef), z.name).toBeTypeOf('number')
    }
  })

  it('женские зоны лазера и все зоны шугаринга сопоставлены с прайсом', () => {
    expect(ZONES_WOMEN.every((z) => z.priceRef)).toBe(true)
    expect([...SUGAR_WOMEN, ...SUGAR_MEN].every((z) => z.priceRef)).toBe(true)
  })
})

const manifestFile = 'dist/img/manifest.json'
const images: ImageManifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : {}

describe('servicePage', () => {
  for (const [slug, def] of PAGES) {
    it(`${slug}: один h1, крошки, секции в порядке спеки, JSON-LD`, () => {
      const page = servicePage(def)
      const out = page.render({ path: def.path, assets: { css: [], js: [], preload: [] }, images }).value
      expect(out.match(/<h1[\s>]/g)).toHaveLength(1)
      expect(out).toContain('aria-label="Хлебные крошки"')
      expect(out).toContain('href="/#services">← Все услуги')
      const ids = [...out.matchAll(/<section class="(?:svc-section|home-section|svc-cta)[^"]*" id="([a-z-]+)"/g)].map((m) => m[1])
      expect(ids.slice(-4)).toEqual(['reviews', 'prices', 'faq', 'cta'])
      const types = (page.meta.jsonLd ?? []).map((d) => (d as { '@type': string })['@type'])
      expect(types).toEqual(['BeautySalon', 'Service', 'BreadcrumbList', 'FAQPage'])
      expect(page.meta.title).toMatch(/ в Ростове-на-Дону — студия LUCOVICA$/)
      expect(page.meta.title).not.toContain('| LUCOVICA')
    })
  }

  it('порядок тематических секций', () => {
    const order = (def: ServicePageDef) =>
      (def.sections ?? []).map((s) => s.value.match(/<section class="[^"]*" id="([a-z-]+)"/)![1])
    expect(order(laserEpilPage)).toEqual(['why', 'how', 'zones', 'device', 'contraindications', 'results'])
    expect(order(sugaringPage)).toEqual(['why', 'how', 'zones', 'composition', 'contraindications', 'results'])
    expect(order(electroEpilPage)).toEqual(['why', 'how', 'zones', 'method', 'contraindications', 'results'])
  })

  it('электро: ссылка на /laser-epil внутри секции «Когда лазер не справляется»', () => {
    const why = electroEpilPage.sections![0]!.value
    expect(why).toMatch(/Когда лазер <em>не справляется<\/em>[\s\S]*<a href="\/laser-epil">лазерная эпиляция<\/a>[\s\S]*<\/section>$/)
  })
})
