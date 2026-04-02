import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { BarList } from '@/components/BarList'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { DAILY_ANALYTICS, ERROR_BREAKDOWN, MODEL_HEALTH, SPEND_BY_MODEL } from '@/lib/mock-data'
import type { ChartConfig } from '@/components/ui/chart'
import { FilterPill } from '@/components/FilterPill'
import { CHART_MD } from '@/lib/constants'
import { motion } from 'motion/react'

const TABS = ['Overview', 'Performance', 'Errors', 'Models'] as const

const reqConfig = { requests: { label: 'Requests', color: 'var(--chart-1)' } } satisfies ChartConfig
const tokenConfig = {
  inputTokens: { label: 'Input', color: 'var(--chart-2)' },
  outputTokens: { label: 'Output', color: 'var(--chart-3)' },
} satisfies ChartConfig
const latencyConfig = {
  latencyP50: { label: 'p50', color: 'var(--chart-1)' },
  latencyP95: { label: 'p95', color: 'var(--chart-3)' },
  latencyP99: { label: 'p99', color: 'var(--chart-5)' },
} satisfies ChartConfig
const errorConfig = { errors: { label: 'Errors', color: 'var(--chart-5)' } } satisfies ChartConfig
const modelUsageConfig = { requests: { label: 'Requests', color: 'var(--chart-2)' } } satisfies ChartConfig

const last30 = DAILY_ANALYTICS
const totalReqs = last30.reduce((s, d) => s + d.requests, 0)
const totalTokens = last30.reduce((s, d) => s + d.tokens, 0)
const totalErrors = last30.reduce((s, d) => s + d.errors, 0)
const avgLatency = Math.floor(last30.reduce((s, d) => s + d.latencyP50, 0) / last30.length)

// Prepare BarList data for top models by requests
const modelBarListData = SPEND_BY_MODEL.map(m => ({
  name: m.model,
  value: m.requests,
  color: 'var(--chart-2)',
}))

export default function Analytics() {
  const [tab, setTab] = useState<string>('Overview')

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Usage Analytics" subtitle="Platform-wide usage metrics and performance">
        <div className="flex gap-1">
          {TABS.map(t => (
            <FilterPill key={t} label={t} active={tab === t} onClick={() => setTab(t)} />
          ))}
        </div>
      </PageHeader>

      {tab === 'Overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Total Requests', value: `${(totalReqs / 1000000).toFixed(1)}M`, trend: { value: '+18%', up: true, text: 'vs. last month' }, description: 'Last 30 days' },
              { label: 'Total Tokens', value: `${(totalTokens / 1000000000).toFixed(1)}B`, trend: { value: '+22%', up: true, text: 'Growing steadily' }, description: 'Input + Output' },
              { label: 'Active Users', value: '186', trend: { value: '+24', up: true, text: 'New this month' }, description: 'Unique active users' },
              { label: 'Active Orgs', value: '13', trend: { value: '+2', up: true, text: 'New signups' }, description: 'Organizations with activity' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <StatCard label={s.label} value={s.value} trend={s.trend} description={s.description} />
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Request Volume</CardTitle><CardDescription>Daily requests — 30 days</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={reqConfig} style={{ height: CHART_MD }} className="w-full">
                  <AreaChart data={last30} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={v => v.slice(5)} fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="requests" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Token Usage</CardTitle><CardDescription>Input vs Output tokens — 30 days</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={tokenConfig} style={{ height: CHART_MD }} className="w-full">
                  <AreaChart data={last30} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={v => v.slice(5)} fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="inputTokens" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.1} strokeWidth={1.5} stackId="1" />
                    <Area type="monotone" dataKey="outputTokens" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.1} strokeWidth={1.5} stackId="1" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {tab === 'Performance' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Avg Latency p50', value: `${avgLatency}ms`, trend: { value: '-8ms', up: true, text: 'Improving' }, description: 'Across all models' },
              { label: 'Avg Latency p95', value: `${Math.floor(last30.reduce((s, d) => s + d.latencyP95, 0) / last30.length)}ms`, trend: { value: '-15ms', up: true, text: 'Tail improving' }, description: '95th percentile' },
              { label: 'Avg Latency p99', value: `${Math.floor(last30.reduce((s, d) => s + d.latencyP99, 0) / last30.length)}ms`, trend: { value: '+42ms', up: false, text: 'Slight regression' }, description: '99th percentile' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <StatCard label={s.label} value={s.value} trend={s.trend} description={s.description} />
              </motion.div>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>Latency Percentiles</CardTitle><CardDescription>p50, p95, p99 over time</CardDescription></CardHeader>
            <CardContent>
              <ChartContainer config={latencyConfig} style={{ height: CHART_MD }} className="w-full">
                <LineChart data={last30} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={v => v.slice(5)} fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="latencyP50" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="latencyP95" stroke="var(--chart-3)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="latencyP99" stroke="var(--chart-5)" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}

      {tab === 'Errors' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Total Errors', value: totalErrors.toLocaleString(), trend: { value: '+0.3%', up: false, text: 'Slightly elevated' }, description: 'Last 30 days' },
              { label: 'Error Rate', value: `${((totalErrors / totalReqs) * 100).toFixed(2)}%`, trend: { value: '+0.1%', up: false, text: 'Target: <1%' }, description: 'Errors / Total Requests' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <StatCard label={s.label} value={s.value} trend={s.trend} description={s.description} />
              </motion.div>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>Error Volume</CardTitle><CardDescription>Daily errors — 30 days</CardDescription></CardHeader>
            <CardContent>
              <ChartContainer config={errorConfig} style={{ height: CHART_MD }} className="w-full">
                <AreaChart data={last30} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={v => v.slice(5)} fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="errors" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Error Breakdown</CardTitle><CardDescription>By HTTP status code</CardDescription></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Error Type</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead>Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ERROR_BREAKDOWN.map(e => (
                    <TableRow key={e.type}>
                      <TableCell className="font-medium">{e.type}</TableCell>
                      <TableCell className="text-right font-mono">{e.count.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{e.percentage}%</TableCell>
                      <TableCell>
                        <div className="h-2 rounded-full bg-muted w-32 overflow-hidden">
                          <div className="h-full bg-chart-5 rounded-full" style={{ width: `${e.percentage}%` }} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {tab === 'Models' && (
        <>
          {/* BarList for top models by requests */}
          <Card>
            <CardHeader><CardTitle>Top Models by Usage</CardTitle><CardDescription>Requests per model this month</CardDescription></CardHeader>
            <CardContent>
              <BarList
                data={modelBarListData}
                valueFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                showAnimation
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Model Usage Chart</CardTitle><CardDescription>Requests per model this month</CardDescription></CardHeader>
            <CardContent>
              <ChartContainer config={modelUsageConfig} style={{ height: CHART_MD }} className="w-full">
                <BarChart data={SPEND_BY_MODEL} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 4 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="model" type="category" width={130} fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="requests" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Model Health</CardTitle><CardDescription>Availability and performance</CardDescription></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Uptime</TableHead>
                    <TableHead className="text-right">Avg Latency</TableHead>
                    <TableHead className="text-right">Error Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODEL_HEALTH.map(m => (
                    <TableRow key={m.model}>
                      <TableCell className="font-medium">{m.model}</TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                      <TableCell className="text-right font-mono">{m.uptime}%</TableCell>
                      <TableCell className="text-right font-mono">{m.avgLatency}ms</TableCell>
                      <TableCell className="text-right font-mono">{m.errorRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  )
}
