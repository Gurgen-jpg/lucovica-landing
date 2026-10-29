# CLAUDE.md

Сайт студии эпиляции LUCOVICA (Ростов-на-Дону), версия 2. Команды и структура — в README.md.

## Стек (не менять без явного решения владельца)

- HTML генерируется при сборке из TS-функций (`src/pages/*.ts`). **Нет React, Radix, Tailwind** и других UI-фреймворков.
- Браузерный код — чистый TypeScript (`src/client/`), бандлит esbuild.
- Стили — чистый CSS; все значения только через CSS-переменные из `src/ds/tokens.css`, без HEX в компонентах.
- Сервер — Express (`server/app.ts`), раздаёт `dist/` и `/api`.
- Доступность интерактивных элементов — по WAI-ARIA APG (то, что в макете давал Radix).

## Правила

1. **Разметка только через `html```** из `src/lib/html.ts` — он экранирует интерполяции. `raw()` — только для доверенной разметки из репозитория, никогда для данных.
2. **Контакты, часы, адрес, промо — только из `src/content/site.ts`.** Не дублировать в шаблонах.
3. **Цены — только из данных цен** (`src/content/services.ts`); «от N ₽», JSON-LD и цены зон вычисляются из них.
4. **Контент отдельно от разметки:** тексты и данные — `src/content/`, секции — функции от данных.
5. **Контент без JS:** весь текст (FAQ, вкладки, отзывы) должен быть в HTML; JS только улучшает.
6. **Цели Метрики** — атрибутом `data-goal="..."` на элементе или `meta.pageGoal` страницы; имена целей старого сайта не переименовывать.
7. **Изображения** — исходник в `assets/img/` (латиница в имени), вывод через `picture()`; первый экран — `priority: true`.
8. **Новая страница** — модуль в `src/pages/`; путь без завершающего слэша; служебные страницы — `noindex: true` и без `sitemap`.

## Тесты

- `tests/**/*.test.ts` — Vitest, окружение node. Тесты браузерного кода — `tests/client/*.client.test.ts` с `// @vitest-environment happy-dom` в первой строке.
- API — через `supertest(createApp(...))`; внешние сервисы (SMTP, Telegram) мокаются.
- `e2e/` — Playwright против продакшен-сборки (`npm run build && npm start` на порту 3099), проекты Chromium и iPhone 13 (WebKit), axe на каждой странице.
- Типы: `npm run lint` проверяет два tsconfig — серверный (`tsconfig.json`) и браузерный (`tsconfig.client.json`: `src/client`, `src/shared`, `tests/client`, `e2e`).

## OpenSpec

Изменения в `openspec/changes/`, порядок применения: bootstrap-platform → design-system → home-page → booking-pipeline → service-pages → welcome-intake. Старый сайт для сверки контента — ветка `main` (`git show origin/main:<путь>`).
