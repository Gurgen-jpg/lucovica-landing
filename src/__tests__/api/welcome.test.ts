import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const validBody = {
  visit_type: 'new',
  name: 'Мария',
  phone: '+79991234567',
  address_form: 'ty',
  drink: 'cappuccino',
  milk: 'regular',
  sugar: false,
  cream: false,
  extra_drink_wish: '',
  car: false,
  car_number: '',
  talk_mode: 'chat',
  with_kid: false,
  kid_age: '',
  kid_needs: [],
  contraindications: ['Ничего из перечисленного'],
  tan: false,
  skin_notes: '',
  source: 'Instagram',
  extra_notes: '',
  privacy_consent: true,
}

let ipCounter = 0
function makeRequest(body: unknown, ip?: string) {
  const resolvedIp = ip ?? `10.0.${Math.floor(ipCounter / 255)}.${(ipCounter++) % 255 + 1}`
  return new NextRequest('http://localhost/api/welcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': resolvedIp },
    body: JSON.stringify(body),
  })
}

function mockFetchOk() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  }))
}

beforeEach(async () => {
  vi.restoreAllMocks()
  // vi.restoreAllMocks() не сбрасывает vi.fn() из vi.mock() factory,
  // поэтому явно восстанавливаем мок nodemailer после тестов, которые его переопределяют
  const nm = await import('nodemailer')
  vi.mocked(nm.default.createTransport).mockReset()
  vi.mocked(nm.default.createTransport).mockImplementation(() => ({
    sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id', accepted: [], rejected: [], response: '' }),
  }))
})

describe('POST /api/welcome', () => {
  it('возвращает ok:true при корректных данных', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest(validBody))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
  })

  it('возвращает 422 если нет имени', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest({ ...validBody, name: '' }))
    expect(res.status).toBe(422)
  })

  it('возвращает 422 если телефон невалидный', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest({ ...validBody, phone: '123' }))
    expect(res.status).toBe(422)
  })

  it('возвращает 422 если нет согласия на обработку данных', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest({ ...validBody, privacy_consent: false }))
    expect(res.status).toBe(422)
  })

  it('тихо отклоняет honeypot-запросы', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest({ ...validBody, _hp: 'bot' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(vi.mocked(fetch)).not.toHaveBeenCalled()
  })

  it('возвращает ok:true если TG упал но email прошёл', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      text: async () => 'error',
      status: 500,
    }))
    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest(validBody))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
  })

  it('возвращает 500 если оба канала упали', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    const nodemailer = await import('nodemailer')
    vi.mocked(nodemailer.default.createTransport).mockReturnValue({
      sendMail: vi.fn().mockRejectedValue(new Error('smtp error')),
    } as never)

    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(500)
  })

  it('корректно обрабатывает флаги безопасности (беременность)', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/welcome/route')
    const res = await POST(makeRequest({
      ...validBody,
      contraindications: ['Беременность'],
    }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
  })

  it('возвращает 429 при rate limit (4-й запрос с одного IP)', async () => {
    mockFetchOk()
    const { POST } = await import('@/app/api/welcome/route')
    const ip = '5.5.5.5'
    await POST(makeRequest(validBody, ip))
    await POST(makeRequest(validBody, ip))
    await POST(makeRequest(validBody, ip))
    const res = await POST(makeRequest(validBody, ip))
    expect(res.status).toBe(429)
  })
})
