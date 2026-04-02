import { cn } from '@/lib/utils'

const ROLE_STYLES: Record<string, string> = {
  Admin:   'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Member:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Viewer:  'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

interface RoleBadgeProps {
  role: string
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const style = ROLE_STYLES[role] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
      style,
      className
    )}>
      {role}
    </span>
  )
}
