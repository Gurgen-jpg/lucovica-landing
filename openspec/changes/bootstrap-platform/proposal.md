# Proposal

## Why

Текущий сайт (`../landing`) работает на Next.js 15 + React + Tailwind: тяжёлый рантайм ради по сути статических страниц, сложная сборка на Timeweb (`chmod -R 777 .next`) и стек, не совпадающий с новой дизайн-системой. landing_v2 переходит на статический HTML, собираемый из TypeScript, и небольшой Express-сервер — для этого сначала нужна платформа: сборка, сервер, SEO-основа, аналитика и тестовая инфраструктура.

## What Changes

- Новый проект `landing_v2/` (Node 22, TypeScript, ESM) со скриптами `dev`, `build`, `start`, `lint`, `test`, `test:e2e`.
- Сборка (SSG): каждая страница — TS-модуль, экспортирующий метаданные и функцию рендера в HTML; сборщик пишет `dist/**/*.html`, бандлит клиентский TS и CSS (esbuild) с хэшами в именах, копирует и оптимизирует изображения (WebP/AVIF, несколько ширин).
- Express-сервер: раздаёт `dist/` с «чистыми» URL без `.html` и без завершающего слэша, кастомная страница 404, gzip/brotli, кэш-заголовки, базовые заголовки безопасности, точка подключения `/api/*` (сами эндпоинты — в `booking-pipeline` и `welcome-intake`), `GET /healthz`.
- Dev-режим: пересборка при изменении файлов и автоперезагрузка страницы.
- SEO-основа: общий layout с `<title>`, description, canonical, Open Graph, favicon/иконки, JSON-LD на уровне страницы, `sitemap.xml`, `robots.txt` — с теми же URL, что и сейчас.
- Яндекс Метрика: счётчик на всех страницах, общий клиентский модуль целей.
- Тестовая инфраструктура: Vitest (unit, API через supertest), Playwright (e2e, axe).
- Конфигурация через переменные окружения без префикса `NEXT_PUBLIC_`.

Переносится без изменений: набор публичных URL (`/`, `/laser-epil`, `/sugaring`, `/electro-epil`, `/complex`, `/cert`, `/privacy`, `/welcome`, `/welcome/back`), содержимое `robots.txt` и `sitemap.xml`, ID счётчика Метрики, хостинг Timeweb.

Меняется: Next.js, React и Tailwind удаляются; оптимизация изображений переезжает со времени запроса (`next/image`) на время сборки; переменные `NEXT_PUBLIC_*` переименовываются.

## Capabilities

### New Capabilities
- `site-delivery`: как сайт собирается и отдаётся — URL, 404, кэширование, сжатие, заголовки, health-check, изображения.
- `seo-metadata`: метаданные страниц, канонические URL, Open Graph, структурированные данные, sitemap и robots.
- `analytics`: подключение Яндекс Метрики и отправка целей.

### Modified Capabilities
(нет — в landing_v2 ещё нет спек)

## Impact

- Новый каталог `landing_v2/` (рядом с `landing/`), старый проект не меняется до переключения.
- Зависимости: `express`, `compression`, `nodemailer` (позже), `esbuild`, `sharp`, `tsx`, `typescript`, `vitest`, `supertest`, `@playwright/test`, `@axe-core/playwright`, `stylelint`.
- Деплой на Timeweb меняется: `npm ci && npm run build && npm start` вместо `next build/next start`; переменные окружения переименовываются (см. design.md).
- Все следующие изменения (`design-system`, `home-page`, `booking-pipeline`, `service-pages`, `welcome-intake`) строятся на этой платформе.
