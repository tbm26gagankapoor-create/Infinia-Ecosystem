import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="text-muted-foreground/20 mb-3">
        {icon ?? <Inbox className="h-10 w-10" />}
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground/60 mt-1 max-w-[280px]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
