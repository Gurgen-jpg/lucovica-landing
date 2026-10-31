// POST /api/lead — приём заявки на запись (спека lead-api).
import { site } from '../../src/content/site.ts'
import express, { type Request, type Response, type Router } from 'express'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { formatPhone, hasFullPhone, normalizePhone } from '../../src/shared/phone.ts'
import { escapeHtml } from '../lib/escape-html.ts'
import { formatLead, type Lead } from '../lib/notify/format-lead.ts'
import { delivered, notify as defaultNotify, type Notify } from '../lib/notify/index.ts'
import { createRateLimiter, type RateLimiter } from '../lib/rate-limit.ts'
import { withTimeout } from '../lib/timeout.ts'

export const LEAD_ERRORS = {
  invalid: 'Укажите имя и телефон.',
  rateLimit: 'Слишком много запросов. Попробуйте через минуту.',
  delivery: 'Не удалось отправить заявку.',
} as const

/** Ответ клиенту не позже 30 с: уведомления ограничены 28 с. */
export const LEAD_RESPONSE_TIMEOUT_MS = 28_000

export interface LeadRouterDeps {
  notify?: Notify
  rateLimiter?: RateLimiter
  /** Каталог сборки — для CSS страницы результата (dist/assets.json) */
  distDir?: string
}

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const opt = (v: unknown, max: number): string | undefined => str(v, max) || undefined

/** Поля заявки: обрезка по пробелам и длине, значения по умолчанию. */
export function parseLead(body: Record<string, unknown>): Lead {
  return {
    name: str(body.name, 100),
    phone: str(body.phone, 30),
    service: str(body.service, 100) || 'Не указана',
    time: str(body.time, 50) || 'Не указано',
    contact_method: str(body.contact_method, 30) || 'Звонок',
    promo: opt(body.promo, 100),
    utm_source: opt(body.utm_source, 50),
    utm_medium: opt(body.utm_medium, 50),
    utm_campaign: opt(body.utm_campaign, 100),
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

/** Страница результата для отправки формы без JavaScript. */
export function resultPage(opts: { ok: boolean; message: string; css: string[] }): string {
  const title = opts.ok ? 'Заявка принята!' : 'Заявка не отправлена'
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
<main class="ds-container ds-section lead-result">
<h1 class="ds-h1">${escapeHtml(title)}</h1>
<p class="ds-lead">${escapeHtml(opts.message)}</p>
<p><a class="ds-button" data-variant="solid" data-size="3" href="/">На главную</a></p>
<p><a href="/#contacts">Вернуться назад</a></p>
</main>
</body>
</html>
`
}

export function leadRouter(deps: LeadRouterDeps = {}): Router {
  const notify = deps.notify ?? defaultNotify
  const limiter = deps.rateLimiter ?? createRateLimiter({ limit: 5, windowMs: 60_000 })
  const router = express.Router()

  router.post('/lead', async (req: Request, res: Response) => {
    const json = wantsJson(req)
    const reply = (status: number, ok: boolean, error?: string) => {
      if (json) return void res.status(status).json(ok ? { ok: true } : { ok: false, error })
      const message = ok
        ? `Перезвоним в течение часа, ежедневно с ${site.hours.opens} до ${site.hours.closes}.`
        : `${error ?? LEAD_ERRORS.delivery} Попробуйте ещё раз или позвоните нам.`
      res.status(status).type('html').send(resultPage({ ok, message, css: stylesheets(deps.distDir) }))
    }

    const body = (req.body ?? {}) as Record<string, unknown>
    if (typeof body !== 'object' || Array.isArray(body)) return reply(400, false, 'Ошибка запроса. Попробуйте ещё раз.')

    if (!limiter.hit(req.ip ?? 'unknown')) return reply(429, false, LEAD_ERRORS.rateLimit)

    // Ловушка для ботов: делаем вид, что всё хорошо
    if (str(body._hp, 200)) return reply(200, true)

    const lead = parseLead(body)
    if (!lead.name || !hasFullPhone(lead.phone)) return reply(422, false, LEAD_ERRORS.invalid)
    lead.phone = formatPhone(normalizePhone(lead.phone))

    try {
      const result = await withTimeout(notify(formatLead(lead)), LEAD_RESPONSE_TIMEOUT_MS, 'notify')
      return delivered(result) ? reply(200, true) : reply(500, false, LEAD_ERRORS.delivery)
    } catch (err) {
      console.error(`[lead] уведомление не отправлено (${lead.name}): ${(err as Error).message}`)
      return reply(500, false, LEAD_ERRORS.delivery)
    }
  })

  return router
}
