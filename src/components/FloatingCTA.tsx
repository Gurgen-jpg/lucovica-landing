'use client'

import { useEffect, useState } from 'react'
import LeadForm from './LeadForm'
import { track } from '@/lib/analytics'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div
        className={`fixed bottom-6 right-4 z-40 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <button
          onClick={() => { track('floating_cta_click'); setOpen(true) }}
          className="btn-primary shadow-2xl text-sm px-5 py-3.5 animate-pulse-soft"
        >
          Записаться
        </button>
      </div>
      <LeadForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
