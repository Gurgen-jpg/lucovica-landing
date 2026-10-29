import { html } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'

export const page: Page = {
  path: '/404',
  meta: { title: 'Страница не найдена — LUCOVICA', description: 'Такой страницы нет на сайте студии LUCOVICA.', noindex: true },
  render: () => html`<main>
<h1>Страница не найдена</h1>
<p>Возможно, ссылка устарела. Перейдите <a href="/">на главную</a> или посмотрите <a href="/#services">услуги студии</a>.</p>
</main>`,
}
