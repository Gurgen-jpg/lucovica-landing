import { SectionHeader } from '@/components/ui'

const cases = [
  { icon: '☺', title: 'Лицо', desc: 'Подбородок, верхняя губа, брови, щёки — точная работа на деликатных зонах' },
  { icon: '❄', title: 'Седые волосы', desc: 'Удаляет седину, которую лазер не видит из-за отсутствия пигмента' },
  { icon: '○', title: 'Светлые и рыжие', desc: 'Работает с волосами любого цвета, недоступными для лазера' },
  { icon: '⟳', title: 'После лазера', desc: 'Финишная коррекция единичных непрокрашенных волосков' },
  { icon: '✶', title: 'Единичные волоски', desc: 'Точечное удаление отдельных нежелательных волосков' },
  { icon: '♦', title: 'Родинки и шрамы', desc: 'Удаление волос в зонах, где лазер применять нельзя' },
]

export default function ElectroEpilZones() {
  return (
    <section id="zones" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          sub="Когда нужна"
          title="Для каких задач подходит"
          description="Электроэпиляция незаменима там, где другие методы не дают результата."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <div key={c.title} className="bg-white border border-mist rounded-2xl p-5">
              <span className="text-dark/40 text-2xl">{c.icon}</span>
              <h3 className="text-dark font-bold text-sm mt-3 mb-1">{c.title}</h3>
              <p className="text-dark/60 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
