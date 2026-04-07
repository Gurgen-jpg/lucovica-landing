'use client'

import { useState } from 'react'
import LeadForm from './LeadForm'

export default function Promos() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section id="promos" className="py-20 px-5 md:px-12 bg-gradient-to-br from-navy to-navy/90">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-rose font-semibold text-sm uppercase tracking-widest mb-2">Выгодные предложения</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Акции студии</h2>
            <p className="text-white/60 text-sm md:text-base">Успейте воспользоваться специальным предложением</p>
          </div>

          {/* Единственная акция */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-medium to-rose-dark text-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            {/* Декоративный круг */}
            <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

            {/* Иконка */}
            <div className="relative flex-shrink-0 w-28 h-28 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-5xl">🎁</span>
            </div>

            {/* Текст */}
            <div className="relative flex-1 text-center md:text-left">
              <span className="inline-block bg-white/20 text-white/90 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Акция
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-3">
                Подмышки — бесплатно!
              </h3>
              <p className="text-white/80 text-base mb-6 max-w-md mx-auto md:mx-0">
                При записи на любую процедуру эпиляции — зона подмышек в подарок.
                Просто упомяните акцию при записи.
              </p>
              <button
                onClick={() => setOpen(true)}
                className="bg-white text-rose-dark font-bold px-8 py-3.5 rounded-full hover:bg-rose-light transition shadow-lg text-sm"
              >
                Записаться и получить подарок
              </button>
            </div>
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
