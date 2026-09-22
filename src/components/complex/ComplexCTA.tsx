'use client'

import { useState } from 'react'
import LeadForm from '@/components/LeadForm'
import { PHONE, PHONE_HREF } from '@/lib/site-config'
import { track } from '@/lib/analytics'

export default function ComplexCTA() {
  const [open, setOpen] = useState(false)

  const handleCTA = () => {
    track('complex_cta_click')
    setOpen(true)
  }

  return (
    <>
      <section className="py-20 px-5 md:px-12 bg-dark">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-4">
            Записаться на комплекс
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-normal mb-4">
            Несколько зон —<br />
            <span className="text-white/50">за один визит</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base mb-8 max-w-md mx-auto">
            Студия LUCOVICA, Ростов-на-Дону, просп. Соколова, 68.
            Поможем подобрать комплекс под ваши зоны.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleCTA} className="btn-primary text-base px-8 py-4">
              Записаться онлайн
            </button>
            <a href={`tel:${PHONE_HREF}`} className="btn-outline-light text-base px-8 py-4">
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
