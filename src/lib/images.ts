// Манифест изображений, сгенерированных scripts/images.ts, и хелпер <picture>.
import { html, type SafeHtml } from './html.ts'

export const IMAGE_WIDTHS = [640, 960, 1280, 1920] as const
export const IMAGE_FORMATS = ['avif', 'webp'] as const
export type ImageFormat = (typeof IMAGE_FORMATS)[number]

export interface ImageVariant {
  width: number
  src: string
}

export interface ImageEntry {
  width: number
  height: number
  variants: Record<ImageFormat, ImageVariant[]>
}

/** Ключ — имя исходника без расширения: 'hero', 'team-ekaterina' */
export type ImageManifest = Record<string, ImageEntry>

export interface PictureOptions {
  name: string
  alt: string
  sizes?: string
  /** Изображение первого экрана: без lazy, с fetchpriority=high */
  priority?: boolean
  className?: string
}

const srcset = (variants: ImageVariant[]) => variants.map((v) => `${v.src} ${v.width}w`).join(', ')

export function picture(images: ImageManifest, opts: PictureOptions): SafeHtml {
  const img = images[opts.name]
  if (!img) throw new Error(`Изображение «${opts.name}» не найдено в assets/img`)
  const sizes = opts.sizes ?? '100vw'
  const fallback = img.variants.webp.at(-1)!
  return html`<picture${opts.className ? html` class="${opts.className}"` : null}>
<source type="image/avif" srcset="${srcset(img.variants.avif)}" sizes="${sizes}">
<source type="image/webp" srcset="${srcset(img.variants.webp)}" sizes="${sizes}">
<img src="${fallback.src}" alt="${opts.alt}" width="${img.width}" height="${img.height}" decoding="async"${
    opts.priority ? html` fetchpriority="high"` : html` loading="lazy"`
  }>
</picture>`
}
