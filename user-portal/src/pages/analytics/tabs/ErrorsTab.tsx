import { useMemo } from 'react'
import { AreaChart, Area, XAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Card, CardContent } from '@/components/ui/card'
import { ChartCard } from '../components/ChartCard'
import { BarList } from '../components/BarList'
import { CategoryBar } from '../components/CategoryBar'
import { AnalyticsDataTable } from '../components/AnalyticsDataTable'
import { Badge } from '@/components/ui/badge'
import type { AnalyticsDataPoint, ErrorLogEntry } from '@/lib/analytics-mock'
import type { ColumnDef } from '@tanstack/react-table'

const errorRateConfig = {
  errorRate: { label: 'Error Rate %', color: 'var(--chart-5)' },
} satisfies ChartConfig

const TYPE_STYLES: Record<string, string> = {
  rate_limit: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  timeout: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  invalid_request: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  server_error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  auth_error: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
}

const TYPE_COLORS: Record<string, string> = {
  rate_limit: '#f59e0b', timeout: '#f97316', invalid_request: '#3b82f6',
  server_error: '#ef4444', auth_error: '#8b5cf6',
}

const columns: ColumnDef<ErrorLogEntry, unknown>[] = [
  { accessorKey: 'timestamp', header: 'Time', cell: ({ getValue }) => <span className="font-mono text-[10px] text-muted-foreground">{getValue() as string}</span> },
  { accessorKey: 'model', header: 'Model', cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
  { accessorKey: 'project', header: 'Project' },
  {
    accessorKey: 'errorType', header: 'Type',
    cell: ({ getValue }) => {
      const t = getValue() as string
      return <Badge variant="outline" className={`text-[10px] ${TYPE_STYLES[t] ?? ''}`}>{t.replace('_', ' ')}</Badge>
    },
  },
  { accessorKey: 'statusCode', header: 'Status', cell: ({ getValue }) => <span className="font-mono">{getValue() as number}</span> },
  { accessorKey: 'message', header: 'Message', cell: ({ getValue }) => <span className="truncate max-w-56 block text-muted-foreground">{getValue() as string}</span> },
]

interface ErrorsTabProps {
  timeSeries: AnalyticsDataPoint[]
  errorLog: ErrorLogEntry[]
}

export function ErrorsTab({ timeSeries, errorLog }: ErrorsTabProps) {
  const errorsByType = useMemo(() => {
    const counts: Record<string, number> = {}
    errorLog.forEach(e => { counts[e.errorType] = (counts[e.errorType] || 0) + 1 })
    return Object.entries(counts)
      .map(([type, count]) => ({
        name: type.replace('_', ' '),
        value: count,
        color: TYPE_COLORS[type] ?? '#888',
      }))
      .sort((a, b) => b.value - a.value)
  }, [errorLog])

  const errorsByModel = useMemo(() => {
    const counts: Record<string, number> = {}
    errorLog.forEach(e => { counts[e.model] = (counts[e.model] || 0) + 1 })
    return Object.entries(counts)
      .map(([name, count], i) => ({ name, value: count, color: `var(--chart-${(i % 5) + 1})` }))
      .sort((a, b) => b.value - a.value)
  }, [errorLog])

  const typeDistribution = useMemo(
    () => errorsByType.map(e => ({ label: e.name, value: e.value, color: e.color })),
    [errorsByType]
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Error Rate Over Time" subtitle="Percentage of failed requests" height={220} className="lg:col-span-2">
          <ChartContainer config={errorRateConfig} className="h-full w-full !aspect-auto">
            <AreaChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <defs>
                <linearGradient id="et-fillErr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-errorRate)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-errorRate)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="errorRate" stroke="var(--color-errorRate)" fill="url(#et-fillErr)" strokeWidth={1.5} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <Card>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-foreground">Error Distribution</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">By error type</p>
          </div>
          <CardContent className="px-4 pb-4 space-y-4">
            <CategoryBar values={typeDistribution} />
            <BarList data={errorsByType} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-foreground">Errors by Model</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Which models generate the most errors</p>
        </div>
        <CardContent className="px-4 pb-4">
          <BarList data={errorsByModel} />
        </CardContent>
      </Card>

      <AnalyticsDataTable
        data={errorLog as unknown as Record<string, unknown>[]}
        columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
        searchPlaceholder="Search errors..."
        exportFilename="error-log"
      />
    </div>
  )
}
