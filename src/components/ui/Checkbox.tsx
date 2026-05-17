'use client'

import type { ReactNode } from 'react'

type Props = {
  checked: boolean
  onChange: (v: boolean) => void
  children: ReactNode
}

export function Checkbox({ checked, onChange, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 text-left w-full"
    >
      <div
        className={`mt-0.5 w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-all ${
          checked ? 'bg-dark border-dark' : 'bg-white border-mist'
        }`}
      >
        {checked && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path
              d="M1 4.5L4.5 8L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {children}
    </button>
  )
}
