import { SECTIONS } from '../../content/home.ts'
import type { Review } from '../../content/reviews.ts'
import { links, site } from '../../content/site.ts'
import { carousel } from '../../ds/primitives/carousel/carousel.ts'
import { html, type SafeHtml } from '../../lib/html.ts'

export function reviews(items: readonly Review[]): SafeHtml {
  return html`<section class="home-section ds-container" id="reviews" aria-labelledby="reviews-title">
<div class="home-reviews">
<div class="home-reviews__head">
<h2 class="ds-overline" id="reviews-title">${SECTIONS.reviews.overline}</h2>
<p class="ds-overline">${site.yandexMaps.rating.toFixed(1)} · Яндекс Карты</p>
</div>
${carousel({
  label: 'Лента отзывов',
  prevLabel: 'Предыдущий отзыв',
  nextLabel: 'Следующий отзыв',
  slides: items.map(
    (r) => html`<figure class="home-reviews__item">
<blockquote class="home-reviews__text"><p>«${r.text}»</p></blockquote>
<figcaption class="home-reviews__author"><span class="home-reviews__name">${r.name}</span><span class="home-reviews__service">${r.service}</span></figcaption>
</figure>`,
  ),
})}
<a class="home-reviews__all" href="${links.yandexReviews}" target="_blank" rel="noopener noreferrer">Все отзывы на Яндекс Картах</a>
</div>
</section>`
}
