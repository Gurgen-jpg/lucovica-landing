'use client'

import { useState } from 'react'
import LeadForm from './LeadForm'

const categories = [
  {
    id: 'laser',
    icon: '✦',
    title: 'Лазерная эпиляция',
    desc: 'Современный диодный лазер для стойкого результата. Минимум дискомфорта, максимум гладкости.',
    badge: 'Хит',
    color: 'from-rose-light to-beige-light',
    tags: ['Девушки', 'Мужчины', 'Все зоны', 'Комплексы'],
  },
  {
    id: 'sugaring',
    icon: '◇',
    title: 'Шугаринг',
    desc: 'Натуральная сахарная паста. Гипоаллергенно, бережно для кожи, чистый состав без химии.',
    badge: null,
    color: 'from-cream-200 to-rose-light/30',
    tags: ['Девушки', 'Мужчины', 'Подростки', 'Лицо'],
  },
  {
    id: 'complex',
    icon: '◈',
    title: 'Комплексы',
    desc: 'Выгодные наборы зон — экономия до 30% по сравнению с отдельными процедурами.',
    badge: 'Выгода',
    color: 'from-beige to-cream-300',
    tags: ['Женские', 'Мужские', 'Абонементы'],
  },
  {
    id: 'electro',
    icon: '⚡',
    title: 'Электроэпиляция',
    desc: 'Перманентное удаление каждого волоска индивидуально. Единственный метод с гарантией 100%.',
    badge: null,
    color: 'from-rose-light/40 to-beige-light',
    tags: ['Лицо', 'Тело', 'Навсегда'],
  },
  {
    id: 'cert',
    icon: '🎁',
    title: 'Подарочные сертификаты',
    desc: 'Подарите красоту и уход. Сертификаты от 500₽ до 3000₽ — на любые услуги студии.',
    badge: null,
    color: 'from-cream-200 to-rose-light/20',
    tags: ['500₽', '1000₽', '2000₽', '3000₽'],
  },
]

export default function Services() {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState('')

  const handleBook = (title: string) => {
    setService(title)
    setOpen(true)
  }

  return (
    <>
      <section id="services" className="py-20 px-5 md:px-12 bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-sub">Что мы делаем</p>
            <h2 className="section-title">Услуги студии</h2>
            <p className="text-navy/60 max-w-xl mx-auto text-sm md:text-base">
              Шугаринг, лазерная и электроэпиляция — для женщин, мужчин и подростков.
              Все процедуры проводятся с соблюдением строгих стандартов гигиены.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`card bg-gradient-to-br ${cat.color} border-0 relative overflow-hidden group hover:shadow-md transition-shadow`}
              >
                {cat.badge && (
                  <span className="absolute top-4 right-4 bg-rose-dark text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {cat.badge}
                  </span>
                )}
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="text-lg font-bold text-navy mb-2">{cat.title}</h3>
                <p className="text-navy/60 text-sm mb-4">{cat.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cat.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-white/60 text-navy/70 text-xs px-2.5 py-1 rounded-full font-medium border border-beige/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleBook(cat.title)}
                  className="text-rose-dark font-semibold text-sm hover:text-rose-deep transition flex items-center gap-1"
                >
                  Записаться →
                </button>
              </div>
            ))}
          </div>

          {/* Benefits strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🔬', text: 'Стерильный инструментарий' },
              { icon: '💎', text: 'Косметика премиум-класса' },
              { icon: '☕', text: 'Кофе и уютная атмосфера' },
              { icon: '📱', text: 'Онлайн-запись 24/7' },
            ].map((b) => (
              <div
                key={b.text}
                className="flex flex-col items-center text-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-beige"
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-semibold text-navy/70">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService={service} />
    </>
  )
}
