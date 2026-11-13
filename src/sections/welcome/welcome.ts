// Анкеты гостя /welcome и /welcome/back (welcome-intake D2, welcome-redesign D3): все шаги в HTML, мастер — src/client/welcome.ts.
// Без JS шаги видны подряд одной формой и отправляются обычным POST на /api/welcome.
// Тексты новой анкеты — docs/welcome-texts.md; макет — docs/welcome-mockup.html.
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

/** Текст в двух формах обращения (только /welcome/back); видимая выбирается атрибутом data-address на корне (CSS). */
export const tv = (ty: string, vy: string): SafeHtml => html`<span data-ty>${ty}</span><span data-vy>${vy}</span>`

/** Названия разделов в боковой панели — по порядку шагов 1…N. */
export const SECTIONS: Record<Visit, readonly string[]> = {
  new: ['Контактные данные', 'Напиток', 'Дорога', 'Атмосфера визита', 'Сведения о здоровье', 'Завершение'],
  back: ['Здоровье', 'Напиток', 'Пожелания'],
}

interface ChoiceOption {
  value: string
  label: HtmlValue
  note?: string
}

const opts = (list: readonly WelcomeOption[]): ChoiceOption[] =>
  list.map((o) => ({ value: o.id, label: o.formLabel ?? o.label, note: o.formNote }))
const YES_NO = (yes = 'Да', no = 'Нет'): ChoiceOption[] => [
  { value: 'yes', label: yes },
  { value: 'no', label: no },
]

/** Пометка необязательного поля или множественного выбора рядом с подписью. */
const opt = (text = 'по желанию'): SafeHtml => html`<span class="welcome-opt">${text}</span>`

interface GroupProps {
  id: string
  name: string
  legend: HtmlValue
  /** Легенда только для скринридера (вопрос уже в заголовке шага) */
  legendHidden?: boolean
  options: readonly ChoiceOption[]
  type?: 'radio' | 'checkbox'
  required?: boolean
}

const legend = (props: GroupProps): SafeHtml =>
  html`<legend class="${props.legendHidden ? 'ds-sr-only' : 'welcome-group__legend'}">${props.legend}</legend>`

const input = (props: GroupProps, o: ChoiceOption, i: number): SafeHtml =>
  html`<input type="${props.type ?? 'radio'}" id="${props.id}-${i}" name="${props.name}" value="${o.value}"${props.required && (props.type ?? 'radio') === 'radio' && i === 0 ? html` required` : null}>`

/** Плитки: один (radio) или несколько (checkbox) вариантов в fieldset. */
function tiles(props: GroupProps & { cols?: 2 | 3 }): SafeHtml {
  return html`<fieldset class="welcome-group" data-group="${props.name}">
${legend(props)}
<div class="welcome-tiles"${props.cols ? html` data-cols="${props.cols}"` : null}>
${props.options.map(
  (o, i) => html`<label class="welcome-tile" for="${props.id}-${i}">
${input(props, o, i)}
<span>${o.label}</span>
</label>`,
)}
</div>
</fieldset>`
}

const CHECK = html`<svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true" focusable="false"><path d="M1 4l3 3 5-6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`

/** Список чекбоксов с разделителями — противопоказания. */
function checks(props: GroupProps & { exclusive?: string }): SafeHtml {
  return html`<fieldset class="welcome-group" data-group="${props.name}">
${legend(props)}
<div class="welcome-checks">
${props.options.map(
  (o, i) => html`<label class="welcome-check${o.value === props.exclusive ? ' welcome-check--none' : ''}" for="${props.id}-${i}">
${input({ ...props, type: 'checkbox' }, o, i)}
<span class="welcome-check__box" aria-hidden="true">${CHECK}</span>
<span class="welcome-check__text">${o.label}${o.note ? html`<small>${o.note}</small>` : null}</span>
</label>`,
)}
</div>
</fieldset>`
}

function textarea(id: string, name: string, label: HtmlValue, placeholder: string, maxlength = 1000, rows = 2): SafeHtml {
  return html`<div class="ds-field">
<label class="ds-field__label" for="${id}">${label}</label>
<textarea class="ds-field__input welcome-textarea" id="${id}" name="${name}" rows="${rows}" maxlength="${maxlength}" placeholder="${placeholder}"></textarea>
</div>`
}

/** Шаг мастера: заголовок получает фокус при переходе. */
function step(
  n: number,
  title: HtmlValue,
  body: HtmlValue,
  opts: { eyebrow?: HtmlValue; lead?: HtmlValue; nav?: HtmlValue; after?: HtmlValue } = {},
): SafeHtml {
  return html`<section class="welcome-step" data-step="${n}" aria-labelledby="welcome-step-${n}">
<div class="welcome-step__head">
${opts.eyebrow ? html`<p class="welcome-eyebrow">${opts.eyebrow}</p>` : null}
<h2 class="welcome-step__title" id="welcome-step-${n}" tabindex="-1">${title}</h2>
${opts.lead ? html`<p class="welcome-step__lead">${opts.lead}</p>` : null}
</div>
${body ? html`<div class="welcome-step__body">${body}</div>` : null}
${opts.after}
${opts.nav ?? nav()}
</section>`
}

const backButton = (): SafeHtml => button({ label: 'Назад', variant: 'outline', className: 'welcome-step__back', attrs: { 'data-back': true } })

/** Кнопки «Назад» / «Далее» — работают только с JS, поэтому скрыты до улучшения. */
function nav(opts: { back?: boolean; next?: string; goal?: string } = {}): SafeHtml {
  return html`<div class="welcome-step__nav" data-nav hidden>
${opts.back === false ? null : backButton()}
${button({ label: opts.next ?? 'Далее', attrs: { 'data-next': true, 'data-goal': opts.goal } })}
</div>`
}

const privacyLink = html`<a href="/privacy" target="_blank">Политикой конфиденциальности</a>`

function consent(id: string, label: HtmlValue, requiredMessage: string): SafeHtml {
  return html`<div class="welcome-consent">${checkbox({ id, name: 'privacy_consent', value: 'on', required: true, requiredMessage, label })}</div>`
}

/** Последний шаг: ловушка для ботов, ошибка сервера, «Назад» и «Отправить». */
function submitBlock(label: string): SafeHtml {
  return html`<div class="welcome-hp" aria-hidden="true"><label>Не заполняйте это поле <input type="text" name="_hp" tabindex="-1" autocomplete="off"></label></div>
<p class="welcome-error" role="alert" data-error hidden></p>
<div class="welcome-step__nav welcome-step__nav--submit">
${button({ label: 'Назад', variant: 'outline', className: 'welcome-step__back', attrs: { 'data-back': true, hidden: true } })}
${button({ label: html`<span data-idle>${label}</span><span data-sending>Отправляем…</span>`, type: 'submit', attrs: { 'data-submit': true } })}
</div>`
}

function drinkFields(prefix: string, wishPlaceholder: string, extra: HtmlValue = null): SafeHtml {
  return html`${tiles({ id: `${prefix}-drink`, name: 'drink', legend: 'Напиток', legendHidden: true, options: opts(DRINKS), required: true })}
<div data-dep="milk">${tiles({ id: `${prefix}-milk`, name: 'milk', legend: 'Молоко', options: opts(MILK_OPTIONS), cols: 3 })}</div>
<div data-dep="coffee" class="welcome-pair">
${tiles({ id: `${prefix}-sugar`, name: 'sugar', legend: 'Сахар', options: YES_NO('С сахаром', 'Без сахара'), cols: 2 })}
${tiles({ id: `${prefix}-cream`, name: 'cream', legend: 'Сливки', options: YES_NO('Со сливками', 'Без сливок'), cols: 2 })}
</div>
${extra}
${textarea(`${prefix}-drink-wish`, 'extra_drink_wish', html`Особые пожелания${opt()}`, wishPlaceholder, 500)}`
}

/** Тёмная панель (≥960px): логотип, заголовок, разделы, контакты. Разделы работают без JS как список; переходы включает JS. */
function aside(visit: Visit): SafeHtml {
  return html`<aside class="welcome-aside" aria-label="Студия ${site.name}">
<div class="welcome-aside__in">
<a class="welcome-aside__logo" href="/" aria-label="${site.name} — на главную"><img src="/brand/logo-white-32.png" alt="${site.name}" width="170" height="26"></a>
<div>
<p class="welcome-eyebrow">Анкета гостя</p>
<p class="welcome-aside__title">Подготовим визит<br><em>заранее</em></p>
</div>
<ol class="welcome-steps" data-steps>
${SECTIONS[visit].map(
  (name, i) => html`<li class="welcome-steps__item" data-state="todo">
<button type="button" class="welcome-steps__button" data-step-link="${i + 1}" disabled><span class="welcome-steps__n">${String(i + 1).padStart(2, '0')}</span><span>${name}</span></button>
</li>`,
)}
</ol>
<div class="welcome-aside__foot">
<span>${site.address.short} · ${site.address.city}</span>
<span>${site.hours.label}</span>
<a href="${links.tel}">${site.phone.display}</a>
</div>
</div>
</aside>`
}

/** Шапка основной колонки: логотип (на мобильных), счётчик и полоса прогресса. */
function header(visit: Visit): SafeHtml {
  const total = SECTIONS[visit].length
  return html`<header class="welcome__top">
<a class="welcome__logo" href="/" aria-label="${site.name} — на главную"><img src="/brand/logo-black-44.png" alt="${site.name}" width="131" height="20"></a>
<p class="welcome__counter" data-counter aria-live="polite">Анкета гостя</p>
</header>
<progress class="welcome__progress" max="${total}" value="0" aria-label="Прогресс анкеты" data-progress hidden></progress>`
}

function thanks(visit: Visit, n: number, title: HtmlValue, text: HtmlValue): SafeHtml {
  const long = visit === 'back'
  const ext = (href: string, label: string, variant: 'solid' | 'outline' = 'outline') =>
    html`<a class="ds-button" data-variant="${variant}" data-size="3" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
  return html`<section class="welcome-step welcome-thanks" data-step="${n}" aria-labelledby="welcome-step-${n}" hidden>
<div class="welcome-step__head">
<div class="welcome-mark" aria-hidden="true"></div>
<h2 class="welcome-step__title" id="welcome-step-${n}" tabindex="-1">${title}</h2>
<p class="welcome-step__lead">${text}</p>
</div>
<div class="welcome-card">
<div><p class="welcome-eyebrow">Адрес</p><p>${site.address.street}<br>${site.address.city}</p></div>
<div><p class="welcome-eyebrow">Часы работы</p><p>${site.hours.label}<br><a href="${links.tel}">${site.phone.display}</a></p></div>
</div>
<div class="welcome-thanks__links">
${ext(links.yandexOrg, 'Построить маршрут', 'solid')}
${ext(links.whatsapp, long ? 'Написать в WhatsApp' : 'WhatsApp')}
${ext(links.telegram, long ? 'Написать в Telegram' : 'Telegram')}
${config.maxUrl ? ext(config.maxUrl, long ? 'Написать в MAX' : 'MAX') : null}
<a class="ds-button" data-variant="outline" data-size="3" href="${links.tel}">Позвонить</a>
</div>
</section>`
}

/** Каркас страницы: панель слева (≥960px), форма справа. */
function layout(visit: Visit, address: 'ty' | 'vy', form: HtmlValue, thanksBlock: HtmlValue): SafeHtml {
  return html`<div class="welcome" data-welcome="${visit}" data-address="${address}">
${aside(visit)}
<main class="welcome-main">
${header(visit)}
<div class="welcome__body">
<h1 class="ds-sr-only">Анкета гостя ${site.name}</h1>
${form}
${thanksBlock}
</div>
</main>
</div>`
}

export function welcomeNew(): SafeHtml {
  const p = 'wn'
  const form = html`<form class="welcome__form" action="/api/welcome" method="post" data-welcome-form>
<input type="hidden" name="visit_type" value="new">
<input type="hidden" name="address_form" value="vy">
${step(0, html`Добро пожаловать в&nbsp;${site.name}`, null, {
  eyebrow: 'Перед первым визитом',
  lead: 'Чтобы ваш визит прошёл комфортно и безопасно, просим ответить на несколько вопросов. Мы заранее подготовим процедуру и пространство с учётом ваших предпочтений.',
  after: html`<hr class="welcome-rule">
<p class="welcome-note">Около 3&nbsp;минут · 6&nbsp;коротких разделов<br>Данные обрабатываются в соответствии с ${privacyLink}.</p>`,
  nav: nav({ back: false, next: 'Заполнить анкету', goal: 'welcome_started' }),
})}
${step(
  1,
  'Контактные данные',
  html`${textField({ id: `${p}-name`, name: 'name', label: 'Как к вам обращаться', placeholder: 'Имя', required: true, requiredMessage: 'Укажите, как к вам обращаться', autocomplete: 'given-name', maxlength: 100 })}
${textField({ id: `${p}-phone`, name: 'phone', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', hint: 'Для подтверждения записи и связи в день визита', required: true, requiredMessage: 'Укажите номер телефона полностью', maxlength: 30 })}`,
  { eyebrow: '01 · Контакты', nav: nav({ back: false }) },
)}
${step(2, 'Что подготовить к вашему приходу?', drinkFields(p, 'Например, покрепче или погорячее'), {
  eyebrow: '02 · Напиток',
  lead: 'Напиток будет ждать вас к началу визита.',
})}
${step(
  3,
  'Как вы планируете добраться?',
  html`${tiles({ id: `${p}-car`, name: 'car', legend: 'Транспорт', legendHidden: true, options: YES_NO('На автомобиле', 'Другим способом'), required: true, cols: 2 })}
<div data-dep="car">${textField({ id: `${p}-car-number`, name: 'car_number', label: html`Номер автомобиля${opt()}`, placeholder: 'А123БВ 161', hint: 'Позаботимся о свободном месте у входа в студию.', maxlength: 20 })}</div>`,
  { eyebrow: '03 · Дорога' },
)}
${step(
  4,
  'Атмосфера визита',
  html`${tiles({ id: `${p}-talk`, name: 'talk_mode', legend: 'Формат общения', options: opts(TALK_MODES), required: true, cols: 3 })}
${tiles({ id: `${p}-kid`, name: 'with_kid', legend: 'Будет ли с вами ребёнок', options: YES_NO(), required: true, cols: 2 })}
<div data-dep="kid" class="welcome-dep">
${textField({ id: `${p}-kid-age`, name: 'kid_age', label: 'Возраст ребёнка', placeholder: 'Полных лет', inputmode: 'numeric', maxlength: 2 })}
${tiles({ id: `${p}-kid-needs`, name: 'kid_needs', legend: html`Что подготовить для ребёнка${opt('можно несколько')}`, options: opts(KID_NEEDS), type: 'checkbox' })}
</div>`,
  { eyebrow: '04 · Атмосфера', lead: 'Мастер учтёт ваши пожелания во время процедуры.' },
)}
${step(
  5,
  'Сведения о здоровье',
  html`${checks({ id: `${p}-contra`, name: 'contraindications', legend: 'Отметьте, что относится к вам', options: opts(CONTRAINDICATIONS_NEW), exclusive: 'none' })}
${tiles({ id: `${p}-tan`, name: 'tan', legend: 'Загар или солярий за последние 2 недели', options: YES_NO(), required: true, cols: 2 })}
${textarea(`${p}-skin`, 'skin_notes', html`Аллергии и особенности кожи${opt()}`, 'Например, реакция на определённые средства', 500)}`,
  {
    eyebrow: '05 · Здоровье',
    lead: 'Некоторые состояния требуют адаптации процедуры или являются противопоказанием к ней. Отметьте всё, что относится к вам, — мастер подберёт безопасный протокол.',
  },
)}
${step(
  6,
  'Последний шаг',
  html`${tiles({ id: `${p}-source`, name: 'source', legend: 'Как вы узнали о студии', options: opts(SOURCES), required: true })}
${textarea(`${p}-notes`, 'extra_notes', html`Дополнительные пожелания${opt()}`, 'Всё, что нам важно знать перед визитом', 1000, 3)}
${consent(
  `${p}-consent`,
  html`Даю согласие на обработку персональных данных, включая сведения о состоянии здоровья, в целях подготовки и проведения процедуры. С ${privacyLink} ознакомлен(а).`,
  'Для отправки анкеты необходимо согласие',
)}
${submitBlock('Отправить анкету')}`,
  { eyebrow: '06 · Завершение', nav: '' },
)}
</form>`
  return layout(
    'new',
    'vy',
    form,
    thanks(
      'new',
      7,
      html`Благодарим вас<span data-thanks-name></span>`,
      'Анкета получена. Мы подготовимся к вашему визиту с учётом всех пожеланий. Если планы изменятся, пожалуйста, сообщите нам заранее.',
    ),
  )
}

export function welcomeBack(): SafeHtml {
  const p = 'wb'
  const form = html`<form class="welcome__form" action="/api/welcome" method="post" data-welcome-form>
<input type="hidden" name="visit_type" value="back">
${step(
  0,
  html`С возвращением<span data-greet-name></span> 💛`,
  html`<div class="welcome-contacts" data-contacts>
${textField({ id: `${p}-name`, name: 'name', label: 'Как к тебе обращаться?', required: true, requiredMessage: 'Как к тебе обращаться?', autocomplete: 'given-name', maxlength: 100 })}
${textField({ id: `${p}-phone`, name: 'phone', label: 'Номер для связи', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true, requiredMessage: 'Введи полный номер телефона', maxlength: 30 })}
</div>
<p class="welcome-note"><a href="/privacy" target="_blank">Политика конфиденциальности</a></p>`,
  { lead: 'Пара вопросов, чтобы подготовиться так, как ты любишь.', nav: nav({ back: false, next: 'Начнём', goal: 'welcome_started' }) },
)}
${step(
  1,
  'Здоровье',
  html`${tiles({ id: `${p}-health`, name: 'health_changed', legend: 'Что-то изменилось в здоровье с прошлого визита?', options: YES_NO('Да, расскажу', 'Нет, всё как было'), required: true, cols: 2 })}
<div data-dep="health" class="welcome-dep">
${textarea(`${p}-health-notes`, 'health_notes', 'Что изменилось?', 'Расскажи, что изменилось…')}
${checks({ id: `${p}-contra`, name: 'contraindications', legend: 'Отметь, если появилось', options: opts(CONTRAINDICATIONS) })}
</div>`,
  { nav: nav({ back: false }) },
)}
${step(2, 'Что сегодня хочется?', drinkFields(p, 'Опционально', html`<p class="welcome-note">Сиропов у нас пока нет — но если хочется чего-то особенного, напиши ниже.</p>`), {
  lead: 'Угостим тебя — что будешь?',
})}
${step(
  3,
  'Что-то особенное?',
  html`${textarea(`${p}-notes`, 'extra_notes', 'Пожелания', 'Пожелания, уточнения — всё что хочешь передать мастеру', 1000, 3)}
${consent(
  `${p}-consent`,
  html`Я ознакомлена с ${privacyLink} и согласна на обработку персональных данных, включая сведения о состоянии здоровья, в целях подготовки и проведения процедуры.`,
  'Нужно согласие, чтобы отправить анкету',
)}
${submitBlock('Отправить')}`,
  { nav: '' },
)}
</form>`
  return layout('back', 'ty', form, thanks('back', 4, 'Ждём тебя', 'Готовимся к твоему визиту. До встречи!'))
}
