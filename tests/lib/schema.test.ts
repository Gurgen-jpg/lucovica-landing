import { describe, expect, it } from 'vitest'
import { site } from '../../src/content/site.ts'
import { jsonScript } from '../../src/lib/html.ts'
import { beautySalon, breadcrumbs, faqPage, service } from '../../src/lib/schema.ts'

// Проходит через ту же сериализацию, что и страница
const roundTrip = (data: object) => JSON.parse(jsonScript(data).value.replace(/\\u003c/g, '<'))

describe('JSON-LD', () => {
  it('BeautySalon совпадает с site.ts', () => {
    const s = roundTrip(beautySalon())
    expect(s['@type']).toBe('BeautySalon')
    expect(s.telephone).toBe(site.phone.e164)
    expect(s.address.streetAddress).toBe(site.address.street)
    expect(s.address.postalCode).toBe(site.address.postalCode)
    expect(s.geo).toMatchObject({ latitude: site.geo.lat, longitude: site.geo.lon })
    expect(s.openingHoursSpecification[0]).toMatchObject({ opens: '10:00', closes: '21:00' })
    expect(s.openingHoursSpecification[0].dayOfWeek).toHaveLength(7)
    expect(s.aggregateRating.ratingValue).toBe(5)
  })

  it('Service: диапазон цен и каталог', () => {
    const s = roundTrip(
      service({
        name: 'Шугаринг',
        description: 'd',
        path: '/sugaring',
        offers: [
          { name: 'Подмышки', price: 600 },
          { name: 'Ноги полностью', price: 1600 },
        ],
      }),
    )
    expect(s.offers).toMatchObject({ lowPrice: 600, highPrice: 1600, offerCount: 2, priceCurrency: 'RUB' })
    expect(s.url).toBe('https://lucovica.ru/sugaring')
    expect(s.provider['@id']).toBe('https://lucovica.ru/#business')
  })

  it('FAQPage: вопросы и ответы в том же порядке', () => {
    const items = [
      { q: 'Больно?', a: 'Нет <b>совсем</b>' },
      { q: 'Сколько сеансов?', a: '6–10' },
    ]
    const s = roundTrip(faqPage(items))
    expect(s.mainEntity.map((e: { name: string }) => e.name)).toEqual(['Больно?', 'Сколько сеансов?'])
    expect(s.mainEntity[0].acceptedAnswer.text).toBe('Нет <b>совсем</b>')
  })

  it('BreadcrumbList: позиции и абсолютные URL', () => {
    const s = roundTrip(breadcrumbs([{ name: 'Главная', path: '/' }, { name: 'Шугаринг', path: '/sugaring' }]))
    expect(s.itemListElement[1]).toMatchObject({ position: 2, item: 'https://lucovica.ru/sugaring' })
  })
})
