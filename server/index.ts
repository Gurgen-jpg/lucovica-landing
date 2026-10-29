import { createApp } from './app.ts'

const port = Number(process.env.PORT) || 3000
const app = createApp()

const server = app.listen(port, () => {
  console.log(`LUCOVICA: http://localhost:${port}`)
})

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
