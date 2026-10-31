import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { attrs } from '../../src/ds/attrs.ts'
import { accordion } from '../../src/ds/primitives/accordion/accordion.ts'
import { badge } from '../../src/ds/primitives/badge/badge.ts'
import { button } from '../../src/ds/primitives/button/button.ts'
import { carousel } from '../../src/ds/primitives/carousel/carousel.ts'
import { checkbox, chipGroup, yesNo } from '../../src/ds/primitives/choice/choice.ts'
import { dialog } from '../../src/ds/primitives/dialog/dialog.ts'
import { selectField, textField } from '../../src/ds/primitives/field/field.ts'
import { sectionHeader, titleWithAccent } from '../../src/ds/primitives/section-header/section-header.ts'
import { separator } from '../../src/ds/primitives/separator/separator.ts'
import { tabs } from '../../src/ds/primitives/tabs/tabs.ts'
import { tooltip } from '../../src/ds/primitives/tooltip/tooltip.ts'

describe('attrs', () => {
  it('экранирует значения, пропускает false/null, булевы — без значения', () => {
    expect(attrs({ id: 'a"b', hidden: true, disabled: false, title: null }).value).toBe(' id="a&quot;b" hidden')
  })

  it('отклоняет недопустимые имена', () => {
    expect(() => attrs({ 'onclick x': '1' })).toThrow()
  })
})

describe('button', () => {
  it('по умолчанию — <button type="button"> solid, размер 3', () => {
    expect(button({ label: 'Записаться' }).value).toBe(
      '<button class="ds-button" type="button" data-variant="solid" data-size="3">Записаться</button>',
    )
  })

  it('с href — ссылка, без type и disabled', () => {
    const out = button({ label: 'Цены', href: '/price', variant: 'outline', size: 2 }).value
    expect(out).toBe('<a class="ds-button" data-variant="outline" data-size="2" href="/price">Цены</a>')
  })

  it('внешняя ссылка открывается в новой вкладке с rel', () => {
    expect(button({ label: 'TG', href: 'https://t.me/x', external: true }).value).toContain(
      'target="_blank" rel="noopener noreferrer"',
    )
  })

  it('disabled и дополнительные атрибуты', () => {
    const out = button({ label: 'Отправить', type: 'submit', disabled: true, attrs: { 'data-goal': 'form_submit' } }).value
    expect(out).toContain('type="submit"')
    expect(out).toContain(' disabled')
    expect(out).toContain('data-goal="form_submit"')
  })

  it('экранирует текст', () => {
    expect(button({ label: '<b>' }).value).toContain('&lt;b&gt;')
  })
})

describe('статические примитивы', () => {
  it('badge — вариант атрибутом', () => {
    expect(badge('Хит', 'onyx').value).toBe('<span class="ds-badge" data-variant="onyx">Хит</span>')
  })

  it('separator скрыт от вспомогательных технологий, символ — с пустым alt', () => {
    const out = separator({ symbol: true, inverse: true }).value
    expect(out).toContain('aria-hidden="true"')
    expect(out).toContain('src="/brand/symbol-white-72.png" alt=""')
  })

  it('titleWithAccent оборачивает акцент в <em>', () => {
    expect(titleWithAccent('Часто спрашивают', 'спрашивают').value).toBe('Часто <em>спрашивают</em>')
    expect(() => titleWithAccent('Часто спрашивают', 'нет')).toThrow()
  })

  it('sectionHeader — уровень и размер заголовка', () => {
    const out = sectionHeader({ overline: 'FAQ', title: 'Часто спрашивают', accent: 'спрашивают', id: 'faq' }).value
    expect(out).toContain('<p class="ds-overline">FAQ</p>')
    expect(out).toContain('<h2 class="ds-h2" id="faq">Часто <em>спрашивают</em></h2>')
    expect(sectionHeader({ title: 'Главная', level: 1 }).value).toContain('<h1 class="ds-h1">Главная</h1>')
  })
})

describe('интерактивные примитивы: исходный HTML', () => {
  it('accordion — без JS все ответы раскрыты и связаны с кнопками', () => {
    const out = accordion({ id: 'faq', items: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }] }).value
    expect(out.match(/aria-expanded="true"/g)).toHaveLength(2)
    expect(out).toContain('id="faq-q1" aria-expanded="true" aria-controls="faq-a1"')
    expect(out).toContain('id="faq-a1" role="region" aria-labelledby="faq-q1"')
    expect(out).not.toContain(' hidden')
    expect(out).toContain('A2')
  })

  it('tabs — все панели в HTML, список вкладок скрыт до JS', () => {
    const out = tabs({
      id: 'p',
      label: 'Категории цен',
      tabs: [
        { key: 'laser', label: 'Лазер', panel: 'L' },
        { key: 'sugar', label: 'Шугаринг', panel: 'S' },
      ],
    }).value
    expect(out).toContain('role="tablist" aria-label="Категории цен" hidden')
    expect(out).toContain('id="p-tab-laser" aria-controls="p-panel-laser" aria-selected="true" tabindex="0"')
    expect(out).toContain('id="p-tab-sugar" aria-controls="p-panel-sugar" aria-selected="false" tabindex="-1"')
    expect(out.match(/role="tabpanel"/g)).toHaveLength(2)
    expect(out).not.toMatch(/role="tabpanel"[^>]*hidden/)
  })

  it('carousel — все слайды в HTML, индикатор «01 / 03»', () => {
    const out = carousel({ label: 'Отзывы', slides: ['a', 'b', 'c'], nextLabel: 'Следующий отзыв' }).value
    expect(out.match(/aria-roledescription="слайд"/g)).toHaveLength(3)
    expect(out).toContain('aria-label="3 из 3"')
    expect(out).toContain('aria-live="polite" aria-atomic="true">01 / 03<')
    expect(out).toContain('aria-label="Следующий отзыв"')
  })

  it('dialog — доступное имя и кнопка закрытия', () => {
    const out = dialog({ id: 'book', title: 'Ваш визит', accent: 'визит', body: 'x' }).value
    expect(out).toContain('<dialog class="ds-dialog" id="book" aria-labelledby="book-title" data-ds="dialog">')
    expect(out).toContain('id="book-title">Ваш <em>визит</em>')
    expect(out).toContain('aria-label="Закрыть" data-dialog-close')
  })

  it('textField — подпись, связь с ошибкой, телефон с autocomplete', () => {
    const out = textField({ id: 'ph', name: 'phone', label: 'Телефон', type: 'tel', required: true }).value
    expect(out).toContain('<label class="ds-field__label" for="ph">Телефон</label>')
    expect(out).toContain('type="tel"')
    expect(out).toContain('autocomplete="tel"')
    expect(out).toContain('inputmode="tel"')
    expect(out).toContain('aria-describedby="ph-error"')
    expect(out).toContain('<p class="ds-field__error" id="ph-error" hidden></p>')
  })

  it('textField с ошибкой при рендере — aria-invalid и видимый текст', () => {
    const out = textField({ id: 'n', name: 'name', label: 'Имя', error: 'Заполните поле' }).value
    expect(out).toContain('aria-invalid="true"')
    expect(out).toContain('id="n-error">Заполните поле</p>')
  })

  it('selectField — нативный select с пустым первым пунктом', () => {
    const out = selectField({ id: 's', name: 'service', label: 'Услуга', placeholder: 'Выберите', options: [{ value: 'laser', label: 'Лазер' }] }).value
    expect(out).toContain('<select class="ds-field__input" id="s" name="service"')
    expect(out).toContain('<option value="" selected>Выберите</option>')
  })

  it('checkbox и yesNo — нативные input', () => {
    expect(checkbox({ id: 'c', name: 'consent', label: 'Согласна', checked: true }).value).toMatch(/type="checkbox"[^>]* checked/)
    const yn = yesNo({ id: 't', name: 'tan', legend: 'Загар?', value: 'no' }).value
    expect(yn).toContain('<legend class="ds-yesno__legend">Загар?</legend>')
    expect(yn).toMatch(/id="t-no" name="tan" value="no" checked/)
  })

  it('chipGroup — aria-pressed и скрытое поле со значениями', () => {
    const out = chipGroup({
      name: 'offer',
      label: 'Что предложить?',
      multiple: true,
      options: [
        { value: 'coffee', label: 'Кофе', pressed: true },
        { value: 'tea', label: 'Чай' },
      ],
    }).value
    expect(out).toContain('role="group" aria-label="Что предложить?"')
    expect(out).toContain('aria-pressed="true" value="coffee"')
    expect(out).toContain('aria-pressed="false" value="tea"')
    expect(out).toContain('<input type="hidden" name="offer" value="coffee">')
  })

  it('tooltip — связан с триггером через aria-describedby', () => {
    const out = tooltip({ id: 'eq', text: 'Диодный лазер', triggerLabel: 'Об оборудовании' }).value
    expect(out).toContain('aria-describedby="eq-tip"')
    expect(out).toContain('role="tooltip" id="eq-tip">Диодный лазер<')
  })
})

describe('токены', () => {
  it('содержат палитру из спеки design-tokens', async () => {
    const css = await readFile('src/ds/tokens.css', 'utf8')
    const gray = ['#FCFBF9', '#F7F5F0', '#F0EDE7', '#E8E4DD', '#E0DCD4', '#D2CEC6', '#C0BBB2', '#A39F97', '#7D7A74', '#6B6965', '#4A4845', '#1A1A1C']
    gray.forEach((hex, i) => expect(css).toContain(`--gray-${i + 1}: ${hex};`))
    expect(css).toContain('--lv-onyx: #141416;')
    expect(css).toContain('--lv-champagne: #B8A47E;')
    expect(css).toContain('--ease-silk: cubic-bezier(.22, .61, .12, 1);')
    for (const [n, px] of [[1, 4], [5, 24], [10, 160], [11, 240]]) expect(css).toContain(`--space-${n}: ${px}px;`)
  })

  it('цвета старого сайта не используются', async () => {
    const { readdir } = await import('node:fs/promises')
    const files = (await readdir('src', { recursive: true })).filter((f) => f.endsWith('.css'))
    for (const f of files) {
      const css = (await readFile(`src/${f}`, 'utf8')).toUpperCase()
      expect(css, f).not.toContain('#F5F0C6')
      expect(css, f).not.toContain('#D9E4EB')
    }
  })
})
