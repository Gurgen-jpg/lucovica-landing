// Чипы-переключатели: aria-pressed + синхронизация скрытого поля формы.

function setup(group: HTMLElement): void {
  if (group.dataset.enhanced !== undefined) return
  group.dataset.enhanced = ''
  const chips = Array.from(group.querySelectorAll<HTMLButtonElement>('.ds-chip'))
  const field = group.querySelector<HTMLInputElement>('input[type="hidden"]')
  const multiple = group.dataset.multiple !== undefined

  group.addEventListener('click', (e) => {
    const chip = (e.target as Element).closest<HTMLButtonElement>('.ds-chip')
    if (!chip) return
    const on = chip.getAttribute('aria-pressed') !== 'true'
    if (!multiple) for (const c of chips) c.setAttribute('aria-pressed', 'false')
    chip.setAttribute('aria-pressed', String(on))
    if (field) {
      field.value = chips
        .filter((c) => c.getAttribute('aria-pressed') === 'true')
        .map((c) => c.value)
        .join(',')
    }
  })
}

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ds="chips"]').forEach(setup)
}
