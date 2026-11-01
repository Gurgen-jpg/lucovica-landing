import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

type Lead = Record<string, string>

/** Подменяет /api/lead; возвращает список отправленных тел запросов. */
async function mockLead(page: Page, opts: { status?: number; delay?: number } = {}): Promise<Lead[]> {
  const sent: Lead[] = []
  await page.route('**/api/lead', async (route) => {
    sent.push(JSON.parse(route.request().postData() ?? '{}'))
    if (opts.delay) await new Promise((r) => setTimeout(r, opts.delay))
    const ok = (opts.status ?? 200) === 200
    await route.fulfill({
      status: opts.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(ok ? { ok: true } : { ok: false, error: 'Не удалось отправить заявку.' }),
    })
  })
  return sent
}

/** Счётчик целей Метрики: подменяем ym до загрузки страницы. */
async function trackGoals(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __YM_ID: number; ym: (...a: unknown[]) => void; __goals: string[] }
    w.__goals = []
    w.__YM_ID = 1
    w.ym = (_id, method, goal) => {
      if (method === 'reachGoal') w.__goals.push(String(goal))
    }
  })
}
const goals = (page: Page) => page.evaluate(() => (window as unknown as { __goals: string[] }).__goals)

const dialog = (page: Page) => page.locator('#booking')

test.describe('диалог записи', () => {
  test('из Hero: фокус на имени, услуга не выбрана, успешная отправка и цель form_submit', async ({ page }) => {
    await trackGoals(page)
    const sent = await mockLead(page)
    await page.goto('/')
    await page.locator('.home-hero').getByRole('link', { name: 'Записаться онлайн' }).click()
    await expect(dialog(page)).toBeVisible()
    await expect(page.locator('#booking-form-name')).toBeFocused()
    await expect(page.locator('#booking-form-service')).toHaveValue('')
    await expect(dialog(page).getByRole('radio', { name: 'Звонок' })).toBeChecked()

    await page.fill('#booking-form-name', 'Анна')
    await page.locator('#booking-form-phone').pressSequentially('89770169775')
    await expect(page.locator('#booking-form-phone')).toHaveValue('+7 (977) 016-97-75')
    await dialog(page).getByRole('radio', { name: 'Вечер (17–21)' }).check()
    await dialog(page).getByRole('button', { name: 'Отправить заявку' }).click()

    await expect(dialog(page).getByText('Заявка принята!')).toBeVisible()
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({
      name: 'Анна',
      phone: '+7 (977) 016-97-75',
      service: '',
      time: 'Вечер (17–21)',
      contact_method: 'Звонок',
      promo: '',
      _hp: '',
    })
    expect((await goals(page)).filter((g) => g === 'form_submit')).toHaveLength(1)
  })

  test('кнопка вкладки «Электро» предвыбирает услугу', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('tab', { name: 'Электро' }).click()
    await page.locator('#prices-panel-electro').getByRole('link', { name: 'Записаться на процедуру' }).click()
    await expect(page.locator('#booking-form-service')).toHaveValue('Электроэпиляция')
  })

  test('имя сохраняется между открытиями, услуга — от новой кнопки; Escape возвращает фокус', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('.home-hero').getByRole('link', { name: 'Записаться онлайн' })
    await hero.focus()
    await page.keyboard.press('Enter')
    await page.fill('#booking-form-name', 'Мария')
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
    await expect(hero).toBeFocused()

    await page.getByRole('tab', { name: 'Шугаринг' }).click()
    await page.locator('#prices-panel-sugaring').getByRole('link', { name: 'Записаться на процедуру' }).click()
    await expect(page.locator('#booking-form-name')).toHaveValue('Мария')
    await expect(page.locator('#booking-form-service')).toHaveValue('Шугаринг — Девушки')
  })

  test('короткий телефон — без запроса, ошибка и фокус на телефоне', async ({ page }) => {
    const sent = await mockLead(page)
    await page.goto('/')
    await page.locator('.home-hero').getByRole('link', { name: 'Записаться онлайн' }).click()
    await page.fill('#booking-form-name', 'Анна')
    await page.locator('#booking-form-phone').pressSequentially('7977016')
    await dialog(page).getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(page.locator('#booking-form-phone')).toBeFocused()
    await expect(page.locator('#booking-form-phone-error')).toHaveText('Введите номер полностью')
    await expect(page.locator('#booking-form-phone')).toHaveAttribute('aria-invalid', 'true')
    expect(sent).toHaveLength(0)
  })

  test('режим сертификата: без времени и акции, свой заголовок и кнопка', async ({ page }) => {
    const sent = await mockLead(page)
    await page.goto('/')
    await page.locator('.home-hero').getByRole('link', { name: 'Записаться онлайн' }).click()
    await page.selectOption('#booking-form-service', 'Подарочный сертификат')
    await expect(dialog(page).getByRole('heading', { name: 'Оформление сертификата' })).toBeVisible()
    await expect(dialog(page).getByText('Удобное время')).toBeHidden()
    await expect(dialog(page).getByText(/Хочу акцию/)).toBeHidden()
    await page.fill('#booking-form-name', 'Ольга')
    await page.fill('#booking-form-phone', '9770169775')
    await dialog(page).getByRole('button', { name: 'Оформить' }).click()
    await expect(dialog(page).getByText('Заявка на сертификат принята!')).toBeVisible()
    expect(sent[0]).toMatchObject({ service: 'Подарочный сертификат', time: 'Подарочный сертификат', promo: '' })
  })

  test('уточнение услуги передаётся и сбрасывается при смене услуги', async ({ page }) => {
    const sent = await mockLead(page)
    await page.goto('/')
    await page.evaluate(() => {
      const a = document.createElement('a')
      a.href = '/#contacts'
      a.id = 'zone'
      a.textContent = 'Подмышки'
      a.dataset.booking = ''
      a.dataset.service = 'Лазерная эпиляция — Девушки'
      a.dataset.detail = 'Подмышки'
      document.querySelector('main')!.prepend(a)
    })
    await page.click('#zone')
    await expect(dialog(page).getByText('Зона: Подмышки')).toBeVisible()
    await page.fill('#booking-form-name', 'Анна')
    await page.fill('#booking-form-phone', '+79770169775')
    await dialog(page).getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(dialog(page).getByText('Заявка принята!')).toBeVisible()
    expect(sent[0]!.service).toBe('Лазерная эпиляция — Девушки — Подмышки')

    await page.keyboard.press('Escape')
    await page.click('#zone')
    await page.selectOption('#booking-form-service', 'Шугаринг — Девушки')
    await expect(dialog(page).getByText('Зона: Подмышки')).toBeHidden()
  })

  test('ошибка сервера сохраняет данные и показывает телефон', async ({ page }) => {
    await mockLead(page, { status: 500 })
    await page.goto('/')
    await page.locator('.home-hero').getByRole('link', { name: 'Записаться онлайн' }).click()
    await page.fill('#booking-form-name', 'Анна')
    await page.fill('#booking-form-phone', '89770169775')
    const submit = dialog(page).getByRole('button', { name: 'Отправить заявку' })
    await submit.click()
    await expect(dialog(page).getByRole('alert')).toHaveText(
      'Не удалось отправить заявку. Попробуйте ещё раз или позвоните: +7 977 016-97-75',
    )
    await expect(page.locator('#booking-form-name')).toHaveValue('Анна')
    await expect(submit).toBeEnabled()
  })

  test('двойной клик — один запрос, кнопка «Отправка…» неактивна', async ({ page }) => {
    const sent = await mockLead(page, { delay: 400 })
    await page.goto('/')
    await page.locator('.home-hero').getByRole('link', { name: 'Записаться онлайн' }).click()
    await page.fill('#booking-form-name', 'Анна')
    await page.fill('#booking-form-phone', '89770169775')
    const submit = dialog(page).locator('button[type="submit"]')
    await submit.dblclick()
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveText(/^отправка…$/i, { useInnerText: true })
    await expect(dialog(page).getByText('Заявка принята!')).toBeVisible()
    expect(sent).toHaveLength(1)
  })

  test('диалог без нарушений доступности', async ({ page }) => {
    await page.goto('/')
    await page.locator('.home-hero').getByRole('link', { name: 'Записаться онлайн' }).click()
    const { violations } = await new AxeBuilder({ page }).include('#booking').analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })
})

test.describe('форма в «Контактах»', () => {
  test('отправка из встроенной формы с UTM из адреса входа', async ({ page }) => {
    const sent = await mockLead(page)
    await page.goto('/?utm_source=yandex&utm_campaign=laser')
    await page.goto('/')
    const form = page.locator('#contact-form')
    await form.scrollIntoViewIfNeeded()
    await page.fill('#contact-form-name', 'Анна')
    await page.fill('#contact-form-phone', '89770169775')
    const messenger = form.getByLabel('Ник или номер в мессенджере')
    await expect(messenger).toBeHidden()
    await form.getByRole('radio', { name: 'Telegram' }).check({ force: true })
    await expect(messenger).toBeVisible()
    await messenger.fill('@anna_lv')
    await form.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(form.getByText('Заявка принята!')).toBeVisible()
    expect(sent[0]).toMatchObject({ contact_method: 'Telegram', messenger: '@anna_lv', utm_source: 'yandex', utm_campaign: 'laser' })
  })

  test('без нарушений доступности на тёмном фоне', async ({ page }) => {
    await page.goto('/')
    const { violations } = await new AxeBuilder({ page }).include('#contacts').analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })
})

test('без JS: форма в «Контактах» отправляется POST и показывает «Заявка принята!»', async ({ browser }) => {
  // Настоящий /api/lead; уведомления в e2e не отправляются (NOTIFY_DRY_RUN=1)
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/')
  await page.fill('#contact-form-name', 'Анна')
  await page.fill('#contact-form-phone', '89770169775')
  await page.locator('#contact-form').getByRole('button', { name: 'Отправить заявку' }).click()
  await expect(page).toHaveURL(/\/api\/lead$/)
  await expect(page.getByText('Заявка принята!')).toBeVisible()
  await expect(page.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
  await ctx.close()
})
