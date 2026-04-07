'use client'

import { useState } from 'react'
import LeadForm from './LeadForm'

const promos = [
  {
    badge: '🎁 Для новых клиентов',
    title: 'Первый визит — скидка 20%',
    desc: 'На любую услугу студии при первом посещении. Просто скажите об акции при записи.',
    cta: 'Записаться со скидкой',
    highlight: true,
    service: 'Лазерная эпиляция — Девушки',
  },
  {
    badge: '👯 Приведи подругу',
    title: 'Обе получают скидку 15%',
    desc: 'Приходите вместе с подругой — каждая получает скидку 15% на свою процедуру.',
    cta: 'Записаться вдвоём',
    highlight: false,
    service: 'Шугаринг — Девушки',
  },
  {
    badge: '🌞 Сезонная акция',
    title: 'Готовимся к лету',
    desc: 'Комплекс «Бикини + Подмышки + Голени» — специальная цена до 31 мая. Записывайтесь сейчас!',
    cta: 'Воспользоваться',
    highlight: false,
    service: 'Комплекс лазерной эпиляции — Девушки',
  },
]

export default function Promos() {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState('')

  const handleBook = (s: string) => {
    setService(s)
    setOpen(true)
  }

  return (
    <>
      <section id="promos" className="py-20 px-5 md:px-12 bg-gradient-to-br from-navy to-navy/90">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-rose font-semibold text-sm uppercase tracking-widest mb-2">Выгодные предложения</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Акции студии</h2>
            <p className="text-white/60 text-sm md:text-base">Успейте воспользоваться специальными предложениями</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {promos.map((p, i) => (
              <div
                key={i}
                className={`rounded-3xl p-6 flex flex-col ${
                  p.highlight
                    ? 'bg-gradient-to-br from-rose-medium to-rose-dark text-white'
                    : 'bg-white/10 text-white border border-white/10'
                }`}
              >
                <span className={`text-xs font-semibold mb-3 ${p.highlight ? 'text-rose-light' : 'text-rose'}`}>
                  {p.badge}
                </span>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p className={`text-sm mb-5 flex-1 ${p.highlight ? 'text-white/80' : 'text-white/60'}`}>
                  {p.desc}
                </p>
                <button
                  onClick={() => handleBook(p.service)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                    p.highlight
                      ? 'bg-white text-rose-dark hover:bg-rose-light'
                      : 'bg-rose-dark text-white hover:bg-rose-deep'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService={service} />
    </>
  )
}
