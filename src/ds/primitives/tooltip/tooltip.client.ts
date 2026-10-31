// Подсказка: Escape скрывает до ухода курсора/фокуса (показ и скрытие — CSS).

function setup(root: HTMLElement): void {
  if (root.dataset.enhanced !== undefined) return
  root.dataset.enhanced = ''
  const reset = () => delete root.dataset.dismissed
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.dataset.dismissed === undefined) {
      root.dataset.dismissed = ''
      e.stopPropagation()
    }
  })
  root.addEventListener('mouseleave', reset)
  root.addEventListener('focusout', reset)
}

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ds="tooltip"]').forEach(setup)
}
