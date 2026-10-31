// Мастер анкет /welcome и /welcome/back (welcome-intake D2): один шаг за раз, правила шагов — таблица ниже.
import { COFFEE, MILK_TRIGGER, NO_CONTRAINDICATIONS } from '../content/welcome-options.ts'
import { clearFieldError, setFieldError } from '../ds/primitives/field/field.client.ts'
import { formatPhone, isValidPhone, normalizePhone } from '../shared/phone.ts'
import { track } from './analytics.ts'
import { attachPhoneMask } from './phone-mask.ts'

export type Visit = 'new' | 'back'

const FALLBACK_ERROR = 'Что-то пошло не так. Попробуй ещё раз.'

/** Ошибка с текстом от сервера — показывается гостю как есть; сетевые ошибки — общим текстом. */
class ServerError extends Error {}

/** Ответы анкеты в виде, удобном для правил и отправки. */
export interface Answers {
  get(name: string): string
  all(name: string): string[]
}

export function readAnswers(form: HTMLFormElement): Answers {
  const data = new FormData(form)
  return {
    get: (name) => String(data.get(name) ?? '').trim(),
    all: (name) => data.getAll(name).map(String),
  }
}

/** Зависимые блоки: показаны, только если условие выполнено. */
export const DEPENDENCIES: Record<string, (a: Answers) => boolean> = {
  milk: (a) => MILK_TRIGGER.has(a.get('drink')),
  coffee: (a) => COFFEE.has(a.get('drink')),
  car: (a) => a.get('car') === 'yes',
  kid: (a) => a.get('with_kid') === 'yes',
  health: (a) => a.get('health_changed') === 'yes',
}

const contacts = (a: Answers) => !!a.get('name') && isValidPhone(a.get('phone'))

/** Можно ли уйти дальше с шага: обязательные поля заполнены. */
export const STEP_RULES: Record<Visit, Record<number, (a: Answers, opts: { contactsShown: boolean }) => boolean>> = {
  new: {
    1: (a) => contacts(a) && !!a.get('address_form'),
    2: (a) => !!a.get('drink'),
    3: (a) => !!a.get('car'),
    4: (a) => !!a.get('talk_mode') && !!a.get('with_kid'),
    5: (a) => a.all('contraindications').length > 0 && !!a.get('tan'),
    6: (a) => !!a.get('source') && a.get('privacy_consent') === 'on',
  },
  back: {
    0: (a, o) => !o.contactsShown || contacts(a),
    1: (a) =>
      a.get('health_changed') === 'no' ||
      (a.get('health_changed') === 'yes' && a.all('contraindications').length > 0 && !!a.get('health_notes')),
    2: (a) => !!a.get('drink'),
    3: (a) => a.get('privacy_consent') === 'on',
  },
}

const bool = (v: string): boolean | null => (v === 'yes' ? true : v === 'no' ? false : null)

/** Тело запроса /api/welcome (как у текущего сайта: булевы, массивы, тип визита, ловушка). */
export function payload(visit: Visit, a: Answers): Record<string, unknown> {
  const drink = a.get('drink')
  const common = {
    visit_type: visit,
    name: a.get('name'),
    phone: formatPhone(normalizePhone(a.get('phone'))),
    drink,
    milk: MILK_TRIGGER.has(drink) ? a.get('milk') : '',
    sugar: COFFEE.has(drink) ? bool(a.get('sugar')) : null,
    cream: COFFEE.has(drink) ? bool(a.get('cream')) : null,
    extra_drink_wish: a.get('extra_drink_wish'),
    extra_notes: a.get('extra_notes'),
    privacy_consent: a.get('privacy_consent') === 'on',
    _hp: a.get('_hp'),
  }
  if (visit === 'back') {
    const changed = bool(a.get('health_changed'))
    return {
      ...common,
      address_form: '',
      health_changed: changed,
      health_notes: changed ? a.get('health_notes') : '',
      contraindications: changed ? a.all('contraindications') : [],
    }
  }
  const car = bool(a.get('car'))
  const kid = bool(a.get('with_kid'))
  return {
    ...common,
    address_form: a.get('address_form'),
    car,
    car_number: car ? a.get('car_number') : '',
    talk_mode: a.get('talk_mode'),
    with_kid: kid,
    kid_age: kid ? a.get('kid_age') : '',
    kid_needs: kid ? a.all('kid_needs') : [],
    contraindications: a.all('contraindications'),
    tan: bool(a.get('tan')),
    skin_notes: a.get('skin_notes'),
    source: a.get('source'),
  }
}

function setup(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('form[data-welcome-form]')
  if (!form || root.dataset.enhanced !== undefined) return
  const visit: Visit = root.dataset.welcome === 'back' ? 'back' : 'new'
  const steps = Array.from(root.querySelectorAll<HTMLElement>('.welcome-step'))
  const formSteps = steps.filter((s) => form.contains(s))
  const last = formSteps.length - 1
  const thanks = steps.find((s) => !form.contains(s))
  const counter = root.querySelector<HTMLElement>('[data-counter]')
  const counterValue = root.querySelector<HTMLElement>('[data-counter-value]')
  const progress = root.querySelector<HTMLProgressElement>('[data-progress]')
  const error = form.querySelector<HTMLElement>('[data-error]')
  const name = form.querySelector<HTMLInputElement>('[name="name"]')
  const phone = form.querySelector<HTMLInputElement>('[name="phone"]')
  const contactsBlock = form.querySelector<HTMLElement>('[data-contacts]')

  root.dataset.enhanced = ''
  form.noValidate = true
  root.querySelectorAll<HTMLElement>('[data-nav], [data-back]').forEach((el) => (el.hidden = false))

  // Подстановка из ссылки: ?name=Анна&phone=89770169775
  const params = new URLSearchParams(location.search)
  const qName = params.get('name')?.trim() ?? ''
  const qPhone = params.get('phone') ?? ''
  if (name && qName) name.value = qName.slice(0, 100)
  if (phone) {
    if (qPhone) phone.value = formatPhone(normalizePhone(qPhone))
    attachPhoneMask(phone)
  }
  root.querySelectorAll<HTMLElement>('[data-greet-name]').forEach((el) => {
    if (!qName) return
    el.textContent = visit === 'back' ? `, ${qName}` : `${qName}, `
  })
  if (visit === 'new') {
    // «Анна, давай…» — первое слово после имени со строчной буквы
    const lead = root.querySelector('[data-greet-name]')?.nextSibling
    if (qName && lead?.nodeType === Node.TEXT_NODE) lead.textContent = lead.textContent!.replace(/^Д/, 'д')
  }
  // Повторный гость с корректной ссылкой — без полей контактов
  const contactsShown = !(contactsBlock && qName && isValidPhone(qPhone))
  if (contactsBlock) contactsBlock.hidden = !contactsShown

  let current = 0
  let sending = false

  const render = () => {
    const a = readAnswers(form)
    for (const [dep, visible] of Object.entries(DEPENDENCIES)) {
      form.querySelectorAll<HTMLElement>(`[data-dep="${dep}"]`).forEach((el) => (el.hidden = !visible(a)))
    }
    const rule = STEP_RULES[visit][current]
    const ready = rule ? rule(a, { contactsShown }) : true
    formSteps[current]?.querySelectorAll<HTMLButtonElement>('[data-next], [data-submit]').forEach((b) => {
      b.disabled = !ready || sending
    })
    root.dataset.address = a.get('address_form') === 'vy' ? 'vy' : 'ty'
    const shown = current > 0 && current <= last
    if (counter) counter.hidden = !shown
    if (progress) {
      progress.hidden = !shown
      progress.value = current
    }
    if (counterValue) counterValue.textContent = String(current)
  }

  const show = (n: number, focus = true) => {
    current = n
    formSteps.forEach((s, i) => (s.hidden = i !== n))
    if (thanks) thanks.hidden = true
    render()
    if (focus) {
      window.scrollTo({ top: 0 })
      formSteps[n]?.querySelector<HTMLElement>('.welcome-step__title')?.focus()
    }
  }

  form.addEventListener('click', (e) => {
    const target = e.target as Element
    if (target.closest('[data-next]')) {
      if (visit === 'new' && current >= 1 && current <= 5) track(`welcome_step_${current + 1}`)
      show(Math.min(current + 1, last))
    } else if (target.closest('[data-back]')) {
      show(Math.max(current - 1, 0))
    }
  })

  form.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement
    if (input.name === 'drink') {
      // Смена напитка сбрасывает зависимые ответы
      form.querySelectorAll<HTMLInputElement>('[name="milk"], [name="sugar"], [name="cream"]').forEach((r) => (r.checked = false))
    }
    if (input.name === 'contraindications' && input.checked) {
      // «Ничего из перечисленного» исключает остальные пункты и наоборот
      const none = input.value === NO_CONTRAINDICATIONS
      form.querySelectorAll<HTMLInputElement>('[name="contraindications"]').forEach((c) => {
        if (c !== input && (none || c.value === NO_CONTRAINDICATIONS)) c.checked = false
      })
    }
    render()
  })
  form.addEventListener('input', () => {
    render()
    if (phone && isValidPhone(phone.value)) clearFieldError(phone)
  })
  phone?.addEventListener('blur', () => {
    if (phone.value && !isValidPhone(phone.value)) setFieldError(phone, 'Введи полный номер телефона')
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (sending) return
    const a = readAnswers(form)
    if (!STEP_RULES[visit][current]?.(a, { contactsShown })) return
    sending = true
    form.dataset.state = 'sending'
    if (error) error.hidden = true
    render()
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload(visit, a)),
      })
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok || !body?.ok) throw new ServerError(body?.error || FALLBACK_ERROR)
      track('welcome_submitted')
      form.hidden = true
      if (counter) counter.hidden = true
      if (progress) progress.hidden = true
      if (thanks) {
        thanks.hidden = false
        window.scrollTo({ top: 0 })
        thanks.querySelector<HTMLElement>('.welcome-step__title')?.focus()
      }
    } catch (err) {
      if (error) {
        error.textContent = err instanceof ServerError ? err.message : FALLBACK_ERROR
        error.hidden = false
      }
    } finally {
      sending = false
      delete form.dataset.state
      render()
    }
  })

  show(0, false)
}

export function initWelcome(root: Document = document): void {
  root.querySelectorAll<HTMLElement>('[data-welcome]').forEach(setup)
}
