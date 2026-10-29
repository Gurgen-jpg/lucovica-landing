// Тег-шаблон для генерации HTML при сборке.
// Все интерполяции экранируются; доверенная разметка помечается raw().

export class SafeHtml {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value
  }
}

export type HtmlValue = SafeHtml | string | number | boolean | null | undefined | readonly HtmlValue[]

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ESCAPES[ch] ?? ch)
}

function stringify(value: HtmlValue): string {
  if (value instanceof SafeHtml) return value.value
  if (Array.isArray(value)) return value.map(stringify).join('')
  if (value === null || value === undefined || value === false || value === true) return ''
  return escapeHtml(String(value))
}

export function html(strings: TemplateStringsArray, ...values: HtmlValue[]): SafeHtml {
  let out = strings[0] ?? ''
  for (let i = 0; i < values.length; i++) {
    out += stringify(values[i]) + (strings[i + 1] ?? '')
  }
  return new SafeHtml(out)
}

/** Вставка без экранирования — только для доверенной разметки (JSON-LD, SVG из репозитория). */
export function raw(markup: string): SafeHtml {
  return new SafeHtml(markup)
}

/** JSON для <script type="application/ld+json">: экранируем `<`, чтобы `</script>` не закрыл тег. */
export function jsonScript(data: unknown): SafeHtml {
  return raw(JSON.stringify(data).replace(/</g, '\\u003c'))
}
