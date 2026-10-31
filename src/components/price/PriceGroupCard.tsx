import type { PriceRow } from './price-list.config'

type Props = {
  title: string
  note?: string
  rows: PriceRow[]
  onBook: () => void
}

function fmt(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function PriceGroupCard({ title, note, rows, onBook }: Props) {
  return (
    <section className="card">
      <h2 className="text-xl font-normal text-dark">{title}</h2>
      {note && <p className="text-dark/50 text-xs mt-1">{note}</p>}
      <ul className="mt-3 divide-y divide-mist">
        {rows.map((row) => (
          <li key={row.name} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
            <span className="text-dark/80">{row.name}</span>
            <span className="shrink-0 font-medium text-dark tabular-nums">{fmt(row.price)}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onBook} className="btn-outline mt-4 w-full text-sm">
        Записаться
      </button>
    </section>
  )
}
