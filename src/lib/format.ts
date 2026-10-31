// Форматирование чисел для вывода.

/** 4490 → «4 490» с неразрывным пробелом: цена не переносится по разрядам. */
export function formatPrice(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
}
