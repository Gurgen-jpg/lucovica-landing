# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run lint         # ESLint via Next.js
npm run test         # Run tests once (vitest)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run with coverage report
```

Run a single test file:
```bash
npx vitest run src/__tests__/api/lead.test.ts
```

## Architecture

Next.js 14 App Router landing page for **LUCOVICA** — a laser hair removal and sugaring studio in Rostov-on-Don.

### Page structure

`src/app/page.tsx` — main landing, composed entirely of section components imported from `src/components/`. Each component is a standalone section (Hero, Trust, Services, Pricing, Reviews, Promos, FAQ, About, Contacts, Footer, FloatingCTA).

Additional routes:
- `/welcome` — pre-visit intake form for new/returning clients (`WelcomeForm.tsx`)
- `/welcome/back` — returning client variant (`BackForm.tsx`)
- `/privacy` — privacy policy

### UI component library (`src/components/ui/`)

Reusable primitives. **Rule: Server Components by default; `'use client'` only when the component needs event handlers or hooks.**

| Component | Type | Usage |
|---|---|---|
| `SectionHeader` | Server | Sub-label + h2 heading + optional description. Used in 7+ sections. |
| `Badge` | Server | Dark/mist pill with uppercase text. Used in About, Services. |
| `TagPill` | Server | Light bordered tag. Used in Services. |
| `Chip` | Client | Toggle button (selected/unselected state). Used extensively in WelcomeForm. |
| `YesNo` | Client | Binary yes/no button pair. Used in WelcomeForm. |
| `FormField` | Server | Label + child slot wrapper. |

Import via barrel: `import { SectionHeader, Badge } from '@/components/ui'`

### API routes (notification pipeline)

Both routes follow the same pattern: **email is synchronous** (client waits, returns 500 on failure); **Telegram is fire-and-forget** (errors only logged).

- `POST /api/lead` — booking request from main page `LeadForm`. Validates name + phone, sends via `sendLeadEmail` then `sendLeadToTelegram`.
- `POST /api/welcome` — welcome intake form submission. Has in-memory IP rate limiting (3 req/min), honeypot field (`_hp`), and phone digit validation. Sends via `sendWelcomeEmail` then `sendWelcomeToTelegram`.

### Notification libs (`src/lib/`)

- `sendEmail.ts` — nodemailer with fallback across three SMTP ports (587→465→2525) on `smtp.timeweb.ru`. Handles both lead and welcome email templates.
- `sendLead.ts` / `sendWelcome.ts` — Telegram Bot API senders. Use `sendTelegramMessage` from `telegram.ts`.
- `retry.ts` — generic `withRetry<T>` utility.
- `telegram.ts` — shared `sendTelegramMessage(token, chatId, text)` used by both senders.
- `timeout.ts` — `withTimeout<T>` used in both API routes.
- `html.ts` — `escHtml()` for HTML entity escaping.
- `rateLimit.ts` — `isRateLimited()` + `getIp()` (in-memory, per-process).
- `validation.ts` — `isValidPhone()` (11 digits after stripping non-digits).
- `welcome-labels.ts` — `DRINK_LABELS`, `MILK_LABELS`, `TALK_LABELS`, `CRITICAL_CONTRAINDICATIONS` — single source of truth for welcome form display strings.

### Shared data

- `src/lib/services-data.ts` — single source of truth for all service categories, prices, and certificate amounts. Also exports `SERVICE_NAMES_FOR_FORM` used to populate dropdowns.

### Path alias

`@/*` maps to `src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).

## Environment variables

See `.env.example`. Required at runtime:

| Variable | Purpose |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Telegram bot for notifications |
| `TELEGRAM_CHAT_ID` | Target chat/group for notifications |
| `SMTP_USER` | Timeweb SMTP login (also used as From address) |
| `SMTP_PASS` | SMTP password |
| `NOTIFY_EMAIL` | Recipient for notification emails (defaults to `SMTP_USER`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO metadata |
| `NEXT_PUBLIC_YM_ID` | Yandex Metrica counter ID |

## Architecture rules

**RULE 1 — UI primitives**: Any interactive/reusable UI element → `src/components/ui/`. Server Component by default; `'use client'` only when event handlers or hooks are needed. Before creating a new component, check if a similar one exists in `ui/`.

**RULE 2 — Local constants**: Used in only one file → stay near the component (same file or sibling `Component.config.ts`).

**RULE 3 — Shared constants**: Used in 2+ places → `src/lib/site-config.ts` (contacts, SEO) or a thematic lib file (`welcome-options.ts`, `services-data.ts`).

**RULE 4 — Local helpers**: Pure functions needed by only one component → sibling file `Component.helpers.ts`. No need to extract if function is under 5 lines and obvious from name.

**RULE 5 — Shared helpers**: Used in 2+ places → `src/lib/` (`validation.ts`, `analytics.ts`, etc.).

**RULE 6 — New component checklist**:
- SEO: section components must be Server Components, no `'use client'`
- Reuse: check `ui/` before writing a new primitive
- Constants: local or shared? → choose storage location accordingly
- Helpers: extract from component body

## Testing

Tests use Vitest with `environment: 'node'`. `src/__tests__/setup.ts` sets env vars and globally mocks `nodemailer` (so SMTP is never called in tests). Tests import route handlers directly and test via `NextRequest`.

The `src/__tests__/smoke/` directory contains smoke tests not included in the default `vitest run` — they hit real external services and require live credentials.
