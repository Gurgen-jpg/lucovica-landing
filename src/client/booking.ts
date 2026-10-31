// Форма записи (booking-form): открытие диалога по [data-booking], валидация, отправка, состояния.
import { openDialog } from '../ds/primitives/dialog/dialog.client.ts'
import { clearFieldError, setFieldError } from '../ds/primitives/field/field.client.ts'
import { isValidPhone, normalizePhone, formatPhone } from '../shared/phone.ts'
import { track } from './analytics.ts'
import { attachPhoneMask } from './phone-mask.ts'
import { readUtm } from './utm.ts'

const CERTIFICATE = 'Подарочный сертификат'
const NAME_ERROR = 'Укажите имя'
const PHONE_ERROR = 'Введите номер полностью'

type State = 'idle' | 'sending' | 'success' | 'error'

interface Parts {
  form: HTMLFormElement
  name: HTMLInputElement
  phone: HTMLInputElement
  service: HTMLSelectElement
  promo: HTMLInputElement | null
  detail: HTMLElement | null
  detailText: HTMLElement | null
  error: HTMLElement | null
  success: HTMLElement | null
  submit: HTMLButtonElement | null
}

function parts(form: HTMLFormElement): Parts {
  const q = <T extends Element>(sel: string) => form.querySelector<T>(sel)
  return {
    form,
    name: q<HTMLInputElement>('[name="name"]')!,
    phone: q<HTMLInputElement>('[name="phone"]')!,
    service: q<HTMLSelectElement>('[name="service"]')!,
    promo: q<HTMLInputElement>('[name="promo"]'),
    detail: q<HTMLElement>('[data-detail]'),
    detailText: q<HTMLElement>('[data-detail-text]'),
    error: q<HTMLElement>('[data-error]'),
    success: q<HTMLElement>('[data-success]'),
    submit: q<HTMLButtonElement>('button[type="submit"]'),
  }
}

/** Режим сертификата — на форме и на диалоге (заголовок диалога). */
function syncMode(p: Parts): void {
  const cert = p.service.value === CERTIFICATE
  for (const el of [p.form, p.form.closest('dialog')]) el?.toggleAttribute('data-cert', cert)
}

function setDetail(p: Parts, detail: string): void {
  if (!p.detail || !p.detailText) return
  p.detailText.textContent = detail
  p.detail.hidden = !detail
  p.form.dataset.detail = detail
}

function setState(p: Parts, state: State, message = ''): void {
  p.form.dataset.state = state
  const fields = p.form.querySelector<HTMLElement>('.booking-form__fields')
  if (fields) fields.hidden = state === 'success'
  if (p.success) p.success.hidden = state !== 'success'
  if (p.submit) p.submit.disabled = state === 'sending'
  if (p.error) {
    p.error.textContent = message
    p.error.hidden = !message
  }
}

function validate(p: Parts): boolean {
  let first: HTMLElement | null = null
  if (!p.name.value.trim()) {
    setFieldError(p.name, NAME_ERROR)
    first = p.name
  } else clearFieldError(p.name)
  if (!isValidPhone(p.phone.value)) {
    setFieldError(p.phone, PHONE_ERROR)
    first ??= p.phone
  } else clearFieldError(p.phone)
  first?.focus()
  return !first
}

function payload(p: Parts): Record<string, string> {
  const data = new FormData(p.form)
  const get = (k: string) => String(data.get(k) ?? '').trim()
  const cert = p.service.value === CERTIFICATE
  const detail = p.form.dataset.detail ?? ''
  const service = get('service')
  return {
    name: get('name'),
    phone: formatPhone(normalizePhone(get('phone'))),
    service: service && detail ? `${service} — ${detail}` : service,
    time: cert ? CERTIFICATE : get('time'),
    contact_method: get('contact_method') || 'Звонок',
    promo: !cert && p.promo?.checked ? p.promo.value : '',
    _hp: get('_hp'),
    ...readUtm(),
  }
}

async function submit(p: Parts): Promise<void> {
  if (p.form.dataset.state === 'sending') return
  if (!validate(p)) return
  setState(p, 'sending')
  try {
    const res = await fetch(p.form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload(p)),
    })
    const body = (await res.json().catch(() => null)) as { ok?: boolean } | null
    if (!res.ok || !body?.ok) throw new Error(`HTTP ${res.status}`)
    setState(p, 'success')
    track('form_submit')
    p.success?.focus()
  } catch {
    const phone = p.form.dataset.phone ?? ''
    setState(p, 'error', `Не удалось отправить заявку. Попробуйте ещё раз или позвоните: ${phone}`.trim())
  }
}

/** Открытие с кнопки: сбросить время, ошибки и результат, сохранить имя и телефон. */
function prepare(p: Parts, trigger: HTMLElement): void {
  setState(p, 'idle')
  clearFieldError(p.name)
  clearFieldError(p.phone)
  p.form.querySelectorAll<HTMLInputElement>('[name="time"]').forEach((r) => (r.checked = false))
  p.service.value = trigger.dataset.service ?? ''
  if (p.promo) p.promo.checked = trigger.dataset.promo !== undefined
  setDetail(p, trigger.dataset.detail ?? '')
  syncMode(p)
}

function setup(form: HTMLFormElement): Parts {
  const p = parts(form)
  form.noValidate = true
  attachPhoneMask(p.phone)
  syncMode(p)
  p.service.addEventListener('change', () => {
    setDetail(p, '')
    syncMode(p)
  })
  form.addEventListener('input', (e) => {
    const t = e.target
    if (t === p.name && p.name.value.trim()) clearFieldError(p.name)
    if (t === p.phone && isValidPhone(p.phone.value)) clearFieldError(p.phone)
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    void submit(p)
  })
  return p
}

export function initBooking(root: Document = document): void {
  const forms = Array.from(root.querySelectorAll<HTMLFormElement>('form[data-booking-form]')).map(setup)
  const dlg = root.getElementById('booking')
  const dialogForm = forms.find((p) => dlg?.contains(p.form))
  if (!(dlg instanceof HTMLDialogElement) || !dialogForm) return

  root.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLElement>('[data-booking]')
    if (!trigger) return
    e.preventDefault()
    prepare(dialogForm, trigger)
    openDialog(dlg, trigger)
  })
}
