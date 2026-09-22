'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackHit } from '@/lib/analytics'

/**
 * Отправляет `hit` в Метрику при каждой клиентской навигации (переход по <Link>).
 * Первый просмотр не дублируется — его уже записывает `init` в layout.
 */
export default function YandexMetrikaHit() {
  const pathname = usePathname()
  const prevUrl = useRef<string | null>(null)

  useEffect(() => {
    const url = window.location.href
    if (prevUrl.current !== null && prevUrl.current !== url) {
      trackHit(url, prevUrl.current)
    }
    prevUrl.current = url
  }, [pathname])

  return null
}
