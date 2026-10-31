import Link from 'next/link'

type Props = {
  serviceName: string
}

export function ServiceBreadcrumb({ serviceName }: Props) {
  return (
    <nav
      aria-label="Навигация по сайту"
      className="flex flex-wrap items-center justify-between gap-2 px-5 md:px-12 pt-2 pb-2 text-xs md:text-sm bg-white"
    >
      <ol className="flex items-center gap-1.5 text-dark/40">
        <li>
          <Link href="/" className="hover:text-dark transition">Главная</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-dark/70 font-medium">{serviceName}</li>
      </ol>
      <Link href="/#services" className="text-dark/50 hover:text-dark font-medium transition">
        ← Назад к услугам
      </Link>
    </nav>
  )
}
