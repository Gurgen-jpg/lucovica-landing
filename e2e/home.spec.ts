import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Страницы услуг появятся в изменении service-pages; до этого проверяем только href
const SERVICE_PAGES = ['/laser-epil', '/sugaring', '/electro-epil', '/complex', '/cert']

test.describe('главная', () => {
  test('секции в порядке спеки, один h1', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Лазерная эпиляция и шугаринг')
    const ids = await page.$$eval('main > section[id]', (els) => els.map((e) => e.id))
    expect(ids).toEqual(['services', 'prices', 'masters', 'reviews', 'faq', 'contacts'])
    await expect(page.locator('.site-promo')).toHaveText('Первый визит — подмышки бесплатно')
  })

  test('без нарушений доступности (axe)', async ({ page }) => {
    await page.goto('/')
    const { violations } = await new AxeBuilder({ page }).analyze()
    expect(violations.map((v) => `${v.id}: ${v.help} — ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })

  test('фото Hero загружается приоритетно', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.home-hero img')).toHaveAttribute('fetchpriority', 'high')
  })

  test('четыре показателя «Студия в цифрах»', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.home-numbers__value')).toHaveText(['12+', '2 000+', '10 000+', '5'])
  })

  test('карточки услуг ведут на страницы, «от N ₽» из данных', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.home-services__card')
    await expect(cards).toHaveCount(5)
    for (const [i, href] of SERVICE_PAGES.entries()) await expect(cards.nth(i)).toHaveAttribute('href', href)
    await expect(page.locator('.home-services__from')).toHaveText(['от 1 490 ₽', 'от 300 ₽', 'от 600 ₽', 'от 3 690 ₽', 'от 500 ₽'])
  })

  test('цены: во вкладке «Лазер» 29 строк, стрелки переключают вкладки', async ({ page }) => {
    await page.goto('/')
    const laser = page.getByRole('tab', { name: 'Лазер' })
    await expect(page.locator('#prices-panel-laser .price-list__row')).toHaveCount(29)
    await laser.focus()
    await page.keyboard.press('ArrowLeft')
    const electro = page.getByRole('tab', { name: 'Электро' })
    await expect(electro).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#prices-panel-electro')).toBeVisible()
    await expect(page.locator('#prices-panel-electro [data-booking]')).toHaveAttribute('data-service', 'Электроэпиляция')
  })

  test('/#pricing прокручивает к ценам', async ({ page }) => {
    await page.goto('/#pricing')
    await expect(page.locator('#prices h2')).toBeInViewport()
  })

  test('отзывы листаются по кругу, ссылка на Яндекс Карты в новой вкладке', async ({ page }) => {
    await page.goto('/')
    const status = page.locator('#reviews .ds-carousel__status')
    await expect(status).toHaveText('01 / 06')
    await page.getByRole('button', { name: 'Предыдущий отзыв' }).click()
    await expect(status).toHaveText('06 / 06')
    await page.getByRole('button', { name: 'Следующий отзыв' }).click()
    await expect(status).toHaveText('01 / 06')
    const all = page.getByRole('link', { name: 'Все отзывы на Яндекс Картах' })
    await expect(all).toHaveAttribute('target', '_blank')
    await expect(all).toHaveAttribute('href', /yandex\.ru\/maps\/org\/.+\/reviews\//)
  })

  test('FAQ: первый открыт, вопросы совпадают с JSON-LD', async ({ page }) => {
    await page.goto('/')
    const triggers = page.locator('#faq .ds-accordion__trigger')
    await expect(triggers.first()).toHaveAttribute('aria-expanded', 'true')
    const questions = await triggers.allTextContents()
    const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent!)))
    const faqPage = ld.find((d) => d['@type'] === 'FAQPage')
    expect(faqPage.mainEntity.map((q: { name: string }) => q.name)).toEqual(questions.map((q) => q.trim()))
    expect(ld.some((d) => d['@type'] === 'BeautySalon')).toBe(true)
  })

  test('контакты: телефон с целью click_phone, Telegram, маршрут', async ({ page }) => {
    await page.goto('/')
    const contacts = page.locator('#contacts')
    await expect(contacts.locator('a[href^="tel:"][data-goal="click_phone"]').first()).toBeVisible()
    await expect(contacts.locator('a[href^="https://t.me/"][data-goal="click_telegram"]').first()).toBeVisible()
    await expect(contacts.getByRole('link', { name: 'Построить маршрут' })).toHaveAttribute('href', /yandex\.ru\/maps/)
  })

  test('без JS видны все вкладки цен и все отзывы', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const page = await ctx.newPage()
    await page.goto('/')
    await expect(page.locator('#prices [role="tabpanel"]:visible')).toHaveCount(4)
    await expect(page.locator('#reviews .ds-carousel__slide:visible')).toHaveCount(6)
    await expect(page.locator('#faq .ds-accordion__panel:visible')).toHaveCount(8)
    await ctx.close()
  })

  test('нет горизонтальной прокрутки на 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  })
})

test.describe('каркас', () => {
  test('«Цены» в хедере ведут на секцию цен главной', async ({ page, isMobile }) => {
    test.skip(isMobile, 'на телефоне навигация в меню — отдельный тест')
    await page.goto('/privacy')
    await page.goto('/')
    await page.locator('.site-header__nav').getByRole('link', { name: 'Цены' }).click()
    await expect(page).toHaveURL(/\/#prices$/)
    await expect(page.locator('#prices h2')).toBeInViewport()
  })

  test('телефон в хедере — цель header_phone_click', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.site-header a[href^="tel:"]').first()).toHaveAttribute('data-goal', 'header_phone_click')
  })

  test('мобильное меню: открывается, Escape закрывает, ссылка закрывает', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: 'Открыть меню' })
    const menu = page.locator('#site-menu')
    await menuButton.click()
    await expect(menu).toBeVisible()
    for (const name of ['Услуги', 'Цены', 'Мастера', 'Вопросы']) await expect(menu.getByRole('link', { name })).toBeVisible()
    await expect(menu.locator('a[href^="tel:"]')).toBeVisible()
    const { violations } = await new AxeBuilder({ page }).include('#site-menu').analyze()
    expect(violations.map((v) => v.id)).toEqual([])
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()

    await menuButton.click()
    await menu.getByRole('link', { name: 'Мастера' }).click()
    await expect(menu).toBeHidden()
    await expect(page).toHaveURL(/#masters$/)
  })

  test('футер: ссылки на услуги, политику, год', async ({ page, request }) => {
    await page.goto('/')
    const footer = page.locator('.site-footer')
    const hrefs = await footer.locator('a[href^="/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')!))
    expect(hrefs).toEqual([...SERVICE_PAGES, '/privacy'])
    expect((await request.get('/privacy')).status()).toBe(200)
    await expect(footer).toContainText(`© 2014 — ${new Date().getFullYear()} · Студия эпиляции LUCOVICA`)
    await expect(footer.locator('a[href="/offer"]')).toHaveCount(0)
  })

  test('плавающие кнопки: после 500px, кнопка записи скрыта у контактов', async ({ page }) => {
    await page.goto('/')
    const floating = page.locator('[data-floating]')
    await expect(floating).toBeHidden()
    await page.evaluate(() => window.scrollTo(0, 500))
    await expect(floating).toBeVisible()
    const cta = floating.locator('[data-goal="floating_cta_click"]')
    await expect(cta).toBeVisible()
    await expect(floating.getByRole('link', { name: 'Написать в Telegram' })).toHaveAttribute('rel', /noopener/)
    await expect(floating.getByRole('link', { name: 'Написать в MAX' })).toHaveCount(0)
    await page.locator('#contacts').scrollIntoViewIfNeeded()
    await expect(cta).toBeHidden()
  })
})

test.describe('политика конфиденциальности', () => {
  test('12 разделов, дата, noindex, нет в sitemap', async ({ page, request }) => {
    await page.goto('/privacy')
    await expect(page.locator('h1')).toHaveText('Политика конфиденциальности')
    await expect(page.locator('.privacy__section h2')).toHaveCount(12)
    await expect(page.getByText(/Последнее обновление: \d+ \S+ \d{4} г\./)).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    await expect(page.getByRole('link', { name: '← На главную' })).toHaveAttribute('href', '/')
    expect(await (await request.get('/sitemap.xml')).text()).not.toContain('/privacy')
    const { violations } = await new AxeBuilder({ page }).analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })
})
