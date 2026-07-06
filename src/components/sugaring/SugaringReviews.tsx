import { SectionHeader } from '@/components/ui'

const reviews = [
  { name: 'Кристина Л.', date: 'Декабрь 2025', rating: 5, text: 'Начинала с шугаринга и осталась довольна. Мастер подробно объясняет все этапы, после процедуры никаких раздражений — кожа гладкая и мягкая.', avatar: 'К', color: 'bg-cream/50' },
  { name: 'Анна П.', date: 'Январь 2026', rating: 5, text: 'Делаю шугаринг здесь регулярно. Паста натуральная, процедура переносится легко даже на деликатных зонах. Вросших волос больше нет.', avatar: 'А', color: 'bg-mist' },
  { name: 'Мария Д.', date: 'Февраль 2026', rating: 5, text: 'Перешла с воска на шугаринг — небо и земля. Намного бережнее, кожа не краснеет. Очень аккуратные мастера.', avatar: 'М', color: 'bg-mist/50' },
  { name: 'Виктория С.', date: 'Январь 2026', rating: 5, text: 'У меня чувствительная кожа, раньше после депиляции всё горело. Здесь впервые без раздражения. Спасибо мастерам!', avatar: 'В', color: 'bg-cream/40' },
  { name: 'Татьяна Ч.', date: 'Декабрь 2025', rating: 5, text: 'Хожу к Екатерине больше 10 лет — начинали с шугаринга. Это лучшее, что может быть. А теперь ещё и красивая студия в центре.', avatar: 'Т', color: 'bg-mist/60' },
  { name: 'Елена Р.', date: 'Февраль 2026', rating: 5, text: 'Делала шугаринг бикини — деликатно, профессионально, без боли как раньше. Волосы стали расти медленнее и тоньше.', avatar: 'Е', color: 'bg-dark/10' },
]

export default function SugaringReviews() {
  return (
    <section id="reviews" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionHeader sub="Мнения клиентов" title="Отзывы о шугаринге" />

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
                  <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center font-bold text-dark`}>{r.avatar}</div>
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
          <a href="https://yandex.ru/maps/org/lucovica/72594546932/reviews" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
            Все отзывы на Яндекс Картах →
          </a>
        </div>
      </div>
    </section>
  )
}
