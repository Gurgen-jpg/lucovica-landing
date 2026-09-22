export default function CertHero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-mist/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cream/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-12 pt-10 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-dark/5 border border-dark/15 text-dark/50 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
          Подарки близким
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-dark leading-tight mb-4">
          Подарочные<br />
          <span className="text-dark/40">сертификаты</span>
        </h1>

        <p className="text-base md:text-lg text-dark/50 mb-2 font-medium">
          Студия LUCOVICA — просп. Соколова, 68
        </p>

        <p className="text-dark/40 text-sm md:text-base mb-8 max-w-md mx-auto">
          Подарите красоту и уход. Сертификат действует на любые услуги студии.
        </p>

        <a href="#pricing" className="btn-primary text-base px-8 py-4">
          Выбрать номинал
        </a>
      </div>
    </section>
  )
}
