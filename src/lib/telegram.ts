import { withRetry } from './retry'

/**
 * Отправляет HTML-сообщение в Telegram-чат через Bot API.
 * Использует `withRetry` (3 попытки) и таймаут 10 с на каждую попытку.
 * Пробрасывает ошибку, если все попытки завершились неудачно.
 *
 * @param token  Токен Telegram-бота.
 * @param chatId ID чата или группы (строка, например '-100...').
 * @param text   HTML-текст сообщения (теги <b>, <i>, <code> поддерживаются).
 */
export async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string,
): Promise<void> {
  await withRetry(async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10_000)
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    }).finally(() => clearTimeout(timer))
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Telegram API error ${res.status}: ${body}`)
    }
  })
}
