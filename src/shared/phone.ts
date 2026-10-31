// Телефон: одно правило для маски на клиенте и проверки на сервере (booking-pipeline D2).

/**
 * Цифры номера в виде «7XXXXXXXXXX» (не длиннее 11):
 * ведущая 8 → 7, номер без кода страны дополняется 7, лишние цифры отбрасываются.
 * Частичный ввод возвращается частично: «8977» → «7977».
 */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (!digits) return ''
  if (digits[0] === '8') digits = '7' + digits.slice(1)
  else if (digits[0] !== '7') digits = '7' + digits
  return digits.slice(0, 11)
}

/** Полный российский номер: 11 цифр, начинается с 7. */
export function isValidPhone(input: string): boolean {
  return /^7\d{10}$/.test(normalizePhone(input))
}

/** Сырые цифры ввода — ровно 11 и начинаются с 7 или 8 (серверная проверка lead-api). */
export function hasFullPhone(input: string): boolean {
  return /^[78]\d{10}$/.test(input.replace(/\D/g, ''))
}

/** Цифры → «+7 (977) 016-97-75»; для неполного номера — сколько введено: «+7 (977) 01». */
export function formatPhone(digits: string): string {
  const d = normalizePhone(digits)
  if (!d) return ''
  const code = d.slice(1, 4)
  const a = d.slice(4, 7)
  const b = d.slice(7, 9)
  const c = d.slice(9, 11)
  let out = '+7'
  if (code) out += ` (${code}`
  if (code.length === 3 && (a || d.length > 4)) out += ')'
  if (a) out += ` ${a}`
  if (b) out += `-${b}`
  if (c) out += `-${c}`
  return out
}
