import Image from 'next/image'

const team = [
  { name: 'Екатерина', role: 'Руководитель студии', exp: '8 лет опыта', avatar: '👩', color: 'from-rose-light to-beige' },
  { name: 'Анастасия', role: 'Мастер лазерной эпиляции', exp: '4 года опыта', avatar: '👩', color: 'from-cream-300 to-beige' },
  { name: 'Мария', role: 'Мастер шугаринга', exp: '5 лет опыта', avatar: '👩', color: 'from-beige to-rose-light/40' },
  { name: 'Ольга', role: 'Мастер всех видов эпиляции', exp: '3 года опыта', avatar: '👩', color: 'from-rose/20 to-cream-200' },
]

const values = [
  { icon: '💖', title: 'Забота', desc: 'Каждый клиент — это доверие. Мы ценим его.' },
  { icon: '🏆', title: 'Профессионализм', desc: 'Постоянное обучение, сертификация, актуальные методики.' },
  { icon: '🌿', title: 'Натуральность', desc: 'Только безопасные и гипоаллергенные материалы.' },
  { icon: '✨', title: 'Результат', desc: 'Не просто процедура, а видимый эффект после первого сеанса.' },
]

export default function About() {
  return (
    <section id="about" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-sub">Кто мы</p>
          <h2 className="section-title">О студии LUCOVICA</h2>
          <p className="text-navy/60 max-w-2xl mx-auto text-sm md:text-base">
            LUCOVICA — это студия эпиляции в самом сердце Ростова-на-Дону. Мы создаём пространство,
            где каждая процедура становится моментом заботы о себе: уютная атмосфера, топ-мастера
            и вкусный кофе в ожидании.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {values.map((v) => (
            <div key={v.title} className="text-center p-5 rounded-2xl bg-cream-100 border border-beige">
              <div className="text-3xl mb-2">{v.icon}</div>
              <h3 className="font-bold text-navy text-sm mb-1">{v.title}</h3>
              <p className="text-navy/60 text-xs">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-navy">Наша команда</h3>
          <p className="text-navy/60 text-sm mt-1">Опытные мастера, которым вы доверяете</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {team.map((member) => (
            <div key={member.name} className="card text-center hover:shadow-md transition-shadow">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} mx-auto mb-3 flex items-center justify-center overflow-hidden border-4 border-beige`}
              >
                <Image
                  src={`/team-${member.name.toLowerCase()}.jpg`}
                  alt={`Мастер ${member.name} — студия LUCOVICA`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h4 className="font-bold text-navy">{member.name}</h4>
              <p className="text-navy/60 text-xs mt-0.5">{member.role}</p>
              <p className="text-rose-dark text-xs font-semibold mt-1">{member.exp}</p>
            </div>
          ))}
        </div>

        {/* Studio features */}
        <div className="mt-14 bg-gradient-to-br from-cream-200 to-rose-light/20 rounded-3xl p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-navy mb-4">Почему выбирают нас</h3>
              <ul className="space-y-3">
                {[
                  'Центральное расположение — удобно добираться',
                  'Сертифицированное оборудование последнего поколения',
                  'Косметика премиум-класса без вредных компонентов',
                  'Зона ожидания с кофе и чаем',
                  'Индивидуальный подход к каждому клиенту',
                  'Гибкое расписание — работаем 7 дней в неделю',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-navy/70 text-sm">
                    <span className="text-rose-dark mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Год основания', value: '2019' },
                { label: 'Сеансов проведено', value: '10 000+' },
                { label: 'Мастеров в команде', value: '8' },
                { label: 'Рейтинг Яндекс', value: '4.9 ★' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-beige">
                  <p className="text-2xl font-extrabold text-rose-dark">{stat.value}</p>
                  <p className="text-navy/60 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
