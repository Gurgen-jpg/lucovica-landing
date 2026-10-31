'use client'

import Link from 'next/link'
import { PHONE, PHONE_HREF, TG_USERNAME, ADDRESS, CITY, YANDEX_MAPS_URL, HOURS_TEXT } from '@/lib/site-config'
import { track } from '@/lib/analytics'

export default function PriceContacts() {
  return (
    <section aria-labelledby="price-contacts" className="card space-y-4">
      <h2 id="price-contacts" className="text-xl font-normal text-dark">Контакты</h2>

      <div className="text-sm">
        <p className="text-dark font-medium">{CITY}</p>
        <p className="text-dark/70">{ADDRESS}</p>
        <p className="text-dark/50 text-xs mt-1">{HOURS_TEXT}</p>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <a href={`tel:${PHONE_HREF}`} onClick={() => track('click_phone')} className="font-semibold text-dark">
          {PHONE}
        </a>
        <a
          href={`https://t.me/${TG_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('click_telegram')}
          className="font-semibold text-dark"
        >
          Telegram @{TG_USERNAME}
        </a>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={YANDEX_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('price_map_click')}
          className="btn-outline w-full text-sm"
        >
          Открыть в Яндекс Картах
        </a>
        <Link href="/" onClick={() => track('price_site_click')} className="btn-outline w-full text-sm">
          Перейти на сайт
        </Link>
      </div>
    </section>
  )
}
