import Link from 'next/link'
import { SectionHeader } from '@/components/ui'

const points = [
  {
    icon: '∞',
    title: 'Перманентный результат',
    desc: 'Разрушает зону роста волоса — фолликул больше не работает. Единственный метод с признанной гарантией.',
  },
  {
    icon: '◐',
    title: 'Любой цвет волос',
    desc: 'Светлые, рыжие, седые — электроэпиляция удаляет волосы, которые не берёт лазер из-за отсутствия пигмента.',
  },
  {
    icon: '✶',
    title: 'Ювелирная точность',
    desc: 'Каждый волосок обрабатывается отдельно. Идеально для лица, бровей и единичных волосков.',
  },
  {
    icon: '⟳',
    title: 'Финиш после лазера',
    desc: 'Убирает оставшиеся непрокрашенные волоски, которые лазер не смог обработать — для идеальной гладкости.',
  },
]

export default function ElectroEpilWhy() {
  return (
    <section id="why" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Почему электроэпиляция"
          title="Когда лазер не справляется"
          description="Электроэпиляция решает задачи, недоступные другим методам удаления волос."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {points.map((p) => (
            <div key={p.title} className="bg-white border border-mist rounded-2xl p-6 flex gap-4">
              <span className="text-dark/40 text-2xl flex-shrink-0">{p.icon}</span>
              <div>
                <h3 className="text-dark font-bold text-sm mb-1">{p.title}</h3>
                <p className="text-dark/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-cream/30 border border-cream rounded-2xl px-6 py-4 text-center">
          <p className="text-dark text-sm font-medium">
            Не знаете, что выбрать —{' '}
            <Link href="/laser-epil" className="underline underline-offset-2 hover:text-dark/70 transition">
              лазерная эпиляция
            </Link>{' '}
            или электроэпиляция? Мастер подскажет на бесплатной консультации.
          </p>
        </div>
      </div>
    </section>
  )
}
