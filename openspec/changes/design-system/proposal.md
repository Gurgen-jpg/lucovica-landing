# Proposal

## Why

Дизайн-система 2.0 «Plaster & Onyx» задаёт новый визуальный язык студии, но описана поверх React + Radix + Tailwind. В landing_v2 этого стека нет, поэтому токены и поведение компонентов нужно перенести в чистый CSS и vanilla TypeScript — до того, как появятся первые страницы, иначе каждая секция заведёт свои цвета и свою «доступность».

## What Changes

- Единый файл токенов `src/ds/tokens.css`: шкала `--gray-1…12` («plaster»), `--lv-onyx`, `--lv-graphite`, `--lv-champagne`, семантические `--lv-bg/surface/inverse/text/text-2/text-3/line/accent`, шрифты, отступы `--space-1…11` (шаг 4px), радиус 0, `--ease-silk`, длительности 160/320/640/1200, `--shadow-overlay`.
- Типографическая шкала (display-xl, display-l, heading-1…3, lead, body, price, overline/button) и сетка (12/8/4 колонок, брейкпоинты 1280/768/390).
- Самостоятельно размещённые шрифты Cormorant Garamond и Jost (кириллица + латиница) вместо SF Pro как основного.
- Набор примитивов на чистом CSS + TS, повторяющих поведение Radix Primitives по WAI-ARIA APG: Button (solid / outline / link / inverse / champagne, размеры 52/40), Dialog, Accordion, Tabs, Carousel, ToggleGroup / Chip, Checkbox, Radio / YesNo, TextField с нижней линией, Select (нативный, стилизованный), Toast, Tooltip, Badge, Separator.
- Страница-витрина `/ds` (только в dev-сборке) для визуальной и e2e-проверки примитивов.

Изменения относительно ../landing:
- Выводятся цвета v1: `cream #F5F0C6`, `mist #D9E4EB`, прозрачные `dark/40`, `dark/50`. `#25272C` остаётся как `--lv-graphite`, основной тёмный — `--lv-onyx #141416`.
- Скругления, тени на поверхностях и scale-анимации убираются полностью.
- Компоненты `Chip`, `YesNo`, `Checkbox`, `Badge`, `TagPill`, `FormField`, `LogoDivider`, `SectionHeader` заменяются примитивами ДС с тем же назначением.

## Capabilities

### New Capabilities
- `design-tokens`: единый источник визуальных значений (цвет, типографика, отступы, движение) и правила их применения, включая контраст WCAG AA и reduced-motion.
- `ui-primitives`: доступные интерактивные и статические примитивы интерфейса (кнопки, диалог, аккордеон, вкладки, карусель, поля форм, тост, тултип), их клавиатурное поведение и ARIA-семантика.

### Modified Capabilities
(нет — в landing_v2 ещё нет спек)

## Impact

- Новые файлы: `src/ds/tokens.css`, `src/ds/base.css`, `src/ds/primitives/*` (шаблон `.ts` + `.css` + клиентское поведение `.client.ts`), `public/fonts/*`.
- Зависит от `bootstrap-platform` (сборка, бандлинг клиентского TS, раздача статики).
- Используется всеми последующими изменениями: `home-page`, `booking-pipeline`, `service-pages`, `welcome-intake`.
- Новых runtime-зависимостей нет.
