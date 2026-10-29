// Единственный источник контактов и настроек студии.
// Секреты и параметры окружения — не здесь (см. src/config.ts).

export const site = {
  name: 'LUCOVICA',
  legalTagline: 'Студия эпиляции LUCOVICA',
  foundedYear: 2014,

  phone: {
    display: '+7 977 016-97-75',
    e164: '+79770169775',
  },

  address: {
    street: 'просп. Соколова, 68/118Вс1, этаж 1',
    short: 'Просп. Соколова, 68',
    city: 'Ростов-на-Дону',
    region: 'Ростовская область',
    postalCode: '344000',
    country: 'RU',
  },

  // Координаты организации на Яндекс Картах (совпадают с виджетом карты старого сайта)
  geo: { lat: 47.231276, lon: 39.71839 },

  hours: {
    label: 'Ежедневно, 10:00 — 21:00',
    short: '10:00 — 21:00',
    opens: '10:00',
    closes: '21:00',
  },

  telegram: {
    username: 'lucovica_pro_epil',
  },

  yandexMaps: {
    orgId: '72594546932',
    rating: 5.0,
    reviewCount: 500,
  },

  // Пустая строка — промо-плашка и галочка акции не выводятся
  promo: 'Первый визит — подмышки бесплатно',
} as const

export const links = {
  tel: `tel:${site.phone.e164}`,
  telegram: `https://t.me/${site.telegram.username}`,
  whatsapp: `https://wa.me/${site.phone.e164.slice(1)}`,
  yandexOrg: `https://yandex.ru/maps/org/lucovica/${site.yandexMaps.orgId}/`,
  yandexReviews: `https://yandex.ru/maps/org/lucovica/${site.yandexMaps.orgId}/reviews/`,
  yandexRoute: `https://yandex.ru/maps/?rtext=~${site.geo.lat},${site.geo.lon}&rtt=auto`,
} as const

export type Site = typeof site
