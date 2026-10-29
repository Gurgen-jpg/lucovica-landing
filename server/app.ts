import compression from 'compression'
import express, { type Express, type NextFunction, type Request, type Response, type Router } from 'express'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export interface AppOptions {
  /** Каталог собранного сайта */
  distDir?: string
  /** Роутеры API, монтируются под /api */
  api?: Router[]
  /** Перечитывать routes.json на каждый запрос (dev-режим) */
  reloadRoutes?: boolean
  /** Дополнительные middleware до раздачи страниц (dev: live reload) */
  before?: ((app: Express) => void)[]
}

const HASHED_DIRS = /^\/(assets|img|fonts)\//
const HIDDEN_FILES = new Set(['/routes.json', '/assets.json', '/img/manifest.json', '/404.html'])

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  next()
}

/** /x/ и /x.html → 301 на /x с сохранением query; /index.html → / */
function canonicalUrl(req: Request, res: Response, next: NextFunction) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  const path = req.path
  let target: string | null = null
  if (path === '/index.html') target = '/'
  else if (path.length > 1 && path.endsWith('/')) target = path.replace(/\/+$/, '') || '/'
  else if (path.endsWith('.html') && !HASHED_DIRS.test(path)) target = path.slice(0, -'.html'.length)
  if (target === null) return next()
  const q = req.originalUrl.indexOf('?')
  res.redirect(301, target + (q >= 0 ? req.originalUrl.slice(q) : ''))
}

export function createApp(opts: AppOptions = {}): Express {
  const dist = resolve(opts.distDir ?? 'dist')
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1)

  const readRoutes = (): Record<string, string> => {
    const file = join(dist, 'routes.json')
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  }
  let routes = readRoutes()

  app.use(securityHeaders)
  app.use(compression())
  app.use(canonicalUrl)

  app.get('/healthz', (_req, res) => {
    res.type('text/plain').setHeader('Cache-Control', 'no-store')
    res.send('ok')
  })

  const api = express.Router()
  api.use(express.json({ limit: '32kb' }))
  api.use(express.urlencoded({ extended: false, limit: '32kb' }))
  for (const r of opts.api ?? []) api.use(r)
  api.use((_req, res) => {
    res.status(404).json({ ok: false, error: 'Not found' })
  })
  app.use('/api', api)

  for (const hook of opts.before ?? []) hook(app)

  // HTML-страницы — строго по карте routes.json
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    if (opts.reloadRoutes) routes = readRoutes()
    const file = routes[req.path]
    if (!file) return next()
    res.setHeader('Cache-Control', 'no-cache')
    res.sendFile(join(dist, file), { lastModified: true, etag: true }, (err) => err && next(err))
  })

  app.use((req, res, next) => (HIDDEN_FILES.has(req.path) ? res.status(404).end() : next()))

  app.use(
    express.static(dist, {
      index: false,
      redirect: false,
      dotfiles: 'ignore',
      setHeaders(res, filePath) {
        const urlPath = '/' + filePath.slice(dist.length + 1).replaceAll('\\', '/')
        res.setHeader(
          'Cache-Control',
          HASHED_DIRS.test(urlPath) ? 'public, max-age=31536000, immutable' : 'public, max-age=86400',
        )
      },
    }),
  )

  app.use((_req, res) => {
    const page = join(dist, '404.html')
    res.status(404).setHeader('Cache-Control', 'no-cache')
    if (existsSync(page)) res.sendFile(page)
    else res.type('text/plain').send('Not found')
  })

  // Ошибки: тело больше лимита / битый JSON в /api отдаются как JSON
  app.use((err: Error & { status?: number; type?: string }, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? 500
    if (status >= 500) console.error(err)
    if (req.path.startsWith('/api/')) {
      const error =
        err.type === 'entity.too.large'
          ? 'Слишком большой запрос.'
          : err.type === 'entity.parse.failed'
            ? 'Ошибка запроса. Попробуйте ещё раз.'
            : 'Ошибка сервера.'
      res.status(status).json({ ok: false, error })
      return
    }
    res.status(status).type('text/plain').send(status === 404 ? 'Not found' : 'Server error')
  })

  return app
}
