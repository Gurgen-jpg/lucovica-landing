import { describe, expect, it } from 'vitest'
import { ELECTRO_CARD, minPriceOnPage, priceCards } from '../../src/content/price-page.ts'
import { SERVICE_NAMES_FOR_FORM } from '../../src/content/services.ts'

describe('/price', () => {
  it('все позиции найдены в прайсе и отсортированы по цене', () => {
    const cards = priceCards()
    expect(cards.map((c) => [c.id, c.rows.length])).toEqual([
      ['laser-women', 10],
      ['sugaring-women', 9],
      ['laser-men', 10],
      ['sugaring-men', 7],
    ])
    for (const c of cards) {
      expect(c.rows.map((r) => r.price)).toEqual([...c.rows.map((r) => r.price)].sort((a, b) => a - b))
      expect(SERVICE_NAMES_FOR_FORM).toContain(c.bookingService)
    }
  })

  it('минимальная цена страницы — 400 ₽, электро — 4 тарифа', () => {
    expect(minPriceOnPage()).toBe(400)
    expect(ELECTRO_CARD.rows).toHaveLength(4)
  })
})
