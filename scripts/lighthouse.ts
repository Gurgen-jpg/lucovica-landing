// Lighthouse (мобильный профиль) против продакшен-сборки.
// Пороги — из спеки site-delivery. Запуск: npm run lighthouse [-- /laser-epil /sugaring]
// Сервер и Chrome запускаются и закрываются в этом же процессе.
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { mkdir, writeFile } from 'node:fs/promises'
import type { AddressInfo } from 'node:net'

process.env.NODE_ENV = 'production'
process.env.YM_ID = '' // Метрика не входит в бюджет и не должна получать тестовые визиты
const { build } = await import('./build.ts')
const { createApp } = await import('../server/app.ts')

const THRESHOLDS = { performance: 0.9, accessibility: 0.95, seo: 1 } as const
const JS_BUDGET_BYTES = 30 * 1024

const paths = process.argv.slice(2).filter((a) => a.startsWith('/'))
if (paths.length === 0) paths.push('/')

await build()
const server = createApp().listen(0)
const { port } = server.address() as AddressInfo
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] })

let failed = false
try {
  await mkdir('.lighthouse', { recursive: true })
  for (const path of paths) {
    const result = await lighthouse(`http://localhost:${port}${path}`, {
      port: chrome.port,
      output: 'html',
      logLevel: 'error',
      onlyCategories: Object.keys(THRESHOLDS),
    })
    if (!result) throw new Error(`Lighthouse не вернул результат для ${path}`)
    const { lhr } = result

    const items = (lhr.audits['network-requests']?.details as { items?: { resourceType?: string; url: string; transferSize?: number }[] })?.items ?? []
    const jsBytes = items
      .filter((i) => i.resourceType === 'Script' && !i.url.includes('mc.yandex.ru'))
      .reduce((sum, i) => sum + (i.transferSize ?? 0), 0)

    console.log(`\n${path}`)
    for (const [cat, min] of Object.entries(THRESHOLDS)) {
      const score = lhr.categories[cat]?.score ?? 0
      const ok = score >= min
      failed ||= !ok
      console.log(`  ${ok ? '✓' : '✗'} ${cat.padEnd(14)} ${Math.round(score * 100)} (порог ${min * 100})`)
    }
    const jsOk = jsBytes <= JS_BUDGET_BYTES
    failed ||= !jsOk
    console.log(`  ${jsOk ? '✓' : '✗'} ${'javascript'.padEnd(14)} ${(jsBytes / 1024).toFixed(1)} КБ (бюджет 30 КБ)`)

    const report = `.lighthouse/${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}.html`
    await writeFile(report, result.report as string)
    console.log(`  отчёт: ${report}`)
  }
} finally {
  chrome.kill()
  server.close()
}

process.exit(failed ? 1 : 0)
