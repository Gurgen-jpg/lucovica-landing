import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from '../content/privacy.ts'
import { minimalPage } from '../layout/site.ts'
import { html } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'

export const page: Page = {
  path: '/privacy',
  meta: {
    title: 'Политика конфиденциальности — LUCOVICA',
    description: 'Политика обработки персональных данных студии LUCOVICA',
    noindex: true,
  },
  render: () =>
    minimalPage(html`<article class="privacy ds-container">
<header class="privacy__head">
<h1 class="ds-h1">Политика конфиденциальности</h1>
<p class="ds-small">Последнее обновление: ${PRIVACY_UPDATED}</p>
</header>
${PRIVACY_SECTIONS.map((s) => html`<section class="privacy__section"><h2 class="ds-h3">${s.title}</h2>${s.body}</section>`)}
<p class="privacy__back"><a href="/">← Вернуться на главную</a></p>
</article>`),
}
