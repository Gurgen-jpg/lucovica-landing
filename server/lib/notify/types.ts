// Сообщение персоналу: один текст для письма и для Telegram (booking-pipeline D3).

export interface StaffMessage {
  subject: string
  /** HTML письма — все пользовательские значения уже экранированы */
  html: string
  /** Текст Telegram (parse_mode HTML) — значения экранированы */
  telegram: string
  /** Имя посетителя для логов (телефон в логи не пишем) */
  logName?: string
}
