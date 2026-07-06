import { SectionHeader } from '@/components/ui'

const suitable = [
  'Чувствительная кожа, склонная к раздражению',
  'Аллергия на воск и кремы-депиляторы',
  'Женщины, мужчины и подростки',
  'Беременные (после консультации с врачом)',
  'Тонкие и светлые волосы',
  'Деликатные зоны — бикини, лицо, подмышки',
]

const contraindications = [
  'Сахарный диабет (требуется консультация врача)',
  'Свежий загар (солнце, солярий) — 2 дня до и после',
  'Повреждения и воспаления кожи в зоне обработки',
  'Тромбофлебит, варикоз в зоне процедуры',
  'Эпилепсия (для некоторых зон)',
  'Обострение кожных заболеваний',
]

export default function SugaringContraindications() {
  return (
    <section id="contraindications" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Подходит ли вам"
          title="Кому можно, кому нельзя"
          description="Перед процедурой мастер уточнит особенности вашей кожи и здоровья."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-mist/20 border border-mist rounded-2xl p-6">
            <h3 className="text-dark font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-dark flex items-center justify-center text-white text-xs">✓</span>
              Кому подходит
            </h3>
            <ul className="space-y-2">
              {suitable.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-dark/70">
                  <span className="mt-0.5 text-dark/40 flex-shrink-0">·</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-mist rounded-2xl p-6">
            <h3 className="text-dark font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-mist flex items-center justify-center text-dark/60 text-xs">✗</span>
              Противопоказания
            </h3>
            <ul className="space-y-2">
              {contraindications.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-dark/60">
                  <span className="mt-0.5 text-dark/30 flex-shrink-0">·</span>
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-xs text-dark/40 mt-4 border-t border-mist pt-3">
              Сомневаетесь? Спросите мастера на консультации — это бесплатно.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
