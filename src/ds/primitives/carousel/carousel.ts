import { html, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'

export interface CarouselProps {
  /** Доступное имя: «Отзывы гостей» */
  label: string
  slides: readonly HtmlValue[]
  prevLabel?: string
  nextLabel?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

const ARROW = (d: string) =>
  html`<svg width="20" height="12" viewBox="0 0 20 12" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1"/></svg>`

/**
 * Карусель WAI-ARIA APG (без автопрокрутки). Без JS все слайды видимы списком,
 * управление скрыто; init показывает один слайд и кнопки.
 */
export function carousel(props: CarouselProps): SafeHtml {
  const total = props.slides.length
  return html`<section class="ds-carousel" data-ds="carousel" aria-roledescription="карусель" aria-label="${props.label}">
<div class="ds-carousel__slides">
${props.slides.map(
  (slide, i) =>
    html`<div class="ds-carousel__slide" role="group" aria-roledescription="слайд" aria-label="${i + 1} из ${total}">${slide}</div>`,
)}
</div>
<div class="ds-carousel__controls" hidden>
<button class="ds-carousel__button" type="button" data-carousel="prev" aria-label="${props.prevLabel ?? 'Предыдущий слайд'}">${ARROW('M7 1L2 6l5 5M2 6h18')}</button>
<p class="ds-carousel__status" aria-live="polite" aria-atomic="true">01 / ${pad(total)}</p>
<button class="ds-carousel__button" type="button" data-carousel="next" aria-label="${props.nextLabel ?? 'Следующий слайд'}">${ARROW('M13 1l5 5-5 5M18 6H0')}</button>
</div>
</section>`
}
