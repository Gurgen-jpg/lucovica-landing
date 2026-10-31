// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { initWelcome, payload, readAnswers, STEP_RULES } from '../../src/client/welcome.ts'

// Шаблон анкеты — серверный модуль (импортирует config с process.env): грузим динамически,
// чтобы его типы проверял серверный tsconfig, а не браузерный.
const TEMPLATE = '../../src/sections/welcome/welcome.ts'
const { welcomeBack, welcomeNew } = (await import(/* @vite-ignore */ TEMPLATE)) as {
  welcomeNew: () => { value: string }
  welcomeBack: () => { value: string }
}

function mount(markup: string, url: string) {
  history.replaceState(null, '', url)
  document.body.innerHTML = markup
  initWelcome()
  const form = document.querySelector<HTMLFormElement>('form[data-welcome-form]')!
  const step = (n: number) => document.querySelector<HTMLElement>(`.welcome-step[data-step="${n}"]`)!
  const next = () => {
    const visible = document.querySelector<HTMLElement>('.welcome-step:not([hidden])')!
    visible.querySelector<HTMLButtonElement>('[data-next]')!.click()
  }
  const pick = (name: string, value: string) => {
    const input = form.querySelector<HTMLInputElement>(`[name="${name}"][value="${value}"]`)!
    input.checked = !input.checked || input.type === 'radio'
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }
  const type = (name: string, value: string) => {
    const input = form.querySelector<HTMLInputElement>(`[name="${name}"]`)!
    input.value = value
    input.dispatchEvent(new InputEvent('input', { bubbles: true }))
  }
  return { form, step, next, pick, type, root: document.querySelector<HTMLElement>('[data-welcome]')! }
}

describe('/welcome — мастер', () => {
  let w: ReturnType<typeof mount>
  beforeEach(() => {
    w = mount(welcomeNew().value, '/welcome?name=Анна&phone=89770169775')
  })

  it('показывает один шаг, подставляет имя и телефон из ссылки', () => {
    expect(w.step(0).hidden).toBe(false)
    expect(w.step(1).hidden).toBe(true)
    expect(w.form.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe('Анна')
    expect(w.form.querySelector<HTMLInputElement>('[name="phone"]')!.value).toBe('+7 (977) 016-97-75')
    expect(w.step(0).querySelector('[data-greet-name]')!.textContent).toBe('Анна, ')
  })

  it('«Далее» неактивна без обязательных полей шага 1', () => {
    w.next()
    const nextBtn = w.step(1).querySelector<HTMLButtonElement>('[data-next]')!
    expect(nextBtn.disabled).toBe(true)
    w.pick('address_form', 'vy')
    expect(nextBtn.disabled).toBe(false)
    w.type('name', '  ')
    expect(nextBtn.disabled).toBe(true)
  })

  it('«На вы» переключает обращение', () => {
    w.next()
    w.pick('address_form', 'vy')
    expect(w.root.dataset.address).toBe('vy')
  })

  it('матча — молоко без сахара и сливок; смена напитка сбрасывает молоко', () => {
    w.pick('drink', 'matcha')
    const milk = w.form.querySelector<HTMLElement>('[data-dep="milk"]')!
    const coffee = w.form.querySelector<HTMLElement>('[data-dep="coffee"]')!
    expect(milk.hidden).toBe(false)
    expect(coffee.hidden).toBe(true)
    w.pick('milk', 'banana')
    w.pick('drink', 'cappuccino')
    expect(coffee.hidden).toBe(false)
    expect(w.form.querySelector<HTMLInputElement>('[name="milk"]:checked')).toBeNull()
    w.pick('drink', 'water')
    expect(milk.hidden).toBe(true)
  })

  it('«Ничего из перечисленного» взаимоисключающее', () => {
    w.pick('contraindications', 'pregnancy')
    w.pick('contraindications', 'none')
    expect(readAnswers(w.form).all('contraindications')).toEqual(['none'])
    w.pick('contraindications', 'diabetes')
    expect(readAnswers(w.form).all('contraindications')).toEqual(['diabetes'])
  })

  it('«Назад» сохраняет ответы', () => {
    w.next()
    w.pick('address_form', 'ty')
    w.next()
    w.pick('drink', 'green_tea')
    w.next()
    w.step(3).querySelector<HTMLButtonElement>('[data-back]')!.click()
    expect(w.step(2).hidden).toBe(false)
    expect(w.form.querySelector<HTMLInputElement>('[name="drink"][value="green_tea"]')!.checked).toBe(true)
  })

  it('тело запроса: булевы, массивы, зависимые поля только при условии', () => {
    w.pick('address_form', 'vy')
    w.pick('drink', 'matcha')
    w.pick('milk', 'almond')
    w.pick('car', 'no')
    w.pick('talk_mode', 'any')
    w.pick('with_kid', 'yes')
    w.type('kid_age', '7')
    w.pick('kid_needs', 'cartoon')
    w.pick('contraindications', 'epilepsy')
    w.pick('tan', 'no')
    w.pick('source', 'friend')
    const body = payload('new', readAnswers(w.form))
    expect(body).toMatchObject({
      visit_type: 'new',
      name: 'Анна',
      phone: '+7 (977) 016-97-75',
      address_form: 'vy',
      drink: 'matcha',
      milk: 'almond',
      sugar: null,
      cream: null,
      car: false,
      car_number: '',
      with_kid: true,
      kid_age: '7',
      kid_needs: ['cartoon'],
      contraindications: ['epilepsy'],
      tan: false,
      source: 'friend',
      privacy_consent: false,
      _hp: '',
    })
  })
})

describe('/welcome/back', () => {
  it('без телефона в ссылке — поля контактов обязательны', () => {
    const w = mount(welcomeBack().value, '/welcome/back?name=Анна')
    const contacts = w.form.querySelector<HTMLElement>('[data-contacts]')!
    const start = w.step(0).querySelector<HTMLButtonElement>('[data-next]')!
    expect(contacts.hidden).toBe(false)
    expect(start.disabled).toBe(true)
    w.type('phone', '+7 (977) 016-97-75')
    expect(start.disabled).toBe(false)
  })

  it('с корректной ссылкой поля контактов скрыты', () => {
    const w = mount(welcomeBack().value, '/welcome/back?name=Анна&phone=89770169775')
    expect(w.form.querySelector<HTMLElement>('[data-contacts]')!.hidden).toBe(true)
    expect(w.step(0).querySelector('[data-greet-name]')!.textContent).toBe(', Анна')
  })

  it('«Да, расскажу» требует противопоказание и комментарий; в заявке health_changed и health_notes', () => {
    const w = mount(welcomeBack().value, '/welcome/back?name=Анна&phone=89770169775')
    const rule = STEP_RULES.back[1]!
    w.pick('health_changed', 'yes')
    expect(rule(readAnswers(w.form), { contactsShown: false })).toBe(false)
    w.pick('contraindications', 'lactation')
    expect(rule(readAnswers(w.form), { contactsShown: false })).toBe(false)
    w.type('health_notes', 'с марта')
    expect(rule(readAnswers(w.form), { contactsShown: false })).toBe(true)
    expect(payload('back', readAnswers(w.form))).toMatchObject({
      visit_type: 'back',
      health_changed: true,
      health_notes: 'с марта',
      contraindications: ['lactation'],
    })
    w.pick('health_changed', 'no')
    expect(payload('back', readAnswers(w.form))).toMatchObject({ health_changed: false, health_notes: '', contraindications: [] })
  })
})
