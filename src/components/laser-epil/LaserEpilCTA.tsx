'use client'

import { useState } from 'react'
import LeadForm from '@/components/LeadForm'
import { PHONE, PHONE_HREF, TG_USERNAME } from '@/lib/site-config'
import { track } from '@/lib/analytics'

export default function LaserEpilCTA() {
  const [open, setOpen] = useState(false)

  const handleCTA = () => {
    track('laser_epil_cta_click')
    setOpen(true)
  }

  const handlePhone = () => {
    track('laser_epil_phone_click')
  }

  return (
    <>
      <section className="py-20 px-5 md:px-12 bg-dark">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-4">
            Записаться на лазерную эпиляцию
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-normal mb-4">
            Первый визит —<br />
            <span className="text-white/50">подмышки бесплатно</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base mb-8 max-w-md mx-auto">
            Студия LUCOVICA, Ростов-на-Дону, просп. Соколова, 68.
            Запись онлайн — удобно и без звонков. Ответим в Telegram.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={handleCTA}
              className="btn-primary text-base px-8 py-4"
            >
              Записаться онлайн
            </button>
            <a
              href={`tel:${PHONE_HREF}`}
              onClick={handlePhone}
              className="btn-outline-light text-base px-8 py-4"
            >
              {PHONE}
            </a>
          </div>

          <a
            href={`https://t.me/${TG_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white/70 transition"
          >
            <span>Telegram:</span>
            <span className="font-semibold">@{TG_USERNAME}</span>
          </a>

          <p className="text-white/20 text-xs mt-4">Ежедневно 10:00–21:00</p>
        </div>
      </section>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultPromo />
    </>
  )
}
