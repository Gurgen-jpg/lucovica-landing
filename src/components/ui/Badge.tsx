import { type ReactNode } from 'react'

type Props = {
  variant?: 'dark' | 'mist'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'dark', children, className = '' }: Props) {
  const base = 'inline-block text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase'
  const variants = {
    dark: 'bg-dark text-cream',
    mist: 'bg-mist text-dark font-medium',
  }
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
