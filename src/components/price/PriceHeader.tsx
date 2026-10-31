import Link from 'next/link'
import LogoDivider from '@/components/LogoDivider'
import { CITY, PROMO_FIRST_VISIT } from '@/lib/site-config'

export default function PriceHeader() {
  return (
    <header className="px-5 pt-6 pb-8 text-center">
      <Link href="/" aria-label="LUCOVICA — на главную" className="inline-block">
        <LogoDivider sourse="/Logo_main_black_no background.png" width={120} height={80} />
      </Link>
      <p className="section-sub mt-4">Студия эпиляции · {CITY}</p>
      <h1 className="section-title">Прайс-лист</h1>
      <p className="text-dark/60 text-sm">Популярные зоны. Цена за одну процедуру.</p>
      <p className="mt-5 inline-block rounded-full bg-cream px-4 py-2 text-sm text-dark">
        🎁 {PROMO_FIRST_VISIT}
      </p>
    </header>
  )
}
