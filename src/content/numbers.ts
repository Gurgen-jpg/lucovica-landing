// «Студия в цифрах». Рейтинг — из настроек сайта, остальное — тексты макета v2.
import { site } from './site.ts'

export interface Figure {
  value: string
  label: string
}

export const NUMBERS: readonly Figure[] = [
  { value: '12+', label: 'лет работы' },
  { value: '2 000+', label: 'постоянных гостей' },
  { value: '10 000+', label: 'проведённых сеансов' },
  { value: String(site.yandexMaps.rating), label: 'звёзд по отзывам клиентов' },
]
