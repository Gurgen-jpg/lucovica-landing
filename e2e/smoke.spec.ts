import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('главная открывается: один h1, title, canonical', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page).toHaveTitle('LUCOVICA — студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lucovica.ru/')
})

test('главная без нарушений доступности (axe)', async ({ page }) => {
  await page.goto('/')
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
})

test('несуществующая страница — 404 со ссылкой на главную', async ({ page }) => {
  const res = await page.goto('/no-such-page')
  expect(res?.status()).toBe(404)
  await expect(page.locator('a[href="/"]')).toBeVisible()
})

test('иконки и og:image доступны', async ({ page, request }) => {
  await page.goto('/')
  const hrefs = await page.$$eval('link[rel~="icon"], link[rel="apple-touch-icon"]', (els) =>
    els.map((e) => e.getAttribute('href')!),
  )
  const og = await page.locator('meta[property="og:image"]').getAttribute('content')
  for (const href of [...hrefs, new URL(og!).pathname]) {
    const r = await request.get(href)
    expect(r.status(), href).toBe(200)
    expect(r.headers()['content-type'], href).toMatch(/^image\//)
  }
})

test('нет горизонтальной прокрутки на 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
})
