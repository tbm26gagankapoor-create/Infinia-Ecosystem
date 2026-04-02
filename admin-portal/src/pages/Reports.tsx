import { useState } from 'react'
import { motion } from 'motion/react'
import { Download, Calendar, Mail, TrendingUp, TrendingDown, Plus, FileText, FileSpreadsheet } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { MRR_TREND, REVENUE_BY_PLAN, TOP_SPENDING_ORGS_REPORT, SCHEDULED_REPORTS, REVENUE_SUMMARY } from '@/lib/mock-data'

const PLAN_COLORS: Record<string, string> = {
  Enterprise: '#6366f1',
  Team:       '#f59e0b',
  Pro:        '#14b8a6',
  Developer:  '#8b5cf6',
  Free:       '#6b7280',
}

function fmtK(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
  return `$${n}`
}

function StatCard({ label, value, sub, trend }: { label: string; value: string; sub: string; trend?: number }) {
  const up = trend !== undefined && trend > 0
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="text-xs text-muted-foreground font-medium mb-1">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-mono font-medium">{fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Reports() {
  const [tab, setTab] = useState<'overview' | 'orgs' | 'scheduled'>('overview')
  const [scheduledReports, setScheduledReports] = useState(SCHEDULED_REPORTS)
  const currentMRR = MRR_TREND[MRR_TREND.length - 1].mrr
  const prevMRR = MRR_TREND[MRR_TREND.length - 2].mrr
  const mrrGrowth = (((currentMRR - prevMRR) / prevMRR) * 100).toFixed(1)
  const arr = currentMRR * 12

  function toggleScheduled(id: string) {
    setScheduledReports(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Reports" subtitle="Revenue analytics, growth metrics, and scheduled report delivery">
        <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" />Export CSV</Button>
        <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />New Report</Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR" value={fmtK(currentMRR)} sub="vs last month" trend={parseFloat(mrrGrowth)} />
        <StatCard label="ARR (run-rate)" value={fmtK(arr)} sub="annualised" trend={parseFloat(mrrGrowth)} />
        <StatCard label="Paying Orgs" value={String(REVENUE_SUMMARY.paidOrgs)} sub={`of ${REVENUE_SUMMARY.totalOrgs} total`} trend={14.3} />
        <StatCard label="Credits Outstanding" value={fmtK(REVENUE_SUMMARY.totalCreditsOutstanding)} sub="prepaid balance held" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {([['overview', 'Revenue Overview'], ['orgs', 'By Organization'], ['scheduled', 'Scheduled Reports']] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid gap-6">
          {/* MRR Trend */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">MRR Trend</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Monthly recurring revenue — last 8 months</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7"><Download className="h-3 w-3" />CSV</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MRR_TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={52} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="mrr" name="MRR" stroke="#6366f1" strokeWidth={2} fill="url(#mrrGrad)" />
                  <Area type="monotone" dataKey="newMrr" name="New MRR" stroke="#14b8a6" strokeWidth={1.5} fill="url(#newGrad)" strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Plan */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue by Plan</CardTitle>
                <p className="text-xs text-muted-foreground">MTD breakdown</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={REVENUE_BY_PLAN} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 60 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="plan" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                      {REVENUE_BY_PLAN.map(entry => (
                        <Cell key={entry.plan} fill={PLAN_COLORS[entry.plan] || '#6b7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Plan Distribution</CardTitle>
                <p className="text-xs text-muted-foreground">Revenue share this month</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {REVENUE_BY_PLAN.map(p => (
                    <div key={p.plan}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: PLAN_COLORS[p.plan] }} />
                          <span className="text-sm font-medium">{p.plan}</span>
                          <span className="text-xs text-muted-foreground">{p.orgs} org{p.orgs !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold">{fmtK(p.revenue)}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">{p.pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: PLAN_COLORS[p.plan] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === 'orgs' && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Top Spending Organizations</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Revenue by org — MTD vs last month</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3 w-3" />Export</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">MTD Revenue</TableHead>
                  <TableHead className="text-right">Last Month</TableHead>
                  <TableHead className="text-right">YoY Growth</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_SPENDING_ORGS_REPORT.map((o, i) => (
                  <TableRow key={o.org}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                        <span className="font-medium text-sm">{o.org}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]" style={{ borderColor: PLAN_COLORS[o.plan] + '50', color: PLAN_COLORS[o.plan] }}>
                        {o.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold font-mono">{fmtK(o.mtd)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{fmtK(o.lastMonth)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`text-xs font-semibold ${o.yoy > 20 ? 'text-emerald-600' : o.yoy > 10 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        +{o.yoy}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="h-3 w-1.5 rounded-sm" style={{ background: j < Math.ceil(o.yoy / 8) ? PLAN_COLORS[o.plan] : 'hsl(var(--muted))' }} />
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === 'scheduled' && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            {scheduledReports.map(r => (
              <Card key={r.id} className={!r.enabled ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        {r.format.includes('CSV') ? <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{r.name}</div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge variant="outline" className="text-[10px]">{r.frequency}</Badge>
                          <span className="text-xs text-muted-foreground">{r.format}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Next: {r.nextRun}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{r.recipients}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Switch checked={r.enabled} onCheckedChange={() => toggleScheduled(r.id)} />
                      <Button variant="outline" size="sm" className="h-6 text-xs gap-1"><Download className="h-3 w-3" />Run Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed cursor-pointer hover:bg-accent/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-center gap-2 h-full min-h-[120px] text-muted-foreground">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Schedule New Report</span>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  )
}
