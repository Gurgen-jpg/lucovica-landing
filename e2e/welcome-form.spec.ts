import { test, expect } from '@playwright/test'

test.describe('WelcomeForm — анкета нового клиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/welcome', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    )
    await page.goto('/welcome')
  })

  test('стартовый экран открывается', async ({ page }) => {
    await expect(page.getByText('Привет, наша звёздочка')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Начнём' })).toBeVisible()
  })

  test('полный флоу — 6 шагов до «Всё записали»', async ({ page }) => {
    await page.getByRole('button', { name: 'Начнём' }).click()

    // Шаг 1 — Знакомство
    await expect(page.getByText('Знакомство')).toBeVisible()
    await page.getByPlaceholder('Например, Рита').fill('Тест')
    await page.getByRole('button', { name: 'На «ты»' }).click()
    await page.getByPlaceholder('+7 (___) ___-__-__').fill('+79991234567')
    await page.getByRole('button', { name: 'Продолжить' }).click()

    // Шаг 2 — Напиток
    await expect(page.getByText('Что приготовить?')).toBeVisible()
    await page.getByRole('button', { name: /Чай чёрный/ }).click()
    await page.getByRole('button', { name: 'Продолжить' }).click()

    // Шаг 3 — Транспорт
    await expect(page.getByText('Как доберёшься?')).toBeVisible()
    await page.getByRole('button', { name: 'Без машины' }).click()
    await page.getByRole('button', { name: 'Продолжить' }).click()

    // Шаг 4 — Комфорт
    await expect(page.getByText('Комфорт')).toBeVisible()
    await page.getByText('Как пойдёт').click()
    await page.getByRole('button', { name: 'Нет' }).first().click() // with_kid = false
    await page.getByRole('button', { name: 'Продолжить' }).click()

    // Шаг 5 — Здоровье
    await expect(page.getByText('Здоровье')).toBeVisible()
    await page.getByText('Ничего из перечисленного').click()
    await page.getByRole('button', { name: 'Нет' }).first().click() // tan = false
    await page.getByRole('button', { name: 'Продолжить' }).click()

    // Шаг 6 — Итог
    await expect(page.getByText('Почти готово')).toBeVisible()
    await page.getByText('Instagram').click()
    await page.locator('button').filter({ hasText: 'Я ознакомлена' }).click()
    await page.getByRole('button', { name: 'Отправить' }).click()

    // Финальный экран
    await expect(page.getByText('Всё записали')).toBeVisible()
  })

  test('кнопка «Далее» неактивна на шаге 1 без заполнения имени', async ({ page }) => {
    await page.getByRole('button', { name: 'Начнём' }).click()
    await expect(page.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  })

  test('показывает ошибку при невалидном телефоне', async ({ page }) => {
    await page.getByRole('button', { name: 'Начнём' }).click()
    await page.getByPlaceholder('Например, Рита').fill('Тест')
    await page.getByRole('button', { name: 'На «ты»' }).click()
    await page.getByPlaceholder('+7 (___) ___-__-__').fill('+7999')

    await expect(page.getByText('Введи полный номер телефона')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  })

  test('name и phone подставляются из query-параметров', async ({ page }) => {
    await page.goto('/welcome?name=Аня&phone=79991234567')
    await expect(page.getByText('Аня,')).toBeVisible()

    await page.getByRole('button', { name: 'Начнём' }).click()
    await expect(page.getByPlaceholder('Например, Рита')).toHaveValue('Аня')
  })
})
