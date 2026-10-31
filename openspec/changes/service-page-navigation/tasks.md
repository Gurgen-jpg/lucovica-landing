# Tasks

## 1. Shared back-navigation primitive

- [x] 1.1 Create `src/components/ui/ServiceBreadcrumb.tsx` (Server Component, no `'use client'`) taking a `serviceName: string` prop, rendering "Главная / {serviceName}" linking to `/` and a "← Назад к услугам" link to `/#services`; export it from `src/components/ui/index.ts` and verify it renders via a quick usage in one page
- [x] 1.2 Place `<ServiceBreadcrumb serviceName="..." />` as the first element (above the Hero) in `src/app/(site)/laser-epil/page.tsx`, `sugaring/page.tsx`, and `electro-epil/page.tsx`, and verify each page still builds and the element appears above the hero in the browser

## 2. Clickable service cards on the homepage

- [x] 2.1 In `src/components/Services.tsx`, add a `href` (the service page path) to each category in the `categories` array for `laser`, `sugaring`, `electro`, `complex`, `cert`
- [x] 2.2 Make each card `relative` and add an absolutely-positioned `<Link href={cat.href} className="absolute inset-0 z-0" aria-label={cat.title} />` as the card's first child; give the visible content and the "Записаться" button `relative z-10` so the button stays independently clickable above the overlay link (stretched-link pattern per design.md - no nested `<button>` inside `<a>`)
- [ ] 2.3 Remove the per-category `{cat.id === 'laser' && <Link>Подробнее</Link>}` blocks (and the `sugaring`/`electro` equivalents) now redundant with the whole-card link, and verify in the browser that clicking anywhere on a card (outside the button) navigates to its service page, while clicking "Записаться" still only opens the lead form

## 3. `/complex` page

- [x] 3.1 Create `src/components/complex/` with `ComplexHero.tsx`, `ComplexPricing.tsx` (reads `SERVICES` filtered to `laser-complexes-women` / `laser-complexes-men` from `src/lib/services-data.ts`), and `ComplexCTA.tsx` (reuses `LeadForm`), plus an `index.ts` barrel
- [ ] 3.2 Create `src/app/(site)/complex/page.tsx` composing `ServiceBreadcrumb` + the three sections above, and verify `npm run dev` serves `/complex` with working pricing data and a working booking CTA

## 4. `/cert` page

- [x] 4.1 Create `src/components/cert/` with `CertHero.tsx`, `CertPricing.tsx` (reads `CERTIFICATES` from `src/lib/services-data.ts`), and `CertCTA.tsx` (reuses `LeadForm`), plus an `index.ts` barrel
- [ ] 4.2 Create `src/app/(site)/cert/page.tsx` composing `ServiceBreadcrumb` + the three sections above, and verify `npm run dev` serves `/cert` with working certificate amounts and a working booking CTA

## 5. Verification

- [ ] 5.1 Run `npm run lint` and `npm run build` and verify both succeed
- [ ] 5.2 Manually click through all five homepage cards, confirm each navigates to its page, confirm "Назад к услугам" on each of the five service pages returns to `/#services`, and confirm the "Записаться" button on every card still opens the lead form without navigating away
