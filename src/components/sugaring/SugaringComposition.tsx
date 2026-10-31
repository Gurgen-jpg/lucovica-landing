const features = [
  { icon: '◇', title: 'Только сахар, вода и сок лимона', desc: 'Натуральный состав без отдушек, красителей и химических добавок' },
  { icon: '✿', title: 'Гипоаллергенно', desc: 'Подходит для чувствительной и склонной к раздражению кожи' },
  { icon: '♨', title: 'Комфортная температура', desc: 'Паста чуть теплее тела — не обжигает кожу, в отличие от горячего воска' },
  { icon: '↺', title: 'По росту волос', desc: 'Удаление по росту снижает обламывание и риск вросших волос' },
]

export default function SugaringComposition() {
  return (
    <section id="composition" className="py-20 px-5 md:px-12 bg-dark">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-3">Состав пасты</p>
          <h2 className="text-white text-3xl md:text-4xl font-normal mb-4">
            Натуральная сахарная паста —<br />
            <span className="text-white/50">бережно к коже</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
            В основе пасты — только сахар, вода и лимонная кислота. Никакой химии, смол и
            искусственных компонентов. Поэтому шугаринг подходит даже тем, у кого кожа реагирует на воск.
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
