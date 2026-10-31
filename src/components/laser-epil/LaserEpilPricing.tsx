'use client'

import { useState } from 'react'
import LeadForm from '@/components/LeadForm'
import { SectionHeader } from '@/components/ui'
import { SERVICES } from '@/lib/services-data'
import { track } from '@/lib/analytics'

const LASER_TABS = [
  { id: 'laser-women', label: 'Девушки' },
  { id: 'laser-complexes-women', label: 'Комплексы женские' },
  { id: 'laser-men', label: 'Мужчины' },
  { id: 'laser-complexes-men', label: 'Комплексы мужские' },
]

function fmt(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function LaserEpilPricing() {
  const [activeTab, setActiveTab] = useState('laser-women')
  const [open, setOpen] = useState(false)
  const [service, setService] = useState('')

  const category = SERVICES.find((s) => s.id === activeTab)

  const handleBook = (name: string) => {
    setService(name)
    track('laser_epil_cta_click')
    setOpen(true)
  }

  return (
    <>
      <section id="pricing" className="py-20 px-5 md:px-12 bg-mist/20">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            sub="Прейскурант"
            title="Цены на лазерную эпиляцию"
            description="Все цены за один сеанс. Первый визит — подмышки бесплатно."
            spacing="sm"
          />

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {LASER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-dark border-dark text-white'
                    : 'border-mist text-dark/60 hover:border-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Price list */}
          {category && (
            <div className="bg-white rounded-2xl border border-mist overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-mist bg-dark/2">
                <p className="font-bold text-dark text-sm">{category.title}</p>
                <button
                  onClick={() => handleBook(category.title)}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Записаться
                </button>
              </div>
              <div className="divide-y divide-mist">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-mist/10 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="text-dark text-sm font-medium truncate">{item.name}</p>
                      <p className="text-dark/40 text-xs truncate">{item.short}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-bold text-dark text-sm">{fmt(item.price)}</span>
                      <button
                        onClick={() => handleBook(item.name)}
                        className="text-xs text-dark/40 hover:text-dark border border-mist hover:border-dark rounded-full px-3 py-1 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Записаться
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-dark/40 text-xs mt-4">
            Комплексы на несколько зон — выгоднее, чем по отдельности.
          </p>
        </div>
      </section>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService={service} />
    </>
  )
}
