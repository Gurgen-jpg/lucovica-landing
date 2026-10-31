import { links, site } from '../content/site.ts'
import { dialog } from '../ds/primitives/dialog/dialog.ts'
import { html, type SafeHtml } from '../lib/html.ts'
import { bookingButton } from './booking.ts'
import { HEADER_NAV } from './nav.ts'

const LOGO = html`<img src="/brand/logo-black-44.png" alt="${site.name}" width="144" height="22">`

const MENU_ICON = html`<svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true" focusable="false"><path d="M0 1h22M0 11h22" stroke="currentColor" stroke-width="1"/></svg>`

/** Промо-плашка: текст акции из настроек; пустой текст — плашки нет. */
export function promoBar(): SafeHtml | null {
  return site.promo ? html`<aside class="site-promo ds-inverse" aria-label="Акция"><p>${site.promo}</p></aside>` : null
}

function mobileMenu(): SafeHtml {
  return dialog({
    id: 'site-menu',
    title: 'Меню',
    variant: 'sheet',
    closeLabel: 'Закрыть меню',
    body: html`<nav class="site-menu" aria-label="Основная навигация">
<ul role="list">${HEADER_NAV.map((l) => html`<li><a href="${l.href}" data-dialog-close>${l.label}</a></li>`)}</ul>
</nav>
<a class="site-menu__phone" href="${links.tel}" data-goal="header_phone_click">${site.phone.display}</a>
<p class="ds-small">${site.hours.label}<br>${site.address.short}</p>`,
  })
}

/** Хедер: навигация слева, логотип по центру, телефон и запись справа; ниже 768px — меню. */
export function header(): SafeHtml {
  return html`<header class="site-header">
<div class="site-header__inner ds-container">
<nav class="site-header__nav" aria-label="Основная навигация">
${HEADER_NAV.map((l) => html`<a href="${l.href}">${l.label}</a>`)}
</nav>
<a class="site-header__logo" href="/" aria-label="${site.name} — на главную">${LOGO}</a>
<div class="site-header__actions">
<a class="site-header__phone" href="${links.tel}" data-goal="header_phone_click">${site.phone.display}</a>
${bookingButton({ size: 2 })}
<button class="site-header__menu" type="button" aria-label="Открыть меню" aria-haspopup="dialog" data-dialog-open="site-menu">${MENU_ICON}</button>
</div>
</div>
</header>
${mobileMenu()}`
}

/** Упрощённый хедер служебных страниц: логотип и «← На главную». */
export function minimalHeader(): SafeHtml {
  return html`<header class="site-header" data-minimal>
<div class="site-header__inner ds-container">
<a class="site-header__logo" href="/" aria-label="${site.name} — на главную">${LOGO}</a>
<a class="site-header__back" href="/">← На главную</a>
</div>
</header>`
}
