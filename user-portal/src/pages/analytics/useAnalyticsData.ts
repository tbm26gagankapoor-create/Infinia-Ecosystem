import { useMemo } from 'react'
import type { AnalyticsFilters } from './useAnalyticsFilters'
import {
  generateTimeSeries,
  generateModelAnalytics,
  generateErrorLog,
  generateCostByProject,
  computeKPIs,
} from '@/lib/analytics-mock'

export function useAnalyticsData(filters: AnalyticsFilters) {
  const timeSeries = useMemo(
    () => generateTimeSeries(filters.dateRange.from, filters.dateRange.to, filters.granularity),
    [filters.dateRange.from, filters.dateRange.to, filters.granularity]
  )

  const modelAnalytics = useMemo(
    () => generateModelAnalytics(filters.models.length ? filters.models : undefined),
    [filters.models]
  )

  const errorLog = useMemo(() => generateErrorLog(50), [])

  const costByProject = useMemo(() => generateCostByProject(), [])

  const kpis = useMemo(() => computeKPIs(timeSeries), [timeSeries])

  return { timeSeries, modelAnalytics, errorLog, costByProject, kpis }
}
