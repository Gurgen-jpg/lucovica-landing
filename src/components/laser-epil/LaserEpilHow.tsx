import { SectionHeader } from '@/components/ui'

const steps = [
  {
    num: '01',
    title: 'Консультация',
    desc: 'Мастер изучает тип кожи и волос, уточняет противопоказания, подбирает параметры лазера индивидуально.',
  },
  {
    num: '02',
    title: 'Подготовка зоны',
    desc: 'Кожа очищается, при необходимости наносится охлаждающий гель. Мастер надевает защитные очки — вам тоже выдадут.',
  },
  {
    num: '03',
    title: 'Лазерная обработка',
    desc: 'Диодный лазер 808 нм проходит по зоне импульсами. Встроенная система охлаждения снижает дискомфорт до минимума.',
  },
  {
    num: '04',
    title: 'Уход после процедуры',
    desc: 'Мастер наносит успокаивающее средство и даёт рекомендации: не загорать 2 недели, не посещать сауну 48 часов.',
  },
  {
    num: '05',
    title: 'Результат',
    desc: 'Через 10–21 день обработанные волосы выпадут. Уже после первой процедуры рост заметно замедляется.',
  },
]

export default function LaserEpilHow() {
  return (
    <section id="how" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Как всё проходит"
          title="Процедура шаг за шагом"
          description="Всё занимает от 15 минут (подмышки) до 90 минут (ноги полностью). Без боли, без страха."
        />

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-dark flex items-center justify-center">
                <span className="text-cream text-xs font-bold">{step.num}</span>
              </div>
              <div className="flex-1 bg-white border border-mist rounded-2xl px-5 py-4">
                <h3 className="font-bold text-dark text-sm mb-1">{step.title}</h3>
                <p className="text-dark/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick note */}
        <div className="mt-8 bg-cream/30 border border-cream rounded-2xl px-6 py-4 text-center">
          <p className="text-dark text-sm font-medium">
            Перед первым визитом: сбрить волосы в зоне за 1–3 дня. Не нужно отращивать — только брить.
          </p>
        </div>
      </div>
    </section>
  )
}
