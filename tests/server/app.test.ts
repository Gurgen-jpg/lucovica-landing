import express from 'express'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from '../../server/app.ts'

let dist: string
let app: ReturnType<typeof createApp>

const page = (h1: string) => `<!doctype html><html lang="ru"><body><h1>${h1}</h1>${'<p>текст</p>'.repeat(200)}</body></html>`

beforeAll(() => {
  dist = mkdtempSync(join(tmpdir(), 'lv-dist-'))
  mkdirSync(join(dist, 'assets'))
  mkdirSync(join(dist, 'welcome'))
  writeFileSync(join(dist, 'index.html'), page('Главная'))
  writeFileSync(join(dist, 'sugaring.html'), page('Шугаринг'))
  writeFileSync(join(dist, 'welcome.html'), page('Анкета'))
  writeFileSync(join(dist, 'welcome', 'back.html'), page('С возвращением'))
  writeFileSync(join(dist, '404.html'), '<h1>Страница не найдена</h1><a href="/">На главную</a>')
  writeFileSync(join(dist, 'assets', 'site-ABC123.css'), 'body{margin:0}')
  writeFileSync(join(dist, 'robots.txt'), 'User-agent: *')
  writeFileSync(
    join(dist, 'routes.json'),
    JSON.stringify({ '/': 'index.html', '/sugaring': 'sugaring.html', '/welcome': 'welcome.html', '/welcome/back': 'welcome/back.html' }),
  )
  const api = express.Router()
  api.post('/echo', (req, res) => {
    res.json({ ok: true, body: req.body })
  })
  app = createApp({ distDir: dist, api: [api] })
})

afterAll(() => rmSync(dist, { recursive: true, force: true }))

describe('страницы', () => {
  it('отдаёт главную и страницу услуги', async () => {
    const home = await request(app).get('/')
    expect(home.status).toBe(200)
    expect(home.text).toContain('<h1>Главная</h1>')
    const s = await request(app).get('/sugaring')
    expect(s.status).toBe(200)
    expect(s.headers['content-type']).toMatch(/text\/html/)
  })

  it('/welcome и /welcome/back не путаются с каталогом', async () => {
    expect((await request(app).get('/welcome')).text).toContain('Анкета')
    expect((await request(app).get('/welcome/back')).text).toContain('С возвращением')
  })

  it('301 со слэша с сохранением query', async () => {
    const r = await request(app).get('/sugaring/?utm_source=ya')
    expect(r.status).toBe(301)
    expect(r.headers.location).toBe('/sugaring?utm_source=ya')
  })

  it('301 с .html и /index.html', async () => {
    expect((await request(app).get('/cert.html')).headers.location).toBe('/cert')
    expect((await request(app).get('/index.html')).headers.location).toBe('/')
  })

  it('404 со страницей и ссылкой на главную', async () => {
    const r = await request(app).get('/no-such-page')
    expect(r.status).toBe(404)
    expect(r.text).toContain('href="/"')
  })

  it('служебные файлы сборки не отдаются', async () => {
    expect((await request(app).get('/routes.json')).status).toBe(404)
  })
})

describe('заголовки', () => {
  it('безопасность и отсутствие X-Powered-By', async () => {
    const r = await request(app).get('/')
    expect(r.headers['x-content-type-options']).toBe('nosniff')
    expect(r.headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(r.headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(r.headers['x-powered-by']).toBeUndefined()
  })

  it('хэшированные ассеты — immutable', async () => {
    const r = await request(app).get('/assets/site-ABC123.css')
    expect(r.status).toBe(200)
    expect(r.headers['cache-control']).toBe('public, max-age=31536000, immutable')
  })

  it('HTML — no-cache и 304 по ETag', async () => {
    const first = await request(app).get('/')
    expect(first.headers['cache-control']).toBe('no-cache')
    expect(first.headers.etag).toBeTruthy()
    const second = await request(app).get('/').set('If-None-Match', first.headers.etag!)
    expect(second.status).toBe(304)
  })

  it('сжатие при Accept-Encoding: gzip', async () => {
    const r = await request(app).get('/').set('Accept-Encoding', 'gzip')
    expect(r.headers['content-encoding']).toBe('gzip')
  })
})

describe('служебные маршруты и API', () => {
  it('/healthz → ok', async () => {
    const r = await request(app).get('/healthz')
    expect(r.status).toBe(200)
    expect(r.text).toBe('ok')
  })

  it('API принимает JSON и форму', async () => {
    expect((await request(app).post('/api/echo').send({ a: 1 })).body.body).toEqual({ a: 1 })
    expect((await request(app).post('/api/echo').type('form').send('a=1')).body.body).toEqual({ a: '1' })
  })

  it('битый JSON → 400, большое тело → 413, неизвестный эндпоинт → 404 JSON', async () => {
    const bad = await request(app).post('/api/echo').set('Content-Type', 'application/json').send('{bad')
    expect(bad.status).toBe(400)
    expect(bad.body.ok).toBe(false)
    const big = await request(app).post('/api/echo').send({ s: 'x'.repeat(40_000) })
    expect(big.status).toBe(413)
    expect((await request(app).get('/api/nope')).status).toBe(404)
  })
})
