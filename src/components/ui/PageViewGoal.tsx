'use client'

import { useEffect } from 'react'
import { trackWhenReady } from '@/lib/analytics'

type Props = {
  goal: string
}

/** Отправляет цель Метрики один раз при открытии страницы. Ничего не рендерит. */
export function PageViewGoal({ goal }: Props) {
  useEffect(() => trackWhenReady(goal), [goal])
  return null
}
