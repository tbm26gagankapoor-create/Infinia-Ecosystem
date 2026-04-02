import { useState } from 'react'
import { motion } from 'motion/react'
import { ShieldAlert, CheckCircle2, Clock, Plus, Bell, BellOff, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { INCIDENTS, ALERT_RULES, type Incident } from '@/lib/mock-data'
import { FilterPill } from '@/components/FilterPill'
import { StatusBadge } from '@/components/StatusBadge'

const RULE_TYPE_CONFIG: Record<string, string> = {
  error_rate: 'bg-red-500/10 text-red-500 border-red-500/20',
  latency:    'bg-orange-500/10 text-orange-500 border-orange-500/20',
  budget:     'bg-amber-500/10 text-amber-500 border-amber-500/20',
  provider:   'bg-purple-500/10 text-purple-500 border-purple-500/20',
  security:   'bg-blue-500/10 text-blue-500 border-blue-500/20',
}

function fmtTime(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function IncidentCard({ incident }: { incident: Incident }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card className={`border-l-4 ${incident.status === 'active' ? 'border-l-red-500' : incident.status === 'monitoring' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={incident.severity} />
              <StatusBadge status={incident.status} />
              <span className="text-xs text-muted-foreground">{fmtTime(incident.startedAt)}</span>
              {incident.resolvedAt && <span className="text-xs text-muted-foreground">→ resolved {fmtTime(incident.resolvedAt)}</span>}
            </div>
            <div className="font-semibold text-sm mb-1">{incident.title}</div>
            <div className="text-xs text-muted-foreground">{incident.description}</div>
            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
              <span>Model: <span className="text-foreground">{incident.affectedModel}</span></span>
              <span>Provider: <span className="text-foreground">{incident.affectedProvider}</span></span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {incident.status !== 'resolved' && (
              <Button variant="outline" size="sm" className="h-7 text-xs">Resolve</Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(e => !e)}>
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 border-t pt-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Incident Updates</div>
            <div className="space-y-2.5">
              {incident.updates.map((u, i) => (
                <div key={u.time} className="flex gap-2.5 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`h-2 w-2 rounded-full mt-0.5 shrink-0 ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                    {i < incident.updates.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <span className="text-muted-foreground font-mono">{fmtTime(u.time)}</span>
                    <p className="text-foreground mt-0.5">{u.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Alerts() {
  const [tab, setTab] = useState<'incidents' | 'rules'>('incidents')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [rules, setRules] = useState(ALERT_RULES)

  const active = INCIDENTS.filter(i => i.status === 'active')
  const monitoring = INCIDENTS.filter(i => i.status === 'monitoring')
  const resolved = INCIDENTS.filter(i => i.status === 'resolved')

  const filtered = INCIDENTS.filter(i => statusFilter === 'all' || i.status === statusFilter)

  function toggleRule(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Alerts & Incidents" subtitle="Monitor platform health, active incidents, and alert rules">
        <Button size="sm" variant="outline" className="gap-1.5"><BellOff className="h-3.5 w-3.5" />Mute All</Button>
        <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />New Alert Rule</Button>
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={active.length > 0 ? 'border-red-500/30' : ''}>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
              <ShieldAlert className="h-3 w-3 text-red-500" />Active Incidents
            </div>
            <div className={`text-2xl font-bold ${active.length > 0 ? 'text-red-500' : ''}`}>{active.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Require attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
              <Clock className="h-3 w-3 text-amber-500" />Monitoring
            </div>
            <div className="text-2xl font-bold text-amber-500">{monitoring.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Watching closely</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />Resolved (30d)
            </div>
            <div className="text-2xl font-bold text-emerald-600">{resolved.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Avg resolve: 2.4h</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
              <Bell className="h-3 w-3" />Alert Rules
            </div>
            <div className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</div>
            <div className="text-xs text-muted-foreground mt-1">{rules.length} total, {rules.filter(r => !r.enabled).length} paused</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(['incidents', 'rules'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'incidents' ? 'Incidents' : 'Alert Rules'}
            {t === 'incidents' && active.length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5">{active.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'incidents' && (
        <>
          <div className="flex gap-1.5">
            {[['all', 'All'], ['active', 'Active'], ['monitoring', 'Monitoring'], ['resolved', 'Resolved']].map(([v, l]) => (
              <FilterPill key={v} label={`${l}${v === 'active' && active.length > 0 ? ` (${active.length})` : ''}`} active={statusFilter === v} onClick={() => setStatusFilter(v)} />
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(i => <IncidentCard key={i.id} incident={i} />)}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">No incidents found</div>
            )}
          </div>
        </>
      )}

      {tab === 'rules' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead>Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] capitalize ${RULE_TYPE_CONFIG[r.type]}`}>{r.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.threshold}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.target}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.channel}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.lastTriggered ? fmtTime(r.lastTriggered) : '—'}
                    </TableCell>
                    <TableCell>
                      <Switch checked={r.enabled} onCheckedChange={() => toggleRule(r.id)} />
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
