import { test, expect } from '@playwright/test'

test.describe('/price — прайс для Telegram', () => {
  test('без шапки сайта, noindex, вкладка «Девушкам» по умолчанию', async ({ page }) => {
    await page.goto('/price')
    await expect(page.getByRole('heading', { level: 1, name: 'Прайс-лист' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Отзывы' })).toHaveCount(0)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    await expect(page.getByRole('tab', { name: 'Девушкам' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#panel-women')).toBeVisible()
    await expect(page.locator('#panel-men')).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Электроэпиляция' })).toBeVisible()
  })

  test('переключение на «Мужчинам» пишет #men', async ({ page }) => {
    await page.goto('/price')
    await page.getByRole('tab', { name: 'Мужчинам' }).click()
    await expect(page.locator('#panel-men')).toBeVisible()
    await expect(page.locator('#panel-women')).toBeHidden()
    await expect(page).toHaveURL(/\/price#men$/)
  })

  test('стрелки переключают вкладки', async ({ page }) => {
    await page.goto('/price')
    await page.getByRole('tab', { name: 'Девушкам' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: 'Мужчинам' })).toBeFocused()
    await expect(page.locator('#panel-men')).toBeVisible()
  })

  test('/price#men сразу открывает мужской прайс', async ({ page }) => {
    await page.goto('/price#men')
    await expect(page.getByRole('tab', { name: 'Мужчинам' })).toHaveAttribute('aria-selected', 'true')
  })

  test('«Записаться» под шугарингом открывает форму с услугой', async ({ page }) => {
    await page.goto('/price')
    await page.locator('#panel-women section', { hasText: 'Шугаринг' }).getByRole('button', { name: 'Записаться' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    // Услуга предвыбрана — шаг выбора пропущен, она видна в сводке на шаге контактов
    await expect(dialog.getByText('Выберите услугу')).toHaveCount(0)
    await dialog.getByRole('button', { name: /Утро/ }).click()
    await dialog.getByRole('button', { name: 'Далее →' }).click()
    await expect(dialog.getByText('Шугаринг — Девушки')).toBeVisible()
  })

  test('закреплённая кнопка открывает выбор услуги', async ({ page }) => {
    await page.goto('/price')
    await page.getByRole('button', { name: 'Записаться' }).last().click()
    await expect(page.getByRole('dialog').getByText('Выберите услугу')).toBeVisible()
  })

  test('ссылки на Яндекс Карты и сайт', async ({ page }) => {
    await page.goto('/price')
    const map = page.getByRole('link', { name: 'Открыть в Яндекс Картах' })
    await expect(map).toHaveAttribute('href', /yandex\.ru\/maps\/org\/lucovica/)
    await expect(map).toHaveAttribute('target', '_blank')
    await page.getByRole('link', { name: 'Перейти на сайт' }).click()
    await expect(page).toHaveURL(/\/$/)
  })
})
