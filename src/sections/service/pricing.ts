// Цены страницы услуги: вкладки по категориям, запись у категории и у каждой позиции (service-pages 1.3).
import { categoryById, type BookingService } from '../../content/services.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { tabs } from '../../ds/primitives/tabs/tabs.ts'
import { bookingButton } from '../../layout/booking.ts'
import { formatPrice } from '../../lib/format.ts'
import { html, type HtmlValue, type SafeHtml } from '../../lib/html.ts'
import type { SectionHead } from './sections.ts'

export interface PriceItem {
  name: string
  short: string
  price: number
}

export interface PriceGroupDef {
  key: string
  label: string
  bookingService: BookingService
  items: readonly PriceItem[]
}

/** Группа цен из категории прайса (src/content/services.ts). */
export function groupFromCategory(id: string, label: string): PriceGroupDef {
  const c = categoryById(id)
  return { key: id, label, bookingService: c.bookingService, items: c.items }
}

export interface PricingOptions {
  /** Цель Метрики на кнопках записи */
  goal: string
  /** Подпись действия у позиции: «Записаться» / «Оформить» */
  itemLabel?: string
  /** Подпись цены у позиции; для сертификатов номинал и есть цена */
  hideItemPrice?: boolean
  /** Примечание под ценами */
  note?: HtmlValue
}

function rows(g: PriceGroupDef, opts: PricingOptions): SafeHtml {
  return html`<ul class="price-list" role="list">
${g.items.map(
  (item) => html`<li class="price-list__row svc-price-row">
<span class="price-list__text"><span class="price-list__name">${item.name}</span><span class="price-list__short">${item.short}</span></span>
${opts.hideItemPrice ? null : html`<span class="ds-price price-list__price">${formatPrice(item.price)}<span class="ds-price__currency">₽</span></span>`}
${bookingButton({ label: opts.itemLabel ?? 'Записаться', ariaLabel: `${opts.itemLabel ?? 'Записаться'}: ${item.name}`, variant: 'link', size: 2, service: g.bookingService, detail: item.name, goal: opts.goal, className: 'svc-price-row__book' })}
</li>`,
)}
</ul>`
}

function panel(g: PriceGroupDef, opts: PricingOptions): SafeHtml {
  return html`${rows(g, opts)}
${opts.itemLabel ? null : bookingButton({ label: 'Записаться на процедуру', variant: 'link', service: g.bookingService, goal: opts.goal, className: 'price-panel__cta' })}`
}

export function servicePricing(head: SectionHead, groups: readonly PriceGroupDef[], opts: PricingOptions): SafeHtml {
  return html`<section class="svc-section ds-container home-prices" id="prices" aria-labelledby="prices-title">
<div class="home-prices__head">${sectionHeader({ ...head, id: 'prices-title' })}</div>
<div class="home-prices__body">
${groups.length > 1
  ? tabs({ id: 'svc-prices', label: 'Категории цен', tabs: groups.map((g) => ({ key: g.key, label: g.label, panel: panel(g, opts) })) })
  : panel(groups[0]!, opts)}
${opts.note ? html`<p class="ds-small svc-note">${opts.note}</p>` : null}
</div>
</section>`
}
