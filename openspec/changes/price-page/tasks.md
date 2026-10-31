# Tasks

## 1. Общие контакты

- [x] 1.1 Добавить в `src/lib/site-config.ts` `ADDRESS`, `CITY`, `YANDEX_MAPS_URL`, `HOURS_TEXT`; перевести `src/components/Contacts.tsx` на них — проверка: `npx tsc --noEmit` без ошибок, блок контактов на главной выглядит как раньше

## 2. Данные прайса

- [x] 2.1 Создать `src/components/price/price-list.config.ts`: группы (лазер/шугаринг × девушки/мужчины) со ссылками `{ categoryId, name }` на `SERVICES`, `formService` из `SERVICE_NAMES_FOR_FORM`; `buildPriceList()` резолвит цены, сортирует по возрастанию, бросает ошибку при ненайденной позиции; `buildElectroList()` из `ELECTRO_PRICES`; `minPrice()` для метаданных
- [x] 2.2 Тест `src/__tests__/lib/price-list.test.ts`: каждая группа 1–10 позиций, цены совпадают с `SERVICES`, сортировка по возрастанию, `formService` входит в `SERVICE_NAMES_FOR_FORM`, ненайденная позиция бросает ошибку — проверка: `npx vitest run src/__tests__/lib/price-list.test.ts`

## 3. Страница

- [x] 3.1 Компоненты `src/components/price/`: `PriceHeader` (логотип → `/`, заголовок, акция), `PriceGroupCard` (список + кнопка «Записаться»), `PriceContacts` (адрес, часы, телефон, Telegram, Яндекс Карты, «Перейти на сайт»), клиентский `PriceTabs` (вкладки WAI-ARIA с хэшем `#men`, одна `LeadForm`, закреплённая кнопка, цели Метрики) и `index.ts`
- [x] 3.2 Роут `src/app/price/page.tsx` вне `(site)`: метаданные (title, description c «от N ₽», openGraph, canonical, `noindex`), `PageViewGoal goal="price_page_view"` — проверка: `npm run build` проходит, `/price` в списке маршрутов, `/price` отсутствует в `sitemap.ts`

## 4. Проверка

- [x] 4.1 E2E `e2e/price-page.spec.ts`: нет шапки сайта; вкладки переключаются и пишут `#men`; `/price#men` открывает мужскую вкладку; «Записаться» под шугарингом открывает форму со «Шугаринг — Девушки»; ссылка на карты ведёт на `yandex.ru/maps`, открывается в новой вкладке — проверка: `npx playwright test e2e/price-page.spec.ts`
- [x] 4.2 `npm run test` — без ошибок (`npm run lint` не настроен в проекте: next lint запрашивает первичную настройку ESLint)
- [x] 4.3 Ручная проверка в браузере на ширине 375px: читаемость, закреплённая кнопка не перекрывает контакты, переходы в карты и на сайт
- [ ] 4.4 (владелец) Завести в Яндекс Метрике цели `price_page_view`, `price_cta_click`, `price_map_click`, `price_site_click`; после деплоя проверить превью ссылки в Telegram
