import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const PAGE_URL = `${SITE_URL}/laser-epil`

export const metadata: Metadata = {
  title: 'Лазерная эпиляция в Ростове-на-Дону — студия Lucovica',
  description:
    'Лазерная эпиляция на диодном лазере в Ростове-на-Дону. Результат с первой процедуры. Все зоны: бикини, ноги, подмышки, лицо. Цены, отзывы, онлайн-запись — студия Lucovica, просп. Соколова 68.',
  keywords: [
    'лазерная эпиляция Ростов-на-Дону',
    'лазерная эпиляция Ростов',
    'диодный лазер эпиляция Ростов',
    'лазерная эпиляция бикини Ростов',
    'лазерная эпиляция цена Ростов',
    'студия лазерной эпиляции Ростов-на-Дону',
    'лазерная эпиляция Кировский район Ростов',
    'лазерная эпиляция Соколова 68',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: PAGE_URL,
    siteName: 'LUCOVICA',
    title: 'Лазерная эпиляция в Ростове-на-Дону — студия Lucovica',
    description:
      'Диодный лазер. Результат с первой процедуры. Все зоны — бикини, ноги, подмышки. Онлайн-запись.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Лазерная эпиляция LUCOVICA Ростов-на-Дону' }],
  },
  robots: { index: true, follow: true },
}

export default function LaserEpilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
