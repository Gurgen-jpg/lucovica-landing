// Вкладки: WAI-ARIA APG Tabs с автоматической активацией.

function select(tabs: HTMLButtonElement[], next: HTMLButtonElement, focus: boolean, syncHash = false): void {
  for (const tab of tabs) {
    const on = tab === next
    tab.setAttribute('aria-selected', String(on))
    tab.tabIndex = on ? 0 : -1
    const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '')
    if (panel) panel.hidden = !on
  }
  if (focus) next.focus()
  // Вкладки с data-hash отражают выбор в адресе (ссылка /price#men)
  if (syncHash && next.dataset.hash !== undefined) {
    history.replaceState(null, '', location.pathname + location.search + next.dataset.hash)
  }
}

function setup(root: HTMLElement): void {
  if (root.dataset.enhanced !== undefined) return
  const list = root.querySelector<HTMLElement>('[role="tablist"]')
  if (!list) return
  const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
  const fromHash = location.hash ? tabs.find((t) => t.dataset.hash === location.hash) : undefined
  const current = fromHash ?? tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]
  if (!current) return

  root.dataset.enhanced = ''
  list.hidden = false
  select(tabs, current, false)

  list.addEventListener('click', (e) => {
    const tab = (e.target as Element).closest<HTMLButtonElement>('[role="tab"]')
    if (tab) select(tabs, tab, false, true)
  })

  list.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (i < 0) return
    const last = tabs.length - 1
    const to =
      e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1
    if (to < 0) return
    e.preventDefault()
    select(tabs, tabs[to]!, true, true)
  })
}

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ds="tabs"]').forEach(setup)
}
