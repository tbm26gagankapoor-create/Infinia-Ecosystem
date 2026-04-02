import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Search, Download, MoreHorizontal, Building2, Ban } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { FilterPill } from '@/components/FilterPill'
import { EmptyState } from '@/components/EmptyState'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ORGS } from '@/lib/mock-data'
import { toast } from 'sonner'

const PLAN_FILTERS = ['All', 'Free', 'Developer', 'Pro', 'Team', 'Enterprise'] as const
const POSTPAID_FILTERS = ['All', 'Active', 'Inactive', 'Suspended'] as const

export default function Organizations() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('All')
  const [postpaidFilter, setPostpaidFilter] = useState<string>('All')
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null)
  const [createOrgOpen, setCreateOrgOpen] = useState(false)

  // Create org form state
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgPlan, setNewOrgPlan] = useState('Free')
  const [newOrgCreditLimit, setNewOrgCreditLimit] = useState('')

  const filtered = ORGS.filter(org => {
    if (search && !org.name.toLowerCase().includes(search.toLowerCase())) return false
    if (planFilter !== 'All' && org.plan !== planFilter) return false
    if (postpaidFilter !== 'All' && org.postpaidStatus !== postpaidFilter.toLowerCase()) return false
    return true
  })

  const suspendOrg = suspendTarget ? ORGS.find(o => o.id === suspendTarget) : null

  function handleSuspend() {
    toast.success(`${suspendOrg?.name} has been suspended`)
    setSuspendTarget(null)
  }

  function handleCreateOrg() {
    if (!newOrgName.trim()) return
    toast.success(`Organization "${newOrgName}" created`)
    setCreateOrgOpen(false)
    setNewOrgName('')
    setNewOrgPlan('Free')
    setNewOrgCreditLimit('')
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Organizations" subtitle={`${ORGS.length} organizations on the platform`}>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOrgOpen(true)}>
          <Building2 className="h-3.5 w-3.5" />
          Create Org
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-[13px] bg-muted/30 border-border/40" />
        </div>
        <div className="flex gap-1.5">
          {PLAN_FILTERS.map(f => (
            <FilterPill key={f} label={f} active={planFilter === f} onClick={() => setPlanFilter(f)} />
          ))}
        </div>
        <div className="flex gap-1.5">
          {POSTPAID_FILTERS.map(f => (
            <FilterPill key={f} label={f} active={postpaidFilter === f} onClick={() => setPostpaidFilter(f)} />
          ))}
        </div>
      </div>

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Postpaid</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead className="text-right">Usage</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <EmptyState title="No organizations match your filters" description="Try adjusting your search or filter criteria" />
                  </TableCell>
                </TableRow>
              ) : filtered.map(org => (
                <TableRow
                  key={org.id}
                  className="hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => navigate(`/organizations/${org.id}`)}
                >
                  <TableCell>
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs text-muted-foreground">{org.createdAt}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{org.plan}</Badge></TableCell>
                  <TableCell><StatusBadge status={org.postpaidStatus} /></TableCell>
                  <TableCell><StatusBadge status={org.slaStatus} /></TableCell>
                  <TableCell className="text-right font-mono text-sm">{org.creditLimit > 0 ? `$${org.creditLimit.toLocaleString()}` : '—'}</TableCell>
                  <TableCell className="text-right font-mono text-sm">${org.currentUsage.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{org.members}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{(org.totalRequests / 1000).toFixed(0)}K</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => navigate(`/organizations/${org.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        {org.postpaidStatus === 'active' && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setSuspendTarget(org.id)}
                          >
                            <Ban className="h-3.5 w-3.5 mr-1.5" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Suspend Confirm Dialog */}
      <Dialog open={!!suspendTarget} onOpenChange={open => { if (!open) setSuspendTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {suspendOrg?.name}?</DialogTitle>
            <DialogDescription>
              This will immediately deactivate all API keys for this organization. Active requests will be terminated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
            >
              Suspend Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Org Dialog */}
      <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>Add a new organization to the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Organization Name</label>
              <Input
                placeholder="e.g. Acme Corp"
                value={newOrgName}
                onChange={e => setNewOrgName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Plan</label>
              <Select value={newOrgPlan} onValueChange={setNewOrgPlan}>
                <SelectTrigger>
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
              <label className="text-sm font-medium">Credit Limit ($)</label>
              <Input
                type="number"
                placeholder="0 = no limit"
                value={newOrgCreditLimit}
                onChange={e => setNewOrgCreditLimit(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOrgOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOrg} disabled={!newOrgName.trim()}>
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
