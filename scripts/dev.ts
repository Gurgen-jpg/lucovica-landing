// Dev-режим: полная сборка → наблюдение за исходниками → пересборка → сигнал live reload.
// Сервер работает в этом же процессе; правки в server/ требуют перезапуска npm run dev.
import * as esbuild from 'esbuild'
import { spawn } from 'node:child_process'
import { existsSync, watch } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

process.env.NODE_ENV = 'development'
if (existsSync('.env')) process.loadEnvFile('.env')
const { OUT, build, esbuildOptions, assetsFromMetafile } = await import('./build.ts')
const { buildImages } = await import('./images.ts')
const { createApp } = await import('../server/app.ts')
const { liveReload, triggerReload } = await import('../server/dev.ts')

/** Перерисовка HTML в свежем процессе — так подхватываются правки контента, импортированного страницами. */
function renderPages(): Promise<void> {
  return new Promise((done) => {
    const started = Date.now()
    const child = spawn(process.execPath, ['--import', 'tsx', 'scripts/build.ts', '--pages'], {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: process.env,
    })
    child.on('exit', async (code) => {
      if (code === 0) {
        console.log(`pages: ${Date.now() - started} мс`)
        triggerReload()
      }
      done()
    })
  })
}

// Склеивает серию событий файловой системы в один запуск
function debounced(fn: () => Promise<void>, ms = 80) {
  let timer: NodeJS.Timeout | undefined
  let running: Promise<void> = Promise.resolve()
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      running = running.then(fn, fn)
    }, ms)
  }
}

await build()

// JS/CSS: инкрементальная сборка esbuild; после каждой — новые хэши → перерисовать HTML
const ctx = await esbuild.context({
  ...esbuildOptions,
  minify: false,
  sourcemap: 'linked',
  plugins: [
    {
      name: 'rerender-pages',
      setup(b) {
        let first = true
        b.onEnd(async (result) => {
          if (first) return void (first = false)
          if (result.errors.length || !result.metafile) return
          await writeFile(join(OUT, 'assets.json'), JSON.stringify(assetsFromMetafile(result.metafile), null, 2))
          await renderPages()
        })
      },
    },
  ],
})
await ctx.watch()

// Шаблоны и контент (всё в src/, кроме браузерного кода и стилей — их ведёт esbuild)
const onSource = debounced(renderPages)
watch('src', { recursive: true }, (_event, file) => {
  if (!file) return
  const f = String(file).replaceAll('\\', '/')
  if (f.startsWith('client/') || f.endsWith('.css')) return
  onSource()
})

const onImages = debounced(async () => {
  await buildImages(OUT)
  await renderPages()
})
watch('assets/img', onImages)

const port = Number(process.env.PORT) || 3000
const server = createApp({ reloadRoutes: true, before: [liveReload] }).listen(port, () =>
  console.log(`dev: http://localhost:${port}`),
)

const stop = async () => {
  server.close()
  await ctx.dispose()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
