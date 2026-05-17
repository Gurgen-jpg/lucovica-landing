'use client'

type Props = {
  onNext: () => void
  onBack: () => void
  canNext: boolean
  showBack?: boolean
  nextLabel?: string
}

export function NavButtons({ onNext, onBack, canNext, showBack = true, nextLabel = 'Продолжить' }: Props) {
  return (
    <div className="mt-8 space-y-3 shrink-0">
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="btn-primary w-full text-base py-4 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {nextLabel}
      </button>
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 text-sm text-dark/40 hover:text-dark transition"
        >
          ← Назад
        </button>
      )}
    </div>
  )
}
