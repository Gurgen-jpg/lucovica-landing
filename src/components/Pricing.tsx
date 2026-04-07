'use client'

import { useState } from 'react'
import { SERVICES, type ServiceCategory } from '@/lib/services-data'
import LeadForm from './LeadForm'

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
          <div className="text-center mb-10">
            <p className="section-sub">Прейскурант</p>
            <h2 className="section-title">Цены на услуги</h2>
            <p className="text-navy/60 text-sm md:text-base">
              Все цены указаны за один сеанс. На первый визит — скидка 20%.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-rose-dark border-rose-dark text-white'
                    : 'border-beige text-navy/60 hover:border-rose'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Price table */}
          {category && (
            <div className="bg-cream-100 rounded-3xl overflow-hidden border border-beige">
              <div className="bg-gradient-to-r from-rose-medium to-rose-dark px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl mr-2">{category.icon}</span>
                  <span className="text-white font-bold">{category.title}</span>
                </div>
                <button
                  onClick={() => handleBook(category.title)}
                  className="bg-white text-rose-dark text-sm font-bold px-4 py-2 rounded-full hover:bg-rose-light transition"
                >
                  Записаться
                </button>
              </div>

              <div className="divide-y divide-beige">
                {category.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white transition group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-navy text-sm">{item.name}</p>
                      <p className="text-navy/50 text-xs mt-0.5">{item.short}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="font-bold text-rose-dark whitespace-nowrap">{fmt(item.price)}</span>
                      <button
                        onClick={() => handleBook(category.title)}
                        className="opacity-0 group-hover:opacity-100 transition text-xs text-rose-dark border border-rose rounded-full px-2.5 py-1 hover:bg-rose-light/30"
                      >
                        Записаться
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA at bottom */}
              <div className="px-6 py-5 bg-white/50 text-center">
                <p className="text-xs text-navy/50 mb-3">
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
          <div className="mt-8 bg-gradient-to-r from-navy to-navy/90 rounded-3xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-rose text-sm font-semibold mb-1">Подарки близким</p>
              <h3 className="text-white font-bold text-lg">Подарочные сертификаты</h3>
              <p className="text-white/60 text-sm mt-1">500₽ · 1000₽ · 2000₽ · 3000₽ — на любые услуги</p>
            </div>
            <button
              onClick={() => handleBook('Подарочный сертификат')}
              className="bg-rose-dark hover:bg-rose-deep text-white font-semibold px-6 py-3 rounded-full transition whitespace-nowrap"
            >
              🎁 Оформить сертификат
            </button>
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService={service} />
    </>
  )
}
