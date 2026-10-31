import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { HOME_FAQ } from '../../src/content/faq-home.ts'
import { REVIEWS } from '../../src/content/reviews.ts'
import {
  byGroup,
  CERTIFICATES,
  ELECTRO_PRICES,
  minPrice,
  PRICE_TABS,
  SERVICE_NAMES_FOR_FORM,
  SERVICES,
} from '../../src/content/services.ts'
import { formatPrice } from '../../src/lib/format.ts'
import { yearsLabel } from '../../src/sections/home/masters.ts'

describe('services', () => {
  it('8 категорий с прежним числом позиций', () => {
    expect(SERVICES.map((c) => [c.id, c.items.length])).toEqual([
      ['laser-women', 12],
      ['laser-complexes-women', 7],
      ['sugaring-women', 9],
      ['sugaring-master', 7],
      ['sugaring-teen', 5],
      ['sugaring-men', 7],
      ['laser-men', 7],
      ['laser-complexes-men', 4],
    ])
    expect(ELECTRO_PRICES).toHaveLength(4)
    expect(CERTIFICATES).toHaveLength(4)
  })

  it('bookingService категорий и вкладок входит в список услуг формы', () => {
    for (const c of SERVICES) expect(SERVICE_NAMES_FOR_FORM).toContain(c.bookingService)
    for (const t of PRICE_TABS) expect(SERVICE_NAMES_FOR_FORM).toContain(t.bookingService)
  })

  it('подгруппы вкладок в порядке спеки', () => {
    expect(byGroup('laser').map((c) => c.audience)).toEqual(['Девушки', 'Мужчины'])
    expect(byGroup('sugaring').map((c) => c.audience)).toEqual([
      'Девушки',
      'Мастер Екатерина (руководитель)',
      'Юные леди (до 15 лет)',
      'Мужчины',
    ])
    expect(byGroup('complex').map((c) => c.audience)).toEqual(['Девушки', 'Мужчины'])
  })

  it('minPrice вычисляется из данных', () => {
    expect(minPrice('sugaring')).toBe(300)
    expect(minPrice('laser')).toBe(990)
    expect(minPrice('electro')).toBe(700)
    expect(minPrice('complex')).toBe(3690)
    expect(minPrice('cert')).toBe(500)
  })

  it('formatPrice — разряды через неразрывный пробел', () => {
    expect(formatPrice(13990)).toBe('13 990')
    expect(formatPrice(990)).toBe('990')
  })

  it('yearsLabel склоняет «год»', () => {
    expect([1, 3, 5, 11, 15, 21, 22].map(yearsLabel)).toEqual([
      '1 год', '3 года', '5 лет', '11 лет', '15 лет', '21 год', '22 года',
    ])
  })
})

// Сверка с исходниками старого сайта (ветка main). Без git-истории тест пропускается.
function oldSource(path: string): string | null {
  try {
    return execFileSync('git', ['show', `origin/main:${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  } catch {
    return null
  }
}

/** Вычленяет литерал массива `const <name>[: Тип] = [...]` и вычисляет его. */
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

const oldFaq = oldSource('src/components/FAQ.tsx')
const oldReviews = oldSource('src/components/Reviews.tsx')
const oldPrices = oldSource('src/lib/services-data.ts')

describe.skipIf(!oldFaq || !oldReviews || !oldPrices)('совпадение с текущим сайтом', () => {
  it('FAQ — посимвольно', () => {
    const faqs = arrayLiteral(oldFaq!, 'faqs') as { q: string; a: string }[]
    expect(HOME_FAQ).toEqual(faqs.map((f) => ({ question: f.q, answer: f.a })))
  })

  it('отзывы — посимвольно', () => {
    const reviews = arrayLiteral(oldReviews!, 'reviews') as { name: string; date: string; service: string; text: string }[]
    expect(REVIEWS).toEqual(reviews.map(({ name, date, service, text }) => ({ name, date, service, text })))
  })

  it('цены — все позиции без изменений', () => {
    const body = oldPrices!.replace(/^export type[\s\S]*?\n\}\n/gm, '')
    const old = arrayLiteral(body, 'SERVICES: ServiceCategory[]'.replace(': ServiceCategory[]', '')) as {
      id: string
      items: { name: string; price: number; short: string }[]
    }[]
    expect(SERVICES.map((c) => ({ id: c.id, items: c.items }))).toEqual(old.map((c) => ({ id: c.id, items: c.items })))
  })
})
