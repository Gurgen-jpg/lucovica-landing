'use client'

import { useState } from 'react'
import LeadForm from './LeadForm'
import { SectionHeader } from '@/components/ui'

import { PHONE, PHONE_HREF, TG_USERNAME } from '@/lib/site-config'

const ADDRESS = 'просп. Соколова, 68/118Вс1, этаж 1'
const CITY = 'Ростов-на-Дону'
const MAP_SRC = 'https://yandex.ru/map-widget/v1/org/lucovica/72594546932/?ll=39.718390,47.231276&z=16'

const HOURS = [
  { day: 'Пн', time: '10–21' },
  { day: 'Вт', time: '10–21' },
  { day: 'Ср', time: '10–21' },
  { day: 'Чт', time: '10–21' },
  { day: 'Пт', time: '10–21' },
  { day: 'Сб', time: '10–21' },
  { day: 'Вс', time: '10–21' },
]

const today = new Date().getDay()
const todayIdx = today === 0 ? 6 : today - 1

export default function Contacts() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section id="contacts" className="py-20 px-5 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeader sub="Как нас найти" title="Контакты" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info */}
            <div className="space-y-4">

              {/* Address */}
              <div className="card">
                <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-2">Адрес</p>
                <p className="text-dark font-medium text-sm">{CITY}</p>
                <p className="text-dark/70 text-sm">{ADDRESS}</p>
                <a
                  href="https://yandex.com/maps/org/lucovica/72594546932/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark/50 text-xs font-semibold mt-1.5 inline-block hover:text-dark transition"
                >
                  Открыть на Яндекс Картах →
                </a>
              </div>

              {/* Phone */}
              <div className="card">
                <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-2">Телефон</p>
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="text-dark font-semibold hover:text-dark/70 transition text-base"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).ym)
                      (window as any).ym(undefined, 'reachGoal', 'click_phone')
                  }}
                >
                  {PHONE}
                </a>
              </div>

              {/* Telegram */}
              <div className="card">
                <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-2">Telegram</p>
                <a
                  href={`https://t.me/${TG_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark font-semibold hover:text-dark/70 transition"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).ym)
                      (window as any).ym(undefined, 'reachGoal', 'click_telegram')
                  }}
                >
                  @{TG_USERNAME}
                </a>
              </div>

              {/* Hours */}
              <div className="card">
                <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-3">Режим работы</p>
                <div className="grid grid-cols-7 gap-1">
                  {HOURS.map((h, i) => (
                    <div
                      key={h.day}
                      className={`flex flex-col items-center rounded-lg py-2 px-1 ${
                        i === todayIdx
                          ? 'bg-dark text-white'
                          : 'bg-mist/40 text-dark/60'
                      }`}
                    >
                      <span className="text-xs font-bold">{h.day}</span>
                      <span className="text-[10px] mt-0.5">{h.time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-dark/40 text-xs mt-2">Ежедневно 10:00–21:00</p>
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
            <div className="rounded-3xl overflow-hidden shadow-md border border-mist min-h-[400px]">
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
