// «Ритуал в четыре шага» — тексты макета v2.

export interface RitualStep {
  numeral: string
  title: string
  text: string
}

export const RITUAL: readonly RitualStep[] = [
  { numeral: 'I', title: 'Запись', text: 'Онлайн или по телефону. Подтверждаем время в течение часа.' },
  { numeral: 'II', title: 'Консультация', text: 'Мастер оценивает тип кожи и волос, подбирает метод и параметры.' },
  { numeral: 'III', title: 'Процедура', text: 'Стерильный кабинет, тишина или беседа — как вам комфортнее. Кофе — по желанию.' },
  { numeral: 'IV', title: 'Уход после', text: 'Успокаивающее средство и персональные рекомендации для стойкого результата.' },
]
