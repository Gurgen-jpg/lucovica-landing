import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'

export default function sitemap(): MetadataRoute.Sitemap {
  // Фиксированная дата реального обновления контента — не менять при каждой сборке
  const lastModified = new Date('2026-07-06')
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/laser-epil`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/sugaring`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/electro-epil`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
