const stats = [
  { value: '12+', label: 'лет работы' },
  { value: '2000+', label: 'довольных клиентов' },
  { value: '5', label: 'опытных мастеров' },
  { value: '5.0', label: 'рейтинг на картах' },
]

export default function Trust() {
  return (
    <section id="trust" className="bg-mist/30 py-14 px-5 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-normal text-dark mb-1">{s.value}</div>
              <div className="text-dark/50 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
