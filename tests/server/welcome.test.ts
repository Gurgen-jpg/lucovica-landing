import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { parseWelcome, welcomeRouter } from '../../server/api/welcome.ts'
import { createApp } from '../../server/app.ts'
import { formatWelcome, type WelcomeData } from '../../server/lib/notify/format-welcome.ts'
import type { NotifyResult, StaffMessage } from '../../server/lib/notify/index.ts'
import { createRateLimiter } from '../../server/lib/rate-limit.ts'

let dist: string
let result: NotifyResult
const notify = vi.fn(async (_msg: StaffMessage) => result)

function app(limit = 100) {
  return createApp({
    distDir: dist,
    api: [welcomeRouter({ notify, distDir: dist, rateLimiter: createRateLimiter({ limit, windowMs: 60_000, cleanupMs: 0 }) })],
  })
}

const valid = {
  visit_type: 'new',
  name: 'Анна',
  phone: '89770169775',
  address_form: 'vy',
  drink: 'cappuccino',
  milk: 'banana',
  sugar: false,
  cream: true,
  car: true,
  car_number: 'А123БВ 161',
  talk_mode: 'silent',
  with_kid: false,
  contraindications: ['none'],
  tan: false,
  source: 'yandex_maps',
  privacy_consent: true,
  _hp: '',
}

beforeAll(() => {
  dist = mkdtempSync(join(tmpdir(), 'lv-welcome-'))
  mkdirSync(join(dist, 'assets'))
  writeFileSync(join(dist, 'assets.json'), JSON.stringify({ css: ['/assets/site-ABC.css'], js: [], preload: [] }))
  writeFileSync(join(dist, 'routes.json'), '{}')
})

afterAll(() => rmSync(dist, { recursive: true, force: true }))

beforeEach(() => {
  result = { email: true, telegram: true }
  notify.mockClear()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('POST /api/welcome', () => {
  it('200 для корректной анкеты, телефон нормализован, подписи вместо id', async () => {
    const res = await request(app()).post('/api/welcome').send(valid)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
    const msg = notify.mock.calls[0]![0]
    expect(msg.subject).toBe('🌿 Welcome-анкета (новый) — Анна')
    expect(msg.telegram).toContain('+7 (977) 016-97-75')
    expect(msg.telegram).toContain('Капучино, Банановое, без сахара, со сливками')
    expect(msg.telegram).not.toContain('banana')
  })

  it('422 без имени, с плохим телефоном, без согласия', async () => {
    for (const body of [{ ...valid, name: ' ' }, { ...valid, phone: '123' }, { ...valid, privacy_consent: false }, { ...valid, privacy_consent: undefined }]) {
      const res = await request(app()).post('/api/welcome').send(body)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({ ok: false, error: 'Заполни все обязательные поля.' })
    }
    expect(notify).not.toHaveBeenCalled()
  })

  it('200 без уведомлений при заполненной ловушке', async () => {
    const res = await request(app()).post('/api/welcome').send({ ...valid, _hp: 'bot' })
    expect(res.status).toBe(200)
    expect(notify).not.toHaveBeenCalled()
  })

  it('400 на битый JSON — с обращением на «ты»', async () => {
    const res = await request(app()).post('/api/welcome').set('Content-Type', 'application/json').send('{"name":')
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ ok: false, error: 'Ошибка запроса. Попробуй ещё раз.' })
  })

  it('429 на 4-й запрос за минуту', async () => {
    const a = app(3)
    for (let i = 0; i < 3; i++) expect((await request(a).post('/api/welcome').send(valid)).status).toBe(200)
    const res = await request(a).post('/api/welcome').send(valid)
    expect(res.status).toBe(429)
    expect(res.body).toEqual({ ok: false, error: 'Слишком много запросов. Попробуй чуть позже.' })
  })

  it('200 при одном упавшем канале, 500 при обоих', async () => {
    result = { email: false, telegram: true }
    expect((await request(app()).post('/api/welcome').send(valid)).status).toBe(200)
    result = { email: false, telegram: false }
    const res = await request(app()).post('/api/welcome').send(valid)
    expect(res.status).toBe(500)
    expect(res.body.error).toBe('Не удалось отправить данные. Попробуй ещё раз или напиши нам в WhatsApp.')
  })

  it('форма без JS: urlencoded, «yes»/«on», HTML-ответ', async () => {
    const res = await request(app())
      .post('/api/welcome')
      .type('form')
      .send('visit_type=new&name=Анна&phone=8+977+016-97-75&drink=matcha&milk=almond&car=no&talk_mode=chat&with_kid=yes&kid_age=7&kid_needs=cartoon&kid_needs=coloring&contraindications=pregnancy&tan=no&source=friend&privacy_consent=on&_hp=')
    expect(res.status).toBe(200)
    expect(res.type).toBe('text/html')
    expect(res.text).toContain('Всё записали')
    expect(res.text).toContain('href="/"')
    const msg = notify.mock.calls[0]![0]
    expect(msg.telegram).toContain('Матча, Миндальное')
    expect(msg.telegram).toContain('Мультик, Раскраски')
    expect(msg.telegram).toContain('Беременность')
  })
})

describe('parseWelcome', () => {
  it('обрезает поля по длинам спеки и приводит типы', () => {
    const d = parseWelcome({ name: 'x'.repeat(200), health_notes: 'н'.repeat(2000), sugar: 'maybe', address_form: 'вы', kid_needs: 'cartoon' })
    expect(d.name).toHaveLength(100)
    expect(d.health_notes).toHaveLength(1000)
    expect(d.sugar).toBeNull()
    expect(d.address_form).toBe('')
    expect(d.kid_needs).toEqual(['cartoon'])
    expect(d.visit_type).toBe('new')
  })
})

const base: WelcomeData = {
  visit_type: 'new',
  name: 'Анна',
  phone: '+7 (977) 016-97-75',
  address_form: 'ty',
  drink: 'americano',
  milk: 'banana',
  sugar: true,
  cream: false,
  extra_drink_wish: '',
  car: false,
  car_number: '',
  talk_mode: 'chat',
  with_kid: false,
  kid_age: '',
  kid_needs: [],
  contraindications: ['none'],
  health_changed: null,
  health_notes: '',
  tan: false,
  skin_notes: '',
  source: 'instagram',
  extra_notes: '',
}

describe('formatWelcome', () => {
  it('новый гость: тема, блоки, источник', () => {
    const msg = formatWelcome(base)
    expect(msg.subject).toBe('🌿 Welcome-анкета (новый) — Анна')
    expect(msg.telegram).toMatchInlineSnapshot(`
      "<b>🌿 Новая Welcome-анкета</b>
      ────────────────────────────
      👤 <b>Имя:</b> Анна
      📞 <b>Телефон:</b> <a href="tel:+79770169775">+7 (977) 016-97-75</a>
      💬 <b>Обращение:</b> на «ты»
      🆕 <b>Тип визита:</b> Первый
      ────────────────────────────
      ☕ <b>Напиток</b>
      Американо, Банановое, с сахаром, без сливок

      🚗 <b>Парковка</b>
      Нет

      🤫 <b>Комфорт</b>
      Поболтаем, Без ребёнка
      ────────────────────────────
      🏥 <b>Здоровье</b>
      Противопоказаний нет
      Загар: Нет
      ────────────────────────────
      📍 <b>Источник:</b> Instagram"
    `)
    expect(msg.html).toContain('Банановое')
    expect(msg.html).not.toContain('ФЛАГИ')
  })

  it('повторный гость: «Здоровье изменилось», комментарий, без источника', () => {
    const msg = formatWelcome({
      ...base,
      visit_type: 'back',
      address_form: '',
      car: null,
      talk_mode: '',
      with_kid: null,
      tan: null,
      source: '',
      health_changed: true,
      health_notes: 'с марта',
      contraindications: ['lactation'],
    })
    expect(msg.subject).toBe('🌿 Welcome-анкета (повторный) — Анна')
    expect(msg.telegram).toContain('Здоровье изменилось: да')
    expect(msg.html).toContain('Здоровье изменилось</td><td style="padding:4px 0"><b>да</b>')
    for (const text of [msg.telegram, msg.html]) {
      expect(text).toContain('Новая Welcome-анкета (повторный визит)')
      expect(text).toContain('Период лактации')
      expect(text).toContain('с марта')
      expect(text).not.toContain('Источник')
    }
  })

  it('критическое противопоказание — флаги первыми в письме и Telegram', () => {
    const msg = formatWelcome({ ...base, contraindications: ['pregnancy', 'diabetes'] })
    expect(msg.telegram.startsWith('⚠️ <b>ФЛАГИ БЕЗОПАСНОСТИ:</b> <b>Беременность</b>')).toBe(true)
    expect(msg.html).toMatch(/^<div[^>]*>\n<p[^>]*>⚠️ ФЛАГИ БЕЗОПАСНОСТИ: Беременность<\/p>/)
    expect(msg.telegram).toContain('Беременность, Сахарный диабет')
  })

  it('разметка в ответах экранируется', () => {
    const msg = formatWelcome({ ...base, name: '<b>Анна</b>', skin_notes: '<script>' })
    for (const text of [msg.telegram, msg.html]) {
      expect(text).toContain('&lt;b&gt;Анна&lt;/b&gt;')
      expect(text).toContain('&lt;script&gt;')
      expect(text).not.toContain('<b>Анна</b>')
    }
  })
})
