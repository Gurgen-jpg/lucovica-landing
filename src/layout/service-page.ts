// Шаблон страницы услуги (service-pages D1): данные страницы → крошки, Hero, секции, Отзывы, Цены, FAQ, CTA, JSON-LD.
import type { FaqItem } from '../content/faq-home.ts'
import type { Review } from '../content/reviews.ts'
import { html, type SafeHtml } from '../lib/html.ts'
import type { Page } from '../lib/page.ts'
import { beautySalon, breadcrumbs, faqPage, service } from '../lib/schema.ts'
import { faq } from '../sections/home/faq.ts'
import { reviews } from '../sections/home/reviews.ts'
import { servicePricing, type PriceGroupDef, type PricingOptions } from '../sections/service/pricing.ts'
import { breadcrumb, serviceCta, serviceHero, type SectionHead, type ServiceCta, type ServiceHero } from '../sections/service/sections.ts'
import { sitePage } from './site.ts'

export interface ServicePageDef {
  /** '/laser-epil' */
  path: string
  /** Название в крошках и JSON-LD: «Лазерная эпиляция» */
  name: string
  /** Префикс целей: laser_epil → laser_epil_cta_click, laser_epil_phone_click */
  goalPrefix: string
  meta: {
    title: string
    description: string
    /** Описание услуги для JSON-LD Service */
    serviceDescription: string
    /** og:description, если отличается от description (как на текущем сайте) */
    ogDescription?: string
    keywords?: readonly string[]
    pageGoal?: string
  }
  hero: ServiceHero
  /** Тематические секции между Hero и Отзывами, в порядке спеки */
  sections?: readonly SafeHtml[]
  reviews?: readonly Review[]
  pricing: { head: SectionHead; groups: readonly PriceGroupDef[]; options?: Omit<PricingOptions, 'goal'> }
  faq?: readonly FaqItem[]
  cta: ServiceCta
  /** Приоритет в sitemap.xml (как на текущем сайте: основные услуги 0.9, комплексы и сертификаты 0.8) */
  sitemapPriority?: number
  /** Позиции для OfferCatalog JSON-LD */
  offers: readonly { name: string; price: number }[]
}

export function servicePage(def: ServicePageDef): Page {
  const goal = `${def.goalPrefix}_cta_click`
  const jsonLd: object[] = [
    // Организация на каждой странице: provider у Service ссылается на неё по @id
    beautySalon(),
    service({ name: def.name, description: def.meta.serviceDescription, path: def.path, offers: [...def.offers] }),
    breadcrumbs([
      { name: 'Главная', path: '/' },
      { name: def.name, path: def.path },
    ]),
  ]
  if (def.faq?.length) jsonLd.push(faqPage(def.faq.map((f) => ({ q: f.question, a: f.answer }))))

  return {
    path: def.path,
    meta: {
      title: def.meta.title,
      description: def.meta.description,
      og: { title: def.meta.title, description: def.meta.ogDescription ?? def.meta.description },
      keywords: def.meta.keywords,
      jsonLd,
      pageGoal: def.meta.pageGoal,
    },
    sitemap: { priority: def.sitemapPriority ?? 0.9, changefreq: 'monthly' },
    render: ({ images }) =>
      sitePage(html`${breadcrumb(def.name)}
${serviceHero(def.hero, def.goalPrefix, images)}
${def.sections ?? []}
${def.reviews?.length ? reviews(def.reviews) : null}
${servicePricing(def.pricing.head, def.pricing.groups, { ...def.pricing.options, goal })}
${def.faq?.length ? faq(def.faq) : null}
${serviceCta(def.cta, def.goalPrefix)}`),
  }
}
