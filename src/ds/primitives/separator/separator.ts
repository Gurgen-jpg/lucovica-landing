import { html, type SafeHtml } from '../../../lib/html.ts'

export interface SeparatorProps {
  /** Символ логотипа по центру (замена LogoDivider) */
  symbol?: boolean
  /** Для тёмного блока (--lv-inverse) */
  inverse?: boolean
}

/** Декоративный разделитель: скрыт от вспомогательных технологий. */
export function separator({ symbol = false, inverse = false }: SeparatorProps = {}): SafeHtml {
  const tone = inverse ? 'white' : 'black'
  return html`<div class="ds-separator"${inverse ? html` data-inverse` : null} aria-hidden="true">${
    symbol
      ? html`<span class="ds-separator__line"></span><img class="ds-separator__symbol" src="/brand/symbol-${tone}-72.png" alt="" width="36" height="36"><span class="ds-separator__line"></span>`
      : html`<span class="ds-separator__line"></span>`
  }</div>`
}
