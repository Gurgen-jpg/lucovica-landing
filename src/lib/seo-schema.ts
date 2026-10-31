import { SERVICES } from './services-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'

type SchemaOffer = { name: string; price: number }

/**
 * Собирает JSON-LD `Service` с каталогом цен для страницы услуги.
 * `provider` ссылается на LocalBusiness из корневого layout по `@id`.
 */
export function buildServiceJsonLd(opts: {
  name: string
  description: string
  path: string
  offers: SchemaOffer[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    areaServed: { '@type': 'City', name: 'Ростов-на-Дону' },
    provider: { '@id': `${SITE_URL}/#business` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Цены — ${opts.name}`,
      itemListElement: opts.offers.map((o) => ({
        '@type': 'Offer',
        price: o.price,
        priceCurrency: 'RUB',
        itemOffered: { '@type': 'Service', name: o.name },
      })),
    },
  }
}

export function offersFromCategories(categoryIds: string[]): SchemaOffer[] {
  return SERVICES.filter((c) => categoryIds.includes(c.id)).flatMap((c) =>
    c.items.map((i) => ({ name: `${c.title} — ${i.name}`, price: i.price })),
  )
}
