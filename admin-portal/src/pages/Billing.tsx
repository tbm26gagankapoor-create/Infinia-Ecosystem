import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { UsageProgress } from '@/components/UsageProgress'
import { ORGS, PRICING_TIERS, REVENUE_SUMMARY } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Check, Pencil } from 'lucide-react'

const postpaidOrgs = ORGS.filter(o => o.postpaidStatus !== 'inactive')

export default function Billing() {
  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Billing Management" subtitle="Credits, postpaid accounts, and pricing tiers" />

      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Revenue MTD" value={`$${(REVENUE_SUMMARY.totalRevenueMTD / 1000).toFixed(1)}K`} trend={{ value: '+8.5%', up: true, text: 'vs. last month' }} description={`Last month: $${(REVENUE_SUMMARY.totalRevenueLastMonth / 1000).toFixed(1)}K`} />
        <StatCard label="Credits Outstanding" value={`$${(REVENUE_SUMMARY.totalCreditsOutstanding / 1000).toFixed(1)}K`} trend={{ value: '', up: true, text: 'Across all orgs' }} description="Total unspent credits" />
        <StatCard label="Postpaid Orgs" value={`${REVENUE_SUMMARY.postpaidOrgs}`} trend={{ value: '', up: true, text: `${REVENUE_SUMMARY.paidOrgs} paid total` }} description="Enterprise billing accounts" />
        <StatCard label="Paid Orgs" value={`${REVENUE_SUMMARY.paidOrgs}`} trend={{ value: '+3', up: true, text: 'Converted this month' }} description={`of ${REVENUE_SUMMARY.totalOrgs} total`} />
      </div>

      {/* Postpaid Management (Admin-Only) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Postpaid Accounts
              <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 text-[10px]">Admin Only</Badge>
            </CardTitle>
            <CardDescription>Manage credit limits and SLA status for postpaid organizations</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead className="text-right">Credit Limit</TableHead>
                <TableHead className="text-right">Current Usage</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {postpaidOrgs.map(org => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell><StatusBadge status={org.postpaidStatus} /></TableCell>
                    <TableCell><StatusBadge status={org.slaStatus} /></TableCell>
                    <TableCell className="text-right font-mono">${org.creditLimit.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">${org.currentUsage.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">${(org.creditLimit - org.currentUsage).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <UsageProgress used={org.currentUsage} limit={org.creditLimit} className="w-32 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Pencil className="h-3 w-3" />Edit</Button>
                        {org.postpaidStatus === 'active' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">Suspend</Button>
                        )}
                        {org.postpaidStatus === 'suspended' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600">Reactivate</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Org Billing Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Organization Billing</CardTitle>
          <CardDescription>Billing status across all organizations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Credit Balance</TableHead>
                <TableHead className="text-right">Current Usage</TableHead>
                <TableHead>Postpaid</TableHead>
                <TableHead className="text-right">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...ORGS].sort((a, b) => b.currentUsage - a.currentUsage).map(org => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{org.plan}</Badge></TableCell>
                  <TableCell className="text-right font-mono">${org.creditBalance.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${org.currentUsage.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={org.postpaidStatus} /></TableCell>
                  <TableCell className="text-right">{org.members}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Tiers</CardTitle>
          <CardDescription>Current tier configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PRICING_TIERS.map(tier => (
              <div key={tier.name} className={cn("rounded-lg border p-4 space-y-3", tier.name === 'Enterprise' && "border-primary/50 bg-primary/5")}>
                <div>
                  <div className="font-semibold">{tier.name}</div>
                  <div className="text-xl font-bold font-mono mt-1">
                    {tier.monthlyPrice === 0 ? (tier.name === 'Enterprise' ? 'Custom' : 'Free') : `$${tier.monthlyPrice}/mo`}
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                  <Pencil className="h-3 w-3" />Edit Tier
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
