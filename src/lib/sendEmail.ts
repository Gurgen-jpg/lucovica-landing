import nodemailer from 'nodemailer'
import type { LeadData } from './sendLead'
import type { WelcomeData } from './sendWelcome'

function createTransport() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) throw new Error('SMTP credentials not configured')

  return nodemailer.createTransport({
    host: 'smtp.timeweb.ru',
    port: 465,
    secure: true,
    auth: { user, pass },
  })
}

const TO = () => process.env.NOTIFY_EMAIL ?? process.env.SMTP_USER ?? ''

function row(label: string, value: string | null | undefined) {
  if (!value) return ''
  return `<tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">${label}</td><td style="padding:4px 0"><b>${value}</b></td></tr>`
}

export async function sendLeadEmail(data: LeadData): Promise<void> {
  const transport = createTransport()

  const isCert = data.service === 'Подарочный сертификат'
  const subject = isCert
    ? `🎁 Новый заказ сертификата — ${data.name}`
    : `🌸 Новая заявка — ${data.name}`

  const utmRow = data.utm_source
    ? row('Источник', [data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(' / '))
    : ''

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="margin:0 0 16px;color:#1a1a1a">${subject}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${row('Имя', data.name)}
        ${row('Телефон', data.phone)}
        ${row('Услуга', data.service)}
        ${!isCert ? row('Время', data.time) : ''}
        ${utmRow}
      </table>
    </div>`

  await transport.sendMail({
    from: `"LUCOVICA" <${process.env.SMTP_USER}>`,
    to: TO(),
    subject,
    html,
  })
}

export async function sendWelcomeEmail(data: WelcomeData): Promise<void> {
  const transport = createTransport()

  const isNew = data.visit_type === 'new'
  const subject = isNew
    ? `🌿 Welcome-анкета (новый) — ${data.name}`
    : `🌿 Welcome-анкета (повторный) — ${data.name}`

  const DRINK_LABELS: Record<string, string> = {
    cappuccino: 'Капучино', americano: 'Американо', black_tea: 'Чай чёрный',
    green_tea: 'Чай зелёный', matcha: 'Матча', water: 'Просто воду', nothing: 'Ничего',
  }
  const MILK_LABELS: Record<string, string> = {
    regular: 'Обычное', coconut: 'Кокосовое', pistachio: 'Фисташковое', none: 'Без молока',
  }
  const yn = (v: boolean | null | undefined) => v === true ? 'Да' : v === false ? 'Нет' : '—'

  const drinkParts = [
    DRINK_LABELS[data.drink] ?? data.drink,
    data.milk ? MILK_LABELS[data.milk] ?? data.milk : '',
    ['cappuccino','americano'].includes(data.drink) && data.sugar !== null ? (data.sugar ? 'с сахаром' : 'без сахара') : '',
    ['cappuccino','americano'].includes(data.drink) && data.cream !== null ? (data.cream ? 'со сливками' : 'без сливок') : '',
  ].filter(Boolean).join(', ')

  const contraStr = data.contraindications.length === 0 || data.contraindications.includes('Ничего из перечисленного')
    ? 'Нет'
    : data.contraindications.join(', ')

  const flagWarning = data.contraindications.some(c => [
    'Беременность','Период лактации','Онкология (текущая или в анамнезе)',
    'Эпилепсия','Приём ретиноидов / Роаккутана (последние 6 месяцев)',
  ].includes(c))
    ? `<p style="color:#c00;font-weight:bold;padding:8px 12px;background:#fff3f3;border-radius:6px">⚠️ ФЛАГИ БЕЗОПАСНОСТИ: ${contraStr}</p>`
    : ''

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
      <h2 style="margin:0 0 16px;color:#1a1a1a">${subject}</h2>
      ${flagWarning}
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        ${row('Имя', data.name)}
        ${row('Телефон', data.phone)}
        ${row('Обращение', data.address_form === 'ty' ? 'на «ты»' : data.address_form === 'vy' ? 'на «вы»' : null)}
        ${row('Тип визита', isNew ? 'Первый' : 'Повторный')}
      </table>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        ${row('Напиток', drinkParts || '—')}
        ${data.extra_drink_wish ? row('Пожелание', data.extra_drink_wish) : ''}
        ${row('Парковка', data.car ? `Да, ${data.car_number || 'номер не указан'}` : 'Нет')}
        ${row('Общение', data.talk_mode)}
        ${row('С ребёнком', data.with_kid ? `Да (${data.kid_age ? data.kid_age + ' лет' : 'возраст не указан'})${data.kid_needs.length ? ', подготовить: ' + data.kid_needs.join(', ') : ''}` : 'Нет')}
      </table>
      <table style="border-collapse:collapse;width:100%">
        ${row('Противопоказания', contraStr)}
        ${row('Загар', yn(data.tan))}
        ${data.skin_notes ? row('Особенности кожи', data.skin_notes) : ''}
        ${isNew && data.source ? row('Источник', data.source) : ''}
        ${data.extra_notes ? row('Пожелания', data.extra_notes) : ''}
      </table>
    </div>`

  await transport.sendMail({
    from: `"LUCOVICA" <${process.env.SMTP_USER}>`,
    to: TO(),
    subject,
    html,
  })
}
