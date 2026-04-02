import { Building2, Users, Activity, DollarSign, Clock, AlertTriangle, ArrowRight, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { DeltaBadge } from '@/components/DeltaBadge'
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { DAILY_ANALYTICS, SPEND_BY_MODEL, ORGS, AUDIT_LOGS, REVENUE_SUMMARY } from '@/lib/mock-data'
import type { ChartConfig } from '@/components/ui/chart'
import { CHART_SM, CHART_MD } from '@/lib/constants'
import { motion } from 'motion/react'

const STATS = [
  { label: 'Total Organizations', value: '15', trend: { value: '+2', up: true, text: '2 new this month' }, description: '13 active, 1 suspended, 1 free tier', icon: Building2 },
  { label: 'Active Users', value: '186', trend: { value: '+24', up: true, text: 'Growing steadily' }, description: 'Across all organizations', icon: Users },
  { label: 'Platform Requests (24h)', value: '142K', trend: { value: '+18%', up: true, text: 'Higher than last week avg' }, description: 'All models combined', icon: Activity },
  { label: 'Revenue MTD', value: '$302.4K', trend: { value: '+8.5%', up: true, text: 'vs. last month' }, description: `Last month: $${(REVENUE_SUMMARY.totalRevenueLastMonth / 1000).toFixed(1)}K`, icon: DollarSign },
  { label: 'Avg Latency p50', value: '324ms', trend: { value: '-8ms', up: true, text: 'Improving this week' }, description: 'Across all models', icon: Clock },
  { label: 'Error Rate', value: '1.2%', trend: { value: '+0.3%', up: false, text: 'Slightly elevated' }, description: 'Target: <1%', icon: AlertTriangle },
]

const requestChartConfig = {
  requests: { label: 'Requests', color: 'var(--chart-1)' },
  errors: { label: 'Errors', color: 'var(--chart-5)' },
} satisfies ChartConfig

const revenueChartConfig = {
  spend: { label: 'Revenue', color: 'var(--chart-2)' },
} satisfies ChartConfig

const modelChartConfig = {
  spend: { label: 'Spend', color: 'var(--chart-3)' },
} satisfies ChartConfig

const recentSignups = ORGS.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
const recentAudit = AUDIT_LOGS.slice(0, 5)

export default function Dashboard() {
  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and key metrics">
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Create Org
        </Button>
      </PageHeader>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
          >
            <StatCard label={stat.label} value={stat.value} trend={stat.trend} description={stat.description} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Request Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>Platform requests and errors — last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={requestChartConfig} style={{ height: CHART_SM }} className="w-full">
              <AreaChart data={DAILY_ANALYTICS} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={v => v.slice(5)} fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="requests" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="errors" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.15} strokeWidth={1.5} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue — last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} style={{ height: CHART_SM }} className="w-full">
              <AreaChart data={DAILY_ANALYTICS} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={v => v.slice(5)} fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="spend" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Top Models + Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Top Models by Spend */}
        <Card>
          <CardHeader>
            <CardTitle>Top Models by Spend</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={modelChartConfig} style={{ height: CHART_MD }} className="w-full">
              <BarChart data={SPEND_BY_MODEL.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="model" type="category" width={120} fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="spend" fill="var(--chart-3)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Signups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Signups</CardTitle>
              <CardDescription>Newest organizations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSignups.map(org => (
                <div key={org.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{org.name}</div>
                    <div className="text-xs text-muted-foreground">{org.createdAt} &middot; {org.members} members</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{org.plan}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Audit Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest admin actions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAudit.map(entry => (
                <div key={entry.id} className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{entry.details}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.actor} &middot; {new Date(entry.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Stats with DeltaBadge */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Snapshot</CardTitle>
          <CardDescription>Key metrics with period-over-period change</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 + i * 0.04 }}
                className="flex flex-col gap-1"
              >
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-lg font-bold font-mono">{s.value}</div>
                <DeltaBadge
                  value={s.trend.value}
                  type={s.trend.up ? 'increase' : 'decrease'}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Quick View */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Model availability and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { name: 'LLaMA 3.3 70B', status: 'healthy' as const, latency: '312ms' },
              { name: 'DeepSeek R1 671B', status: 'healthy' as const, latency: '890ms' },
              { name: 'Qwen 2.5 72B', status: 'healthy' as const, latency: '345ms' },
              { name: 'Mistral Nemo 12B', status: 'healthy' as const, latency: '145ms' },
              { name: 'DeepSeek R1 70B', status: 'degraded' as const, latency: '520ms' },
              { name: 'Gemma 3 27B', status: 'healthy' as const, latency: '210ms' },
              { name: 'LLaMA 3.2 3B', status: 'healthy' as const, latency: '62ms' },
            ].map(m => (
              <div key={m.name} className="rounded-lg border p-3 text-center">
                <div className="text-xs font-medium truncate mb-1">{m.name}</div>
                <StatusBadge status={m.status} />
                <div className="text-xs text-muted-foreground mt-1 font-mono">{m.latency}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
