'use client'

import { useEffect, useState } from 'react'
import { TG_USERNAME, MAX_URL } from '@/lib/site-config'
import { WidgetButton } from '@/components/ui'

export default function MessengerWidgets() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-6 left-4 z-40 flex flex-col gap-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <WidgetButton
        href={`https://t.me/${TG_USERNAME}`}
        icon="/telegram.svg"
        label="Написать в Telegram"
      />
      {MAX_URL && (
        <WidgetButton
          href={MAX_URL}
          icon="/MAX.svg"
          label="Написать в Max"
        />
      )}
    </div>
  )
}
