import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { leadRouter, parseLead } from '../../server/api/lead.ts'
import { createApp } from '../../server/app.ts'
import type { NotifyResult, StaffMessage } from '../../server/lib/notify/index.ts'
import { createRateLimiter } from '../../server/lib/rate-limit.ts'

let dist: string
let result: NotifyResult
const notify = vi.fn(async (_msg: StaffMessage) => result)

function app(limit = 100) {
  return createApp({
    distDir: dist,
    api: [leadRouter({ notify, distDir: dist, rateLimiter: createRateLimiter({ limit, windowMs: 60_000, cleanupMs: 0 }) })],
  })
}

const valid = { name: 'Анна', phone: '8 977 016-97-75', service: 'Шугаринг — Девушки' }

beforeAll(() => {
  dist = mkdtempSync(join(tmpdir(), 'lv-lead-'))
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

describe('POST /api/lead', () => {
  it('200 при успехе, телефон нормализован, значения по умолчанию', async () => {
    const res = await request(app()).post('/api/lead').send({ name: ' Анна ', phone: '8 977 016 97 75' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
    const msg = notify.mock.calls[0]![0]
    expect(msg.telegram).toContain('+7 (977) 016-97-75')
    expect(msg.telegram).toContain('<b>Услуга:</b> Не указана')
    expect(msg.telegram).toContain('<b>Время:</b> Не указано')
    expect(msg.telegram).toContain('<b>Связь:</b> Звонок')
  })

  it('200, если доставлен хотя бы один канал', async () => {
    result = { email: false, telegram: true }
    const res = await request(app()).post('/api/lead').send(valid)
    expect(res.status).toBe(200)
  })

  it('500, если не доставлен ни один канал', async () => {
    result = { email: false, telegram: false }
    const res = await request(app()).post('/api/lead').send(valid)
    expect(res.status).toBe(500)
    expect(res.body).toEqual({ ok: false, error: 'Не удалось отправить заявку.' })
  })

  it('422 без имени и с телефоном «123», уведомления не отправляются', async () => {
    for (const body of [{ phone: valid.phone }, { name: '   ', phone: valid.phone }, { name: 'Анна', phone: '123' }]) {
      const res = await request(app()).post('/api/lead').send(body)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({ ok: false, error: 'Укажите имя и телефон.' })
    }
    expect(notify).not.toHaveBeenCalled()
  })

  it('400 на битый JSON', async () => {
    const res = await request(app()).post('/api/lead').set('Content-Type', 'application/json').send('{"name":')
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ ok: false, error: 'Ошибка запроса. Попробуйте ещё раз.' })
  })

  it('413 на тело больше 32 КБ', async () => {
    const res = await request(app())
      .post('/api/lead')
      .send({ ...valid, name: 'x'.repeat(33 * 1024) })
    expect(res.status).toBe(413)
    expect(res.body.ok).toBe(false)
  })

  it('honeypot: 200 без уведомлений', async () => {
    const res = await request(app()).post('/api/lead').send({ ...valid, _hp: 'x' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(notify).not.toHaveBeenCalled()
  })

  it('429 на 6-й запрос за минуту с одного IP', async () => {
    const a = app(5)
    for (let i = 0; i < 5; i++) expect((await request(a).post('/api/lead').send(valid)).status).toBe(200)
    const res = await request(a).post('/api/lead').send(valid)
    expect(res.status).toBe(429)
    expect(res.body).toEqual({ ok: false, error: 'Слишком много запросов. Попробуйте через минуту.' })
    // Другой клиент за прокси не затронут
    expect((await request(a).post('/api/lead').set('X-Forwarded-For', '10.0.0.2').send(valid)).status).toBe(200)
  })

  it('form-POST без JS — HTML-страница результата', async () => {
    const res = await request(app())
      .post('/api/lead')
      .type('form')
      .set('Accept', 'text/html,application/xhtml+xml')
      .send({ ...valid, name: '<b>Анна</b>' })
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/html/)
    expect(res.text).toContain('Заявка принята!')
    expect(res.text).toContain('href="/"')
    expect(res.text).toContain('<link rel="stylesheet" href="/assets/site-ABC.css">')
    expect(res.text).toContain('noindex')
    expect(notify.mock.calls[0]![0].telegram).toContain('&lt;b&gt;Анна&lt;/b&gt;')
  })

  it('form-POST с ошибкой — HTML со статусом 422', async () => {
    const res = await request(app()).post('/api/lead').type('form').set('Accept', 'text/html').send({ name: 'Анна', phone: '1' })
    expect(res.status).toBe(422)
    expect(res.text).toContain('Укажите имя и телефон.')
    expect(res.text).toContain('href="/"')
  })
})

describe('parseLead', () => {
  it('обрезает строки по длине из спеки', () => {
    const lead = parseLead({ name: 'a'.repeat(200), phone: '1'.repeat(50), service: 's'.repeat(200), utm_campaign: 'c'.repeat(200) })
    expect(lead.name).toHaveLength(100)
    expect(lead.phone).toHaveLength(30)
    expect(lead.service).toHaveLength(100)
    expect(lead.utm_campaign).toHaveLength(100)
    expect(lead.promo).toBeUndefined()
  })
})
