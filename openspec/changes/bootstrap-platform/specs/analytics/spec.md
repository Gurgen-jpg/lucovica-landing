# Spec Delta

## Purpose

Подключает Яндекс Метрику ко всем страницам LUCOVICA и даёт единый способ отправлять цели, сохраняя имена целей текущего сайта, чтобы отчёты и рекламные кампании продолжили работать после перехода.

## ADDED Requirements

### Requirement: Metrika counter on every page
Каждая страница SHALL загружать счётчик Яндекс Метрики с ID из конфигурации сборки, с включёнными картой кликов, отслеживанием ссылок, точным показателем отказов и вебвизором, а также `<noscript>`-пиксель. Скрипт счётчика MUST загружаться асинхронно и не блокировать отрисовку. Если ID не задан, счётчик и пиксель MUST NOT выводиться, и вызовы целей становятся пустыми операциями без ошибок.

#### Scenario: Counter loads asynchronously
- **WHEN** загружается любая страница при заданном ID
- **THEN** в HTML есть асинхронная загрузка `mc.yandex.ru/metrika/tag.js`, инициализация с этим ID и `<noscript>`-пиксель

#### Scenario: No ID in development
- **WHEN** сайт собран без ID счётчика и посетитель нажимает на телефон
- **THEN** запросов к `mc.yandex.ru` нет и в консоли нет ошибок

### Requirement: Goal tracking
Система SHALL предоставлять единый механизм отправки целей (`reachGoal`). Если счётчик ещё не загрузился, цель MUST быть отправлена после его загрузки (ожидание не дольше 10 секунд), а не потеряна. Элементы разметки MUST иметь возможность объявить цель декларативно (атрибутом), без собственного скрипта.

#### Scenario: Goal before counter ready
- **WHEN** посетитель нажимает на ссылку телефона до загрузки счётчика, и счётчик загружается через 2 секунды
- **THEN** цель отправляется в Метрику после загрузки счётчика ровно один раз

#### Scenario: Declarative goal
- **WHEN** посетитель нажимает на элемент с объявленной целью `header_phone_click`
- **THEN** в Метрику отправляется цель `header_phone_click`

### Requirement: Goal names preserved
Имена целей текущего сайта SHALL сохраняться без изменений там, где сохраняется соответствующее действие: `form_submit`, `click_phone`, `click_telegram`, `header_phone_click`, `floating_cta_click`, `laser_epil_cta_click`, `laser_epil_phone_click`, `laser_epil_zone_click`, `sugaring_cta_click`, `sugaring_phone_click`, `electro_epil_cta_click`, `electro_epil_phone_click`, `complex_cta_click`, `cert_cta_click`, `complex_page_view`, `cert_page_view`, `welcome_started`, `welcome_step_2` … `welcome_step_6`, `welcome_submitted`. Новые цели MUST именоваться в том же стиле `snake_case`.

#### Scenario: Page view goal
- **WHEN** посетитель открывает `/cert`
- **THEN** в Метрику отправляется цель `cert_page_view`

### Requirement: Page hits without duplication
Каждая загрузка страницы SHALL засчитываться в Метрике ровно одним просмотром.

#### Scenario: Single hit per page load
- **WHEN** посетитель открывает главную и затем переходит по ссылке на `/sugaring`
- **THEN** Метрика получает ровно два просмотра страниц
