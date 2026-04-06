import { cn } from '@/lib/utils'
import { PHASE_CONFIG } from '@/lib/constants'
import type { Phase } from '@/lib/mock-data'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  rd: 'R&D — Internal research and development. Not yet available to customers.',
  alpha: 'Alpha — Early testing with a small group of internal or invited users. Expect rough edges.',
  beta: 'Beta — Actively tested with select customers. Feature-complete but not yet production-hardened.',
  ga: 'Production Ready — Fully launched, supported, and available to all customers.',
  sunset: 'Sunset — End-of-life. No new customers accepted; existing users being migrated off.',
}

interface PhaseBadgeProps {
  phase: Phase
  className?: string
  showDot?: boolean
}

export function PhaseBadge({ phase, className, showDot = true }: PhaseBadgeProps) {
  const cfg = PHASE_CONFIG[phase]
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider cursor-default',
            cfg.pill,
            className
          )}>
            {showDot && (
              <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', cfg.dot)} />
            )}
            {cfg.label}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-center leading-snug">
          {PHASE_DESCRIPTIONS[phase]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
