# Spec Delta

## ADDED Requirements

### Requirement: Formal address
Анкета нового гостя SHALL обращаться к гостю на «вы» и использовать формулировки, нейтральные по роду; вопрос о форме обращения MUST NOT показываться. Анкета повторного гостя использует «ты» до отдельного изменения.

#### Scenario: Formal by default
- **WHEN** гость открывает `/welcome`
- **THEN** все тексты анкеты на «вы», поля выбора формы обращения нет, при отправке `address_form` = `vy`

## MODIFIED Requirements

### Requirement: Intake pages
Сайт SHALL обслуживать `/welcome` и `/welcome/back` без каркаса сайта, с `noindex, nofollow`. На ширине от 960px страница SHALL показывать тёмную панель с логотипом, списком разделов и контактами студии; на меньшей ширине — логотип, счётчик «Шаг N из M» и полосу прогресса. Параметры `?name=` и `?phone=` SHALL подставляться в поля, телефон — в формате маски.

#### Scenario: Prefill from link
- **WHEN** гость открывает `/welcome?name=Анна&phone=89770169775`
- **THEN** на шаге «Контактные данные» имя — «Анна», телефон — «+7 (977) 016-97-75»

#### Scenario: Desktop layout
- **WHEN** гость открывает `/welcome` на ширине 1440px и проходит на шаг 2
- **THEN** в панели раздел «Напиток» отмечен текущим, «Контактные данные» доступен для возврата, остальные неактивны

## REMOVED Requirements

### Requirement: Address form
**Reason**: вопрос «На ты / на вы» удалён, анкета нового гостя всегда на «вы» (см. «Formal address»).
**Migration**: клиент отправляет `address_form: 'vy'`; контракт `POST /api/welcome` не меняется.
