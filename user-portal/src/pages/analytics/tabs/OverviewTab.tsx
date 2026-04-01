import { useMemo } from 'react'
import { AreaChart, Area, LineChart, Line, XAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Card, CardContent } from '@/components/ui/card'
import { ChartCard } from '../components/ChartCard'
import { BarList } from '../components/BarList'
import { CategoryBar } from '../components/CategoryBar'
import type { AnalyticsDataPoint, ModelAnalyticsRow } from '@/lib/analytics-mock'

const requestConfig = {
  requests: { label: 'Requests', color: 'var(--chart-1)' },
  errors: { label: 'Errors', color: 'var(--chart-5)' },
} satisfies ChartConfig

const tokenConfig = {
  inputTokens: { label: 'Input', color: 'var(--chart-1)' },
  outputTokens: { label: 'Output', color: 'var(--chart-2)' },
} satisfies ChartConfig

const errorRateConfig = {
  errorRate: { label: 'Error Rate %', color: 'var(--chart-5)' },
} satisfies ChartConfig

interface OverviewTabProps {
  timeSeries: AnalyticsDataPoint[]
  modelAnalytics: ModelAnalyticsRow[]
}

export function OverviewTab({ timeSeries, modelAnalytics }: OverviewTabProps) {
  const topModelsBar = useMemo(
    () => modelAnalytics
      .slice(0, 6)
      .sort((a, b) => b.requests - a.requests)
      .map((m, i) => ({
        name: m.model,
        value: m.requests,
        color: `var(--chart-${(i % 5) + 1})`,
      })),
    [modelAnalytics]
  )

  const costByProvider = useMemo(() => {
    const map: Record<string, number> = {}
    modelAnalytics.forEach(m => { map[m.provider] = (map[m.provider] || 0) + m.cost })
    const colors: Record<string, string> = {
      Anthropic: '#D97706', OpenAI: '#10A37F', Google: '#4285F4', Meta: '#0668E1',
      Mistral: '#FF7000', Microsoft: '#0078D4', Cohere: '#39594F', DeepSeek: '#7C3AED',
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: colors[label] ?? '#888' }))
  }, [modelAnalytics])

  const errorsByType = useMemo(() => {
    const total = timeSeries.reduce((s, d) => s + d.errors, 0)
    return [
      { label: 'Rate Limit', value: Math.round(total * 0.4), color: '#f59e0b' },
      { label: 'Timeout', value: Math.round(total * 0.25), color: '#f97316' },
      { label: 'Bad Request', value: Math.round(total * 0.15), color: '#3b82f6' },
      { label: 'Server', value: Math.round(total * 0.12), color: '#ef4444' },
      { label: 'Auth', value: Math.round(total * 0.08), color: '#8b5cf6' },
    ]
  }, [timeSeries])

  return (
    <div className="space-y-4">
      {/* Row 1: Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Request Volume" subtitle="Requests and errors over time" height={220} className="lg:col-span-2">
          <ChartContainer config={requestConfig} className="h-full w-full !aspect-auto">
            <AreaChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <defs>
                <linearGradient id="ov-fillReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-requests)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-requests)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="requests" stroke="var(--color-requests)" fill="url(#ov-fillReq)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="errors" stroke="var(--color-errors)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <Card>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-foreground">Top Models</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">By request volume</p>
          </div>
          <CardContent className="px-4 pb-4">
            <BarList
              data={topModelsBar}
              valueFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Token usage + Cost distribution + Error breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Token Usage" subtitle="Input vs output tokens" height={220}>
          <ChartContainer config={tokenConfig} className="h-full w-full !aspect-auto">
            <AreaChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <defs>
                <linearGradient id="ov-fillInput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-inputTokens)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-inputTokens)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ov-fillOutput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-outputTokens)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-outputTokens)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="inputTokens" stroke="var(--color-inputTokens)" fill="url(#ov-fillInput)" strokeWidth={1.5} stackId="1" />
              <Area type="monotone" dataKey="outputTokens" stroke="var(--color-outputTokens)" fill="url(#ov-fillOutput)" strokeWidth={1.5} stackId="1" />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <Card>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-foreground">Cost by Provider</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Spend distribution</p>
          </div>
          <CardContent className="px-4 pb-4">
            <CategoryBar values={costByProvider} />
            <div className="mt-4">
              <BarList
                data={costByProvider.map(p => ({ name: p.label, value: p.value, color: p.color }))}
                valueFormatter={v => `$${v.toFixed(2)}`}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <ChartCard title="Error Rate Trend" subtitle="% of failed requests" height={120}>
            <ChartContainer config={errorRateConfig} className="h-full w-full !aspect-auto">
              <LineChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="errorRate" stroke="var(--color-errorRate)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ChartContainer>
          </ChartCard>

          <Card>
            <div className="px-4 pt-4 pb-2">
              <h3 className="text-sm font-semibold text-foreground">Error Breakdown</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">By error type</p>
            </div>
            <CardContent className="px-4 pb-4">
              <CategoryBar values={errorsByType} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
