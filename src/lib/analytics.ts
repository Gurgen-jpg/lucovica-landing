/**
 * Отправляет цель в Яндекс Метрику (`reachGoal`).
 * Безопасно вызывается на сервере — ничего не делает, если `window` недоступен
 * или счётчик (`ym`) не загружен.
 *
 * @param goal Идентификатор цели, заданный в кабинете Метрики (например `'form_submit'`).
 */
export function track(goal: string): void {
  callYm('reachGoal', goal)
}

/**
 * Отправляет просмотр страницы (`hit`) — нужен при клиентской навигации Next.js,
 * когда страница не перезагружается и `init` повторно не срабатывает.
 */
export function trackHit(url: string, referer?: string): void {
  callYm('hit', url, referer ? { referer } : undefined)
}

/**
 * Как `track`, но дожидается загрузки счётчика: при прямом заходе на страницу
 * эффекты React могут выполниться раньше, чем скрипт Метрики (`afterInteractive`).
 */
export function trackWhenReady(goal: string, timeoutMs = 10000): () => void {
  const start = Date.now()
  let timer: ReturnType<typeof setTimeout> | undefined
  const attempt = () => {
    if (callYm('reachGoal', goal)) return
    if (Date.now() - start < timeoutMs) timer = setTimeout(attempt, 200)
  }
  attempt()
  return () => clearTimeout(timer)
}

function callYm(...args: unknown[]): boolean {
  if (typeof window === 'undefined') return false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ym = (window as any).ym
  if (typeof ym !== 'function') return false
  const id = process.env.NEXT_PUBLIC_YM_ID
  if (!id) return false
  ym(Number(id), ...args)
  return true
}
