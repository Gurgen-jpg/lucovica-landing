const CRITICAL = new Set([
  'Беременность',
  'Период лактации',
  'Онкология (текущая или в анамнезе)',
  'Эпилепсия',
  'Приём ретиноидов / Роаккутана (последние 6 месяцев)',
])

export type WelcomeData = {
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
  health_changed?: boolean | null
  health_notes?: string
  tan: boolean | null
  skin_notes: string
  source: string
  extra_notes: string
  privacy_consent: boolean
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function yn(v: boolean | null | undefined): string {
  if (v === true) return 'Да'
  if (v === false) return 'Нет'
  return '—'
}

const DRINK_LABELS: Record<string, string> = {
  cappuccino: 'Капучино',
  americano: 'Американо',
  black_tea: 'Чай чёрный',
  green_tea: 'Чай зелёный',
  matcha: 'Матча',
  water: 'Просто воду',
  nothing: 'Ничего не нужно',
}

const MILK_LABELS: Record<string, string> = {
  regular: 'Обычное молоко',
  coconut: 'Кокосовое (Banana)',
  pistachio: 'Фисташковое',
  none: 'Без молока',
}

const TALK_LABELS: Record<string, string> = {
  chat: 'Поболтаем',
  silent: 'Тишина',
  any: 'Как пойдёт',
}

import { withRetry } from './retry'

export async function sendWelcomeToTelegram(data: WelcomeData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('Telegram credentials not configured')

  const flags = data.contraindications.filter(c => CRITICAL.has(c))
  const flagBlock =
    flags.length > 0
      ? `\n⚠️ <b>ФЛАГИ БЕЗОПАСНОСТИ:</b> <b>${esc(flags.join(', '))}</b>\n`
      : ''

  const drinkLabel = DRINK_LABELS[data.drink] ?? data.drink
  const milkLabel = data.milk ? MILK_LABELS[data.milk] ?? data.milk : ''
  const coffeeIds = new Set(['cappuccino', 'americano'])
  const drinkLine = [
    drinkLabel,
    milkLabel,
    coffeeIds.has(data.drink) && data.sugar !== null ? (data.sugar ? 'с сахаром' : 'без сахара') : '',
    coffeeIds.has(data.drink) && data.cream !== null ? (data.cream ? 'со сливками' : 'без сливок') : '',
  ]
    .filter(Boolean)
    .join(', ')

  const kidBlock =
    data.with_kid
      ? `👶 Придёт с ребёнком (${data.kid_age ? data.kid_age + ' лет' : 'возраст не указан'})` +
        (data.kid_needs.length ? `\nПодготовить: ${data.kid_needs.join(', ')}` : '')
      : 'Без ребёнка'

  const contraBlock =
    data.contraindications.length === 0 || data.contraindications.includes('Ничего из перечисленного')
      ? 'Противопоказаний нет'
      : data.contraindications.join(', ')

  const isNew = data.visit_type === 'new'

  const text =
    `🌿 <b>${isNew ? 'Новая Welcome-анкета' : 'Welcome-анкета (повторный визит)'}</b>\n` +
    `${'─'.repeat(28)}\n` +
    flagBlock +
    `👤 <b>Имя:</b> ${esc(data.name)}\n` +
    `📞 <b>Телефон:</b> <a href="tel:${esc(data.phone)}">${esc(data.phone)}</a>\n` +
    (data.address_form ? `💬 <b>Обращение:</b> на «${data.address_form === 'ty' ? 'ты' : 'вы'}»\n` : '') +
    `🆕 <b>Тип визита:</b> ${isNew ? 'Первый' : 'Повторный'}\n` +
    `${'─'.repeat(28)}\n` +
    `☕ <b>Напиток</b>\n${esc(drinkLine || '—')}\n` +
    (data.extra_drink_wish ? `🌿 Пожелание: ${esc(data.extra_drink_wish)}\n` : '') +
    `\n🚗 <b>Парковка</b>\n${data.car ? `Да, ${esc(data.car_number || 'номер не указан')}` : 'Нет'}\n` +
    `\n🤫 <b>Комфорт</b>\n${esc(TALK_LABELS[data.talk_mode] ?? (data.talk_mode || '—'))}, ${kidBlock}\n` +
    `${'─'.repeat(28)}\n` +
    `🏥 <b>Здоровье</b>\n${esc(contraBlock)}\n` +
    `Загар: ${yn(data.tan)}\n` +
    (data.skin_notes ? `Особенности: ${esc(data.skin_notes)}\n` : '') +
    (isNew
      ? `${'─'.repeat(28)}\n` +
        `📍 <b>Источник:</b> ${esc(data.source || '—')}\n` +
        (data.extra_notes ? `💭 <b>Пожелания:</b> ${esc(data.extra_notes)}\n` : '')
      : data.extra_notes
      ? `💭 <b>Пожелания:</b> ${esc(data.extra_notes)}\n`
      : '')

  await withRetry(async () => {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Telegram API error ${res.status}: ${body}`)
    }
  })
}
