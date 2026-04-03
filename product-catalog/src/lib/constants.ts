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
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
} as const

export function stagger(index: number, base = 0.04) {
  return { ...FADE_IN, transition: { duration: 0.25, delay: index * base } }
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
    label: 'Production Ready',
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

// Layer definitions (ordered L1 bottom → L5 top)
export const LAYER_DEFS = [
  {
    id: 'l1' as const,
    number: 'L1',
    label: 'Secure Foundation',
    color: 'slate' as const,
    bgClass: 'bg-slate-600',
    textClass: 'text-slate-300',
    borderClass: 'border-slate-600/40',
    rowBgClass: 'bg-slate-900/30',
  },
  {
    id: 'l2' as const,
    number: 'L2',
    label: 'AI Core Engine',
    color: 'orange' as const,
    bgClass: 'bg-orange-600',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-600/40',
    rowBgClass: 'bg-orange-950/20',
  },
  {
    id: 'l3' as const,
    number: 'L3',
    label: 'Strategy, Governance & Compliance',
    color: 'green' as const,
    bgClass: 'bg-green-700',
    textClass: 'text-green-300',
    borderClass: 'border-green-600/40',
    rowBgClass: 'bg-green-950/20',
  },
  {
    id: 'l4' as const,
    number: 'L4',
    label: 'Business Applications',
    color: 'blue' as const,
    bgClass: 'bg-blue-700',
    textClass: 'text-blue-300',
    borderClass: 'border-blue-600/40',
    rowBgClass: 'bg-blue-950/20',
  },
  {
    id: 'l5' as const,
    number: 'L5',
    label: 'Customer Facing Applications',
    color: 'purple' as const,
    bgClass: 'bg-purple-700',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-600/40',
    rowBgClass: 'bg-purple-950/20',
  },
] as const

export type LayerId = typeof LAYER_DEFS[number]['id']

// Solving contexts for the carousel (5 slides)
export const SOLVING_CONTEXTS = [
  {
    title: 'Finance Consolidation Engine',
    productIds: ['prod-esal', 'prod-finance-engine', 'prod-adi-chain', 'prod-effora'],
  },
  {
    title: 'Sovereign AI Infra',
    productIds: ['prod-corerun-aigw', 'prod-cyberpod', 'prod-agentsight', 'prod-agentic-ocr', 'prod-corerun', 'prod-hci'],
  },
  {
    title: 'Workforce & HR',
    productIds: ['prod-skillforge', 'prod-actionly', 'prod-support-ops', 'prod-harmony-crm'],
  },
  {
    title: 'Risk & Compliance',
    productIds: ['prod-scalerisk', 'prod-stratify', 'prod-lighthouse', 'prod-c3'],
  },
  {
    title: 'Cyber Security',
    productIds: ['prod-cyberpod', 'prod-c3', 'prod-hci', 'prod-stratify'],
  },
] as const
