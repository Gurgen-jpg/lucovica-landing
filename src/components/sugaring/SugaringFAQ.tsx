'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/ui'
import { sugaringFaqs } from './SugaringFAQ.data'

export default function SugaringFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-3xl mx-auto">
        <SectionHeader sub="Вопросы и ответы" title="Часто спрашивают о шугаринге" />

        <div className="space-y-3">
          {sugaringFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-mist overflow-hidden shadow-sm">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-dark text-sm pr-4">{faq.q}</span>
                <span className={`text-dark text-lg font-bold transition-transform flex-shrink-0 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-dark/70 text-sm leading-relaxed border-t border-mist pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
