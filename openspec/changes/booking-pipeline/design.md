# Design

## Context

Текущая реализация: `../landing/src/components/LeadForm.tsx` (мастер из 3 шагов), `src/app/api/lead/route.ts`, `src/lib/{sendEmail,sendLead,telegram,retry,timeout,html}.ts`. Борд 04 «Dialog · BookingSheet» задаёт вид: поля только с нижней линией, Select услуги, подпись «Перезвоним в течение часа…». Сервер — Express из `bootstrap-platform`, диалог/поля/тост — из `design-system`.

## Goals / Non-Goals

**Goals:**
- Один шаблон формы для диалога и «Контактов».
- Модуль уведомлений, независимый от типа сообщения (заявка, анкета).

**Non-Goals:**
- Онлайн-запись в слот расписания / интеграция с YCLIENTS и т. п.
- Капча — honeypot и rate limit достаточно для текущего объёма.

## Decisions

### D1. Один шаблон формы, два контейнера
`bookingForm({ id, variant: 'dialog' | 'inline' })` рендерит `<form action="/api/lead" method="post">` с полями. Диалог (`<dialog id="booking">`) выводится один раз в layout каждой публичной страницы. `booking.client.ts`:
- делегированный `click` по `[data-booking]` → заполнить `service`/`promo` из `data-*`, открыть диалог;
- `submit` → `fetch('/api/lead', { body: JSON })`, состояния через `data-state="idle|sending|success|error"` на `<form>`; CSS показывает нужный блок.
Без JS: inline-форма отправляется как `x-www-form-urlencoded`, сервер отвечает HTML-страницей результата (D4).

### D2. Маска телефона — общий модуль
`src/client/phone-mask.ts`: `normalizePhone(str) → digits` и `formatPhone(digits)`; на `input` переформатируем и восстанавливаем каретку по числу цифр слева. Тот же `normalizePhone` (в `src/shared/phone.ts`, импортируется и клиентом, и сервером) используется для серверной валидации — одно правило на обе стороны.

### D3. Уведомления: `notify(message)` с параллельными каналами
```ts
type StaffMessage = { subject: string; html: string; telegram: string }
notify(msg) → Promise<{ email: boolean; telegram: boolean }>
```
`Promise.allSettled([sendEmail(...), sendTelegram(...)])`, каждый с собственным таймаутом. Форматтеры `formatLead(data)` / `formatWelcome(data)` (в `welcome-intake`) строят `StaffMessage`, экранируя все значения через `escapeHtml`. Альтернатива «email синхронно, Telegram в фоне» (как сейчас) отвергнута: при сбое почты клиент получает ошибку, хотя Telegram бы сработал, и заявка теряется.

Почему ждём оба канала, а не первый успешный: клиент получает ответ максимум через ~25 с в худшем случае, зато процесс не держит висящих фоновых промисов, и логи согласованы. В обычном случае оба канала отвечают за 1–2 с.

### D4. Ответы API
`res.format()`: для `Accept: application/json` или JSON-тела — JSON; для формы — рендер `dist`-шаблона `lead-result` (успех / ошибка со ссылкой назад). Тексты ошибок — константы в `server/api/lead.ts`.

### D5. Rate limit
In-memory скользящее окно (Map ip → timestamps) с периодической очисткой, общий модуль с параметрами: lead 5/60 с, welcome 3/60 с. IP — `req.ip` при `trust proxy = 1`. Ограничение: работает в пределах одного процесса — на Timeweb один инстанс, этого достаточно.

### D6. UTM
`src/client/utm.ts` на каждой странице: если в `location.search` есть `utm_*`, сохранить в `sessionStorage` (последнее касание); форма читает при отправке. Обёрнуто в try/catch — в приватном режиме просто без UTM.

## Risks / Trade-offs

- [Один экран вместо мастера даёт меньше сведений (нет даты)] → «Удобное время» + способ связи; администратор уточняет дату при звонке, как и сейчас фактически.
- [Строгая проверка телефона может отсечь иностранные номера] → только российские номера, как в анкете; в ошибке подсказка позвонить. Мониторим 422 в логах.
- [In-memory rate limit сбрасывается при рестарте] → допустимо для лендинга.
- [Ответ до 25 с при деградации почты] → кнопка в состоянии «Отправка…»; в нормальном режиме 1–2 с.
