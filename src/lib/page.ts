import type { SafeHtml } from './html.ts'
import type { ImageManifest } from './images.ts'

export interface PageMeta {
  title: string
  description: string
  og?: {
    title?: string
    description?: string
    image?: string
    type?: 'website' | 'article'
  }
  noindex?: boolean
  jsonLd?: readonly object[]
  /** Цель Метрики, отправляемая при просмотре страницы */
  pageGoal?: string
}

export interface SitemapEntry {
  priority: number
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export interface Assets {
  css: string[]
  js: string[]
  preload: { href: string; as: 'font' | 'image'; type?: string }[]
}

export interface RenderContext {
  path: string
  assets: Assets
  images: ImageManifest
}

export interface Page {
  /** Канонический путь: '/' или '/laser-epil' */
  path: string
  meta: PageMeta
  sitemap?: SitemapEntry
  /** Страница не попадает в продакшен-сборку (витрина /ds и т. п.) */
  devOnly?: boolean
  render: (ctx: RenderContext) => SafeHtml
}
