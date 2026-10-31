import { html, type SafeHtml } from '../../../lib/html.ts'
import { attrs } from '../../attrs.ts'

interface FieldBase {
  id: string
  name: string
  label: string
  required?: boolean
  /** Текст ошибки для пустого обязательного поля; по умолчанию «Заполните поле» */
  requiredMessage?: string
  /** Ошибка, известная при рендере (например, после серверной проверки) */
  error?: string
  hint?: string
}

export interface TextFieldProps extends FieldBase {
  type?: 'text' | 'tel' | 'email'
  value?: string
  placeholder?: string
  autocomplete?: string
  inputmode?: 'text' | 'tel' | 'email' | 'numeric'
  maxlength?: number
  /** Регулярное выражение для клиентской проверки и сообщение к нему */
  pattern?: string
  patternMessage?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface SelectFieldProps extends FieldBase {
  options: readonly SelectOption[]
  /** Пустой первый пункт: «Выберите услугу» */
  placeholder?: string
  value?: string
}

const CHEVRON = html`<svg class="ds-field__chevron" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" focusable="false"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`

function describedBy(props: FieldBase): string {
  return [props.hint ? `${props.id}-hint` : '', `${props.id}-error`].filter(Boolean).join(' ')
}

function messages(props: FieldBase): SafeHtml {
  return html`${props.hint ? html`<p class="ds-field__hint" id="${props.id}-hint">${props.hint}</p>` : null}
<p class="ds-field__error" id="${props.id}-error"${props.error ? null : html` hidden`}>${props.error ?? ''}</p>`
}

function validationAttrs(props: FieldBase) {
  return {
    required: props.required,
    'aria-invalid': props.error ? 'true' : null,
    'aria-describedby': describedBy(props),
    'data-required-message': props.required ? (props.requiredMessage ?? 'Заполните поле') : null,
  }
}

/** Текстовое поле с нижней линией. Телефон — type="tel", autocomplete="tel". */
export function textField(props: TextFieldProps): SafeHtml {
  const type = props.type ?? 'text'
  const autocomplete = props.autocomplete ?? (type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined)
  const inputmode = props.inputmode ?? (type === 'tel' ? 'tel' : undefined)
  return html`<div class="ds-field">
<label class="ds-field__label" for="${props.id}">${props.label}</label>
<input class="ds-field__input" id="${props.id}" name="${props.name}" type="${type}"${attrs({
    value: props.value,
    placeholder: props.placeholder,
    autocomplete,
    inputmode,
    maxlength: props.maxlength,
    pattern: props.pattern,
    'data-pattern-message': props.patternMessage,
    ...validationAttrs(props),
  })}>
${messages(props)}
</div>`
}

/** Нативный <select> со стилизацией под поле. */
export function selectField(props: SelectFieldProps): SafeHtml {
  return html`<div class="ds-field">
<label class="ds-field__label" for="${props.id}">${props.label}</label>
<div class="ds-field__select">
<select class="ds-field__input" id="${props.id}" name="${props.name}"${attrs(validationAttrs(props))}>
${props.placeholder ? html`<option value=""${props.value ? null : html` selected`}>${props.placeholder}</option>` : null}
${props.options.map(
  (o) => html`<option value="${o.value}"${o.value === props.value ? html` selected` : null}>${o.label}</option>`,
)}
</select>
${CHEVRON}
</div>
${messages(props)}
</div>`
}
