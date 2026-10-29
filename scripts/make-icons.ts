// Разовая генерация иконок сайта из символа логотипа.
// Запуск: npx tsx scripts/make-icons.ts — результат коммитится в public/.
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const SOURCE = 'assets/icon-source.png'
// --gray-2 из токенов: у apple-touch-icon фон должен быть непрозрачным
const PLASTER = { r: 0xf7, g: 0xf5, b: 0xf0, alpha: 1 }

async function square(size: number, padding: number, background?: typeof PLASTER) {
  const inner = size - padding * 2
  const symbol = await sharp(SOURCE)
    .trim()
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: symbol, gravity: 'center' }])
    .png()
    .toBuffer()
}

// ICO с PNG внутри (поддерживается всеми современными браузерами)
function ico(pngs: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + 16 * pngs.length
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += data.length
    return e
  })
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

const fav32 = await square(32, 1)
const fav16 = await square(16, 0)
await writeFile('public/favicon-32.png', fav32)
await writeFile('public/favicon.ico', ico([{ size: 16, data: fav16 }, { size: 32, data: fav32 }]))
await writeFile('public/apple-touch-icon.png', await square(180, 24, PLASTER))
await writeFile('public/icon-512.png', await square(512, 48, PLASTER))
console.log('icons: favicon.ico, favicon-32.png, apple-touch-icon.png, icon-512.png')
