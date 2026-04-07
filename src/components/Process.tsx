const steps = [
  {
    num: '01',
    icon: '📅',
    title: 'Запись',
    desc: 'Выбираете услугу и удобное время онлайн или по телефону. Мы подтверждаем запись в течение часа.',
  },
  {
    num: '02',
    icon: '🛋️',
    title: 'Подготовка',
    desc: 'Мастер проводит консультацию, оценивает тип кожи и волос. Кабинет подготовлен по стандартам стерильности.',
  },
  {
    num: '03',
    icon: '✨',
    title: 'Процедура',
    desc: 'Комфортное удаление волос современными методами. Для вас — вкусный кофе и спокойная атмосфера.',
  },
  {
    num: '04',
    icon: '💆',
    title: 'Уход после',
    desc: 'Мастер нанесёт успокаивающее средство и даст персональные рекомендации для поддержания результата.',
  },
]

export default function Process() {
  return (
    <section className="py-20 px-5 md:px-12 bg-gradient-to-br from-cream-200 to-cream-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-sub">Как это работает</p>
          <h2 className="section-title">Как проходит процедура</h2>
          <p className="text-navy/60 text-sm md:text-base max-w-xl mx-auto">
            Каждый визит в LUCOVICA — это не просто процедура, а маленький ритуал заботы о себе.
          </p>
        </div>

        <div className="relative">
          {/* Connector line for md+ */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-light via-rose to-rose-light mx-24 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-rose flex items-center justify-center shadow-md mb-4">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <span className="text-rose-dark/40 text-xs font-bold tracking-widest mb-1">{step.num}</span>
                <h3 className="font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-navy/60 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety block */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: '🧴', title: 'Гипоаллергенные материалы', desc: 'Косметика без парабенов и резких ароматизаторов' },
            { icon: '🩺', title: 'Индивидуальные расходники', desc: 'Новый зонд для каждого клиента при электроэпиляции' },
            { icon: '🔒', title: 'Безопасность гарантирована', desc: 'Следуем медицинским стандартам асептики и антисептики' },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-5 border border-beige shadow-sm flex gap-4">
              <span className="text-2xl mt-0.5">{b.icon}</span>
              <div>
                <p className="font-bold text-navy text-sm mb-1">{b.title}</p>
                <p className="text-navy/60 text-xs">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
