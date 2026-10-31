import type { Metadata } from 'next'
import {
  PriceHeader,
  PriceTabs,
  PriceContacts,
  buildPriceList,
  buildElectroList,
  minPrice,
  ELECTRO_FORM_SERVICE,
} from '@/components/price'
import { PageViewGoal } from '@/components/ui'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const PAGE_URL = `${SITE_URL}/price`

const groups = buildPriceList()
const electro = buildElectroList()

const TITLE = 'Прайс-лист — студия эпиляции LUCOVICA'
const DESCRIPTION = `Лазерная эпиляция, шугаринг и электроэпиляция для девушек и мужчин в Ростове-на-Дону — от ${minPrice(groups, electro).toLocaleString('ru-RU')} ₽. Онлайн-запись.`

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: PAGE_URL,
    siteName: 'LUCOVICA',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'LUCOVICA студия эпиляции' }],
  },
  robots: { index: false, follow: true },
}

export default function PricePage() {
  return (
    <main className="min-h-screen bg-mist/20 pb-28">
      <PageViewGoal goal="price_page_view" />
      <div className="mx-auto max-w-md px-4">
        <PriceHeader />
        <PriceTabs groups={groups} electro={electro} electroService={ELECTRO_FORM_SERVICE} />
        <div className="mt-4">
          <PriceContacts />
        </div>
      </div>
    </main>
  )
}
