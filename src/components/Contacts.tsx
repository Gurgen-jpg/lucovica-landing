'use client'

import { useState } from 'react'
import LeadForm from './LeadForm'

export default function Contacts() {
  const [open, setOpen] = useState(false)
  const PHONE = process.env.NEXT_PUBLIC_PHONE ?? '+7-961-XXX-XX-XX'
  const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? '79610000000'

  return (
    <>
      <section id="contacts" className="py-20 px-5 md:px-12 bg-cream-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-sub">Как нас найти</p>
            <h2 className="section-title">Контакты</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info */}
            <div className="space-y-5">
              {/* Address */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">📍</span>
                  <div>
                    <p className="font-bold text-navy mb-1">Адрес</p>
                    <p className="text-navy/70 text-sm">Ростов-на-Дону, центр</p>
                    <p className="text-navy/50 text-xs mt-1">[Укажите точный адрес]</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">📞</span>
                  <div>
                    <p className="font-bold text-navy mb-1">Телефон</p>
                    <a
                      href={`tel:${PHONE}`}
                      className="text-rose-dark font-semibold hover:text-rose-deep transition"
                      onClick={() => { if ((window as any).ym) (window as any).ym(undefined, 'reachGoal', 'click_phone') }}
                    >
                      {PHONE}
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">💬</span>
                  <div>
                    <p className="font-bold text-navy mb-1">WhatsApp</p>
                    <a
                      href={`https://wa.me/${WA}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-dark font-semibold hover:text-rose-deep transition"
                      onClick={() => { if ((window as any).ym) (window as any).ym(undefined, 'reachGoal', 'click_whatsapp') }}
                    >
                      Написать в WhatsApp →
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">🕐</span>
                  <div>
                    <p className="font-bold text-navy mb-2">Режим работы</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-navy/70">
                        <span>Понедельник — Пятница</span>
                        <span className="font-semibold">10:00–20:00</span>
                      </div>
                      <div className="flex justify-between text-navy/70">
                        <span>Суббота — Воскресенье</span>
                        <span className="font-semibold">10:00–18:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book CTA */}
              <button
                onClick={() => setOpen(true)}
                className="btn-primary w-full"
              >
                Записаться онлайн
              </button>
            </div>

            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-md border border-beige min-h-[300px] bg-beige flex items-center justify-center">
              {/* Replace src with your actual Yandex Maps embed URL */}
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3Aplaceholder&amp;source=constructor"
                width="100%"
                height="100%"
                className="w-full h-full min-h-[350px]"
                frameBorder="0"
                allowFullScreen
                title="Карта студии LUCOVICA"
              />
            </div>
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
