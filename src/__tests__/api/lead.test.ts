import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function mockFetchOk() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  }))
}

function mockFetchFail() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: false,
    text: async () => 'Bad Request',
    status: 400,
  }))
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('POST /api/lead', () => {
  it('возвращает 422 если нет имени или телефона', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/lead/route')
    const res = await POST(makeRequest({ name: '', phone: '' }))
    expect(res.status).toBe(422)
  })

  it('возвращает ok:true при успешной отправке в TG и email', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/lead/route')
    const res = await POST(makeRequest({ name: 'Анна', phone: '+79991234567', service: 'Шугаринг', time: 'Утром' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
  })

  it('возвращает ok:true если TG упал но email прошёл', async () => {
    mockFetchFail()
    const { POST } = await import('@/app/api/lead/route')
    const res = await POST(makeRequest({ name: 'Анна', phone: '+79991234567', service: 'Шугаринг', time: 'Утром' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
  })

  it('возвращает 500 если оба канала упали', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    // mock nodemailer sendMail to fail
    const nodemailer = await import('nodemailer')
    vi.mocked(nodemailer.default.createTransport).mockReturnValue({
      sendMail: vi.fn().mockRejectedValue(new Error('smtp error')),
    } as never)

    const { POST } = await import('@/app/api/lead/route')
    const res = await POST(makeRequest({ name: 'Анна', phone: '+79991234567', service: 'Шугаринг', time: 'Утром' }))
    expect(res.status).toBe(500)
  })

  it('передаёт способ связи и акцию в Telegram-сообщение', async () => {
    mockFetchOk()
    const { sendLeadToTelegram } = await import('@/lib/sendLead')
    await sendLeadToTelegram({
      name: 'Анна',
      phone: '+79991234567',
      service: 'Лазерная эпиляция (жен.) — Подмышки',
      time: 'Утром',
      contact_method: 'Telegram',
      promo: 'Первый визит — подмышки бесплатно',
    })
    const fetchMock = vi.mocked(fetch)
    expect(fetchMock).toHaveBeenCalled()
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body))
    expect(body.text).toContain('Связь:</b> Telegram')
    expect(body.text).toContain('Акция:</b> Первый визит — подмышки бесплатно')
  })

  it('возвращает 400 при невалидном JSON', async () => {
    const req = new NextRequest('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    const { POST } = await import('@/app/api/lead/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
