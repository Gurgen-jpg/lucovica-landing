// Каркас публичных страниц (site-chrome): промо-плашка, хедер, main, футер, плавающие кнопки.
import { html, type SafeHtml } from '../lib/html.ts'
import { floating } from './floating.ts'
import { footer } from './footer.ts'
import { header, minimalHeader, promoBar } from './header.ts'

export function sitePage(main: SafeHtml): SafeHtml {
  return html`${promoBar()}
${header()}
<main id="main">
${main}
</main>
${footer()}
${floating()}`
}

/** Служебные страницы (/privacy): без промо и плавающих кнопок. */
export function minimalPage(main: SafeHtml): SafeHtml {
  return html`${minimalHeader()}
<main id="main">
${main}
</main>
${footer()}`
}
