# Spec Delta

## Purpose

Определяет, как сайт LUCOVICA отдаётся посетителям: адреса страниц, ошибки, кэширование, сжатие, заголовки и изображения — так, чтобы страницы были быстрыми, а существующие ссылки и позиции в поиске сохранились.

## ADDED Requirements

### Requirement: Pre-rendered pages
Каждая публичная страница SHALL отдаваться как готовый HTML, сформированный при сборке, без серверного рендеринга на запрос и без обращения к внешним сервисам при отдаче.

#### Scenario: Page served from build output
- **WHEN** посетитель запрашивает `/laser-epil`
- **THEN** сервер отвечает 200 и полным HTML-документом страницы, содержащим заголовок h1 и контент секций

### Requirement: Stable public URLs
Сайт SHALL обслуживать URL `/`, `/laser-epil`, `/sugaring`, `/electro-epil`, `/complex`, `/cert`, `/privacy`, `/welcome`, `/welcome/back`, `/sitemap.xml`, `/robots.txt`. Канонический вид URL — без расширения `.html` и без завершающего слэша. Запрос с завершающим слэшем или с `.html` MUST перенаправляться (301) на канонический вид с сохранением query-строки.

#### Scenario: Trailing slash redirect
- **WHEN** посетитель запрашивает `/sugaring/?utm_source=ya`
- **THEN** сервер отвечает 301 с `Location: /sugaring?utm_source=ya`

#### Scenario: Html extension redirect
- **WHEN** посетитель запрашивает `/cert.html`
- **THEN** сервер отвечает 301 с `Location: /cert`

### Requirement: Not found page
Запрос несуществующего URL SHALL получать ответ 404 со страницей в стиле сайта, содержащей ссылку на главную и на услуги.

#### Scenario: Unknown URL
- **WHEN** посетитель запрашивает `/no-such-page`
- **THEN** сервер отвечает статусом 404 и HTML-страницей со ссылкой на `/`

### Requirement: Caching and compression
Статические ресурсы с хэшем содержимого в имени (CSS, JS, изображения, шрифты) SHALL отдаваться с `Cache-Control: public, max-age=31536000, immutable`. HTML-страницы SHALL отдаваться с `Cache-Control: no-cache` и валидатором (ETag или Last-Modified). Текстовые ответы MUST сжиматься (gzip или brotli), если клиент это поддерживает.

#### Scenario: Hashed asset cached forever
- **WHEN** браузер запрашивает собранный CSS-файл с хэшем в имени
- **THEN** ответ содержит `Cache-Control: public, max-age=31536000, immutable`

#### Scenario: HTML revalidated
- **WHEN** браузер повторно запрашивает `/` с `If-None-Match` из предыдущего ответа, и страница не менялась
- **THEN** сервер отвечает 304

#### Scenario: Compressed response
- **WHEN** клиент запрашивает `/` с `Accept-Encoding: gzip`
- **THEN** ответ сжат и содержит заголовок `Content-Encoding`

### Requirement: Security headers
Все ответы SHALL содержать `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` и `X-Frame-Options: SAMEORIGIN`; заголовок `X-Powered-By` MUST отсутствовать.

#### Scenario: Headers present
- **WHEN** запрашивается любая страница
- **THEN** ответ содержит перечисленные заголовки и не содержит `X-Powered-By`

### Requirement: Health check
Сервер SHALL отвечать на `GET /healthz` статусом 200 и телом `ok` без обращения к внешним сервисам.

#### Scenario: Health probe
- **WHEN** хостинг запрашивает `/healthz`
- **THEN** ответ 200 с телом `ok`

### Requirement: Responsive optimised images
Растровые изображения контента SHALL отдаваться в современных форматах (AVIF и WebP с запасным вариантом) в нескольких ширинах с атрибутами `srcset`/`sizes`, явными `width`/`height` (без сдвига макета), `loading="lazy"` для изображений ниже первого экрана и приоритетной загрузкой для главного изображения первого экрана. Каждое контентное изображение MUST иметь осмысленный `alt`, декоративное — пустой `alt`.

#### Scenario: Hero image prioritised
- **WHEN** загружается главная страница
- **THEN** изображение первого экрана не имеет `loading="lazy"` и имеет `fetchpriority="high"`, остальные фото — `loading="lazy"`

#### Scenario: Modern format served
- **WHEN** браузер с поддержкой AVIF загружает страницу
- **THEN** фото загружаются в формате AVIF подходящей ширины

### Requirement: Performance budget
Главная страница на мобильном профиле Lighthouse SHALL иметь Performance ≥ 90, Accessibility ≥ 95, SEO = 100; суммарный объём JavaScript, загружаемого страницей (без Метрики), MUST быть не больше 30 КБ в сжатом виде.

#### Scenario: Lighthouse budget
- **WHEN** Lighthouse запускается для собранной главной страницы с мобильной эмуляцией
- **THEN** оценки не ниже указанных порогов
