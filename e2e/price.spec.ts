import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('/price', () => {
  test('noindex, follow; заголовок и цель просмотра', async ({ page }) => {
    await page.goto('/price')
    await expect(page).toHaveTitle('Прайс-лист — студия эпиляции LUCOVICA')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
    await expect(page.locator('body')).toHaveAttribute('data-page-goal', 'price_page_view')
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('вкладки Девушкам/Мужчинам, #men открывает мужской прайс', async ({ page }) => {
    await page.goto('/price')
    await expect(page.getByRole('tab', { name: 'Девушкам' })).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('tab', { name: 'Мужчинам' }).click()
    await expect(page).toHaveURL(/\/price#men$/)
    await page.goto('/price#men')
    await page.reload()
    await expect(page.getByRole('tab', { name: 'Мужчинам' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#price-panel-men')).toBeVisible()
  })

  test('запись из карточки открывает форму с услугой', async ({ page }) => {
    await page.goto('/price')
    await page.getByRole('link', { name: 'Записаться: Шугаринг' }).first().click()
    await expect(page.locator('#booking')).toBeVisible()
    await expect(page.locator('#booking-form-service')).toHaveValue('Шугаринг — Девушки')
    await page.keyboard.press('Escape')
    await page.locator('.price-card', { hasText: 'Электроэпиляция' }).getByRole('link', { name: /Записаться/ }).click()
    await expect(page.locator('#booking-form-service')).toHaveValue('Электроэпиляция')
  })

  test('без нарушений доступности и без горизонтальной прокрутки', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/price')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    const { violations } = await new AxeBuilder({ page }).analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })
})
