// Общие секции страниц услуг (service-pages D2). Каждая — функция от данных, только примитивы ДС.
import { links, site } from '../../content/site.ts'
import { priceOf, type BookingService } from '../../content/services.ts'
import { badge } from '../../ds/primitives/badge/badge.ts'
import { photo } from '../../ds/primitives/photo/photo.ts'
import { sectionHeader, titleWithAccent } from '../../ds/primitives/section-header/section-header.ts'
import { tabs } from '../../ds/primitives/tabs/tabs.ts'
import { bookingButton } from '../../layout/booking.ts'
import { formatPrice } from '../../lib/format.ts'
import { html, type HtmlValue, type SafeHtml } from '../../lib/html.ts'
import type { ImageManifest } from '../../lib/images.ts'

/** Заголовок секции: надзаголовок, заголовок с курсивным акцентом, описание. */
export interface SectionHead {
  overline: string
  title: string
  accent?: string
  description?: string
}

export interface SectionOptions {
  inverse?: boolean
  /** Примечание под содержимым секции («Цены указаны за один сеанс…») */
  note?: HtmlValue
}

function section(id: string, head: SectionHead, body: HtmlValue, opts: SectionOptions = {}): SafeHtml {
  const inner = html`${sectionHeader({ ...head, id: `${id}-title` })}${body}${opts.note ? html`<p class="ds-small svc-note">${opts.note}</p>` : null}`
  return opts.inverse
    ? html`<section class="svc-section ds-inverse" id="${id}" aria-labelledby="${id}-title"><div class="ds-container svc-section__inner">${inner}</div></section>`
    : html`<section class="svc-section ds-container" id="${id}" aria-labelledby="${id}-title">${inner}</section>`
}

// ── Хлебные крошки ──────────────────────────────────────────

export function breadcrumb(name: string): SafeHtml {
  return html`<div class="svc-crumbs ds-container">
<nav aria-label="Хлебные крошки"><ol role="list"><li><a href="/">Главная</a></li><li aria-current="page">${name}</li></ol></nav>
<a class="svc-crumbs__back" href="/#services">← Все услуги</a>
</div>`
}

// ── Hero ────────────────────────────────────────────────────

export interface BookingAction {
  label?: string
  service: BookingService
  /** Отметить акцию первого визита */
  promo?: boolean
}

export interface ServiceHero {
  overline: string
  title: string
  accent?: string
  /** Абзацы вводного текста */
  lead: readonly string[]
  tags?: readonly string[]
  photo?: { name: string; alt: string }
  booking: BookingAction
  /** Ссылка «Позвонить» с целью <goalPrefix>_phone_click */
  phone?: boolean
  /** Вторая ссылка: «Смотреть цены» → #prices */
  secondary?: { label: string; href: string }
}

export function serviceHero(hero: ServiceHero, goalPrefix: string, images: ImageManifest): SafeHtml {
  return html`<section class="svc-hero ds-container" aria-labelledby="svc-hero-title"${hero.photo ? html` data-photo` : null}>
<div class="svc-hero__text">
<p class="ds-overline">${hero.overline}</p>
<h1 class="svc-hero__title" id="svc-hero-title">${titleWithAccent(hero.title, hero.accent)}</h1>
${hero.lead.map((p, i) => html`<p class="${i === 0 ? 'ds-lead' : 'ds-body svc-hero__more'}">${p}</p>`)}
<div class="svc-hero__actions">
${bookingAction(hero.booking, `${goalPrefix}_cta_click`, 'Записаться онлайн')}
${hero.phone ? html`<a class="ds-button" data-variant="outline" data-size="3" href="${links.tel}" data-goal="${goalPrefix}_phone_click">Позвонить</a>` : null}
${hero.secondary ? html`<a class="ds-button" data-variant="outline" data-size="3" href="${hero.secondary.href}">${hero.secondary.label}</a>` : null}
</div>
${hero.tags?.length ? html`<ul class="svc-hero__tags" role="list">${hero.tags.map((t) => html`<li>${badge(t, 'soft')}</li>`)}</ul>` : null}
</div>
${hero.photo ? html`<div class="svc-hero__photo">${photo(images, { ...hero.photo, ratio: '4/5', priority: true, sizes: '(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw' })}</div>` : null}
</section>`
}

export function bookingAction(b: BookingAction, goal: string, fallbackLabel = 'Записаться', variant: 'solid' | 'inverse' = 'solid'): SafeHtml {
  return bookingButton({ label: b.label ?? fallbackLabel, service: b.service, promo: b.promo, goal, variant })
}

// ── Сравнение методов ───────────────────────────────────────

export interface Method {
  name: string
  /** Рекомендуемый метод страницы */
  highlight?: boolean
  pros: readonly string[]
  cons: readonly string[]
}

export function comparison(id: string, head: SectionHead, methods: readonly Method[], note?: HtmlValue): SafeHtml {
  return section(
    id,
    head,
    html`<ul class="svc-compare" role="list">
${methods.map(
  (m) => html`<li class="svc-compare__item${m.highlight ? ' ds-inverse' : ''}">
<h3 class="svc-compare__name">${m.name}${m.highlight ? html` ${badge('Выбор', 'onyx')}` : null}</h3>
${m.pros.length ? html`<ul class="svc-compare__list" role="list" aria-label="Плюсы">${m.pros.map((p) => html`<li data-kind="pro">${p}</li>`)}</ul>` : null}
${m.cons.length ? html`<ul class="svc-compare__list" role="list" aria-label="Минусы">${m.cons.map((c) => html`<li data-kind="con">${c}</li>`)}</ul>` : null}
</li>`,
)}
</ul>${note ? html`<p class="ds-body svc-note">${note}</p>` : null}`,
  )
}

// ── Шаги ────────────────────────────────────────────────────

export interface Step {
  title: string
  text: string
}

export function steps(id: string, head: SectionHead, items: readonly Step[], opts: SectionOptions = {}): SafeHtml {
  return section(
    id,
    head,
    html`<ol class="svc-steps" role="list">
${items.map((s, i) => html`<li><span class="svc-steps__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3 class="svc-steps__title">${s.title}</h3><p class="svc-steps__text">${s.text}</p></li>`)}
</ol>`,
    opts,
  )
}

// ── Зоны ────────────────────────────────────────────────────

export interface Zone {
  name: string
  /** Позиция прайса, из которой берётся «от N ₽»; нет — зона без цены */
  priceRef?: { category: string; item: string }
  popular?: boolean
}

export interface ZoneGroup {
  key: string
  label: string
  zones: readonly Zone[]
  /** Услуга формы при записи по зоне; нет — зоны без интерактивности */
  bookingService?: BookingService
}

/** Зоны без сопоставленной позиции прайса — выводятся при сборке для сверки владельцем. */
export const unmatchedZones: string[] = []

function zoneCard(z: Zone, group: ZoneGroup, goal: string): SafeHtml {
  const price = z.priceRef ? priceOf(z.priceRef) : undefined
  if (price === undefined) unmatchedZones.push(`${group.label}: ${z.name}`)
  const inner = html`<span class="svc-zone__name">${z.name}</span>${z.popular ? badge('Хит', 'onyx') : null}<span class="svc-zone__price">${price === undefined ? '' : `от ${formatPrice(price)} ₽`}</span>`
  return group.bookingService
    ? html`<li><a class="svc-zone" href="/#contacts" data-booking data-service="${group.bookingService}" data-detail="${z.name}" data-goal="${goal}">${inner}<span class="svc-zone__cta">Записаться</span></a></li>`
    : html`<li><div class="svc-zone">${inner}</div></li>`
}

export function zones(id: string, head: SectionHead, groups: readonly ZoneGroup[], goal = '', opts: SectionOptions = {}): SafeHtml {
  const grid = (g: ZoneGroup) => html`<ul class="svc-zones" role="list">${g.zones.map((z) => zoneCard(z, g, goal))}</ul>`
  return section(
    id,
    head,
    groups.length > 1
      ? tabs({ id: `${id}-tabs`, label: head.title, tabs: groups.map((g) => ({ key: g.key, label: g.label, panel: grid(g) })) })
      : grid(groups[0]!),
    opts,
  )
}

// ── Характеристики (Аппарат / Состав / Метод) ───────────────

export interface Feature {
  title: string
  text: string
}

export function featureList(id: string, head: SectionHead, items: readonly Feature[], opts: SectionOptions = {}): SafeHtml {
  return section(
    id,
    head,
    html`<dl class="svc-features">${items.map((f) => html`<div><dt>${f.title}</dt><dd>${f.text}</dd></div>`)}</dl>`,
    opts,
  )
}

// ── Кому подходит / Противопоказания ────────────────────────

export function suitability(id: string, head: SectionHead, suitable: readonly string[], contraindications: readonly string[], note?: string): SafeHtml {
  const col = (title: string, items: readonly string[]) =>
    html`<div class="svc-suit__col"><h3 class="ds-overline">${title}</h3><ul role="list">${items.map((i) => html`<li>${i}</li>`)}</ul></div>`
  return section(
    id,
    head,
    html`<div class="svc-suit">${col('Кому подходит', suitable)}${col('Противопоказания', contraindications)}</div>${note ? html`<p class="ds-small svc-note">${note}</p>` : null}`,
  )
}

// ── Результат ───────────────────────────────────────────────

export interface Stat {
  value: string
  label: string
}

export function results(id: string, head: SectionHead, stats: readonly Stat[]): SafeHtml {
  return section(
    id,
    head,
    html`<ul class="svc-results" role="list">${stats.map((s) => html`<li><span class="svc-results__value">${s.value}</span><span class="svc-results__label">${s.label}</span></li>`)}</ul>`,
  )
}

// ── Финальный CTA ───────────────────────────────────────────

export interface ServiceCta {
  overline: string
  title: string
  accent?: string
  text: string
  booking: BookingAction
  phone?: boolean
  /** Ссылка на Telegram с целью click_telegram */
  telegram?: boolean
}

export function serviceCta(cta: ServiceCta, goalPrefix: string): SafeHtml {
  return html`<section class="svc-cta ds-inverse" id="cta" aria-labelledby="cta-title">
<div class="ds-container svc-cta__inner">
<p class="ds-overline svc-cta__overline">${cta.overline}</p>
<h2 class="ds-h1" id="cta-title">${titleWithAccent(cta.title, cta.accent)}</h2>
<p class="ds-lead">${cta.text}</p>
<div class="svc-cta__actions">
${bookingAction(cta.booking, `${goalPrefix}_cta_click`, 'Записаться онлайн', 'inverse')}
${cta.phone ? html`<a class="ds-button" data-variant="champagne" data-size="3" href="${links.tel}" data-goal="${goalPrefix}_phone_click">${site.phone.display}</a>` : null}
${cta.telegram ? html`<a class="ds-button" data-variant="champagne" data-size="3" href="${links.telegram}" target="_blank" rel="noopener noreferrer" data-goal="click_telegram">Telegram</a>` : null}
</div>
</div>
</section>`
}
