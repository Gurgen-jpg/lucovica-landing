import { SectionHeader } from '@/components/ui'

const methods = [
  {
    name: 'Шугаринг',
    highlight: true,
    icon: '◇',
    pros: [
      'Натуральная паста без химии',
      'Меньше вросших волос',
      'Подходит чувствительной коже',
      'Гладкость на 3–4 недели',
      'Можно с подросткового возраста',
    ],
    cons: [],
  },
  {
    name: 'Воск',
    highlight: false,
    icon: '◈',
    pros: ['Дольше бритья', 'Доступно дома'],
    cons: ['Прилипает к коже — больнее', 'Выше риск раздражения', 'Чаще вросшие волосы'],
  },
  {
    name: 'Бритьё',
    highlight: false,
    icon: '—',
    pros: ['Быстро', 'Дёшево'],
    cons: ['Каждые 2–3 дня заново', 'Раздражение и щетина', 'Врастание волос'],
  },
  {
    name: 'Крем-депилятор',
    highlight: false,
    icon: '○',
    pros: ['Без боли', 'Быстро'],
    cons: ['Химический состав', 'Аллергия и ожоги', 'Результат на 2–3 дня'],
  },
]

export default function SugaringWhy() {
  return (
    <section id="why" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          sub="Сравнение методов"
          title="Почему шугаринг"
          description="Самый бережный способ удаления волос для тех, кто ценит натуральность и комфорт."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {methods.map((m) => (
            <div
              key={m.name}
              className={`rounded-2xl p-5 border ${
                m.highlight ? 'bg-dark text-white border-dark shadow-xl' : 'bg-white border-mist'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xl ${m.highlight ? 'text-cream' : 'text-dark/40'}`}>{m.icon}</span>
                <h3 className={`font-bold text-sm ${m.highlight ? 'text-white' : 'text-dark'}`}>{m.name}</h3>
                {m.highlight && (
                  <span className="ml-auto text-[10px] bg-cream text-dark font-bold px-2 py-0.5 rounded-full">Выбор</span>
                )}
              </div>
              <ul className="space-y-1.5">
                {m.pros.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-xs">
                    <span className={`mt-0.5 flex-shrink-0 ${m.highlight ? 'text-cream' : 'text-dark/40'}`}>✓</span>
                    <span className={m.highlight ? 'text-white/90' : 'text-dark/70'}>{p}</span>
                  </li>
                ))}
                {m.cons.map((c) => (
                  <li key={c} className="flex items-start gap-1.5 text-xs">
                    <span className="mt-0.5 flex-shrink-0 text-dark/30">✗</span>
                    <span className="text-dark/40">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
