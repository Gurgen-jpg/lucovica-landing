# Design

## Context

См. proposal.md — Why. Текущий `../landing`: Next 15 App Router, оптимизация картинок на лету, Метрика через `next/script`, JSON-LD в корневом layout, `chmod -R 777 .next` в build для контейнера Timeweb. Контакты (адрес, часы, координаты) захардкожены в 5+ местах. Стек landing_v2 зафиксирован в `openspec/config.yaml`.

## Goals / Non-Goals

**Goals:**
- Сборка «TS-шаблоны → HTML» без фреймворка, с безопасным по умолчанию экранированием.
- Один Express-процесс для статики и API, пригодный для Timeweb.
- Единый источник контактов и настроек сайта.
- Dev-цикл с автоперезагрузкой не хуже, чем у `next dev`.

**Non-Goals:**
- CMS/админка — контент остаётся в TS-файлах.
- SSR на запрос, клиентский роутинг, SPA-переходы.
- CSP-заголовок (Метрика и вебвизор требуют широкого списка источников; вернуться отдельным изменением).

## Decisions

### D1. Структура проекта
```
landing_v2/
  src/
    content/      ← данные: site.ts (контакты, часы, промо), services.ts (цены), faq/*, reviews.ts …
    ds/           ← tokens.css, base.css, primitives/ (изменение design-system)
    layout/       ← document.ts (<html>, <head>, метаданные, Метрика), header.ts, footer.ts
    pages/        ← один модуль на URL: home.ts, laser-epil.ts, …, not-found.ts
    client/       ← main.ts (точка входа браузера), analytics.ts, …
    lib/html.ts   ← тег html``, raw(), escape
  server/         ← app.ts (createApp), index.ts (listen), api/*, lib/* (email, telegram, …)
  scripts/        ← build.ts, dev.ts, images.ts
  public/         ← файлы «как есть»: robots.txt, иконки, og-image.jpg, svg
  assets/img/     ← исходники фото для конвейера изображений
  e2e/  tests/
```

### D2. Шаблоны — тег `html` с автоэкранированием
`html\`<h1>${title}</h1>\`` экранирует все интерполяции; массивы склеиваются; доверенная разметка помечается `raw()`. Альтернативы: JSX без React (`@kitajs/html`) — требует настройки tsconfig `jsx` и даёт меньше контроля; шаблонизаторы (Nunjucks/EJS) — теряется типизация. Тег-функция — 30 строк, типобезопасно, экранирование по умолчанию закрывает XSS из данных контента.

### D3. Контракт страницы
```ts
export const page: Page = {
  path: '/laser-epil',
  meta: { title, description, og?, robots?, jsonLd: [...] },
  render: (ctx) => html`…`,   // ctx: { assets, site, url }
}
```
`scripts/build.ts` импортирует все `src/pages/*.ts`, оборачивает `render` в `document()` и пишет `dist/<path>.html` (`/` → `dist/index.html`). Список страниц — единственный источник для sitemap (флаг `sitemap: { priority, changefreq }` в `page`).

### D4. Ассеты — esbuild
- `src/client/main.ts` → `dist/assets/main-[hash].js` (ESM, minify, target es2020).
- `src/styles/site.css` (импортирует `ds/*`) → `dist/assets/site-[hash].css`.
- Метафайл esbuild даёт карту «логическое имя → хэшированный путь», передаётся в `ctx.assets`.
Vite не берём: он рассчитан на SPA/SSR-фреймворки; esbuild достаточно и на порядок проще.

### D5. Изображения — `sharp` при сборке
`scripts/images.ts` для каждого файла из `assets/img/` генерирует AVIF и WebP ширин 640/960/1280/1920 (не больше оригинала) в `dist/img/<name>-<w>-<hash>.<ext>` и манифест с размерами. Хелпер `picture({src, alt, sizes, priority})` выдаёт `<picture>` с `srcset`, `width/height`, `loading`, `fetchpriority`. Кириллические имена файлов (`team-екатерина.webp`) переименовываются в латиницу. Кэш результатов по хэшу исходника в `.cache/img`, чтобы повторная сборка не перекодировала всё.

### D6. Сервер Express
`createApp()` (экспортируется для supertest), порядок middleware:
1. `app.disable('x-powered-by')`, заголовки безопасности (свои 3 строки, без `helmet`);
2. `compression()`;
3. канонизация URL: `/x/` и `/x.html` → 301 на `/x` с сохранением query;
4. `GET /healthz`;
5. `/api` — `express.json({ limit: '32kb' })` + роутеры (добавятся в `booking-pipeline`, `welcome-intake`);
6. `express.static('dist', { extensions: ['html'], setHeaders })` — `immutable` для `/assets`, `/img`, `/fonts`; `no-cache` для HTML;
7. 404 → `dist/404.html` со статусом 404.
`trust proxy` = 1 (Timeweb за прокси — нужно для корректного IP в rate limit).

### D7. Dev-режим
`npm run dev` → `scripts/dev.ts`: esbuild `context().watch()` для JS/CSS, наблюдение за `src/**` с повторным рендером страниц (импорт с cache-busting query), сервер через `node --watch`. Live reload: в dev-режиме `document()` добавляет крошечный скрипт с `EventSource('/__dev/reload')`; эндпоинт регистрируется только при `NODE_ENV=development`.

### D8. Конфигурация
- Время сборки: `SITE_URL` (по умолчанию `https://lucovica.ru`), `YM_ID`, `MAX_URL`.
- Время выполнения: `PORT`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL`.
- Загрузка `.env` — `node --env-file-if-exists=.env` (Node 22), без `dotenv`.
- Телефон, адрес, часы, координаты, Telegram-username, ID организации на Яндекс Картах, текст промо — в `src/content/site.ts` (не env: это контент, а не секреты). Переезд `NEXT_PUBLIC_*` → новые имена описан в README.

### D9. Аналитика
Инициализация Метрики — inline-скрипт в `<head>` (стандартный сниппет, `defer`-загрузка `tag.js`). `src/client/analytics.ts`: `track(goal)` с очередью до готовности `ym` (опрос 200 мс, предел 10 с) и делегированный обработчик кликов по `[data-goal]`. Цели просмотра страниц — атрибут `data-page-goal` на `<body>`. Механизм `YandexMetrikaHit` не нужен: каждая навигация — полная загрузка страницы.

### D10. Тесты
Vitest: `environment: node` по умолчанию, `happy-dom` для файлов `*.client.test.ts`. API — через `supertest(createApp())`, nodemailer и `fetch` к Telegram мокаются. Playwright: `webServer` = `npm run build && npm start` на порту 3099 (проверяем ровно то, что поедет в прод), проекты Chromium + WebKit mobile (iPhone 13).

## Risks / Trade-offs

- [Изменение URL или метаданных уронит позиции в поиске] → e2e-тест сравнивает список URL, title и canonical со старым сайтом; редиректы 301 для вариантов со слэшем.
- [Timeweb-приложение может требовать иной команды запуска/порта] → сервер слушает `process.env.PORT ?? 3000`, `/healthz` для проверки; уточнить при первом деплое.
- [Сборка изображений через `sharp` медленная и зависит от нативного бинарника] → кэш `.cache/img`; `sharp` ставит prebuilt-бинарник для linux-x64 на Timeweb.
- [Свой dev-сервер менее удобен, чем Next] → ограничиваемся пересборкой + reload; без HMR.

## Migration Plan

1. landing_v2 разрабатывается рядом, `../landing` продолжает работать в проде.
2. После применения всех изменений — деплой landing_v2 на Timeweb как отдельное приложение на временном поддомене, прогон e2e против него, проверка форм с реальными SMTP/Telegram.
3. Переключение домена lucovica.ru на новое приложение; переменные окружения переименовываются по таблице из README.
4. Откат — переключить домен обратно на приложение `landing` (оставить его развёрнутым минимум 2 недели).
5. После переключения — переотправить sitemap в Яндекс Вебмастер.

## Open Questions

- Точный тип приложения на Timeweb (App Platform Node.js или VDS с pm2) — влияет только на инструкцию деплоя в README, не на код.
