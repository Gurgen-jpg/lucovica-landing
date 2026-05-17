'use client'

type Props = {
  value: boolean | null
  onChange: (v: boolean) => void
  labelYes?: string
  labelNo?: string
}

export function YesNo({ value, onChange, labelYes = 'Да', labelNo = 'Нет' }: Props) {
  return (
    <div className="flex gap-3">
      {([{ v: true, label: labelYes }, { v: false, label: labelNo }] as const).map(({ v, label }) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 py-4 rounded-2xl border text-sm transition-all duration-150 active:scale-[0.98] ${
            value === v
              ? 'bg-dark text-white border-dark'
              : 'bg-white text-dark border-mist hover:border-dark/40'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
