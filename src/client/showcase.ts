// Поведение витрины /ds: демо-форма вместо отправки показывает уведомление.
import { closeDialog } from '../ds/primitives/dialog/dialog.client.ts'
import { toast } from '../ds/primitives/toast/toast.client.ts'

export function initShowcase(): void {
  if (!document.querySelector('[data-ds-showcase]')) return

  // Регистрируется после initPrimitives: невалидную форму обработчик field.client уже остановил
  document.querySelectorAll<HTMLFormElement>('form[data-showcase-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const dlg = form.closest('dialog')
      if (dlg) closeDialog(dlg)
      toast({ title: 'Заявка принята', text: 'Мы перезвоним в течение часа' })
    })
  })

  document.querySelector('[data-showcase-toast]')?.addEventListener('click', () => {
    toast({ title: 'Уведомление', text: 'Исчезнет через 5 секунд' })
  })
}
