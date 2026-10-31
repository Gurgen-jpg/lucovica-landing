// Ручная проверка доставки: реальные тестовые уведомления в SMTP и Telegram из .env.
// Запуск: npm run smoke:notify            — заявка на запись
//         npm run smoke:notify -- welcome — анкеты нового и повторного гостя с флагом безопасности
// Не входит в npm test.
import { existsSync } from 'node:fs'
import { formatLead } from '../server/lib/notify/format-lead.ts'
import { formatWelcome, type WelcomeData } from '../server/lib/notify/format-welcome.ts'
import { notify, type StaffMessage } from '../server/lib/notify/index.ts'

if (existsSync('.env')) process.loadEnvFile('.env')

const welcomeBase: WelcomeData = {
  visit_type: 'new',
  name: 'ТЕСТ — проверка анкеты',
  phone: '+7 (977) 016-97-75',
  address_form: 'ty',
  drink: 'cappuccino',
  milk: 'banana',
  sugar: false,
  cream: true,
  extra_drink_wish: '',
  car: true,
  car_number: 'А123БВ 161',
  talk_mode: 'silent',
  with_kid: false,
  kid_age: '',
  kid_needs: [],
  contraindications: ['pregnancy'],
  health_changed: null,
  health_notes: '',
  tan: false,
  skin_notes: '',
  source: 'yandex_maps',
  extra_notes: 'Тестовая анкета — не обрабатывать',
}

const messages: StaffMessage[] = process.argv.includes('welcome')
  ? [
      formatWelcome(welcomeBase),
      formatWelcome({
        ...welcomeBase,
        visit_type: 'back',
        address_form: '',
        car: null,
        car_number: '',
        talk_mode: '',
        with_kid: null,
        tan: null,
        source: '',
        health_changed: true,
        health_notes: 'с марта',
        contraindications: ['lactation'],
      }),
    ]
  : [
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
    ]

let ok = true
for (const msg of messages) {
  const result = await notify(msg)
  console.log(msg.subject)
  console.log(`  email:    ${result.email ? 'доставлено' : 'НЕ доставлено'}`)
  console.log(`  telegram: ${result.telegram ? 'доставлено' : 'НЕ доставлено'}`)
  ok &&= result.email && result.telegram
}
process.exit(ok ? 0 : 1)
