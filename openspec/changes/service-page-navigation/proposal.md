# Proposal

## Why

Service cards on the homepage (`Services.tsx`) only navigate to a dedicated service page via a small "Подробнее" text link, not the card itself — users expect the whole card to be clickable. Two of the five cards (`Комплексы`, `Подарочные сертификаты`) have no dedicated page at all. Service pages also have no explicit way back to the catalog beyond the header logo, which is easy to miss.

## What Changes

- Homepage service cards (`laser`, `sugaring`, `electro`, `complex`, `cert`) become fully clickable, navigating to their service page. The "Записаться" button keeps opening the lead form and stops the click from also triggering navigation.
- Two new lightweight service pages are added: `/complex` and `/cert`, each with a short hero, a price table sourced from `src/lib/services-data.ts` (`laser-complexes-women`/`laser-complexes-men` categories for `/complex`, `CERTIFICATES` for `/cert`), and a booking CTA. They do not get the full Why/How/Device/Reviews section set the three existing service pages have, since that content doesn't exist for these categories.
- A reusable back-navigation element (breadcrumb: "Главная / <Услуга>" plus a "← Назад к услугам" link) is added to `src/components/ui/` and placed at the top of all five service pages (`laser-epil`, `sugaring`, `electro-epil`, `complex`, `cert`).

## Capabilities

### New Capabilities
- `service-page-navigation`: Clicking a service card on the homepage navigates to that service's page; every service page offers a visible way back to the services catalog.

### Modified Capabilities
(none — no existing specs cover this behavior)

## Impact

- `src/components/Services.tsx` — cards become clickable links; button click no longer bubbles into navigation.
- `src/app/(site)/complex/page.tsx`, `src/app/(site)/cert/page.tsx` — new routes (new files, plus new light-weight section components, e.g. `src/components/complex/`, `src/components/cert/`).
- `src/components/ui/` — new `Breadcrumbs`/back-nav primitive (per RULE 1: shared, reusable → `ui/`), exported via the barrel.
- `src/app/(site)/laser-epil/page.tsx`, `sugaring/page.tsx`, `electro-epil/page.tsx` — add the new back-nav element at the top of each page.
- `src/lib/services-data.ts` — read-only reuse of `SERVICES` (complexes categories) and `CERTIFICATES`; no changes needed.
