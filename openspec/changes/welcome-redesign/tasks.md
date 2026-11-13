# Tasks

## 1. Тексты и обращение

- [x] 1.1 `welcome-options.ts`: новые `formLabel` по `docs/welcome-texts.md`, `label` и id без изменений; `npm test` — снапшоты уведомлений не меняются
- [x] 1.2 `welcome.ts` (`welcomeNew`): все тексты из `docs/welcome-texts.md`, без `tv()` и эмодзи, вопрос «ты/вы» удалён; проверка: в собранном `dist/welcome.html` (так именует сборка) нет «звёздочк», «data-ty», «ознакомлена»
- [x] 1.3 `src/client/welcome.ts`: шаг 1 валидируется без `address_form`, новая анкета отправляет `address_form: 'vy'`; unit-тесты правил шагов зелёные

## 2. Макет

- [x] 2.1 Разметка: боковая панель с разделами и контактами из `site.ts`, надзаголовки шагов, счётчик «Шаг N из 6», карточка на экране «Спасибо»
- [x] 2.2 `welcome.css` по `docs/welcome-mockup.html`, только токены; `npm run lint` (stylelint без HEX)
- [x] 2.3 Визуальная сверка с макетом на 390px и 1440px для `/welcome` и `/welcome/back`; без JS шаги видны одной формой

## 3. Тесты

- [x] 3.1 `e2e/welcome.spec.ts`: обновить селекторы и тексты, удалить сценарий «На вы», проверить полный сценарий, ошибку телефона, prefill `?name=&phone=`, axe 0 нарушений — `npm run build && npx playwright test e2e/welcome.spec.ts`
