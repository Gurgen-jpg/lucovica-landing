# Design

## Context

Текущая реализация: `../landing/src/app/welcome/WelcomeForm.tsx` и `back/BackForm.tsx` (React-состояние в одном компоненте, ~600 строк), `src/lib/welcome-options.ts` и `welcome-labels.ts` (два расходящихся источника подписей), `src/app/api/welcome/route.ts`, `src/lib/{sendWelcome,sendEmail}.ts`. В landing_v2 нет React, поэтому мастер реализуется на чистом TS.

## Goals / Non-Goals

**Goals:**
- Один источник опций и подписей для формы и уведомлений.
- Мастер без фреймворка, но с декларативным описанием шагов, чтобы условия показа и обязательности были видны в одном месте.

**Non-Goals:**
- Сохранение черновика анкеты между визитами (localStorage) — не было и не требуется.
- Привязка анкеты к записи в CRM.

## Decisions

### D1. Опции — `src/content/welcome-options.ts`
Каждая опция `{ id, label, labelVy? }`; критичность противопоказания — флаг `critical: true` на опции, а не отдельный список. Форма и `format-welcome.ts` импортируют один модуль → исчезает класс ошибок «подпись есть в форме, нет в письме».

### D2. Мастер: HTML всех шагов + конфигурация
Сборка рендерит все шаги в HTML (`<section data-step="2" hidden>`), поля — нативные `input`/`button[aria-pressed]` из примитивов ДС. `welcome.client.ts` держит состояние в одном объекте `answers`, а правила — в таблице:
```ts
const steps: StepRule[] = [
  { id: 1, required: a => !!a.name.trim() && isValidPhone(a.phone) && !!a.address_form, goal: 'welcome_step_2' },
  { id: 2, required: a => !!a.drink, visible: { milk: a => MILK_TRIGGER.has(a.drink), sugar: a => COFFEE.has(a.drink) } },
  ...
]
```
После каждого изменения `render()` переключает `hidden` у зависимых полей и `disabled` у «Далее». Тексты «ты/вы» — два варианта в разметке (`data-ty`/`data-vy`), переключение атрибутом `data-address="vy"` на корне через CSS — без перерисовки текста в JS.

### D3. Повторная анкета с полями контактов
Если `phone` из query невалиден, сборочный шаблон уже содержит поля «Имя/Телефон» на экране 0, клиент показывает их и делает обязательными. Так устраняется 422 при ссылке без телефона, а для правильных ссылок поведение не меняется.

### D4. API и уведомление
`server/api/welcome.ts` повторяет порядок обработки текущего роутера (rate limit → JSON → honeypot → валидация → notify) с общими модулями из `booking-pipeline`. `format-welcome.ts` строит `StaffMessage` с блоком флагов первым; для `visit_type: back` выводит «Здоровье изменилось» и `health_notes`.

## Risks / Trade-offs

- [Ручной мастер на TS сложнее тестировать, чем React-компонент] → правила шагов — чистые функции с unit-тестами; e2e покрывает полные сценарии обеих анкет.
- [Ответы теряются при перезагрузке страницы] → как и сейчас; анкета короткая (≈3 минуты).
- [Рассылаемые ссылки старого формата] → URL и параметры `name`, `phone` не меняются.
