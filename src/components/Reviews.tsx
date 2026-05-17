const reviews = [
  {
    name: 'Маргарита В.',
    date: 'Февраль 2026',
    rating: 5,
    service: 'Лазерная эпиляция',
    text: 'С хозяйкой студии Екатериной знакомы уже более 6 лет — и я бесконечно рада, что когда-то её нашла. Видно, как Катя горит своим делом, вкладывая в студию душу. Переход на лазер стал для меня переворотом — эффект «до/после» впечатляет, это небо и земля!',
    avatar: 'М',
    color: 'bg-mist',
  },
  {
    name: 'Кристина Л.',
    date: 'Декабрь 2025',
    rating: 5,
    service: 'Шугаринг и лазер',
    text: 'Начинала с шугаринга и постепенно опробовала разные техники. Мастер подробно объясняет все этапы, всегда отвечает понятным языком. Оборудование современное — высокое качество результата и никаких раздражений после сеансов.',
    avatar: 'К',
    color: 'bg-cream/50',
  },
  {
    name: 'Юлия Ш.',
    date: 'Февраль 2026',
    rating: 5,
    service: 'Первый лазер (мастер Татьяна)',
    text: 'Давно хотела попробовать лазер. Бытует мнение, что больно — нет, совсем не больно, девочки всё подстраивают под вас. Очень довольна мастером Татьяной, через месяц вернусь ещё. Теперь я ваша постоянная клиентка!',
    avatar: 'Ю',
    color: 'bg-dark/10',
  },
  {
    name: 'Афина Б.',
    date: 'Февраль 2026',
    rating: 5,
    service: 'Лазерная эпиляция',
    text: 'До этого делала эпиляцию в разных местах — есть с чем сравнить. Пошла по рекомендации нескольких человек и не ошиблась. Мастер Татьяна на протяжении всего сеанса интересовалась комфортом. С первого сеанса волос стал расти медленнее — в других местах такого эффекта не было!',
    avatar: 'А',
    color: 'bg-mist/50',
  },
  {
    name: 'Гурген С.',
    date: 'Февраль 2026',
    rating: 5,
    service: 'Мужская лазерная эпиляция',
    text: 'Стильно, красиво. Пробовал шугаринг и лазер — остановился на лазерной. После процедуры волосы стали заметно медленнее расти. Сделал уже несколько процедур — на подмышках волосы практически не растут.',
    avatar: 'Г',
    color: 'bg-cream/40',
  },
  {
    name: 'Татьяна Ч.',
    date: 'Декабрь 2025',
    rating: 5,
    service: 'Постоянный клиент, 10+ лет',
    text: 'Хожу к Екатерине больше 10 лет — начинали с шугаринга, сейчас делаю лазер. Это лучшее, что может быть. А теперь ещё и красивая студия в центре с парковкой!',
    avatar: 'Т',
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
