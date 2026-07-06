import {
  SugaringHero,
  SugaringWhy,
  SugaringHow,
  SugaringZones,
  SugaringComposition,
  SugaringContraindications,
  SugaringResults,
  SugaringReviews,
  SugaringPricing,
  SugaringFAQ,
  SugaringCTA,
} from '@/components/sugaring'
import { sugaringFaqs } from '@/components/sugaring/SugaringFAQ.data'
import { buildServiceJsonLd, offersFromCategories } from '@/lib/seo-schema'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'

const serviceJsonLd = buildServiceJsonLd({
  name: 'Шугаринг',
  description:
    'Шугаринг сахарной пастой в Ростове-на-Дону. Натуральный состав, все зоны для женщин, мужчин и подростков.',
  path: '/sugaring',
  offers: offersFromCategories([
    'sugaring-women',
    'sugaring-master',
    'sugaring-teen',
    'sugaring-men',
  ]),
})

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sugaringFaqs.map(({ q, a }) => ({
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
    { '@type': 'ListItem', position: 2, name: 'Шугаринг', item: `${SITE_URL}/sugaring` },
  ],
}

export default function SugaringPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <SugaringHero />
      <SugaringWhy />
      <SugaringHow />
      <SugaringZones />
      <SugaringComposition />
      <SugaringContraindications />
      <SugaringResults />
      <SugaringReviews />
      <SugaringPricing />
      <SugaringFAQ />
      <SugaringCTA />
    </>
  )
}
