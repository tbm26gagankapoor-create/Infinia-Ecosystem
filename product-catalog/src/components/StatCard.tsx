import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: string
  trend?: {
    value: string
    up: boolean
    text: string
  }
  description: string
}

export function StatCard({ label, value, trend, description }: StatCardProps) {
  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <div className="text-2xl font-semibold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
      </CardContent>
      <div className="px-4 pb-4 flex flex-col gap-1 text-sm">
        {trend && (
          <>
            <div className="h-px bg-border/40 -mx-4 px-4 mb-1" />
            <div className="flex items-center gap-1 text-xs font-medium">
              {trend.up
                ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                : <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              }
              <span className={trend.up ? 'text-emerald-400' : 'text-red-400'}>{trend.value}</span>
              <span className="text-muted-foreground font-normal">{trend.text}</span>
            </div>
          </>
        )}
        <div className="text-xs text-muted-foreground/70">{description}</div>
      </div>
    </Card>
  )
}
