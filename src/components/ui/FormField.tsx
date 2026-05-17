import { type ReactNode } from 'react'

type Props = {
  label: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, required, children }: Props) {
  return (
    <div>
      <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
        {label}
        {required && <span className="ml-1 text-dark/30">*</span>}
      </label>
      {children}
    </div>
  )
}
