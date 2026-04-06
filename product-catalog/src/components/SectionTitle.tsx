import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h3 className={cn('text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60', className)}>
      {children}
    </h3>
  )
}
