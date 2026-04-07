'use client'

import { useState } from 'react'
import LeadForm from './LeadForm'

const PHONE = '+7 (977) 016-97-75'
const PHONE_HREF = '+79770169775'
const TG_USERNAME = 'lucovica_pro_epil'
const ADDRESS = 'просп. Соколова, 68/118Вс1, этаж 1'
const CITY = 'Ростов-на-Дону'
const MAP_SRC = 'https://yandex.ru/map-widget/v1/org/lucovica/72594546932/?ll=39.718390,47.231276&z=16'

const HOURS = [
  { day: 'Пн', time: '10:00–21:00' },
  { day: 'Вт', time: '10:00–21:00' },
  { day: 'Ср', time: '10:00–21:00' },
  { day: 'Чт', time: '10:00–21:00' },
  { day: 'Пт', time: '10:00–21:00' },
  { day: 'Сб', time: '10:00–21:00' },
  { day: 'Вс', time: '10:00–21:00' },
]

const today = new Date().getDay() // 0=Sun, 1=Mon...
// map JS day index to our array index (Mon=0..Sun=6)
const todayIdx = today === 0 ? 6 : today - 1

export default function Contacts() {
  const [open, setOpen] = useState(false)

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
            <div className="space-y-4">

              {/* Address */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">📍</span>
                  <div>
                    <p className="font-bold text-navy mb-1">Адрес</p>
                    <p className="text-navy/80 text-sm font-medium">{CITY}</p>
                    <p className="text-navy/70 text-sm">{ADDRESS}</p>
                    <a
                      href={`https://yandex.com/maps/org/lucovica/72594546932/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-dark text-xs font-semibold mt-1.5 inline-block hover:text-rose-deep transition"
                    >
                      Открыть на Яндекс Картах →
                    </a>
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
                      href={`tel:${PHONE_HREF}`}
                      className="text-rose-dark font-semibold hover:text-rose-deep transition text-base"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).ym)
                          (window as any).ym(undefined, 'reachGoal', 'click_phone')
                      }}
                    >
                      {PHONE}
                    </a>
                  </div>
                </div>
              </div>

              {/* Telegram */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">✈️</span>
                  <div>
                    <p className="font-bold text-navy mb-1">Telegram</p>
                    <a
                      href={`https://t.me/${TG_USERNAME}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-dark font-semibold hover:text-rose-deep transition"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).ym)
                          (window as any).ym(undefined, 'reachGoal', 'click_telegram')
                      }}
                    >
                      @{TG_USERNAME}
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">🕐</span>
                  <div className="flex-1">
                    <p className="font-bold text-navy mb-2">Режим работы</p>
                    <div className="grid grid-cols-7 gap-1">
                      {HOURS.map((h, i) => (
                        <div
                          key={h.day}
                          className={`flex flex-col items-center rounded-lg py-1.5 px-1 ${
                            i === todayIdx
                              ? 'bg-rose-dark text-white'
                              : 'bg-beige/50 text-navy/70'
                          }`}
                        >
                          <span className="text-xs font-bold">{h.day}</span>
                          <span className="text-[10px] mt-0.5 leading-tight text-center">
                            {h.time.replace('–', '–\n')}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-navy/50 text-xs mt-2">Ежедневно 10:00–21:00</p>
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
            <div className="rounded-3xl overflow-hidden shadow-md border border-beige min-h-[400px]">
              <iframe
                src={MAP_SRC}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[400px]"
                frameBorder="0"
                allowFullScreen
                title="Студия LUCOVICA на карте — просп. Соколова, 68/118Вс1, Ростов-на-Дону"
              />
            </div>
          </div>
        </div>
      </section>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
