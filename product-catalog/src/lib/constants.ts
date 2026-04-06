// Chart heights
export const CHART_SM = 220
export const CHART_MD = 260
export const CHART_LG = 320

// Sheet widths
export const SHEET_SM = 360
export const SHEET_MD = 460
export const SHEET_LG = 560

// Animation presets
export const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
} as const

export function stagger(index: number, base = 0.04) {
  return { ...FADE_IN, transition: { duration: 0.25, delay: index * base } }
}

// Phase color config — light/dark compatible
export const PHASE_CONFIG = {
  rd: {
    label: 'R&D',
    dot: 'bg-slate-400 dark:bg-slate-500',
    text: 'text-slate-600 dark:text-slate-400',
    pill: 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/50',
  },
  alpha: {
    label: 'Alpha',
    dot: 'bg-blue-500/70',
    text: 'text-blue-600 dark:text-blue-300/80',
    pill: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300/80 border-blue-200 dark:border-blue-800/40',
  },
  beta: {
    label: 'Beta',
    dot: 'bg-amber-500/70',
    text: 'text-amber-600 dark:text-amber-300/70',
    pill: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300/70 border-amber-200 dark:border-amber-800/30',
  },
  ga: {
    label: 'Production Ready',
    dot: 'bg-emerald-500/70',
    text: 'text-emerald-600 dark:text-emerald-300/70',
    pill: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300/70 border-emerald-200 dark:border-emerald-800/30',
  },
  sunset: {
    label: 'Sunset',
    dot: 'bg-red-500/60',
    text: 'text-red-600 dark:text-red-300/60',
    pill: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300/60 border-red-200 dark:border-red-800/20',
  },
} as const

export const STATUS_CONFIG = {
  active: { dot: 'bg-emerald-500', label: 'Active' },
  paused: { dot: 'bg-amber-500', label: 'Paused' },
  deprecated: { dot: 'bg-zinc-500', label: 'Deprecated' },
} as const

// Layer definitions (ordered L1 bottom → L3 top)
export const LAYER_DEFS = [
  {
    id: 'l1' as const,
    number: 'L1',
    label: 'Infrastructure',
    color: 'slate' as const,
    bgClass: 'bg-slate-600',
    textClass: 'text-slate-300',
    borderClass: 'border-slate-400/40 dark:border-slate-600/40',
    rowBgClass: 'bg-slate-50/80 dark:bg-slate-900/20',
    heroGradient: 'from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800',
  },
  {
    id: 'l2' as const,
    number: 'L2',
    label: 'AI Core Engine',
    color: 'emerald' as const,
    bgClass: 'bg-emerald-600',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-300/60 dark:border-emerald-600/40',
    rowBgClass: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    heroGradient: 'from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900',
  },
  {
    id: 'l3' as const,
    number: 'L3',
    label: 'Applications',
    color: 'blue' as const,
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-700 dark:text-blue-300',
    borderClass: 'border-blue-300/60 dark:border-blue-600/40',
    rowBgClass: 'bg-blue-50/60 dark:bg-blue-950/20',
    heroGradient: 'from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900',
  },
] as const

export type LayerId = typeof LAYER_DEFS[number]['id']

// Solving contexts for the carousel (5 slides)
export const SOLVING_CONTEXTS = [
  {
    title: 'Finance & Compliance',
    productIds: ['prod-esal', 'prod-finance-engine', 'prod-scalerisk', 'prod-xailon'],
  },
  {
    title: 'Sovereign AI Infra',
    productIds: ['prod-corerun-aigw', 'prod-corerun-mlops', 'prod-cyberpod', 'prod-agentsight', 'prod-agentic-ocr', 'prod-hci'],
  },
  {
    title: 'Workforce & Productivity',
    productIds: ['prod-skillforge', 'prod-actionly', 'prod-support-ops', 'prod-harmony-crm'],
  },
  {
    title: 'Cyber Security',
    productIds: ['prod-c3', 'prod-cyberpod', 'prod-agentsight', 'prod-stratify'],
  },
  {
    title: 'Cloud Infrastructure',
    productIds: ['prod-ccs', 'prod-dflare', 'prod-hci', 'prod-ckp', 'prod-cvm'],
  },
] as const
