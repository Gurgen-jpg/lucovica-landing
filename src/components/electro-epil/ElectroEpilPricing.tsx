'use client'

import { useState } from 'react'
import LeadForm from '@/components/LeadForm'
import { SectionHeader } from '@/components/ui'
import { track } from '@/lib/analytics'
import { ELECTRO_PRICES } from '@/lib/services-data'

const PRICES = ELECTRO_PRICES.map((p) => ({
  ...p,
  price: `от ${p.price.toLocaleString('ru-RU')} ₽`,
}))

export default function ElectroEpilPricing() {
  const [open, setOpen] = useState(false)

  const handleBook = () => {
    track('electro_epil_cta_click')
    setOpen(true)
  }

  return (
    <>
      <section id="pricing" className="py-20 px-5 md:px-12 bg-mist/20">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            sub="Прейскурант"
            title="Цены на электроэпиляцию"
            description="Стоимость зависит от времени процедуры. Точную цену назовёт мастер на консультации."
            spacing="sm"
          />

          <div className="bg-white rounded-2xl border border-mist overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-mist">
              <p className="font-bold text-dark text-sm">Электроэпиляция</p>
              <button onClick={handleBook} className="btn-primary text-xs px-4 py-2">Записаться</button>
            </div>
            <div className="divide-y divide-mist">
              {PRICES.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-mist/10 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-dark text-sm font-medium">{item.name}</p>
                    <p className="text-dark/40 text-xs truncate">{item.short}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-dark text-sm">{item.price}</span>
                    <button
                      onClick={handleBook}
                      className="text-xs text-dark/40 hover:text-dark border border-mist hover:border-dark rounded-full px-3 py-1 transition-all opacity-0 group-hover:opacity-100"
                    >
                      Записаться
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-dark/40 text-xs mt-4">
            Электроэпиляция тарифицируется по времени — это честно: платите только за фактическую работу.
          </p>
        </div>
      </section>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService="Электроэпиляция" />
    </>
  )
}
