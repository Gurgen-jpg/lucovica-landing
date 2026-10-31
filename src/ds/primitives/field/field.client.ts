// Ошибки полей и клиентская проверка формы (aria-invalid + aria-describedby + фокус).

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

function errorElement(control: Control): HTMLElement | null {
  return document.getElementById(`${control.id}-error`)
}

export function setFieldError(control: Control, message: string): void {
  const el = errorElement(control)
  control.setAttribute('aria-invalid', 'true')
  if (el) {
    el.textContent = message
    el.hidden = false
  }
}

export function clearFieldError(control: Control): void {
  const el = errorElement(control)
  control.removeAttribute('aria-invalid')
  if (el) {
    el.textContent = ''
    el.hidden = true
  }
}

/** Сообщение об ошибке для поля или null, если поле валидно. */
export function fieldError(control: Control): string | null {
  const value = control.value.trim()
  if (control.required && !value) return control.dataset.requiredMessage ?? 'Заполните поле'
  if (value && control instanceof HTMLInputElement && control.pattern) {
    if (!new RegExp(`^(?:${control.pattern})$`, 'u').test(value)) {
      return control.dataset.patternMessage ?? 'Проверьте значение'
    }
  }
  return null
}

/** Проверяет поля формы; показывает ошибки и переводит фокус на первое невалидное. */
export function validateForm(form: HTMLFormElement): boolean {
  let first: Control | null = null
  for (const control of form.querySelectorAll<Control>('.ds-field__input')) {
    const error = fieldError(control)
    if (error) {
      setFieldError(control, error)
      first ??= control
    } else {
      clearFieldError(control)
    }
  }
  first?.focus()
  return first === null
}

function setup(form: HTMLFormElement): void {
  if (form.dataset.enhanced !== undefined) return
  form.dataset.enhanced = ''
  form.noValidate = true
  // Ошибка снимается, как только поле исправлено
  form.addEventListener('input', (e) => {
    const control = e.target as Control
    if (control.matches?.('.ds-field__input[aria-invalid="true"]') && !fieldError(control)) {
      clearFieldError(control)
    }
  })
  form.addEventListener('submit', (e) => {
    if (!validateForm(form)) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  })
}

/** Формы с data-ds="form" проверяются до отправки; обработчики submit страницы вызываются только для валидной формы. */
export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLFormElement>('form[data-ds="form"]').forEach(setup)
}
