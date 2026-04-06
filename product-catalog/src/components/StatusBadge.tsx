import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  active:       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  paused:       'bg-amber-500/10 text-amber-400 border-amber-500/20',
  deprecated:   'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status.toLowerCase()] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
      style,
      className
    )}>
      {status}
    </span>
  )
}
