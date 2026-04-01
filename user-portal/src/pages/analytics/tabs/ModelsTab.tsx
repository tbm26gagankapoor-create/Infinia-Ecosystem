import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Card, CardContent } from '@/components/ui/card'
import { ChartCard } from '../components/ChartCard'
import { BarList } from '../components/BarList'
import { SparkChart } from '../components/SparkChart'
import { AnalyticsDataTable } from '../components/AnalyticsDataTable'
import { Badge } from '@/components/ui/badge'
import type { ModelAnalyticsRow } from '@/lib/analytics-mock'
import type { ColumnDef } from '@tanstack/react-table'

const requestsConfig = {
  requests: { label: 'Requests', color: 'var(--chart-1)' },
} satisfies ChartConfig

const columns: ColumnDef<ModelAnalyticsRow, unknown>[] = [
  { accessorKey: 'model', header: 'Model', cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
  { accessorKey: 'provider', header: 'Provider', cell: ({ getValue }) => <Badge variant="secondary" className="text-[10px]">{getValue() as string}</Badge> },
  { accessorKey: 'requests', header: 'Requests', cell: ({ getValue }) => (getValue() as number).toLocaleString() },
  { accessorKey: 'cost', header: 'Cost', cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}` },
  { accessorKey: 'errorRate', header: 'Error %', cell: ({ getValue }) => {
    const v = getValue() as number
    return <span className={v > 2 ? 'text-red-500 font-medium' : ''}>{v}%</span>
  }},
  { accessorKey: 'p50', header: 'p50', cell: ({ getValue }) => `${getValue()}ms` },
  { accessorKey: 'p95', header: 'p95', cell: ({ getValue }) => `${getValue()}ms` },
  {
    id: 'sparkline',
    header: 'Trend',
    cell: ({ row }) => (
      <div className="w-20 h-5">
        <SparkChart data={row.original.trend} height={20} showGradient={false} />
      </div>
    ),
  },
]

interface ModelsTabProps {
  modelAnalytics: ModelAnalyticsRow[]
}

export function ModelsTab({ modelAnalytics }: ModelsTabProps) {
  const costRanking = useMemo(
    () => [...modelAnalytics]
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 6)
      .map((m, i) => ({ name: m.model, value: m.cost, color: `var(--chart-${(i % 5) + 1})` })),
    [modelAnalytics]
  )

  const requestsByModel = useMemo(
    () => [...modelAnalytics]
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 8)
      .map(m => ({ model: m.model, requests: m.requests })),
    [modelAnalytics]
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Requests by Model" subtitle="Top models by request volume" height={220} className="lg:col-span-2">
          <ChartContainer config={requestsConfig} className="h-full w-full !aspect-auto">
            <BarChart data={requestsByModel} layout="vertical" margin={{ left: 8, right: 12, top: 4 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
              <YAxis dataKey="model" type="category" tickLine={false} axisLine={false} fontSize={10} width={120} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill="var(--color-requests)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <Card>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-foreground">Cost by Model</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Ranked by spend</p>
          </div>
          <CardContent className="px-4 pb-4">
            <BarList data={costRanking} valueFormatter={v => `$${v.toFixed(2)}`} />
          </CardContent>
        </Card>
      </div>

      <AnalyticsDataTable
        data={modelAnalytics as unknown as Record<string, unknown>[]}
        columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
        searchPlaceholder="Search models..."
        exportFilename="model-analytics"
      />
    </div>
  )
}
