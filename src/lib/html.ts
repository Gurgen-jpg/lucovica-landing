/**
 * Экранирует HTML-спецсимволы (&, <, >, ") для безопасной вставки строки в HTML-шаблон.
 * Используется перед вставкой пользовательских данных в email/Telegram HTML.
 */
export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
