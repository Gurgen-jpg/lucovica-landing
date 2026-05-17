/**
 * Проверяет, содержит ли строка ровно 11 цифр (российский номер телефона).
 * Не зависит от формата: `+7 (999) 123-45-67`, `89991234567` — оба валидны.
 */
export function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length === 11
}

/**
 * Форматирует введённый номер телефона в вид `+7 (XXX) XXX-XX-XX` на лету.
 * Нормализует `8XXX...` → `7XXX...`. Обрезает до 11 цифр.
 * Возвращает частично отформатированную строку по мере ввода.
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const d = (digits.startsWith('8') ? '7' + digits.slice(1) : digits).slice(0, 11)
  if (!d) return ''
  if (d[0] !== '7') return `+${d}`
  const local = d.slice(1)
  if (local.length === 0) return '+7'
  if (local.length <= 3) return `+7 (${local}`
  if (local.length <= 6) return `+7 (${local.slice(0, 3)}) ${local.slice(3)}`
  if (local.length <= 8) return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
  return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8, 10)}`
}
