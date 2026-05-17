'use client'

import { type ReactNode } from 'react'

type Props = {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function Chip({ selected, onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-left text-sm transition-all duration-150 active:scale-[0.98] ${
        selected
          ? 'bg-dark text-white border-dark'
          : 'bg-white text-dark border-mist hover:border-dark/40'
      }`}
    >
      {children}
    </button>
  )
}
