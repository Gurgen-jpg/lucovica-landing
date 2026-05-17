/**
 * Повторяет асинхронный вызов `fn` до `attempts` раз при ошибке.
 * Между попытками выдерживает экспоненциальную задержку: baseDelayMs * 2^i.
 * Если все попытки исчерпаны — пробрасывает последнюю ошибку.
 *
 * @param fn          Функция, которую нужно выполнить.
 * @param attempts    Максимальное число попыток (по умолчанию 3).
 * @param baseDelayMs Базовая задержка в мс (по умолчанию 200).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 200,
): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, baseDelayMs * 2 ** i))
      }
    }
  }
  throw lastError
}
