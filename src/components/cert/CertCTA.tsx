'use client'

import { useState } from 'react'
import LeadForm from '@/components/LeadForm'
import { PHONE, PHONE_HREF } from '@/lib/site-config'
import { track } from '@/lib/analytics'

export default function CertCTA() {
  const [open, setOpen] = useState(false)

  const handleCTA = () => {
    track('cert_cta_click')
    setOpen(true)
  }

  return (
    <>
      <section className="py-20 px-5 md:px-12 bg-dark">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-4">
            Оформить сертификат
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-normal mb-4">
            Лучший подарок —<br />
            <span className="text-white/50">время для себя</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base mb-8 max-w-md mx-auto">
            Оставьте заявку — свяжемся, поможем выбрать номинал и оформим сертификат.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleCTA} className="btn-primary text-base px-8 py-4">
              Оформить сертификат
            </button>
            <a href={`tel:${PHONE_HREF}`} className="btn-outline-light text-base px-8 py-4">
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService="Подарочный сертификат" />
    </>
  )
}
