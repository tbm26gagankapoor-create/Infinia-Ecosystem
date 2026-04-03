import { cn } from '@/lib/utils'
import { PHASE_CONFIG } from '@/lib/constants'
import type { Phase } from '@/lib/mock-data'

interface PhaseBadgeProps {
  phase: Phase
  className?: string
  showDot?: boolean
}

export function PhaseBadge({ phase, className, showDot = true }: PhaseBadgeProps) {
  const cfg = PHASE_CONFIG[phase]
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
      cfg.pill,
      className
    )}>
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', cfg.dot)} />
      )}
      {cfg.label}
    </span>
  )
}
