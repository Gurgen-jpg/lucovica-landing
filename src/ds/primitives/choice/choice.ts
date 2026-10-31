import { html, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'
import { attrs } from '../../attrs.ts'

export interface CheckboxProps {
  id: string
  name: string
  label: HtmlValue
  value?: string
  checked?: boolean
  required?: boolean
  requiredMessage?: string
}

const CHECK = html`<svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true" focusable="false"><path d="M1 4l2.5 2.5L9 1" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>`

/** Нативный checkbox, визуально — квадрат с инверсией в оникс. */
export function checkbox(props: CheckboxProps): SafeHtml {
  return html`<div class="ds-choice-field">
<label class="ds-choice" for="${props.id}">
<input class="ds-choice__input" type="checkbox" id="${props.id}" name="${props.name}" value="${props.value ?? 'on'}"${attrs({
    checked: props.checked,
    required: props.required,
    'aria-describedby': `${props.id}-error`,
    'data-required-message': props.required ? (props.requiredMessage ?? 'Отметьте, чтобы продолжить') : null,
  })}>
<span class="ds-choice__box" aria-hidden="true">${CHECK}</span>
<span class="ds-choice__label">${props.label}</span>
</label>
<p class="ds-field__error" id="${props.id}-error" hidden></p>
</div>`
}

export interface YesNoProps {
  /** Префикс id */
  id: string
  name: string
  legend: string
  value?: 'yes' | 'no'
  yesLabel?: string
  noLabel?: string
}

/** Выбор «Да/Нет»: группа нативных radio в fieldset. */
export function yesNo(props: YesNoProps): SafeHtml {
  const option = (value: 'yes' | 'no', label: string) =>
    html`<label class="ds-choice" for="${props.id}-${value}">
<input class="ds-choice__input" type="radio" id="${props.id}-${value}" name="${props.name}" value="${value}"${props.value === value ? html` checked` : null}>
<span class="ds-choice__box" data-shape="round" aria-hidden="true"><span class="ds-choice__dot"></span></span>
<span class="ds-choice__label">${label}</span>
</label>`
  return html`<fieldset class="ds-yesno">
<legend class="ds-yesno__legend">${props.legend}</legend>
<div class="ds-yesno__options">${option('no', props.noLabel ?? 'Нет')}${option('yes', props.yesLabel ?? 'Да')}</div>
</fieldset>`
}

export interface ChipOption {
  value: string
  label: string
  pressed?: boolean
}

export interface ChipGroupProps {
  /** Имя поля формы: выбранные значения пишутся в скрытый input */
  name: string
  /** Доступное имя группы: «Что предложить вам во время визита?» */
  label: string
  options: readonly ChipOption[]
  /** Множественный выбор; иначе — не более одного (можно снять) */
  multiple?: boolean
}

/** Группа чипов-переключателей (aria-pressed). Значение — через запятую в скрытом поле. */
export function chipGroup(props: ChipGroupProps): SafeHtml {
  const selected = props.options.filter((o) => o.pressed).map((o) => o.value)
  return html`<div class="ds-chips" role="group" aria-label="${props.label}" data-ds="chips"${props.multiple ? html` data-multiple` : null}>
${props.options.map(
  (o) =>
    html`<button class="ds-chip" type="button" aria-pressed="${o.pressed ? 'true' : 'false'}" value="${o.value}"><span>${o.label}</span><span class="ds-chip__dot" aria-hidden="true"></span></button>`,
)}
<input type="hidden" name="${props.name}" value="${selected.join(',')}">
</div>`
}
