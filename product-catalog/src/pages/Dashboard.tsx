import { motion } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProductIcon } from '@/components/ProductIcon'
import {
  TOTAL_MRR, TOTAL_ARR, TOTAL_USERS, TOTAL_MAU, PRODUCTS,
  PRODUCTS_BY_PHASE, PORTFOLIO_REVENUE_HISTORY, ALL_RECENT_UPDATES, ALL_MONTHS,
} from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatDate } from '@/lib/formatters'
import { CHART_MD, CHART_LG, STAT_GRID, stagger, PHASE_CONFIG, LAYER_DEFS } from '@/lib/constants'

// — Overview data —
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

// — Analytics data —
const TOP_REVENUE_PRODUCTS = [...PRODUCTS]
  .filter(p => p.revenue.mrr > 0)
  .sort((a, b) => b.revenue.mrr - a.revenue.mrr)
  .slice(0, 4)

const REVENUE_COMPARE_DATA = ALL_MONTHS.map(month => {
  const row: Record<string, string | number> = { month }
  TOP_REVENUE_PRODUCTS.forEach(p => {
    const entry = p.revenue.history.find(h => h.month === month)
    row[p.shortName] = entry?.amount ?? 0
  })
  return row
})

const TOP_MAU_PRODUCTS = [...PRODUCTS]
  .filter(p => p.usage.mau > 0)
  .sort((a, b) => b.usage.mau - a.usage.mau)
  .slice(0, 4)

const MAU_COMPARE_DATA = ALL_MONTHS.map(month => {
  const row: Record<string, string | number> = { month }
  TOP_MAU_PRODUCTS.forEach(p => {
    const entry = p.usage.history.find(h => h.month === month)
    row[p.shortName] = entry?.users ?? 0
  })
  return row
})

const FUNNEL_DATA = (['rd', 'alpha', 'beta', 'ga', 'sunset'] as const).map(phase => ({
  phase: PHASE_CONFIG[phase].label,
  count: PRODUCTS_BY_PHASE[phase],
})).filter(d => d.count > 0)

const LAYER_MRR = LAYER_DEFS.map(l => {
  const products = PRODUCTS.filter(p => p.layer === l.id)
  return {
    stream: `${l.number} ${l.label}`,
    mrr: products.reduce((sum, p) => sum + p.revenue.mrr, 0),
    mau: products.reduce((sum, p) => sum + p.usage.mau, 0),
    products: products.length,
  }
})

const GROWTH_LEADERS = [...PRODUCTS]
  .filter(p => p.usage.growthRate > 0)
  .sort((a, b) => b.usage.growthRate - a.usage.growthRate)
  .slice(0, 6)

const TOOLTIP_STYLE = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontSize: 12,
  color: 'var(--foreground)',
}
const LABEL_STYLE = { color: 'var(--muted-foreground)', fontSize: 11 }
const AXIS_PROPS = {
  tick: { fontSize: 10, fill: 'var(--muted-foreground)' },
  axisLine: false as const,
  tickLine: false as const,
}
const LINE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)']

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div {...stagger(0)}>
        <PageHeader
          title="Dashboard"
          subtitle="Portfolio metrics and activity"
        />
      </motion.div>

      <motion.div {...stagger(1)}>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* ── Overview tab ── */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            {/* KPI row */}
            <div className={STAT_GRID}>
              <StatCard
                label="Total Products"
                value={String(PRODUCTS.length)}
                trend={{ value: `${ACTIVE_COUNT} active`, up: true, text: 'across all layers' }}
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
                label="Products in Production"
                value={String(GA_COUNT)}
                trend={{ value: `${PRODUCTS_BY_PHASE.beta} in Beta`, up: true, text: 'moving up' }}
                description="Production ready for customers"
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        contentStyle={TOOLTIP_STYLE}
                        labelStyle={LABEL_STYLE}
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
                        contentStyle={TOOLTIP_STYLE}
                      />
                      <Bar dataKey="count" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                              <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </CardContent>
              </Card>

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
            </div>
          </TabsContent>

          {/* ── Analytics tab ── */}
          <TabsContent value="analytics" className="space-y-6 mt-0">
            {/* KPI row */}
            <div className={STAT_GRID}>
              <StatCard
                label="Portfolio MRR"
                value={formatCurrency(TOTAL_MRR, true)}
                trend={{ value: '+12.4%', up: true, text: 'vs last month' }}
                description="All revenue-generating products"
              />
              <StatCard
                label="ARR Run Rate"
                value={formatCurrency(TOTAL_ARR, true)}
                description="Annualised at current MRR"
              />
              <StatCard
                label="Total MAU"
                value={formatNumber(TOTAL_MAU)}
                trend={{ value: '+18.2%', up: true, text: 'MoM' }}
                description="Monthly active users across all products"
              />
              <StatCard
                label="Total Users"
                value={formatNumber(TOTAL_USERS)}
                description="All registered users, all products"
              />
            </div>

            {/* Portfolio revenue trend (full-width) */}
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Revenue Trend</CardTitle>
                <CardDescription className="text-xs">Combined MRR across all products — last 12 months</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <ResponsiveContainer width="100%" height={CHART_LG}>
                  <AreaChart data={PORTFOLIO_REVENUE_HISTORY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" {...AXIS_PROPS} tickFormatter={v => v.slice(5)} />
                    <YAxis hide />
                    <Tooltip
                      formatter={((v: number) => [formatCurrency(v, true), 'MRR']) as never}
                      contentStyle={TOOLTIP_STYLE}
                      labelStyle={LABEL_STYLE}
                    />
                    <Area type="monotone" dataKey="amount" stroke="var(--chart-1)" strokeWidth={1.5} fill="url(#portfolioGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue & MAU comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue by Product</CardTitle>
                  <CardDescription className="text-xs">Top 4 products — MRR over 12 months</CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-4">
                  <ResponsiveContainer width="100%" height={CHART_MD}>
                    <LineChart data={REVENUE_COMPARE_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" {...AXIS_PROPS} tickFormatter={v => v.slice(5)} />
                      <YAxis hide />
                      <Tooltip
                        formatter={((v: number, name: string) => [formatCurrency(v, true), name]) as never}
                        contentStyle={TOOLTIP_STYLE}
                        labelStyle={LABEL_STYLE}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 10, color: 'var(--muted-foreground)', paddingTop: 8 }}
                        iconType="plainline"
                        iconSize={14}
                      />
                      {TOP_REVENUE_PRODUCTS.map((p, i) => (
                        <Line key={p.id} type="monotone" dataKey={p.shortName} stroke={LINE_COLORS[i]} strokeWidth={1.5} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">MAU by Product</CardTitle>
                  <CardDescription className="text-xs">Top 4 products — monthly active users</CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-4">
                  <ResponsiveContainer width="100%" height={CHART_MD}>
                    <LineChart data={MAU_COMPARE_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" {...AXIS_PROPS} tickFormatter={v => v.slice(5)} />
                      <YAxis hide />
                      <Tooltip
                        formatter={((v: number, name: string) => [formatNumber(v), name]) as never}
                        contentStyle={TOOLTIP_STYLE}
                        labelStyle={LABEL_STYLE}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 10, color: 'var(--muted-foreground)', paddingTop: 8 }}
                        iconType="plainline"
                        iconSize={14}
                      />
                      {TOP_MAU_PRODUCTS.map((p, i) => (
                        <Line key={p.id} type="monotone" dataKey={p.shortName} stroke={LINE_COLORS[i]} strokeWidth={1.5} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Lifecycle funnel + stream breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Lifecycle Funnel</CardTitle>
                  <CardDescription className="text-xs">Products at each phase — R&D → Production Ready</CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-4">
                  <ResponsiveContainer width="100%" height={CHART_MD}>
                    <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" {...AXIS_PROPS} allowDecimals={false} />
                      <YAxis type="category" dataKey="phase" {...AXIS_PROPS} width={48} />
                      <Tooltip
                        formatter={((v: number) => [v, 'Products']) as never}
                        contentStyle={TOOLTIP_STYLE}
                        labelStyle={LABEL_STYLE}
                      />
                      <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Stream Breakdown</CardTitle>
                  <CardDescription className="text-xs">MRR, MAU, and product count by layer</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 pb-4 space-y-3">
                  {LAYER_MRR.map((s, i) => {
                    const maxMrr = Math.max(...LAYER_MRR.map(x => x.mrr))
                    const pct = maxMrr > 0 ? Math.round((s.mrr / maxMrr) * 100) : 0
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-foreground">{s.stream}</div>
                          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                            <span>{s.products} products</span>
                            <span>{formatNumber(s.mau)} MAU</span>
                            <span className="text-foreground">{formatCurrency(s.mrr, true)}</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                          <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Growth leaders */}
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">User Growth Leaders</CardTitle>
                <CardDescription className="text-xs">Products ranked by MAU growth rate</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 space-y-2">
                {GROWTH_LEADERS.map((p, i) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="flex items-center gap-3 group">
                    <div className="text-[11px] text-muted-foreground/50 w-4 text-right shrink-0">{i + 1}</div>
                    <ProductIcon icon={p.icon} className="text-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {p.shortName}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 shrink-0">+{p.usage.growthRate}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/50 transition-all"
                          style={{ width: `${Math.min(p.usage.growthRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
