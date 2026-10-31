// Витрина /ds собирается в e2e благодаря DS_SHOWCASE=1 (playwright.config.ts).
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/ds')
})

test('витрина без нарушений доступности, включая контраст', async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations.map((v) => `${v.id}: ${v.help} — ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
})

test('шрифты только с собственного домена', async ({ page }) => {
  const external: string[] = []
  page.on('request', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) external.push(r.url())
  })
  await page.reload()
  await page.evaluate(() => document.fonts.ready)
  expect(external).toEqual([])
  expect(await page.evaluate(() => document.fonts.check('300 16px Jost', 'Привет'))).toBe(true)
})

test('нет горизонтальной прокрутки на 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.reload()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
})

test('кнопки, поля и фото — без скруглений', async ({ page }) => {
  const radii = await page.$$eval('.ds-button, .ds-field__input, .ds-photo, .ds-chip, .ds-badge', (els) =>
    els.map((el) => getComputedStyle(el).borderRadius),
  )
  expect(radii.length).toBeGreaterThan(5)
  expect(new Set(radii)).toEqual(new Set(['0px']))
})

test('фото монохромные и заполняют контейнер', async ({ page }) => {
  const img = page.locator('.ds-photo img').first()
  await expect(img).toHaveCSS('filter', 'grayscale(1)')
  await expect(img).toHaveCSS('object-fit', 'cover')
})

test('отключённая кнопка не реагирует', async ({ page }) => {
  await expect(page.locator('#ds-disabled-button')).toBeDisabled()
})

test.describe('dialog', () => {
  test('Enter открывает с фокусом на первом поле, Escape возвращает фокус на кнопку', async ({ page }) => {
    const opener = page.locator('#ds-open-dialog')
    await opener.focus()
    await page.keyboard.press('Enter')
    const dlg = page.locator('#ds-booking')
    await expect(dlg).toBeVisible()
    await expect(page.locator('#ds-dialog-name')).toBeFocused()
    await expect(page.locator('html')).toHaveClass(/ds-scroll-lock/)

    await page.keyboard.press('Escape')
    await expect(dlg).toBeHidden()
    await expect(opener).toBeFocused()
    await expect(page.locator('html')).not.toHaveClass(/ds-scroll-lock/)
  })

  test('Tab на последнем элементе переходит на первый элемент диалога', async ({ page }) => {
    await page.locator('#ds-open-dialog').click()
    const submit = page.locator('#ds-booking button[type="submit"]')
    await submit.focus()
    await page.keyboard.press('Tab')
    await expect(page.locator('#ds-booking [data-dialog-close]')).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(submit).toBeFocused()
  })

  test('закрывается кнопкой «Закрыть» и кликом по подложке', async ({ page }) => {
    const dlg = page.locator('#ds-booking')
    await page.locator('#ds-open-dialog').click()
    await page.getByRole('button', { name: 'Закрыть' }).click()
    await expect(dlg).toBeHidden()

    await page.locator('#ds-open-dialog').click()
    await expect(dlg).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dlg).toBeHidden()
  })

  test('при reduced-motion открывается без перехода', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('#ds-open-dialog').click()
    const duration = await page.locator('#ds-booking').evaluate((el) => getComputedStyle(el).transitionDuration)
    expect(duration.split(',').every((d) => parseFloat(d) <= 0.001)).toBe(true)
  })
})

test.describe('accordion', () => {
  test('открыт не более одного пункта, повторный клик закрывает', async ({ page }) => {
    const triggers = page.locator('#ds-faq .ds-accordion__trigger')
    await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true')
    await triggers.nth(2).click()
    await expect(triggers.nth(2)).toHaveAttribute('aria-expanded', 'true')
    await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#ds-faq-list-a1')).toBeHidden()
    await expect(page.locator('#ds-faq-list-a3')).toBeVisible()

    await triggers.nth(2).click()
    await expect(triggers.nth(2)).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#ds-faq .ds-accordion__panel:visible')).toHaveCount(0)
  })
})

test.describe('tabs', () => {
  test('стрелки, Home/End переключают вкладку и панель', async ({ page }) => {
    const laser = page.getByRole('tab', { name: 'Лазер' })
    const sugar = page.getByRole('tab', { name: 'Шугаринг' })
    const complex = page.getByRole('tab', { name: 'Комплексы' })
    await laser.focus()
    await page.keyboard.press('ArrowRight')
    await expect(sugar).toBeFocused()
    await expect(sugar).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#ds-prices-panel-sugaring')).toBeVisible()
    await expect(page.locator('#ds-prices-panel-laser')).toBeHidden()

    await page.keyboard.press('End')
    await expect(complex).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('ArrowRight')
    await expect(laser).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('ArrowLeft')
    await expect(complex).toBeFocused()
  })
})

test.describe('carousel', () => {
  test('зацикливается в обе стороны и обновляет индикатор', async ({ page }) => {
    const status = page.locator('#ds-carousel .ds-carousel__status')
    const next = page.getByRole('button', { name: 'Следующий отзыв' })
    const prev = page.getByRole('button', { name: 'Предыдущий отзыв' })
    await expect(status).toHaveText('01 / 03')
    await prev.click()
    await expect(status).toHaveText('03 / 03')
    await expect(page.locator('#ds-carousel .ds-carousel__slide:visible')).toHaveAttribute('aria-label', '3 из 3')
    await next.click()
    await expect(status).toHaveText('01 / 03')
    await expect(status).toHaveAttribute('aria-live', 'polite')
  })
})

test.describe('поля формы', () => {
  test('пустое «Имя» — ошибка объявлена, фокус на поле', async ({ page }) => {
    const form = page.locator('#ds-form form')
    await form.getByRole('button', { name: 'Отправить заявку' }).click()
    const name = page.locator('#ds-inline-name')
    await expect(name).toBeFocused()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#ds-inline-name-error')).toHaveText('Как к вам обращаться?')
    await expect(name).toHaveAccessibleDescription('Как к вам обращаться?')

    await name.fill('Анна')
    await expect(name).not.toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#ds-inline-name-error')).toBeHidden()
  })

  test('валидная форма — уведомление без перехвата фокуса, закрывается само', async ({ page }) => {
    await page.clock.install()
    await page.reload()
    await page.fill('#ds-inline-name', 'Анна')
    await page.fill('#ds-inline-phone', '+7 977 016-97-75')
    await page.selectOption('#ds-inline-service', 'laser')
    const submit = page.locator('#ds-form form').getByRole('button', { name: 'Отправить заявку' })
    // С клавиатуры: WebKit не переводит фокус на кнопку при клике
    await submit.focus()
    await page.keyboard.press('Enter')
    const toast = page.locator('.ds-toast-region[role="status"] .ds-toast')
    await expect(toast).toContainText('Заявка принята')
    await expect(submit).toBeFocused()
    await page.clock.runFor(5100)
    await expect(toast).toHaveCount(0)
  })

  test('чип меняет aria-pressed и значение скрытого поля', async ({ page }) => {
    const tea = page.getByRole('button', { name: 'Травяной чай' })
    await expect(tea).toHaveAttribute('aria-pressed', 'false')
    await tea.click()
    await expect(tea).toHaveAttribute('aria-pressed', 'true')
    await expect(tea).toHaveCSS('background-color', 'rgb(20, 20, 22)')
    await expect(page.locator('input[name="offer"]')).toHaveValue('coffee,tea,quiet')
  })
})

test.describe('tooltip', () => {
  test('показывается при фокусе с клавиатуры и скрывается по Escape', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Об оборудовании' })
    const tip = page.getByRole('tooltip')
    await expect(trigger).toHaveAccessibleDescription('Диодный лазер с охлаждением')
    await trigger.focus()
    await expect(tip).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(tip).toBeHidden()
  })
})

test('без JS видны все ответы FAQ, все панели цен и все отзывы', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/ds')
  await expect(page.locator('#ds-faq .ds-accordion__panel:visible')).toHaveCount(3)
  await expect(page.locator('#ds-tabs [role="tabpanel"]:visible')).toHaveCount(3)
  await expect(page.locator('#ds-carousel .ds-carousel__slide:visible')).toHaveCount(3)
  await ctx.close()
})
