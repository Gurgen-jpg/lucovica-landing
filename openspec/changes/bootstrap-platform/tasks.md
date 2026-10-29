# Tasks

## 1. Каркас проекта

- [x] 1.1 Создать `package.json` (`"type": "module"`, Node ≥ 22, скрипты `dev/build/start/lint/test/test:e2e`), `tsconfig.json` (strict, NodeNext) и `tsconfig.client.json` (DOM lib), `.gitignore`, `.env.example` с переменными из design.md D8; проверить `npm install` и `npx tsc --noEmit` без ошибок
- [x] 1.2 Перенести статику из `../landing/public` в `public/` (robots.txt, логотипы, symbol, telegram.svg, MAX.svg, og-image.jpg) и фото в `assets/img/` с латинскими именами (`hero.webp`, `team-ekaterina.webp`, `team-tatiana.webp`); сгенерировать favicon 32/ico и apple-touch-icon 180 из `../landing/src/app/icon.png`; проверить наличие файлов
- [x] 1.3 Закоммитить каркас в ветку `v2` (worktree `landing_v2/` репозитория `lucovica-landing`) и запушить в `origin/v2`; проверить `git log origin/v2`

## 2. Шаблоны и сборка

- [x] 2.1 `src/lib/html.ts`: тег `html` с экранированием, `raw()`, склейка массивов, пропуск `null/undefined/false`; unit-тесты на экранирование `<script>`, кавычек в атрибутах и вложенные шаблоны проходят
- [x] 2.2 `src/content/site.ts` — единый источник контактов (телефон, tel-href, адрес, индекс, координаты, часы, Telegram, MAX_URL, ID организации Яндекс Карт, текст промо); unit-тест на формат телефона
- [x] 2.3 `src/layout/document.ts`: `<html lang="ru">`, title/description/canonical/OG/иконки, preload шрифтов, подключение CSS/JS из манифеста, JSON-LD, `noindex` по флагу; unit-тест: для мета-объекта формируются все теги из спеки `seo-metadata`
- [x] 2.4 `scripts/images.ts` + хелпер `picture()` (AVIF/WebP, ширины, `width/height`, `loading`, `fetchpriority`, кэш `.cache/img`); проверить, что повторная сборка без изменений пропускает перекодирование
- [x] 2.5 `scripts/build.ts`: esbuild JS/CSS с хэшами и метафайлом, рендер всех `src/pages/*.ts` в `dist/`, `404.html`, `sitemap.xml` из флагов страниц, копирование `public/`; заглушка `src/pages/home.ts`; проверить `npm run build` → `dist/index.html`, `dist/sitemap.xml`, хэшированные ассеты

## 3. Сервер

- [x] 3.1 `server/app.ts` + `server/index.ts` по design.md D6; тесты supertest: 200 для `/`, 301 для `/sugaring/?a=1` и `/cert.html`, 404 со страницей, `/healthz` → `ok`, заголовки безопасности, отсутствие `X-Powered-By`, `immutable` у ассетов и `no-cache` + 304 по ETag у HTML, `Content-Encoding` при `Accept-Encoding: gzip`
- [x] 3.2 `scripts/dev.ts`: watch JS/CSS/страниц, `node --watch` для сервера, live reload через `/__dev/reload` только в development; проверить вручную: правка текста в `src/pages/home.ts` обновляет открытую страницу

## 4. SEO и аналитика

- [x] 4.1 `robots.txt` и `sitemap.xml` по спеке `seo-metadata` (ручная дата `lastmod`, 6 URL, приоритеты); тест: XML валиден и содержит ровно 6 URL, `robots.txt` содержит `Disallow: /welcome`
- [x] 4.2 JSON-LD-хелперы: `beautySalon(site)`, `service(...)`, `faqPage(items)`, `breadcrumbs(...)` на данных `site.ts`; unit-тесты: валидный JSON, адрес и телефон совпадают с `site.ts`
- [x] 4.3 Метрика: сниппет в `document()` при заданном `YM_ID` + `<noscript>`; `src/client/analytics.ts` (`track` с ожиданием до 10 с, делегирование `[data-goal]`, `data-page-goal` на body); тесты happy-dom: цель до загрузки счётчика отправляется один раз, без ID — пустая операция

## 5. Тестовая инфраструктура и документация

- [x] 5.1 Настроить Vitest (node + happy-dom по шаблону имени) и Playwright (build + start на 3099, Chromium + WebKit iPhone 13, `@axe-core/playwright`); e2e-smoke: главная открывается, 0 нарушений axe на заглушке
- [x] 5.2 Добавить Lighthouse-проверку (`npm run lighthouse` через `lighthouse` CLI против собранного сайта) с порогами из спеки `site-delivery`; проверить, что команда выводит оценки
- [x] 5.3 `README.md`: команды, переменные окружения и таблица переименования `NEXT_PUBLIC_*`, деплой на Timeweb (build/start/PORT/healthz), откат; `CLAUDE.md` с архитектурными правилами landing_v2; проверить, что команды из README выполняются как написано
