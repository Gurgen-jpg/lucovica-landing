// Форма записи (booking-form): один шаблон для диалога и для секции «Контакты» (booking-pipeline D1).
// Без JS — обычный POST на /api/lead; с JS — fetch и состояния в src/client/booking.ts.
import { links, site } from '../../../content/site.ts'
import { SERVICE_NAMES_FOR_FORM } from '../../../content/services.ts'
import { html, type SafeHtml } from '../../../lib/html.ts'
import { button } from '../../primitives/button/button.ts'
import { checkbox } from '../../primitives/choice/choice.ts'
import { selectField, textField } from '../../primitives/field/field.ts'

export const CERTIFICATE_SERVICE = 'Подарочный сертификат'
export const TIME_SLOTS = ['Утро (10–13)', 'День (13–17)', 'Вечер (17–21)'] as const
/** «Перезвоним в течение часа, ежедневно с 10:00 до 21:00.» */
export const CALLBACK_NOTE = `Перезвоним в течение часа, ежедневно с ${site.hours.opens} до ${site.hours.closes}.`
export const CONTACT_METHODS = ['Звонок', 'Telegram', 'WhatsApp', 'MAX'] as const

export interface BookingFormProps {
  /** Префикс id полей: уникален на странице */
  id: string
  variant: 'dialog' | 'inline'
}

function options(prefix: string, name: string, legend: string, values: readonly string[], checked?: string): SafeHtml {
  return html`<fieldset class="booking-form__options" data-field="${name}">
<legend class="ds-field__label">${legend}</legend>
<div class="booking-form__option-list">
${values.map(
  (v, i) => html`<label class="booking-form__option" for="${prefix}-${name}-${i}">
<input type="radio" id="${prefix}-${name}-${i}" name="${name}" value="${v}"${v === checked ? html` checked` : null}>
<span>${v}</span>
</label>`,
)}
</div>
</fieldset>`
}

export function bookingForm({ id, variant }: BookingFormProps): SafeHtml {
  return html`<form class="booking-form" id="${id}" action="/api/lead" method="post" data-booking-form data-variant="${variant}" data-state="idle" data-phone="${site.phone.display}">
${variant === 'inline' ? html`<h3 class="booking-form__title"><span data-mode="booking">Записаться</span><span data-mode="cert">Оформление сертификата</span></h3>` : null}
<div class="booking-form__fields">
${textField({ id: `${id}-name`, name: 'name', label: 'Имя', required: true, requiredMessage: 'Укажите имя', autocomplete: 'given-name', maxlength: 100 })}
${textField({ id: `${id}-phone`, name: 'phone', label: 'Телефон', type: 'tel', required: true, requiredMessage: 'Введите номер полностью', placeholder: '+7 (___) ___-__-__', maxlength: 30 })}
<div class="booking-form__service">
${selectField({ id: `${id}-service`, name: 'service', label: 'Услуга', placeholder: 'Выберите услугу', options: SERVICE_NAMES_FOR_FORM.map((s) => ({ value: s, label: s })) })}
<p class="booking-form__detail" data-detail hidden>Зона: <span data-detail-text></span></p>
</div>
<div class="booking-form__booking-only">
${options(id, 'time', 'Удобное время', TIME_SLOTS)}
</div>
${options(id, 'contact_method', 'Способ связи', CONTACT_METHODS, 'Звонок')}
<div class="booking-form__messenger">
${textField({ id: `${id}-messenger`, name: 'messenger', label: 'Ник или номер в мессенджере', placeholder: '@username или +7…', hint: 'Если оставить пустым — напишем на номер телефона выше.', autocomplete: 'off', maxlength: 100 })}
</div>
${site.promo ? html`<div class="booking-form__booking-only">${checkbox({ id: `${id}-promo`, name: 'promo', value: site.promo, label: html`Хочу акцию: <strong>${site.promo.toLowerCase()}</strong>` })}</div>` : null}
<div class="booking-form__hp" aria-hidden="true"><label>Не заполняйте это поле <input type="text" name="_hp" tabindex="-1" autocomplete="off"></label></div>
<p class="booking-form__error" role="alert" data-error hidden></p>
${button({ label: html`<span data-mode="booking">Отправить заявку</span><span data-mode="cert">Оформить</span><span data-sending>Отправка…</span>`, type: 'submit', className: 'booking-form__submit' })}
<p class="booking-form__note">Нажимая кнопку, вы соглашаетесь с <a href="/privacy" target="_blank">политикой конфиденциальности</a>. ${CALLBACK_NOTE}</p>
</div>
<div class="booking-form__success" data-success tabindex="-1" hidden>
<p class="booking-form__success-title"><span data-mode="booking">Заявка принята!</span><span data-mode="cert">Заявка на сертификат принята!</span></p>
<p>${CALLBACK_NOTE}</p>
<p class="booking-form__success-links"><a href="${links.tel}" data-goal="click_phone">${site.phone.display}</a> · <a href="${links.telegram}" target="_blank" rel="noopener noreferrer" data-goal="click_telegram">Telegram</a></p>
</div>
</form>`
}
