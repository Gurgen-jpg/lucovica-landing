import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendEmail } from '../../server/lib/notify/email.ts'
import { formatLead, type Lead } from '../../server/lib/notify/format-lead.ts'
import { createNotify } from '../../server/lib/notify/index.ts'
import { sendTelegram } from '../../server/lib/notify/telegram.ts'

const msg = { subject: 'Тема', html: '<p>письмо</p>', telegram: 'текст', logName: 'Анна' }
const env = { SMTP_USER: 'info@lucovica.ru', SMTP_PASS: 'secret', TELEGRAM_BOT_TOKEN: 't', TELEGRAM_CHAT_ID: '42' }

afterEach(() => vi.restoreAllMocks())

describe('email', () => {
  it('при сбое 587 отправляет через 465', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const ports: number[] = []
    const sendMail = vi.fn()
    const createTransport = vi.fn((o: { port: number }) => {
      ports.push(o.port)
      return { sendMail: o.port === 587 ? vi.fn().mockRejectedValue(new Error('ECONNREFUSED')) : sendMail }
    })
    await sendEmail(msg, { createTransport, env })
    expect(ports).toEqual([587, 465])
    expect(sendMail).toHaveBeenCalledWith({
      from: '"LUCOVICA" <info@lucovica.ru>',
      to: 'info@lucovica.ru',
      subject: 'Тема',
      html: '<p>письмо</p>',
    })
  })

  it('NOTIFY_EMAIL — получатель', async () => {
    const sendMail = vi.fn()
    await sendEmail(msg, { createTransport: () => ({ sendMail }), env: { ...env, NOTIFY_EMAIL: 'admin@lucovica.ru' } })
    expect(sendMail.mock.calls[0]![0].to).toBe('admin@lucovica.ru')
  })

  it('все порты упали — ошибка', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const createTransport = () => ({ sendMail: vi.fn().mockRejectedValue(new Error('down')) })
    await expect(sendEmail(msg, { createTransport, env })).rejects.toThrow('down')
  })

  it('без учётных данных — ошибка канала', async () => {
    await expect(sendEmail(msg, { env: {} })).rejects.toThrow('SMTP не настроен')
  })
})

describe('telegram', () => {
  it('сетевая ошибка, затем успех — доставлено', async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
    await sendTelegram(msg, { fetch, env, retryDelayMs: 0 })
    expect(fetch).toHaveBeenCalledTimes(2)
    const [url, init] = fetch.mock.calls[1]!
    expect(url).toBe('https://api.telegram.org/bott/sendMessage')
    expect(JSON.parse(init.body)).toEqual({ chat_id: '42', text: 'текст', parse_mode: 'HTML', disable_web_page_preview: true })
  })

  it('3 неудачные попытки — ошибка', async () => {
    const fetch = vi.fn().mockImplementation(async () => new Response('bad', { status: 500 }))
    await expect(sendTelegram(msg, { fetch, env, retryDelayMs: 0 })).rejects.toThrow('Telegram API 500')
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('без токена — сбой канала, без запросов', async () => {
    const fetch = vi.fn()
    await expect(sendTelegram(msg, { fetch, env: {} })).rejects.toThrow('Telegram не настроен')
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('notify', () => {
  it('один канал упал → {email:false, telegram:true}, в логе нет телефона', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const notify = createNotify({ email: () => Promise.reject(new Error('smtp down')), telegram: () => Promise.resolve() })
    const lead = formatLead({ ...base, phone: '+7 (977) 016-97-75' })
    await expect(notify(lead)).resolves.toEqual({ email: false, telegram: true })
    const logged = log.mock.calls.flat().join(' ')
    expect(logged).toContain('Анна')
    expect(logged).not.toContain('016-97-75')
  })

  it('оба канала работают параллельно', async () => {
    let running = 0
    let peak = 0
    const slow = async () => {
      running++
      peak = Math.max(peak, running)
      await new Promise((r) => setTimeout(r, 10))
      running--
    }
    await expect(createNotify({ email: slow, telegram: slow })(msg)).resolves.toEqual({ email: true, telegram: true })
    expect(peak).toBe(2)
  })
})

const base: Lead = {
  name: 'Анна',
  phone: '+7 (977) 016-97-75',
  service: 'Шугаринг — Девушки',
  time: 'Вечер 17–21',
  contact_method: 'Telegram',
}

describe('formatLead', () => {
  it('обычная заявка', () => {
    const m = formatLead({ ...base, promo: 'Первый визит — подмышки бесплатно', utm_source: 'yandex', utm_campaign: 'laser' })
    expect(m.subject).toBe('🌸 Новая заявка — Анна')
    expect(m.telegram).toMatchInlineSnapshot(`
      "🌸 <b>Новая заявка на запись — LUCOVICA</b>
      ────────────────────────────
      👤 <b>Имя:</b> Анна
      📞 <b>Телефон:</b> <a href="tel:+79770169775">+7 (977) 016-97-75</a>
      💆 <b>Услуга:</b> Шугаринг — Девушки
      🕐 <b>Время:</b> Вечер 17–21
      📱 <b>Связь:</b> Telegram
      🎁 <b>Акция:</b> Первый визит — подмышки бесплатно

      <blockquote>📊 Источник: yandex / laser</blockquote>"
    `)
    expect(m.html).toMatchInlineSnapshot(`
      "<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="margin:0 0 16px;color:#1a1a1a">🌸 Новая заявка — Анна</h2>
      <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">Имя</td><td style="padding:4px 0"><b>Анна</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">Телефон</td><td style="padding:4px 0"><b>+7 (977) 016-97-75</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">Услуга</td><td style="padding:4px 0"><b>Шугаринг — Девушки</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">Время</td><td style="padding:4px 0"><b>Вечер 17–21</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">Связь</td><td style="padding:4px 0"><b>Telegram</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">Акция</td><td style="padding:4px 0"><b>🎁 Первый визит — подмышки бесплатно</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap">Источник</td><td style="padding:4px 0"><b>yandex / laser</b></td></tr>
      </table>
      </div>"
    `)
  })

  it('сертификат: своя тема, без строки «Время»', () => {
    const m = formatLead({ ...base, service: 'Подарочный сертификат', time: 'Подарочный сертификат' })
    expect(m.subject).toBe('🎁 Новый заказ сертификата — Анна')
    expect(m.telegram).toMatchInlineSnapshot(`
      "🎁 <b>Новый заказ сертификата — LUCOVICA</b>
      ────────────────────────────
      👤 <b>Имя:</b> Анна
      📞 <b>Телефон:</b> <a href="tel:+79770169775">+7 (977) 016-97-75</a>
      💆 <b>Услуга:</b> Подарочный сертификат
      📱 <b>Связь:</b> Telegram"
    `)
    expect(m.html).not.toContain('Время')
  })

  it('ник Telegram — ссылкой на чат', () => {
    const m = formatLead({ ...base, messenger: '@anna_lv' })
    expect(m.telegram).toContain('📱 <b>Связь:</b> Telegram — <a href="https://t.me/anna_lv">@anna_lv</a>')
    expect(m.html).toContain('<b>Telegram — @anna_lv</b>')
  })

  it('номер в WhatsApp и произвольный текст — как есть, с экранированием', () => {
    expect(formatLead({ ...base, contact_method: 'WhatsApp', messenger: '+7 900 000-00-00' }).telegram).toContain(
      '📱 <b>Связь:</b> WhatsApp — +7 900 000-00-00',
    )
    expect(formatLead({ ...base, messenger: '<i>x</i>' }).telegram).toContain('Telegram — &lt;i&gt;x&lt;/i&gt;')
  })

  it('разметка в имени экранируется в обоих каналах', () => {
    const m = formatLead({ ...base, name: '<b>Анна</b>' })
    expect(m.telegram).toContain('👤 <b>Имя:</b> &lt;b&gt;Анна&lt;/b&gt;')
    expect(m.html).toContain('<b>&lt;b&gt;Анна&lt;/b&gt;</b>')
    expect(m.html).toContain('🌸 Новая заявка — &lt;b&gt;Анна&lt;/b&gt;</h2>')
  })
})
