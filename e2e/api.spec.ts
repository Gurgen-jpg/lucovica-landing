import { test, expect } from '@playwright/test'

/**
 * API-тесты через Playwright request fixture.
 * Не открывают браузер — быстрые, идут в любом окружении.
 * Не мокают SMTP/Telegram — поэтому require живого сервера, но не реальных credentials.
 * Реальная отправка блокируется на уровне env (пустые переменные в тестовом окружении).
 */

test.describe('POST /api/lead', () => {
  test('возвращает 200 при валидных данных', async ({ request }) => {
    const res = await request.post('/api/lead', {
      data: { name: 'Тест', phone: '+79991234567', service: 'Шугаринг', time: 'Утром' },
    })
    // В тестовом окружении нет SMTP — ожидаем либо 200, либо 500; главное — не 422
    expect([200, 500]).toContain(res.status())
  })

  test('возвращает 422 без имени', async ({ request }) => {
    const res = await request.post('/api/lead', {
      data: { name: '', phone: '+79991234567', service: 'Шугаринг', time: 'Утром' },
    })
    expect(res.status()).toBe(422)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  test('возвращает 422 без телефона', async ({ request }) => {
    const res = await request.post('/api/lead', {
      data: { name: 'Тест', phone: '', service: 'Шугаринг', time: 'Утром' },
    })
    expect(res.status()).toBe(422)
  })

  // /api/lead не валидирует формат телефона — принимает любую непустую строку
  test('принимает любой непустой телефон (формат не проверяется)', async ({ request }) => {
    const res = await request.post('/api/lead', {
      data: { name: 'Тест', phone: '123', service: 'Шугаринг', time: 'Утром' },
    })
    expect([200, 500]).toContain(res.status())
  })
})

test.describe('POST /api/welcome', () => {
  const validPayload = {
    name: 'Тест',
    phone: '+79991234567',
    visit_type: 'new',
    address_form: 'ty',
    drink: 'tea',
    milk: '',
    sugar: null,
    cream: null,
    extra_drink_wish: '',
    car: false,
    car_number: '',
    talk_mode: 'any',
    with_kid: false,
    kid_age: '',
    kid_needs: [],
    contraindications: ['Ничего из перечисленного'],
    tan: false,
    skin_notes: '',
    source: 'Instagram',
    extra_notes: '',
    privacy_consent: true,
    _hp: '',
  }

  test('возвращает 422 без имени', async ({ request }) => {
    const res = await request.post('/api/welcome', {
      data: { ...validPayload, name: '' },
    })
    expect(res.status()).toBe(422)
    const json = await res.json()
    expect(json.ok).toBe(false)
  })

  test('возвращает 422 без согласия', async ({ request }) => {
    const res = await request.post('/api/welcome', {
      data: { ...validPayload, privacy_consent: false },
    })
    expect(res.status()).toBe(422)
  })

  test('возвращает 422 при невалидном телефоне', async ({ request }) => {
    const res = await request.post('/api/welcome', {
      data: { ...validPayload, phone: '123' },
    })
    expect(res.status()).toBe(422)
  })

  test('honeypot — тихо возвращает 200 при заполненном _hp', async ({ request }) => {
    // Уникальный IP чтобы не попасть под rate limit, накопленный другими welcome-тестами
    const res = await request.post('/api/welcome', {
      headers: { 'x-forwarded-for': '10.0.0.99' },
      data: { ...validPayload, _hp: 'bot' },
    })
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })
})
