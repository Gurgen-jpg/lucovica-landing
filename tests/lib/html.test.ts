import { describe, expect, it } from 'vitest'
import { escapeHtml, html, jsonScript, raw } from '../../src/lib/html.ts'

describe('html', () => {
  it('экранирует интерполяции', () => {
    const name = '<script>alert(1)</script>'
    expect(html`<p>${name}</p>`.value).toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>')
  })

  it('экранирует кавычки в атрибутах', () => {
    const title = `"><img src=x onerror=alert(1)>'`
    expect(html`<a title="${title}">x</a>`.value).toBe(
      '<a title="&quot;&gt;&lt;img src=x onerror=alert(1)&gt;&#39;">x</a>',
    )
  })

  it('не экранирует вложенные шаблоны повторно', () => {
    const inner = html`<b>${'A & B'}</b>`
    expect(html`<p>${inner}</p>`.value).toBe('<p><b>A &amp; B</b></p>')
  })

  it('склеивает массивы и пропускает пустые значения', () => {
    const items = ['a', 'b'].map((x) => html`<li>${x}</li>`)
    expect(html`<ul>${items}${null}${undefined}${false}</ul>`.value).toBe('<ul><li>a</li><li>b</li></ul>')
  })

  it('выводит числа и 0', () => {
    expect(html`${0} ${4490}`.value).toBe('0 4490')
  })

  it('raw вставляет разметку как есть', () => {
    expect(html`<div>${raw('<svg/>')}</div>`.value).toBe('<div><svg/></div>')
  })

  it('jsonScript не даёт закрыть тег script', () => {
    expect(jsonScript({ a: '</script>' }).value).toBe('{"a":"\\u003c/script>"}')
  })

  it('escapeHtml экранирует все пять символов', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;')
  })
})
