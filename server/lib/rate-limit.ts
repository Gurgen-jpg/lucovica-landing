// Ограничение частоты запросов: скользящее окно в памяти процесса (booking-pipeline D5).

export interface RateLimiter {
  /** true — запрос разрешён и учтён; false — лимит исчерпан */
  hit(key: string): boolean
  reset(): void
}

export interface RateLimitOptions {
  limit: number
  windowMs: number
  now?: () => number
  /** Период очистки устаревших ключей; 0 — без таймера (тесты) */
  cleanupMs?: number
}

export function createRateLimiter({ limit, windowMs, now = Date.now, cleanupMs = 60_000 }: RateLimitOptions): RateLimiter {
  const hits = new Map<string, number[]>()

  const fresh = (key: string, t: number) => (hits.get(key) ?? []).filter((ts) => t - ts < windowMs)

  if (cleanupMs > 0) {
    setInterval(() => {
      const t = now()
      for (const key of hits.keys()) {
        const list = fresh(key, t)
        if (list.length) hits.set(key, list)
        else hits.delete(key)
      }
    }, cleanupMs).unref()
  }

  return {
    hit(key) {
      const t = now()
      const list = fresh(key, t)
      if (list.length >= limit) {
        hits.set(key, list)
        return false
      }
      list.push(t)
      hits.set(key, list)
      return true
    },
    reset() {
      hits.clear()
    },
  }
}
