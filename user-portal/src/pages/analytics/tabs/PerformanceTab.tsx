import { AreaChart, Area, LineChart, Line, XAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartCard } from '../components/ChartCard'
import { AnalyticsDataTable } from '../components/AnalyticsDataTable'
import type { AnalyticsDataPoint } from '@/lib/analytics-mock'
import type { ColumnDef } from '@tanstack/react-table'

const latencyConfig = {
  p50: { label: 'p50', color: 'var(--chart-1)' },
  p95: { label: 'p95', color: 'var(--chart-3)' },
  p99: { label: 'p99', color: 'var(--chart-5)' },
} satisfies ChartConfig

const ttfbConfig = {
  ttfb: { label: 'TTFB (ms)', color: 'var(--chart-2)' },
} satisfies ChartConfig

const throughputConfig = {
  throughput: { label: 'Tokens/sec', color: 'var(--chart-4)' },
} satisfies ChartConfig

const columns: ColumnDef<AnalyticsDataPoint, unknown>[] = [
  { accessorKey: 'date', header: 'Period' },
  { accessorKey: 'requests', header: 'Requests', cell: ({ getValue }) => (getValue() as number).toLocaleString() },
  { accessorKey: 'p50', header: 'p50', cell: ({ getValue }) => `${getValue()}ms` },
  { accessorKey: 'p95', header: 'p95', cell: ({ getValue }) => `${getValue()}ms` },
  { accessorKey: 'p99', header: 'p99', cell: ({ getValue }) => `${getValue()}ms` },
  { accessorKey: 'ttfb', header: 'TTFB', cell: ({ getValue }) => `${getValue()}ms` },
  { accessorKey: 'throughput', header: 'Tok/s', cell: ({ getValue }) => (getValue() as number).toLocaleString() },
]

interface PerformanceTabProps {
  timeSeries: AnalyticsDataPoint[]
}

export function PerformanceTab({ timeSeries }: PerformanceTabProps) {
  return (
    <div className="space-y-4">
      <ChartCard title="Latency Distribution" subtitle="p50 / p95 / p99 percentile response times" height={240}>
        <ChartContainer config={latencyConfig} className="h-full w-full !aspect-auto">
          <LineChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="p50" stroke="var(--color-p50)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="p95" stroke="var(--color-p95)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            <Line type="monotone" dataKey="p99" stroke="var(--color-p99)" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
          </LineChart>
        </ChartContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Time to First Byte" subtitle="TTFB trend over time" height={200}>
          <ChartContainer config={ttfbConfig} className="h-full w-full !aspect-auto">
            <LineChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="ttfb" stroke="var(--color-ttfb)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Throughput" subtitle="Tokens processed per second" height={200}>
          <ChartContainer config={throughputConfig} className="h-full w-full !aspect-auto">
            <AreaChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <defs>
                <linearGradient id="pt-fillThru" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-throughput)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-throughput)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="throughput" stroke="var(--color-throughput)" fill="url(#pt-fillThru)" strokeWidth={1.5} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>
      </div>

      <AnalyticsDataTable
        data={timeSeries as unknown as Record<string, unknown>[]}
        columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
        searchPlaceholder="Search periods..."
        exportFilename="performance-analytics"
      />
    </div>
  )
}
