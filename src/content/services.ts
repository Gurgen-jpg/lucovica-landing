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

// Цены — по прайсам студии (01.11.2026). Шугаринг сейчас ведёт только руководитель студии,
// поэтому в «Шугаринг — Девушки» её цены; отдельно на сайте это не подчёркиваем.
export const SERVICES: readonly ServiceCategory[] = [
  {
    id: 'laser-women',
    title: 'Лазерная эпиляция — Девушки',
    group: 'laser',
    audience: 'Девушки',
    bookingService: 'Лазерная эпиляция — Девушки',
    items: [
      { name: 'Подмышки', price: 1690, short: 'Быстро, безболезненно, надолго' },
      { name: 'Руки до / после локтя', price: 2190, short: 'Предплечья или плечи на выбор' },
      { name: 'Руки полностью', price: 3290, short: 'Полное удаление волос с обеих рук' },
      { name: 'Грудь', price: 2190, short: 'Деликатная обработка зоны груди' },
      { name: 'Плечи', price: 2190, short: 'Область плеча' },
      { name: 'Живот', price: 2190, short: 'Полная обработка зоны живота' },
      { name: 'Поясница', price: 1990, short: 'Нижняя часть спины' },
      { name: 'Спина + поясница', price: 2990, short: 'Комфортная обработка спины' },
      { name: 'Классическое бикини', price: 2190, short: 'Аккуратная зона бикини' },
      { name: 'Глубокое бикини', price: 3290, short: 'Деликатная зона — профессионально и бережно' },
      { name: 'Ягодицы', price: 2190, short: 'Деликатная обработка' },
      { name: 'Голени / Бёдра', price: 2790, short: 'На выбор — одна или обе зоны' },
      { name: 'Ноги полностью', price: 4490, short: 'Гладкая кожа от бедра до стопы' },
      { name: 'Зоны мини', price: 1490, short: 'Пальцы, межбровье, линия роста волос' },
    ],
  },
  {
    id: 'laser-complexes-women',
    title: 'Комплексы лазерной эпиляции — Девушки',
    group: 'complex',
    audience: 'Девушки',
    bookingService: 'Комплекс лазерной эпиляции — Девушки',
    items: [
      { name: 'Подмышки + Голени', price: 3990, short: 'Лёгкий летний комплекс' },
      { name: 'Подмышки + Глубокое бикини', price: 3690, short: 'Деликатный комплекс' },
      { name: 'Подмышки + Ноги', price: 5890, short: 'Самые популярные зоны' },
      { name: 'Глубокое бикини + Голени', price: 4390, short: 'Бикини и голени за один визит' },
      { name: 'Глубокое бикини + Подмышки + Голени', price: 4590, short: 'Эффективный комплекс' },
      { name: 'Глубокое бикини + Ноги полностью', price: 6390, short: 'Идеально к пляжному сезону' },
      { name: 'Глубокое бикини + Подмышки + Ноги полностью', price: 6590, short: 'Летний must-have комплекс' },
      { name: 'Глубокое бикини + Подмышки + Голени + Руки до локтя', price: 6790, short: 'Четыре зоны по выгодной цене' },
      { name: 'Глубокое бикини + Подмышки + Ноги + Руки', price: 8790, short: 'Популярный полный комплекс' },
      { name: 'Всё тело', price: 13990, short: 'Максимальный результат — все зоны сразу' },
    ],
  },
  {
    id: 'sugaring-women',
    title: 'Шугаринг — Девушки',
    group: 'sugaring',
    audience: 'Девушки',
    bookingService: 'Шугаринг — Девушки',
    items: [
      { name: 'Подмышки', price: 600, short: 'Быстро и мягко' },
      { name: 'Руки до локтя', price: 1100, short: 'Предплечья — бережно и быстро' },
      { name: 'Руки полностью', price: 1600, short: 'От плеча до кончиков пальцев' },
      { name: 'Живот', price: 1300, short: 'Мягкое удаление сахарной пастой' },
      { name: 'Поясница', price: 1300, short: 'Нижняя часть спины' },
      { name: 'Ягодицы', price: 1300, short: 'Деликатная обработка' },
      { name: 'Спина полностью', price: 1800, short: 'Полная обработка спины' },
      { name: 'Классическое бикини', price: 1800, short: 'Классическое оформление' },
      { name: 'Глубокое бикини', price: 2200, short: 'Деликатно и гигиенично' },
      { name: 'Голени / Бёдра', price: 1300, short: 'На выбор — одна зона' },
      { name: 'Ноги полностью', price: 2500, short: 'Мягкое удаление сахарной пастой' },
      { name: 'Лицо — одна зона', price: 400, short: 'Усики, бакенбарды, подбородок или щёки' },
      { name: 'Лицо полностью', price: 1500, short: 'Нежное удаление пушка' },
    ],
  },
  {
    id: 'sugaring-teen',
    title: 'Шугаринг — Юные леди (до 15 лет)',
    group: 'sugaring',
    audience: 'Юные леди (до 15 лет)',
    bookingService: 'Шугаринг — Юные леди',
    items: [
      { name: 'Подмышки', price: 300, short: 'Мягкая паста для нежной кожи' },
      { name: 'Руки до локтя', price: 700, short: 'Бережно для молодой кожи' },
      { name: 'Руки полностью', price: 900, short: 'Кисти и пальчики — в подарок' },
      { name: 'Живот', price: 700, short: 'Щадящая обработка' },
      { name: 'Поясница', price: 700, short: 'Щадящая обработка' },
      { name: 'Ягодицы', price: 700, short: 'Деликатно' },
      { name: 'Спина полностью', price: 1100, short: 'Полная обработка спины' },
      { name: 'Классическое бикини', price: 900, short: 'С согласия родителей' },
      { name: 'Глубокое бикини', price: 1200, short: 'С согласия родителей' },
      { name: 'Голени / Бёдра', price: 700, short: 'Бережная обработка' },
      { name: 'Ноги полностью', price: 1200, short: 'Щадящий шугаринг для подростков' },
      { name: 'Лицо — одна зона', price: 300, short: 'Деликатно для молодой кожи' },
      { name: 'Лицо полностью', price: 700, short: 'Нежное удаление пушка' },
    ],
  },
  {
    id: 'sugaring-men',
    title: 'Мужской шугаринг',
    group: 'sugaring',
    audience: 'Мужчины',
    bookingService: 'Мужской шугаринг',
    items: [
      { name: 'Подмышки', price: 600, short: 'Гигиенично и быстро' },
      { name: 'Руки до / после локтя', price: 1300, short: 'Предплечья или плечи на выбор' },
      { name: 'Руки полностью', price: 1800, short: 'Полная обработка рук' },
      { name: 'Грудь', price: 900, short: 'Чёткий рельеф без лишней растительности' },
      { name: 'Плечи', price: 600, short: 'Аккуратная линия плеч' },
      { name: 'Живот', price: 900, short: 'Полная обработка живота' },
      { name: 'Спина верх / поясница', price: 900, short: 'Одна из зон спины' },
      { name: 'Спина полностью', price: 1300, short: 'Широкие зоны спины' },
      { name: 'Глубокое бикини', price: 2900, short: 'С межъягодичной зоной' },
      { name: 'Ягодицы', price: 900, short: 'Деликатная обработка' },
      { name: 'Голени / Бёдра', price: 1300, short: 'На выбор — одна зона' },
      { name: 'Ноги полностью', price: 2000, short: 'Полное удаление с ног' },
      { name: 'Нос / уши / брови', price: 350, short: 'Аккуратно и быстро' },
      { name: 'Оформление бороды', price: 600, short: 'Чёткие контуры бороды' },
    ],
  },
  {
    id: 'laser-men',
    title: 'Мужская лазерная эпиляция',
    group: 'laser',
    audience: 'Мужчины',
    bookingService: 'Мужская лазерная эпиляция',
    items: [
      { name: 'Подмышки', price: 2190, short: 'Гигиеничный результат' },
      { name: 'Руки до / после локтя', price: 2690, short: 'Предплечья или плечи на выбор' },
      { name: 'Руки полностью', price: 4190, short: 'Руки от плеча до кончиков пальцев' },
      { name: 'Шея полностью', price: 2490, short: 'Чистая линия шеи' },
      { name: 'Грудь', price: 2790, short: 'Чёткий мужской рельеф' },
      { name: 'Плечи', price: 2490, short: 'Область плеч' },
      { name: 'Живот', price: 2790, short: 'Полная обработка живота' },
      { name: 'Поясница', price: 2490, short: 'Нижняя часть спины' },
      { name: 'Спина', price: 2790, short: 'Рельефная спина без лишних волос' },
      { name: 'Глубокое бикини', price: 4290, short: 'Профессионально, деликатно' },
      { name: 'Межъягодичная зона', price: 1590, short: 'Деликатная зона' },
      { name: 'Голени / Бёдра', price: 3590, short: 'На выбор — одна зона' },
      { name: 'Ноги полностью', price: 5990, short: 'Полное устранение волос с ног' },
      { name: 'Лицо полностью', price: 2990, short: 'Чёткие контуры лица' },
      { name: 'Зоны мини', price: 1790, short: 'Пальцы, межбровье, уши, нос' },
    ],
  },
  {
    id: 'laser-complexes-men',
    title: 'Комплексы лазерной эпиляции — Мужчины',
    group: 'complex',
    audience: 'Мужчины',
    bookingService: 'Комплекс лазерной эпиляции — Мужчины',
    items: [
      { name: 'Подмышки + Ноги', price: 8190, short: 'Самые популярные зоны' },
      { name: 'Подмышки + Спина', price: 4590, short: 'Эффективный комплекс для мужчин' },
      { name: 'Глубокое бикини + Подмышки', price: 5990, short: 'Деликатный комплекс' },
      { name: 'Глубокое бикини + Ноги', price: 8290, short: 'Бикини и ноги за один визит' },
      { name: 'Глубокое бикини + Живот', price: 6590, short: 'Бикини и живот за один визит' },
      { name: 'Глубокое бикини + Подмышки + Ноги', price: 9790, short: 'Популярный мужской комплекс' },
      { name: 'Глубокое бикини + Подмышки + Ноги + Руки', price: 11890, short: 'Максимальный мужской комплекс' },
      { name: 'Всё тело', price: 17990, short: 'Полный комплекс для мужчин' },
    ],
  },
]

// Электроэпиляция — по времени работы: тело 40 ₽/мин, лицо 45 ₽/мин
const ELECTRO_MINUTES = [15, 30, 45, 60] as const

export interface ElectroGroup {
  key: 'body' | 'face'
  label: string
  /** Ставка за минуту, ₽ */
  rate: number
  items: readonly ServiceItem[]
}

const electro = (key: ElectroGroup['key'], label: string, rate: number, shorts: readonly string[]): ElectroGroup => ({
  key,
  label,
  rate,
  items: ELECTRO_MINUTES.map((m, i) => ({ name: `${m} минут`, short: shorts[i]!, price: m * rate })),
})

export const ELECTRO_GROUPS: readonly ElectroGroup[] = [
  electro('body', 'Тело', 40, [
    'Единичные волоски, небольшая зона',
    'Коррекция после лазера',
    'Зона среднего размера',
    'Большая зона или несколько участков',
  ]),
  electro('face', 'Лицо', 45, [
    'Единичные волоски',
    'Верхняя губа, подбородок, брови',
    'Несколько зон лица',
    'Лицо полностью',
  ]),
]

/** Все тарифы одним списком: «Тело, 15 минут» … «Лицо, 60 минут» */
export const ELECTRO_PRICES: readonly ServiceItem[] = ELECTRO_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, name: `${g.label}, ${i.name}` })),
)

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

export function categoryById(id: string): ServiceCategory {
  const c = SERVICES.find((s) => s.id === id)
  if (!c) throw new Error(`Категория прайса «${id}» не найдена`)
  return c
}

/** Позиция прайса по ссылке «категория + название»; undefined — нет такой позиции. */
export function priceOf(ref: { category: string; item: string }): number | undefined {
  return SERVICES.find((s) => s.id === ref.category)?.items.find((i) => i.name === ref.item)?.price
}

/** Офферы JSON-LD «<категория> — <позиция>» для страницы услуги (design.md D4 service-pages). */
export function offersFromCategories(ids: readonly string[]): { name: string; price: number }[] {
  return ids.flatMap((id) => {
    const c = categoryById(id)
    return c.items.map((i) => ({ name: `${c.title} — ${i.name}`, price: i.price }))
  })
}
