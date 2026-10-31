import { escHtml } from './html'
import { sendTelegramMessage } from './telegram'

export type LeadData = {
  name: string
  phone: string
  service: string
  time: string
  contact_method?: string
  promo?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export async function sendLeadToTelegram(data: LeadData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    throw new Error('Telegram credentials not configured')
  }

  const isCert = data.service === 'Подарочный сертификат'

  const utmBlock = data.utm_source
    ? `\n\n<blockquote>📊 Источник: ${escHtml(data.utm_source)}` +
      (data.utm_medium ? ` / ${escHtml(data.utm_medium)}` : '') +
      (data.utm_campaign ? ` / ${escHtml(data.utm_campaign)}` : '') +
      `</blockquote>`
    : ''

  const header = isCert
    ? `🎁 <b>Новый заказ сертификата — LUCOVICA</b>`
    : `🌸 <b>Новая заявка на запись — LUCOVICA</b>`

  const timeRow = isCert ? '' : `\n🕐 <b>Время:</b> ${escHtml(data.time)}`
  const contactRow = data.contact_method ? `\n📱 <b>Связь:</b> ${escHtml(data.contact_method)}` : ''
  const promoRow = data.promo ? `\n🎁 <b>Акция:</b> ${escHtml(data.promo)}` : ''

  const text =
    `${header}\n` +
    `${'─'.repeat(28)}\n` +
    `👤 <b>Имя:</b> ${escHtml(data.name)}\n` +
    `📞 <b>Телефон:</b> <a href="tel:${escHtml(data.phone)}">${escHtml(data.phone)}</a>\n` +
    `💆 <b>Услуга:</b> ${escHtml(data.service)}` +
    timeRow +
    contactRow +
    promoRow +
    utmBlock

  await sendTelegramMessage(token, chatId, text)
}
