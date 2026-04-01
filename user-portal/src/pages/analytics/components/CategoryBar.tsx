import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface CategoryBarProps {
  values: { label: string; value: number; color: string }[]
  markerValue?: number
  className?: string
}

export function CategoryBar({ values, markerValue, className }: CategoryBarProps) {
  const total = values.reduce((s, v) => s + v.value, 0)

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted/30">
        {values.map((segment) => {
          const pct = (segment.value / total) * 100
          return (
            <Tooltip key={segment.label}>
              <TooltipTrigger asChild>
                <div
                  className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                  style={{ width: `${pct}%`, backgroundColor: segment.color }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {segment.label}: {pct.toFixed(1)}%
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
      {markerValue != null && (
        <div className="relative h-0">
          <div
            className="absolute -top-4 w-0.5 h-4 bg-foreground rounded-full"
            style={{ left: `${Math.min(markerValue, 100)}%` }}
          />
        </div>
      )}
      <div className="flex justify-between text-[10px] text-muted-foreground">
        {values.map(v => (
          <div key={v.label} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: v.color }} />
            {v.label}
          </div>
        ))}
      </div>
    </div>
  )
}
