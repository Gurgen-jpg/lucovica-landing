// Конвейер изображений: assets/img/* → dist/img/<name>-<w>-<hash>.<avif|webp> + манифест.
// Результаты кэшируются в .cache/img по хэшу исходника — повторная сборка не перекодирует.
import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { IMAGE_FORMATS, IMAGE_WIDTHS, type ImageEntry, type ImageManifest } from '../src/lib/images.ts'

const SRC_DIR = 'assets/img'
const CACHE_DIR = '.cache/img'
const QUALITY = { avif: 55, webp: 78 } as const
const PIPELINE_VERSION = 'v1' // поменять при изменении параметров кодирования

const exists = (p: string) => stat(p).then(() => true, () => false)

export interface ImageStats {
  encoded: number
  cached: number
}

export async function buildImages(outDir: string): Promise<{ manifest: ImageManifest; stats: ImageStats }> {
  const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f))
  await mkdir(CACHE_DIR, { recursive: true })
  await mkdir(join(outDir, 'img'), { recursive: true })

  const manifest: ImageManifest = {}
  const stats: ImageStats = { encoded: 0, cached: 0 }

  for (const file of files.sort()) {
    const name = basename(file, extname(file))
    const source = await readFile(join(SRC_DIR, file))
    const hash = createHash('sha256').update(PIPELINE_VERSION).update(source).digest('hex').slice(0, 10)
    const meta = await sharp(source).metadata()
    const width = meta.autoOrient?.width ?? meta.width!
    const height = meta.autoOrient?.height ?? meta.height!

    const widths: number[] = IMAGE_WIDTHS.filter((w) => w < width)
    if (widths.length === 0 || widths.at(-1)! < width) widths.push(Math.min(width, IMAGE_WIDTHS.at(-1)!))

    const entry: ImageEntry = { width, height, variants: { avif: [], webp: [] } }
    for (const format of IMAGE_FORMATS) {
      for (const w of widths) {
        const outName = `${name}-${w}-${hash}.${format}`
        const cached = join(CACHE_DIR, outName)
        if (await exists(cached)) {
          stats.cached++
        } else {
          await sharp(source)
            .rotate()
            .resize({ width: w, withoutEnlargement: true })
            [format]({ quality: QUALITY[format] })
            .toFile(cached)
          stats.encoded++
        }
        await copyFile(cached, join(outDir, 'img', outName))
        entry.variants[format].push({ width: w, src: `/img/${outName}` })
      }
    }
    manifest[name] = entry
  }

  await writeFile(join(outDir, 'img', 'manifest.json'), JSON.stringify(manifest, null, 2))
  return { manifest, stats }
}
