import { cn } from '@/lib/utils'
import { UPDATE_TYPE_STYLES } from '@/lib/design-tokens'

interface UpdateTypeBadgeProps {
  type: string
  className?: string
}

export function UpdateTypeBadge({ type, className }: UpdateTypeBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider shrink-0',
      UPDATE_TYPE_STYLES[type] ?? 'bg-muted/60 text-muted-foreground',
      className
    )}>
      {type}
    </span>
  )
}
