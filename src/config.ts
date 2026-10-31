// Параметры времени сборки (см. .env.example).

export const config = {
  siteUrl: (process.env.SITE_URL || 'https://lucovica.ru').replace(/\/+$/, ''),
  // Только цифры: значение вставляется в inline-скрипт счётчика
  ymId: /^\d+$/.test(process.env.YM_ID?.trim() ?? '') ? process.env.YM_ID!.trim() : '',
  maxUrl: process.env.MAX_URL?.trim() || '',
  dev: process.env.NODE_ENV === 'development',
  // Витрина /ds и прочие devOnly-страницы: dev-режим или явный DS_SHOWCASE=1 (e2e)
  showcase: process.env.NODE_ENV === 'development' || process.env.DS_SHOWCASE === '1',
}

export type Config = typeof config

export function absoluteUrl(path: string): string {
  return path === '/' ? `${config.siteUrl}/` : `${config.siteUrl}${path}`
}
