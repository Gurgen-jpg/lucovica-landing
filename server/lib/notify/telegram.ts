// Telegram Bot API: sendMessage (HTML), 3 попытки с паузами 200/400 мс, 10 с на попытку.
import { withRetry } from '../retry.ts'
import type { StaffMessage } from './types.ts'

export const TELEGRAM_ATTEMPT_TIMEOUT_MS = 10_000

export interface TelegramDeps {
  fetch?: typeof fetch
  env?: NodeJS.ProcessEnv
  /** Базовая пауза между попытками (тесты — 0) */
  retryDelayMs?: number
}

export async function sendTelegram(msg: StaffMessage, deps: TelegramDeps = {}): Promise<void> {
  const env = deps.env ?? process.env
  const doFetch = deps.fetch ?? fetch
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('Telegram не настроен (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID)')

  await withRetry(
    async () => {
      const res = await doFetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(TELEGRAM_ATTEMPT_TIMEOUT_MS),
        body: JSON.stringify({ chat_id: chatId, text: msg.telegram, parse_mode: 'HTML', disable_web_page_preview: true }),
      })
      if (!res.ok) throw new Error(`Telegram API ${res.status}: ${await res.text()}`)
    },
    3,
    deps.retryDelayMs ?? 200,
  )
}
