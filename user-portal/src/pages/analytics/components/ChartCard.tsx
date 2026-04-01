import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  height?: number
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, action, height = 260, children, className }: ChartCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <CardContent className="px-2 pb-3" style={{ height }}>{children}</CardContent>
    </Card>
  )
}
