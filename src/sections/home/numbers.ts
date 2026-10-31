import { NUMBERS } from '../../content/numbers.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

export function numbers(): SafeHtml {
  return html`<section class="home-numbers" aria-labelledby="numbers-title">
<span id="trust" class="anchor"></span>
<h2 class="ds-sr-only" id="numbers-title">Студия в цифрах</h2>
<ul class="home-numbers__list ds-container" role="list">
${NUMBERS.map((f) => html`<li><span class="home-numbers__value">${f.value}</span><span class="home-numbers__label">${f.label}</span></li>`)}
</ul>
</section>`
}
