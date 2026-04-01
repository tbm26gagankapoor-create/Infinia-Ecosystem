import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { PROJECTS, type Project } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  archived: 'bg-neutral-500/10 text-neutral-500 dark:text-neutral-400 border-neutral-500/20',
}

function SortIcon({ column }: { column: { getIsSorted: () => false | 'asc' | 'desc' } }) {
  const sorted = column.getIsSorted()
  if (sorted === 'asc') return <ChevronUp className="h-3 w-3" />
  if (sorted === 'desc') return <ChevronDown className="h-3 w-3" />
  return <ArrowUpDown className="h-3 w-3 opacity-50" />
}

export function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>(PROJECTS)
  const [createOpen, setCreateOpen] = useState(false)
  const [toggleTarget, setToggleTarget] = useState<Project | null>(null)
  const toggleGuard = useRef(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [nameError, setNameError] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const activeProjects = projects.filter(p => p.status === 'active')
  const totalKeys = projects.reduce((sum, p) => sum + p.keyCount, 0)
  const totalSpend = projects.reduce((sum, p) => sum + parseFloat(p.monthlySpend.replace('$', '')), 0)

  const columns: ColumnDef<Project>[] = [
    {
      id: 'index',
      header: '#',
      cell: ({ row }) => <span className="text-sm font-mono text-muted-foreground">{row.index + 1}</span>,
      enableSorting: false,
      size: 48,
    },
    {
      accessorKey: 'name',
      header: 'Project',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-foreground">{row.original.name}</div>
          {row.original.description && (
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{row.original.description}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'keyCount',
      header: 'Keys',
      cell: ({ getValue }) => <span className="text-sm font-mono text-foreground">{getValue<number>()}</span>,
    },
    {
      accessorKey: 'rpmLimit',
      header: 'RPM',
      cell: ({ getValue }) => <span className="text-sm font-mono text-foreground">{getValue<number>()}</span>,
    },
    {
      id: 'spend',
      accessorFn: row => parseFloat(row.monthlySpend.replace('$', '')),
      header: 'Spend',
      cell: ({ row }) => <span className="text-sm font-mono text-foreground">{row.original.monthlySpend}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue<string>()
        return (
          <Badge variant="outline" className={cn('text-xs border', STATUS_STYLES[status])}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'active',
      header: 'Active',
      enableSorting: false,
      cell: ({ row }) => {
        const project = row.original
        return (
          <div className="flex justify-center">
            <Switch
              checked={project.status === 'active'}
              aria-label={`Toggle ${project.name} status`}
              onClick={e => e.stopPropagation()}
              onCheckedChange={() => {
                if (!toggleGuard.current) setToggleTarget(project)
              }}
            />
          </div>
        )
      },
    },
    {
      id: 'chevron',
      enableSorting: false,
      cell: () => <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      size: 40,
    },
  ]

  const table = useReactTable({
    data: projects,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  function handleCreate() {
    if (!newName.trim()) {
      setNameError('Project name is required')
      return
    }
    const id = `tf-proj_${Math.random().toString(36).slice(2, 10)}`
    const project: Project = {
      id,
      name: newName.trim(),
      description: newDesc.trim(),
      modelAllowlist: [],
      rpmLimit: 60,
      keyCount: 0,
      monthlySpend: '$0.00',
      status: 'active',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    setProjects([project, ...projects])
    setCreateOpen(false)
    setNewName('')
    setNewDesc('')
    setNameError('')
    toast.success(`Project "${project.name}" created`)
  }

  function handleToggleStatus(project: Project) {
    const newStatus = project.status === 'active' ? 'archived' : 'active'
    toggleGuard.current = true
    setToggleTarget(null)
    setProjects(prev =>
      prev.map(p => p.id === project.id ? { ...p, status: newStatus as 'active' | 'archived' } : p)
    )
    toast.success(`Project "${project.name}" ${newStatus === 'active' ? 'activated' : 'disabled'}`)
    setTimeout(() => { toggleGuard.current = false }, 500)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Projects"
        subtitle="Group API keys under shared controls — model access, rate limits, and cost ceilings."
      >
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          New Project
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Projects" value={String(activeProjects.length)} description="Currently active" />
        <StatCard label="Total API Keys" value={String(totalKeys)} description="Across all projects" />
        <StatCard label="Monthly Spend" value={`$${totalSpend.toFixed(2)}`} description="Current billing cycle" />
        <StatCard label="Avg RPM Limit" value={String(Math.round(activeProjects.reduce((s, p) => s + p.rpmLimit, 0) / (activeProjects.length || 1)))} description="Requests per minute" />
      </div>

      {/* Project List */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider',
                      header.id === 'active' && 'text-center',
                    )}
                    style={header.column.columnDef.size ? { width: header.column.columnDef.size } : undefined}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon column={header.column} />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                className={cn(
                  'cursor-pointer',
                  row.original.status === 'archived' && 'opacity-50'
                )}
                onClick={() => navigate(`/projects/${row.original.id}`)}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Project Name</label>
              <Input
                placeholder="e.g. Production App"
                value={newName}
                onChange={e => { setNewName(e.target.value); setNameError('') }}
                autoFocus
              />
              {nameError && <p className="text-xs text-destructive mt-1">{nameError}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input
                placeholder="What is this project for?"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">You can configure model allowlist, rate limits, and cost ceilings in project settings after creation.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog open={!!toggleTarget} onOpenChange={open => { if (!open) setToggleTarget(null) }}>
        <DialogContent className="sm:max-w-md" onCloseAutoFocus={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {toggleTarget?.status === 'active' ? 'Disable Project' : 'Activate Project'}
            </DialogTitle>
            <DialogDescription>
              {toggleTarget?.status === 'active' ? (
                <>
                  Disabling <strong>{toggleTarget?.name}</strong> will immediately revoke authentication for all{' '}
                  <strong>{toggleTarget?.keyCount}</strong> active key{toggleTarget?.keyCount !== 1 ? 's' : ''}. You can re-activate it later.
                </>
              ) : (
                <>
                  Activating <strong>{toggleTarget?.name}</strong> will restore access for all{' '}
                  <strong>{toggleTarget?.keyCount}</strong> key{toggleTarget?.keyCount !== 1 ? 's' : ''} associated with this project.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleTarget(null)}>Cancel</Button>
            {toggleTarget?.status === 'active' ? (
              <Button variant="destructive" onClick={() => toggleTarget && handleToggleStatus(toggleTarget)}>
                Disable Project
              </Button>
            ) : (
              <Button onClick={() => toggleTarget && handleToggleStatus(toggleTarget)}>
                Activate Project
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
