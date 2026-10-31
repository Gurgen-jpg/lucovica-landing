import { HERO } from '../../content/home.ts'
import { site } from '../../content/site.ts'
import { button } from '../../ds/primitives/button/button.ts'
import { photo } from '../../ds/primitives/photo/photo.ts'
import { titleWithAccent } from '../../ds/primitives/section-header/section-header.ts'
import { bookingButton } from '../../layout/booking.ts'
import { html, type SafeHtml } from '../../lib/html.ts'
import type { ImageManifest } from '../../lib/images.ts'

export function hero(images: ImageManifest): SafeHtml {
  return html`<section class="home-hero ds-container" aria-labelledby="hero-title">
<div class="home-hero__text">
<p class="ds-overline">${HERO.overline}</p>
<h1 class="home-hero__title" id="hero-title">${titleWithAccent(HERO.title, HERO.accent)}</h1>
<p class="ds-lead home-hero__lead">${HERO.lead}</p>
<div class="home-hero__actions">
${bookingButton({ label: 'Записаться онлайн' })}
${button({ label: 'Услуги и цены', href: '#prices', variant: 'outline' })}
</div>
</div>
<figure class="home-hero__figure">
${photo(images, { ...HERO.photo, ratio: '4/5', priority: true, sizes: '(min-width: 1280px) 520px, (min-width: 768px) 45vw, 100vw' })}
<figcaption class="home-hero__caption"><span>${site.address.short}</span><span>${site.hours.short}</span></figcaption>
</figure>
</section>`
}
