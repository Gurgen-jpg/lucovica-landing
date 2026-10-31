// Карусель: один слайд, prev/next с зацикливанием, индикатор «01 / 03» в live-region.

const pad = (n: number) => String(n).padStart(2, '0')

function setup(root: HTMLElement): void {
  if (root.dataset.enhanced !== undefined) return
  const slides = Array.from(root.querySelectorAll<HTMLElement>('.ds-carousel__slide'))
  const controls = root.querySelector<HTMLElement>('.ds-carousel__controls')
  const status = root.querySelector<HTMLElement>('.ds-carousel__status')
  if (slides.length < 2 || !controls || !status) return

  root.dataset.enhanced = ''
  controls.hidden = false
  let index = 0

  const show = (i: number) => {
    index = (i + slides.length) % slides.length
    slides.forEach((s, n) => (s.hidden = n !== index))
    status.textContent = `${pad(index + 1)} / ${pad(slides.length)}`
  }
  show(0)

  controls.addEventListener('click', (e) => {
    const dir = (e.target as Element).closest<HTMLElement>('[data-carousel]')?.dataset.carousel
    if (dir === 'next') show(index + 1)
    if (dir === 'prev') show(index - 1)
  })
}

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ds="carousel"]').forEach(setup)
}
