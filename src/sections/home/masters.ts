import { SECTIONS } from '../../content/home.ts'
import { HYGIENE_STANDARDS, MASTERS, MASTERS_STATEMENT } from '../../content/masters.ts'
import { photo } from '../../ds/primitives/photo/photo.ts'
import { sectionHeader } from '../../ds/primitives/section-header/section-header.ts'
import { html, type SafeHtml } from '../../lib/html.ts'
import type { ImageManifest } from '../../lib/images.ts'

/** 15 → «15 лет», 1 → «1 год», 3 → «3 года» */
export function yearsLabel(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  const word =
    mod10 === 1 && mod100 !== 11 ? 'год'
    : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'года'
    : 'лет'
  return `${n} ${word}`
}

export function masters(images: ImageManifest): SafeHtml {
  return html`<section class="home-section ds-container" id="masters" aria-labelledby="masters-title">
<span id="about" class="anchor"></span>
${sectionHeader({ ...SECTIONS.masters, id: 'masters-title' })}
<div class="home-masters">
${MASTERS.map(
  (m) => html`<figure class="home-masters__card">
${photo(images, { name: m.photo, alt: m.alt, ratio: '4/5', sizes: '(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw' })}
<figcaption class="home-masters__caption"><span class="home-masters__name">${m.name}</span><span class="home-masters__role">${m.role} · ${yearsLabel(m.years)}</span></figcaption>
</figure>`,
)}
<div class="home-masters__about">
<p class="home-masters__statement">${MASTERS_STATEMENT}</p>
<ul class="home-masters__standards" role="list">${HYGIENE_STANDARDS.map((s) => html`<li>${s}</li>`)}</ul>
</div>
</div>
</section>`
}
