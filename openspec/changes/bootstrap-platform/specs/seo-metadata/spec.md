# Spec Delta

## Purpose

Обеспечивает, чтобы каждая страница LUCOVICA корректно индексировалась поисковиками и красиво отображалась при репосте: уникальные метаданные, канонические адреса, структурированные данные, sitemap и robots.

## ADDED Requirements

### Requirement: Per-page metadata
Каждая публичная страница SHALL иметь уникальные `<title>` и `<meta name="description">`, `<html lang="ru">`, `<link rel="canonical">` с абсолютным URL на основном домене, теги Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:locale=ru_RU`, `og:site_name`) и ровно один `<h1>`. Тексты title и description для существующих страниц MUST переноситься из `../landing` без изменений, если в изменении страницы не указано иное.

#### Scenario: Canonical on service page
- **WHEN** загружается `/sugaring`
- **THEN** `<link rel="canonical">` указывает на `https://lucovica.ru/sugaring`

#### Scenario: Unique titles
- **WHEN** сравниваются `<title>` всех страниц из sitemap
- **THEN** все они различны и непусты

### Requirement: Structured data
Страницы SHALL содержать JSON-LD: главная — `BeautySalon` (название, адрес, телефон, часы работы, геокоординаты, рейтинг, ссылки на соцсети) и `FAQPage` по вопросам на странице; страницы услуг — `Service` с ценовым диапазоном, `FAQPage` и `BreadcrumbList`. Данные JSON-LD MUST совпадать с видимыми на странице (адрес, телефон, цены, вопросы).

#### Scenario: Valid JSON-LD
- **WHEN** JSON-LD каждой страницы извлекается и парсится
- **THEN** он является валидным JSON с ожидаемым `@type`, и вопросы `FAQPage` совпадают с вопросами в разметке страницы

### Requirement: Sitemap
`/sitemap.xml` SHALL перечислять `/`, `/laser-epil`, `/sugaring`, `/electro-epil`, `/complex`, `/cert` с абсолютными URL, `lastmod`, `changefreq` и `priority` (1.0 для главной, 0.9 для лазера/шугаринга/электро, 0.8 для комплексов и сертификатов). Дата `lastmod` MUST задаваться вручную при реальном изменении контента, а не обновляться при каждой сборке. Служебные страницы (`/welcome`, `/welcome/back`, `/privacy`) в sitemap не включаются.

#### Scenario: Sitemap content
- **WHEN** запрашивается `/sitemap.xml`
- **THEN** ответ — XML с `Content-Type: application/xml`, содержащий ровно шесть указанных URL

### Requirement: Robots
`/robots.txt` SHALL разрешать индексацию всего сайта, кроме `/welcome` и `/welcome/back`, и указывать `Host: lucovica.ru` и `Sitemap: https://lucovica.ru/sitemap.xml`. Страницы `/welcome` и `/welcome/back` дополнительно MUST иметь `<meta name="robots" content="noindex, nofollow">`.

#### Scenario: Welcome hidden from search
- **WHEN** загружается `/welcome`
- **THEN** страница содержит `meta robots` со значением `noindex, nofollow`, и `robots.txt` содержит `Disallow: /welcome`

### Requirement: Icons and social preview
Сайт SHALL отдавать favicon, apple-touch-icon и изображение Open Graph 1200×630, ссылки на которые есть в `<head>` каждой страницы.

#### Scenario: Icons resolve
- **WHEN** проверяются все URL иконок и `og:image` из `<head>` главной
- **THEN** каждый отвечает 200 с корректным типом изображения
