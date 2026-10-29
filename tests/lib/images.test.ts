import { describe, expect, it } from 'vitest'
import { picture, type ImageManifest } from '../../src/lib/images.ts'

const images: ImageManifest = {
  hero: {
    width: 1600,
    height: 1200,
    variants: {
      avif: [
        { width: 640, src: '/img/hero-640-h.avif' },
        { width: 1280, src: '/img/hero-1280-h.avif' },
      ],
      webp: [
        { width: 640, src: '/img/hero-640-h.webp' },
        { width: 1280, src: '/img/hero-1280-h.webp' },
      ],
    },
  },
}

describe('picture', () => {
  it('приоритетное изображение без lazy и с fetchpriority', () => {
    const out = picture(images, { name: 'hero', alt: 'Ресепшн', priority: true }).value
    expect(out).toContain('fetchpriority="high"')
    expect(out).not.toContain('loading="lazy"')
    expect(out).toContain('width="1600" height="1200"')
    expect(out).toContain('srcset="/img/hero-640-h.avif 640w, /img/hero-1280-h.avif 1280w"')
    expect(out.indexOf('image/avif')).toBeLessThan(out.indexOf('image/webp'))
  })

  it('обычное изображение — lazy', () => {
    expect(picture(images, { name: 'hero', alt: '' }).value).toContain('loading="lazy"')
  })

  it('неизвестное имя — ошибка сборки', () => {
    expect(() => picture(images, { name: 'nope', alt: '' })).toThrow(/nope/)
  })
})
