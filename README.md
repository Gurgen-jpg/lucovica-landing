# LUCOVICA — сайт студии эпиляции (v2)

Статический HTML, собираемый из TypeScript, + небольшой Express-сервер для статики и `/api`.
Без React и фреймворков. Дизайн-система — «LUCOVICA — Design System 2.0, Plaster & Onyx».

Планирование и спецификации — в `openspec/` (изменения применяются через `/opsx:apply <name>`).

## Команды

```bash
npm install
npm run dev          # сборка + наблюдение + сервер с live reload на http://localhost:3000
npm run build        # продакшен-сборка в dist/
npm start            # сервер на $PORT (по умолчанию 3000), отдаёт dist/ и /api
npm run lint         # проверка типов (сервер и браузерный код)
npm test             # unit- и API-тесты (Vitest)
npm run test:e2e     # e2e (Playwright): сам собирает сайт и поднимает сервер на 3099
npm run lighthouse   # Lighthouse мобильный для / ; другие страницы: npm run lighthouse -- /sugaring
```

Перед первым запуском e2e: `npx playwright install chromium webkit`.

В dev-режиме правки в `src/` пересобираются автоматически и перезагружают открытую страницу.
Правки в `server/` требуют перезапуска `npm run dev`.

## Структура

```
src/
  content/   данные: контакты (site.ts), цены, тексты, FAQ, отзывы
  pages/     одна страница = один модуль, экспортирует `page: Page`
  layout/    document() — <html>/<head>, метаданные, Метрика
  lib/       html`` (шаблоны с экранированием), picture(), JSON-LD
  client/    браузерный код (точка входа main.ts)
  styles/    site.css — точка входа стилей
server/      Express: app.ts (createApp), index.ts (запуск), api/
scripts/     build.ts, dev.ts, images.ts, lighthouse.ts, make-icons.ts
assets/img/  исходники фото → AVIF/WebP при сборке
public/      копируется в dist как есть (robots.txt, иконки, логотипы)
tests/       Vitest;  e2e/ — Playwright
```

Добавить страницу: создать `src/pages/<name>.ts` с `export const page: Page = { path, meta, sitemap?, render }`.
Сборка сама положит её в `dist/`, `routes.json` и (если указан `sitemap`) в `sitemap.xml`.

Дата `<lastmod>` в sitemap задаётся вручную в `src/content/sitemap.ts` — меняйте её при правке текстов или цен.

## Переменные окружения

См. `.env.example`. Локально — файл `.env`, на хостинге — настройки приложения.

| Переменная | Когда нужна | Назначение |
|---|---|---|
| `SITE_URL` | сборка | Канонический адрес, по умолчанию `https://lucovica.ru` |
| `YM_ID` | сборка | ID счётчика Яндекс Метрики (только цифры); пусто — без счётчика |
| `MAX_URL` | сборка | Ссылка на MAX; пусто — кнопка скрыта |
| `PORT` | запуск | Порт сервера, по умолчанию 3000 |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | запуск | Уведомления о заявках |
| `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` | запуск | Почта Timeweb |

### Переезд со старого сайта (Next.js)

| Было | Стало |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `SITE_URL` |
| `NEXT_PUBLIC_YM_ID` | `YM_ID` |
| `NEXT_PUBLIC_MAX_URL` | `MAX_URL` |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_PHONE_HREF`, `NEXT_PUBLIC_TG_USERNAME` | удалены — контакты в `src/content/site.ts` |
| `NEXT_PUBLIC_ADDRESS`, `NEXT_PUBLIC_INTERCOM_CODE` | удалены (не использовались) |
| `TELEGRAM_*`, `SMTP_*`, `NOTIFY_EMAIL` | без изменений |

`SITE_URL`, `YM_ID`, `MAX_URL` вшиваются в HTML при сборке: после их изменения нужна пересборка.

## Деплой (Timeweb)

- Node.js 22.9+.
- Сборка: `npm ci && npm run build`. Если хостинг ставит зависимости с `NODE_ENV=production`, используйте `npm ci --include=dev` — сборке нужны `esbuild`, `sharp`, `typescript`.
- Запуск: `npm start`. Сервер слушает `$PORT`.
- Проверка работоспособности: `GET /healthz` → `200 ok`.
- Сервер стоит за прокси хостинга (`trust proxy = 1`) — IP посетителя берётся из `X-Forwarded-For`.

### Переключение и откат

1. Развернуть v2 отдельным приложением на временном поддомене, прогнать `npm run test:e2e` и проверить формы с реальными SMTP/Telegram.
2. Переключить домен `lucovica.ru` на приложение v2, переименовать переменные по таблице выше.
3. Откат — вернуть домен на старое приложение (держать его развёрнутым минимум 2 недели).
4. После переключения — переотправить sitemap в Яндекс Вебмастере.

## Git

Ветка `v2` репозитория `lucovica-landing`. Локально подключена как worktree в `студия/landing_v2/`;
`студия/landing/` — старый сайт (эталон контента). Переключение на прод — слияние `v2` в `main`.
