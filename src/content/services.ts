// Единственный источник цен (перенесено из ../landing/src/lib/services-data.ts).
// «от N ₽», вкладки прайса, JSON-LD и предвыбор услуги в форме вычисляются отсюда.

export type ServiceItem = {
  name: string
  price: number
  short: string
}

export type PriceGroup = 'laser' | 'sugaring' | 'complex' | 'electro'

export type ServiceCategory = {
  id: string
  title: string
  /** Вкладка прайса на главной */
  group: Exclude<PriceGroup, 'electro'>
  /** Подпись подгруппы внутри вкладки */
  audience: string
  /** Точное значение из SERVICE_NAMES_FOR_FORM — предвыбор услуги в форме записи */
  bookingService: BookingService
  items: ServiceItem[]
}

export const SERVICES: readonly ServiceCategory[] = [
  {
    id: 'laser-women',
    title: 'Лазерная эпиляция — Девушки',
    group: 'laser',
    audience: 'Девушки',
    bookingService: 'Лазерная эпиляция — Девушки',
    items: [
      { name: 'Ноги полностью', price: 4490, short: 'Гладкая кожа от бедра до стопы' },
      { name: 'Глубокое бикини', price: 3290, short: 'Деликатная зона — профессионально и бережно' },
      { name: 'Руки полностью', price: 3290, short: 'Полное удаление волос с обеих рук' },
      { name: 'Спина + поясница', price: 2990, short: 'Комфортная обработка спины' },
      { name: 'Голени / Бёдра', price: 2790, short: 'На выбор — одна или обе зоны' },
      { name: 'Подмышки', price: 1690, short: 'Быстро, безболезненно, надолго' },
      { name: 'Классическое бикини', price: 2190, short: 'Аккуратная зона бикини' },
      { name: 'Ягодицы', price: 2190, short: 'Деликатная обработка' },
      { name: 'Живот', price: 2190, short: 'Полная обработка зоны живота' },
      { name: 'Верхняя губа', price: 990, short: 'Нежная зона лица — без следов' },
      { name: 'Зоны мини', price: 1490, short: 'Пальцы, межбровье, линия роста волос' },
      { name: 'Плечи', price: 1990, short: 'Область плеча' },
    ],
  },
  {
    id: 'laser-complexes-women',
    title: 'Комплексы лазерной эпиляции — Девушки',
    group: 'complex',
    audience: 'Девушки',
    bookingService: 'Комплекс лазерной эпиляции — Девушки',
    items: [
      { name: 'Всё тело', price: 13990, short: 'Максимальный результат — все зоны сразу' },
      { name: 'Бикини + Подмышки + Ноги + Руки', price: 8790, short: 'Популярный полный комплекс' },
      { name: 'Бикини + Подмышки + Ноги', price: 6590, short: 'Летний must-have комплекс' },
      { name: 'Бикини + Ноги', price: 6390, short: 'Идеально к пляжному сезону' },
      { name: 'Подмышки + Ноги', price: 5890, short: 'Самые популярные зоны' },
      { name: 'Бикини + Подмышки + Голени', price: 4590, short: 'Эффективный комплекс' },
      { name: 'Подмышки + Глубокое бикини', price: 3690, short: 'Деликатный комплекс' },
    ],
  },
  {
    id: 'sugaring-women',
    title: 'Шугаринг — Девушки',
    group: 'sugaring',
    audience: 'Девушки',
    bookingService: 'Шугаринг — Девушки',
    items: [
      { name: 'Ноги полностью', price: 1600, short: 'Мягкое удаление сахарной пастой' },
      { name: 'Глубокое бикини', price: 1500, short: 'Деликатно и гигиенично' },
      { name: 'Спина полностью', price: 1200, short: 'Полная обработка спины' },
      { name: 'Руки полностью', price: 1100, short: 'От плеча до кончиков пальцев' },
      { name: 'Лицо полностью', price: 900, short: 'Нежное удаление пушка' },
      { name: 'Голени / Бёдра', price: 900, short: 'На выбор — одна зона' },
      { name: 'Классическое бикини', price: 900, short: 'Классическое оформление' },
      { name: 'Подмышки', price: 600, short: 'Быстро и мягко' },
      { name: 'Верхняя губа', price: 300, short: 'Самая деликатная зона лица' },
    ],
  },
  {
    id: 'sugaring-master',
    title: 'Шугаринг — Мастер Екатерина (руководитель)',
    group: 'sugaring',
    audience: 'Мастер Екатерина (руководитель)',
    bookingService: 'Шугаринг у мастера Екатерины',
    items: [
      { name: 'Глубокое бикини', price: 2200, short: 'Высший уровень деликатной работы' },
      { name: 'Ноги полностью', price: 2500, short: 'Максимальный комфорт процедуры' },
      { name: 'Классическое бикини', price: 1100, short: 'Идеальный результат' },
      { name: 'Руки полностью', price: 1800, short: 'Опытная работа' },
      { name: 'Лицо полностью', price: 1600, short: 'Нежная обработка лица' },
      { name: 'Голени / Бёдра', price: 1300, short: 'Профессионально' },
      { name: 'Подмышки', price: 600, short: 'Бережно и быстро' },
    ],
  },
  {
    id: 'sugaring-teen',
    title: 'Шугаринг — Юные леди (до 15 лет)',
    group: 'sugaring',
    audience: 'Юные леди (до 15 лет)',
    bookingService: 'Шугаринг — Юные леди',
    items: [
      { name: 'Ноги полностью', price: 1200, short: 'Щадящий шугаринг для подростков' },
      { name: 'Подмышки', price: 300, short: 'Мягкая паста для нежной кожи' },
      { name: 'Голени / Бёдра', price: 700, short: 'Бережная обработка' },
      { name: 'Верхняя губа', price: 300, short: 'Деликатно для молодой кожи' },
      { name: 'Классическое бикини', price: 900, short: 'С согласия родителей' },
    ],
  },
  {
    id: 'sugaring-men',
    title: 'Мужской шугаринг',
    group: 'sugaring',
    audience: 'Мужчины',
    bookingService: 'Мужской шугаринг',
    items: [
      { name: 'Глубокое бикини', price: 2900, short: 'Профессиональная деликатная зона' },
      { name: 'Ноги полностью', price: 2000, short: 'Полное удаление с ног' },
      { name: 'Руки полностью', price: 1800, short: 'Полная обработка рук' },
      { name: 'Спина полностью', price: 1300, short: 'Широкие зоны спины' },
      { name: 'Грудь', price: 900, short: 'Чёткий рельеф без лишней растительности' },
      { name: 'Подмышки', price: 600, short: 'Гигиенично и быстро' },
      { name: 'Борода (оформление)', price: 600, short: 'Чёткие контуры бороды' },
    ],
  },
  {
    id: 'laser-men',
    title: 'Мужская лазерная эпиляция',
    group: 'laser',
    audience: 'Мужчины',
    bookingService: 'Мужская лазерная эпиляция',
    items: [
      { name: 'Ноги полностью', price: 5990, short: 'Полное устранение волос с ног' },
      { name: 'Глубокое бикини', price: 4290, short: 'Профессионально, деликатно' },
      { name: 'Руки полностью', price: 4190, short: 'Руки от плеча до кончиков пальцев' },
      { name: 'Спина', price: 2790, short: 'Рельефная спина без лишних волос' },
      { name: 'Грудь', price: 2790, short: 'Чёткий мужской рельеф' },
      { name: 'Подмышки', price: 2190, short: 'Гигиеничный результат' },
      { name: 'Лицо полностью', price: 2990, short: 'Чёткие контуры лица' },
    ],
  },
  {
    id: 'laser-complexes-men',
    title: 'Комплексы лазерной эпиляции — Мужчины',
    group: 'complex',
    audience: 'Мужчины',
    bookingService: 'Комплекс лазерной эпиляции — Мужчины',
    items: [
      { name: 'Всё тело', price: 17990, short: 'Полный комплекс для мужчин' },
      { name: 'Бикини + Подмышки + Ноги + Руки', price: 11890, short: 'Максимальный мужской комплекс' },
      { name: 'Бикини + Подмышки + Ноги', price: 9790, short: 'Популярный мужской комплекс' },
      { name: 'Подмышки + Спина', price: 4590, short: 'Эффективный комплекс для мужчин' },
    ],
  },
]

export const ELECTRO_PRICES: readonly ServiceItem[] = [
  { name: '15 минут', short: 'Единичные волоски, небольшая зона', price: 700 },
  { name: '30 минут', short: 'Верхняя губа, подбородок, брови', price: 1200 },
  { name: '45 минут', short: 'Коррекция после лазера', price: 1700 },
  { name: '60 минут', short: 'Большая зона или несколько участков', price: 2200 },
]

export const CERTIFICATES: readonly { amount: number; desc: string }[] = [
  { amount: 500, desc: 'Небольшой, но приятный старт' },
  { amount: 1000, desc: 'На одну-две зоны шугаринга' },
  { amount: 2000, desc: 'На комплекс или несколько зон' },
  { amount: 3000, desc: 'Полноценный подарок красоты' },
]

export const SERVICE_NAMES_FOR_FORM = [
  'Лазерная эпиляция — Девушки',
  'Комплекс лазерной эпиляции — Девушки',
  'Шугаринг — Девушки',
  'Шугаринг у мастера Екатерины',
  'Шугаринг — Юные леди',
  'Мужской шугаринг',
  'Мужская лазерная эпиляция',
  'Комплекс лазерной эпиляции — Мужчины',
  'Электроэпиляция',
  'Подарочный сертификат',
  'Другое',
] as const

export type BookingService = (typeof SERVICE_NAMES_FOR_FORM)[number]

export interface PriceTab {
  group: PriceGroup
  label: string
  /** Услуга формы для кнопки записи, когда в группе одна подгруппа или подгруппа не выбрана */
  bookingService: BookingService
}

/** Вкладки прайса главной в порядке макета */
export const PRICE_TABS: readonly PriceTab[] = [
  { group: 'laser', label: 'Лазер', bookingService: 'Лазерная эпиляция — Девушки' },
  { group: 'sugaring', label: 'Шугаринг', bookingService: 'Шугаринг — Девушки' },
  { group: 'complex', label: 'Комплексы', bookingService: 'Комплекс лазерной эпиляции — Девушки' },
  { group: 'electro', label: 'Электро', bookingService: 'Электроэпиляция' },
]

/** Категории вкладки в порядке данных (подгруппы: «Девушки», «Мужчины», …). */
export function byGroup(group: Exclude<PriceGroup, 'electro'>): ServiceCategory[] {
  return SERVICES.filter((c) => c.group === group)
}

/** Минимальная цена группы — для «от N ₽»; для сертификата — минимальный номинал. */
export function minPrice(group: PriceGroup | 'cert'): number {
  const prices =
    group === 'cert' ? CERTIFICATES.map((c) => c.amount)
    : group === 'electro' ? ELECTRO_PRICES.map((i) => i.price)
    : byGroup(group).flatMap((c) => c.items.map((i) => i.price))
  if (!prices.length) throw new Error(`Нет цен для группы ${group}`)
  return Math.min(...prices)
}
