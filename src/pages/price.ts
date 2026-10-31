// /price — прайс для ссылок из Telegram: узкая мобильная страница без каркаса сайта, noindex.
import { ELECTRO_CARD, minPriceOnPage, priceCards, type Audience, type PriceCardDef } from '../content/price-page.ts'
import { links, site } from '../content/site.ts'
import { badge } from '../ds/primitives/badge/badge.ts'
import { button } from '../ds/primitives/button/button.ts'
import { tabs } from '../ds/primitives/tabs/tabs.ts'
import { bookingButton } from '../layout/booking.ts'
import { bookingDialog } from '../layout/site.ts'
import { formatPrice } from '../lib/format.ts'
import { html, type SafeHtml } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'

const TITLE = 'Прайс-лист — студия эпиляции LUCOVICA'
const GOAL = 'price_cta_click'

function card(c: { id?: string; title: string; note?: string; bookingService: PriceCardDef['bookingService']; rows: { name: string; price: number }[] }): SafeHtml {
  return html`<section class="price-card" aria-label="${c.title}">
<h2 class="price-card__title">${c.title}</h2>
${c.note ? html`<p class="ds-small">${c.note}</p>` : null}
<ul class="price-card__rows" role="list">${c.rows.map(
    (r) => html`<li><span>${r.name}</span><span class="ds-price price-card__price">${formatPrice(r.price)}<span class="ds-price__currency">₽</span></span></li>`,
  )}</ul>
${bookingButton({ label: 'Записаться', ariaLabel: `Записаться: ${c.title}`, variant: 'outline', size: 2, service: c.bookingService, goal: GOAL, className: 'price-card__book' })}
</section>`
}

const panel = (audience: Audience) => html`<div class="price-page__cards">${priceCards()
  .filter((g) => g.audience === audience)
  .map(card)}</div>`

export const page: Page = {
  path: '/price',
  meta: {
    title: TITLE,
    description: `Лазерная эпиляция, шугаринг и электроэпиляция для девушек и мужчин в Ростове-на-Дону — от ${formatPrice(minPriceOnPage())} ₽. Онлайн-запись.`,
    // Как на текущем сайте: не индексировать (дублирует прайс главной), но ссылки учитывать
    noindex: true,
    follow: true,
    pageGoal: 'price_page_view',
  },
  render: () => html`<main class="price-page">
<header class="price-page__head">
<a href="/" aria-label="${site.name} — на главную"><img src="/brand/logo-black-44.png" alt="${site.name}" width="144" height="22"></a>
<p class="ds-overline">Студия эпиляции · ${site.address.city}</p>
<h1 class="ds-h1">Прайс-лист</h1>
<p class="ds-small">Популярные зоны. Цена за одну процедуру.</p>
${site.promo ? html`<p>${badge(`🎁 ${site.promo}`, 'soft')}</p>` : null}
</header>
${tabs({
  id: 'price',
  label: 'Для кого прайс',
  tabs: [
    { key: 'women', label: 'Девушкам', hash: '', panel: panel('women') },
    { key: 'men', label: 'Мужчинам', hash: '#men', panel: panel('men') },
  ],
})}
${card(ELECTRO_CARD)}
<section class="price-card" aria-labelledby="price-contacts">
<h2 class="price-card__title" id="price-contacts">Контакты</h2>
<p>${site.address.city}<br>${site.address.street}</p>
<p class="ds-small">${site.hours.label}</p>
<p><a href="${links.tel}" data-goal="click_phone">${site.phone.display}</a><br><a href="${links.telegram}" target="_blank" rel="noopener noreferrer" data-goal="click_telegram">Telegram @${site.telegram.username}</a></p>
<div class="price-page__links">
${button({ label: 'Открыть в Яндекс Картах', href: links.yandexOrg, external: true, variant: 'link', size: 2, attrs: { 'data-goal': 'price_map_click' } })}
${button({ label: 'Перейти на сайт', href: '/', variant: 'outline', size: 2, attrs: { 'data-goal': 'price_site_click' } })}
</div>
</section>
<div class="price-page__sticky">${bookingButton({ goal: GOAL })}</div>
</main>
${bookingDialog()}`,
}
