# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: welcome-form.spec.ts >> WelcomeForm — анкета нового клиента >> полный флоу — 6 шагов до «Всё записали»
- Location: e2e\welcome-form.spec.ts:16:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('Ничего из перечисленного')
    - locator resolved to <button type="button" class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-left text-sm transition-all duration-150 active:scale-[0.98] bg-white text-dark border-mist hover:border-dark/40">Ничего из перечисленного</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - element is outside of the viewport
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]: LUCOVICA
      - generic [ref=e5]: 5 / 6
    - main [ref=e8]:
      - generic [ref=e9]:
        - heading "Здоровье 🏥" [level=2] [ref=e10]
        - paragraph [ref=e11]: Это важная часть. Лазер не подходит при некоторых состояниях — отметь, что относится к тебе.
        - generic [ref=e12]:
          - generic [ref=e13]:
            - button "Беременность" [ref=e14] [cursor=pointer]
            - button "Период лактации" [ref=e15] [cursor=pointer]
            - button "Онкология (текущая или в анамнезе)" [ref=e16] [cursor=pointer]
            - button "Сахарный диабет" [ref=e17] [cursor=pointer]
            - button "Эпилепсия" [ref=e18] [cursor=pointer]
            - button "Приём антибиотиков (последние 2 недели)" [ref=e19] [cursor=pointer]
            - button "Приём ретиноидов / Роаккутана (последние 6 месяцев)" [ref=e20] [cursor=pointer]
            - button "Фотодерматит / повышенная чувствительность к свету" [ref=e21] [cursor=pointer]
            - button "Острые инфекции, ОРВИ, температура" [ref=e22] [cursor=pointer]
            - button "Ничего из перечисленного" [ref=e23] [cursor=pointer]
          - generic [ref=e24]:
            - paragraph [ref=e25]: Загорала или была в солярии в последние 2 недели?
            - generic [ref=e26]:
              - button "Да" [ref=e27] [cursor=pointer]
              - button "Нет" [ref=e28] [cursor=pointer]
          - generic [ref=e29]:
            - generic [ref=e30]: Аллергии или особенности кожи
            - textbox "Опционально — если есть, что нам важно знать" [ref=e31]
        - generic [ref=e32]:
          - button "Продолжить" [disabled] [ref=e33]
          - button "← Назад" [ref=e34] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e40] [cursor=pointer]:
    - img [ref=e41]
  - alert [ref=e44]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('WelcomeForm — анкета нового клиента', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('/api/welcome', route =>
  6  |       route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  7  |     )
  8  |     await page.goto('/welcome')
  9  |   })
  10 | 
  11 |   test('стартовый экран открывается', async ({ page }) => {
  12 |     await expect(page.getByText('Привет, наша звёздочка')).toBeVisible()
  13 |     await expect(page.getByRole('button', { name: 'Начнём' })).toBeVisible()
  14 |   })
  15 | 
  16 |   test('полный флоу — 6 шагов до «Всё записали»', async ({ page }) => {
  17 |     await page.getByRole('button', { name: 'Начнём' }).click()
  18 | 
  19 |     // Шаг 1 — Знакомство
  20 |     await expect(page.getByText('Знакомство')).toBeVisible()
  21 |     await page.getByPlaceholder('Например, Рита').fill('Тест')
  22 |     await page.getByRole('button', { name: 'На «ты»' }).click()
  23 |     await page.getByPlaceholder('+7 (___) ___-__-__').fill('+79991234567')
  24 |     await page.getByRole('button', { name: 'Продолжить' }).click()
  25 | 
  26 |     // Шаг 2 — Напиток
  27 |     await expect(page.getByText('Что приготовить?')).toBeVisible()
  28 |     await page.getByRole('button', { name: /Чай чёрный/ }).click()
  29 |     await page.getByRole('button', { name: 'Продолжить' }).click()
  30 | 
  31 |     // Шаг 3 — Транспорт
  32 |     await expect(page.getByText('Как доберёшься?')).toBeVisible()
  33 |     await page.getByRole('button', { name: 'Без машины' }).click()
  34 |     await page.getByRole('button', { name: 'Продолжить' }).click()
  35 | 
  36 |     // Шаг 4 — Комфорт
  37 |     await expect(page.getByText('Комфорт')).toBeVisible()
  38 |     await page.getByText('Как пойдёт').click()
  39 |     await page.getByRole('button', { name: 'Нет' }).first().click() // with_kid = false
  40 |     await page.getByRole('button', { name: 'Продолжить' }).click()
  41 | 
  42 |     // Шаг 5 — Здоровье
  43 |     await expect(page.getByText('Здоровье')).toBeVisible()
> 44 |     await page.getByText('Ничего из перечисленного').click()
     |                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  45 |     await page.getByRole('button', { name: 'Нет' }).first().click() // tan = false
  46 |     await page.getByRole('button', { name: 'Продолжить' }).click()
  47 | 
  48 |     // Шаг 6 — Итог
  49 |     await expect(page.getByText('Почти готово')).toBeVisible()
  50 |     await page.getByText('Instagram').click()
  51 |     await page.locator('button').filter({ hasText: 'Я ознакомлена' }).click()
  52 |     await page.getByRole('button', { name: 'Отправить' }).click()
  53 | 
  54 |     // Финальный экран
  55 |     await expect(page.getByText('Всё записали')).toBeVisible()
  56 |   })
  57 | 
  58 |   test('кнопка «Далее» неактивна на шаге 1 без заполнения имени', async ({ page }) => {
  59 |     await page.getByRole('button', { name: 'Начнём' }).click()
  60 |     await expect(page.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  61 |   })
  62 | 
  63 |   test('показывает ошибку при невалидном телефоне', async ({ page }) => {
  64 |     await page.getByRole('button', { name: 'Начнём' }).click()
  65 |     await page.getByPlaceholder('Например, Рита').fill('Тест')
  66 |     await page.getByRole('button', { name: 'На «ты»' }).click()
  67 |     await page.getByPlaceholder('+7 (___) ___-__-__').fill('+7999')
  68 | 
  69 |     await expect(page.getByText('Введи полный номер телефона')).toBeVisible()
  70 |     await expect(page.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  71 |   })
  72 | 
  73 |   test('name и phone подставляются из query-параметров', async ({ page }) => {
  74 |     await page.goto('/welcome?name=Аня&phone=79991234567')
  75 |     await expect(page.getByText('Аня,')).toBeVisible()
  76 | 
  77 |     await page.getByRole('button', { name: 'Начнём' }).click()
  78 |     await expect(page.getByPlaceholder('Например, Рита')).toHaveValue('Аня')
  79 |   })
  80 | })
  81 | 
```