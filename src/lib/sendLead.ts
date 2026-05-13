export type LeadData = {
  name: string
  phone: string
  service: string
  time: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

import { withRetry } from './retry'

export async function sendLeadToTelegram(data: LeadData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    throw new Error('Telegram credentials not configured')
  }

  const isCert = data.service === 'Подарочный сертификат'

  // Блок UTM — только если есть источник
  const utmBlock = data.utm_source
    ? `\n\n<blockquote>📊 Источник: ${esc(data.utm_source)}` +
      (data.utm_medium ? ` / ${esc(data.utm_medium)}` : '') +
      (data.utm_campaign ? ` / ${esc(data.utm_campaign)}` : '') +
      `</blockquote>`
    : ''

  const header = isCert
    ? `🎁 <b>Новый заказ сертификата — LUCOVICA</b>`
    : `🌸 <b>Новая заявка на запись — LUCOVICA</b>`

  const timeRow = isCert
    ? ''
    : `\n🕐 <b>Время:</b> ${esc(data.time)}`

  const text =
    `${header}\n` +
    `${'─'.repeat(28)}\n` +
    `👤 <b>Имя:</b> ${esc(data.name)}\n` +
    `📞 <b>Телефон:</b> <a href="tel:${esc(data.phone)}">${esc(data.phone)}</a>\n` +
    `💆 <b>Услуга:</b> ${esc(data.service)}` +
    timeRow +
    utmBlock

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

/** Экранирует спецсимволы HTML */
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
