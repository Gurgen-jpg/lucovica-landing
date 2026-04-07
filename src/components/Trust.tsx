const stats = [
  { value: '5+', label: 'лет работы', icon: '🏆' },
  { value: '3000+', label: 'довольных клиентов', icon: '🌸' },
  { value: '8', label: 'опытных мастеров', icon: '💆' },
  { value: '4.9', label: 'рейтинг на картах', icon: '⭐' },
]

export default function Trust() {
  return (
    <section id="trust" className="bg-navy py-14 px-5 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-rose text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
