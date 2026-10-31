// /complex — тексты перенесены из ../landing/src/components/complex/* и страницы (site)/complex.
import type { ServicePageDef } from '../../layout/service-page.ts'
import { groupFromCategory } from '../../sections/service/pricing.ts'
import { offersFromCategories } from '../services.ts'

const CATEGORIES = ['laser-complexes-women', 'laser-complexes-men'] as const

export const complexPage: ServicePageDef = {
  path: '/complex',
  name: 'Комплексы лазерной эпиляции',
  sitemapPriority: 0.8,
  goalPrefix: 'complex',
  meta: {
    title: 'Комплексы лазерной эпиляции в Ростове-на-Дону — студия LUCOVICA',
    description:
      'Комплексы лазерной эпиляции для женщин и мужчин в Ростове-на-Дону — несколько зон за один визит, выгоднее, чем по отдельности. Цены и онлайн-запись — студия Lucovica, просп. Соколова 68.',
    serviceDescription: 'Комплексы лазерной эпиляции: несколько зон за один визит — выгоднее, чем по отдельности.',
    pageGoal: 'complex_page_view',
  },
  hero: {
    overline: 'Выгода до 30%',
    title: 'Комплексы лазерной эпиляции',
    accent: 'лазерной эпиляции',
    lead: ['Несколько зон за один визит — дешевле, чем по отдельности. Женские и мужские комплексы.', 'Студия LUCOVICA — просп. Соколова, 68'],
    booking: { service: 'Комплекс лазерной эпиляции — Девушки' },
    secondary: { label: 'Смотреть цены', href: '#prices' },
  },
  pricing: {
    head: { overline: 'Прейскурант', title: 'Цены на комплексы', description: 'Все цены за один сеанс.' },
    groups: [groupFromCategory('laser-complexes-women', 'Девушки'), groupFromCategory('laser-complexes-men', 'Мужчины')],
  },
  cta: {
    overline: 'Записаться на комплекс',
    title: 'Несколько зон — за один визит',
    accent: 'за один визит',
    text: 'Студия LUCOVICA, Ростов-на-Дону, просп. Соколова, 68. Поможем подобрать комплекс под ваши зоны.',
    booking: { service: 'Комплекс лазерной эпиляции — Девушки' },
  },
  offers: offersFromCategories(CATEGORIES),
}
