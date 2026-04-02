import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { FilterPill } from '@/components/FilterPill'
import { ActionBadge } from '@/components/ActionBadge'
import { EmptyState } from '@/components/EmptyState'
import { AUDIT_LOGS } from '@/lib/mock-data'

const ACTION_TYPES = ['All', 'key', 'org', 'billing', 'budget', 'user', 'pricing'] as const

export default function AuditLogs() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('All')

  const filtered = AUDIT_LOGS.filter(entry => {
    if (search && !entry.details.toLowerCase().includes(search.toLowerCase()) && !entry.actor.toLowerCase().includes(search.toLowerCase()) && !entry.orgName.toLowerCase().includes(search.toLowerCase())) return false
    if (actionFilter !== 'All' && !entry.action.startsWith(actionFilter)) return false
    return true
  })

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Audit Logs" subtitle={`${AUDIT_LOGS.length} events recorded`}>
        <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by details, actor, or org..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-[13px] bg-muted/30 border-border/40" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ACTION_TYPES.map(t => (
            <FilterPill key={t} label={t === 'All' ? 'All Actions' : t} active={actionFilter === t} onClick={() => setActionFilter(t)} />
          ))}
        </div>
      </div>

      {/* Event Stream Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState title="No audit logs match your filters" description="Try adjusting your search or filter criteria" />
                  </TableCell>
                </TableRow>
              ) : filtered.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {entry.actor === 'system' ? (
                        <Badge variant="outline" className="text-[10px]">System</Badge>
                      ) : (
                        <span className="text-sm">{entry.actor}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActionBadge action={entry.action} />
                  </TableCell>
                  <TableCell className="text-sm">{entry.orgName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[300px]">{entry.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
