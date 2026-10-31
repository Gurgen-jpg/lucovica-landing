import { html, type SafeHtml } from '../../../lib/html.ts'

/** outline — линия; onyx — оникс с шампанью; soft — тёплая плашка */
export type BadgeVariant = 'outline' | 'onyx' | 'soft'

export function badge(label: string, variant: BadgeVariant = 'outline'): SafeHtml {
  return html`<span class="ds-badge" data-variant="${variant}">${label}</span>`
}
