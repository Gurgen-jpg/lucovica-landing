import { leadRouter } from './api/lead.ts'
import { createApp } from './app.ts'
import type { Notify } from './lib/notify/index.ts'

const port = Number(process.env.PORT) || 3000

// Только для e2e: уведомления не отправляются, заявка считается доставленной
const dryRunNotify: Notify = async (msg) => {
  console.log(`[dry-run] уведомление: ${msg.subject}`)
  return { email: true, telegram: true }
}

const app = createApp({
  api: [leadRouter({ distDir: 'dist', notify: process.env.NOTIFY_DRY_RUN === '1' ? dryRunNotify : undefined })],
})

const server = app.listen(port, () => {
  console.log(`LUCOVICA: http://localhost:${port}`)
})

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
