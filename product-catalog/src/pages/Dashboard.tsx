import { motion } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ProductIcon } from '@/components/ProductIcon'
import {
  TOTAL_MRR, TOTAL_USERS, TOTAL_MAU, PRODUCTS,
  PRODUCTS_BY_PHASE, PORTFOLIO_REVENUE_HISTORY, ALL_RECENT_UPDATES,
} from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatDate } from '@/lib/formatters'
import { CHART_MD, STAT_GRID, stagger, PHASE_CONFIG } from '@/lib/constants'

const GA_COUNT = PRODUCTS.filter(p => p.phase === 'ga').length
const ACTIVE_COUNT = PRODUCTS.filter(p => p.status === 'active').length

const TOP_BY_MRR = [...PRODUCTS]
  .filter(p => p.revenue.mrr > 0)
  .sort((a, b) => b.revenue.mrr - a.revenue.mrr)
  .slice(0, 6)

const PHASE_CHART_DATA = Object.entries(PRODUCTS_BY_PHASE)
  .filter(([, count]) => count > 0)
  .map(([phase, count]) => ({
    phase: PHASE_CONFIG[phase as keyof typeof PHASE_CONFIG].label,
    count,
  }))

const RECENT_5 = ALL_RECENT_UPDATES.slice(0, 5)

const UPDATE_TYPE_STYLES: Record<string, string> = {
  feature: 'bg-primary/10 text-primary',
  bugfix: 'bg-destructive/10 text-destructive',
  launch: 'bg-emerald-500/10 text-emerald-400',
  milestone: 'bg-amber-500/10 text-amber-400',
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div {...stagger(0)}>
        <PageHeader
          title="Dashboard"
          subtitle="Portfolio metrics and activity"
        />
      </motion.div>

      {/* KPI row */}
      <motion.div {...stagger(1)} className={STAT_GRID}>
        <StatCard
          label="Total Products"
          value={String(PRODUCTS.length)}
          trend={{ value: `${ACTIVE_COUNT} active`, up: true, text: 'across all streams' }}
          description="Foundation · AI Foundation · Agents"
        />
        <StatCard
          label="Portfolio MRR"
          value={formatCurrency(TOTAL_MRR, true)}
          trend={{ value: '+12.4%', up: true, text: 'vs last month' }}
          description="Across all revenue-generating products"
        />
        <StatCard
          label="Total MAU"
          value={formatNumber(TOTAL_MAU)}
          trend={{ value: '+18.2%', up: true, text: 'active users' }}
          description={`${formatNumber(TOTAL_USERS)} total registered`}
        />
        <StatCard
          label="Products in GA"
          value={String(GA_COUNT)}
          trend={{ value: `${PRODUCTS_BY_PHASE.beta} in Beta`, up: true, text: 'moving up' }}
          description="Generally available to customers"
        />
      </motion.div>

      {/* Charts row */}
      <motion.div {...stagger(2)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Portfolio revenue trend */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Revenue Trend</CardTitle>
            <CardDescription className="text-xs">Combined MRR across all products (12 months)</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={CHART_MD}>
              <AreaChart data={PORTFOLIO_REVENUE_HISTORY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  tickFormatter={v => v.slice(5)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={((v: number) => [formatCurrency(v, true), 'MRR']) as never}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: 12,
                    color: 'var(--foreground)',
                  }}
                  labelStyle={{ color: 'var(--muted-foreground)', fontSize: 11 }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--chart-1)"
                  strokeWidth={1.5}
                  fill="url(#tealGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Phase distribution */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Phase Distribution</CardTitle>
            <CardDescription className="text-xs">Number of products at each lifecycle stage</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={CHART_MD}>
              <BarChart data={PHASE_CHART_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="phase"
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  formatter={((v: number) => [v, 'Products']) as never}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: 12,
                    color: 'var(--foreground)',
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom row: top products + recent updates */}
      <motion.div {...stagger(3)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products by MRR */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Products by MRR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {TOP_BY_MRR.map((p, i) => {
              const maxMrr = TOP_BY_MRR[0].revenue.mrr
              const pct = Math.round((p.revenue.mrr / maxMrr) * 100)
              return (
                <Link key={p.id} to={`/products/${p.id}`} className="block group">
                  <div className="flex items-center gap-3">
                    <div className="text-[11px] text-muted-foreground/50 w-4 text-right shrink-0">{i + 1}</div>
                    <ProductIcon icon={p.icon} className="text-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">{p.shortName}</span>
                        <span className="text-xs font-mono text-foreground shrink-0">{formatCurrency(p.revenue.mrr, true)}</span>
                      </div>
                      <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/60 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent updates */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            {RECENT_5.map((u, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider shrink-0 mt-0.5 ${UPDATE_TYPE_STYLES[u.type] ?? 'bg-zinc-500/10 text-zinc-400'}`}>
                  {u.type}
                </span>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${u.productId}`} className="text-xs font-medium text-foreground hover:text-primary transition-colors block truncate">
                    {u.title}
                  </Link>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {u.productShortName} · {formatDate(u.date)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
