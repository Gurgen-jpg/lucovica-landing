import { describe, expect, it } from 'vitest'
import {
  CONTRAINDICATIONS,
  CONTRAINDICATIONS_NEW,
  COFFEE,
  DRINKS,
  KID_NEEDS,
  labelOf,
  MILK_OPTIONS,
  MILK_TRIGGER,
  SOURCES,
  TALK_MODES,
} from '../../src/content/welcome-options.ts'

describe('welcome-options', () => {
  it('у каждой опции есть id и подпись, id уникальны в списке', () => {
    for (const list of [DRINKS, MILK_OPTIONS, TALK_MODES, KID_NEEDS, SOURCES, CONTRAINDICATIONS_NEW]) {
      for (const o of list) {
        expect(o.id).toMatch(/^[a-z_]+$/)
        expect(o.label.trim()).not.toBe('')
      }
      expect(new Set(list.map((o) => o.id)).size).toBe(list.length)
    }
  })

  it('9 противопоказаний, из них 5 критических; у нового гостя + «Ничего из перечисленного»', () => {
    expect(CONTRAINDICATIONS).toHaveLength(9)
    expect(CONTRAINDICATIONS.filter((c) => c.critical).map((c) => c.label)).toEqual([
      'Беременность',
      'Период лактации',
      'Онкология (текущая или в анамнезе)',
      'Эпилепсия',
      'Приём ретиноидов / Роаккутана (последние 6 месяцев)',
    ])
    expect(CONTRAINDICATIONS_NEW.at(-1)!.label).toBe('Ничего из перечисленного')
  })

  it('молоко — полные и верные подписи', () => {
    expect(MILK_OPTIONS.map((m) => m.label)).toEqual(['Обычное', 'Кокосовое', 'Банановое', 'Миндальное', 'Фисташковое', 'Без молока'])
    expect(labelOf(MILK_OPTIONS, 'banana')).toBe('Банановое')
  })

  it('молоко — для капучино, американо и матчи; сахар и сливки — только для кофе', () => {
    expect([...MILK_TRIGGER].sort()).toEqual(['americano', 'cappuccino', 'matcha'])
    expect([...COFFEE].sort()).toEqual(['americano', 'cappuccino'])
    for (const id of [...MILK_TRIGGER]) expect(DRINKS.some((d) => d.id === id)).toBe(true)
  })

  it('неизвестный id возвращается как есть', () => {
    expect(labelOf(DRINKS, 'kombucha')).toBe('kombucha')
  })
})
