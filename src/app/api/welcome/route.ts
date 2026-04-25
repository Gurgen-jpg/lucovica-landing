import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeToTelegram, type WelcomeData } from '@/lib/sendWelcome'

// In-memory rate limiter: 3 requests per minute per IP
const ipLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = 60_000
  const prev = (ipLog.get(ip) ?? []).filter(t => now - t < window)
  if (prev.length >= 3) return true
  ipLog.set(ip, [...prev, now])
  return false
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length === 11
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getIp(req))) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot check
  if (body._hp && String(body._hp).length > 0) {
    return NextResponse.json({ ok: true }) // silent reject
  }

  // Validate required fields
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : ''
  const phone = typeof body.phone === 'string' ? body.phone.slice(0, 30) : ''
  const privacy_consent = body.privacy_consent === true

  if (!name || !isValidPhone(phone) || !privacy_consent) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 422 })
  }

  const data: WelcomeData = {
    visit_type: body.visit_type === 'back' ? 'back' : 'new',
    name,
    phone,
    address_form: body.address_form === 'vy' ? 'vy' : body.address_form === 'ty' ? 'ty' : '',
    drink: typeof body.drink === 'string' ? body.drink.slice(0, 50) : '',
    milk: typeof body.milk === 'string' ? body.milk.slice(0, 50) : '',
    sugar: typeof body.sugar === 'boolean' ? body.sugar : null,
    cream: typeof body.cream === 'boolean' ? body.cream : null,
    extra_drink_wish: typeof body.extra_drink_wish === 'string' ? body.extra_drink_wish.slice(0, 500) : '',
    car: typeof body.car === 'boolean' ? body.car : null,
    car_number: typeof body.car_number === 'string' ? body.car_number.slice(0, 20) : '',
    talk_mode: typeof body.talk_mode === 'string' ? body.talk_mode.slice(0, 20) : '',
    with_kid: typeof body.with_kid === 'boolean' ? body.with_kid : null,
    kid_age: typeof body.kid_age === 'string' ? body.kid_age.slice(0, 5) : '',
    kid_needs: Array.isArray(body.kid_needs) ? (body.kid_needs as string[]).map(s => String(s).slice(0, 50)) : [],
    health_changed: typeof body.health_changed === 'boolean' ? body.health_changed : null,
    health_notes: typeof body.health_notes === 'string' ? body.health_notes.slice(0, 1000) : '',
    contraindications: Array.isArray(body.contraindications)
      ? (body.contraindications as string[]).map(s => String(s).slice(0, 100))
      : [],
    tan: typeof body.tan === 'boolean' ? body.tan : null,
    skin_notes: typeof body.skin_notes === 'string' ? body.skin_notes.slice(0, 500) : '',
    source: typeof body.source === 'string' ? body.source.slice(0, 50) : '',
    extra_notes: typeof body.extra_notes === 'string' ? body.extra_notes.slice(0, 1000) : '',
    privacy_consent: true,
  }

  const errors: string[] = []

  // Telegram
  try {
    await sendWelcomeToTelegram(data)
  } catch (err) {
    console.error('[welcome] Telegram error:', err)
    errors.push('telegram')
  }

  // Google Sheets webhook
  const sheetWebhook = process.env.WELCOME_SHEET_WEBHOOK
  if (sheetWebhook) {
    try {
      await fetch(sheetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          visit_type: data.visit_type,
          name: data.name,
          phone: data.phone,
          address_form: data.address_form,
          drink: data.drink,
          milk: data.milk,
          sugar: data.sugar,
          cream: data.cream,
          extra_drink_wish: data.extra_drink_wish,
          car: data.car,
          car_number: data.car_number,
          talk_mode: data.talk_mode,
          with_kid: data.with_kid,
          kid_age: data.kid_age,
          kid_needs: data.kid_needs.join(', '),
          contraindications: data.contraindications.join(', '),
          tan: data.tan,
          skin_notes: data.skin_notes,
          source: data.source,
          extra_notes: data.extra_notes,
          privacy_consent: data.privacy_consent,
        }),
      })
    } catch (err) {
      console.error('[welcome] Sheets error:', err)
      errors.push('sheets')
    }
  }

  // If Telegram (critical channel) failed — return error
  if (errors.includes('telegram')) {
    return NextResponse.json({ ok: false, error: 'Delivery failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
