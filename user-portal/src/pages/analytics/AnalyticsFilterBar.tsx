import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { SlidersHorizontal, X, RotateCcw, CalendarDays, Box, CircleDot, Clock, FolderOpen } from 'lucide-react'
import { MODELS, PROJECTS } from '@/lib/mock-data'
import { ProviderIcon } from '@/components/ProviderIcon'
import type { AnalyticsFilters, Action } from './useAnalyticsFilters'
import { initialState } from './useAnalyticsFilters'
import { DateRangeSelector } from './components/DateRangeSelector'
import { MultiSelect, type MultiSelectOption } from './components/MultiSelect'
import { GranularitySelector } from './components/GranularitySelector'
import { cn } from '@/lib/utils'

const PERIOD_PRESETS = [
  { label: 'Today', value: 'today' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
]

const MODEL_MAP = Object.fromEntries(MODELS.map(m => [m.id, m]))
const MODEL_OPTIONS: MultiSelectOption[] = MODELS.map(m => ({ value: m.id, label: m.name, subtitle: m.provider }))
const PROVIDER_OPTIONS: MultiSelectOption[] = [...new Set(MODELS.map(m => m.provider))].map(p => ({ value: p, label: p }))
const PROJECT_OPTIONS: MultiSelectOption[] = PROJECTS.map(p => ({ value: p.id, label: p.name }))

function renderModelIcon(modelId: string) {
  const model = MODEL_MAP[modelId]
  return model ? <ProviderIcon provider={model.provider} size={14} /> : null
}

function renderProviderIcon(provider: string) {
  return <ProviderIcon provider={provider} size={14} />
}

const GRANULARITY_LABELS: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' }
const PRESET_LABELS: Record<string, string> = { today: 'Today', '7d': '7d', '30d': '30d', '90d': '90d', month: 'This Month', quarter: 'This Quarter' }

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters
  dispatch: React.Dispatch<Action>
}

export function AnalyticsFilterBar({ filters, dispatch }: AnalyticsFilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Build active filter chips (non-default values only)
  const activeChips: { key: string; label: string; icon?: React.ReactNode; onDismiss: () => void }[] = []

  // Only show dateRange chip for custom ranges or presets not in the inline selector (month, quarter)
  if (filters.dateRange.preset !== initialState.dateRange.preset) {
    const inlinePresets = PERIOD_PRESETS.map(p => p.value)
    if (!filters.dateRange.preset || !inlinePresets.includes(filters.dateRange.preset)) {
      const label = filters.dateRange.preset
        ? PRESET_LABELS[filters.dateRange.preset] ?? filters.dateRange.preset
        : `${filters.dateRange.from} – ${filters.dateRange.to}`
      activeChips.push({ key: 'dateRange', label, icon: <CalendarDays className="h-3 w-3" />, onDismiss: () => dispatch({ type: 'RESET_DATE_RANGE' }) })
    }
  }

  if (filters.models.length > 0) {
    const label = filters.models.length === 1
      ? MODEL_OPTIONS.find(o => o.value === filters.models[0])?.label ?? '1 model'
      : `${filters.models.length} models`
    const icon = filters.models.length === 1 ? renderModelIcon(filters.models[0]) : <Box className="h-3 w-3" />
    activeChips.push({ key: 'models', label, icon, onDismiss: () => dispatch({ type: 'RESET_MODELS' }) })
  }

  if (filters.providers.length > 0) {
    const label = filters.providers.length === 1
      ? PROVIDER_OPTIONS.find(o => o.value === filters.providers[0])?.label ?? '1 provider'
      : `${filters.providers.length} providers`
    const icon = filters.providers.length === 1 ? renderProviderIcon(filters.providers[0]) : <Box className="h-3 w-3" />
    activeChips.push({ key: 'providers', label, icon, onDismiss: () => dispatch({ type: 'RESET_PROVIDERS' }) })
  }

  if (filters.projects.length > 0) {
    const label = filters.projects.length === 1
      ? PROJECT_OPTIONS.find(o => o.value === filters.projects[0])?.label ?? '1 project'
      : `${filters.projects.length} projects`
    activeChips.push({ key: 'projects', label, icon: <FolderOpen className="h-3 w-3" />, onDismiss: () => dispatch({ type: 'RESET_PROJECTS' }) })
  }

  if (filters.status !== 'all') {
    activeChips.push({ key: 'status', label: `${filters.status}`, icon: <CircleDot className="h-3 w-3" />, onDismiss: () => dispatch({ type: 'RESET_STATUS' }) })
  }

  if (filters.granularity !== 'daily') {
    activeChips.push({ key: 'granularity', label: GRANULARITY_LABELS[filters.granularity], icon: <Clock className="h-3 w-3" />, onDismiss: () => dispatch({ type: 'RESET_GRANULARITY' }) })
  }

  return (
    <>
      {/* ── Active filters row ── */}
      <div className="flex items-center gap-3">
        {/* Inline period selector — always visible */}
        <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
          {PERIOD_PRESETS.map(p => (
            <button
              key={p.value}
              onClick={() => dispatch({ type: 'SET_PRESET', preset: p.value })}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                filters.dateRange.preset === p.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <Button
          variant={activeChips.length > 0 ? 'default' : 'outline'}
          size="sm"
          className="h-8 gap-2 px-3 text-xs shrink-0"
          onClick={() => setDrawerOpen(true)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeChips.length > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-foreground px-1 text-[10px] font-bold text-primary">
              {activeChips.length}
            </span>
          )}
        </Button>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {activeChips.map(chip => (
              <Badge
                key={chip.key}
                variant="secondary"
                className="cursor-pointer gap-1 text-xs"
                onClick={chip.onDismiss}
              >
                {chip.icon}
                {chip.label}
                <X className="h-3 w-3 text-muted-foreground" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* ── Filter drawer ── */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="flex flex-col gap-0 p-0"
          style={{ maxWidth: '28rem' }}
          onPointerDownOutside={(e) => {
            // Prevent Sheet from closing when clicking inside portaled Popovers (MultiSelect, DateRangeSelector)
            const target = e.target as HTMLElement
            if (target.closest('[data-radix-popper-content-wrapper]')) {
              e.preventDefault()
            }
          }}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement
            if (target.closest('[data-radix-popper-content-wrapper]')) {
              e.preventDefault()
            }
          }}
        >
          <SheetHeader className="border-b px-5 py-5">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="flex-1 divide-y divide-border overflow-y-auto">
            {/* Period */}
            <div className="px-5 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Period</p>
              <DateRangeSelector
                preset={filters.dateRange.preset}
                from={filters.dateRange.from}
                to={filters.dateRange.to}
                onPreset={preset => dispatch({ type: 'SET_PRESET', preset })}
                onCustom={(from, to) => dispatch({ type: 'SET_CUSTOM_RANGE', from, to })}
              />
            </div>

            {/* Scope */}
            <div className="px-5 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scope</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">Models</label>
                  <MultiSelect
                    options={MODEL_OPTIONS}
                    selected={filters.models}
                    onToggle={modelId => dispatch({ type: 'TOGGLE_MODEL', modelId })}
                    placeholder="Search models..."
                    label="Models"
                    renderIcon={renderModelIcon}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">Providers</label>
                  <MultiSelect
                    options={PROVIDER_OPTIONS}
                    selected={filters.providers}
                    onToggle={provider => dispatch({ type: 'TOGGLE_PROVIDER', provider })}
                    placeholder="Search providers..."
                    label="Providers"
                    renderIcon={renderProviderIcon}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">Projects</label>
                  <MultiSelect
                    options={PROJECT_OPTIONS}
                    selected={filters.projects}
                    onToggle={projectId => dispatch({ type: 'TOGGLE_PROJECT', projectId })}
                    placeholder="Search projects..."
                    label="Projects"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="px-5 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
              <div className="flex w-fit items-center rounded-lg border bg-muted/50 p-0.5">
                {(['all', 'success', 'error'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => dispatch({ type: 'SET_STATUS', status: s })}
                    className={cn(
                      'px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize',
                      filters.status === s
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Granularity */}
            <div className="px-5 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resolution</p>
              <GranularitySelector
                value={filters.granularity}
                onChange={granularity => dispatch({ type: 'SET_GRANULARITY', granularity })}
              />
            </div>
          </div>

          <SheetFooter className="border-t px-5 py-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => { dispatch({ type: 'RESET' }); setDrawerOpen(false) }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset all filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
