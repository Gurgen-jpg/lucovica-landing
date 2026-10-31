import { html, type SafeHtml } from '../../../lib/html.ts'
import { picture, type ImageManifest, type PictureOptions } from '../../../lib/images.ts'

export interface PhotoProps extends Omit<PictureOptions, 'className'> {
  /** Соотношение сторон контейнера: '4/5', '16/9', '1/1' */
  ratio?: `${number}/${number}`
  className?: string
}

/** Фото в монохроме с обрезкой под контейнер (--photo-mono). */
export function photo(images: ImageManifest, { ratio = '4/5', className, ...opts }: PhotoProps): SafeHtml {
  return html`<div class="ds-photo${className ? ` ${className}` : ''}" style="aspect-ratio: ${ratio}">${picture(images, opts)}</div>`
}
