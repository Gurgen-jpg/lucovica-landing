import {
  LaserEpilHero,
  LaserEpilWhy,
  LaserEpilHow,
  LaserEpilZones,
  LaserEpilDevice,
  LaserEpilContraindications,
  LaserEpilResults,
  LaserEpilReviews,
  LaserEpilPricing,
  LaserEpilFAQ,
  LaserEpilCTA,
} from '@/components/laser-epil'
import { laserEpilFaqs } from '@/components/laser-epil/LaserEpilFAQ.data'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import MessengerWidgets from '@/components/MessengerWidgets'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: laserEpilFaqs.map(({ q, a }) => ({
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
    { '@type': 'ListItem', position: 2, name: 'Лазерная эпиляция', item: `${SITE_URL}/laser-epil` },
  ],
}

export default function LaserEpilPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LaserEpilHero />
      <LaserEpilWhy />
      <LaserEpilHow />
      <LaserEpilZones />
      <LaserEpilDevice />
      <LaserEpilContraindications />
      <LaserEpilResults />
      <LaserEpilReviews />
      <LaserEpilPricing />
      <LaserEpilFAQ />
      <LaserEpilCTA />
      <Footer />
      <FloatingCTA />
      <MessengerWidgets />
    </>
  )
}
