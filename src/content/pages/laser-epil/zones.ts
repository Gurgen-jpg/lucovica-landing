// Зоны лазерной эпиляции (../landing/src/components/laser-epil/LaserEpilZones.tsx).
// Цена «от N ₽» берётся из прайса по priceRef; priceRef только при точном совпадении названия.
// Зоны без priceRef выводятся без цены — сопоставление с прайсом решает владелец (design.md D3).
import type { Zone } from '../../../sections/service/sections.ts'

const women = (item: string) => ({ category: 'laser-women', item })
const men = (item: string) => ({ category: 'laser-men', item })

export const ZONES_WOMEN: readonly Zone[] = [
  { name: 'Ноги полностью', priceRef: women('Ноги полностью'), popular: true },
  { name: 'Глубокое бикини', priceRef: women('Глубокое бикини'), popular: true },
  { name: 'Подмышки', priceRef: women('Подмышки'), popular: true },
  { name: 'Руки полностью', priceRef: women('Руки полностью') },
  { name: 'Классическое бикини', priceRef: women('Классическое бикини') },
  { name: 'Голени / Бёдра', priceRef: women('Голени / Бёдра') },
  { name: 'Спина + поясница', priceRef: women('Спина + поясница') },
  { name: 'Живот', priceRef: women('Живот') },
  { name: 'Ягодицы', priceRef: women('Ягодицы') },
  { name: 'Верхняя губа', priceRef: women('Верхняя губа') },
  { name: 'Плечи', priceRef: women('Плечи') },
  { name: 'Зоны мини', priceRef: women('Зоны мини') },
]

export const ZONES_MEN: readonly Zone[] = [
  // В прайсе «Спина» (2 790 ₽); старая страница показывала «от 4 990 ₽» — ждёт сверки владельцем
  { name: 'Спина полностью', popular: true },
  { name: 'Грудь', priceRef: men('Грудь'), popular: true },
  { name: 'Подмышки', priceRef: men('Подмышки'), popular: true },
  { name: 'Плечи + руки' },
  { name: 'Шея' },
  { name: 'Живот' },
  { name: 'Ягодицы' },
  { name: 'Ноги полностью', priceRef: men('Ноги полностью') },
  { name: 'Борода / Усы' },
  { name: 'Зоны мини' },
]
