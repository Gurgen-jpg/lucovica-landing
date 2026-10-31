import { describe, expect, it } from 'vitest'
import { formatPhone, hasFullPhone, isValidPhone, normalizePhone } from '../../src/shared/phone.ts'

describe('phone', () => {
  it('«8 977 016 97 75» → «+7 (977) 016-97-75»', () => {
    expect(formatPhone(normalizePhone('8 977 016 97 75'))).toBe('+7 (977) 016-97-75')
  })

  it('10 цифр без кода дополняются 7', () => {
    expect(normalizePhone('9770169775')).toBe('79770169775')
  })

  it('лишние цифры отбрасываются', () => {
    expect(normalizePhone('+7 977 016 97 75 123')).toBe('79770169775')
  })

  it('«123» невалиден, полный номер валиден', () => {
    expect(isValidPhone('123')).toBe(false)
    expect(isValidPhone('+7 (977) 016-97-75')).toBe(true)
    expect(isValidPhone('+7 (977) 016')).toBe(false)
  })

  it('частичный ввод форматируется по мере набора', () => {
    expect(formatPhone('')).toBe('')
    expect(formatPhone('7')).toBe('+7')
    expect(formatPhone('797')).toBe('+7 (97')
    expect(formatPhone('7977')).toBe('+7 (977')
    expect(formatPhone('7977016')).toBe('+7 (977) 016')
    expect(formatPhone('797701697')).toBe('+7 (977) 016-97')
  })

  it('серверная проверка — 11 цифр с 7 или 8', () => {
    expect(hasFullPhone('8 977 016-97-75')).toBe(true)
    expect(hasFullPhone('+7 977 016-97-75')).toBe(true)
    expect(hasFullPhone('9770169775')).toBe(false)
    expect(hasFullPhone('123')).toBe(false)
  })
})
