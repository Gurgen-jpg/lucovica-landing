// Дополнительные HTML-атрибуты примитивов: data-goal, data-dialog-open, id, aria-*.
import { html, raw, type SafeHtml } from '../lib/html.ts'

export type Attrs = Readonly<Record<string, string | number | boolean | null | undefined>>

const NAME = /^[a-z][a-z0-9-]*$/

/** Рендерит атрибуты с ведущим пробелом. Значения экранируются, имена проверяются. */
export function attrs(values: Attrs = {}): SafeHtml {
  const parts: SafeHtml[] = []
  for (const [name, value] of Object.entries(values)) {
    if (!NAME.test(name)) throw new Error(`Недопустимое имя атрибута: ${name}`)
    if (value === false || value === null || value === undefined) continue
    parts.push(value === true ? raw(` ${name}`) : html` ${raw(name)}="${String(value)}"`)
  }
  return html`${parts}`
}

/** Склеивает классы, пропуская пустые. */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ')
}
