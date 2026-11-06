// Пункты мобильного меню «/#services» на той же странице: сначала закрыть меню и снять блок прокрутки,
// потом прокрутить к секции. Иначе браузер прокручивает, пока <html> заблокирован, и секция встаёт не под хедером.
import { closeDialog } from '../ds/primitives/dialog/dialog.client.ts'

export function initMenuAnchors(root: Document = document): void {
  const menu = root.getElementById('site-menu')
  if (!(menu instanceof HTMLDialogElement)) return
  menu.addEventListener('click', (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]')
    if (!link || link.pathname !== location.pathname || !link.hash) return
    const target = root.getElementById(decodeURIComponent(link.hash.slice(1)))
    if (!target) return
    e.preventDefault()
    menu.addEventListener(
      'close',
      () => {
        // Событие close приходит асинхронно: к этому моменту ds-scroll-lock уже снят
        requestAnimationFrame(() => {
          history.pushState(null, '', link.hash)
          target.scrollIntoView({ block: 'start' })
        })
      },
      { once: true },
    )
    closeDialog(menu)
  })
}
