import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const YM_ID = process.env.NEXT_PUBLIC_YM_ID ?? '00000000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LUCOVICA — студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону',
    template: '%s | LUCOVICA',
  },
  description:
    'Студия эпиляции LUCOVICA в центре Ростова-на-Дону. Лазерная эпиляция, шугаринг для женщин, мужчин и подростков. Опытные мастера, премиум-косметика, уютная атмосфера. Онлайн-запись.',
  keywords: [
    'лазерная эпиляция Ростов-на-Дону',
    'шугаринг Ростов-на-Дону центр',
    'мужская эпиляция Ростов',
    'студия эпиляции в центре',
    'эпиляция Ростов',
    'шугаринг центр Ростова',
    'депиляция Ростов-на-Дону',
    'эпиляция бикини Ростов',
    'LUCOVICA',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'LUCOVICA',
    title: 'LUCOVICA — студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону',
    description:
      'Лазерная эпиляция и шугаринг в центре Ростова-на-Дону. Запишитесь онлайн — первый визит со скидкой 20%!',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'LUCOVICA студия эпиляции' }],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
      name: 'LUCOVICA',
      description: 'Студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону',
      url: SITE_URL,
      telephone: '+79770169775',
      image: `${SITE_URL}/logo.png`,
      priceRange: '₽₽',
      currenciesAccepted: 'RUB',
      paymentAccepted: 'Cash, Credit Card',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'просп. Соколова, 68/118Вс1, этаж 1',
        addressLocality: 'Ростов-на-Дону',
        addressRegion: 'Ростовская область',
        postalCode: '344000',
        addressCountry: 'RU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '47.2226',
        longitude: '39.7189',
      },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '10:00', closes: '21:00' },
      ],
      sameAs: [],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Услуги студии LUCOVICA',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Лазерная эпиляция', description: 'Лазерная эпиляция всех зон для женщин и мужчин' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Шугаринг', description: 'Шугаринг — удаление волос сахарной пастой' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Электроэпиляция', description: 'Перманентное удаление волос электроэпиляцией' } },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL }],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={nunito.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}

        {/* Яндекс Метрика */}
        <Script id="ym-init" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${YM_ID}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YM_ID}`}
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  )
}
