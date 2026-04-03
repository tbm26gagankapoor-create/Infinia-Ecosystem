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
import { ProductIcon } from '@/components/ProductIcon'
import {
  PRODUCTS, TOTAL_MRR, TOTAL_ARR, TOTAL_USERS, TOTAL_MAU,
  PORTFOLIO_REVENUE_HISTORY, ALL_MONTHS, PRODUCTS_BY_PHASE,
} from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { CHART_MD, CHART_LG, STAT_GRID, stagger, PHASE_CONFIG, STREAM_DEFS } from '@/lib/constants'

// Revenue comparison: top 6 products, last 12 months
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

// MAU comparison: top 4 products
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

// Phase funnel
const FUNNEL_DATA = (['rd', 'alpha', 'beta', 'ga', 'sunset'] as const).map(phase => ({
  phase: PHASE_CONFIG[phase].label,
  count: PRODUCTS_BY_PHASE[phase],
})).filter(d => d.count > 0)

// Stream distribution — MRR by stream
const STREAM_MRR = STREAM_DEFS.map(s => {
  const products = PRODUCTS.filter(p => p.stream === s.id)
  return {
    stream: s.label,
    mrr: products.reduce((sum, p) => sum + p.revenue.mrr, 0),
    mau: products.reduce((sum, p) => sum + p.usage.mau, 0),
    products: products.length,
  }
})

// Growth leaders
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

// Chart line colors: teal + muted variants
const LINE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
]

export default function Analytics() {
  return (
    <div className="space-y-6">
      <motion.div {...stagger(0)}>
        <PageHeader
          title="Analytics"
          subtitle="Portfolio performance across all product streams"
        />
      </motion.div>

      {/* Top-level KPIs */}
      <motion.div {...stagger(1)} className={STAT_GRID}>
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
      </motion.div>

      {/* Portfolio revenue trend */}
      <motion.div {...stagger(2)}>
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
      </motion.div>

      {/* Revenue & MAU comparison */}
      <motion.div {...stagger(3)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  <Line
                    key={p.id}
                    type="monotone"
                    dataKey={p.shortName}
                    stroke={LINE_COLORS[i]}
                    strokeWidth={1.5}
                    dot={false}
                  />
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
                  <Line
                    key={p.id}
                    type="monotone"
                    dataKey={p.shortName}
                    stroke={LINE_COLORS[i]}
                    strokeWidth={1.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Phase funnel + stream distribution */}
      <motion.div {...stagger(4)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Phase funnel */}
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

        {/* Stream MRR breakdown */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stream Breakdown</CardTitle>
            <CardDescription className="text-xs">MRR, MAU, and product count by stream</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4 space-y-3">
            {STREAM_MRR.map((s, i) => {
              const maxMrr = Math.max(...STREAM_MRR.map(x => x.mrr))
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
                    <div
                      className="h-full rounded-full bg-primary/60 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Growth leaders */}
      <motion.div {...stagger(5)}>
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
      </motion.div>
    </div>
  )
}
