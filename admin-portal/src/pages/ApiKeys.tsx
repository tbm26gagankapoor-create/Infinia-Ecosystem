import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, Download, MoreHorizontal, KeyRound, RotateCcw, XCircle, Copy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { FilterPill } from '@/components/FilterPill'
import { EmptyState } from '@/components/EmptyState'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { API_KEYS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_FILTERS = ['All', 'Active', 'Revoked'] as const

export default function ApiKeys() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [rotateTarget, setRotateTarget] = useState<string | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null)

  const filtered = API_KEYS.filter(k => {
    if (search && !k.name.toLowerCase().includes(search.toLowerCase()) && !k.orgName.toLowerCase().includes(search.toLowerCase()) && !k.prefix.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'All' && k.status !== statusFilter.toLowerCase()) return false
    return true
  })

  const selected = selectedKey ? API_KEYS.find(k => k.id === selectedKey) : null
  const rotateKey = rotateTarget ? API_KEYS.find(k => k.id === rotateTarget) : null
  const revokeKey = revokeTarget ? API_KEYS.find(k => k.id === revokeTarget) : null

  function handleRotate() {
    toast.success(`${rotateKey?.name} rotation initiated. Old key valid for 24h.`)
    setRotateTarget(null)
  }

  function handleRevoke() {
    toast.success(`${revokeKey?.name} has been revoked`)
    setRevokeTarget(null)
    setSelectedKey(null)
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="API Keys" subtitle={`${API_KEYS.length} keys across all organizations`}>
        <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Keys', value: API_KEYS.length },
          { label: 'Active', value: API_KEYS.filter(k => k.status === 'active').length },
          { label: 'Revoked', value: API_KEYS.filter(k => k.status === 'revoked').length },
          { label: 'Total Spend MTD', value: `$${(API_KEYS.reduce((s, k) => s + k.currentMonthSpend, 0) / 1000).toFixed(1)}K` },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, org, or prefix..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-[13px] bg-muted/30 border-border/40" />
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map(f => (
            <FilterPill key={f} label={f} active={statusFilter === f} onClick={() => setStatusFilter(f)} />
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Models</TableHead>
                <TableHead className="text-right">RPM</TableHead>
                <TableHead className="text-right">Cost Ceiling</TableHead>
                <TableHead className="text-right">Spend MTD</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <EmptyState title="No API keys match your filters" description="Try adjusting your search or filter criteria" />
                  </TableCell>
                </TableRow>
              ) : filtered.map(k => (
                <TableRow
                  key={k.id}
                  className={cn("hover:bg-muted/40 transition-colors cursor-pointer", selectedKey === k.id && "bg-accent")}
                  onClick={() => setSelectedKey(k.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{k.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm truncate max-w-[200px]">{k.orgName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{k.prefix}</TableCell>
                  <TableCell>
                    {k.modelAllowlist[0] === '*' ? (
                      <Badge variant="outline" className="text-[10px]">All Models</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">{k.modelAllowlist.length} models</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{k.rpmLimit.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">${k.monthlyCostCeiling.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">${k.currentMonthSpend.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={k.status} /></TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={e => {
                        e.stopPropagation()
                        setSelectedKey(k.id)
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Key Detail Sheet */}
      <Sheet open={!!selectedKey} onOpenChange={open => { if (!open) setSelectedKey(null) }}>
        <SheetContent className="sm:max-w-[460px] overflow-y-auto" side="right">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  {selected.name}
                </SheetTitle>
                <SheetDescription>Key details and usage metrics</SheetDescription>
              </SheetHeader>

              {/* Details */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization</span>
                  <span>{selected.orgName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prefix</span>
                  <span className="font-mono text-xs">{selected.prefix}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RPM Limit</span>
                  <span className="font-mono">{selected.rpmLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost Ceiling</span>
                  <span className="font-mono">${selected.monthlyCostCeiling.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spend MTD</span>
                  <span className="font-mono">${selected.currentMonthSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requests</span>
                  <span className="font-mono">{(selected.requestCount / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Used</span>
                  <span className="text-xs">{new Date(selected.lastUsed).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{selected.createdAt}</span>
                </div>
              </div>

              {/* Model Allowlist */}
              <div className="border-t pt-4 mb-4">
                <div className="text-xs text-muted-foreground mb-2">Model Allowlist</div>
                <div className="flex flex-wrap gap-1">
                  {selected.modelAllowlist.map(m => (
                    <Badge key={m} variant="outline" className="text-[10px]">{m === '*' ? 'All Models' : m}</Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="border-t pt-4 mb-4">
                <div className="text-xs text-muted-foreground mb-2">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {selected.tags.map(t => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </div>

              {/* Spend vs Ceiling */}
              <div className="border-t pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spend vs. Ceiling</span>
                  <span>{((selected.currentMonthSpend / selected.monthlyCostCeiling) * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={Math.min(100, (selected.currentMonthSpend / selected.monthlyCostCeiling) * 100)}
                  className={cn(
                    "h-2",
                    selected.currentMonthSpend / selected.monthlyCostCeiling > 0.9 && "[&>div]:bg-destructive"
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>${selected.currentMonthSpend.toLocaleString()} spent</span>
                  <span>${selected.monthlyCostCeiling.toLocaleString()} ceiling</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(selected.prefix).catch(() => {})
                    toast.success('Prefix copied to clipboard')
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Prefix
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setRotateTarget(selected.id)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Rotate
                </Button>
                {selected.status === 'active' && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => setRevokeTarget(selected.id)}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Revoke
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Rotate Confirm Dialog */}
      <Dialog open={!!rotateTarget} onOpenChange={open => { if (!open) setRotateTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rotate this key?</DialogTitle>
            <DialogDescription>
              A new key will be generated. The old key will continue working for 24 hours to allow for a smooth transition.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRotateTarget(null)}>Cancel</Button>
            <Button onClick={handleRotate}>
              Rotate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirm Dialog */}
      <Dialog open={!!revokeTarget} onOpenChange={open => { if (!open) setRevokeTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this key?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Active requests using this key will fail immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevoke}>
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
