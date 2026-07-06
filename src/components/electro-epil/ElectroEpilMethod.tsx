const features = [
  { icon: '⚡', title: 'Разрушение фолликула', desc: 'Слабый ток воздействует на зону роста волоса — он перестаёт расти насовсем' },
  { icon: '✚', title: 'Стерильные иглы', desc: 'Одноразовая стерильная игла для каждого клиента — полная гигиена' },
  { icon: '◉', title: 'Не зависит от пигмента', desc: 'В отличие от лазера, работает с волосами любого цвета — даже седыми' },
  { icon: '✓', title: 'Доказанная эффективность', desc: 'Единственный метод, официально признанный способом перманентного удаления волос' },
]

export default function ElectroEpilMethod() {
  return (
    <section id="method" className="py-20 px-5 md:px-12 bg-dark">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-3">Как это работает</p>
          <h2 className="text-white text-3xl md:text-4xl font-normal mb-4">
            Перманентное удаление —<br />
            <span className="text-white/50">волосок за волоском</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
            Через тончайшую иглу в фолликул подаётся слабый электрический разряд. Он разрушает
            клетки, отвечающие за рост волоса. Обработанный волос больше не вырастет.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4">
              <span className="text-cream text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
