# Tasks

## 1. Токены, шрифты, база

- [ ] 1.1 Создать `src/ds/tokens.css` со всеми токенами из спеки `design-tokens` (gray-1…12, onyx/graphite/champagne, семантические, `--space-1…11`, шрифты, `--radius`, `--ease-silk`, `--dur-hover/ui/enter/photo`, `--shadow-overlay`, `--photo-mono`); проверить, что `npm run build` кладёт его в итоговый CSS
- [ ] 1.2 Подключить `@fontsource/cormorant-garamond` и `@fontsource/jost` (только нужные начертания, cyrillic+latin), написать `src/ds/fonts.css` с `font-display: swap`, копировать WOFF2 в `dist/fonts`, добавить preload для Jost 300 и Cormorant 300 в базовый layout; проверить во вкладке Network, что запросов к Google Fonts нет
- [ ] 1.3 Создать `src/ds/base.css`: reset, типографическая шкала (классы `ds-display-xl … ds-overline`, `ds-price`), контейнер и сетка 12/8/4 с брейкпоинтами 1280/768, отступы секций 160/96, `prefers-reduced-motion`, стиль фокуса; проверить на `/ds`, что нет горизонтального скролла на 360px
- [ ] 1.4 Настроить stylelint (`color-no-hex`, `color-named: never`, запрет `rgb/hsl` вне `tokens.css`), добавить в `npm run lint`; проверить, что вставка `color: #fff` в любой CSS роняет lint

## 2. Статические примитивы

- [ ] 2.1 Button (`solid/outline/link/inverse/champagne`, размеры 3 и 2, `asLink` для `<a>`), Badge, Separator (с символом логотипа вместо `LogoDivider`), SectionHeader (overline + h2 с курсивным акцентом + описание), Photo (`ds-photo`, монохром, aspect-ratio); unit-тесты Vitest на разметку (вариант → атрибуты, `<a>` vs `<button>`) проходят
- [ ] 2.2 Страница-витрина `/ds` (генерируется только при `NODE_ENV !== 'production'`) со всеми вариантами каждого примитива; проверить визуально против борда 04

## 3. Интерактивные примитивы

- [ ] 3.1 Dialog: шаблон на `<dialog>` + `dialog.client.ts` (открытие по `data-dialog-open="<id>"`, возврат фокуса, клик по подложке, блок скролла, анимация 320ms); e2e на `/ds`: Enter → фокус в первом поле, Tab-цикл внутри, Escape → фокус на триггере
- [ ] 3.2 Accordion (single, collapsible, прогрессивное улучшение); e2e: открытие одного закрывает другой, повторный клик закрывает, `aria-expanded` корректен; без JS все ответы видны
- [ ] 3.3 Tabs (WAI-ARIA, стрелки/Home/End, активация при фокусе, прогрессивное улучшение); e2e: стрелка вправо переключает панель
- [ ] 3.4 Carousel (prev/next, зацикливание, индикатор «01 / 03», `aria-live="polite"`); e2e: wrap-around в обе стороны
- [ ] 3.5 Поля форм: TextField (label, нижняя линия, ошибка через `aria-describedby`/`aria-invalid`), Select (нативный), Checkbox, Chip (single/multi, `aria-pressed`), YesNo; e2e: ошибка объявляется и фокус переходит на поле, чип меняет `aria-pressed`
- [ ] 3.6 Toast (`role="status"`, автозакрытие 5 с, кнопка закрытия, API `toast({title, text})`) и Tooltip (hover + focus, Escape, `aria-describedby`); e2e на `/ds`

## 4. Проверка

- [ ] 4.1 Прогнать `@axe-core/playwright` на `/ds`: 0 нарушений, включая `color-contrast`; прогнать e2e с эмуляцией `prefers-reduced-motion: reduce` и убедиться, что диалог открывается без перехода
