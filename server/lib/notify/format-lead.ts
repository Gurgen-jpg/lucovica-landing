// Формат уведомления о заявке (как в ../landing/src/lib/{sendEmail,sendLead}.ts), значения экранированы.
import { escapeHtml } from '../escape-html.ts'
import type { StaffMessage } from './types.ts'

export const CERTIFICATE_SERVICE = 'Подарочный сертификат'

export interface Lead {
  name: string
  phone: string
  service: string
  time: string
  contact_method: string
  /** Ник или номер в выбранном мессенджере */
  messenger?: string
  promo?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

function row(label: string, value: string | undefined): string {
  if (!value) return ''
  return `<tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">${label}</td><td style="padding:4px 0"><b>${escapeHtml(value)}</b></td></tr>`
}

export function formatLead(lead: Lead): StaffMessage {
  const e = escapeHtml
  const isCert = lead.service === CERTIFICATE_SERVICE
  const subject = isCert ? `🎁 Новый заказ сертификата — ${lead.name}` : `🌸 Новая заявка — ${lead.name}`
  const utm = lead.utm_source ? [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ') : ''

  const contact = lead.messenger ? `${lead.contact_method} — ${lead.messenger}` : lead.contact_method
  // Ник Telegram — ссылкой, чтобы администратор открыл чат в одно касание
  const tgUser = lead.contact_method === 'Telegram' ? /^@?([A-Za-z0-9_]{5,32})$/.exec(lead.messenger ?? '')?.[1] : undefined
  const contactTg = tgUser
    ? `${e(lead.contact_method)} — <a href="https://t.me/${tgUser}">@${tgUser}</a>`
    : e(contact)

  const rows = [
    row('Имя', lead.name),
    row('Телефон', lead.phone),
    row('Услуга', lead.service),
    isCert ? '' : row('Время', lead.time),
    row('Связь', contact),
    row('Акция', lead.promo ? `🎁 ${lead.promo}` : ''),
    row('Источник', utm),
  ].filter(Boolean)

  const html = `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
<h2 style="margin:0 0 16px;color:#1a1a1a">${e(subject)}</h2>
<table style="border-collapse:collapse;width:100%">
${rows.join('\n')}
</table>
</div>`

  const header = isCert ? '🎁 <b>Новый заказ сертификата — LUCOVICA</b>' : '🌸 <b>Новая заявка на запись — LUCOVICA</b>'
  const telegram =
    `${header}\n` +
    `${'─'.repeat(28)}\n` +
    `👤 <b>Имя:</b> ${e(lead.name)}\n` +
    `📞 <b>Телефон:</b> <a href="tel:${e(lead.phone.replace(/[^\d+]/g, ''))}">${e(lead.phone)}</a>\n` +
    `💆 <b>Услуга:</b> ${e(lead.service)}` +
    (isCert ? '' : `\n🕐 <b>Время:</b> ${e(lead.time)}`) +
    `\n📱 <b>Связь:</b> ${contactTg}` +
    (lead.promo ? `\n🎁 <b>Акция:</b> ${e(lead.promo)}` : '') +
    (utm ? `\n\n<blockquote>📊 Источник: ${e(utm)}</blockquote>` : '')

  return { subject, html, telegram, logName: lead.name }
}
