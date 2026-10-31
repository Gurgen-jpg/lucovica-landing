import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const PAGE_URL = `${SITE_URL}/sugaring`

export const metadata: Metadata = {
  title: 'Шугаринг в Ростове-на-Дону — студия Lucovica',
  description:
    'Шугаринг сахарной пастой в Ростове-на-Дону. Натуральный состав, бережно для чувствительной кожи, минимум вросших волос. Все зоны для женщин, мужчин и подростков. Цены, отзывы, онлайн-запись — студия Lucovica, просп. Соколова 68.',
  keywords: [
    'шугаринг Ростов-на-Дону',
    'шугаринг Ростов',
    'шугаринг центр Ростова',
    'шугаринг бикини Ростов',
    'шугаринг цена Ростов',
    'сахарная депиляция Ростов',
    'мужской шугаринг Ростов',
    'шугаринг Соколова 68',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: PAGE_URL,
    siteName: 'LUCOVICA',
    title: 'Шугаринг в Ростове-на-Дону — студия Lucovica',
    description: 'Натуральная сахарная паста. Бережно для кожи, минимум вросших волос. Онлайн-запись.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Шугаринг LUCOVICA Ростов-на-Дону' }],
  },
  robots: { index: true, follow: true },
}

export default function SugaringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
