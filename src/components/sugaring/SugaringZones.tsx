import { SectionHeader } from '@/components/ui'

const zonesWomen = [
  { name: 'Ноги полностью', price: 'от 1 600 ₽', popular: true },
  { name: 'Глубокое бикини', price: 'от 1 500 ₽', popular: true },
  { name: 'Подмышки', price: 'от 600 ₽', popular: true },
  { name: 'Руки полностью', price: 'от 1 100 ₽', popular: false },
  { name: 'Спина полностью', price: 'от 1 200 ₽', popular: false },
  { name: 'Голени / Бёдра', price: 'от 900 ₽', popular: false },
  { name: 'Классическое бикини', price: 'от 900 ₽', popular: false },
  { name: 'Лицо полностью', price: 'от 900 ₽', popular: false },
  { name: 'Верхняя губа', price: 'от 300 ₽', popular: false },
]

const zonesMen = [
  { name: 'Глубокое бикини', price: 'от 2 900 ₽', popular: true },
  { name: 'Ноги полностью', price: 'от 2 000 ₽', popular: true },
  { name: 'Спина полностью', price: 'от 1 300 ₽', popular: true },
  { name: 'Руки полностью', price: 'от 1 800 ₽', popular: false },
  { name: 'Грудь', price: 'от 900 ₽', popular: false },
  { name: 'Подмышки', price: 'от 600 ₽', popular: false },
  { name: 'Борода (оформление)', price: 'от 600 ₽', popular: false },
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
            <span className={`text-xs font-semibold leading-tight ${z.popular ? 'text-white' : 'text-dark'}`}>{z.name}</span>
            {z.popular && (
              <span className="flex-shrink-0 text-[9px] bg-cream text-dark font-bold px-1.5 py-0.5 rounded-full">ХИТ</span>
            )}
          </div>
          <span className={`text-xs font-bold mt-auto ${z.popular ? 'text-cream' : 'text-dark/60'}`}>{z.price}</span>
        </div>
      ))}
    </div>
  )
}

export default function SugaringZones() {
  return (
    <section id="zones" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          sub="Зоны шугаринга"
          title="Все зоны — в одной студии"
          description="Шугаринг лица, тела и деликатных зон. Для женщин, мужчин и подростков."
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
          Есть отдельный прайс для юных леди и шугаринг у мастера Екатерины. Уточняйте на консультации.
        </p>
      </div>
    </section>
  )
}
