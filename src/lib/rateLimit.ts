import { type NextRequest } from 'next/server'

const ipLog = new Map<string, number[]>()

/**
 * Возвращает IP-адрес клиента из заголовков запроса.
 * Проверяет `x-forwarded-for` (прокси/CDN), затем `x-real-ip`, иначе `'unknown'`.
 */
export function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

/**
 * Проверяет, превысил ли IP лимит запросов в скользящем временном окне.
 * Хранит историю в памяти процесса — сбрасывается при перезапуске.
 * Если лимит не превышен — фиксирует текущий запрос и возвращает `false`.
 *
 * @param ip          IP-адрес клиента.
 * @param maxRequests Максимум запросов в окне (по умолчанию 3).
 * @param windowMs    Размер окна в мс (по умолчанию 60 000 — 1 минута).
 * @returns `true` если лимит превышен, `false` если запрос разрешён.
 */
export function isRateLimited(ip: string, maxRequests = 3, windowMs = 60_000): boolean {
  const now = Date.now()
  const prev = (ipLog.get(ip) ?? []).filter(t => now - t < windowMs)
  if (prev.length >= maxRequests) return true
  ipLog.set(ip, [...prev, now])
  return false
}
