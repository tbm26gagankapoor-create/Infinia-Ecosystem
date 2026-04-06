import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className="border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1">
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium">
            {trend.up
              ? <TrendingUp className="h-3.5 w-3.5 text-primary" />
              : <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            }
            {trend.text}
          </div>
        )}
        <div className="text-[11px] text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  )
}
