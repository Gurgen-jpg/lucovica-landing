// Аккордеон: single + collapsible (WAI-ARIA APG Accordion).

function setOpen(trigger: HTMLButtonElement, open: boolean): void {
  trigger.setAttribute('aria-expanded', String(open))
  const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '')
  if (panel) panel.hidden = !open
}

function setup(root: HTMLElement): void {
  if (root.dataset.enhanced !== undefined) return
  root.dataset.enhanced = ''
  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('.ds-accordion__trigger'))
  const initial = Number(root.dataset.defaultOpen ?? -1)
  triggers.forEach((t, i) => setOpen(t, i === initial))

  root.addEventListener('click', (e) => {
    const trigger = (e.target as Element).closest<HTMLButtonElement>('.ds-accordion__trigger')
    if (!trigger || !root.contains(trigger)) return
    const wasOpen = trigger.getAttribute('aria-expanded') === 'true'
    for (const t of triggers) setOpen(t, t === trigger && !wasOpen)
  })
}

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ds="accordion"]').forEach(setup)
}
