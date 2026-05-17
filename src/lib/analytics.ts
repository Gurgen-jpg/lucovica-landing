/**
 * Отправляет цель в Яндекс Метрику (`reachGoal`).
 * Безопасно вызывается на сервере — ничего не делает, если `window` недоступен
 * или счётчик (`ym`) не загружен.
 *
 * @param goal Идентификатор цели, заданный в кабинете Метрики (например `'form_submit'`).
 */
export function track(goal: string): void {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ym = (window as any).ym
  if (typeof ym !== 'function') return
  const id = process.env.NEXT_PUBLIC_YM_ID
  if (id) ym(Number(id), 'reachGoal', goal)
}
