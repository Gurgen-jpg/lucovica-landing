import type { Metadata } from 'next'
import { CertHero, CertPricing, CertCTA } from '@/components/cert'
import { PageViewGoal, ServiceBreadcrumb } from '@/components/ui'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const PAGE_URL = `${SITE_URL}/cert`

export const metadata: Metadata = {
  title: 'Подарочные сертификаты в Ростове-на-Дону — студия Lucovica',
  description:
    'Подарочные сертификаты студии Lucovica в Ростове-на-Дону — от 500 до 3000 ₽ на любые услуги: шугаринг, лазерная и электроэпиляция.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Подарочные сертификаты', item: PAGE_URL },
  ],
}

export default function CertPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PageViewGoal goal="cert_page_view" />
      <ServiceBreadcrumb serviceName="Подарочные сертификаты" />
      <CertHero />
      <CertPricing />
      <CertCTA />
    </>
  )
}
