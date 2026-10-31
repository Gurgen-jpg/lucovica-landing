import { html, raw, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'

export interface AccordionItem {
  question: string
  answer: HtmlValue
}

export interface AccordionProps {
  /** Префикс id: уникален на странице */
  id: string
  items: readonly AccordionItem[]
  /** Уровень заголовков вопросов */
  headingLevel?: 2 | 3 | 4
  /** Какой пункт открыт после загрузки JS; по умолчанию все закрыты */
  defaultOpen?: number
}

const PLUS = html`<svg class="ds-accordion__icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M7 0v14M0 7h14" stroke="currentColor" stroke-width="1"/></svg>`

/**
 * Аккордеон «открыт не более одного». Без JS все ответы раскрыты (aria-expanded="true"),
 * клиентский init закрывает их и включает переключение.
 */
export function accordion(props: AccordionProps): SafeHtml {
  // headingLevel — только 2/3/4 из типа
  const h = raw(`h${props.headingLevel ?? 3}`)
  return html`<div class="ds-accordion" data-ds="accordion"${
    props.defaultOpen !== undefined ? html` data-default-open="${props.defaultOpen}"` : null
  }>
${props.items.map((item, i) => {
  const trigger = `${props.id}-q${i + 1}`
  const panel = `${props.id}-a${i + 1}`
  return html`<div class="ds-accordion__item">
<${h} class="ds-accordion__heading"><button class="ds-accordion__trigger" type="button" id="${trigger}" aria-expanded="true" aria-controls="${panel}"><span>${item.question}</span>${PLUS}</button></${h}>
<div class="ds-accordion__panel" id="${panel}" role="region" aria-labelledby="${trigger}"><div class="ds-accordion__answer">${item.answer}</div></div>
</div>`
})}
</div>`
}
