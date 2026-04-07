'use client'

import Image from 'next/image'
import { useState } from 'react'
import LeadForm from './LeadForm'

export default function Hero() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="relative min-h-screen flex flex-col bg-gradient-to-br from-cream-200 via-cream-100 to-rose-light/20 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-beige/60 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-5 md:px-12 py-5">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="LUCOVICA — студия эпиляции"
              width={160}
              height={56}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-navy/70">
            <a href="#services" className="hover:text-rose-dark transition">Услуги</a>
            <a href="#pricing" className="hover:text-rose-dark transition">Цены</a>
            <a href="#reviews" className="hover:text-rose-dark transition">Отзывы</a>
            <a href="#contacts" className="hover:text-rose-dark transition">Контакты</a>
          </div>
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE ?? '+7-961-XXX-XX-XX'}`}
            className="hidden md:flex items-center gap-2 text-rose-dark font-semibold text-sm hover:text-rose-deep transition"
          >
            📞 Позвонить
          </a>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-5 md:px-12 pb-16 pt-6 md:pt-0">
          {/* Text */}
          <div className="flex-1 max-w-xl text-center md:text-left">
            {/* Promo badge */}
            <div className="inline-flex items-center gap-2 bg-rose-light/60 border border-rose/40 text-rose-deep text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              🎁 Первый визит — скидка 20%
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy leading-tight mb-4">
              Студия<br />
              <span className="text-rose-dark">лазерной эпиляции</span><br />
              и шугаринга
            </h1>

            <p className="text-base md:text-lg text-navy/70 mb-2 font-medium">
              В центре Ростова-на-Дону
            </p>

            <p className="text-navy/60 text-sm md:text-base mb-8 max-w-sm mx-auto md:mx-0">
              Гладкая кожа без боли и забот. Опытные мастера, сертифицированное оборудование,
              стерильность и уютная атмосфера — всё для вашего комфорта.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => setOpen(true)}
                className="btn-primary text-base px-8 py-4 animate-pulse-soft"
              >
                Записаться онлайн
              </button>
              <a href="#services" className="btn-outline text-base px-8 py-4">
                Услуги и цены
              </a>
            </div>

            {/* Quick badges */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
              {['Лазерная эпиляция', 'Шугаринг', 'Мужская эпиляция', 'Подростки'].map((tag) => (
                <span
                  key={tag}
                  className="bg-white/70 border border-beige text-navy/70 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex justify-center md:justify-end max-w-sm md:max-w-md w-full">
            <div className="relative w-full aspect-[3/4] max-w-xs md:max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-rose/30 to-beige rounded-[2.5rem] rotate-3" />
              <div className="absolute inset-0 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image
                  src="/hero-photo.jpg"
                  alt="Студия эпиляции LUCOVICA — лазерная эпиляция и шугаринг в Ростове-на-Дону"
                  fill
                  sizes="(max-width: 768px) 280px, 380px"
                  className="object-cover"
                  priority
                />
                {/* Fallback gradient when no photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-light via-cream-200 to-beige flex items-center justify-center">
                  <div className="text-center text-navy/40">
                    <div className="text-6xl mb-2">🌸</div>
                    <p className="text-sm">Фото студии</p>
                  </div>
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-beige">
                <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center text-xl">⭐</div>
                <div>
                  <p className="text-xs text-navy/50">Рейтинг</p>
                  <p className="font-bold text-navy text-sm">4.9 / 500+ отзывов</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex justify-center pb-6 animate-bounce">
          <a href="#trust" className="text-rose-dark/50 text-xl">↓</a>
        </div>
      </header>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
