import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ChevronRight, Building2, Pencil, Ban, Key, Users,
  CreditCard, Activity, Settings, UserPlus, Plus, DollarSign,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionBadge } from '@/components/ActionBadge'
import { RoleBadge } from '@/components/RoleBadge'
import { UsageProgress } from '@/components/UsageProgress'
import { EmptyState } from '@/components/EmptyState'
import { SectionTitle } from '@/components/SectionTitle'
import { ORGS, API_KEYS, USERS, AUDIT_LOGS } from '@/lib/mock-data'
import { formatDate, formatTimestamp } from '@/lib/formatters'
import { toast } from 'sonner'

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function OrgDetail() {
  const { id } = useParams<{ id: string }>()
  const [suspendOpen, setSuspendOpen] = useState(false)

  const org = ORGS.find(o => o.id === id)

  if (!org) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center gap-4 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Building2 className="h-10 w-10 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Organization not found</h2>
        <p className="text-sm text-muted-foreground">The organization you are looking for does not exist.</p>
        <Button variant="outline" size="sm" asChild>
          <Link to="/organizations">Back to Organizations</Link>
        </Button>
      </motion.div>
    )
  }

  const orgKeys = API_KEYS.filter(k => k.orgName === org.name)
  const orgUsers = USERS.filter(u => u.orgName === org.name)
  const orgLogs = AUDIT_LOGS.filter(l => l.orgName === org.name).slice(0, 5)
  const utilization = org.creditLimit > 0 ? (org.currentUsage / org.creditLimit) * 100 : 0
  const remainingBalance = org.creditLimit > 0 ? org.creditLimit - org.currentUsage : org.creditBalance

  // Collect unique models from this org's keys
  const orgModels = Array.from(
    new Set(orgKeys.flatMap(k => k.modelAllowlist.filter(m => m !== '*')))
  )

  function handleSuspend() {
    toast.success(`${org!.name} has been suspended`)
    setSuspendOpen(false)
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Link to="/organizations" className="hover:text-foreground transition-colors">
            Organizations
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{org.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{org.name}</h1>
            <p className="text-sm text-muted-foreground/70 mt-0.5">
              Created {formatDate(org.createdAt)} &middot; {org.plan} plan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            {org.postpaidStatus === 'active' && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => setSuspendOpen(true)}
              >
                <Ban className="h-3.5 w-3.5" />
                Suspend Org
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Credit Limit',
            value: org.creditLimit > 0 ? `$${org.creditLimit.toLocaleString()}` : 'No limit',
            icon: CreditCard,
          },
          {
            label: 'Current Usage',
            value: `$${org.currentUsage.toLocaleString()}`,
            icon: DollarSign,
          },
          {
            label: 'Members',
            value: String(org.members),
            icon: Users,
          },
          {
            label: 'API Keys',
            value: String(orgKeys.length),
            icon: Key,
          },
        ].map(stat => (
          <Card key={stat.label} className="border border-border/40 shadow-sm">
            <CardContent className="pt-4 pb-4 flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-xl font-semibold font-mono tracking-tight">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview" className="gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-1.5">
            <Key className="h-3.5 w-3.5" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Members
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5">
            <CreditCard className="h-3.5 w-3.5" />
            Billing & Usage
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Overview ── */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="border border-border/40 shadow-sm">
                <CardHeader className="pb-3">
                  <SectionTitle>Organization Info</SectionTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Plan</div>
                    <Badge variant="outline" className="text-[10px]">{org.plan}</Badge>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Postpaid</div>
                    <StatusBadge status={org.postpaidStatus} />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">SLA Status</div>
                    <StatusBadge status={org.slaStatus} />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Created</div>
                    <span className="font-mono text-xs">{formatDate(org.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/40 shadow-sm">
                <CardHeader className="pb-3">
                  <SectionTitle>Financial Summary</SectionTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Credit Limit</div>
                    <span className="font-mono font-semibold">
                      {org.creditLimit > 0 ? `$${org.creditLimit.toLocaleString()}` : 'No limit'}
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Current Usage</div>
                    <span className="font-mono font-semibold">${org.currentUsage.toLocaleString()}</span>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Credit Balance</div>
                    <span className="font-mono font-semibold">${org.creditBalance.toLocaleString()}</span>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Total Requests</div>
                    <span className="font-mono font-semibold">{org.totalRequests.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Utilization Bar */}
            {org.creditLimit > 0 && (
              <Card className="border border-border/40 shadow-sm mt-6">
                <CardHeader className="pb-2">
                  <SectionTitle>Credit Utilization</SectionTitle>
                </CardHeader>
                <CardContent>
                  <UsageProgress used={org.currentUsage} limit={org.creditLimit} />
                </CardContent>
              </Card>
            )}

            {/* Recent Audit Activity */}
            <Card className="border border-border/40 shadow-sm mt-6">
              <CardHeader className="pb-3">
                <SectionTitle>Recent Audit Activity</SectionTitle>
              </CardHeader>
              <CardContent>
                {orgLogs.length === 0 ? (
                  <EmptyState title="No recent activity for this organization" />
                ) : (
                  <div className="space-y-3">
                    {orgLogs.map(log => (
                      <div key={log.id} className="flex items-start gap-3 text-sm">
                        <span className="text-[11px] text-muted-foreground font-mono whitespace-nowrap pt-0.5">
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className="text-[12px] text-muted-foreground shrink-0">{log.actor}</span>
                        <ActionBadge action={log.action} />
                        <span className="text-[13px] text-muted-foreground/80 truncate">{log.details}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── Tab 2: API Keys ── */}
        <TabsContent value="api-keys" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">{orgKeys.length} API key{orgKeys.length !== 1 ? 's' : ''}</h3>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Create Key
              </Button>
            </div>
            {orgKeys.length === 0 ? (
              <Card className="border border-border/40 shadow-sm">
                <CardContent>
                  <EmptyState icon={<Key className="h-10 w-10" />} title="No API keys for this organization" />
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border/40 shadow-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[11px] uppercase tracking-wider">Key Name</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider">Prefix</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider">Models</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider text-right">RPM</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider text-right">Cost Ceiling</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider text-right">Spend MTD</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgKeys.map(key => (
                        <TableRow key={key.id}>
                          <TableCell className="text-[13px]">
                            <div className="flex items-center gap-2">
                              <Key className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">{key.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[13px] font-mono text-muted-foreground">{key.prefix}</TableCell>
                          <TableCell className="text-[13px]">
                            {key.modelAllowlist[0] === '*'
                              ? <Badge variant="outline" className="text-[10px]">All models</Badge>
                              : <span className="text-muted-foreground">{key.modelAllowlist.length} model{key.modelAllowlist.length !== 1 ? 's' : ''}</span>
                            }
                          </TableCell>
                          <TableCell className="text-[13px] text-right font-mono">{key.rpmLimit.toLocaleString()}</TableCell>
                          <TableCell className="text-[13px] text-right font-mono">${key.monthlyCostCeiling.toLocaleString()}</TableCell>
                          <TableCell className="text-[13px] text-right font-mono">${key.currentMonthSpend.toLocaleString()}</TableCell>
                          <TableCell><StatusBadge status={key.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* ── Tab 3: Members ── */}
        <TabsContent value="members" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">{orgUsers.length} member{orgUsers.length !== 1 ? 's' : ''}</h3>
              <Button size="sm" className="gap-1.5">
                <UserPlus className="h-3.5 w-3.5" />
                Invite Member
              </Button>
            </div>
            {orgUsers.length === 0 ? (
              <Card className="border border-border/40 shadow-sm">
                <CardContent>
                  <EmptyState icon={<Users className="h-10 w-10" />} title="No members in this organization" />
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border/40 shadow-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[11px] uppercase tracking-wider">Name</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider">Email</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider">Role</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider">Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="text-[13px]">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                                {getInitials(user.name)}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[13px] text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <RoleBadge role={user.role} />
                          </TableCell>
                          <TableCell><StatusBadge status={user.status} /></TableCell>
                          <TableCell className="text-[13px] text-muted-foreground font-mono">
                            {formatTimestamp(user.lastActive)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* ── Tab 4: Billing & Usage ── */}
        <TabsContent value="billing" className="mt-4 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Credit Limit', value: org.creditLimit > 0 ? `$${org.creditLimit.toLocaleString()}` : 'No limit' },
                { label: 'Current Usage', value: `$${org.currentUsage.toLocaleString()}` },
                { label: 'Remaining Balance', value: `$${remainingBalance.toLocaleString()}` },
                { label: 'Utilization', value: org.creditLimit > 0 ? `${utilization.toFixed(1)}%` : 'N/A' },
              ].map(kpi => (
                <Card key={kpi.label} className="border border-border/40 shadow-sm">
                  <CardContent className="pt-4 pb-4 text-center">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{kpi.label}</div>
                    <div className="text-lg font-semibold font-mono">{kpi.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Usage Chart Placeholder */}
            <Card className="border border-border/40 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Monthly Spend Trend</CardTitle>
                <CardDescription className="text-xs">Coming soon -- daily spend data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center border border-dashed border-border/40 rounded-lg bg-muted/10">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-6 w-6 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">Chart will render here when spend data is available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Breakdown */}
            <Card className="border border-border/40 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Model Usage Breakdown</CardTitle>
                <CardDescription className="text-xs">Models used by this organization&apos;s API keys</CardDescription>
              </CardHeader>
              <CardContent>
                {orgModels.length === 0 && orgKeys.some(k => k.modelAllowlist.includes('*')) ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <span className="text-[13px]">All models (wildcard access)</span>
                      <Badge variant="outline" className="text-[10px]">Full access</Badge>
                    </div>
                  </div>
                ) : orgModels.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No model data available</p>
                ) : (
                  <div className="space-y-2">
                    {orgModels.map((model) => (
                      <div key={model} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <span className="text-[13px] font-medium">{model}</span>
                        <span className="text-[12px] font-mono text-muted-foreground">
                          ~${(Math.floor(Math.random() * 5000) + 500).toLocaleString()} MTD
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── Tab 5: Settings ── */}
        <TabsContent value="settings" className="mt-4 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {/* Credit & Limits */}
            <Card className="border border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Credit & Limits</CardTitle>
                <CardDescription className="text-xs">Configure spending limits and rate overrides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Credit Limit ($)</label>
                    <Input
                      type="number"
                      defaultValue={org.creditLimit || ''}
                      placeholder="0 = no limit"
                      className="h-8 text-[13px] bg-muted/30 border-border/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">RPM Override</label>
                    <Input
                      type="number"
                      placeholder="Default by plan"
                      className="h-8 text-[13px] bg-muted/30 border-border/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">TPM Override</label>
                    <Input
                      type="number"
                      placeholder="Default by plan"
                      className="h-8 text-[13px] bg-muted/30 border-border/40"
                    />
                  </div>
                </div>
                <Button size="sm" onClick={() => toast.success('Limits updated')}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Plan & Billing */}
            <Card className="border border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Plan & Billing</CardTitle>
                <CardDescription className="text-xs">Manage organization plan and postpaid status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Current Plan</label>
                    <div><Badge variant="outline">{org.plan}</Badge></div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Change Plan</label>
                    <Select defaultValue={org.plan}>
                      <SelectTrigger className="h-8 text-[13px] bg-muted/30 border-border/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['Free', 'Developer', 'Pro', 'Team', 'Enterprise'] as const).map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Postpaid Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Switch
                        defaultChecked={org.postpaidStatus === 'active'}
                        onCheckedChange={(checked) => {
                          toast.success(checked ? 'Postpaid activated' : 'Postpaid deactivated')
                        }}
                      />
                      <StatusBadge status={org.postpaidStatus} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border border-destructive/30 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-sm font-medium text-destructive">Danger Zone</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium">Suspend Organization</p>
                    <p className="text-xs text-muted-foreground">
                      This will immediately deactivate all API keys and terminate active requests.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => setSuspendOpen(true)}
                  >
                    <Ban className="h-3.5 w-3.5 mr-1.5" />
                    Suspend
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Suspend Confirm Dialog */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {org.name}?</DialogTitle>
            <DialogDescription>
              This will immediately deactivate all API keys for this organization. Active requests will be terminated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
