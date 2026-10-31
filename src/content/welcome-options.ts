// Опции анкет /welcome и /welcome/back — один источник подписей для формы и уведомлений (welcome-intake D1).
// Перенесено из ../landing/src/lib/{welcome-options,welcome-labels}.ts; подписи молока исправлены.

export interface WelcomeOption {
  id: string
  /** Подпись в уведомлении (и в форме, если нет formLabel) */
  label: string
  /** Подпись в форме, если отличается */
  formLabel?: string
  /** Критическое противопоказание — блок «⚠️ ФЛАГИ БЕЗОПАСНОСТИ» */
  critical?: boolean
}

export const DRINKS: readonly WelcomeOption[] = [
  { id: 'cappuccino', label: 'Капучино' },
  { id: 'americano', label: 'Американо' },
  { id: 'black_tea', label: 'Чай чёрный' },
  { id: 'green_tea', label: 'Чай зелёный' },
  { id: 'matcha', label: 'Матча' },
  { id: 'water', label: 'Просто воду' },
  { id: 'nothing', label: 'Ничего не нужно', formLabel: 'Спасибо, ничего не нужно' },
]

export const MILK_OPTIONS: readonly WelcomeOption[] = [
  { id: 'regular', label: 'Обычное' },
  { id: 'coconut', label: 'Кокосовое' },
  { id: 'banana', label: 'Банановое' },
  { id: 'almond', label: 'Миндальное' },
  { id: 'pistachio', label: 'Фисташковое' },
  { id: 'none', label: 'Без молока' },
]

/** Напитки с выбором молока */
export const MILK_TRIGGER: ReadonlySet<string> = new Set(['cappuccino', 'americano', 'matcha'])
/** Напитки с вопросами о сахаре и сливках */
export const COFFEE: ReadonlySet<string> = new Set(['cappuccino', 'americano'])

export const TALK_MODES: readonly WelcomeOption[] = [
  { id: 'chat', label: 'Поболтаем' },
  { id: 'silent', label: 'Тишина', formLabel: 'Тишина, я отдохну' },
  { id: 'any', label: 'Как пойдёт' },
]

export const KID_NEEDS: readonly WelcomeOption[] = [
  { id: 'cartoon', label: 'Мультик' },
  { id: 'coloring', label: 'Раскраски' },
  { id: 'drink', label: 'Напиток' },
  { id: 'nothing', label: 'Ничего не надо' },
]

export const SOURCES: readonly WelcomeOption[] = [
  { id: 'yandex_maps', label: 'Яндекс Карты' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'friend', label: 'Подруга' },
  { id: 'ads', label: 'Реклама' },
  { id: 'other', label: 'Другое' },
]

export const NO_CONTRAINDICATIONS = 'none'

export const CONTRAINDICATIONS: readonly WelcomeOption[] = [
  { id: 'pregnancy', label: 'Беременность', critical: true },
  { id: 'lactation', label: 'Период лактации', critical: true },
  { id: 'oncology', label: 'Онкология (текущая или в анамнезе)', critical: true },
  { id: 'diabetes', label: 'Сахарный диабет' },
  { id: 'epilepsy', label: 'Эпилепсия', critical: true },
  { id: 'antibiotics', label: 'Приём антибиотиков (последние 2 недели)' },
  { id: 'retinoids', label: 'Приём ретиноидов / Роаккутана (последние 6 месяцев)', critical: true },
  { id: 'photodermatitis', label: 'Фотодерматит / повышенная чувствительность к свету' },
  { id: 'infection', label: 'Острые инфекции, ОРВИ, температура' },
]

/** Новый гость: + «Ничего из перечисленного» (взаимоисключающий пункт) */
export const CONTRAINDICATIONS_NEW: readonly WelcomeOption[] = [
  ...CONTRAINDICATIONS,
  { id: NO_CONTRAINDICATIONS, label: 'Ничего из перечисленного' },
]

/** Подпись опции по id; неизвестное значение возвращается как есть. */
export function labelOf(options: readonly WelcomeOption[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id
}

export const isCritical = (id: string): boolean => CONTRAINDICATIONS.some((c) => c.id === id && c.critical)
