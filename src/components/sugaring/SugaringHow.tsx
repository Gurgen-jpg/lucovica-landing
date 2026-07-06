import { SectionHeader } from '@/components/ui'

const steps = [
  { num: '01', title: 'Подготовка кожи', desc: 'Мастер очищает и обезжиривает зону, наносит тальк — паста будет работать только с волосками, а не с кожей.' },
  { num: '02', title: 'Нанесение пасты', desc: 'Сахарная паста наносится против роста волос. Она равномерно обволакивает каждый волосок у основания.' },
  { num: '03', title: 'Удаление по росту', desc: 'Паста снимается резким движением по росту волос — это снижает риск обламывания и врастания.' },
  { num: '04', title: 'Уход после', desc: 'Мастер наносит успокаивающее и увлажняющее средство, даёт рекомендации по домашнему уходу.' },
  { num: '05', title: 'Результат', desc: 'Гладкая кожа сразу после процедуры. Эффект держится 3–4 недели, волосы отрастают мягкими.' },
]

export default function SugaringHow() {
  return (
    <section id="how" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Как всё проходит"
          title="Процедура шаг за шагом"
          description="От 10 минут (подмышки) до 60 минут (ноги полностью). Бережно и гигиенично."
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

        <div className="mt-8 bg-cream/30 border border-cream rounded-2xl px-6 py-4 text-center">
          <p className="text-dark text-sm font-medium">
            Перед визитом: длина волос должна быть 3–5 мм. Не брить за 2 недели до процедуры.
          </p>
        </div>
      </div>
    </section>
  )
}
