// Опции анкет /welcome и /welcome/back — один источник подписей для формы и уведомлений (welcome-intake D1).
// Подписи формы (formLabel/formNote) — по docs/welcome-texts.md (welcome-redesign D1); label уведомлений не меняются.

export interface WelcomeOption {
  id: string
  /** Подпись в уведомлении (и в форме, если нет formLabel) */
  label: string
  /** Подпись в форме, если отличается */
  formLabel?: string
  /** Мелкая подпись под вариантом в форме (уточнение срока и т. п.) */
  formNote?: string
  /** Критическое противопоказание — блок «⚠️ ФЛАГИ БЕЗОПАСНОСТИ» */
  critical?: boolean
}

export const DRINKS: readonly WelcomeOption[] = [
  { id: 'cappuccino', label: 'Капучино' },
  { id: 'americano', label: 'Американо' },
  { id: 'matcha', label: 'Матча' },
  { id: 'black_tea', label: 'Чай чёрный', formLabel: 'Чёрный чай' },
  { id: 'green_tea', label: 'Чай зелёный', formLabel: 'Зелёный чай' },
  { id: 'water', label: 'Просто воду', formLabel: 'Вода' },
  { id: 'nothing', label: 'Ничего не нужно', formLabel: 'Без напитка' },
]

export const MILK_OPTIONS: readonly WelcomeOption[] = [
  { id: 'regular', label: 'Обычное', formLabel: 'Классическое' },
  { id: 'coconut', label: 'Кокосовое' },
  { id: 'almond', label: 'Миндальное' },
  { id: 'banana', label: 'Банановое' },
  { id: 'pistachio', label: 'Фисташковое' },
  { id: 'none', label: 'Без молока' },
]

/** Напитки с выбором молока */
export const MILK_TRIGGER: ReadonlySet<string> = new Set(['cappuccino', 'americano', 'matcha'])
/** Напитки с вопросами о сахаре и сливках */
export const COFFEE: ReadonlySet<string> = new Set(['cappuccino', 'americano'])

export const TALK_MODES: readonly WelcomeOption[] = [
  { id: 'chat', label: 'Поболтаем', formLabel: 'Беседа' },
  { id: 'silent', label: 'Тишина' },
  { id: 'any', label: 'Как пойдёт', formLabel: 'По настроению' },
]

export const KID_NEEDS: readonly WelcomeOption[] = [
  { id: 'cartoon', label: 'Мультик', formLabel: 'Мультфильмы' },
  { id: 'coloring', label: 'Раскраски' },
  { id: 'drink', label: 'Напиток' },
  { id: 'nothing', label: 'Ничего не надо', formLabel: 'Ничего не нужно' },
]

export const SOURCES: readonly WelcomeOption[] = [
  { id: 'yandex_maps', label: 'Яндекс Карты' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'friend', label: 'Подруга', formLabel: 'Рекомендация' },
  { id: 'ads', label: 'Реклама' },
  { id: 'other', label: 'Другое' },
]

export const NO_CONTRAINDICATIONS = 'none'

export const CONTRAINDICATIONS: readonly WelcomeOption[] = [
  { id: 'pregnancy', label: 'Беременность', critical: true },
  { id: 'lactation', label: 'Период лактации', critical: true },
  {
    id: 'oncology',
    label: 'Онкология (текущая или в анамнезе)',
    formLabel: 'Онкологические заболевания',
    formNote: 'в настоящее время или в анамнезе',
    critical: true,
  },
  { id: 'diabetes', label: 'Сахарный диабет' },
  { id: 'epilepsy', label: 'Эпилепсия', critical: true },
  { id: 'antibiotics', label: 'Приём антибиотиков (последние 2 недели)', formLabel: 'Приём антибиотиков', formNote: 'в последние 2 недели' },
  {
    id: 'retinoids',
    label: 'Приём ретиноидов / Роаккутана (последние 6 месяцев)',
    formLabel: 'Приём ретиноидов (в том числе Роаккутана)',
    formNote: 'в последние 6 месяцев',
    critical: true,
  },
  {
    id: 'photodermatitis',
    label: 'Фотодерматит / повышенная чувствительность к свету',
    formLabel: 'Фотодерматит или повышенная чувствительность к свету',
  },
  { id: 'infection', label: 'Острые инфекции, ОРВИ, температура', formLabel: 'Острая инфекция, ОРВИ или повышенная температура' },
]

/** Новый гость: + «Противопоказаний нет» (взаимоисключающий пункт; в уведомлении — «Ничего из перечисленного») */
export const CONTRAINDICATIONS_NEW: readonly WelcomeOption[] = [
  ...CONTRAINDICATIONS,
  { id: NO_CONTRAINDICATIONS, label: 'Ничего из перечисленного', formLabel: 'Противопоказаний нет' },
]

/** Подпись опции по id; неизвестное значение возвращается как есть. */
export function labelOf(options: readonly WelcomeOption[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id
}

export const isCritical = (id: string): boolean => CONTRAINDICATIONS.some((c) => c.id === id && c.critical)
