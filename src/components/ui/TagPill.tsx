import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function TagPill({ children, className = '' }: Props) {
  return (
    <span
      className={`bg-white/60 text-dark/70 text-xs px-2.5 py-1 rounded-full font-medium border border-mist/50 ${className}`}
    >
      {children}
    </span>
  )
}
