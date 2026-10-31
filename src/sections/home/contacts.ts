import { SECTIONS } from '../../content/home.ts'
import { links, site } from '../../content/site.ts'
import { bookingForm } from '../../ds/patterns/booking-form/booking-form.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

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
<div class="home-contacts__form">${bookingForm({ id: 'contact-form', variant: 'inline' })}</div>
</div>
</section>`
}
