import { SECTIONS } from '../../content/home.ts'
import { RITUAL } from '../../content/ritual.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

export function ritual(): SafeHtml {
  return html`<section class="home-section ds-container" aria-labelledby="ritual-title">
${sectionHeader({ ...SECTIONS.ritual, id: 'ritual-title' })}
<ol class="home-ritual" role="list">
${RITUAL.map(
  (s) => html`<li><span class="home-ritual__num" aria-hidden="true">${s.numeral}</span><h3 class="home-ritual__title">${s.title}</h3><p class="home-ritual__text">${s.text}</p></li>`,
)}
</ol>
</section>`
}
