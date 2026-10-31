import { SectionHeader } from '@/components/ui'
import { SERVICES } from '@/lib/services-data'

const COMPLEX_IDS = ['laser-complexes-women', 'laser-complexes-men']

function fmt(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function ComplexPricing() {
  const categories = SERVICES.filter((s) => COMPLEX_IDS.includes(s.id))

  return (
    <section id="pricing" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Прейскурант"
          title="Цены на комплексы"
          description="Все цены за один сеанс."
          spacing="sm"
        />

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl border border-mist overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-mist">
                <h3 className="font-bold text-dark text-sm">{category.title}</h3>
              </div>
              <div className="divide-y divide-mist">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between px-5 py-3 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-dark text-sm font-medium">{item.name}</p>
                      <p className="text-dark/40 text-xs">{item.short}</p>
                    </div>
                    <span className="font-bold text-dark text-sm flex-shrink-0">{fmt(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
