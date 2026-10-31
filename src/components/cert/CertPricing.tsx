import { SectionHeader } from '@/components/ui'
import { CERTIFICATES } from '@/lib/services-data'

function fmt(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function CertPricing() {
  return (
    <section id="pricing" className="py-20 px-5 md:px-12 bg-mist/20">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          sub="Номиналы"
          title="Выберите сертификат"
          description="Сертификат можно использовать на любые услуги студии."
          spacing="sm"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTIFICATES.map((cert) => (
            <div key={cert.amount} className="card text-center">
              <p className="text-2xl font-bold text-dark mb-2">{fmt(cert.amount)}</p>
              <p className="text-dark/50 text-sm">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
