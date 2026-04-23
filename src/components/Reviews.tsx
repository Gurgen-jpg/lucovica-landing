const reviews = [
  {
    name: 'Анна К.',
    date: 'Март 2026',
    rating: 5,
    service: 'Лазерная эпиляция',
    text: 'Хожу в LUCOVICA уже второй год. Результат лазерной эпиляции превзошёл все ожидания — через 6 сеансов волосы практически перестали расти. Мастера профессиональные, в кабинете чисто и уютно. Рекомендую всем!',
    avatar: 'А',
    color: 'bg-mist',
  },
  {
    name: 'Дарья М.',
    date: 'Февраль 2026',
    rating: 5,
    service: 'Шугаринг',
    text: 'Давно боялась шугаринга, думала будет больно. Оказалось всё очень терпимо — мастер работала аккуратно и с заботой. Кожа после процедуры мягкая, раздражения ноль. Теперь хожу каждый месяц!',
    avatar: 'Д',
    color: 'bg-cream/50',
  },
  {
    name: 'Елена С.',
    date: 'Январь 2026',
    rating: 5,
    service: 'Шугаринг (Екатерина)',
    text: 'Записалась к Екатерине по рекомендации подруги. Это другой уровень — скорость, техника, результат. Чувствуется огромный опыт. Немного дороже, но оно того стоит. Уже записалась на следующий месяц.',
    avatar: 'Е',
    color: 'bg-dark/10',
  },
  {
    name: 'Михаил Т.',
    date: 'Март 2026',
    rating: 5,
    service: 'Мужская лазерная эпиляция',
    text: 'Пришёл немного скептически, но ребята сразу всё объяснили и успокоили. Процедура прошла комфортно, без неловкостей. Спину обработали качественно. Буду ходить на курс дальше.',
    avatar: 'М',
    color: 'bg-mist/50',
  },
  {
    name: 'Ксения Р.',
    date: 'Апрель 2026',
    rating: 5,
    service: 'Комплекс лазерной эпиляции',
    text: 'Взяла комплекс на всё тело — очень выгодно по цене! Студия в самом центре, добираться удобно. Интерьер приятный, всегда предложат кофе. Результат после 4 сеансов уже заметен. Советую комплексы — экономия ощутимая.',
    avatar: 'К',
    color: 'bg-cream/40',
  },
  {
    name: 'Светлана В.',
    date: 'Февраль 2026',
    rating: 5,
    service: 'Шугаринг для дочери',
    text: 'Привела дочку-подростка на первый шугаринг. Мастер была очень деликатна, объяснила всё и девочке и мне. Никакого дискомфорта, всё прошло отлично. Студия внушает доверие — вернёмся обязательно.',
    avatar: 'С',
    color: 'bg-mist/60',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-sub">Мнения клиентов</p>
          <h2 className="section-title">Отзывы</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex text-dark text-xl">{'★'.repeat(5)}</div>
            <span className="font-bold text-dark">5.0</span>
            <span className="text-dark/50 text-sm">· 500+ отзывов на Яндекс Картах и сервисах</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="card hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center font-bold text-dark`}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{r.name}</p>
                    <p className="text-dark/40 text-xs">{r.date}</p>
                  </div>
                </div>
                <div className="flex text-dark text-sm">{'★'.repeat(r.rating)}</div>
              </div>
              <span className="inline-block bg-mist text-dark text-xs font-medium px-2.5 py-1 rounded-full mb-3 w-fit">
                {r.service}
              </span>
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
