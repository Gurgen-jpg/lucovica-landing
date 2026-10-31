// UTM-метки последнего касания на время сессии (booking-pipeline D6).
// sessionStorage может быть недоступен (приватный режим) — тогда просто без UTM.

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>

const STORAGE_KEY = 'lucovica:utm'

/** Если в адресе есть utm_*, запомнить их (новый вход перезаписывает прежние метки). */
export function captureUtm(search: string = location.search): void {
  const params = new URLSearchParams(search)
  const utm: Utm = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) utm[key] = value
  }
  if (!Object.keys(utm).length) return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm))
  } catch {
    // хранилище недоступно
  }
}

export function readUtm(): Utm {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as Record<string, unknown>
    const utm: Utm = {}
    for (const key of UTM_KEYS) if (typeof data[key] === 'string') utm[key] = data[key]
    return utm
  } catch {
    return {}
  }
}
