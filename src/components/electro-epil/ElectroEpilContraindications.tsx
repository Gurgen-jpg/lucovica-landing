import { SectionHeader } from '@/components/ui'

const suitable = [
  'Светлые, рыжие и седые волосы',
  'Деликатные зоны лица — подбородок, губа, брови',
  'Единичные нежелательные волоски',
  'Коррекция после лазерной эпиляции',
  'Те, кому не подошёл лазер',
  'Желающие убрать волосы перманентно',
]

const contraindications = [
  'Кардиостимулятор',
  'Металлические имплантаты в зоне обработки',
  'Сахарный диабет (требуется консультация врача)',
  'Онкологические заболевания',
  'Беременность и лактация',
  'Кожные заболевания в стадии обострения',
]

export default function ElectroEpilContraindications() {
  return (
    <section id="contraindications" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Подходит ли вам"
          title="Кому можно, кому нельзя"
          description="Перед процедурой мастер проведёт консультацию и оценит противопоказания."
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
              При хронических заболеваниях — обязательно сообщите мастеру на консультации.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
