import { SECTIONS } from '../../content/home.ts'
import { byGroup, ELECTRO_PRICES, PRICE_TABS, type PriceTab, type ServiceItem } from '../../content/services.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { tabs } from '../../ds/primitives/tabs/tabs.ts'
import { bookingButton } from '../../layout/booking.ts'
import { formatPrice } from '../../lib/format.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

export function priceRows(items: readonly ServiceItem[]): SafeHtml {
  return html`<ul class="price-list" role="list">
${items.map(
  (item) => html`<li class="price-list__row">
<span class="price-list__text"><span class="price-list__name">${item.name}</span><span class="price-list__short">${item.short}</span></span>
<span class="ds-price price-list__price">${formatPrice(item.price)}<span class="ds-price__currency">₽</span></span>
</li>`,
)}
</ul>`
}

function panel(tab: PriceTab): SafeHtml {
  const groups =
    tab.group === 'electro'
      ? [{ audience: 'Тарифы по времени', items: ELECTRO_PRICES }]
      : byGroup(tab.group)
  return html`<div class="price-panel"${groups.length > 1 ? html` data-columns` : null}>
${groups.map(
  (g) => html`<div class="price-panel__group">
<h3 class="ds-overline price-panel__audience">${g.audience}</h3>
${priceRows(g.items)}
</div>`,
)}
</div>
${bookingButton({ label: 'Записаться на процедуру', variant: 'link', service: tab.bookingService, className: 'price-panel__cta' })}`
}

export function prices(): SafeHtml {
  return html`<section class="home-section ds-container home-prices" id="prices" aria-labelledby="prices-title">
<span id="pricing" class="anchor"></span>
<div class="home-prices__head">
${sectionHeader({ ...SECTIONS.prices, id: 'prices-title' })}
</div>
<div class="home-prices__body">
${tabs({ id: 'prices', label: 'Категории цен', tabs: PRICE_TABS.map((t) => ({ key: t.group, label: t.label, panel: panel(t) })) })}
</div>
</section>`
}
