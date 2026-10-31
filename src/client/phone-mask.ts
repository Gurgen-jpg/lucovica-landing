// Маска телефона «+7 (XXX) XXX-XX-XX»: переформатирование на ввод и вставку с сохранением каретки.
import { formatPhone, normalizePhone } from '../shared/phone.ts'

const digitsBefore = (value: string, pos: number) => value.slice(0, pos).replace(/\D/g, '').length

/** Позиция в отформатированной строке сразу после n-й цифры. */
function caretAfterDigits(value: string, n: number): number {
  if (n <= 0) return 0
  let seen = 0
  for (let i = 0; i < value.length; i++) {
    if (/\d/.test(value[i]!) && ++seen === n) return i + 1
  }
  return value.length
}

export function applyPhoneMask(input: HTMLInputElement, inputType = ''): void {
  const raw = input.value
  const caret = input.selectionStart ?? raw.length
  let left = digitsBefore(raw, caret)
  let digits = raw.replace(/\D/g, '')

  // Backspace по скобке, пробелу или дефису: удалить цифру перед ними, иначе маска вернёт символ
  const prev = input.dataset.maskValue ?? ''
  if (inputType === 'deleteContentBackward' && digits === prev.replace(/\D/g, '') && left > 0) {
    digits = digits.slice(0, left - 1) + digits.slice(left)
    left -= 1
  }

  const normalized = normalizePhone(digits)
  // Дописанная 7 (ввод без кода) или 8 → 7 сдвигают цифры: каретка считается по нормализованной строке
  const shift = normalized.length - Math.min(digits.length, 11)
  const formatted = formatPhone(normalized)
  input.value = formatted
  input.dataset.maskValue = formatted
  if (document.activeElement === input) {
    const pos = caretAfterDigits(formatted, Math.min(left + Math.max(shift, 0), normalized.length))
    input.setSelectionRange(pos, pos)
  }
}

export function attachPhoneMask(input: HTMLInputElement): void {
  input.addEventListener('input', (e) => applyPhoneMask(input, (e as InputEvent).inputType ?? ''))
  if (input.value) applyPhoneMask(input)
}
