/**
 * Оборачивает промис жёстким таймаутом.
 * Если `promise` не разрешился за `ms` миллисекунд — отклоняет с ошибкой `Timeout after Xms`.
 *
 * @param promise Исходный промис.
 * @param ms      Лимит времени в миллисекундах.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ])
}
