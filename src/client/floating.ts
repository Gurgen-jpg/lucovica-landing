// Плавающие кнопки (site-chrome): показ после 400px прокрутки, «Записаться» скрыта у #contacts.
// IntersectionObserver вместо обработчика scroll — без работы на каждом кадре.

export function initFloating(root: Document = document): void {
  const box = root.querySelector<HTMLElement>('[data-floating]')
  const sentinel = root.querySelector<HTMLElement>('.site-floating-sentinel')
  if (!box || !sentinel || !('IntersectionObserver' in window)) return
  const cta = box.querySelector<HTMLElement>('[data-floating-cta]')
  const contacts = root.getElementById('contacts')

  let scrolled = false
  let atContacts = false
  const render = () => {
    box.hidden = !scrolled
    if (cta) cta.hidden = atContacts
  }

  new IntersectionObserver(([entry]) => {
    // Сторожевой элемент высотой 400px в начале страницы: ушёл из вида — прокрутили дальше 400px
    scrolled = !entry!.isIntersecting
    render()
  }).observe(sentinel)

  if (contacts) {
    new IntersectionObserver(([entry]) => {
      atContacts = entry!.isIntersecting
      render()
    }).observe(contacts)
  }
}
