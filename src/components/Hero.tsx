'use client'

import Image from 'next/image'
import { useState } from 'react'
import LeadForm from './LeadForm'

export default function Hero() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-[calc(100vh-7rem)] flex flex-col bg-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-mist/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cream/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-5 md:px-12 pb-16 pt-10 md:pt-6">
          {/* Text */}
          <div className="flex-1 max-w-xl text-center md:text-left">
            {/* Promo badge */}
            <div className="inline-flex items-center gap-2 bg-dark/5 border border-dark/15 text-dark/50 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
              Первый визит — подмышки бесплатно
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-dark leading-tight mb-4">
              Студия<br />
              <span className="text-dark/40">лазерной эпиляции</span><br />
              и шугаринга
            </h1>

            <p className="text-base md:text-lg text-dark/50 mb-2 font-medium">
              В центре Ростова-на-Дону
            </p>

            <p className="text-sm text-dark font-medium tracking-wide mb-6 border-l-2 border-dark/20 pl-3">
              Результат — с первой процедуры
            </p>

            <p className="text-dark/40 text-sm md:text-base mb-8 max-w-sm mx-auto md:mx-0">
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
                  alt="Студия эпиляции LUCOVICA — лазерная эпиляция и шугаринг в Ростове-на-Дону"
                  fill
                  sizes="(max-width: 768px) 280px, 380px"
                  className="object-cover"
                  priority
                />
                {/* Fallback gradient when no photo */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-mist/60 to-cream/40 flex items-center justify-center">
                  <div className="text-center text-dark/20">
                    <div className="text-5xl font-thin tracking-widest mb-2">L</div>
                    <p className="text-xs tracking-widest uppercase">Lucovica</p>
                  </div>
                </div> */}
              </div>
              {/* Floating card */}
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
          <a href="#trust" className="text-dark/20 text-xl">↓</a>
        </div>
      </section>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
