import { cn, initials } from '@/lib/utils'

interface AvatarInitialsProps {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

export function AvatarInitials({ name, size = 'md', className }: AvatarInitialsProps) {
  return (
    <div className={cn(
      'rounded-full bg-primary/15 flex items-center justify-center font-semibold text-primary shrink-0',
      size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-10 w-10 text-xs',
      className
    )}>
      {initials(name)}
    </div>
  )
}
