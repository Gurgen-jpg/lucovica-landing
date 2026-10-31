# Spec Delta

## Purpose

Даёт посетителю из внешней ссылки (Telegram) короткий прайс популярных зон по трём видам эпиляции для девушек и мужчин, запись в один тап, маршрут в Яндекс Картах и переход на основной сайт.

## ADDED Requirements

### Requirement: Отдельная страница прайса
The system SHALL serve a standalone price page at `/price` that is rendered without the main site header, footer, floating booking button and messenger widgets, is excluded from search indexing (`noindex`) and from the sitemap, and provides Open Graph metadata titled as the studio's price list.

#### Scenario: Открытие ссылки из Telegram
- **WHEN** посетитель открывает `/price`
- **THEN** страница отвечает 200, показывает логотип студии и заголовок прайса, и не содержит шапки и футера основного сайта

#### Scenario: Страница не индексируется
- **WHEN** поисковый робот запрашивает `/price`
- **THEN** страница содержит `meta robots` с `noindex`, а `sitemap.xml` не содержит `/price`

### Requirement: Прайс трёх видов эпиляции для девушек и мужчин
The price page SHALL list prices for laser epilation and sugaring separately for women and men, and electro-epilation as a single shared list. Each list SHALL contain at most 10 positions, ordered by price ascending. Every price SHALL be taken from `src/lib/services-data.ts`; a configured position that does not exist there SHALL fail the build.

#### Scenario: Прайс для девушек по умолчанию
- **WHEN** посетитель открывает `/price` без хэша
- **THEN** выбрана вкладка «Девушкам» и видны списки «Лазерная эпиляция» и «Шугаринг» с женскими ценами, а также общий список «Электроэпиляция»

#### Scenario: Переключение на мужской прайс
- **WHEN** посетитель выбирает вкладку «Мужчинам»
- **THEN** видны мужские списки лазерной эпиляции и шугаринга, женские скрыты, адрес страницы получает хэш `#men`

#### Scenario: Прямая ссылка на мужской прайс
- **WHEN** посетитель открывает `/price#men`
- **THEN** сразу выбрана вкладка «Мужчинам»

#### Scenario: Ограничение длины списков
- **WHEN** собирается любой список прайса
- **THEN** в нём от 1 до 10 позиций, и цена каждой совпадает с ценой той же позиции в `services-data.ts`

#### Scenario: Цены доступны без JavaScript
- **WHEN** страница загружена с отключённым JavaScript
- **THEN** все цены обеих вкладок присутствуют в HTML

### Requirement: Запись с прайса
The price page SHALL let the visitor open the existing booking form from every price list (with that list's service pre-selected) and from a persistent booking button that stays visible while scrolling.

#### Scenario: Запись из списка
- **WHEN** посетитель нажимает «Записаться» под списком «Шугаринг» на вкладке «Девушкам»
- **THEN** открывается форма записи с выбранной услугой «Шугаринг — Девушки»

#### Scenario: Закреплённая кнопка
- **WHEN** посетитель в любом месте страницы нажимает закреплённую кнопку «Записаться»
- **THEN** открывается форма записи с шагом выбора услуги

### Requirement: Контакты и переходы
The price page SHALL show the studio's address, working hours, phone and Telegram, a link that opens the studio in Yandex Maps in a new tab, and a link to the main site. Clicks SHALL be reported as Yandex Metrica goals.

#### Scenario: Переход в Яндекс Карты
- **WHEN** посетитель нажимает «Открыть в Яндекс Картах»
- **THEN** в новой вкладке открывается карточка студии в Яндекс Картах и отправляется цель `price_map_click`

#### Scenario: Переход на сайт
- **WHEN** посетитель нажимает «Перейти на сайт»
- **THEN** открывается главная страница сайта и отправляется цель `price_site_click`

#### Scenario: Учёт просмотра
- **WHEN** страница открыта
- **THEN** один раз отправляется цель `price_page_view`
