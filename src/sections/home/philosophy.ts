import { PHILOSOPHY } from '../../content/home.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

export function philosophy(): SafeHtml {
  return html`<section class="home-philosophy ds-inverse" aria-label="${PHILOSOPHY.caption}">
<figure class="home-philosophy__inner ds-container">
<img src="/brand/symbol-white-128.png" alt="" width="77" height="64">
<blockquote class="home-philosophy__quote"><p>${PHILOSOPHY.quote}</p></blockquote>
<figcaption class="home-philosophy__caption">${PHILOSOPHY.caption}</figcaption>
</figure>
</section>`
}
