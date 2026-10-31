// Каркас публичных страниц (site-chrome): промо-плашка, хедер, main, футер, плавающие кнопки.
import { bookingForm } from '../ds/patterns/booking-form/booking-form.ts'
import { dialog } from '../ds/primitives/dialog/dialog.ts'
import { titleWithAccent } from '../ds/primitives/section-header/section-header.ts'
import { html, type SafeHtml } from '../lib/html.ts'
import { floating } from './floating.ts'
import { footer } from './footer.ts'
import { header, minimalHeader, promoBar } from './header.ts'

/** Диалог записи: один на страницу, открывается кнопками [data-booking] (src/client/booking.ts). */
export function bookingDialog(): SafeHtml {
  return dialog({
    id: 'booking',
    overline: 'Запись',
    title: 'Ваш визит',
    titleContent: html`<span data-mode="booking">${titleWithAccent('Ваш визит', 'визит')}</span><span data-mode="cert">Оформление сертификата</span>`,
    body: bookingForm({ id: 'booking-form', variant: 'dialog' }),
  })
}

export function sitePage(main: SafeHtml): SafeHtml {
  return html`${promoBar()}
${header()}
<main id="main">
${main}
</main>
${footer()}
${floating()}
${bookingDialog()}`
}

/** Служебные страницы (/privacy): без промо и плавающих кнопок. */
export function minimalPage(main: SafeHtml): SafeHtml {
  return html`${minimalHeader()}
<main id="main">
${main}
</main>
${footer()}`
}
