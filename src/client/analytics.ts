// Цели Яндекс Метрики.
// Сниппет в <head> сразу создаёт очередь window.ym, поэтому цели до загрузки tag.js не теряются.
// Если ym ещё нет (сниппет вставлен позже скрипта), ждём её появления до 10 секунд.

type Ym = (id: number, method: string, ...args: unknown[]) => void

declare global {
  interface Window {
    ym?: Ym
    __YM_ID?: number
  }
}

const POLL_MS = 200
const WAIT_LIMIT_MS = 10_000

export function track(goal: string): void {
  const id = window.__YM_ID
  if (!id) return
  if (typeof window.ym === 'function') {
    window.ym(id, 'reachGoal', goal)
    return
  }
  const started = Date.now()
  const timer = setInterval(() => {
    if (typeof window.ym === 'function') {
      clearInterval(timer)
      window.ym(id, 'reachGoal', goal)
    } else if (Date.now() - started >= WAIT_LIMIT_MS) {
      clearInterval(timer)
    }
  }, POLL_MS)
}

/** Декларативные цели: клик по элементу с data-goal и цель просмотра страницы из body[data-page-goal]. */
export function initAnalytics(root: Document = document): void {
  root.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest?.('[data-goal]')
    const goal = target?.getAttribute('data-goal')
    if (goal) track(goal)
  })
  const pageGoal = root.body?.dataset.pageGoal
  if (pageGoal) track(pageGoal)
}
