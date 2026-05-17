'use client'

import { useState } from 'react'
import { SERVICES, type ServiceCategory } from '@/lib/services-data'
import LeadForm from './LeadForm'
import { SectionHeader } from '@/components/ui'

const TABS = [
  { id: 'laser-women', label: 'Лазер — Девушки' },
  { id: 'laser-complexes-women', label: 'Комплексы — Девушки' },
  { id: 'sugaring-women', label: 'Шугаринг — Девушки' },
  { id: 'sugaring-master', label: 'Мастер Екатерина' },
  { id: 'sugaring-teen', label: 'Юные леди' },
  { id: 'sugaring-men', label: 'Шугаринг — Мужчины' },
  { id: 'laser-men', label: 'Лазер — Мужчины' },
  { id: 'laser-complexes-men', label: 'Комплексы — Мужчины' },
]

function fmt(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('laser-women')
  const [open, setOpen] = useState(false)
  const [service, setService] = useState('')

  const category = SERVICES.find((s) => s.id === activeTab) as ServiceCategory

  const handleBook = (catTitle: string) => {
    setService(catTitle)
    setOpen(true)
  }

  return (
    <>
      <section id="pricing" className="py-20 px-5 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            sub="Прейскурант"
            title="Цены на услуги"
            description="Все цены указаны за один сеанс. Первый визит — подмышки бесплатно."
            spacing="sm"
          />

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${activeTab === tab.id
                    ? 'bg-dark border-dark text-white'
                    : 'border-mist text-dark/60 hover:border-dark'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Price table */}
          {category && (
            <div className="bg-mist/20 rounded-3xl overflow-hidden border border-mist">
              <div className="bg-dark px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold">{category.title}</span>
                  <span className="ml-3 text-cream/70 text-xs font-normal tracking-wide">результат с первой процедуры</span>
                </div>
                <button
                  onClick={() => handleBook(category.title)}
                  className="bg-cream text-dark text-sm font-bold px-4 py-2 rounded-full hover:bg-cream/80 transition"
                >
                  Записаться
                </button>
              </div>

              <div className="divide-y divide-mist">
                {category.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white transition group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-dark text-sm">{item.name}</p>
                      <p className="text-dark/50 text-xs mt-0.5">{item.short}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="font-bold text-dark whitespace-nowrap">{fmt(item.price)}</span>
                      <button
                        onClick={() => handleBook(category.title)}
                        className="opacity-0 group-hover:opacity-100 transition text-xs text-dark border border-mist rounded-full px-2.5 py-1 hover:bg-mist/30"
                      >
                        Записаться
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA at bottom */}
              <div className="px-6 py-5 bg-white/50 text-center">
                <p className="text-xs text-dark/50 mb-3">
                  Первый визит со скидкой 20% · Абонементы для максимальной экономии
                </p>
                <button
                  onClick={() => handleBook(category.title)}
                  className="btn-primary text-sm"
                >
                  Записаться на {category.title.split('—')[0].trim()}
                </button>
              </div>
            </div>
          )}

          {/* Certificates teaser */}
          <div className="mt-8 bg-mist/20 border border-mist rounded-3xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-dark/50 text-sm font-semibold mb-1 tracking-widest uppercase">Подарки близким</p>
              <h3 className="text-dark font-bold text-lg">Подарочные сертификаты</h3>
              <p className="text-dark/60 text-sm mt-1">500₽ · 1000₽ · 2000₽ · 3000₽ — на любые услуги</p>
            </div>
            <button
              onClick={() => handleBook('Подарочный сертификат')}
              className="bg-dark text-white hover:bg-dark/80 font-semibold px-6 py-3 rounded-full transition whitespace-nowrap"
            >
              Оформить сертификат
            </button>
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService={service} />
    </>
  )
}
