# Design

## Context

`Services.tsx` is a client component (`'use client'`, already manages `LeadForm` open/service state). Its cards currently render a small `<Link>` ("Подробнее") next to a `<button>` ("Записаться"). Three of five categories (`laser`, `sugaring`, `electro`) already have full-content pages under `src/app/(site)/<slug>/page.tsx`, built from a fixed section sequence (Hero → Why → How → Zones → ... → FAQ → CTA) that pulls its own copy from dedicated component folders (`src/components/laser-epil/`, etc.). `complex` and `cert` have no page and no dedicated copy — only pricing data in `src/lib/services-data.ts` (`SERVICES` entries `laser-complexes-women`/`laser-complexes-men`, and `CERTIFICATES`) and a teaser block in `Pricing.tsx`. See proposal.md - Why/What Changes for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Whole card is clickable without breaking the independent "Записаться" action.
- `/complex` and `/cert` exist as real routes with real (if minimal) content, reusing existing pricing data.
- One shared back-navigation element used by all five service pages.

**Non-Goals:**
- Not writing Why/How/Device/Reviews-style marketing copy for `complex`/`cert` — no such content exists yet, and inventing it is a content task, not a navigation one.
- Not changing the pricing data model in `services-data.ts`.
- Not restructuring the existing three service pages beyond adding the back-nav element at the top.

## Decisions

**1. Card click target: "stretched link", not a `<button>` nested inside a `<Link>`.**
A `<button>` inside an `<a>` is invalid nested-interactive HTML and would need `stopPropagation` hacks to stop the outer link from also firing. Instead, each card becomes a `relative` container with an absolutely-positioned `<Link href={...} className="absolute inset-0" aria-label={...} />` as first child (z-index below content), while the visible heading/description/tags sit above it and the "Записаться" `<button>` gets `relative z-10` so it stays independently clickable. This is the standard stretched-link pattern — no nested interactive elements, no click-propagation logic needed. Cards without a page (none, after this change) simply don't get the overlay link.

**2. Route paths: flat, matching the existing convention.**
`/complex` and `/cert` under `src/app/(site)/`, sibling to `laser-epil`, `sugaring`, `electro-epil` — not nested under e.g. `/uslugi/`. Matches the project's existing flat structure and needs no new layout.

**3. `/complex` and `/cert` page structure: minimal, own section components.**
Each gets its own small component folder (`src/components/complex/`, `src/components/cert/`) with just `Hero` + `Pricing` (+ `CTA`, reusing the existing `LeadForm`) sections — not the 10-section pattern of the three existing pages (per proposal's Non-Goal). `complex`'s pricing section reads `SERVICES` filtered to `laser-complexes-women`/`laser-complexes-men` (mirrors the tab data already used in `Pricing.tsx`); `cert`'s reads `CERTIFICATES`. Server Components per RULE 1, since neither needs client state beyond the booking CTA button, which — like other CTAs — stays a small client leaf.

**4. Shared back-nav: one new `ui/` primitive, not per-page copies.**
`src/components/ui/ServiceBreadcrumb.tsx` (Server Component — pure links, no interactivity) takes a `serviceName: string` prop and renders "Главная / {serviceName}" plus a "← Назад к услугам" link, both pointing at `/` and `/#services` respectively. Exported via the `ui` barrel per RULE 1 (used in 5+ places). Placed as the first element inside each of the five service pages, above the page's Hero section.

## Risks / Trade-offs

- **[Stretched-link overlay could swallow clicks on other future interactive elements added inside a card later]** → Mitigation: any new interactive element added inside a card must get `relative z-10`, same as the booking button; note this in a short comment at the overlay `Link`.
- **[`/complex` mixes women's and men's complex pricing in one page, unlike the tabbed `Pricing.tsx` section]** → Acceptable for a lightweight page; if it reads poorly, split into two stacked sections (already same data source, low cost to revisit).

## Migration Plan

Purely additive: two new routes, one new `ui/` component, edits to `Services.tsx` and the three existing service pages. No data migration, no feature flag needed — safe to ship in one deploy.
