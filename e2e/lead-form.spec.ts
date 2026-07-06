import { test, expect } from '@playwright/test'

test.describe('LeadForm — запись на процедуру', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/lead', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    )
    await page.goto('/')
  })

  const openForm = (page: Parameters<Parameters<typeof test>[1]>[0]) =>
    page.getByRole('button', { name: 'Записаться онлайн' }).first().click({ force: true })

  test('открывается по кнопке «Записаться онлайн»', async ({ page }) => {
    await openForm(page)
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Выберите услугу')).toBeVisible()
  })

  test('полный флоу: услуга → время → контакты → успех', async ({ page }) => {
    await openForm(page)
    const dialog = page.getByRole('dialog')

    // Шаг 1 — выбор услуги
    await dialog.getByRole('button', { name: 'Шугаринг — Девушки' }).click()
    await dialog.getByRole('button', { name: 'Далее →' }).click()

    // Шаг 2 — время
    await dialog.getByRole('button', { name: /Утро/ }).click()
    await dialog.getByRole('button', { name: 'Далее →' }).click()

    // Шаг 3 — контакты
    await dialog.getByPlaceholder('Ваше имя').fill('Тест')
    await dialog.getByPlaceholder('+7 (___) ___-__-__').fill('+79991234567')
    await dialog.getByRole('button', { name: 'Записаться' }).click()

    await expect(dialog.getByText('Заявка принята!')).toBeVisible()
  })

  test('кнопка «Далее» неактивна без выбора услуги', async ({ page }) => {
    await openForm(page)
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('button', { name: 'Далее →' })).toBeDisabled()
  })

  test('показывает ошибку при пустом имени или телефоне', async ({ page }) => {
    await openForm(page)
    const dialog = page.getByRole('dialog')

    await dialog.getByRole('button', { name: 'Шугаринг — Девушки' }).click()
    await dialog.getByRole('button', { name: 'Далее →' }).click()
    await dialog.getByRole('button', { name: /Утро/ }).click()
    await dialog.getByRole('button', { name: 'Далее →' }).click()

    await dialog.getByRole('button', { name: 'Записаться' }).click()
    await expect(dialog.getByText('Пожалуйста, заполните имя и телефон')).toBeVisible()
  })

  test('закрывается по кнопке ✕', async ({ page }) => {
    await openForm(page)
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Закрыть' }).click()
    await expect(dialog).not.toBeVisible()
  })

  test('закрывается по клавише Escape', async ({ page }) => {
    await openForm(page)
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('флоу подарочного сертификата — 2 шага вместо 3', async ({ page }) => {
    await openForm(page)
    const dialog = page.getByRole('dialog')

    await dialog.getByRole('button', { name: 'Подарочный сертификат' }).click()
    await dialog.getByRole('button', { name: 'Далее →' }).click()

    await expect(dialog.getByText('Ваши контакты')).toBeVisible()

    await dialog.getByPlaceholder('Ваше имя').fill('Тест')
    await dialog.getByPlaceholder('+7 (___) ___-__-__').fill('+79991234567')
    await dialog.getByRole('button', { name: 'Оформить', exact: true }).click()

    await expect(dialog.getByText('Заявка на сертификат принята!')).toBeVisible()
  })
})
