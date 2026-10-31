import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const PAGES = [
  {
    path: '/laser-epil',
    title: 'Лазерная эпиляция в Ростове-на-Дону — студия LUCOVICA',
    sections: ['why', 'how', 'zones', 'device', 'contraindications', 'results', 'reviews', 'prices', 'faq', 'cta'],
    goals: ['laser_epil_cta_click', 'laser_epil_phone_click'],
    faq: true,
  },
  {
    path: '/sugaring',
    title: 'Шугаринг в Ростове-на-Дону — студия LUCOVICA',
    sections: ['why', 'how', 'zones', 'composition', 'contraindications', 'results', 'reviews', 'prices', 'faq', 'cta'],
    goals: ['sugaring_cta_click', 'sugaring_phone_click'],
    faq: true,
  },
  {
    path: '/electro-epil',
    title: 'Электроэпиляция в Ростове-на-Дону — студия LUCOVICA',
    sections: ['why', 'how', 'zones', 'method', 'contraindications', 'results', 'reviews', 'prices', 'faq', 'cta'],
    goals: ['electro_epil_cta_click', 'electro_epil_phone_click'],
    faq: true,
  },
  {
    path: '/complex',
    title: 'Комплексы лазерной эпиляции в Ростове-на-Дону — студия LUCOVICA',
    sections: ['prices', 'cta'],
    goals: ['complex_cta_click'],
    faq: false,
  },
  {
    path: '/cert',
    title: 'Подарочные сертификаты в Ростове-на-Дону — студия LUCOVICA',
    sections: ['prices', 'cta'],
    goals: ['cert_cta_click'],
    faq: false,
  },
]

type Lead = Record<string, string>

async function mockLead(page: Page): Promise<Lead[]> {
  const sent: Lead[] = []
  await page.route('**/api/lead', async (route) => {
    sent.push(JSON.parse(route.request().postData() ?? '{}'))
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
  return sent
}

for (const p of PAGES) {
  test.describe(p.path, () => {
    test('200, один h1, title, og:url, крошки и «← Все услуги»', async ({ page }) => {
      const res = await page.goto(p.path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page).toHaveTitle(p.title)
      expect(await page.title()).not.toContain('| LUCOVICA')
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://lucovica.ru${p.path}`)
      const crumbs = page.locator('nav[aria-label="Хлебные крошки"]')
      await expect(crumbs.getByRole('link', { name: 'Главная' })).toHaveAttribute('href', '/')
      await expect(page.getByRole('link', { name: '← Все услуги' })).toHaveAttribute('href', '/#services')
    })

    test('секции в порядке спеки', async ({ page }) => {
      await page.goto(p.path)
      const ids = await page.$$eval('main > section[id]', (els) => els.map((e) => e.id))
      expect(ids).toEqual(p.sections)
    })

    test('цели Метрики на кнопках', async ({ page }) => {
      await page.goto(p.path)
      for (const goal of p.goals) await expect(page.locator(`[data-goal="${goal}"]`).first()).toBeAttached()
    })

    test('без нарушений доступности (axe)', async ({ page }) => {
      await page.goto(p.path)
      const { violations } = await new AxeBuilder({ page }).analyze()
      expect(violations.map((v) => `${v.id}: ${v.help} — ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
    })

    test('нет горизонтальной прокрутки на 360px', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 740 })
      await page.goto(p.path)
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    })

    if (p.faq) {
      test('FAQ совпадает с JSON-LD FAQPage (8 вопросов)', async ({ page }) => {
        await page.goto(p.path)
        const questions = (await page.locator('#faq .ds-accordion__trigger').allTextContents()).map((q) => q.trim())
        const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent!)))
        const faq = ld.find((d) => d['@type'] === 'FAQPage')
        expect(questions).toHaveLength(8)
        expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(questions)
        expect(ld.map((d) => d['@type'])).toEqual(expect.arrayContaining(['Service', 'BreadcrumbList']))
      })
    }
  })
}

test.describe('/laser-epil: запись', () => {
  test('кнопка Hero — услуга девушек и отмеченная акция', async ({ page }) => {
    await page.goto('/laser-epil')
    const cta = page.locator('.svc-hero').getByRole('link', { name: 'Записаться онлайн' })
    await expect(cta).toHaveAttribute('data-goal', 'laser_epil_cta_click')
    await cta.click()
    await expect(page.locator('#booking')).toBeVisible()
    await expect(page.locator('#booking-form-service')).toHaveValue('Лазерная эпиляция — Девушки')
    await expect(page.locator('#booking-form-promo')).toBeChecked()
  })

  test('мужская зона «Спина полностью» → форма с услугой и уточнением', async ({ page }) => {
    await page.goto('/laser-epil')
    await page.locator('#zones').getByRole('tab', { name: 'Мужчинам' }).click()
    const zone = page.locator('#zones a.svc-zone', { hasText: 'Спина полностью' })
    await expect(zone).toHaveAttribute('data-goal', 'laser_epil_zone_click')
    await zone.click()
    await expect(page.locator('#booking-form-service')).toHaveValue('Мужская лазерная эпиляция')
    await expect(page.locator('#booking').getByText('Зона: Спина полностью')).toBeVisible()
  })

  test('запись по позиции прайса передаёт «<услуга> — <позиция>»', async ({ page }) => {
    const sent = await mockLead(page)
    await page.goto('/laser-epil')
    await page.locator('#prices').getByRole('link', { name: 'Записаться: Ноги полностью' }).first().click()
    await page.fill('#booking-form-name', 'Анна')
    await page.fill('#booking-form-phone', '89770169775')
    await page.locator('#booking').getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(page.locator('#booking').getByText('Заявка принята!')).toBeVisible()
    expect(sent[0]!.service).toBe('Лазерная эпиляция — Девушки — Ноги полностью')
  })

  test('цены зон совпадают с прайсом страницы', async ({ page }) => {
    await page.goto('/laser-epil')
    const zonePrices = await page.$$eval('#zones-tabs-panel-women .svc-zone', (els) =>
      els.map((e) => [e.querySelector('.svc-zone__name')!.textContent!.trim(), e.querySelector('.svc-zone__price')!.textContent!.trim()]),
    )
    const listPrices = await page.$$eval('#svc-prices-panel-laser-women .price-list__row', (els) =>
      Object.fromEntries(els.map((e) => [e.querySelector('.price-list__name')!.textContent!.trim(), e.querySelector('.price-list__price')!.textContent!.replace(/\D/g, '')])),
    )
    for (const [name, price] of zonePrices) {
      if (price) expect(price.replace(/\D/g, ''), name).toBe(listPrices[name!])
    }
  })
})

test('/electro-epil: ссылка на лазер в «Когда лазер не справляется»', async ({ page }) => {
  await page.goto('/electro-epil')
  const link = page.locator('#why').getByRole('link', { name: 'лазерная эпиляция' })
  await link.click()
  await expect(page).toHaveURL(/\/laser-epil$/)
})

test('/sugaring: зоны без записи', async ({ page }) => {
  await page.goto('/sugaring')
  await expect(page.locator('#zones a.svc-zone')).toHaveCount(0)
  await expect(page.locator('#zones .svc-zone').first()).toBeVisible()
})

test('/complex: цель просмотра страницы', async ({ page }) => {
  await page.goto('/complex')
  await expect(page.locator('body')).toHaveAttribute('data-page-goal', 'complex_page_view')
})

test('/cert: «Оформить» у 2 000 ₽ — режим сертификата с номиналом', async ({ page }) => {
  await page.goto('/cert')
  await expect(page.locator('body')).toHaveAttribute('data-page-goal', 'cert_page_view')
  const order = page.locator('#prices').getByRole('link', { name: /Оформить: 2\s000 ₽/ })
  await expect(order).toHaveAttribute('data-goal', 'cert_cta_click')
  await order.click()
  await expect(page.locator('#booking').getByRole('heading', { name: 'Оформление сертификата' })).toBeVisible()
  await expect(page.locator('#booking').getByText(/Зона: 2\s000 ₽/)).toBeVisible()
})
