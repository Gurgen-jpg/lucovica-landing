import { SERVICES, ELECTRO_PRICES, type ServiceCategory } from '@/lib/services-data'

export type Audience = 'women' | 'men'

export type PriceRow = { name: string; price: number }

export type PriceGroup = {
  id: string
  title: string
  audience: Audience
  /** Значение из SERVICE_NAMES_FOR_FORM — предвыбор услуги в LeadForm */
  formService: string
  rows: PriceRow[]
}

type Pick = { categoryId: string; name: string }

type GroupConfig = Omit<PriceGroup, 'rows'> & { picks: Pick[] }

export const MAX_ROWS = 10

const lw = (name: string): Pick => ({ categoryId: 'laser-women', name })
const lwc = (name: string): Pick => ({ categoryId: 'laser-complexes-women', name })
const lm = (name: string): Pick => ({ categoryId: 'laser-men', name })
const lmc = (name: string): Pick => ({ categoryId: 'laser-complexes-men', name })
const sw = (name: string): Pick => ({ categoryId: 'sugaring-women', name })
const sm = (name: string): Pick => ({ categoryId: 'sugaring-men', name })

/** Популярные позиции. Цены не хранятся здесь — только ссылки на services-data. */
export const PRICE_GROUPS: GroupConfig[] = [
  {
    id: 'laser-women',
    title: 'Лазерная эпиляция',
    audience: 'women',
    formService: 'Лазерная эпиляция — Девушки',
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
    formService: 'Шугаринг — Девушки',
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
    formService: 'Мужская лазерная эпиляция',
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
    formService: 'Мужской шугаринг',
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

export const ELECTRO_FORM_SERVICE = 'Электроэпиляция'

function resolve(pick: Pick, services: ServiceCategory[]): PriceRow {
  const item = services
    .find((c) => c.id === pick.categoryId)
    ?.items.find((i) => i.name === pick.name)
  if (!item) {
    throw new Error(`price-list: позиция «${pick.name}» не найдена в категории «${pick.categoryId}»`)
  }
  return { name: item.name, price: item.price }
}

/** Резолвит выбранные позиции в цены из services-data; бросает ошибку, если позиции нет. */
export function buildPriceList(
  groups: GroupConfig[] = PRICE_GROUPS,
  services: ServiceCategory[] = SERVICES,
): PriceGroup[] {
  return groups.map(({ picks, ...group }) => ({
    ...group,
    rows: picks.map((p) => resolve(p, services)).sort((a, b) => a.price - b.price),
  }))
}

export function buildElectroList(): PriceRow[] {
  return ELECTRO_PRICES.map(({ name, price }) => ({ name, price })).sort((a, b) => a.price - b.price)
}

export function minPrice(groups: PriceGroup[], electro: PriceRow[]): number {
  return Math.min(...groups.flatMap((g) => g.rows.map((r) => r.price)), ...electro.map((r) => r.price))
}
