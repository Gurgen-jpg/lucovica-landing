// Сборка сайта: изображения → JS/CSS (esbuild) → HTML-страницы → sitemap → public/.
import * as esbuild from 'esbuild'
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'
import { absoluteUrl, config } from '../src/config.ts'
import { SITEMAP_LASTMOD } from '../src/content/sitemap.ts'
import { document } from '../src/layout/document.ts'
import type { ImageManifest } from '../src/lib/images.ts'
import type { Assets, Page } from '../src/lib/page.ts'
import { buildImages } from './images.ts'

export const OUT = 'dist'
export const NOT_FOUND_PATH = '/404'

export const esbuildOptions: esbuild.BuildOptions = {
  entryPoints: { main: 'src/client/main.ts', site: 'src/styles/site.css' },
  outdir: join(OUT, 'assets'),
  entryNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',
  publicPath: '/assets',
  bundle: true,
  format: 'esm',
  target: ['es2020', 'safari15'],
  minify: true,
  sourcemap: false,
  metafile: true,
  loader: { '.woff2': 'file', '.woff': 'file', '.svg': 'file', '.png': 'file' },
  logLevel: 'warning',
}

/** Карта ассетов из метафайла esbuild: хэшированные пути main.js и site.css. */
export function assetsFromMetafile(metafile: esbuild.Metafile): Assets {
  const assets: Assets = { css: [], js: [], preload: [] }
  for (const [file, out] of Object.entries(metafile.outputs)) {
    const href = '/' + relative(OUT, file).replaceAll('\\', '/')
    if (out.entryPoint && file.endsWith('.js')) assets.js.push(href)
    if (out.entryPoint && file.endsWith('.css')) assets.css.push(href)
    // Основные начертания (см. design-system D7) предзагружаются
    if (/\/(jost-cyrillic-300|cormorant-garamond-cyrillic-300)-normal-[^/]*\.woff2$/.test(href)) {
      assets.preload.push({ href, as: 'font', type: 'font/woff2' })
    }
  }
  return assets
}

export async function loadPages(): Promise<Page[]> {
  const dir = 'src/pages'
  const files = (await readdir(dir)).filter((f) => f.endsWith('.ts')).sort()
  const pages: Page[] = []
  for (const f of files) {
    const mod = (await import(pathToFileURL(join(dir, f)).href)) as { page?: Page }
    if (!mod.page) throw new Error(`${dir}/${f} не экспортирует page`)
    if (mod.page.devOnly && !config.dev) continue
    pages.push(mod.page)
  }
  const seen = new Set<string>()
  for (const p of pages) {
    if (seen.has(p.path)) throw new Error(`Дублируется путь страницы ${p.path}`)
    seen.add(p.path)
  }
  return pages
}

/** '/' → index.html, '/laser-epil' → laser-epil.html, '/welcome/back' → welcome/back.html */
export function fileForPath(path: string): string {
  return path === '/' ? 'index.html' : `${path.slice(1)}.html`
}

export function sitemapXml(pages: Page[]): string {
  const urls = pages
    .filter((p) => p.sitemap)
    .sort((a, b) => b.sitemap!.priority - a.sitemap!.priority || a.path.localeCompare(b.path))
    .map(
      (p) => `  <url>
    <loc>${absoluteUrl(p.path)}</loc>
    <lastmod>${SITEMAP_LASTMOD}</lastmod>
    <changefreq>${p.sitemap!.changefreq}</changefreq>
    <priority>${p.sitemap!.priority.toFixed(1)}</priority>
  </url>`,
    )
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

export async function renderPages(assets: Assets, images: ImageManifest): Promise<Page[]> {
  const pages = await loadPages()
  const routes: Record<string, string> = {}
  for (const page of pages) {
    const ctx = { path: page.path, assets, images }
    const out = join(OUT, fileForPath(page.path))
    await mkdir(dirname(out), { recursive: true })
    await writeFile(out, document(page.meta, page.render(ctx), ctx).value)
    // 404.html отдаётся сервером только как ответ на неизвестный URL
    if (page.path !== NOT_FOUND_PATH) routes[page.path] = fileForPath(page.path)
  }
  await writeFile(join(OUT, 'routes.json'), JSON.stringify(routes, null, 2))
  await writeFile(join(OUT, 'assets.json'), JSON.stringify(assets, null, 2))
  await writeFile(join(OUT, 'sitemap.xml'), sitemapXml(pages))
  return pages
}

export async function build(): Promise<void> {
  const started = Date.now()
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })
  await cp('public', OUT, { recursive: true })

  const { manifest: images, stats } = await buildImages(OUT)
  const result = await esbuild.build(esbuildOptions)
  const assets = assetsFromMetafile(result.metafile!)
  const pages = await renderPages(assets, images)

  console.log(
    `build: ${pages.length} страниц, изображения ${stats.encoded} новых / ${stats.cached} из кэша, ` +
      `${assets.js.length + assets.css.length} бандла — ${Date.now() - started} мс`,
  )
}

/** Перерисовать только HTML по уже собранным ассетам (dev-режим, отдельный процесс). */
export async function renderFromDist(): Promise<Page[]> {
  const assets = JSON.parse(await readFile(join(OUT, 'assets.json'), 'utf8')) as Assets
  const images = JSON.parse(await readFile(join(OUT, 'img', 'manifest.json'), 'utf8')) as ImageManifest
  return renderPages(assets, images)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const task = process.argv.includes('--pages') ? renderFromDist() : build()
  task.catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
