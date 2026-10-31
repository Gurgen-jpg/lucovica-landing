import { SectionHeader } from '@/components/ui'

const suitable = [
  'Тёмные, светлые или пушковые волосы',
  'Любой фототип кожи (1–6)',
  'Женщины и мужчины',
  'Подростки от 16 лет (со стабильным гормональным фоном)',
  'Светлая и смуглая кожа',
  'Чувствительная кожа — лазер не раздражает',
]

const contraindications = [
  'Беременность и период лактации',
  'Активный загар (солярий, пляж) — за 2 недели до',
  'Обострение кожных заболеваний в зоне обработки',
  'Онкологические заболевания',
  'Приём фотосенсибилизирующих препаратов',
  'Металлические имплантаты в зоне процедуры',
]

export default function LaserEpilContraindications() {
  return (
    <section id="contraindications" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Подходит ли вам"
          title="Кому можно, кому нельзя"
          description="Перед процедурой мастер проведёт короткую консультацию и уточнит все детали."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Suitable */}
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

          {/* Contraindications */}
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
              При наличии хронических заболеваний или сомнениях — спросите мастера на консультации, это бесплатно.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
