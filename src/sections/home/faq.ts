import type { FaqItem } from '../../content/faq-home.ts'
import { SECTIONS } from '../../content/home.ts'
import { accordion } from '../../ds/primitives/accordion/accordion.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

export function faq(items: readonly FaqItem[]): SafeHtml {
  return html`<section class="home-section ds-container home-faq" id="faq" aria-labelledby="faq-title">
${sectionHeader({ ...SECTIONS.faq, id: 'faq-title' })}
${accordion({ id: 'faq', items: items.map((f) => ({ question: f.question, answer: html`<p>${f.answer}</p>` })), defaultOpen: 0 })}
</section>`
}
