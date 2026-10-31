// Формат уведомления об анкете гостя (welcome-api): флаги безопасности — первыми, подписи — из welcome-options.
import {
  CONTRAINDICATIONS_NEW,
  COFFEE,
  DRINKS,
  isCritical,
  KID_NEEDS,
  labelOf,
  MILK_OPTIONS,
  NO_CONTRAINDICATIONS,
  SOURCES,
  TALK_MODES,
} from '../../../src/content/welcome-options.ts'
import { escapeHtml } from '../escape-html.ts'
import type { StaffMessage } from './types.ts'

export interface WelcomeData {
  visit_type: 'new' | 'back'
  name: string
  phone: string
  address_form: 'ty' | 'vy' | ''
  drink: string
  milk: string
  sugar: boolean | null
  cream: boolean | null
  extra_drink_wish: string
  car: boolean | null
  car_number: string
  talk_mode: string
  with_kid: boolean | null
  kid_age: string
  kid_needs: string[]
  contraindications: string[]
  health_changed: boolean | null
  health_notes: string
  tan: boolean | null
  skin_notes: string
  source: string
  extra_notes: string
}

const yn = (v: boolean | null): string => (v === true ? 'Да' : v === false ? 'Нет' : '—')
const LINE = '─'.repeat(28)

/** Подписи всех частей анкеты — один раз, для письма и Telegram. */
function describe(d: WelcomeData) {
  const isNew = d.visit_type === 'new'
  const flags = d.contraindications.filter(isCritical).map((id) => labelOf(CONTRAINDICATIONS_NEW, id))
  const coffee = COFFEE.has(d.drink)
  const drink = [
    d.drink ? labelOf(DRINKS, d.drink) : '',
    d.milk ? labelOf(MILK_OPTIONS, d.milk) : '',
    coffee && d.sugar !== null ? (d.sugar ? 'с сахаром' : 'без сахара') : '',
    coffee && d.cream !== null ? (d.cream ? 'со сливками' : 'без сливок') : '',
  ]
    .filter(Boolean)
    .join(', ')
  const real = d.contraindications.filter((c) => c !== NO_CONTRAINDICATIONS)
  const contraindications = real.length ? real.map((id) => labelOf(CONTRAINDICATIONS_NEW, id)).join(', ') : 'Противопоказаний нет'
  const kidNeeds = d.kid_needs.map((id) => labelOf(KID_NEEDS, id)).join(', ')
  const kid = d.with_kid
    ? `Придёт с ребёнком (${d.kid_age ? `${d.kid_age} лет` : 'возраст не указан'})${kidNeeds ? `, подготовить: ${kidNeeds}` : ''}`
    : d.with_kid === false
      ? 'Без ребёнка'
      : ''
  return {
    isNew,
    flags,
    drink: drink || '—',
    parking: d.car === null ? '' : d.car ? `Да, ${d.car_number || 'номер не указан'}` : 'Нет',
    talk: d.talk_mode ? labelOf(TALK_MODES, d.talk_mode) : '',
    kid,
    contraindications,
    address: d.address_form === 'ty' ? 'на «ты»' : d.address_form === 'vy' ? 'на «вы»' : '',
    source: d.source ? labelOf(SOURCES, d.source) : '',
  }
}

export function formatWelcome(d: WelcomeData): StaffMessage {
  const e = escapeHtml
  const x = describe(d)
  const subject = `🌿 Welcome-анкета (${x.isNew ? 'новый' : 'повторный'}) — ${d.name}`
  const title = x.isNew ? '🌿 Новая Welcome-анкета' : '🌿 Новая Welcome-анкета (повторный визит)'

  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0"><b>${e(value)}</b></td></tr>`
      : ''
  const table = (rows: string[]) =>
    `<table style="border-collapse:collapse;width:100%;margin-bottom:16px">\n${rows.filter(Boolean).join('\n')}\n</table>`

  const flagHtml = x.flags.length
    ? `<p style="color:#c00;font-weight:bold;padding:8px 12px;background:#fff3f3;border:1px solid #c00;margin:0 0 16px">⚠️ ФЛАГИ БЕЗОПАСНОСТИ: ${e(x.flags.join(', '))}</p>\n`
    : ''

  const html = `<div style="font-family:sans-serif;max-width:520px;margin:0 auto">
${flagHtml}<h2 style="margin:0 0 16px;color:#1a1a1a">${e(title)}</h2>
${table([row('Имя', d.name), row('Телефон', d.phone), row('Обращение', x.address), row('Тип визита', x.isNew ? 'Первый' : 'Повторный')])}
${table([
  row('☕ Напиток', x.drink),
  row('Пожелание', d.extra_drink_wish),
  row('🚗 Парковка', x.parking),
  row('🤫 Общение', x.talk),
  row('Ребёнок', x.kid),
])}
${table([
  x.isNew ? '' : row('Здоровье изменилось', d.health_changed === null ? '' : d.health_changed ? 'да' : 'нет'),
  x.isNew ? '' : row('Комментарий о здоровье', d.health_notes),
  row('🏥 Противопоказания', x.contraindications),
  x.isNew ? row('Загар', yn(d.tan)) : '',
  row('Особенности кожи', d.skin_notes),
  x.isNew ? row('📍 Источник', x.source) : '',
  row('💭 Пожелания', d.extra_notes),
])}
</div>`

  const lines: string[] = []
  if (x.flags.length) lines.push(`⚠️ <b>ФЛАГИ БЕЗОПАСНОСТИ:</b> <b>${e(x.flags.join(', '))}</b>`, '')
  lines.push(`<b>${e(title)}</b>`, LINE)
  lines.push(`👤 <b>Имя:</b> ${e(d.name)}`)
  lines.push(`📞 <b>Телефон:</b> <a href="tel:${e(d.phone.replace(/[^\d+]/g, ''))}">${e(d.phone)}</a>`)
  if (x.address) lines.push(`💬 <b>Обращение:</b> ${e(x.address)}`)
  lines.push(`🆕 <b>Тип визита:</b> ${x.isNew ? 'Первый' : 'Повторный'}`, LINE)
  lines.push(`☕ <b>Напиток</b>`, e(x.drink))
  if (d.extra_drink_wish) lines.push(`🌿 Пожелание: ${e(d.extra_drink_wish)}`)
  if (x.parking) lines.push('', `🚗 <b>Парковка</b>`, e(x.parking))
  if (x.talk || x.kid) lines.push('', `🤫 <b>Комфорт</b>`, e([x.talk, x.kid].filter(Boolean).join(', ')))
  lines.push(LINE, `🏥 <b>Здоровье</b>`)
  if (!x.isNew && d.health_changed !== null) lines.push(`Здоровье изменилось: ${d.health_changed ? 'да' : 'нет'}`)
  if (!x.isNew && d.health_notes) lines.push(`Комментарий: ${e(d.health_notes)}`)
  lines.push(e(x.contraindications))
  if (x.isNew) lines.push(`Загар: ${yn(d.tan)}`)
  if (d.skin_notes) lines.push(`Особенности: ${e(d.skin_notes)}`)
  if (x.isNew || d.extra_notes) lines.push(LINE)
  if (x.isNew) lines.push(`📍 <b>Источник:</b> ${e(x.source || '—')}`)
  if (d.extra_notes) lines.push(`💭 <b>Пожелания:</b> ${e(d.extra_notes)}`)

  return { subject, html, telegram: lines.join('\n'), logName: d.name }
}
