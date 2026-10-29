import { describe, expect, it } from 'vitest'
import { links, site } from '../../src/content/site.ts'

describe('site', () => {
  it('телефон в E.164 и отображаемый вид — один и тот же номер', () => {
    expect(site.phone.e164).toMatch(/^\+7\d{10}$/)
    expect(site.phone.display.replace(/\D/g, '')).toBe(site.phone.e164.slice(1))
  })

  it('ссылки собраны из настроек', () => {
    expect(links.tel).toBe('tel:+79770169775')
    expect(links.whatsapp).toBe('https://wa.me/79770169775')
    expect(links.telegram).toBe('https://t.me/lucovica_pro_epil')
  })
})
