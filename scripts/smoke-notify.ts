// Ручная проверка доставки: реальная тестовая заявка в SMTP и Telegram из .env.
// Запуск: npm run smoke:notify (не входит в npm test).
import { existsSync } from 'node:fs'
import { formatLead } from '../server/lib/notify/format-lead.ts'
import { notify } from '../server/lib/notify/index.ts'

if (existsSync('.env')) process.loadEnvFile('.env')

const result = await notify(
  formatLead({
    name: 'ТЕСТ — проверка уведомлений',
    phone: '+7 (977) 016-97-75',
    service: 'Лазерная эпиляция — Девушки',
    time: 'День 13–17',
    contact_method: 'Звонок',
    promo: 'Первый визит — подмышки бесплатно',
    utm_source: 'smoke',
    utm_medium: 'script',
  }),
)

console.log(`email:    ${result.email ? 'доставлено' : 'НЕ доставлено'}`)
console.log(`telegram: ${result.telegram ? 'доставлено' : 'НЕ доставлено'}`)
process.exit(result.email && result.telegram ? 0 : 1)
