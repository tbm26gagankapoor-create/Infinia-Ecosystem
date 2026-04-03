// Chart heights
export const CHART_SM = 220
export const CHART_MD = 260
export const CHART_LG = 320

// Sheet widths
export const SHEET_SM = 360
export const SHEET_MD = 460
export const SHEET_LG = 560

// Standard grid patterns
export const STAT_GRID = 'grid grid-cols-2 sm:grid-cols-4 gap-4'

// Animation presets
export const FADE_IN = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
} as const

export function stagger(index: number, base = 0.04) {
  return { ...FADE_IN, transition: { duration: 0.2, delay: index * base } }
}

// Phase color config — muted, no neon
export const PHASE_CONFIG = {
  rd: {
    label: 'R&D',
    dot: 'bg-slate-500',
    text: 'text-slate-400',
    pill: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
  },
  alpha: {
    label: 'Alpha',
    dot: 'bg-indigo-500/70',
    text: 'text-indigo-300/80',
    pill: 'bg-indigo-950/50 text-indigo-300/80 border-indigo-800/40',
  },
  beta: {
    label: 'Beta',
    dot: 'bg-amber-500/70',
    text: 'text-amber-300/70',
    pill: 'bg-amber-950/40 text-amber-300/70 border-amber-800/30',
  },
  ga: {
    label: 'GA',
    dot: 'bg-emerald-500/70',
    text: 'text-emerald-300/70',
    pill: 'bg-emerald-950/40 text-emerald-300/70 border-emerald-800/30',
  },
  sunset: {
    label: 'Sunset',
    dot: 'bg-red-500/60',
    text: 'text-red-300/60',
    pill: 'bg-red-950/30 text-red-300/60 border-red-800/20',
  },
} as const

export const STATUS_CONFIG = {
  active: { dot: 'bg-emerald-500', label: 'Active' },
  paused: { dot: 'bg-amber-500', label: 'Paused' },
  deprecated: { dot: 'bg-zinc-500', label: 'Deprecated' },
} as const

// Stream definitions (ordered bottom-to-top as shown in stack diagram)
export const STREAM_DEFS = [
  {
    id: 'foundation' as const,
    label: 'Foundation',
    description: 'Core infrastructure and platform capabilities',
  },
  {
    id: 'ai-foundation' as const,
    label: 'AI Foundation',
    description: 'AI/ML platform products powering all AI workloads',
  },
  {
    id: 'agents' as const,
    label: 'Agents & Applications',
    description: 'User-facing agent tools and applications',
  },
] as const
