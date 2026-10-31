import { config } from '../config.ts'
import { links } from '../content/site.ts'
import { html, type SafeHtml } from '../lib/html.ts'
import { bookingButton } from './booking.ts'

/**
 * Плавающие кнопки: «Записаться» и мессенджеры. Появляются после прокрутки на 400px
 * (сторожевой элемент), «Записаться» скрывается у #contacts — см. src/client/floating.ts.
 */
export function floating(): SafeHtml {
  return html`<div class="site-floating-sentinel" aria-hidden="true"></div>
<div class="site-floating" data-floating hidden>
<div class="site-floating__messengers">
<a class="site-floating__messenger" href="${links.telegram}" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram" data-goal="click_telegram"><img src="/telegram.svg" alt="" width="20" height="20"></a>
${config.maxUrl ? html`<a class="site-floating__messenger" href="${config.maxUrl}" target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX"><img src="/max.svg" alt="" width="20" height="20"></a>` : null}
</div>
<div class="site-floating__cta" data-floating-cta>${bookingButton({ goal: 'floating_cta_click', size: 2 })}</div>
</div>`
}
