export type LeadData = {
  name: string
  phone: string
  service: string
  time: string
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

  const utmLine =
    data.utm_source
      ? `\n📊 UTM: source=${data.utm_source} | medium=${data.utm_medium ?? '—'} | campaign=${data.utm_campaign ?? '—'}`
      : ''

  const text = [
    '🌸 *Новая заявка — LUCOVICA*',
    '',
    `👤 Имя: ${escapeMarkdown(data.name)}`,
    `📞 Телефон: ${escapeMarkdown(data.phone)}`,
    `💆 Услуга: ${escapeMarkdown(data.service)}`,
    `🕐 Удобное время: ${escapeMarkdown(data.time)}`,
    utmLine,
  ]
    .filter((l) => l !== undefined)
    .join('\n')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telegram API error: ${err}`)
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
}
