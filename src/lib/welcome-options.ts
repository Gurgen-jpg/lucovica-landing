export const DRINKS = [
  { id: 'cappuccino', label: 'Капучино', emoji: '☕' },
  { id: 'americano', label: 'Американо', emoji: '☕' },
  { id: 'black_tea', label: 'Чай чёрный', emoji: '🍵' },
  { id: 'green_tea', label: 'Чай зелёный', emoji: '🍵' },
  { id: 'matcha', label: 'Матча', emoji: '🍵' },
  { id: 'water', label: 'Просто воду', emoji: '💧' },
  { id: 'nothing', label: 'Спасибо, ничего не нужно', emoji: '🚫' },
]

export const MILK_OPTIONS = [
  { id: 'regular', label: 'Обычное', emoji: '🥛' },
  { id: 'coconut', label: 'Кокосовое', emoji: '🥥' },
  { id: 'banana', label: 'Банановое', emoji: '🍌' },
  { id: 'almond', label: 'Миндальное', emoji: '🌰' },
  { id: 'pistachio', label: 'Фисташковое', emoji: '🌰' },
  { id: 'none', label: 'Без молока', emoji: '🚫' },
]

export const COFFEE_IDS = new Set(['cappuccino', 'americano'])
export const MILK_TRIGGER = new Set(['cappuccino', 'americano', 'matcha'])

export const KID_NEEDS = ['Мультик', 'Раскраски', 'Напиток', 'Ничего не надо']
export const SOURCES = ['Яндекс Карты', 'Instagram', 'Подруга', 'Реклама', 'Другое']

export const CONTRAINDICATIONS_BASE = [
  'Беременность',
  'Период лактации',
  'Онкология (текущая или в анамнезе)',
  'Сахарный диабет',
  'Эпилепсия',
  'Приём антибиотиков (последние 2 недели)',
  'Приём ретиноидов / Роаккутана (последние 6 месяцев)',
  'Фотодерматит / повышенная чувствительность к свету',
  'Острые инфекции, ОРВИ, температура',
]

// New clients only: includes the "none of the above" option
export const CONTRAINDICATIONS_NEW = [
  ...CONTRAINDICATIONS_BASE,
  'Ничего из перечисленного',
]
