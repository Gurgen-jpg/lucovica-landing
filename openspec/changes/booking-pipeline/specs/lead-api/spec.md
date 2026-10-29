# Spec Delta

## Purpose

Определяет HTTP-контракт приёма заявок на запись LUCOVICA (`POST /api/lead`): что принимается, как проверяется, как отсекается спам и что возвращается клиенту.

## ADDED Requirements

### Requirement: Request contract
`POST /api/lead` SHALL принимать JSON (`application/json`) или форму (`application/x-www-form-urlencoded`) с полями `name`, `phone` (обязательные), `service`, `time`, `contact_method`, `promo`, `utm_source`, `utm_medium`, `utm_campaign`, `_hp` (необязательные). Строки MUST обрезаться по пробелам и длине: name 100, phone 30, service 100 (по умолчанию «Не указана»), time 50 («Не указано»), contact_method 30 («Звонок»), promo 100, utm_source 50, utm_medium 50, utm_campaign 100. Тело больше 32 КБ MUST отклоняться со статусом 413.

#### Scenario: Defaults applied
- **WHEN** приходит заявка только с `name` и `phone`
- **THEN** в уведомление попадают «Услуга: Не указана», «Время: Не указано», «Связь: Звонок»

### Requirement: Validation
Сервер SHALL отвечать 422 `{ ok: false, error: "Укажите имя и телефон." }`, если имя пустое или телефон после удаления нецифровых символов не состоит из 11 цифр, начинающихся с 7 или 8. Невалидный JSON MUST давать 400 `{ ok: false, error: "Ошибка запроса. Попробуйте ещё раз." }`.

#### Scenario: Invalid phone rejected
- **WHEN** приходит заявка с `phone: "123"`
- **THEN** ответ 422 и уведомления не отправляются

#### Scenario: Malformed JSON
- **WHEN** тело запроса — невалидный JSON
- **THEN** ответ 400

### Requirement: Spam protection
Если поле-ловушка `_hp` непустое, сервер SHALL отвечать 200 `{ ok: true }`, не отправляя уведомлений. С одного IP (с учётом заголовка `X-Forwarded-For` от доверенного прокси) MUST приниматься не более 5 заявок за 60 секунд; превышение — 429 `{ ok: false, error: "Слишком много запросов. Попробуйте через минуту." }`.

#### Scenario: Honeypot filled
- **WHEN** приходит заявка с `_hp: "x"`
- **THEN** ответ 200, уведомления не отправляются

#### Scenario: Rate limit
- **WHEN** с одного IP приходит шестая заявка за минуту
- **THEN** ответ 429

### Requirement: Response
При успешной доставке хотя бы в один канал уведомлений сервер SHALL отвечать 200 `{ ok: true }`; если доставка не удалась ни в один канал — 500 `{ ok: false, error: "Не удалось отправить заявку." }`. Ответ MUST быть дан не позднее чем через 30 секунд. Для запроса-формы (не JSON) сервер SHALL отвечать HTML-страницей результата вместо JSON.

#### Scenario: One channel down
- **WHEN** почтовый сервер недоступен, а Telegram принимает сообщение
- **THEN** ответ 200 `{ ok: true }`

#### Scenario: All channels down
- **WHEN** недоступны и почта, и Telegram
- **THEN** ответ 500
