export function getUtm() {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source') ?? undefined,
    utm_medium: p.get('utm_medium') ?? undefined,
    utm_campaign: p.get('utm_campaign') ?? undefined,
  }
}

export function formatDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export function buildTimeString(slot: string, date: string) {
  if (slot && date) return `${slot}, ${formatDate(date)}`
  if (slot) return slot
  if (date) return formatDate(date)
  return ''
}
