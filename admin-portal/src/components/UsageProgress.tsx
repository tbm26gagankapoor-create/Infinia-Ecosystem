import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface UsageProgressProps {
  used: number
  limit: number
  className?: string
  showLabel?: boolean
}

export function UsageProgress({ used, limit, className, showLabel = true }: UsageProgressProps) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0
  const isDanger = pct > 90
  const isWarning = pct > 75 && pct <= 90

  return (
    <div className={cn('space-y-1', className)}>
      <Progress
        value={pct}
        className={cn(
          'h-2',
          isDanger && '[&_[data-slot=progress-indicator]]:bg-red-500',
          isWarning && '[&_[data-slot=progress-indicator]]:bg-amber-500',
          !isDanger && !isWarning && '[&_[data-slot=progress-indicator]]:bg-emerald-500'
        )}
      />
      {showLabel && (
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>${used.toLocaleString()} used</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}
