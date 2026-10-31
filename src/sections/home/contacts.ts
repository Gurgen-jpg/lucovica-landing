import { SECTIONS } from '../../content/home.ts'
import { links, site } from '../../content/site.ts'
import { button } from '../../ds/primitives/button/button.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

/** Место под встроенную форму записи: booking-pipeline заменит содержимое формой. */
function bookingSlot(): SafeHtml {
  return html`<div class="home-contacts__form" id="booking-form">
<p class="home-contacts__form-title">Записаться</p>
<p class="ds-small">Позвоните или напишите в Telegram — подберём удобное время и ответим на вопросы.</p>
<div class="home-contacts__form-actions">
${button({ label: 'Позвонить', href: links.tel, variant: 'inverse', attrs: { 'data-goal': 'click_phone' } })}
${button({ label: 'Написать в Telegram', href: links.telegram, external: true, variant: 'champagne', attrs: { 'data-goal': 'click_telegram' } })}
</div>
</div>`
}

export function contacts(): SafeHtml {
  return html`<section class="home-contacts ds-inverse" id="contacts" aria-labelledby="contacts-title">
<div class="ds-container home-contacts__inner">
<div class="home-contacts__info">
${sectionHeader({ ...SECTIONS.contacts, id: 'contacts-title' })}
<dl class="home-contacts__list">
<dt>Адрес</dt><dd>${site.address.street}<br><a href="${links.yandexOrg}" target="_blank" rel="noopener noreferrer">Построить маршрут</a></dd>
<dt>Часы</dt><dd>${site.hours.label}</dd>
<dt>Телефон</dt><dd><a href="${links.tel}" data-goal="click_phone">${site.phone.display}</a></dd>
<dt>Telegram</dt><dd><a href="${links.telegram}" target="_blank" rel="noopener noreferrer" data-goal="click_telegram">@${site.telegram.username}</a></dd>
</dl>
</div>
${bookingSlot()}
</div>
</section>`
}
