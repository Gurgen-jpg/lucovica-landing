import { HOME_FAQ } from '../content/faq-home.ts'
import { REVIEWS } from '../content/reviews.ts'
import { sitePage } from '../layout/site.ts'
import { html } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'
import { beautySalon, faqPage } from '../lib/schema.ts'
import { contacts } from '../sections/home/contacts.ts'
import { faq } from '../sections/home/faq.ts'
import { hero } from '../sections/home/hero.ts'
import { masters } from '../sections/home/masters.ts'
import { numbers } from '../sections/home/numbers.ts'
import { philosophy } from '../sections/home/philosophy.ts'
import { prices } from '../sections/home/prices.ts'
import { reviews } from '../sections/home/reviews.ts'
import { ritual } from '../sections/home/ritual.ts'
import { services } from '../sections/home/services.ts'

export const page: Page = {
  path: '/',
  meta: {
    title: 'LUCOVICA — студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону',
    description:
      'Студия эпиляции LUCOVICA в центре Ростова-на-Дону. Лазерная эпиляция, шугаринг для женщин, мужчин и подростков. Опытные мастера, премиум-косметика, уютная атмосфера. Онлайн-запись.',
    jsonLd: [beautySalon(), faqPage(HOME_FAQ.map((f) => ({ q: f.question, a: f.answer })))],
  },
  sitemap: { priority: 1, changefreq: 'weekly' },
  render: ({ images }) =>
    sitePage(html`${hero(images)}
${numbers()}
${philosophy()}
${services()}
${prices()}
${ritual()}
${masters(images)}
${reviews(REVIEWS)}
${faq(HOME_FAQ)}
${contacts()}`),
}
