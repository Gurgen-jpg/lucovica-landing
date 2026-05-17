export const DRINK_LABELS: Record<string, string> = {
  cappuccino: 'Капучино',
  americano: 'Американо',
  black_tea: 'Чай чёрный',
  green_tea: 'Чай зелёный',
  matcha: 'Матча',
  water: 'Просто воду',
  nothing: 'Ничего не нужно',
}

export const MILK_LABELS: Record<string, string> = {
  regular: 'Обычное молоко',
  coconut: 'Кокосовое (Banana)',
  pistachio: 'Фисташковое',
  none: 'Без молока',
}

export const TALK_LABELS: Record<string, string> = {
  chat: 'Поболтаем',
  silent: 'Тишина',
  any: 'Как пойдёт',
}

export const CRITICAL_CONTRAINDICATIONS = new Set([
  'Беременность',
  'Период лактации',
  'Онкология (текущая или в анамнезе)',
  'Эпилепсия',
  'Приём ретиноидов / Роаккутана (последние 6 месяцев)',
])
