import { cn } from '@/lib/utils'

const ACTION_STYLES: Record<string, string> = {
  // Key actions
  'key.created':           'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'key.revoked':           'bg-red-500/10 text-red-400 border-red-500/20',
  'key.rotated':           'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'key.scoping.updated':   'bg-blue-500/10 text-blue-400 border-blue-500/20',

  // Org actions
  'org.postpaid.activated':'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'org.credit_limit.updated':'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'org.suspended':         'bg-red-500/10 text-red-400 border-red-500/20',
  'org.member.invited':    'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'org.created':           'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',

  // User actions
  'user.role.changed':     'bg-purple-500/10 text-purple-400 border-purple-500/20',

  // Billing
  'billing.method.updated':'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'budget.alert.triggered':'bg-orange-500/10 text-orange-400 border-orange-500/20',

  // Pricing
  'pricing.tier.updated':  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

interface ActionBadgeProps {
  action: string
  className?: string
}

export function ActionBadge({ action, className }: ActionBadgeProps) {
  const style = ACTION_STYLES[action] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  return (
    <span className={cn(
      'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono whitespace-nowrap',
      style,
      className
    )}>
      {action}
    </span>
  )
}
