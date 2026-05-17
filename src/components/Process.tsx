const steps = [
  {
    num: '01',
    title: 'Запись',
    desc: 'Выбираете услугу и удобное время онлайн или по телефону. Мы подтверждаем запись в течение часа.',
  },
  {
    num: '02',
    title: 'Подготовка',
    desc: 'Мастер проводит консультацию, оценивает тип кожи и волос. Кабинет подготовлен по стандартам стерильности.',
  },
  {
    num: '03',
    title: 'Процедура',
    desc: 'Комфортное удаление волос современными методами. Для вас — кофе и спокойная атмосфера.',
  },
  {
    num: '04',
    title: 'Уход после',
    desc: 'Мастер нанесёт успокаивающее средство и даст персональные рекомендации для поддержания результата.',
  },
]

import { SectionHeader } from '@/components/ui'

export default function Process() {
  return (
    <section className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          sub="Как это работает"
          title="Как проходит процедура"
          description="Каждый визит в LUCOVICA — это не просто процедура, а маленький ритуал заботы о себе."
        />

        <div className="relative">
          {/* Connector line for md+ */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-dark/10 mx-24 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white border border-dark/15 flex items-center justify-center shadow-sm mb-4">
                  <span className="text-xl font-bold text-dark/40 tracking-widest">{step.num}</span>
                </div>
                <h3 className="font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-dark/60 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety block */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { title: 'Гипоаллергенные материалы', desc: 'Косметика без парабенов и резких ароматизаторов' },
            { title: 'Индивидуальные расходники', desc: 'Новый зонд для каждого клиента при электроэпиляции' },
            { title: 'Безопасность гарантирована', desc: 'Следуем медицинским стандартам асептики и антисептики' },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-5 border border-mist shadow-sm">
              <p className="font-bold text-dark text-sm mb-1">{b.title}</p>
              <p className="text-dark/60 text-xs">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
