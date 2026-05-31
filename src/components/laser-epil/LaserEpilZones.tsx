import { SectionHeader } from '@/components/ui'

const zonesWomen = [
  { name: 'Ноги полностью', price: 'от 4 490 ₽', popular: true },
  { name: 'Глубокое бикини', price: 'от 3 290 ₽', popular: true },
  { name: 'Подмышки', price: 'от 1 690 ₽', popular: true },
  { name: 'Руки полностью', price: 'от 3 290 ₽', popular: false },
  { name: 'Классическое бикини', price: 'от 2 190 ₽', popular: false },
  { name: 'Голени / Бёдра', price: 'от 2 790 ₽', popular: false },
  { name: 'Спина + поясница', price: 'от 2 990 ₽', popular: false },
  { name: 'Живот', price: 'от 2 190 ₽', popular: false },
  { name: 'Ягодицы', price: 'от 2 190 ₽', popular: false },
  { name: 'Верхняя губа', price: 'от 990 ₽', popular: false },
  { name: 'Плечи', price: 'от 1 990 ₽', popular: false },
  { name: 'Зоны мини', price: 'от 1 490 ₽', popular: false },
]

const zonesMen = [
  { name: 'Спина полностью', price: 'от 4 990 ₽', popular: true },
  { name: 'Грудь', price: 'от 3 490 ₽', popular: true },
  { name: 'Подмышки', price: 'от 1 990 ₽', popular: true },
  { name: 'Плечи + руки', price: 'от 3 290 ₽', popular: false },
  { name: 'Шея', price: 'от 1 990 ₽', popular: false },
  { name: 'Живот', price: 'от 2 490 ₽', popular: false },
  { name: 'Ягодицы', price: 'от 2 490 ₽', popular: false },
  { name: 'Ноги полностью', price: 'от 4 990 ₽', popular: false },
  { name: 'Борода / Усы', price: 'от 1 990 ₽', popular: false },
  { name: 'Зоны мини', price: 'от 1 490 ₽', popular: false },
]

function ZoneGrid({ zones }: { zones: typeof zonesWomen }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {zones.map((z) => (
        <div
          key={z.name}
          className={`rounded-2xl border p-4 flex flex-col gap-1 ${
            z.popular ? 'bg-dark text-white border-dark' : 'bg-white border-mist'
          }`}
        >
          <div className="flex items-start justify-between gap-1">
            <span className={`text-xs font-semibold leading-tight ${z.popular ? 'text-white' : 'text-dark'}`}>
              {z.name}
            </span>
            {z.popular && (
              <span className="flex-shrink-0 text-[9px] bg-cream text-dark font-bold px-1.5 py-0.5 rounded-full">
                ХИТ
              </span>
            )}
          </div>
          <span className={`text-xs font-bold mt-auto ${z.popular ? 'text-cream' : 'text-dark/60'}`}>
            {z.price}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function LaserEpilZones() {
  return (
    <section id="zones" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          sub="Зоны лазерной эпиляции"
          title="Все зоны — в одной студии"
          description="Лазерная эпиляция лица, тела, деликатных зон. Для женщин и мужчин."
        />

        <div className="space-y-10">
          <div>
            <h3 className="text-dark font-bold text-sm uppercase tracking-widest mb-4">Женщинам</h3>
            <ZoneGrid zones={zonesWomen} />
          </div>
          <div>
            <h3 className="text-dark font-bold text-sm uppercase tracking-widest mb-4">Мужчинам</h3>
            <ZoneGrid zones={zonesMen} />
          </div>
        </div>

        <p className="text-center text-dark/40 text-xs mt-6">
          Цены указаны за один сеанс. Точная стоимость — на консультации у мастера.
        </p>
      </div>
    </section>
  )
}
