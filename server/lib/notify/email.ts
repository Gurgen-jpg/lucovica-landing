// Email через SMTP Timeweb: порты по очереди 587 → 465 → 2525, общий таймаут 25 с.
import nodemailer from 'nodemailer'
import { withTimeout } from '../timeout.ts'
import type { StaffMessage } from './types.ts'

export const SMTP_HOST = 'smtp.timeweb.ru'
export const EMAIL_TIMEOUT_MS = 25_000

export const SMTP_CONFIGS = [
  { port: 587, secure: false, requireTLS: true, connectionTimeout: 7_000, label: 'STARTTLS:587' },
  { port: 465, secure: true, requireTLS: false, connectionTimeout: 7_000, label: 'SMTPS:465' },
  { port: 2525, secure: false, requireTLS: true, connectionTimeout: 15_000, label: 'STARTTLS:2525' },
] as const

type CreateTransport = (options: {
  host: string
  port: number
  secure: boolean
  requireTLS: boolean
  auth: { user: string; pass: string }
  connectionTimeout: number
  greetingTimeout: number
  socketTimeout: number
}) => { sendMail(mail: { from: string; to: string; subject: string; html: string }): Promise<unknown> }

export interface EmailDeps {
  createTransport?: CreateTransport
  env?: NodeJS.ProcessEnv
}

/** Отправляет письмо; бросает ошибку, если не удалось ни через один порт или не заданы учётные данные. */
export async function sendEmail(msg: StaffMessage, deps: EmailDeps = {}): Promise<void> {
  const env = deps.env ?? process.env
  const createTransport: CreateTransport = deps.createTransport ?? ((o) => nodemailer.createTransport(o))
  const user = env.SMTP_USER
  const pass = env.SMTP_PASS
  if (!user || !pass) throw new Error('SMTP не настроен (SMTP_USER/SMTP_PASS)')
  const to = env.NOTIFY_EMAIL || user

  const attempt = async () => {
    let lastError: unknown
    for (const c of SMTP_CONFIGS) {
      try {
        const transport = createTransport({
          host: SMTP_HOST,
          port: c.port,
          secure: c.secure,
          requireTLS: c.requireTLS,
          auth: { user, pass },
          connectionTimeout: c.connectionTimeout,
          greetingTimeout: c.connectionTimeout,
          socketTimeout: 15_000,
        })
        await transport.sendMail({ from: `"LUCOVICA" <${user}>`, to, subject: msg.subject, html: msg.html })
        return
      } catch (err) {
        console.error(`[email] ${c.label} не удалось: ${(err as Error).message}`)
        lastError = err
      }
    }
    throw lastError
  }

  await withTimeout(attempt(), EMAIL_TIMEOUT_MS, 'email')
}
