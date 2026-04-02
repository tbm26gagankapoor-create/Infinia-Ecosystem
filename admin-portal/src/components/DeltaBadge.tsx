import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeltaBadgeProps {
  value: string
  type?: 'increase' | 'decrease' | 'neutral'
  isPositive?: boolean
  className?: string
}

export function DeltaBadge({ value, type = 'neutral', isPositive, className }: DeltaBadgeProps) {
  const resolvedPositive = isPositive ?? type === 'increase'
  const Icon = type === 'increase' ? TrendingUp : type === 'decrease' ? TrendingDown : Minus

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
        resolvedPositive
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : type === 'neutral'
            ? 'bg-muted text-muted-foreground'
            : 'bg-red-500/10 text-red-600 dark:text-red-400',
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {value}
    </span>
  )
}
