import {
  ElectroEpilHero,
  ElectroEpilWhy,
  ElectroEpilHow,
  ElectroEpilZones,
  ElectroEpilMethod,
  ElectroEpilContraindications,
  ElectroEpilResults,
  ElectroEpilReviews,
  ElectroEpilPricing,
  ElectroEpilFAQ,
  ElectroEpilCTA,
} from '@/components/electro-epil'
import { electroEpilFaqs } from '@/components/electro-epil/ElectroEpilFAQ.data'
import { buildServiceJsonLd } from '@/lib/seo-schema'
import { ELECTRO_PRICES } from '@/lib/services-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'

const serviceJsonLd = buildServiceJsonLd({
  name: 'Электроэпиляция',
  description:
    'Электроэпиляция в Ростове-на-Дону — перманентное удаление волос любого цвета, включая светлые и седые. Тарификация по времени процедуры.',
  path: '/electro-epil',
  offers: ELECTRO_PRICES.map((p) => ({ name: `Электроэпиляция — ${p.name}`, price: p.price })),
})

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: electroEpilFaqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Электроэпиляция', item: `${SITE_URL}/electro-epil` },
  ],
}

export default function ElectroEpilPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <ElectroEpilHero />
      <ElectroEpilWhy />
      <ElectroEpilHow />
      <ElectroEpilZones />
      <ElectroEpilMethod />
      <ElectroEpilContraindications />
      <ElectroEpilResults />
      <ElectroEpilReviews />
      <ElectroEpilPricing />
      <ElectroEpilFAQ />
      <ElectroEpilCTA />
    </>
  )
}
