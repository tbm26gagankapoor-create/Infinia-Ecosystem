import { useState } from 'react'
import { Download, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useAnalyticsFilters } from './useAnalyticsFilters'
import { useAnalyticsData } from './useAnalyticsData'
import { AnalyticsFilterBar } from './AnalyticsFilterBar'
import { AnalyticsKPIRow } from './AnalyticsKPIRow'
import { OverviewTab } from './tabs/OverviewTab'
import { ModelsTab } from './tabs/ModelsTab'
import { CostTab } from './tabs/CostTab'
import { PerformanceTab } from './tabs/PerformanceTab'
import { ErrorsTab } from './tabs/ErrorsTab'

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'models', label: 'Models' },
  { value: 'cost', label: 'Cost' },
  { value: 'performance', label: 'Performance' },
  { value: 'errors', label: 'Errors' },
]

export function Analytics() {
  const { filters, dispatch } = useAnalyticsFilters()
  const { timeSeries, modelAnalytics, errorLog, costByProject, kpis } = useAnalyticsData(filters)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">Explore usage data with filters and drill-down reports</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      {/* ── Filter bar ── */}
      <AnalyticsFilterBar filters={filters} dispatch={dispatch} />

      {/* ── KPI summary ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Metrics</h2>
          <Separator className="flex-1" />
        </div>
        <AnalyticsKPIRow kpis={kpis} timeSeries={timeSeries} />
      </section>

      {/* ── Reports ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reports</h2>
          <Separator className="flex-1" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line" className="w-full justify-start border-b pb-0">
            {TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm">{tab.label}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-5">
            <OverviewTab timeSeries={timeSeries} modelAnalytics={modelAnalytics} />
          </TabsContent>

          <TabsContent value="models" className="mt-5">
            <ModelsTab modelAnalytics={modelAnalytics} />
          </TabsContent>

          <TabsContent value="cost" className="mt-5">
            <CostTab timeSeries={timeSeries} modelAnalytics={modelAnalytics} costByProject={costByProject} />
          </TabsContent>

          <TabsContent value="performance" className="mt-5">
            <PerformanceTab timeSeries={timeSeries} />
          </TabsContent>

          <TabsContent value="errors" className="mt-5">
            <ErrorsTab timeSeries={timeSeries} errorLog={errorLog} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
