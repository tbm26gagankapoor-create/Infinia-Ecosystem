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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        {trend && (
          <div className="flex items-center gap-1 font-medium">
            {trend.up
              ? <TrendingUp className="h-4 w-4 text-primary" />
              : <TrendingDown className="h-4 w-4 text-destructive" />
            }
            {trend.text}
          </div>
        )}
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  )
}
