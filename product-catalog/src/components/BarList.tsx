import { cn } from '@/lib/utils'

interface BarListItem {
  name: string
  value: number
  color?: string
  href?: string
  icon?: React.ReactNode
}

interface BarListProps {
  data: BarListItem[]
  valueFormatter?: (value: number) => string
  className?: string
  showAnimation?: boolean
}

export function BarList({
  data,
  valueFormatter = (v) => v.toLocaleString(),
  className,
  showAnimation = true,
}: BarListProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <div className={cn('space-y-2', className)}>
      {data.map((item, i) => {
        const widthPct = (item.value / maxValue) * 100
        return (
          <div key={item.name} className="group flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="text-sm text-foreground truncate">{item.name}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    showAnimation && 'transition-all duration-700 ease-out',
                  )}
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: item.color ?? `var(--chart-${(i % 5) + 1})`,
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-mono font-medium text-foreground tabular-nums w-16 text-right shrink-0">
              {valueFormatter(item.value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
