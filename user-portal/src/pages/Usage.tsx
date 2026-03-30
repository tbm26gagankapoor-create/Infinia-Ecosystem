import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { USAGE_DAILY, MODEL_USAGE } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { StatCard } from '@/components/StatCard'
import { PageHeader } from '@/components/PageHeader'
import type { ChartConfig } from '@/components/ui/chart'

const DATE_RANGES = ['Today', '7d', '30d', 'This Month']

const STAT_CARDS = [
  { label: 'Total Requests', value: '12,481', trend: { value: '+18%', up: true, text: 'Trending up this month' }, description: 'Requests over the last 30 days' },
  { label: 'Total Tokens', value: '4.2M', trend: { value: '+34%', up: true, text: 'Strong growth in usage' }, description: 'Input + output tokens combined' },
  { label: 'Total Spend', value: '$12.57', trend: { value: '+$3.20', up: true, text: 'Within budget this cycle' }, description: 'Of $100.00 purchased credit' },
  { label: 'Avg Latency p50', value: '342ms', trend: { value: '+12ms', up: false, text: 'Slightly higher than last period' }, description: 'Across all models and regions' },
]

const requestChartConfig = {
  requests: { label: 'Requests', color: 'var(--chart-1)' },
  errors: { label: 'Errors', color: 'var(--chart-5)' },
} satisfies ChartConfig

const spendChartConfig = {
  cost: { label: 'Cost', color: 'var(--chart-1)' },
} satisfies ChartConfig

const tokenChartConfig = {
  inputTokens: { label: 'Input', color: 'var(--chart-1)' },
  outputTokens: { label: 'Output', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function Usage() {
  const [range, setRange] = useState('30d')

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader title="Usage Analytics" subtitle="Monitor requests, tokens, latency, and errors">
        <div className="flex gap-1">
          {DATE_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded border transition-colors',
                range === r
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-transparent text-muted-foreground border-border hover:bg-accent hover:text-foreground'
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Request volume chart */}
      <Card>
        <CardHeader>
          <CardTitle>Request Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={requestChartConfig} className="h-[200px] w-full">
            <AreaChart data={USAGE_DAILY} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="usageReqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-requests)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-requests)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="usageErrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-errors)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-errors)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} interval={3} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="requests" stroke="var(--color-requests)" fill="url(#usageReqGrad)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="errors" stroke="var(--color-errors)" fill="url(#usageErrGrad)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Spend by model */}
        <Card>
          <CardHeader>
            <CardTitle>Spend by Model</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={spendChartConfig} className="h-[160px] w-full">
              <BarChart data={MODEL_USAGE} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="model" tickLine={false} axisLine={false} width={120} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `$${Number(v).toFixed(2)}`} />} />
                <Bar dataKey="cost" fill="var(--color-cost)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ChartContainer>

            <div className="mt-3 border-t pt-3 space-y-1.5">
              {MODEL_USAGE.map(m => (
                <div key={m.model} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{m.model}</span>
                  <div className="flex gap-4 text-right flex-shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <span className="font-mono text-foreground">{m.requests.toLocaleString()} req</span>
                    <span className="font-mono font-medium text-foreground w-12">${m.cost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latency & errors */}
        <Card>
          <CardHeader>
            <CardTitle>Latency &amp; Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>p50</TableHead>
                  <TableHead>p95</TableHead>
                  <TableHead>p99</TableHead>
                  <TableHead>Error %</TableHead>
                  <TableHead className="w-[70px]">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODEL_USAGE.map(m => (
                  <TableRow key={m.model}>
                    <TableCell className="font-medium truncate max-w-[110px]">{m.model}</TableCell>
                    <TableCell className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{m.p50}ms</TableCell>
                    <TableCell className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{m.p95}ms</TableCell>
                    <TableCell className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{m.p99}ms</TableCell>
                    <TableCell className={cn('font-mono font-medium', m.errorRate > 1.5 ? 'text-red-500' : m.errorRate > 0.8 ? 'text-amber-500' : 'text-emerald-500')}>
                      {m.errorRate}%
                    </TableCell>
                    <TableCell>
                      {/* Sparkline — exception: uses ResponsiveContainer for inline 60x28 charts */}
                      <ResponsiveContainer width={60} height={28}>
                        <LineChart data={m.trend.map((v, i) => ({ v, i }))}>
                          <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Token breakdown */}
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Token Breakdown</div>
              <ChartContainer config={tokenChartConfig} className="h-[80px] w-full">
                <BarChart data={MODEL_USAGE}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="model" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${(Number(v) / 1000000).toFixed(1)}M`} />} />
                  <Bar dataKey="inputTokens" stackId="a" fill="var(--color-inputTokens)" />
                  <Bar dataKey="outputTokens" stackId="a" fill="var(--color-outputTokens)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
