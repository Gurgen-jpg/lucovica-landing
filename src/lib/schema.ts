// Хелперы JSON-LD (schema.org). Данные — только из src/content, чтобы совпадать с видимыми на странице.
import { absoluteUrl, config } from '../config.ts'
import { links, site } from '../content/site.ts'

const BUSINESS_ID = () => `${config.siteUrl}/#business`

export function beautySalon(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': BUSINESS_ID(),
    name: site.name,
    description: 'Студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону',
    url: absoluteUrl('/'),
    telephone: site.phone.e164,
    image: absoluteUrl('/og-image.jpg'),
    logo: absoluteUrl('/icon-512.png'),
    priceRange: '₽₽',
    currenciesAccepted: 'RUB',
    paymentAccepted: 'Cash, Credit Card',
    foundingDate: String(site.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: site.yandexMaps.rating,
      bestRating: 5,
      reviewCount: site.yandexMaps.reviewCount,
    },
    sameAs: [links.yandexOrg, links.telegram],
  }
}

export interface Offer {
  name: string
  price: number
}

export function service(opts: { name: string; description: string; path: string; offers: Offer[] }): object {
  const prices = opts.offers.map((o) => o.price)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    areaServed: { '@type': 'City', name: site.address.city },
    provider: { '@id': BUSINESS_ID() },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'RUB',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: opts.name,
      itemListElement: opts.offers.map((o) => ({
        '@type': 'Offer',
        name: o.name,
        price: o.price,
        priceCurrency: 'RUB',
      })),
    },
  }
}

export interface FaqItem {
  q: string
  a: string
}

export function faqPage(items: readonly FaqItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
}

export function breadcrumbs(items: readonly { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
