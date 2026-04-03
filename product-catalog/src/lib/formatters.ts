export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`
  return n.toLocaleString()
}

export function formatCurrency(n: number, compact = false): string {
  if (compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  }
  return `$${n.toLocaleString()}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
