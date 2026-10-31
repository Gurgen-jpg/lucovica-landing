import { minimalPage } from '../layout/site.ts'
import { html } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'

export const page: Page = {
  path: '/404',
  meta: { title: 'Страница не найдена — LUCOVICA', description: 'Такой страницы нет на сайте студии LUCOVICA.', noindex: true },
  render: () =>
    minimalPage(html`<div class="ds-container ds-section">
<h1 class="ds-h1">Страница не найдена</h1>
<p class="ds-lead">Возможно, ссылка устарела. Перейдите <a href="/">на главную</a> или посмотрите <a href="/#services">услуги студии</a>.</p>
</div>`),
}
