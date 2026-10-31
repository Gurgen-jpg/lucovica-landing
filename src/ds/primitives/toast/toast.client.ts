// Уведомления: live-region role="status", без перехвата фокуса, автозакрытие через 5 с.

export const TOAST_TIMEOUT = 5000

const CLOSE_SVG =
  '<svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1"/></svg>'

let region: HTMLElement | null = null

/** Область создаётся заранее: содержимое, добавленное в уже существующий live-region, объявляется надёжнее. */
function ensureRegion(): HTMLElement {
  if (region?.isConnected) return region
  region = document.querySelector<HTMLElement>('.ds-toast-region')
  if (!region) {
    region = document.createElement('div')
    region.className = 'ds-toast-region'
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', 'polite')
    document.body.append(region)
  }
  return region
}

export interface ToastOptions {
  title: string
  text?: string
  /** мс; 0 — не закрывать автоматически */
  timeout?: number
}

export function toast({ title, text, timeout = TOAST_TIMEOUT }: ToastOptions): HTMLElement {
  const item = document.createElement('div')
  item.className = 'ds-toast ds-inverse'

  const body = document.createElement('div')
  body.className = 'ds-toast__body'
  const t = document.createElement('p')
  t.className = 'ds-toast__title'
  t.textContent = title
  body.append(t)
  if (text) {
    const p = document.createElement('p')
    p.className = 'ds-toast__text'
    p.textContent = text
    body.append(p)
  }

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'ds-toast__close'
  close.setAttribute('aria-label', 'Закрыть уведомление')
  close.innerHTML = CLOSE_SVG

  let timer: ReturnType<typeof setTimeout> | undefined
  const dismiss = () => {
    clearTimeout(timer)
    item.remove()
  }
  close.addEventListener('click', dismiss)
  if (timeout > 0) timer = setTimeout(dismiss, timeout)

  item.append(body, close)
  ensureRegion().append(item)
  return item
}

export function init(): void {
  ensureRegion()
}
