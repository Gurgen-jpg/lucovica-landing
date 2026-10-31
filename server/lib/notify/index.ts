// Доставка персоналу: email и Telegram параллельно; успех — хотя бы один канал.
import { sendEmail } from './email.ts'
import { sendTelegram } from './telegram.ts'
import type { StaffMessage } from './types.ts'

export type { StaffMessage } from './types.ts'

export interface NotifyResult {
  email: boolean
  telegram: boolean
}

export type Notify = (msg: StaffMessage) => Promise<NotifyResult>

export interface NotifyDeps {
  email?: (msg: StaffMessage) => Promise<void>
  telegram?: (msg: StaffMessage) => Promise<void>
}

export function createNotify(deps: NotifyDeps = {}): Notify {
  const email = deps.email ?? ((m: StaffMessage) => sendEmail(m))
  const telegram = deps.telegram ?? ((m: StaffMessage) => sendTelegram(m))
  return async (msg) => {
    const [e, t] = await Promise.allSettled([email(msg), telegram(msg)])
    // В логах только имя — без телефона
    const who = msg.logName ? ` (${msg.logName})` : ''
    if (e.status === 'rejected') console.error(`[notify] email не доставлен${who}: ${(e.reason as Error)?.message}`)
    if (t.status === 'rejected') console.error(`[notify] telegram не доставлен${who}: ${(t.reason as Error)?.message}`)
    return { email: e.status === 'fulfilled', telegram: t.status === 'fulfilled' }
  }
}

export const notify: Notify = createNotify()

export const delivered = (r: NotifyResult): boolean => r.email || r.telegram
