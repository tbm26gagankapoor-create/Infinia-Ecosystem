import { Card, CardContent } from '@/components/ui/card'
import { DeltaBadge } from './components/DeltaBadge'
import { SparkChart } from './components/SparkChart'
import type { AnalyticsKPIs, AnalyticsDataPoint } from '@/lib/analytics-mock'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

interface AnalyticsKPIRowProps {
  kpis: AnalyticsKPIs
  timeSeries: AnalyticsDataPoint[]
}

export function AnalyticsKPIRow({ kpis, timeSeries }: AnalyticsKPIRowProps) {
  const sparkRequests = timeSeries.map(d => d.requests)
  const sparkTokens = timeSeries.map(d => d.inputTokens + d.outputTokens)
  const sparkCost = timeSeries.map(d => d.cost)
  const sparkErrors = timeSeries.map(d => d.errorRate)
  const sparkLatency = timeSeries.map(d => d.p50)
  const sparkP95 = timeSeries.map(d => d.p95)

  const cards = [
    {
      label: 'Total Requests',
      value: fmt(kpis.totalRequests),
      delta: '+12.3%',
      deltaType: 'increase' as const,
      positive: true,
      sub: 'vs prev period',
      spark: sparkRequests,
      color: 'var(--chart-1)',
    },
    {
      label: 'Total Tokens',
      value: fmt(kpis.totalTokens),
      delta: '+28.1%',
      deltaType: 'increase' as const,
      positive: true,
      sub: 'input + output',
      spark: sparkTokens,
      color: 'var(--chart-2)',
    },
    {
      label: 'Total Cost',
      value: `$${kpis.totalCost.toFixed(2)}`,
      delta: '+$2.10',
      deltaType: 'increase' as const,
      positive: false,
      sub: 'across all models',
      spark: sparkCost,
      color: 'var(--chart-3)',
    },
    {
      label: 'Error Rate',
      value: `${kpis.errorRate}%`,
      delta: kpis.errorRate > 1 ? `${kpis.errorRate}%` : `${kpis.errorRate}%`,
      deltaType: kpis.errorRate > 1 ? 'increase' as const : 'decrease' as const,
      positive: kpis.errorRate <= 1,
      sub: kpis.errorRate > 1 ? 'above threshold' : 'below 1% target',
      spark: sparkErrors,
      color: 'var(--chart-5)',
    },
    {
      label: 'Avg Latency',
      value: `${kpis.avgLatency}ms`,
      delta: '+8ms',
      deltaType: 'increase' as const,
      positive: false,
      sub: 'p50 response time',
      spark: sparkLatency,
      color: 'var(--chart-4)',
    },
    {
      label: 'P95 Latency',
      value: `${kpis.p95Latency}ms`,
      delta: '-15ms',
      deltaType: 'decrease' as const,
      positive: true,
      sub: '95th percentile',
      spark: sparkP95,
      color: 'var(--chart-1)',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map(card => (
        <Card key={card.label} className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              <DeltaBadge value={card.delta} type={card.deltaType} isPositive={card.positive} />
            </div>
            <p className="text-2xl font-bold font-mono tabular-nums tracking-tight">{card.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 mb-2">{card.sub}</p>
            <SparkChart data={card.spark} color={card.color} height={28} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
