import { SectionHeader } from '@/components/ui'

const methods = [
  {
    name: 'Лазерная\nэпиляция',
    highlight: true,
    icon: '✦',
    pros: [
      'Результат с первой процедуры',
      'Диодный лазер — нет ожогов',
      'Работает с любым типом кожи',
      'Курс 6–10 сеансов → стойкий эффект',
      'Минимум дискомфорта (охлаждение)',
    ],
    cons: [],
  },
  {
    name: 'Шугаринг',
    highlight: false,
    icon: '◇',
    pros: ['Натуральный состав', 'Подходит для чувствительной кожи', 'Доступная цена'],
    cons: ['Нужно отращивать волосы', 'Результат временный (3–4 недели)', 'Регулярные визиты всегда'],
  },
  {
    name: 'Бритьё',
    highlight: false,
    icon: '—',
    pros: ['Быстро', 'Дёшево'],
    cons: ['Каждые 2–3 дня заново', 'Раздражение и врастание', 'Нет долгосрочного эффекта'],
  },
  {
    name: 'Воск',
    highlight: false,
    icon: '◈',
    pros: ['Дольше бритья (3–4 нед.)', 'Доступно дома'],
    cons: ['Болезненно', 'Риск раздражения и вросших', 'Нужно отращивать волосы'],
  },
]

export default function LaserEpilWhy() {
  return (
    <section id="why" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          sub="Сравнение методов"
          title="Почему лазер — лучший выбор"
          description="Если надоело тратить время на эпиляцию снова и снова — лазер решает вопрос надолго."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {methods.map((m) => (
            <div
              key={m.name}
              className={`rounded-2xl p-5 border ${
                m.highlight
                  ? 'bg-dark text-white border-dark shadow-xl'
                  : 'bg-white border-mist'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xl ${m.highlight ? 'text-cream' : 'text-dark/40'}`}>
                  {m.icon}
                </span>
                <h3 className={`font-bold text-sm whitespace-pre-line ${m.highlight ? 'text-white' : 'text-dark'}`}>
                  {m.name}
                </h3>
                {m.highlight && (
                  <span className="ml-auto text-[10px] bg-cream text-dark font-bold px-2 py-0.5 rounded-full">
                    Выбор
                  </span>
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
