import { SectionHeader } from '@/components/ui'

const reviews = [
  { name: 'Ольга М.', date: 'Январь 2026', rating: 5, text: 'Делала электроэпиляцию на подбородке — седые волоски, которые лазер не брал. Наконец-то избавилась от проблемы, которая мучила годами. Спасибо мастеру!', avatar: 'О', color: 'bg-mist' },
  { name: 'Ирина К.', date: 'Декабрь 2025', rating: 5, text: 'После курса лазера оставались отдельные светлые волоски. Здесь убрали их электроэпиляцией — теперь кожа идеально гладкая. Очень аккуратно.', avatar: 'И', color: 'bg-cream/50' },
  { name: 'Наталья В.', date: 'Февраль 2026', rating: 5, text: 'Боялась, что будет очень больно — с анестезией вполне терпимо. Мастер всё объяснила, работает деликатно. Результат стоит того.', avatar: 'Н', color: 'bg-mist/50' },
  { name: 'Светлана П.', date: 'Январь 2026', rating: 5, text: 'Единственный метод, который реально помог с моими светлыми волосами на лице. Покраснение прошло за пару дней, следов нет.', avatar: 'С', color: 'bg-cream/40' },
  { name: 'Галина Д.', date: 'Декабрь 2025', rating: 5, text: 'Профессиональный подход, стерильность на высоте. Убрали волоски на бровях очень точно. Рекомендую тем, кому не подошёл лазер.', avatar: 'Г', color: 'bg-mist/60' },
  { name: 'Алёна Ф.', date: 'Февраль 2026', rating: 5, text: 'Долго искала, где делают электроэпиляцию качественно. Здесь — лучшие. Аккуратно, чисто, результат перманентный. Очень довольна.', avatar: 'А', color: 'bg-dark/10' },
]

export default function ElectroEpilReviews() {
  return (
    <section id="reviews" className="py-20 px-5 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionHeader sub="Мнения клиентов" title="Отзывы об электроэпиляции" />

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
