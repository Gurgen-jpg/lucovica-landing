import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const PAGE_URL = `${SITE_URL}/electro-epil`

export const metadata: Metadata = {
  title: 'Электроэпиляция в Ростове-на-Дону — студия Lucovica',
  description:
    'Электроэпиляция в Ростове-на-Дону — перманентное удаление волос любого цвета, включая светлые и седые. Идеально для лица и коррекции после лазера. Цены, отзывы, онлайн-запись — студия Lucovica, просп. Соколова 68.',
  keywords: [
    'электроэпиляция Ростов-на-Дону',
    'электроэпиляция Ростов',
    'электроэпиляция лица Ростов',
    'удаление седых волос Ростов',
    'электроэпиляция цена Ростов',
    'перманентное удаление волос Ростов',
    'электроэпиляция Соколова 68',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: PAGE_URL,
    siteName: 'LUCOVICA',
    title: 'Электроэпиляция в Ростове-на-Дону — студия Lucovica',
    description: 'Перманентное удаление волос любого цвета — даже светлых и седых. Онлайн-запись.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Электроэпиляция LUCOVICA Ростов-на-Дону' }],
  },
  robots: { index: true, follow: true },
}

export default function ElectroEpilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
