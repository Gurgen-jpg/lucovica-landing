import { SectionHeader } from '@/components/ui'

const reviews = [
  {
    name: 'Маргарита В.',
    date: 'Февраль 2026',
    rating: 5,
    text: 'Переход на лазер стал для меня переворотом — эффект «до/после» впечатляет, это небо и земля! Видно, как мастера горят своим делом.',
    avatar: 'М',
    color: 'bg-mist',
  },
  {
    name: 'Юлия Ш.',
    date: 'Февраль 2026',
    rating: 5,
    text: 'Давно хотела попробовать лазер. Бытует мнение, что больно — нет, совсем не больно, девочки всё подстраивают под вас. Через месяц вернусь ещё.',
    avatar: 'Ю',
    color: 'bg-dark/10',
  },
  {
    name: 'Афина Б.',
    date: 'Февраль 2026',
    rating: 5,
    text: 'С первого сеанса волос стал расти медленнее — в других местах такого эффекта не было! Мастер на протяжении всего сеанса интересовалась комфортом.',
    avatar: 'А',
    color: 'bg-mist/50',
  },
  {
    name: 'Гурген С.',
    date: 'Февраль 2026',
    rating: 5,
    text: 'После процедуры волосы стали заметно медленнее расти. На подмышках волосы практически не растут уже после нескольких процедур.',
    avatar: 'Г',
    color: 'bg-cream/40',
  },
  {
    name: 'Кристина Л.',
    date: 'Декабрь 2025',
    rating: 5,
    text: 'Оборудование современное — высокое качество результата и никаких раздражений после сеансов. Мастер подробно объясняет все этапы.',
    avatar: 'К',
    color: 'bg-cream/50',
  },
  {
    name: 'Татьяна Ч.',
    date: 'Декабрь 2025',
    rating: 5,
    text: 'Хожу к Екатерине больше 10 лет — начинали с шугаринга, сейчас делаю лазер. Это лучшее, что может быть.',
    avatar: 'Т',
    color: 'bg-mist/60',
  },
]

export default function LaserEpilReviews() {
  return (
    <section id="reviews" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionHeader sub="Мнения клиентов" title="Отзывы о лазерной эпиляции" />

        <div className="flex items-center justify-center gap-2 -mt-6 mb-10">
          <div className="flex text-dark text-xl">{'★'.repeat(5)}</div>
          <span className="font-bold text-dark">5.0</span>
          <span className="text-dark/50 text-sm">· 500+ отзывов</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center font-bold text-dark`}>
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{r.name}</p>
                    <p className="text-dark/40 text-xs">{r.date}</p>
                  </div>
                </div>
                <div className="flex text-dark text-sm">{'★'.repeat(r.rating)}</div>
              </div>
              <p className="text-dark/70 text-sm leading-relaxed flex-1">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://yandex.ru/maps/org/lucovica/72594546932/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm"
          >
            Все отзывы на Яндекс Картах →
          </a>
        </div>
      </div>
    </section>
  )
}
