'use client'

import { useState } from 'react'
import Image from 'next/image'
import LogoDivider from '@/components/LogoDivider'
import LeadForm from '@/components/LeadForm'
import { PHONE_HREF } from '@/lib/site-config'

declare const ym: (id: number, action: string, goal: string) => void
const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID)

export default function LaserEpilHero() {
  const [open, setOpen] = useState(false)

  const handleCTA = () => {
    try { ym(YM_ID, 'reachGoal', 'laser_epil_cta_click') } catch {}
    setOpen(true)
  }

  const handlePhone = () => {
    try { ym(YM_ID, 'reachGoal', 'laser_epil_phone_click') } catch {}
  }

  return (
    <>
      <header className="relative bg-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-mist/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cream/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-5 md:px-12 py-5">
          <a href="/">
            <LogoDivider
              sourse="/Logo_main_black_no background.png"
              width={120}
              height={80}
            />
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-dark/60">
            <a href="/#services" className="hover:text-dark transition">Услуги</a>
            <a href="/#pricing" className="hover:text-dark transition">Цены</a>
            <LogoDivider
              sourse="/Symbol_black_no background.png"
              width={48}
              height={48}
            />
            <a href="/#reviews" className="hover:text-dark transition">Отзывы</a>
            <a href="/#contacts" className="hover:text-dark transition">Контакты</a>
          </div>
          <a
            href={`tel:${PHONE_HREF}`}
            onClick={handlePhone}
            className="hidden md:flex items-center gap-2 text-dark/70 font-semibold text-sm hover:text-dark transition"
          >
            Позвонить
          </a>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 px-5 md:px-12 pb-16 pt-6 md:pt-4">
          {/* Text */}
          <div className="flex-1 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-dark/5 border border-dark/15 text-dark/50 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
              Первый визит — подмышки бесплатно
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-dark leading-tight mb-4">
              Лазерная<br />
              <span className="text-dark/40">эпиляция</span><br />
              в Ростове-на-Дону
            </h1>

            <p className="text-base md:text-lg text-dark/50 mb-2 font-medium">
              Студия LUCOVICA — просп. Соколова, 68
            </p>

            <p className="text-sm text-dark font-medium tracking-wide mb-6 border-l-2 border-dark/20 pl-3">
              Результат заметен уже после первой процедуры
            </p>

            <p className="text-dark/40 text-sm md:text-base mb-8 max-w-sm mx-auto md:mx-0">
              Диодный лазер 808 нм, индивидуальный подбор параметров, система охлаждения.
              Подходит для любого типа кожи и волос.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={handleCTA}
                className="btn-primary text-base px-8 py-4 animate-pulse-soft"
              >
                Записаться онлайн
              </button>
              <a
                href={`tel:${PHONE_HREF}`}
                onClick={handlePhone}
                className="btn-outline text-base px-8 py-4"
              >
                Позвонить
              </a>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
              {['Все зоны тела', 'Женщинам', 'Мужчинам', 'Подросткам от 16 лет', 'Любой тип кожи'].map((tag) => (
                <span
                  key={tag}
                  className="bg-dark/5 border border-dark/10 text-dark/50 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex justify-center md:justify-end max-w-sm md:max-w-md w-full">
            <div className="relative w-full aspect-[3/4] max-w-xs md:max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cream/30 to-mist rounded-[2.5rem] rotate-3" />
              <div className="absolute inset-0 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image
                  src="/hero-photo.webp"
                  alt="Лазерная эпиляция в студии LUCOVICA — Ростов-на-Дону, просп. Соколова 68"
                  fill
                  sizes="(max-width: 768px) 280px, 380px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-mist">
                <div className="w-10 h-10 rounded-full bg-cream/50 flex items-center justify-center text-sm font-bold text-dark">
                  5.0
                </div>
                <div>
                  <p className="text-xs text-dark/50">Рейтинг</p>
                  <p className="font-bold text-dark text-sm">500+ отзывов</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex justify-center pb-6 animate-bounce">
          <a href="#why" className="text-dark/20 text-xl">↓</a>
        </div>
      </header>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
