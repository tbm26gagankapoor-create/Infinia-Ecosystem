import { useMemo } from 'react'
import { AreaChart, Area, XAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Card, CardContent } from '@/components/ui/card'
import { ChartCard } from '../components/ChartCard'
import { BarList } from '../components/BarList'
import { CategoryBar } from '../components/CategoryBar'
import { AnalyticsDataTable } from '../components/AnalyticsDataTable'
import type { AnalyticsDataPoint, ModelAnalyticsRow, CostByProject } from '@/lib/analytics-mock'
import type { ColumnDef } from '@tanstack/react-table'

const spendConfig = {
  cost: { label: 'Cost ($)', color: 'var(--chart-1)' },
} satisfies ChartConfig

const columns: ColumnDef<CostByProject, unknown>[] = [
  { accessorKey: 'projectName', header: 'Project', cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
  { accessorKey: 'cost', header: 'Cost', cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}` },
  { accessorKey: 'budget', header: 'Budget', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
  {
    id: 'utilization', header: 'Utilization',
    cell: ({ row }) => {
      const pct = (row.original.cost / row.original.budget * 100)
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-muted/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: pct > 80 ? 'hsl(var(--destructive))' : pct > 50 ? '#f59e0b' : '#10b981',
              }}
            />
          </div>
          <span className={pct > 80 ? 'text-red-500 font-medium' : ''}>{pct.toFixed(1)}%</span>
        </div>
      )
    },
  },
  { accessorKey: 'requests', header: 'Requests', cell: ({ getValue }) => (getValue() as number).toLocaleString() },
]

interface CostTabProps {
  timeSeries: AnalyticsDataPoint[]
  modelAnalytics: ModelAnalyticsRow[]
  costByProject: CostByProject[]
}

export function CostTab({ timeSeries, modelAnalytics, costByProject }: CostTabProps) {
  const modelCostRanking = useMemo(
    () => modelAnalytics
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 8)
      .map((m, i) => ({ name: m.model, value: m.cost, color: `var(--chart-${(i % 5) + 1})` })),
    [modelAnalytics]
  )

  const projectBudgetBars = useMemo(
    () => costByProject.map(p => ({
      label: p.projectName,
      value: p.cost,
      color: (p.cost / p.budget) > 0.8 ? '#ef4444' : (p.cost / p.budget) > 0.5 ? '#f59e0b' : '#10b981',
    })),
    [costByProject]
  )

  const totalCost = useMemo(() => timeSeries.reduce((s, d) => s + d.cost, 0), [timeSeries])
  const totalBudget = useMemo(() => costByProject.reduce((s, p) => s + p.budget, 0), [costByProject])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Spend Over Time" subtitle="Daily cost trend" height={220} className="lg:col-span-2">
          <ChartContainer config={spendConfig} className="h-full w-full !aspect-auto">
            <AreaChart data={timeSeries} margin={{ left: 12, right: 12, top: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval="preserveStartEnd" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <defs>
                <linearGradient id="ct-fillCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="cost" stroke="var(--color-cost)" fill="url(#ct-fillCost)" strokeWidth={1.5} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <Card>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-foreground">Cost by Model</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Ranked by spend</p>
          </div>
          <CardContent className="px-4 pb-4">
            <BarList data={modelCostRanking} valueFormatter={v => `$${v.toFixed(2)}`} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-foreground">Budget Utilization</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ${totalCost.toFixed(2)} of ${totalBudget.toLocaleString()} total budget
            </p>
          </div>
          <CardContent className="px-4 pb-4">
            <CategoryBar values={projectBudgetBars} />
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> Under 50%</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-500" /> 50–80%</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-red-500" /> Over 80%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-foreground">Project Spend</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">By project</p>
          </div>
          <CardContent className="px-4 pb-4">
            <BarList
              data={costByProject.map((p, i) => ({ name: p.projectName, value: p.cost, color: `var(--chart-${(i % 5) + 1})` }))}
              valueFormatter={v => `$${v.toFixed(2)}`}
            />
          </CardContent>
        </Card>
      </div>

      <AnalyticsDataTable
        data={costByProject as unknown as Record<string, unknown>[]}
        columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
        searchPlaceholder="Search projects..."
        exportFilename="cost-analytics"
      />
    </div>
  )
}
