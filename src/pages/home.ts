import { html } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'

// Заглушка до изменения home-page
export const page: Page = {
  path: '/',
  meta: {
    title: 'LUCOVICA — студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону',
    description:
      'Студия эпиляции LUCOVICA в центре Ростова-на-Дону. Лазерная эпиляция, шугаринг для женщин, мужчин и подростков. Опытные мастера, премиум-косметика, уютная атмосфера. Онлайн-запись.',
  },
  sitemap: { priority: 1, changefreq: 'weekly' },
  render: () => html`<main><h1>LUCOVICA</h1><p>Сайт в разработке.</p></main>`,
}
