import Image from 'next/image'
import { SectionHeader, Badge } from '@/components/ui'

const team = [
  { name: 'Екатерина', role: 'Топ-мастер', exp: '8 лет опыта', color: 'from-mist to-mist/50', badge: 'Топ-мастер' },
  { name: 'Татьяна', role: 'Ведущий мастер', exp: '5 лет опыта', color: 'from-cream/30 to-mist', badge: 'Ведущий мастер' },
]

const values = [
  { title: 'Забота', desc: 'Каждый клиент — это доверие. Мы ценим его.' },
  { title: 'Профессионализм', desc: 'Постоянное обучение, сертификация, актуальные методики.' },
  { title: 'Натуральность', desc: 'Только безопасные и гипоаллергенные материалы.' },
  { title: 'Результат', desc: 'Не просто процедура, а видимый эффект после первого сеанса.' },
]

export default function About() {
  return (
    <section id="about" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          sub="Кто мы"
          title="О студии LUCOVICA"
          description="LUCOVICA — это студия эпиляции в самом сердце Ростова-на-Дону. Мы создаём пространство, где каждая процедура становится моментом заботы о себе: уютная атмосфера, топ-мастера и вкусный кофе в ожидании."
        />

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {values.map((v) => (
            <div key={v.title} className="p-5 rounded-2xl bg-mist/20 border border-mist">
              <h3 className="font-bold text-dark text-sm mb-1">{v.title}</h3>
              <p className="text-dark/60 text-xs">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-dark">Наши мастера</h3>
          <p className="text-dark/60 text-sm mt-1">Профессионалы, которым вы доверяете</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="card text-center hover:shadow-md transition-shadow flex-1">
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} mx-auto mb-4 flex items-center justify-center overflow-hidden border border-mist`}
              >
                <Image
                  src={`/team-${member.name.toLowerCase()}.webp`}
                  alt={`Мастер ${member.name} — студия LUCOVICA`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <Badge className="mb-2">{member.badge}</Badge>
              <h4 className="font-bold text-dark text-lg mt-1">{member.name}</h4>
              <p className="text-dark/60 text-sm mt-0.5">{member.role}</p>
              <p className="text-dark/40 text-xs font-semibold mt-1">{member.exp}</p>
            </div>
          ))}
        </div>

        {/* Studio features */}
        <div className="mt-14 bg-mist/20 border border-mist rounded-3xl p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-dark mb-4">Почему выбирают нас</h3>
              <ul className="space-y-3">
                {[
                  'Камерная студия — 2 мастера, запись строго по времени, без очередей',
                  'Каждый мастер знает своих клиентов лично',
                  'Опыт 5+ лет у каждого специалиста — индивидуальный подход гарантирован',
                  'Сертифицированное оборудование последнего поколения',
                  'Косметика премиум-класса без вредных компонентов',
                  'Центральное расположение — удобно добираться',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-dark/70 text-sm">
                    <span className="text-dark/40 mt-0.5 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Год основания', value: '2014' },
                { label: 'Сеансов проведено', value: '10 000+' },
                { label: 'Мастеров в команде', value: '2' },
                { label: 'Рейтинг Яндекс', value: '5.0' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 text-center border border-mist">
                  <p className="text-2xl font-normal text-dark">{stat.value}</p>
                  <p className="text-dark/50 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
