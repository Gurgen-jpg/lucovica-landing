import { SectionHeader } from '@/components/ui'

const stats = [
  { value: '20–30%', label: 'снижение плотности волос уже после первой процедуры' },
  { value: '6–10', label: 'сеансов — полный курс для стойкого результата' },
  { value: '4–8 нед.', label: 'интервал между процедурами' },
  { value: '10–21 день', label: 'выпадение волос после каждого сеанса' },
]

export default function LaserEpilResults() {
  return (
    <section id="results" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Чего ожидать"
          title="Результаты лазерной эпиляции"
          description="Реальные цифры — без преувеличений."
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.value} className="bg-white border border-mist rounded-2xl p-5 text-center">
              <p className="text-dark font-bold text-2xl md:text-3xl mb-2">{s.value}</p>
              <p className="text-dark/50 text-xs leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Before/after placeholder grid */}
        <div>
          <h3 className="text-dark font-bold text-sm uppercase tracking-widest mb-4 text-center">Фото до / после</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {['Подмышки', 'Ноги', 'Бикини'].map((zone) => (
              <div key={zone} className="rounded-2xl overflow-hidden border border-mist">
                <div className="w-full aspect-[4/3] bg-mist/40 flex items-center justify-center">
                  <span className="text-dark/30 text-sm">Фото — {zone} до/после</span>
                </div>
                <div className="bg-white px-4 py-2">
                  <p className="text-dark/60 text-xs font-medium">{zone}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-dark/30 text-xs mt-3">
            Фотографии результатов появятся здесь
          </p>
        </div>
      </div>
    </section>
  )
}
