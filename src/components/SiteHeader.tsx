'use client'

import Link from 'next/link'
import LogoDivider from '@/components/LogoDivider'
import { PHONE_HREF } from '@/lib/site-config'
import { track } from '@/lib/analytics'

export default function SiteHeader() {
  const handlePhone = () => {
    track('header_phone_click')
  }

  return (
    <header className="relative z-30 bg-white">
      <nav className="flex items-center justify-between px-5 md:px-12 py-5">
        <Link href="/" aria-label="LUCOVICA — на главную">
          <LogoDivider
            sourse="/Logo_main_black_no background.png"
            width={120}
            height={80}
          />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-dark/60">
          <Link href="/#services" className="hover:text-dark transition">Услуги</Link>
          <Link href="/#pricing" className="hover:text-dark transition">Цены</Link>
          <LogoDivider
            sourse="/Symbol_black_no background.png"
            width={48}
            height={48}
          />
          <Link href="/#reviews" className="hover:text-dark transition">Отзывы</Link>
          <Link href="/#contacts" className="hover:text-dark transition">Контакты</Link>
        </div>
        <a
          href={`tel:${PHONE_HREF}`}
          onClick={handlePhone}
          className="hidden md:flex items-center gap-2 text-dark/70 font-semibold text-sm hover:text-dark transition"
        >
          Позвонить
        </a>
      </nav>
    </header>
  )
}
