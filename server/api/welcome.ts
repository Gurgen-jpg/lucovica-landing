// POST /api/welcome — приём анкеты гостя (спека welcome-api).
// Порядок: rate limit → (разбор тела — в app.ts) → honeypot → валидация → уведомления.
import express, { type Request, type Response, type Router } from 'express'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { formatPhone, hasFullPhone, normalizePhone } from '../../src/shared/phone.ts'
import { escapeHtml } from '../lib/escape-html.ts'
import { formatWelcome, type WelcomeData } from '../lib/notify/format-welcome.ts'
import { delivered, notify as defaultNotify, type Notify } from '../lib/notify/index.ts'
import { createRateLimiter, type RateLimiter } from '../lib/rate-limit.ts'
import { withTimeout } from '../lib/timeout.ts'

export const WELCOME_ERRORS = {
  rateLimit: 'Слишком много запросов. Попробуй чуть позже.',
  badRequest: 'Ошибка запроса. Попробуй ещё раз.',
  invalid: 'Заполни все обязательные поля.',
  delivery: 'Не удалось отправить данные. Попробуй ещё раз или напиши нам в WhatsApp.',
} as const

export const WELCOME_RESPONSE_TIMEOUT_MS = 28_000

export interface WelcomeRouterDeps {
  notify?: Notify
  rateLimiter?: RateLimiter
  /** Каталог сборки — для CSS страницы результата (dist/assets.json) */
  distDir?: string
}

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/** JSON-булево или значение формы без JS («yes»/«no», «true»/«false», «on»). */
function bool(v: unknown): boolean | null {
  if (typeof v === 'boolean') return v
  if (v === 'yes' || v === 'true' || v === 'on') return true
  if (v === 'no' || v === 'false') return false
  return null
}

/** Массив строк: JSON-массив или повторяющееся поле формы (одно значение приходит строкой). */
function list(v: unknown, max: number): string[] {
  const arr = Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : []
  return arr.map((s) => String(s).trim().slice(0, max)).filter(Boolean)
}

/** Нормализация анкеты (обрезка по длинам из спеки). */
export function parseWelcome(body: Record<string, unknown>): WelcomeData & { privacy_consent: boolean } {
  return {
    visit_type: body.visit_type === 'back' ? 'back' : 'new',
    name: str(body.name, 100),
    phone: str(body.phone, 30),
    address_form: body.address_form === 'ty' || body.address_form === 'vy' ? body.address_form : '',
    drink: str(body.drink, 50),
    milk: str(body.milk, 50),
    sugar: bool(body.sugar),
    cream: bool(body.cream),
    extra_drink_wish: str(body.extra_drink_wish, 500),
    car: bool(body.car),
    car_number: str(body.car_number, 20),
    talk_mode: str(body.talk_mode, 20),
    with_kid: bool(body.with_kid),
    kid_age: str(body.kid_age, 5),
    kid_needs: list(body.kid_needs, 50),
    contraindications: list(body.contraindications, 100),
    health_changed: bool(body.health_changed),
    health_notes: str(body.health_notes, 1000),
    tan: bool(body.tan),
    skin_notes: str(body.skin_notes, 500),
    source: str(body.source, 50),
    extra_notes: str(body.extra_notes, 1000),
    privacy_consent: body.privacy_consent === true || body.privacy_consent === 'on' || body.privacy_consent === 'true',
  }
}

function wantsJson(req: Request): boolean {
  return req.is('application/json') === 'application/json' || req.accepts(['html', 'json']) === 'json'
}

function stylesheets(distDir: string | undefined): string[] {
  if (!distDir) return []
  const file = join(resolve(distDir), 'assets.json')
  if (!existsSync(file)) return []
  try {
    return (JSON.parse(readFileSync(file, 'utf8')) as { css?: string[] }).css ?? []
  } catch {
    return []
  }
}

/** Страница результата для анкеты, отправленной без JavaScript. */
export function welcomeResultPage(opts: { ok: boolean; message: string; back: string; css: string[] }): string {
  const title = opts.ok ? 'Всё записали' : 'Анкета не отправлена'
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)} — LUCOVICA</title>
${opts.css.map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join('\n')}
</head>
<body>
<main class="ds-container ds-section">
<h1 class="ds-h1">${escapeHtml(title)}</h1>
<p class="ds-lead">${escapeHtml(opts.message)}</p>
${opts.ok ? '' : `<p><a class="ds-button" data-variant="solid" data-size="3" href="${escapeHtml(opts.back)}">Вернуться к анкете</a></p>`}
<p><a href="/">На главную</a></p>
</main>
</body>
</html>
`
}

export function welcomeRouter(deps: WelcomeRouterDeps = {}): Router {
  const notify = deps.notify ?? defaultNotify
  const limiter = deps.rateLimiter ?? createRateLimiter({ limit: 3, windowMs: 60_000 })
  const router = express.Router()

  router.post('/welcome', async (req: Request, res: Response) => {
    const json = wantsJson(req)
    const body = (req.body ?? {}) as Record<string, unknown>
    const back = body.visit_type === 'back' ? '/welcome/back' : '/welcome'
    const reply = (status: number, ok: boolean, error?: string) => {
      if (json) return void res.status(status).json(ok ? { ok: true } : { ok: false, error })
      const message = ok ? 'Готовимся к визиту. До встречи!' : (error ?? WELCOME_ERRORS.delivery)
      res.status(status).type('html').send(welcomeResultPage({ ok, message, back, css: stylesheets(deps.distDir) }))
    }

    if (!limiter.hit(req.ip ?? 'unknown')) return reply(429, false, WELCOME_ERRORS.rateLimit)
    if (typeof body !== 'object' || Array.isArray(body)) return reply(400, false, WELCOME_ERRORS.badRequest)

    // Ловушка для ботов: делаем вид, что всё хорошо
    if (str(body._hp, 200)) return reply(200, true)

    const { privacy_consent, ...data } = parseWelcome(body)
    if (!data.name || !hasFullPhone(data.phone) || !privacy_consent) return reply(422, false, WELCOME_ERRORS.invalid)
    data.phone = formatPhone(normalizePhone(data.phone))

    try {
      const result = await withTimeout(notify(formatWelcome(data)), WELCOME_RESPONSE_TIMEOUT_MS, 'notify')
      return delivered(result) ? reply(200, true) : reply(500, false, WELCOME_ERRORS.delivery)
    } catch (err) {
      console.error(`[welcome] уведомление не отправлено (${data.name}): ${(err as Error).message}`)
      return reply(500, false, WELCOME_ERRORS.delivery)
    }
  })

  return router
}
