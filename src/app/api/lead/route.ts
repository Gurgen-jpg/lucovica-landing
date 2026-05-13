import { NextRequest, NextResponse } from 'next/server'
import { sendLeadToTelegram, type LeadData } from '@/lib/sendLead'
import { sendLeadEmail } from '@/lib/sendEmail'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ])
}

export async function POST(req: NextRequest) {
  let body: Partial<LeadData>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, service, time } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 422 })
  }

  const lead: LeadData = {
    name: String(name).slice(0, 100),
    phone: String(phone).slice(0, 30),
    service: String(service ?? 'Не указана').slice(0, 100),
    time: String(time ?? 'Не указано').slice(0, 50),
    utm_source: body.utm_source ? String(body.utm_source).slice(0, 50) : undefined,
    utm_medium: body.utm_medium ? String(body.utm_medium).slice(0, 50) : undefined,
    utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 100) : undefined,
  }

  // 1. Email — синхронно: клиент ждёт результат
  try {
    await withTimeout(sendLeadEmail(lead), 25_000)
  } catch (err) {
    console.error('[lead] Email error:', err)
    return NextResponse.json({ error: 'Delivery failed' }, { status: 500 })
  }

  // 2. Telegram — fire-and-forget: клиент не ждёт, ошибки только в логи
  withTimeout(sendLeadToTelegram(lead), 25_000).catch(err => {
    console.error('[lead] Telegram error (background):', err)
  })

  return NextResponse.json({ ok: true })
}
