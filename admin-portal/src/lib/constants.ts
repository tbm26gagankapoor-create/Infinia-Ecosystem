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
