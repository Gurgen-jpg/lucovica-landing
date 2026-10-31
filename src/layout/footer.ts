import { links, site } from '../content/site.ts'
import { html, type SafeHtml } from '../lib/html.ts'
import { SERVICE_PAGES } from './nav.ts'

/** Год сборки — в строке копирайта */
export const BUILD_YEAR = new Date().getFullYear()

export function footer(): SafeHtml {
  return html`<footer class="site-footer ds-inverse">
<div class="ds-container site-footer__grid">
<div class="site-footer__brand">
<img src="/brand/logo-white-32.png" alt="${site.name}" width="105" height="16">
<p class="ds-small">${site.legalTagline} в центре Ростова-на-Дону</p>
</div>
<nav class="site-footer__col" aria-label="Услуги">
<p class="ds-overline">Услуги</p>
<ul role="list">${SERVICE_PAGES.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
</nav>
<div class="site-footer__col">
<p class="ds-overline">Контакты</p>
<address>
<p>${site.address.city}, ${site.address.street}</p>
<p>${site.hours.label}</p>
<p><a href="${links.tel}" data-goal="click_phone">${site.phone.display}</a></p>
<p><a href="${links.telegram}" target="_blank" rel="noopener noreferrer" data-goal="click_telegram">Telegram @${site.telegram.username}</a></p>
</address>
</div>
</div>
<div class="ds-container site-footer__bottom">
<p>© ${site.foundedYear} — ${BUILD_YEAR} · ${site.legalTagline}</p>
<a href="/privacy">Политика конфиденциальности</a>
</div>
</footer>`
}
