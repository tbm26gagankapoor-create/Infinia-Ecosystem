// ── Design Tokens ──
// Single source of truth for visual constants across the app.
// Import from here instead of inventing values per-component.

// ── Border opacity tiers ──
// FAINT  /20 → decorative dividers inside tables/rows
// SUBTLE /40 → card borders, section boundaries (default)
// EMPHASIS /60 → hover states on interactive cards

// ── Text hierarchy ──
// text-muted-foreground       → standard secondary text
// text-muted-foreground/60    → overlines, tertiary hints, timestamps

// ── Semantic color classes ──
export const POSITIVE = 'text-emerald-600 dark:text-emerald-400'
export const NEGATIVE = 'text-red-600 dark:text-red-400'

// ── Grid patterns ──
export const STAT_GRID = 'grid grid-cols-2 sm:grid-cols-4 gap-3'
export const STAT_GRID_3 = 'grid grid-cols-1 sm:grid-cols-3 gap-3'
export const CARDS_GRID = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'
export const CHARTS_GRID = 'grid grid-cols-1 lg:grid-cols-2 gap-4'

// ── Tab styling (polished, consistent across all tabbed pages) ──
export const TAB_LIST = 'bg-card border border-border/40 h-9 p-1 gap-1'
export const TAB_TRIGGER =
  'h-7 px-3 text-sm data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none'

// ── Shared Recharts config ──
export const CHART_TOOLTIP_STYLE = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontSize: 12,
  color: 'var(--foreground)',
} as const

export const CHART_LABEL_STYLE = {
  color: 'var(--muted-foreground)',
  fontSize: 11,
} as const

export const CHART_AXIS_PROPS = {
  tick: { fontSize: 10, fill: 'var(--muted-foreground)' },
  axisLine: false as const,
  tickLine: false as const,
} as const

export const CHART_LINE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
]

// ── Update type badge styles ──
export const UPDATE_TYPE_STYLES: Record<string, string> = {
  feature: 'bg-primary/10 text-primary',
  bugfix: 'bg-destructive/10 text-destructive',
  launch: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  milestone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
}

// ── Medal row highlight (leaderboard tables) ──
export function medalRowClass(rank: number) {
  if (rank === 1) return 'border-l-2 border-l-amber-400/60 bg-amber-500/[0.03]'
  if (rank === 2) return 'border-l-2 border-l-zinc-400/40'
  if (rank === 3) return 'border-l-2 border-l-orange-400/40'
  return 'border-l-2 border-l-transparent'
}
