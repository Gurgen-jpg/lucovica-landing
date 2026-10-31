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
// Варианты — нативные input под подписью: отмечаем через label, а не клик по тексту
const choose = (page: Page, name: string) => current(page).getByLabel(name, { exact: true }).check()

test.describe('/welcome', () => {
  test('полный сценарий: 6 шагов, цели, «Спасибо»', async ({ page }) => {
    await trackGoals(page)
    const sent = await mockWelcome(page)
    await page.goto('/welcome?name=Анна&phone=89770169775')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    await expect(page.locator('.site-header')).toHaveCount(0)

    await current(page).getByRole('button', { name: 'Начнём' }).click()
    await expect(page.getByRole('heading', { name: 'Знакомство' })).toBeFocused()
    await expect(page.locator('[data-counter]')).toHaveText('1 / 6')
    await expect(page.locator('#wn-name')).toHaveValue('Анна')
    await expect(page.locator('#wn-phone')).toHaveValue('+7 (977) 016-97-75')
    await choose(page, 'На «вы»')
    await next(page)

    await expect(page.getByRole('heading', { name: 'Что приготовить?' })).toBeVisible()
    await expect(current(page)).toContainText('Угостим вас кофе или чаем — что будете?', { useInnerText: true })
    await choose(page, 'Капучино')
    await choose(page, 'Банановое')
    await next(page)
    await choose(page, 'На машине')
    await page.fill('#wn-car-number', 'А123БВ 161')
    await next(page)
    await choose(page, 'Тишина, я отдохну')
    await page.locator('label[for="wn-kid-1"]').click()
    await next(page)
    await choose(page, 'Беременность')
    await page.locator('label[for="wn-tan-1"]').click()
    await next(page)
    await choose(page, 'Яндекс Карты')
    await current(page).locator('label[for="wn-consent"]').click()
    await current(page).getByRole('button', { name: 'Отправить' }).click()

    await expect(page.getByRole('heading', { name: 'Всё записали' })).toBeVisible()
    await expect(page.locator('.welcome-thanks')).toContainText('Готовимся к вашему визиту. До встречи!', { useInnerText: true })
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({
      visit_type: 'new',
      name: 'Анна',
      phone: '+7 (977) 016-97-75',
      address_form: 'vy',
      drink: 'cappuccino',
      milk: 'banana',
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
    await expect(page.getByRole('link', { name: 'Написать в Telegram' })).toHaveAttribute('href', /^https:\/\/t\.me\/[a-z_]+$/)
  })

  test('«Далее» неактивна без имени; неполный телефон — ошибка', async ({ page }) => {
    await page.goto('/welcome')
    await current(page).getByRole('button', { name: 'Начнём' }).click()
    const nextBtn = current(page).getByRole('button', { name: 'Далее' })
    await choose(page, 'На «ты»')
    await expect(nextBtn).toBeDisabled()
    await page.fill('#wn-name', 'Рита')
    await page.locator('#wn-phone').pressSequentially('7977016')
    await page.locator('#wn-name').focus()
    await expect(page.locator('#wn-phone-error')).toHaveText('Введи полный номер телефона')
    await expect(nextBtn).toBeDisabled()
    await page.locator('#wn-phone').pressSequentially('9775')
    await expect(nextBtn).toBeEnabled()
  })

  test('ошибка 429 показывается, ответы сохраняются', async ({ page }) => {
    const sent = await mockWelcome(page, { status: 429, body: { ok: false, error: 'Слишком много запросов. Попробуй чуть позже.' } })
    await page.goto('/welcome?name=Анна&phone=89770169775')
    await current(page).getByRole('button', { name: 'Начнём' }).click()
    await choose(page, 'На «ты»')
    await next(page)
    await choose(page, 'Просто воду')
    await next(page)
    await choose(page, 'Без машины')
    await next(page)
    await choose(page, 'Как пойдёт')
    await page.locator('label[for="wn-kid-1"]').click()
    await next(page)
    await choose(page, 'Ничего из перечисленного')
    await page.locator('label[for="wn-tan-1"]').click()
    await next(page)
    await choose(page, 'Подруга')
    await current(page).locator('label[for="wn-consent"]').click()
    await current(page).getByRole('button', { name: 'Отправить' }).click()
    await expect(current(page).getByRole('alert')).toHaveText('Слишком много запросов. Попробуй чуть позже.')
    await expect(page.locator('input[name="source"][value="friend"]')).toBeChecked()
    await expect(current(page).getByRole('button', { name: 'Отправить' })).toBeEnabled()
    expect(sent).toHaveLength(1)
  })

  test('без нарушений доступности', async ({ page }) => {
    await page.goto('/welcome')
    const check = async () => {
      const { violations } = await new AxeBuilder({ page }).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
    }
    await check()
    await current(page).getByRole('button', { name: 'Начнём' }).click()
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
    await choose(page, 'Да, расскажу')
    const nextBtn = current(page).getByRole('button', { name: 'Далее' })
    await choose(page, 'Период лактации')
    await expect(nextBtn).toBeDisabled()
    await page.fill('#wb-health-notes', 'с марта')
    await next(page)
    await choose(page, 'Матча')
    await choose(page, 'Миндальное')
    await next(page)
    await current(page).locator('label[for="wb-consent"]').click()
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
    const start = current(page).getByRole('button', { name: 'Начнём' })
    await expect(page.locator('#wb-phone')).toBeVisible()
    await expect(start).toBeDisabled()
    await page.locator('#wb-phone').pressSequentially('89770169775')
    await expect(start).toBeEnabled()
  })
})

test('без JS: анкета отправляется обычной формой', async ({ browser }) => {
  // Настоящий /api/welcome; уведомления в e2e не отправляются (NOTIFY_DRY_RUN=1)
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/welcome')
  await page.fill('#wn-name', 'Анна')
  await page.fill('#wn-phone', '89770169775')
  for (const label of ['На «ты»', 'Американо', 'Без машины', 'Поболтаем', 'Ничего из перечисленного', 'Подруга']) {
    await page.getByLabel(label, { exact: true }).check()
  }
  for (const id of ['wn-kid-1', 'wn-tan-1']) await page.locator(`label[for="${id}"]`).click()
  await page.locator('label[for="wn-consent"]').click()
  await page.getByRole('button', { name: 'Отправить' }).click()
  await expect(page.getByRole('heading', { name: 'Всё записали' })).toBeVisible()
  await ctx.close()
})
