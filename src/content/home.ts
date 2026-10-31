// Тексты секций главной (структура и формулировки — макет v2).
import { formatPrice } from '../lib/format.ts'
import { CERTIFICATES, type PriceGroup } from './services.ts'

const certAmounts = CERTIFICATES.map((c) => c.amount)

export const HERO = {
  overline: 'Студия эпиляции · центр Ростова-на-Дону',
  title: 'Лазерная эпиляция и шугаринг',
  accent: 'и шугаринг',
  lead: 'Гладкая кожа с первой процедуры. Опытные мастера, сертифицированное оборудование, стерильность и тишина — всё ради вашего спокойствия.',
  photo: { name: 'hero', alt: 'Ресепшн студии LUCOVICA: стена из фактурной штукатурки, подвесные светильники' },
} as const

export const PHILOSOPHY = {
  quote: 'Каждый визит — не просто процедура, а маленький ритуал заботы о себе.',
  caption: 'Философия LUCOVICA',
} as const

export interface ServiceCard {
  title: string
  description: string
  href: string
  /** Группа цен для «от N ₽» */
  priceFrom: PriceGroup | 'cert'
}

export const SERVICE_CARDS: readonly ServiceCard[] = [
  { title: 'Лазерная эпиляция', description: 'Диодный лазер с охлаждением. Стойкий результат для женщин и мужчин.', href: '/laser-epil', priceFrom: 'laser' },
  { title: 'Шугаринг', description: 'Натуральная сахарная паста. Гипоаллергенно, подходит подросткам.', href: '/sugaring', priceFrom: 'sugaring' },
  { title: 'Электроэпиляция', description: 'Перманентное удаление каждого волоска — лицо и тело.', href: '/electro-epil', priceFrom: 'electro' },
  { title: 'Комплексы', description: 'Наборы зон за один визит — до 30% выгоднее отдельных процедур.', href: '/complex', priceFrom: 'complex' },
  { title: 'Подарочный сертификат', description: `На любую услугу студии — номиналом от ${formatPrice(Math.min(...certAmounts))} до ${formatPrice(Math.max(...certAmounts))} ₽.`, href: '/cert', priceFrom: 'cert' },
]

export const SECTIONS = {
  services: { overline: 'Что мы делаем', title: 'Услуги студии', description: 'Для женщин, мужчин и подростков. Каждая процедура — по стандартам медицинской асептики.' },
  prices: { overline: 'Прайс', title: 'Цены без звёздочек', accent: 'без звёздочек', description: 'Стоимость указана за одну процедуру. Консультация перед первым визитом — бесплатно.' },
  ritual: { overline: 'Как проходит визит', title: 'Ритуал в четыре шага', accent: 'четыре' },
  masters: { overline: 'Мастера', title: 'Руки, которым доверяют', accent: 'которым доверяют' },
  reviews: { overline: 'Отзывы гостей' },
  faq: { overline: 'Вопросы и ответы', title: 'Часто спрашивают', accent: 'спрашивают' },
  contacts: { overline: 'Контакты', title: 'Ждём вас в центре Ростова', accent: 'в центре' },
} as const
