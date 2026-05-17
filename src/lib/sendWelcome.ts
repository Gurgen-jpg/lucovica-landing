import { escHtml } from './html'
import { sendTelegramMessage } from './telegram'
import {
  CRITICAL_CONTRAINDICATIONS,
  DRINK_LABELS,
  MILK_LABELS,
  TALK_LABELS,
} from './welcome-labels'

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

function yn(v: boolean | null | undefined): string {
  if (v === true) return 'Да'
  if (v === false) return 'Нет'
  return '—'
}

export async function sendWelcomeToTelegram(data: WelcomeData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('Telegram credentials not configured')

  const flags = data.contraindications.filter(c => CRITICAL_CONTRAINDICATIONS.has(c))
  const flagBlock =
    flags.length > 0
      ? `\n⚠️ <b>ФЛАГИ БЕЗОПАСНОСТИ:</b> <b>${escHtml(flags.join(', '))}</b>\n`
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
    `👤 <b>Имя:</b> ${escHtml(data.name)}\n` +
    `📞 <b>Телефон:</b> <a href="tel:${escHtml(data.phone)}">${escHtml(data.phone)}</a>\n` +
    (data.address_form ? `💬 <b>Обращение:</b> на «${data.address_form === 'ty' ? 'ты' : 'вы'}»\n` : '') +
    `🆕 <b>Тип визита:</b> ${isNew ? 'Первый' : 'Повторный'}\n` +
    `${'─'.repeat(28)}\n` +
    `☕ <b>Напиток</b>\n${escHtml(drinkLine || '—')}\n` +
    (data.extra_drink_wish ? `🌿 Пожелание: ${escHtml(data.extra_drink_wish)}\n` : '') +
    `\n🚗 <b>Парковка</b>\n${data.car ? `Да, ${escHtml(data.car_number || 'номер не указан')}` : 'Нет'}\n` +
    `\n🤫 <b>Комфорт</b>\n${escHtml(TALK_LABELS[data.talk_mode] ?? (data.talk_mode || '—'))}, ${kidBlock}\n` +
    `${'─'.repeat(28)}\n` +
    `🏥 <b>Здоровье</b>\n${escHtml(contraBlock)}\n` +
    `Загар: ${yn(data.tan)}\n` +
    (data.skin_notes ? `Особенности: ${escHtml(data.skin_notes)}\n` : '') +
    (isNew
      ? `${'─'.repeat(28)}\n` +
        `📍 <b>Источник:</b> ${escHtml(data.source || '—')}\n` +
        (data.extra_notes ? `💭 <b>Пожелания:</b> ${escHtml(data.extra_notes)}\n` : '')
      : data.extra_notes
      ? `💭 <b>Пожелания:</b> ${escHtml(data.extra_notes)}\n`
      : '')

  await sendTelegramMessage(token, chatId, text)
}
