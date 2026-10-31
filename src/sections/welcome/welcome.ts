// Анкеты гостя /welcome и /welcome/back (welcome-intake D2): все шаги в HTML, мастер — src/client/welcome.ts.
// Без JS шаги видны подряд одной формой и отправляются обычным POST на /api/welcome.
import { config } from '../../config.ts'
import { links, site } from '../../content/site.ts'
import {
  CONTRAINDICATIONS,
  CONTRAINDICATIONS_NEW,
  DRINKS,
  KID_NEEDS,
  MILK_OPTIONS,
  SOURCES,
  TALK_MODES,
  type WelcomeOption,
} from '../../content/welcome-options.ts'
import { button } from '../../ds/primitives/button/button.ts'
import { checkbox } from '../../ds/primitives/choice/choice.ts'
import { textField } from '../../ds/primitives/field/field.ts'
import { html, raw, type HtmlValue, type SafeHtml } from '../../lib/html.ts'

export type Visit = 'new' | 'back'

/** Текст в двух формах обращения; видимая выбирается атрибутом data-address на корне (CSS). */
export const tv = (ty: string, vy: string): SafeHtml => html`<span data-ty>${ty}</span><span data-vy>${vy}</span>`

interface ChoiceOption {
  value: string
  label: HtmlValue
}

const opts = (list: readonly WelcomeOption[]): ChoiceOption[] => list.map((o) => ({ value: o.id, label: o.formLabel ?? o.label }))
const YES_NO = (yes = 'Да', no = 'Нет'): ChoiceOption[] => [
  { value: 'yes', label: yes },
  { value: 'no', label: no },
]

/** Группа вариантов: radio (один) или checkbox (несколько) в fieldset с легендой. */
function choices(props: {
  id: string
  name: string
  legend: HtmlValue
  options: readonly ChoiceOption[]
  type?: 'radio' | 'checkbox'
  required?: boolean
  layout?: 'row' | 'column'
}): SafeHtml {
  const type = props.type ?? 'radio'
  return html`<fieldset class="welcome-choices" data-layout="${props.layout ?? 'row'}" data-group="${props.name}">
<legend class="welcome-choices__legend">${props.legend}</legend>
<div class="welcome-choices__list">
${props.options.map(
  (o, i) => html`<label class="welcome-choice" for="${props.id}-${i}">
<input type="${type}" id="${props.id}-${i}" name="${props.name}" value="${o.value}"${props.required && type === 'radio' && i === 0 ? html` required` : null}>
<span>${o.label}</span>
</label>`,
)}
</div>
</fieldset>`
}

function textarea(id: string, name: string, label: HtmlValue, placeholder = 'Опционально', maxlength = 1000): SafeHtml {
  return html`<div class="ds-field">
<label class="ds-field__label" for="${id}">${label}</label>
<textarea class="ds-field__input welcome-textarea" id="${id}" name="${name}" rows="3" maxlength="${maxlength}" placeholder="${placeholder}"></textarea>
</div>`
}

/** Шаг мастера: заголовок получает фокус при переходе. */
function step(n: number, title: HtmlValue, body: HtmlValue, opts: { lead?: HtmlValue; nav?: HtmlValue; h1?: boolean } = {}): SafeHtml {
  const tag = raw(opts.h1 ? 'h1' : 'h2')
  return html`<section class="welcome-step" data-step="${n}" aria-labelledby="welcome-step-${n}">
<${tag} class="welcome-step__title" id="welcome-step-${n}" tabindex="-1">${title}</${tag}>
${opts.lead ? html`<p class="welcome-step__lead">${opts.lead}</p>` : null}
<div class="welcome-step__body">${body}</div>
${opts.nav ?? nav()}
</section>`
}

/** Кнопки «Назад» / «Далее» — работают только с JS, поэтому скрыты до улучшения. */
function nav(opts: { back?: boolean } = {}): SafeHtml {
  return html`<div class="welcome-step__nav" data-nav hidden>
${opts.back === false ? null : button({ label: 'Назад', variant: 'outline', attrs: { 'data-back': true } })}
${button({ label: 'Далее', attrs: { 'data-next': true } })}
</div>`
}

const privacyLink = html`<a href="/privacy" target="_blank">Политикой конфиденциальности</a>`

function consent(id: string): SafeHtml {
  return checkbox({
    id,
    name: 'privacy_consent',
    value: 'on',
    required: true,
    requiredMessage: 'Нужно согласие, чтобы отправить анкету',
    label: html`Я ознакомлена с ${privacyLink} и согласна на обработку персональных данных, включая сведения о состоянии здоровья, в целях подготовки и проведения процедуры.`,
  })
}

/** Последний шаг: ловушка для ботов, ошибка сервера, «Отправить». */
function submitBlock(): SafeHtml {
  return html`<div class="welcome-hp" aria-hidden="true"><label>Не заполняйте это поле <input type="text" name="_hp" tabindex="-1" autocomplete="off"></label></div>
<p class="welcome-error" role="alert" data-error hidden></p>
<div class="welcome-step__nav welcome-step__nav--submit">
${button({ label: 'Назад', variant: 'outline', attrs: { 'data-back': true, hidden: true } })}
${button({ label: html`<span data-idle>Отправить</span><span data-sending>Отправляем…</span>`, type: 'submit', attrs: { 'data-submit': true } })}
</div>`
}

function drinkStep(n: number, prefix: string, title: HtmlValue, lead: HtmlValue): SafeHtml {
  return step(
    n,
    title,
    html`${choices({ id: `${prefix}-drink`, name: 'drink', legend: html`<span class="ds-sr-only">Напиток</span>`, options: opts(DRINKS), required: true })}
<div data-dep="milk">${choices({ id: `${prefix}-milk`, name: 'milk', legend: 'Молоко', options: opts(MILK_OPTIONS) })}</div>
<div data-dep="coffee" class="welcome-pair">
${choices({ id: `${prefix}-sugar`, name: 'sugar', legend: 'Сахар?', options: YES_NO() })}
${choices({ id: `${prefix}-cream`, name: 'cream', legend: 'Сливки?', options: YES_NO() })}
</div>
<p class="ds-small">Сиропов у нас пока нет — но если хочется чего-то особенного, ${tv('напиши', 'напишите')} ниже.</p>
${textarea(`${prefix}-drink-wish`, 'extra_drink_wish', 'Пожелание к напитку', 'Опционально', 500)}`,
    { lead },
  )
}

function header(visit: Visit): SafeHtml {
  const total = visit === 'new' ? 6 : 3
  return html`<header class="welcome__top">
<a href="/" aria-label="${site.name} — на главную"><img src="/brand/logo-black-44.png" alt="${site.name}" width="144" height="22"></a>
<p class="welcome__counter" data-counter hidden><span data-counter-value>1</span> / ${total}</p>
</header>
<progress class="welcome__progress" max="${total}" value="0" aria-label="Прогресс анкеты" data-progress hidden></progress>`
}

function thanks(n: number, title: HtmlValue, text: HtmlValue): SafeHtml {
  const ext = (href: string, label: string, variant: 'solid' | 'outline' = 'outline') =>
    html`<a class="ds-button" data-variant="${variant}" data-size="3" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
  return html`<section class="welcome-step welcome-thanks" data-step="${n}" aria-labelledby="welcome-step-${n}" hidden>
<h2 class="welcome-step__title" id="welcome-step-${n}" tabindex="-1">${title}</h2>
<p class="welcome-step__lead">${text}</p>
<div class="welcome-thanks__links">
${ext(links.yandexOrg, 'Построить маршрут', 'solid')}
${ext(links.whatsapp, 'Написать в WhatsApp')}
${ext(links.telegram, 'Написать в Telegram')}
${config.maxUrl ? ext(config.maxUrl, 'Написать в MAX') : null}
<a class="ds-button" data-variant="outline" data-size="3" href="${links.tel}">Позвонить</a>
</div>
</section>`
}

export function welcomeNew(): SafeHtml {
  const p = 'wn'
  return html`<main class="welcome" data-welcome="new" data-address="ty">
<h1 class="ds-sr-only">Анкета гостя LUCOVICA</h1>
${header('new')}
<form class="welcome__form" action="/api/welcome" method="post" data-welcome-form>
<input type="hidden" name="visit_type" value="new">
${step(
  0,
  'Привет, наша звёздочка ✨',
  html`<p class="welcome-step__lead"><span data-greet-name></span>Давай познакомимся ближе — расскажи о себе, и мы подготовим визит так, как тебе будет комфортно. Это займёт 3 минуты.</p>
<p class="ds-small"><a href="/privacy" target="_blank">Политика конфиденциальности</a></p>`,
  { nav: html`<div class="welcome-step__nav" data-nav hidden>${button({ label: 'Начнём', attrs: { 'data-next': true, 'data-goal': 'welcome_started' } })}</div>` },
)}
${step(
  1,
  'Знакомство',
  html`${textField({ id: `${p}-name`, name: 'name', label: 'Как к тебе обращаться?', placeholder: 'Например, Рита', required: true, requiredMessage: 'Как к тебе обращаться?', autocomplete: 'given-name', maxlength: 100 })}
${choices({ id: `${p}-address`, name: 'address_form', legend: 'Комфортнее на «ты» или на «вы»?', options: [{ value: 'ty', label: 'На «ты»' }, { value: 'vy', label: 'На «вы»' }], required: true })}
${textField({ id: `${p}-phone`, name: 'phone', label: 'Номер для связи', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true, requiredMessage: 'Введи полный номер телефона', maxlength: 30 })}`,
  { nav: nav({ back: false }) },
)}
${drinkStep(2, p, 'Что приготовить?', html`Угостим ${tv('тебя', 'вас')} кофе или чаем — что ${tv('будешь', 'будете')}?`)}
${step(
  3,
  html`Как ${tv('доберёшься', 'доберётесь')}?`,
  html`${choices({ id: `${p}-car`, name: 'car', legend: html`<span class="ds-sr-only">Транспорт</span>`, options: YES_NO('На машине', 'Без машины'), required: true })}
<div data-dep="car">${textField({ id: `${p}-car-number`, name: 'car_number', label: 'Номер автомобиля', placeholder: 'А123БВ 161', hint: 'Предупредим, чтобы у входа было свободно', maxlength: 20 })}</div>`,
)}
${step(
  4,
  'Комфорт',
  html`${choices({ id: `${p}-talk`, name: 'talk_mode', legend: html`${tv('Хочешь', 'Хотите')} разговаривать или побыть в тишине?`, options: opts(TALK_MODES), required: true })}
${choices({ id: `${p}-kid`, name: 'with_kid', legend: html`${tv('Придёшь', 'Придёте')} с ребёнком?`, options: YES_NO(), required: true })}
<div data-dep="kid">
${textField({ id: `${p}-kid-age`, name: 'kid_age', label: 'Сколько лет?', placeholder: 'Возраст', inputmode: 'numeric', maxlength: 2 })}
${choices({ id: `${p}-kid-needs`, name: 'kid_needs', legend: 'Что подготовить?', options: opts(KID_NEEDS), type: 'checkbox' })}
</div>`,
)}
${step(
  5,
  'Здоровье',
  html`${choices({ id: `${p}-contra`, name: 'contraindications', legend: html`<span class="ds-sr-only">Противопоказания</span>`, options: opts(CONTRAINDICATIONS_NEW), type: 'checkbox', layout: 'column' })}
${choices({ id: `${p}-tan`, name: 'tan', legend: html`${tv('Загорала', 'Загорали')} или ${tv('была', 'были')} в солярии в последние 2 недели?`, options: YES_NO(), required: true })}
${textarea(`${p}-skin`, 'skin_notes', 'Аллергии или особенности кожи', 'Опционально — если есть, что нам важно знать', 500)}`,
  { lead: html`Это важная часть. Лазер не подходит при некоторых состояниях — ${tv('отметь', 'отметьте')}, что относится к ${tv('тебе', 'вам')}.` },
)}
${step(
  6,
  'Почти готово',
  html`${choices({ id: `${p}-source`, name: 'source', legend: html`Откуда ${tv('узнала', 'узнали')} о нас?`, options: opts(SOURCES), required: true })}
${textarea(`${p}-notes`, 'extra_notes', html`${tv('Хочешь', 'Хотите')} что-то ещё рассказать?`)}
${consent(`${p}-consent`)}
${submitBlock()}`,
  { nav: '' },
)}
</form>
${thanks(7, 'Всё записали', html`Готовимся к ${tv('твоему', 'вашему')} визиту. До встречи!`)}
</main>`
}

export function welcomeBack(): SafeHtml {
  const p = 'wb'
  return html`<main class="welcome" data-welcome="back" data-address="ty">
<h1 class="ds-sr-only">Анкета гостя LUCOVICA</h1>
${header('back')}
<form class="welcome__form" action="/api/welcome" method="post" data-welcome-form>
<input type="hidden" name="visit_type" value="back">
${step(
  0,
  html`С возвращением<span data-greet-name></span> 💛`,
  html`<p class="welcome-step__lead">Пара вопросов, чтобы подготовиться так, как ты любишь.</p>
<div class="welcome-contacts" data-contacts>
${textField({ id: `${p}-name`, name: 'name', label: 'Как к тебе обращаться?', required: true, requiredMessage: 'Как к тебе обращаться?', autocomplete: 'given-name', maxlength: 100 })}
${textField({ id: `${p}-phone`, name: 'phone', label: 'Номер для связи', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true, requiredMessage: 'Введи полный номер телефона', maxlength: 30 })}
</div>
<p class="ds-small"><a href="/privacy" target="_blank">Политика конфиденциальности</a></p>`,
  { nav: html`<div class="welcome-step__nav" data-nav hidden>${button({ label: 'Начнём', attrs: { 'data-next': true, 'data-goal': 'welcome_started' } })}</div>` },
)}
${step(
  1,
  'Здоровье',
  html`${choices({ id: `${p}-health`, name: 'health_changed', legend: 'Что-то изменилось в здоровье с прошлого визита?', options: YES_NO('Да, расскажу', 'Нет, всё как было'), required: true })}
<div data-dep="health">
${textarea(`${p}-health-notes`, 'health_notes', 'Что изменилось?', 'Расскажи, что изменилось…')}
${choices({ id: `${p}-contra`, name: 'contraindications', legend: 'Отметь, если появилось', options: opts(CONTRAINDICATIONS), type: 'checkbox', layout: 'column' })}
</div>`,
  { nav: nav({ back: false }) },
)}
${drinkStep(2, p, 'Что сегодня хочется?', 'Угостим тебя — что будешь?')}
${step(
  3,
  'Что-то особенное?',
  html`${textarea(`${p}-notes`, 'extra_notes', 'Пожелания', 'Пожелания, уточнения — всё что хочешь передать мастеру')}
${consent(`${p}-consent`)}
${submitBlock()}`,
  { nav: '' },
)}
</form>
${thanks(4, 'Ждём тебя', 'Готовимся к твоему визиту. До встречи!')}
</main>`
}
