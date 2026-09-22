import type { Metadata } from 'next'
import { ComplexHero, ComplexPricing, ComplexCTA } from '@/components/complex'
import { PageViewGoal, ServiceBreadcrumb } from '@/components/ui'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const PAGE_URL = `${SITE_URL}/complex`

export const metadata: Metadata = {
  title: 'Комплексы лазерной эпиляции в Ростове-на-Дону — студия Lucovica',
  description:
    'Комплексы лазерной эпиляции для женщин и мужчин в Ростове-на-Дону — несколько зон за один визит, выгоднее, чем по отдельности. Цены и онлайн-запись — студия Lucovica, просп. Соколова 68.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Комплексы', item: PAGE_URL },
  ],
}

export default function ComplexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PageViewGoal goal="complex_page_view" />
      <ServiceBreadcrumb serviceName="Комплексы" />
      <ComplexHero />
      <ComplexPricing />
      <ComplexCTA />
    </>
  )
}
