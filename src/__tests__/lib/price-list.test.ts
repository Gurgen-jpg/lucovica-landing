import { describe, it, expect } from 'vitest'
import {
  buildPriceList,
  buildElectroList,
  minPrice,
  PRICE_GROUPS,
  MAX_ROWS,
  ELECTRO_FORM_SERVICE,
} from '@/components/price/price-list.config'
import { SERVICES, ELECTRO_PRICES, SERVICE_NAMES_FOR_FORM } from '@/lib/services-data'

describe('price-list', () => {
  const groups = buildPriceList()

  it('есть лазер и шугаринг для девушек и мужчин', () => {
    for (const audience of ['women', 'men'] as const) {
      const titles = groups.filter((g) => g.audience === audience).map((g) => g.title)
      expect(titles).toEqual(['Лазерная эпиляция', 'Шугаринг'])
    }
  })

  it.each(groups.map((g) => [g.id, g] as const))('%s: от 1 до 10 позиций', (_, g) => {
    expect(g.rows.length).toBeGreaterThan(0)
    expect(g.rows.length).toBeLessThanOrEqual(MAX_ROWS)
  })

  it('цены совпадают с services-data', () => {
    PRICE_GROUPS.forEach((cfg, gi) => {
      for (const pick of cfg.picks) {
        const source = SERVICES.find((c) => c.id === pick.categoryId)!.items.find((i) => i.name === pick.name)!
        expect(groups[gi].rows).toContainEqual({ name: source.name, price: source.price })
      }
    })
  })

  it('позиции отсортированы по возрастанию цены', () => {
    for (const g of [...groups.map((x) => x.rows), buildElectroList()]) {
      const prices = g.map((r) => r.price)
      expect(prices).toEqual([...prices].sort((a, b) => a - b))
    }
  })

  it('услуги формы есть в SERVICE_NAMES_FOR_FORM', () => {
    for (const g of groups) expect(SERVICE_NAMES_FOR_FORM).toContain(g.formService)
    expect(SERVICE_NAMES_FOR_FORM).toContain(ELECTRO_FORM_SERVICE)
  })

  it('электроэпиляция — все позиции ELECTRO_PRICES, не больше 10', () => {
    const electro = buildElectroList()
    expect(electro).toHaveLength(ELECTRO_PRICES.length)
    expect(electro.length).toBeLessThanOrEqual(MAX_ROWS)
  })

  it('ненайденная позиция бросает ошибку', () => {
    const broken = [{ ...PRICE_GROUPS[0], picks: [{ categoryId: 'laser-women', name: 'Нет такой зоны' }] }]
    expect(() => buildPriceList(broken)).toThrow(/Нет такой зоны/)
  })

  it('minPrice — минимальная цена по всем спискам', () => {
    const electro = buildElectroList()
    const all = [...groups.flatMap((g) => g.rows), ...electro].map((r) => r.price)
    expect(minPrice(groups, electro)).toBe(Math.min(...all))
  })
})
