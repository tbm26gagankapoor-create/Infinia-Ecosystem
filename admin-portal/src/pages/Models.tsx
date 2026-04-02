import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, Cpu, Activity, AlertTriangle, XCircle, Settings2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { FilterPill } from '@/components/FilterPill'
import { EmptyState } from '@/components/EmptyState'
import { MODEL_CATALOG, type ModelCatalogEntry } from '@/lib/mock-data'

const PROVIDERS = ['All', 'Meta', 'DeepSeek', 'Alibaba', 'Mistral AI', 'Google', 'Microsoft', 'MBZUAI', 'TII']
const PROVIDER_COLORS: Record<string, string> = {
  'Meta': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'DeepSeek': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'Alibaba': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'Mistral AI': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Google': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Microsoft': 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  'MBZUAI': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  'TII': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
}

function fmtContext(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return String(n)
}

type DrawerModel = ModelCatalogEntry | null

export default function Models() {
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [models, setModels] = useState(MODEL_CATALOG)
  const [drawer, setDrawer] = useState<DrawerModel>(null)

  const filtered = models.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.provider.toLowerCase().includes(search.toLowerCase()) && !m.tags.some(t => t.includes(search.toLowerCase()))) return false
    if (provider !== 'All' && m.provider !== provider) return false
    if (statusFilter !== 'All' && m.status !== statusFilter) return false
    return true
  })

  const healthy = models.filter(m => m.status === 'healthy').length
  const degraded = models.filter(m => m.status === 'degraded').length
  const down = models.filter(m => m.status === 'down').length
  const totalRequests = models.reduce((s, m) => s + m.requestsToday, 0)

  function toggleEnabled(id: string) {
    setModels(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m))
    if (drawer?.id === id) setDrawer(prev => prev ? { ...prev, enabled: !prev.enabled } : null)
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Models" subtitle="Manage the AI model catalog — pricing, health, and availability">
        <Button size="sm" variant="outline" className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" />Sync Status</Button>
        <Button size="sm" className="gap-1.5"><Cpu className="h-3.5 w-3.5" />Add Model</Button>
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs text-muted-foreground font-medium mb-1">Total Models</div>
            <div className="text-2xl font-bold">{models.length}</div>
            <div className="text-xs text-muted-foreground mt-1">{models.filter(m => m.enabled).length} enabled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1"><Activity className="h-3 w-3 text-emerald-500" />Healthy</div>
            <div className="text-2xl font-bold text-emerald-600">{healthy}</div>
            <div className="text-xs text-muted-foreground mt-1">{((healthy / models.length) * 100).toFixed(0)}% of catalog</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1"><AlertTriangle className="h-3 w-3 text-amber-500" />Degraded / Down</div>
            <div className="text-2xl font-bold text-amber-500">{degraded + down}</div>
            <div className="text-xs text-muted-foreground mt-1">{degraded} degraded, {down} down</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs text-muted-foreground font-medium mb-1">Requests Today</div>
            <div className="text-2xl font-bold">{(totalRequests / 1000).toFixed(1)}K</div>
            <div className="text-xs text-muted-foreground mt-1">Across all models</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search models, providers, tags..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-[13px] bg-muted/30 border-border/40" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'healthy', 'degraded', 'down'].map(s => (
            <FilterPill key={s} label={s === 'All' ? 'All Status' : s} active={statusFilter === s} onClick={() => setStatusFilter(s)} className="capitalize" />
          ))}
        </div>
      </div>

      {/* Provider filter row */}
      <div className="flex gap-1.5 flex-wrap -mt-2">
        {PROVIDERS.map(p => (
          <FilterPill key={p} label={p} active={provider === p} onClick={() => setProvider(p)} />
        ))}
      </div>

      {/* Table */}
      <div className="flex gap-6">
        <Card className={`flex-1 transition-all ${drawer ? 'lg:max-w-[calc(100%-380px)]' : ''}`}>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Context</TableHead>
                  <TableHead className="text-right">Input / 1K</TableHead>
                  <TableHead className="text-right">Output / 1K</TableHead>
                  <TableHead className="text-right">Latency</TableHead>
                  <TableHead className="text-right">Error %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(m => (
                  <TableRow key={m.id} className={`hover:bg-muted/40 transition-colors cursor-pointer ${drawer?.id === m.id ? 'bg-accent' : ''}`} onClick={() => setDrawer(drawer?.id === m.id ? null : m)}>
                    <TableCell>
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {m.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${PROVIDER_COLORS[m.provider] || ''}`}>{m.provider}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{fmtContext(m.contextWindow)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">${m.inputCostPer1k.toFixed(4)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">${m.outputCostPer1k.toFixed(4)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{m.avgLatency}ms</TableCell>
                    <TableCell className={`text-right font-mono text-xs ${m.errorRate > 2 ? 'text-red-500' : m.errorRate > 1 ? 'text-amber-500' : 'text-emerald-600'}`}>{m.errorRate}%</TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Switch checked={m.enabled} onCheckedChange={() => toggleEnabled(m.id)} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation(); setDrawer(drawer?.id === m.id ? null : m) }}>
                        <Settings2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <EmptyState title="No models match your filters" description="Try adjusting your search or filter criteria" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail panel */}
        {drawer && (
          <Card className="w-[360px] shrink-0 self-start sticky top-20">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{drawer.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-[10px] ${PROVIDER_COLORS[drawer.provider] || ''}`}>{drawer.provider}</Badge>
                    <StatusBadge status={drawer.status} />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => setDrawer(null)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {/* Health metrics */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Health</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uptime (30d)</span>
                    <span className="font-mono font-medium">{drawer.uptime}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Latency</span>
                    <span className="font-mono font-medium">{drawer.avgLatency}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Error Rate</span>
                    <span className={`font-mono font-medium ${drawer.errorRate > 2 ? 'text-red-500' : drawer.errorRate > 1 ? 'text-amber-500' : 'text-emerald-600'}`}>{drawer.errorRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Requests Today</span>
                    <span className="font-mono font-medium">{drawer.requestsToday.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specifications</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Context Window</span>
                    <span className="font-mono font-medium">{fmtContext(drawer.contextWindow)} tokens</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Family</span>
                    <span className="font-medium">{drawer.family}</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pricing</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Input tokens</span>
                    <span className="font-mono font-medium">${drawer.inputCostPer1k.toFixed(4)} / 1K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Output tokens</span>
                    <span className="font-mono font-medium">${drawer.outputCostPer1k.toFixed(4)} / 1K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Input (per 1M)</span>
                    <span className="font-mono text-muted-foreground">${(drawer.inputCostPer1k * 1000).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Output (per 1M)</span>
                    <span className="font-mono text-muted-foreground">${(drawer.outputCostPer1k * 1000).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {drawer.tags.map(t => (
                    <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-md">{t}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t">
                <span className="text-sm font-medium">Model Enabled</span>
                <Switch checked={drawer.enabled} onCheckedChange={() => toggleEnabled(drawer.id)} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">Edit Pricing</Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
