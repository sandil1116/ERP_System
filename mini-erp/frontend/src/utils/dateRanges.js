/** Shared date-range presets for the Financials module (Cash Flow, P&L, Ledger). */
export function getPresetRange(preset) {
  const now = new Date()
  const to = new Date(now.getTime() + 60000) // small buffer so "now" is inclusive

  let from
  if (preset === 'today') {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  } else if (preset === 'week') {
    const day = now.getDay() === 0 ? 7 : now.getDay() // Monday-start week
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (day - 1))
  } else if (preset === 'month') {
    from = new Date(now.getFullYear(), now.getMonth(), 1)
  } else {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }

  return { from: from.toISOString(), to: to.toISOString() }
}

export const PRESETS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
]
