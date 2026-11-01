// Витрина дизайн-системы: все примитивы и их варианты. Только dev-сборка и e2e (config.showcase).
import { accordion } from '../ds/primitives/accordion/accordion.ts'
import { badge } from '../ds/primitives/badge/badge.ts'
import { button } from '../ds/primitives/button/button.ts'
import { carousel } from '../ds/primitives/carousel/carousel.ts'
import { checkbox, chipGroup, yesNo } from '../ds/primitives/choice/choice.ts'
import { dialog } from '../ds/primitives/dialog/dialog.ts'
import { selectField, textField } from '../ds/primitives/field/field.ts'
import { photo } from '../ds/primitives/photo/photo.ts'
import { sectionHeader } from '../ds/primitives/section-header/section-header.ts'
import { separator } from '../ds/primitives/separator/separator.ts'
import { tabs } from '../ds/primitives/tabs/tabs.ts'
import { tooltip } from '../ds/primitives/tooltip/tooltip.ts'
import { html, type HtmlValue, type SafeHtml } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'

// Демо-данные витрины. Настоящие цены — только в src/content/services.ts (home-page).
const DEMO_PRICES: Record<string, [string, number][]> = {
  laser: [['Зоны мини', 1490], ['Подмышки', 1690], ['Глубокое бикини', 3290], ['Ноги полностью', 4490]],
  sugaring: [['Лицо — одна зона', 400], ['Подмышки', 600], ['Глубокое бикини', 2200], ['Ноги полностью', 2500]],
  complex: [['Подмышки + глубокое бикини', 3690], ['Глубокое бикини + подмышки + ноги', 6590], ['Всё тело', 13990]],
}

const DEMO_FAQ = [
  {
    question: 'Больно ли делать лазерную эпиляцию?',
    answer: 'Диодный лазер оснащён системой охлаждения, поэтому процедура комфортна. Большинство гостей описывают ощущение как лёгкое покалывание.',
  },
  {
    question: 'Сколько сеансов нужно?',
    answer: 'Стандартный курс — 6–10 сеансов с интервалом 4–8 недель. Точное число зависит от зоны, цвета и типа волос.',
  },
  {
    question: 'Соблюдаются ли стандарты гигиены?',
    answer: 'Только одноразовые расходные материалы, стерилизация инструментов в автоклаве, индивидуальная паста для каждого гостя.',
  },
]

const DEMO_REVIEWS = [
  ['Анна', 'Хожу на лазер полгода — результат заметен уже после третьей процедуры. Очень спокойная атмосфера.'],
  ['Мария', 'Шугаринг без лишней боли и спешки. Мастер всё объяснила и подобрала время.'],
  ['Екатерина', 'Чисто, уютно, вовремя. Записалась на курс и подарила сертификат подруге.'],
]

const SERVICES = [
  { value: 'laser', label: 'Лазерная эпиляция' },
  { value: 'sugaring', label: 'Шугаринг' },
  { value: 'electro', label: 'Электроэпиляция' },
]

const fmt = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ')

function priceRows(rows: [string, number][]): SafeHtml {
  return html`<ul class="ds-demo-prices" role="list">${rows.map(
    ([name, p]) =>
      html`<li><span class="ds-demo-prices__name">${name}</span><span class="ds-price">${fmt(p)}<span class="ds-price__currency">₽</span></span></li>`,
  )}</ul>`
}

function block(id: string, title: string, note: string, content: HtmlValue): SafeHtml {
  return html`<section class="ds-demo-block" id="${id}" aria-labelledby="${id}-title">
<div class="ds-demo-block__head"><h2 class="ds-h3" id="${id}-title">${title}</h2><p class="ds-small">${note}</p></div>
${content}
</section>`
}

const SWATCHES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => `--gray-${n}`)
const BRAND = ['--lv-onyx', '--lv-graphite', '--lv-champagne']

function swatch(token: string): SafeHtml {
  return html`<li class="ds-demo-swatch"><span class="ds-demo-swatch__chip" style="background: var(${token})"></span><code>${token}</code></li>`
}

function bookingForm(prefix: string): SafeHtml {
  return html`<form class="ds-demo-form" data-ds="form" data-showcase-form novalidate>
${textField({ id: `${prefix}-name`, name: 'name', label: 'Имя', required: true, requiredMessage: 'Как к вам обращаться?', autocomplete: 'given-name' })}
${textField({ id: `${prefix}-phone`, name: 'phone', label: 'Телефон', type: 'tel', required: true, placeholder: '+7 (___) ___-__-__', requiredMessage: 'Укажите телефон для связи', pattern: '[+0-9 ()\\-]{10,}', patternMessage: 'Проверьте номер телефона' })}
${selectField({ id: `${prefix}-service`, name: 'service', label: 'Услуга', placeholder: 'Выберите услугу', options: SERVICES, required: true, requiredMessage: 'Выберите услугу' })}
${checkbox({ id: `${prefix}-consent`, name: 'consent', label: 'Согласна на обработку персональных данных', checked: true })}
${button({ label: 'Отправить заявку', type: 'submit' })}
<p class="ds-small">Перезвоним в течение часа, с 10:00 до 21:00.</p>
</form>`
}

export const page: Page = {
  path: '/ds',
  devOnly: true,
  meta: {
    title: 'Дизайн-система — LUCOVICA',
    description: 'Витрина примитивов дизайн-системы LUCOVICA 2.0.',
    noindex: true,
  },
  render: (ctx) => html`<main class="ds-demo" data-ds-showcase>
<div class="ds-container ds-section">
${sectionHeader({ level: 1, size: 'ds-display-l', overline: 'Дизайн-система 2.0', title: 'Plaster & Onyx', accent: 'Onyx', description: 'Примитивы на чистом CSS и TypeScript. Поведение — по WAI-ARIA APG, внешний вид — только токены.' })}

${block('ds-type', 'Типографика', 'Cormorant Garamond — заголовки от 28px, Jost — текст, интерфейс и цены.', html`
<div class="ds-demo-stack">
<p class="ds-display-xl">Гладкость</p>
<p class="ds-display-l">Кожа, <em>как шёлк</em></p>
<p class="ds-h1">Лазерная эпиляция</p>
<p class="ds-h2">Часто <em>спрашивают</em></p>
<p class="ds-h3">Глубокое бикини</p>
<p class="ds-lead">Опытные мастера, сертифицированное оборудование и тишина — всё для вашего спокойствия.</p>
<p class="ds-body">Современный диодный лазер с охлаждением. Курс — 6–10 сеансов с интервалом 4–8 недель.</p>
<p class="ds-price">4 490<span class="ds-price__currency">₽</span></p>
<p class="ds-overline">Что мы делаем</p>
</div>`)}

${block('ds-color', 'Цвет', 'Тёплая шкала plaster, оникс, графит и шампань — только на ониксе.', html`
<ul class="ds-demo-swatches" role="list">${SWATCHES.map(swatch)}</ul>
<ul class="ds-demo-swatches" role="list">${BRAND.map(swatch)}</ul>`)}

${block('ds-buttons', 'Button', 'solid · outline · link · inverse · champagne; высота 52 / 40; ссылка — <a>, действие — <button>.', html`
<div class="ds-demo-row">
${button({ label: 'Записаться' })}
${button({ label: 'Услуги и цены', variant: 'outline', href: '#ds-tabs' })}
${button({ label: 'Подробнее', variant: 'link', href: '#ds-faq' })}
${button({ label: 'Отключена', disabled: true, attrs: { id: 'ds-disabled-button' } })}
${button({ label: 'Size 2', variant: 'outline', size: 2 })}
</div>
<div class="ds-demo-row ds-inverse ds-demo-dark">
${button({ label: 'На тёмном', variant: 'inverse' })}
${button({ label: 'Подарить сертификат', variant: 'champagne' })}
</div>`)}

${block('ds-badges', 'Badge · Separator · Tooltip', 'Бейджи, разделитель с символом логотипа, подсказка по наведению и фокусу.', html`
<div class="ds-demo-row">${badge('Хит')}${badge('Мастер-руководитель', 'onyx')}${badge('Комплекс', 'soft')}
${tooltip({ id: 'ds-tooltip', text: 'Диодный лазер с охлаждением', triggerLabel: 'Об оборудовании' })}</div>
${separator({ symbol: true })}
${separator()}`)}

${block('ds-photo', 'Photo', 'Монохром по умолчанию (--photo-mono), обрезка под соотношение сторон.', html`
<div class="ds-demo-photos">
${photo(ctx.images, { name: 'team-ekaterina', alt: 'Мастер Екатерина', ratio: '4/5', sizes: '(min-width: 768px) 30vw, 50vw' })}
${photo(ctx.images, { name: 'hero', alt: 'Интерьер студии', ratio: '16/9', sizes: '(min-width: 768px) 60vw, 100vw' })}
</div>`)}

${block('ds-faq', 'Accordion', 'Открыт не более одного пункта; без JS все ответы видны.', accordion({ id: 'ds-faq-list', items: DEMO_FAQ, defaultOpen: 0 }))}

${block('ds-tabs', 'Tabs', 'Стрелки ←/→, Home/End, активация при фокусе.', tabs({
  id: 'ds-prices',
  label: 'Категории цен',
  tabs: [
    { key: 'laser', label: 'Лазер', panel: priceRows(DEMO_PRICES.laser!) },
    { key: 'sugaring', label: 'Шугаринг', panel: priceRows(DEMO_PRICES.sugaring!) },
    { key: 'complex', label: 'Комплексы', panel: priceRows(DEMO_PRICES.complex!) },
  ],
}))}

${block('ds-carousel', 'Carousel', 'Один слайд, зацикливание, индикатор в live-region.', html`<div class="ds-inverse ds-demo-dark">${carousel({
  label: 'Отзывы гостей',
  prevLabel: 'Предыдущий отзыв',
  nextLabel: 'Следующий отзыв',
  slides: DEMO_REVIEWS.map(
    ([name, text]) => html`<figure class="ds-demo-review"><blockquote class="ds-h3">${text}</blockquote><figcaption class="ds-overline">${name}</figcaption></figure>`,
  ),
})}</div>`)}

${block('ds-form', 'Поля формы', 'Нижняя линия, ошибка через aria-describedby и aria-invalid, фокус на первое невалидное поле.', html`
${bookingForm('ds-inline')}
<div class="ds-demo-stack">
${chipGroup({ name: 'offer', label: 'Что предложить вам во время визита?', multiple: true, options: [
  { value: 'coffee', label: 'Кофе', pressed: true },
  { value: 'tea', label: 'Травяной чай' },
  { value: 'quiet', label: 'Тишина', pressed: true },
  { value: 'talk', label: 'Беседа' },
] })}
${yesNo({ id: 'ds-tan', name: 'tan', legend: 'Был ли загар за последние 2 недели?', value: 'no' })}
</div>`)}

${block('ds-dialog', 'Dialog · Toast', 'Фокус внутрь и обратно, цикл Tab, Escape, клик по подложке; уведомление без перехвата фокуса.', html`
<div class="ds-demo-row">
${button({ label: 'Записаться', attrs: { 'data-dialog-open': 'ds-booking', id: 'ds-open-dialog' } })}
${button({ label: 'Показать уведомление', variant: 'outline', attrs: { 'data-showcase-toast': true } })}
</div>
${dialog({ id: 'ds-booking', overline: 'Запись', title: 'Ваш визит', accent: 'визит', body: bookingForm('ds-dialog') })}`)}
</div>
</main>`,
}
