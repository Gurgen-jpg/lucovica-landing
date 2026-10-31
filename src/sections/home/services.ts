import { SECTIONS, SERVICE_CARDS } from '../../content/home.ts'
import { minPrice } from '../../content/services.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { formatPrice } from '../../lib/format.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

const pad = (n: number) => String(n).padStart(2, '0')

export function services(): SafeHtml {
  const { description, ...head } = SECTIONS.services
  return html`<section class="home-section ds-container" id="services" aria-labelledby="services-title">
<div class="home-split-head">
${sectionHeader({ ...head, id: 'services-title' })}
<p class="ds-body home-split-head__note">${description}</p>
</div>
<ul class="home-services" role="list">
${SERVICE_CARDS.map(
  (card, i) => html`<li><a class="home-services__card" href="${card.href}">
<span class="home-services__num">${pad(i + 1)}</span>
<h3 class="home-services__title">${card.title}</h3>
<span class="home-services__desc">${card.description}</span>
<span class="home-services__from">от ${formatPrice(minPrice(card.priceFrom))} ₽</span>
</a></li>`,
)}
</ul>
</section>`
}
