// Диалог: showModal() + возврат фокуса, цикл Tab, клик по подложке, блок прокрутки.
import { focusables } from '../../focus.client.ts'

const openers = new WeakMap<HTMLDialogElement, HTMLElement | null>()

/** Первое поле формы, иначе первый фокусируемый элемент после кнопки «Закрыть». */
function initialFocus(dlg: HTMLDialogElement): HTMLElement | undefined {
  const auto = dlg.querySelector<HTMLElement>('[autofocus]')
  if (auto) return auto
  const all = focusables(dlg)
  return (
    all.find((el) => el.matches('input, select, textarea')) ??
    all.find((el) => !el.hasAttribute('data-dialog-close')) ??
    all[0]
  )
}

export function openDialog(dlg: HTMLDialogElement, opener: HTMLElement | null = null): void {
  if (dlg.open) return
  openers.set(dlg, opener ?? (document.activeElement as HTMLElement | null))
  document.documentElement.classList.add('ds-scroll-lock')
  dlg.showModal()
  initialFocus(dlg)?.focus()
}

export function closeDialog(dlg: HTMLDialogElement): void {
  if (dlg.open) dlg.close()
}

function onClose(dlg: HTMLDialogElement): void {
  if (!document.querySelector('dialog.ds-dialog[open]')) {
    document.documentElement.classList.remove('ds-scroll-lock')
  }
  const opener = openers.get(dlg)
  openers.delete(dlg)
  if (opener?.isConnected) opener.focus()
}

function trapTab(dlg: HTMLDialogElement, e: KeyboardEvent): void {
  if (e.key !== 'Tab') return
  const all = focusables(dlg)
  const first = all[0]
  const last = all[all.length - 1]
  if (!first || !last) return
  const active = document.activeElement
  if (e.shiftKey && (active === first || !dlg.contains(active))) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

function setup(dlg: HTMLDialogElement): void {
  if (dlg.dataset.enhanced !== undefined) return
  dlg.dataset.enhanced = ''
  dlg.addEventListener('close', () => onClose(dlg))
  dlg.addEventListener('keydown', (e) => trapTab(dlg, e))
  dlg.addEventListener('click', (e) => {
    // Клик по ::backdrop приходит с target === сам <dialog> (панель занимает всё содержимое)
    if (e.target === dlg) closeDialog(dlg)
    const closer = (e.target as Element).closest('[data-dialog-close]')
    if (closer && dlg.contains(closer)) closeDialog(dlg)
  })
}

let delegated = false

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLDialogElement>('dialog[data-ds="dialog"]').forEach(setup)
  if (delegated) return
  delegated = true
  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLElement>('[data-dialog-open]')
    if (!trigger) return
    const dlg = document.getElementById(trigger.dataset.dialogOpen ?? '')
    if (!(dlg instanceof HTMLDialogElement)) return
    e.preventDefault()
    setup(dlg)
    openDialog(dlg, trigger)
  })
}
