# Spec Delta

## Purpose

Lets a visitor move from a service card on the homepage to that service's dedicated page, and back to the services catalog, without relying on the browser's own back button or the header logo as the only way out.

## ADDED Requirements

### Requirement: Service card navigates to its service page
Each service category card in the homepage services section SHALL act as a link to that category's dedicated page when clicked anywhere on the card body, for every category that has a dedicated page (`Лазерная эпиляция`, `Шугаринг`, `Электроэпиляция`, `Комплексы`, `Подарочные сертификаты`).

#### Scenario: Clicking the card body navigates to the service page
- **WHEN** a visitor clicks anywhere on a service card except the "Записаться" button
- **THEN** the browser navigates to that category's dedicated page (e.g. the "Лазерная эпиляция" card navigates to `/laser-epil`)

#### Scenario: Booking button opens the lead form instead of navigating
- **WHEN** a visitor clicks the "Записаться" button inside a service card
- **THEN** the lead form opens with that service pre-selected, and the browser does not navigate away from the homepage

### Requirement: Every service category has a dedicated page
The system SHALL provide a dedicated page for each service category shown on the homepage, including categories that previously had none (`Комплексы`, `Подарочные сертификаты`).

#### Scenario: Visiting the complexes page
- **WHEN** a visitor navigates to the complexes service page
- **THEN** the page shows an overview of complex/package pricing and a way to submit a booking request

#### Scenario: Visiting the gift certificates page
- **WHEN** a visitor navigates to the gift certificates service page
- **THEN** the page shows the available certificate amounts and a way to submit a booking request

### Requirement: Service pages offer a way back to the services catalog
Every dedicated service page SHALL display a visible element that lets the visitor return to the homepage services catalog without relying solely on the browser back button.

#### Scenario: Returning from a service page
- **WHEN** a visitor on a dedicated service page activates the back-to-catalog element
- **THEN** the browser navigates to the homepage's services section
