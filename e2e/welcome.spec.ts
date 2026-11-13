import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

type Body = Record<string, unknown>

/** Подменяет /api/welcome; возвращает отправленные тела. */
async function mockWelcome(page: Page, reply: { status?: number; body?: Body } = {}): Promise<Body[]> {
  const sent: Body[] = []
  await page.route('**/api/welcome', async (route) => {
    sent.push(JSON.parse(route.request().postData() ?? '{}'))
    await route.fulfill({ status: reply.status ?? 200, contentType: 'application/json', body: JSON.stringify(reply.body ?? { ok: true }) })
  })
  return sent
}

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

const current = (page: Page) => page.locator('.welcome-step:not([hidden])')
const next = (page: Page) => current(page).getByRole('button', { name: 'Далее' }).click()
const start = (page: Page) => current(page).getByRole('button', { name: 'Заполнить анкету' }).click()
// Варианты — нативные input под подписью: отмечаем через label, а не клик по тексту
const choose = (page: Page, name: string) => current(page).getByLabel(name, { exact: true }).check()
const sections = (page: Page) => page.locator('[data-steps] > li')

test.describe('/welcome', () => {
  test('полный сценарий: 6 шагов, цели, «Спасибо»', async ({ page }) => {
    await trackGoals(page)
    const sent = await mockWelcome(page)
    await page.goto('/welcome?name=Анна&phone=89770169775')
    await expect(page).toHaveTitle('Анкета гостя — LUCOVICA')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    await expect(page.locator('.site-header')).toHaveCount(0)
    await expect(page.locator('[data-counter]')).toHaveText('Анкета гостя')
    await expect(page.getByRole('heading', { name: 'Добро пожаловать в LUCOVICA' })).toBeVisible()

    await start(page)
    await expect(page.getByRole('heading', { name: 'Контактные данные' })).toBeFocused()
    await expect(page.locator('[data-counter]')).toHaveText('Шаг 1 из 6')
    await expect(page.locator('#wn-name')).toHaveValue('Анна')
    await expect(page.locator('#wn-phone')).toHaveValue('+7 (977) 016-97-75')
    await expect(page.locator('input[name="address_form"]')).toHaveCount(1)
    await expect(page.locator('input[name="address_form"]')).toBeHidden()
    await next(page)

    await expect(page.getByRole('heading', { name: 'Что подготовить к вашему приходу?' })).toBeVisible()
    await expect(page.locator('[data-counter]')).toHaveText('Шаг 2 из 6')
    await expect(current(page)).toContainText('Напиток будет ждать вас к началу визита.', { useInnerText: true })
    await choose(page, 'Капучино')
    await choose(page, 'Банановое')
    await choose(page, 'Без сахара')
    await next(page)
    await choose(page, 'На автомобиле')
    await page.fill('#wn-car-number', 'А123БВ 161')
    await next(page)
    await choose(page, 'Тишина')
    await page.locator('label[for="wn-kid-1"]').click()
    await next(page)
    await choose(page, 'Беременность')
    await page.locator('label[for="wn-tan-1"]').click()
    await next(page)
    await expect(page.locator('[data-counter]')).toHaveText('Шаг 6 из 6')
    await choose(page, 'Яндекс Карты')
    await page.locator('#wn-consent').check()
    await current(page).getByRole('button', { name: 'Отправить анкету' }).click()

    await expect(page.getByRole('heading', { name: 'Благодарим вас, Анна' })).toBeVisible()
    await expect(page.locator('[data-counter]')).toHaveText('Анкета отправлена')
    await expect(page.locator('.welcome-thanks')).toContainText('Анкета получена.', { useInnerText: true })
    await expect(page.locator('.welcome-card')).toContainText('Ростов-на-Дону', { useInnerText: true })
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({
      visit_type: 'new',
      name: 'Анна',
      phone: '+7 (977) 016-97-75',
      address_form: 'vy',
      drink: 'cappuccino',
      milk: 'banana',
      sugar: false,
      cream: null,
      car: true,
      car_number: 'А123БВ 161',
      talk_mode: 'silent',
      with_kid: false,
      contraindications: ['pregnancy'],
      tan: false,
      source: 'yandex_maps',
      privacy_consent: true,
      _hp: '',
    })
    expect(await goals(page)).toEqual(
      expect.arrayContaining(['welcome_started', 'welcome_step_2', 'welcome_step_3', 'welcome_step_4', 'welcome_step_5', 'welcome_step_6', 'welcome_submitted']),
    )
    await expect(page.getByRole('link', { name: 'Telegram' })).toHaveAttribute('href', /^https:\/\/t\.me\/[a-z_]+$/)
  })

  test('«Далее» неактивна без имени; неполный телефон — ошибка', async ({ page }) => {
    await page.goto('/welcome')
    await start(page)
    const nextBtn = current(page).getByRole('button', { name: 'Далее' })
    await expect(nextBtn).toBeDisabled()
    await page.fill('#wn-name', 'Рита')
    await page.locator('#wn-phone').pressSequentially('7977016')
    await page.locator('#wn-name').focus()
    await expect(page.locator('#wn-phone-error')).toHaveText('Укажите номер телефона полностью')
    await expect(nextBtn).toBeDisabled()
    await page.locator('#wn-phone').pressSequentially('9775')
    await expect(page.locator('#wn-phone-error')).toBeHidden()
    await expect(nextBtn).toBeEnabled()
  })

  test('боковая панель на 1440px: разделы и возврат назад', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/welcome?name=Анна&phone=89770169775')
    await expect(page.locator('.welcome-aside')).toBeVisible()
    await expect(sections(page)).toHaveText(['01Контактные данные', '02Напиток', '03Дорога', '04Атмосфера визита', '05Сведения о здоровье', '06Завершение'])
    await expect(page.locator('.welcome-aside__foot')).toContainText('Ростов-на-Дону')
    await start(page)
    await next(page)
    await expect(sections(page).nth(1)).toHaveAttribute('data-state', 'current')
    await expect(sections(page).nth(0)).toHaveAttribute('data-state', 'done')
    await expect(sections(page).nth(0).getByRole('button')).toBeEnabled()
    for (const i of [1, 2, 3, 4, 5]) await expect(sections(page).nth(i).getByRole('button')).toBeDisabled()
    await sections(page).nth(0).getByRole('button').click()
    await expect(page.getByRole('heading', { name: 'Контактные данные' })).toBeFocused()
    await expect(sections(page).nth(0)).toHaveAttribute('data-state', 'current')
    await expect(sections(page).nth(1)).toHaveAttribute('data-state', 'done')
  })

  test('390px: панели нет, логотип и счётчик сверху', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/welcome')
    await expect(page.locator('.welcome-aside')).toBeHidden()
    await expect(page.locator('.welcome__logo img')).toBeVisible()
    await expect(page.locator('[data-counter]')).toHaveText('Анкета гостя')
    await expect(page.locator('[data-progress]')).toBeVisible()
    await start(page)
    await expect(page.locator('[data-counter]')).toHaveText('Шаг 1 из 6')
  })

  test('ошибка 429 показывается, ответы сохраняются', async ({ page }) => {
    const sent = await mockWelcome(page, { status: 429, body: { ok: false, error: 'Слишком много запросов. Попробуй чуть позже.' } })
    await page.goto('/welcome?name=Анна&phone=89770169775')
    await start(page)
    await next(page)
    await choose(page, 'Вода')
    await next(page)
    await choose(page, 'Другим способом')
    await next(page)
    await choose(page, 'По настроению')
    await page.locator('label[for="wn-kid-1"]').click()
    await next(page)
    await choose(page, 'Противопоказаний нет')
    await page.locator('label[for="wn-tan-1"]').click()
    await next(page)
    await choose(page, 'Рекомендация')
    await page.locator('#wn-consent').check()
    await current(page).getByRole('button', { name: 'Отправить анкету' }).click()
    await expect(current(page).getByRole('alert')).toHaveText('Слишком много запросов. Попробуй чуть позже.')
    await expect(page.locator('input[name="source"][value="friend"]')).toBeChecked()
    await expect(current(page).getByRole('button', { name: 'Отправить анкету' })).toBeEnabled()
    expect(sent).toHaveLength(1)
  })

  test('без нарушений доступности', async ({ page }) => {
    await page.goto('/welcome')
    const check = async () => {
      // Дожидаемся анимации появления шага: axe считает контраст по текущей прозрачности
      await current(page).evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)))
      const { violations } = await new AxeBuilder({ page }).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
    }
    await check()
    await start(page)
    await check()
    await page.fill('#wn-name', 'Анна')
    await page.locator('#wn-phone').pressSequentially('89770169775')
    await next(page)
    await choose(page, 'Капучино')
    await check()
    await next(page)
    await choose(page, 'На автомобиле')
    await next(page)
    await choose(page, 'Беседа')
    await page.locator('label[for="wn-kid-0"]').click()
    await check()
    await next(page)
    await check()
  })
})

test.describe('/welcome/back', () => {
  test('с телефоном в ссылке: здоровье, напиток, отправка', async ({ page }) => {
    const sent = await mockWelcome(page)
    await page.goto('/welcome/back?name=Анна&phone=89770169775')
    await expect(page.getByRole('heading', { name: 'С возвращением, Анна 💛' })).toBeVisible()
    await expect(page.locator('#wb-phone')).toBeHidden()
    await current(page).getByRole('button', { name: 'Начнём' }).click()
    await expect(page.locator('[data-counter]')).toHaveText('Шаг 1 из 3')
    await choose(page, 'Да, расскажу')
    const nextBtn = current(page).getByRole('button', { name: 'Далее' })
    await choose(page, 'Период лактации')
    await expect(nextBtn).toBeDisabled()
    await page.fill('#wb-health-notes', 'с марта')
    await next(page)
    await choose(page, 'Матча')
    await choose(page, 'Миндальное')
    await next(page)
    await page.locator('#wb-consent').check()
    await current(page).getByRole('button', { name: 'Отправить' }).click()
    await expect(page.getByRole('heading', { name: 'Ждём тебя' })).toBeVisible()
    expect(sent[0]).toMatchObject({
      visit_type: 'back',
      name: 'Анна',
      phone: '+7 (977) 016-97-75',
      health_changed: true,
      health_notes: 'с марта',
      contraindications: ['lactation'],
      drink: 'matcha',
      milk: 'almond',
    })
  })

  test('без телефона в ссылке: поля контактов обязательны', async ({ page }) => {
    await page.goto('/welcome/back?name=Анна')
    const begin = current(page).getByRole('button', { name: 'Начнём' })
    await expect(page.locator('#wb-phone')).toBeVisible()
    await expect(begin).toBeDisabled()
    await page.locator('#wb-phone').pressSequentially('89770169775')
    await expect(begin).toBeEnabled()
  })
})

test('без JS: анкета отправляется обычной формой', async ({ browser }) => {
  // Настоящий /api/welcome; уведомления в e2e не отправляются (NOTIFY_DRY_RUN=1)
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/welcome')
  // Все шаги видны одной формой, кнопки мастера скрыты
  await expect(page.locator('.welcome-step[data-step="6"]')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Далее' })).toHaveCount(0)
  await page.fill('#wn-name', 'Анна')
  await page.fill('#wn-phone', '89770169775')
  for (const label of ['Американо', 'Другим способом', 'Беседа', 'Противопоказаний нет', 'Рекомендация']) {
    await page.getByLabel(label, { exact: true }).check()
  }
  for (const id of ['wn-kid-1', 'wn-tan-1']) await page.locator(`label[for="${id}"]`).click()
  await page.locator('#wn-consent').check()
  await page.getByRole('button', { name: 'Отправить анкету' }).click()
  await expect(page.getByRole('heading', { name: 'Всё записали' })).toBeVisible()
  await ctx.close()
})
