import { useState } from 'react'
import { motion } from 'motion/react'
import { Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { DAILY_ANALYTICS, SPEND_BY_MODEL, SPEND_BY_ORG, API_KEYS } from '@/lib/mock-data'
import { FilterPill } from '@/components/FilterPill'
import { CHART_MD } from '@/lib/constants'
import type { ChartConfig } from '@/components/ui/chart'

const DATE_RANGES = ['Today', '7d', '30d', 'Custom'] as const

const spendChartConfig = { spend: { label: 'Spend ($)', color: 'var(--chart-2)' } } satisfies ChartConfig
const modelChartConfig = { spend: { label: 'Spend ($)', color: 'var(--chart-3)' } } satisfies ChartConfig
const orgChartConfig = { spend: { label: 'Spend ($)', color: 'var(--chart-1)' } } satisfies ChartConfig

const totalSpend = DAILY_ANALYTICS.reduce((s, d) => s + d.spend, 0)
const avgCostPerReq = totalSpend / DAILY_ANALYTICS.reduce((s, d) => s + d.requests, 0)

export default function CostIntelligence() {
  const [dateRange, setDateRange] = useState<string>('30d')

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Cost Intelligence" subtitle="Real-time spend tracking and analysis">
        <div className="flex gap-1.5">
          {DATE_RANGES.map(r => (
            <FilterPill key={r} label={r} active={dateRange === r} onClick={() => setDateRange(r)} />
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" />Export CSV</Button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Spend" value={`$${(totalSpend / 1000).toFixed(1)}K`} trend={{ value: '+8.5%', up: true, text: 'vs. previous period' }} description="Last 30 days" />
        <StatCard label="Daily Average" value={`$${(totalSpend / 30).toFixed(0)}`} trend={{ value: '+$120', up: true, text: 'Higher than last month' }} description="Per day average" />
        <StatCard label="Avg Cost/Request" value={`$${avgCostPerReq.toFixed(4)}`} trend={{ value: '-2.1%', up: true, text: 'Cost efficiency improving' }} description="Across all models" />
        <StatCard label="Top Spender" value="G42 Cloud" trend={{ value: '$89.4K', up: false, text: '29.8% of total' }} description="Highest spending org" />
      </div>

      {/* Spend Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Spend Over Time</CardTitle>
          <CardDescription>Daily platform revenue — last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={spendChartConfig} style={{ height: CHART_MD }} className="w-full">
            <AreaChart data={DAILY_ANALYTICS} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={v => v.slice(5)} fontSize={11} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="spend" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spend by Model */}
        <Card>
          <CardHeader>
            <CardTitle>Spend by Model</CardTitle>
            <CardDescription>Top models by cost this period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={modelChartConfig} style={{ height: CHART_MD }} className="w-full">
              <BarChart data={SPEND_BY_MODEL} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="model" type="category" width={130} fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="spend" fill="var(--chart-3)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Spend by Org */}
        <Card>
          <CardHeader>
            <CardTitle>Spend by Organization</CardTitle>
            <CardDescription>Top organizations by cost</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={orgChartConfig} style={{ height: CHART_MD }} className="w-full">
              <BarChart data={SPEND_BY_ORG} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="org" type="category" width={140} fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="spend" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Spend by API Key Table (Pivot-like) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Spend by API Key</CardTitle>
            <CardDescription>Detailed breakdown per key</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px]">Group by: Key</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead className="text-right">Spend MTD</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Avg Cost/Req</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const activeKeys = API_KEYS.filter(k => k.status === 'active').sort((a, b) => b.currentMonthSpend - a.currentMonthSpend)
                const totalKeySpend = activeKeys.reduce((s, k) => s + k.currentMonthSpend, 0)
                return activeKeys.map(k => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{k.orgName}</TableCell>
                    <TableCell className="text-right font-mono">${k.currentMonthSpend.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{totalKeySpend > 0 ? ((k.currentMonthSpend / totalKeySpend) * 100).toFixed(1) : '0.0'}%</TableCell>
                    <TableCell className="text-right font-mono">{(k.requestCount / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="text-right font-mono">{k.requestCount > 0 ? `$${(k.currentMonthSpend / k.requestCount).toFixed(4)}` : '—'}</TableCell>
                  </TableRow>
                ))
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
