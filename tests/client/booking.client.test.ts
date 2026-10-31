// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { applyPhoneMask, attachPhoneMask } from '../../src/client/phone-mask.ts'
import { captureUtm, readUtm } from '../../src/client/utm.ts'

describe('phone-mask', () => {
  let input: HTMLInputElement
  beforeEach(() => {
    document.body.innerHTML = '<input type="tel">'
    input = document.querySelector('input')!
    attachPhoneMask(input)
  })

  const type = (value: string, inputType = 'insertText') => {
    input.value = value
    input.setSelectionRange(value.length, value.length)
    input.dispatchEvent(new InputEvent('input', { inputType }))
  }

  it('вставка «8 977 016 97 75» → «+7 (977) 016-97-75»', () => {
    type('8 977 016 97 75', 'insertFromPaste')
    expect(input.value).toBe('+7 (977) 016-97-75')
  })

  it('ввод без кода страны дополняется 7, лишние цифры отбрасываются', () => {
    type('9770169775123')
    expect(input.value).toBe('+7 (977) 016-97-75')
  })

  it('Backspace после скобки удаляет цифру, а не скобку', () => {
    type('7977')
    expect(input.value).toBe('+7 (977')
    input.focus()
    type('+7 (977) 0')
    expect(input.value).toBe('+7 (977) 0')
    // Пользователь стёр пробел после «)»: цифры не изменились — удаляется цифра перед ним
    input.value = '+7 (977)0'
    input.setSelectionRange(8, 8)
    input.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' }))
    expect(input.value).toBe('+7 (970')
  })

  it('пустое поле остаётся пустым', () => {
    applyPhoneMask(input)
    expect(input.value).toBe('')
  })
})

describe('utm', () => {
  beforeEach(() => sessionStorage.clear())

  it('метки сохраняются и читаются на другой «странице»', () => {
    captureUtm('?utm_source=yandex&utm_campaign=laser&x=1')
    captureUtm('') // переход без меток не стирает их
    expect(readUtm()).toEqual({ utm_source: 'yandex', utm_campaign: 'laser' })
  })

  it('новый вход с метками перезаписывает прежние', () => {
    captureUtm('?utm_source=yandex')
    captureUtm('?utm_source=vk&utm_medium=cpc')
    expect(readUtm()).toEqual({ utm_source: 'vk', utm_medium: 'cpc' })
  })

  it('битые данные в хранилище — пустой результат', () => {
    sessionStorage.setItem('lucovica:utm', '{')
    expect(readUtm()).toEqual({})
  })
})
