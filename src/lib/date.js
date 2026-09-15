export function todayIso() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export function tomorrowIso() {
  const base = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  base.setDate(base.getDate() + 1)
  return base.toISOString().slice(0, 10)
}

export function formatDate(iso) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${iso}T12:00:00`))
}

export function dueDateLabel(iso) {
  if (!iso) return null
  if (iso === todayIso()) return 'Today'
  if (iso === tomorrowIso()) return 'Tomorrow'
  return formatDate(iso)
}

export function isOverdue(iso) {
  return Boolean(iso && iso < todayIso())
}

export function daysBetween(isoA, isoB) {
  return Math.round(
    (new Date(`${isoB}T12:00:00`) - new Date(`${isoA}T12:00:00`)) / 86400000,
  )
}
