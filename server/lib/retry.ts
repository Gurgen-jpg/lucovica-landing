// Повтор асинхронного вызова с паузами между попытками.

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** До attempts попыток; паузы baseDelayMs·2^i (200, 400 мс). Бросает последнюю ошибку. */
export async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 200): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) await sleep(baseDelayMs * 2 ** i)
    }
  }
  throw lastError
}
