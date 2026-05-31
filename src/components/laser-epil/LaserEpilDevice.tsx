import { SectionHeader } from '@/components/ui'

const features = [
  {
    icon: '⬡',
    title: '808 нм',
    desc: 'Оптимальная длина волны для поглощения меланином волосяного фолликула',
  },
  {
    icon: '❄',
    title: 'Охлаждение',
    desc: 'Встроенная система охлаждения кожи — процедура комфортна даже на чувствительных зонах',
  },
  {
    icon: '◉',
    title: 'Все фототипы',
    desc: 'Работает с 1–6 фототипом кожи: от очень светлой до тёмной, включая загорелую вне сезона',
  },
  {
    icon: '✦',
    title: 'Любой тип волос',
    desc: 'Тёмные, светлые, пушковые — подбираем параметры индивидуально под каждого клиента',
  },
]

export default function LaserEpilDevice() {
  return (
    <section id="device" className="py-20 px-5 md:px-12 bg-dark">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-3">Наш аппарат</p>
          <h2 className="text-white text-3xl md:text-4xl font-normal mb-4">
            Диодный лазер — не больно,<br />
            <span className="text-white/50">результат с первой процедуры</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
            Мы работаем на профессиональном диодном лазере. Не александрит, не неодимовый —
            именно диодный 808 нм даёт оптимальный баланс эффективности и безопасности.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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

        {/* Placeholder for device photo */}
        <div className="w-full aspect-[16/6] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
          <span className="text-white/20 text-sm">Фото — аппарат диодного лазера</span>
        </div>
      </div>
    </section>
  )
}
