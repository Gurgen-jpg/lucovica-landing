// /price — короткий прайс популярных зон для ссылок из Telegram (перенесено из ../landing/src/components/price/price-list.config.ts).
// Здесь только ссылки на позиции; цены берутся из services.ts.
import { categoryById, ELECTRO_PRICES, type BookingService, type ServiceItem } from './services.ts'

export type Audience = 'women' | 'men'

export interface PriceCardDef {
  id: string
  title: string
  audience: Audience
  bookingService: BookingService
  rows: ServiceItem[]
}

type Pick = [categoryId: string, name: string]

const lw = (n: string): Pick => ['laser-women', n]
const lwc = (n: string): Pick => ['laser-complexes-women', n]
const lm = (n: string): Pick => ['laser-men', n]
const lmc = (n: string): Pick => ['laser-complexes-men', n]
const sw = (n: string): Pick => ['sugaring-women', n]
const sm = (n: string): Pick => ['sugaring-men', n]

const GROUPS: { id: string; title: string; audience: Audience; bookingService: BookingService; picks: Pick[] }[] = [
  {
    id: 'laser-women',
    title: 'Лазерная эпиляция',
    audience: 'women',
    bookingService: 'Лазерная эпиляция — Девушки',
    picks: [
      lw('Подмышки'),
      lw('Верхняя губа'),
      lw('Классическое бикини'),
      lw('Голени / Бёдра'),
      lw('Глубокое бикини'),
      lw('Руки полностью'),
      lw('Ноги полностью'),
      lwc('Подмышки + Глубокое бикини'),
      lwc('Бикини + Подмышки + Ноги'),
      lwc('Всё тело'),
    ],
  },
  {
    id: 'sugaring-women',
    title: 'Шугаринг',
    audience: 'women',
    bookingService: 'Шугаринг — Девушки',
    picks: [
      sw('Верхняя губа'),
      sw('Подмышки'),
      sw('Лицо полностью'),
      sw('Классическое бикини'),
      sw('Голени / Бёдра'),
      sw('Руки полностью'),
      sw('Спина полностью'),
      sw('Глубокое бикини'),
      sw('Ноги полностью'),
    ],
  },
  {
    id: 'laser-men',
    title: 'Лазерная эпиляция',
    audience: 'men',
    bookingService: 'Мужская лазерная эпиляция',
    picks: [
      lm('Подмышки'),
      lm('Спина'),
      lm('Грудь'),
      lm('Лицо полностью'),
      lm('Глубокое бикини'),
      lm('Руки полностью'),
      lm('Ноги полностью'),
      lmc('Подмышки + Спина'),
      lmc('Бикини + Подмышки + Ноги'),
      lmc('Всё тело'),
    ],
  },
  {
    id: 'sugaring-men',
    title: 'Шугаринг',
    audience: 'men',
    bookingService: 'Мужской шугаринг',
    picks: [
      sm('Подмышки'),
      sm('Борода (оформление)'),
      sm('Грудь'),
      sm('Спина полностью'),
      sm('Руки полностью'),
      sm('Ноги полностью'),
      sm('Глубокое бикини'),
    ],
  },
]

function resolve([categoryId, name]: Pick): ServiceItem {
  const item = categoryById(categoryId).items.find((i) => i.name === name)
  if (!item) throw new Error(`/price: позиция «${name}» не найдена в категории «${categoryId}»`)
  return item
}

/** Карточки прайса; позиции по возрастанию цены. Бросает ошибку, если позиции нет в прайсе. */
export function priceCards(): PriceCardDef[] {
  return GROUPS.map(({ picks, ...g }) => ({ ...g, rows: picks.map(resolve).sort((a, b) => a.price - b.price) }))
}

export const ELECTRO_CARD = {
  title: 'Электроэпиляция',
  note: 'Для девушек и мужчин · цена за время работы',
  bookingService: 'Электроэпиляция' as BookingService,
  rows: [...ELECTRO_PRICES].sort((a, b) => a.price - b.price),
}

export function minPriceOnPage(): number {
  return Math.min(...priceCards().flatMap((g) => g.rows.map((r) => r.price)), ...ELECTRO_CARD.rows.map((r) => r.price))
}
