import { cn } from '@/lib/utils'

interface FilterPillProps {
  label: string
  active: boolean
  onClick: () => void
  className?: string
}

export function FilterPill({ label, active, onClick, className }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-7 px-2.5 text-[11px] font-medium rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30',
        active
          ? 'bg-primary/15 text-primary border-primary/25 hover:bg-primary/20'
          : 'bg-transparent text-muted-foreground border-border/40 hover:bg-muted/30 hover:text-foreground',
        className
      )}
    >
      {label}
    </button>
  )
}
