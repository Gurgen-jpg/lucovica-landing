import { SectionHeader } from '@/components/ui'

const steps = [
  { num: '01', title: 'Консультация', desc: 'Мастер оценивает зону, тип волос и кожи, при необходимости подбирает анестезию. Уточняет противопоказания.' },
  { num: '02', title: 'Обезболивание', desc: 'По желанию наносится местный анестетик, чтобы сделать процедуру максимально комфортной.' },
  { num: '03', title: 'Введение иглы', desc: 'Тончайшая стерильная игла вводится вдоль волоса в фолликул — без прокола кожи.' },
  { num: '04', title: 'Импульс тока', desc: 'Слабый разряд разрушает зону роста волоса. Волосок извлекается без усилия.' },
  { num: '05', title: 'Уход после', desc: 'Мастер обрабатывает зону успокаивающим средством и даёт рекомендации. Покраснение проходит за 1–3 дня.' },
]

export default function ElectroEpilHow() {
  return (
    <section id="how" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Как всё проходит"
          title="Процедура шаг за шагом"
          description="Каждый волосок обрабатывается индивидуально — это и обеспечивает перманентный результат."
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
            Перед визитом: не выщипывайте волосы 2 недели — для процедуры нужен волос в фолликуле.
          </p>
        </div>
      </div>
    </section>
  )
}
