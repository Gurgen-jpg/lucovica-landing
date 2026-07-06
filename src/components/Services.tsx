'use client'

import { useState } from 'react'
import Link from 'next/link'
import LeadForm from './LeadForm'
import { SectionHeader, TagPill } from '@/components/ui'

const categories = [
  {
    id: 'laser',
    title: 'Лазерная эпиляция',
    desc: 'Современный диодный лазер для стойкого результата. Минимум дискомфорта, максимум гладкости.',
    badge: 'Хит',
    color: 'from-mist to-mist/50',
    tags: ['Девушки', 'Мужчины', 'Все зоны', 'Комплексы'],
  },
  {
    id: 'sugaring',
    title: 'Шугаринг',
    desc: 'Натуральная сахарная паста. Гипоаллергенно, бережно для кожи, чистый состав без химии.',
    badge: null,
    color: 'from-mist/50 to-white',
    tags: ['Девушки', 'Мужчины', 'Подростки', 'Лицо'],
  },
  {
    id: 'complex',
    title: 'Комплексы',
    desc: 'Выгодные наборы зон — экономия до 30% по сравнению с отдельными процедурами.',
    badge: 'Выгода',
    color: 'from-mist to-white',
    tags: ['Женские', 'Мужские', 'Абонементы'],
  },
  {
    id: 'electro',
    title: 'Электроэпиляция',
    desc: 'Перманентное удаление каждого волоска индивидуально. Единственный метод с гарантией 100%.',
    badge: null,
    color: 'from-mist/40 to-white',
    tags: ['Лицо', 'Тело', 'Навсегда'],
  },
  {
    id: 'cert',
    title: 'Подарочные сертификаты',
    desc: 'Подарите красоту и уход. Сертификаты от 500₽ до 3000₽ — на любые услуги студии.',
    badge: null,
    color: 'from-cream/20 to-white',
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
      <section id="services" className="py-20 px-5 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            sub="Что мы делаем"
            title="Услуги студии"
            description="Шугаринг, лазерная и электроэпиляция — для женщин, мужчин и подростков. Все процедуры проводятся с соблюдением строгих стандартов гигиены."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`card bg-gradient-to-br ${cat.color} border-0 relative overflow-hidden group hover:shadow-md transition-shadow`}
              >
                {cat.badge && (
                  <span className="absolute top-4 right-4 bg-dark text-cream text-xs font-bold px-2.5 py-1 rounded-full tracking-widest uppercase">
                    {cat.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold text-dark mb-2 mt-1">{cat.title}</h3>
                <p className="text-dark/60 text-sm mb-4">{cat.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cat.tags.map((t) => (
                    <TagPill key={t}>{t}</TagPill>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleBook(cat.title)}
                    className="text-dark font-semibold text-sm hover:text-dark/60 transition flex items-center gap-1"
                  >
                    Записаться →
                  </button>
                  {cat.id === 'laser' && (
                    <Link
                      href="/laser-epil"
                      className="text-dark/40 text-sm hover:text-dark/70 transition flex items-center gap-1"
                    >
                      Подробнее
                    </Link>
                  )}
                  {cat.id === 'sugaring' && (
                    <Link
                      href="/sugaring"
                      className="text-dark/40 text-sm hover:text-dark/70 transition flex items-center gap-1"
                    >
                      Подробнее
                    </Link>
                  )}
                  {cat.id === 'electro' && (
                    <Link
                      href="/electro-epil"
                      className="text-dark/40 text-sm hover:text-dark/70 transition flex items-center gap-1"
                    >
                      Подробнее
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Benefits strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { text: 'Стерильный инструментарий' },
              { text: 'Косметика премиум-класса' },
              { text: 'Кофе и уютная атмосфера' },
              { text: 'Онлайн-запись 24/7' },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center justify-center text-center bg-white rounded-2xl p-4 shadow-sm border border-mist"
              >
                <span className="text-xs font-semibold text-dark/70">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService={service} />
    </>
  )
}
