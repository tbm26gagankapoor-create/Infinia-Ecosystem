import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, XCircle, RefreshCw, Plus, ChevronRight, ArrowRightLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { PROVIDERS_LIST, MODEL_ROUTES, type ProviderEntry } from '@/lib/mock-data'

const STRATEGY_LABELS: Record<string, { label: string; color: string }> = {
  latency:     { label: 'Lowest Latency', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  cost:        { label: 'Lowest Cost',    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  reliability: { label: 'Reliability',   color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
}

export default function Providers() {
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState<ProviderEntry | null>(null)
  const [tab, setTab] = useState<'providers' | 'routing'>('providers')

  const filtered = PROVIDERS_LIST.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.region.toLowerCase().includes(search.toLowerCase())
  )

  const connected = PROVIDERS_LIST.filter(p => p.status === 'connected').length
  const totalRequests = PROVIDERS_LIST.reduce((s, p) => s + p.requestsToday, 0)
  const totalCost = PROVIDERS_LIST.reduce((s, p) => s + p.costToday, 0)

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Providers" subtitle="Manage upstream LLM provider connections, routing, and failover">
        <Button size="sm" variant="outline" className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" />Test All</Button>
        <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Add Provider</Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <div className="text-xs text-muted-foreground font-medium mb-1">Total Providers</div>
          <div className="text-2xl font-bold">{PROVIDERS_LIST.length}</div>
          <div className="text-xs text-muted-foreground mt-1">{connected} connected</div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="text-xs text-muted-foreground font-medium mb-1">Status</div>
          <div className="text-2xl font-bold text-emerald-600">{connected}</div>
          <div className="text-xs text-muted-foreground mt-1">{PROVIDERS_LIST.length - connected} degraded / disconnected</div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="text-xs text-muted-foreground font-medium mb-1">Requests Today</div>
          <div className="text-2xl font-bold">{(totalRequests / 1000).toFixed(1)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Across all providers</div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="text-xs text-muted-foreground font-medium mb-1">Provider Cost Today</div>
          <div className="text-2xl font-bold">${totalCost.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground mt-1">Gross cost to Infinia</div>
        </CardContent></Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(['providers', 'routing'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'routing' ? 'Model Routing' : 'Providers'}
          </button>
        ))}
      </div>

      {tab === 'providers' && (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search providers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>

          <div className="flex gap-6">
            {/* Provider cards grid */}
            <div className={`grid gap-4 flex-1 ${drawer ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
              {filtered.map(p => (
                <Card key={p.id} className={`cursor-pointer transition-all hover:border-primary/50 ${drawer?.id === p.id ? 'border-primary' : ''}`} onClick={() => setDrawer(drawer?.id === p.id ? null : p)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 bg-primary/20 text-primary">
                          {p.shortName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.region}</div>
                        </div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 rounded-md bg-muted/40">
                        <div className="text-xs text-muted-foreground">Latency</div>
                        <div className="text-sm font-semibold font-mono">{p.avgLatency}ms</div>
                      </div>
                      <div className="text-center p-2 rounded-md bg-muted/40">
                        <div className="text-xs text-muted-foreground">Error %</div>
                        <div className={`text-sm font-semibold font-mono ${p.errorRate > 3 ? 'text-red-500' : p.errorRate > 1 ? 'text-amber-500' : 'text-emerald-600'}`}>{p.errorRate}%</div>
                      </div>
                      <div className="text-center p-2 rounded-md bg-muted/40">
                        <div className="text-xs text-muted-foreground">Uptime</div>
                        <div className="text-sm font-semibold font-mono">{p.uptime}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-mono">{p.apiKeyMasked}</span>
                      <span className="text-muted-foreground">{p.modelsRouted.length} models</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detail drawer */}
            {drawer && (
              <Card className="w-[360px] shrink-0 self-start sticky top-20">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center font-bold bg-primary/20 text-primary">
                        {drawer.shortName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-base">{drawer.name}</CardTitle>
                        <div className="text-xs text-muted-foreground">{drawer.region}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDrawer(null)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Health</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status={drawer.status} />
                      </div>
                      {([['Uptime (30d)', `${drawer.uptime}%`], ['Avg Latency', `${drawer.avgLatency}ms`], ['Error Rate', `${drawer.errorRate}%`], ['Requests Today', drawer.requestsToday.toLocaleString()]] as const).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{k}</span>
                          <span className="font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">API Credentials</div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono text-muted-foreground">{drawer.apiKeyMasked}</span>
                      <Button variant="outline" size="sm" className="h-6 text-xs">Rotate Key</Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Routed Models ({drawer.modelsRouted.length})</div>
                    <div className="space-y-1">
                      {drawer.modelsRouted.map(m => (
                        <div key={m} className="flex items-center gap-1.5 text-sm">
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cost Today</div>
                    <div className="text-xl font-bold">${drawer.costToday.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Gross inference cost to Infinia</div>
                  </div>

                  <div className="flex gap-2 pt-1 border-t">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">Edit Config</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs text-red-500 hover:text-red-600">Disconnect</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {tab === 'routing' && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Model Routing Rules</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Which provider handles each model, fallback strategy, and routing preference</p>
              </div>
              <Button size="sm" className="gap-1.5"><ArrowRightLeft className="h-3.5 w-3.5" />Edit Routes</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Primary Provider</TableHead>
                  <TableHead>Fallback Provider</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Failover</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODEL_ROUTES.map(r => (
                  <TableRow key={r.modelId}>
                    <TableCell className="font-medium text-sm">{r.modelName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-sm">{r.primaryProvider}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {r.fallbackProvider
                        ? <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-sm">{r.fallbackProvider}</span>
                          </div>
                        : <span className="text-xs text-muted-foreground">None configured</span>
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${STRATEGY_LABELS[r.strategy].color}`}>
                        {STRATEGY_LABELS[r.strategy].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={!!r.fallbackProvider} disabled />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
