import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Archive, Key, Trash2, RotateCcw, Copy,
  AlertTriangle, ChevronRight, ChevronDown, Save, FolderOpen, Plus,
  DollarSign, Gauge,
} from 'lucide-react'
import { toast } from 'sonner'
import { Highlight, themes } from 'prism-react-renderer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { PROJECTS, API_KEYS, MODELS, type Project, type ApiKey } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const KEY_STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  revoked: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  rotating: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
}

const PROJECT_STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  archived: 'bg-neutral-500/10 text-neutral-500 dark:text-neutral-400 border-neutral-500/20',
}

function QuickstartCode({ keyMasked }: { keyMasked: string }) {
  const [lang, setLang] = useState('Python')

  const snippets: Record<string, { code: string; language: string }> = {
    Python: {
      language: 'python',
      code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.aigateway.infinia.ai/v1",
    api_key="${keyMasked}",  # or os.environ["AIGATEWAY_API_KEY"]
)

response = client.chat.completions.create(
    model="claude-haiku-4-5",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    },
    'Node.js': {
      language: 'javascript',
      code: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.aigateway.infinia.ai/v1',
  apiKey: '${keyMasked}',
});

const response = await client.chat.completions.create({
  model: 'claude-haiku-4-5',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);`,
    },
    cURL: {
      language: 'bash',
      code: `curl https://api.aigateway.infinia.ai/v1/chat/completions \\
  -H "Authorization: Bearer ${keyMasked}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-haiku-4-5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
    },
    'OpenAI SDK': {
      language: 'python',
      code: `# Drop-in replacement for OpenAI SDK
import openai

openai.api_base = "https://api.aigateway.infinia.ai/v1"
openai.api_key = "${keyMasked}"

response = openai.ChatCompletion.create(
    model="claude-haiku-4-5",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    },
  }

  return (
    <Tabs value={lang} onValueChange={setLang}>
      <TabsList className="h-8">
        {Object.keys(snippets).map(l => (
          <TabsTrigger key={l} value={l} className="text-xs px-3">{l}</TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(snippets).map(([l, { code, language }]) => (
        <TabsContent key={l} value={l} className="mt-2">
          <Highlight theme={themes.oneDark} code={code} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={cn('rounded text-xs leading-relaxed overflow-x-auto p-3', className)} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | undefined>(
    () => PROJECTS.find(p => p.id === id)
  )
  const [keys, setKeys] = useState<ApiKey[]>(
    () => API_KEYS.filter(k => k.projectId === id)
  )
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [revokeKey, setRevokeKey] = useState<ApiKey | null>(null)
  const [rotateKey, setRotateKey] = useState<ApiKey | null>(null)
  const [toggleKey, setToggleKey] = useState<ApiKey | null>(null)
  const keyToggleGuard = useRef(false)

  // Quickstart collapsible
  const [quickstartOpen, setQuickstartOpen] = useState(false)

  // Create key state
  const [createOpen, setCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyExpiry, setNewKeyExpiry] = useState('never')
  const [nameError, setNameError] = useState('')
  const [createdKeyFull, setCreatedKeyFull] = useState<string | null>(null)
  const [createdKeyCopied, setCreatedKeyCopied] = useState(false)

  // Settings form state
  const [rpmLimit, setRpmLimit] = useState(String(project?.rpmLimit ?? 60))
  const [dailyCap, setDailyCap] = useState(project?.dailyCap != null ? String(project.dailyCap) : '')
  const [monthlyCap, setMonthlyCap] = useState(project?.monthlyCap != null ? String(project.monthlyCap) : '')
  const [allowlist, setAllowlist] = useState<string[]>(project?.modelAllowlist ?? [])

  if (!project) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Project not found.</p>
        <Button variant="outline" onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    )
  }

  function handleCreateKey() {
    if (!newKeyName.trim()) {
      setNameError('Key name is required')
      return
    }
    setNameError('')
    const expiryMap: Record<string, string | null> = {
      '30d': 'Apr 29, 2026',
      '90d': 'Jun 28, 2026',
      '1y': 'Mar 30, 2027',
      never: null,
    }
    const suffix = Array.from({ length: 20 }, () => Math.random().toString(36)[2]).join('')
    const fullKey = `tf-sk_live_${suffix}`
    const masked = `tf-sk_l...${suffix.slice(-4)}`
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      masked,
      project: project!.name,
      projectId: project!.id,
      labels: [],
      lastUsed: 'Never',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'active',
      requests7d: 0,
      expiresAt: expiryMap[newKeyExpiry] ?? null,
    }
    setKeys(prev => [newKey, ...prev])
    setCreatedKeyFull(fullKey)
    setCreatedKeyCopied(false)
  }

  function closeCreateDialog() {
    setCreateOpen(false)
    setCreatedKeyFull(null)
    setCreatedKeyCopied(false)
    setNewKeyName('')
    setNewKeyExpiry('never')
    setNameError('')
  }

  function copyCreatedKey() {
    if (createdKeyFull) {
      navigator.clipboard.writeText(createdKeyFull)
      setCreatedKeyCopied(true)
      toast.success('Key copied to clipboard')
    }
  }

  function handleRevoke(key: ApiKey) {
    setKeys(prev => prev.map(k => k.id === key.id ? { ...k, status: 'revoked' as const } : k))
    setRevokeKey(null)
    toast.success(`Key "${key.name}" revoked`)
  }

  function handleToggleKey(key: ApiKey) {
    const newStatus = key.status === 'active' ? 'revoked' : 'active'
    keyToggleGuard.current = true
    setToggleKey(null)
    setKeys(prev => prev.map(k => k.id === key.id ? { ...k, status: newStatus as 'active' | 'revoked' } : k))
    toast.success(`Key "${key.name}" ${newStatus === 'active' ? 'activated' : 'disabled'}`)
    setTimeout(() => { keyToggleGuard.current = false }, 500)
  }

  function handleRotate(key: ApiKey) {
    setKeys(prev => prev.map(k =>
      k.id === key.id
        ? {
            ...k,
            status: 'rotating' as const,
            rotatingExpiresIn: '24h',
            masked: `tf-sk_l...${Math.random().toString(36).slice(2, 6)}`,
          }
        : k
    ))
    setRotateKey(null)
    toast.success(`Key "${key.name}" rotation started — 24h grace period`)
  }

  // Countdown timer for rotating keys
  useEffect(() => {
    const hasRotating = keys.some(k => k.status === 'rotating')
    if (!hasRotating) return

    const interval = setInterval(() => {
      setKeys(prev => prev.map(k => {
        if (k.status !== 'rotating' || !k.rotatingExpiresIn) return k

        const match = k.rotatingExpiresIn.match(/^(?:(\d+)h)?(?:\s*(\d+)m)?$/)
        if (!match) return k

        let totalMinutes = (parseInt(match[1] || '0', 10) * 60) + parseInt(match[2] || '0', 10)
        totalMinutes -= 1

        if (totalMinutes <= 0) {
          toast.success(`Key "${k.name}" rotation complete`)
          return { ...k, status: 'active' as const, rotatingExpiresIn: undefined }
        }

        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        const remaining = hours > 0
          ? minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
          : `${minutes}m`

        return { ...k, rotatingExpiresIn: remaining }
      }))
    }, 60_000)

    return () => clearInterval(interval)
  }, [keys])

  function handleArchive() {
    setProject(prev => prev ? { ...prev, status: 'archived' as const } : prev)
    setArchiveOpen(false)
    toast.success(`Project "${project!.name}" archived`)
  }

  function handleSaveSettings() {
    setProject(prev => {
      if (!prev) return prev
      return {
        ...prev,
        rpmLimit: parseInt(rpmLimit) || 60,
        dailyCap: dailyCap ? parseInt(dailyCap) : undefined,
        monthlyCap: monthlyCap ? parseInt(monthlyCap) : undefined,
        modelAllowlist: allowlist,
      }
    })
    toast.success('Project settings saved')
  }

  function toggleModel(modelId: string) {
    setAllowlist(prev =>
      prev.includes(modelId) ? prev.filter(m => m !== modelId) : [...prev, modelId]
    )
  }

  const activeKeys = keys.filter(k => k.status === 'active').length
  const defaultKey = keys.find(k => k.status === 'active') ?? keys[0]

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{project.name}</span>
      </nav>

      {/* Header */}
      <PageHeader
        title={project.name}
        subtitle={project.description || `Created ${project.createdAt}`}
      >
        <Badge variant="outline" className={cn('text-[11px]', PROJECT_STATUS_STYLES[project.status])}>
          {project.status}
        </Badge>
        {project.status === 'active' && (
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setArchiveOpen(true)}>
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
        )}
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Keys"
          value={String(activeKeys)}
          description={`${keys.length} total key${keys.length !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Monthly Spend"
          value={project.monthlySpend}
          description="Current billing cycle"
        />
        <StatCard
          label="RPM Limit"
          value={String(project.rpmLimit)}
          description="Requests per minute"
        />
        <StatCard
          label="Daily Cap"
          value={project.dailyCap != null ? `$${project.dailyCap}` : 'No limit'}
          description={project.dailyCap != null ? 'Resets at 00:00 UTC' : 'No spending cap set'}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="keys" className="w-full">
        <TabsList>
          <TabsTrigger value="keys">Keys</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ── Keys Tab ── */}
        <TabsContent value="keys" className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {keys.length === 0
                ? 'No API keys in this project yet.'
                : `${keys.length} key${keys.length !== 1 ? 's' : ''} \u00b7 ${activeKeys} active`
              }
            </p>
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Create Key
            </Button>
          </div>

          {keys.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Key className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  No API keys yet. Create one to start making API calls.
                </p>
                <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Create Key
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="rounded-lg border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider w-12">#</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Name</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Requests (7d)</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Last Used</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Expires</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-center">Active</TableHead>
                      <TableHead className="w-28" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key, index) => (
                      <TableRow key={key.id} className={cn(key.status === 'revoked' ? 'opacity-50' : '')}>
                        <TableCell className="text-sm font-mono text-muted-foreground">{index + 1}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{key.name}</div>
                          <code className="text-xs font-mono text-muted-foreground mt-0.5 block">{key.masked}</code>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-foreground">
                          {key.requests7d.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{key.lastUsed}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {key.expiresAt ?? <span className="text-muted-foreground/60">Never</span>}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs border', KEY_STATUS_STYLES[key.status])}>
                            {key.status}
                          </Badge>
                          {key.status === 'rotating' && (
                            <div className="text-xs text-amber-500 mt-0.5">{key.rotatingExpiresIn} left</div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={key.status === 'active'}
                            aria-label={`Toggle ${key.name} status`}
                            disabled={key.status === 'rotating'}
                            className={cn(
                              'relative inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                              key.status === 'active' ? 'bg-primary' : 'bg-input dark:bg-input/80',
                              key.status === 'rotating' && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={() => { if (!keyToggleGuard.current) setToggleKey(key) }}
                          >
                            <span
                              className={cn(
                                'pointer-events-none block h-4 w-4 rounded-full bg-background transition-transform dark:bg-foreground',
                                key.status === 'active' ? 'translate-x-[14px]' : 'translate-x-0'
                              )}
                            />
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {key.status === 'rotating' ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-500" aria-label="Key is rotating">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Rotating — {key.rotatingExpiresIn} left</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={key.status === 'revoked'} aria-label="Rotate key" onClick={() => setRotateKey(key)}>
                                    <RotateCcw className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Rotate key</TooltipContent>
                              </Tooltip>
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setRevokeKey(key)} disabled={key.status === 'revoked'} aria-label="Revoke key">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Revoke key</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Quickstart */}
              {defaultKey && (
                <Collapsible open={quickstartOpen} onOpenChange={setQuickstartOpen}>
                  <div className="rounded-lg border border-border bg-card">
                    <CollapsibleTrigger asChild>
                      <button className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-lg">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quickstart</span>
                        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', quickstartOpen && 'rotate-180')} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <QuickstartCode keyMasked={defaultKey.masked} />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )}
            </>
          )}
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings" className="flex flex-col gap-6 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Rate Limits & Cost Ceilings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                    RPM Limit
                  </label>
                  <Input type="number" min={1} value={rpmLimit} onChange={e => setRpmLimit(e.target.value)} placeholder="60" />
                  <p className="text-xs text-muted-foreground mt-1">Aggregate requests/min across all keys</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Daily Cap (USD)
                  </label>
                  <Input type="number" min={0} value={dailyCap} onChange={e => setDailyCap(e.target.value)} placeholder="No limit" />
                  <p className="text-xs text-muted-foreground mt-1">Resets at 00:00 UTC daily</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Monthly Cap (USD)
                  </label>
                  <Input type="number" min={0} value={monthlyCap} onChange={e => setMonthlyCap(e.target.value)} placeholder="No limit" />
                  <p className="text-xs text-muted-foreground mt-1">Resets 1st of each month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Model Allowlist</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Select which models are accessible to keys in this project. Leave empty to allow all models.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {MODELS.map(model => {
                  const selected = allowlist.includes(model.id)
                  return (
                    <button
                      key={model.id}
                      onClick={() => toggleModel(model.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                        selected
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-foreground/20 text-muted-foreground'
                      )}
                    >
                      <div className={cn(
                        'h-4 w-4 rounded border flex items-center justify-center shrink-0',
                        selected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                      )}>
                        {selected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-foreground">{model.name}</span>
                        <span className="text-xs text-muted-foreground ml-1.5">{model.provider}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              {allowlist.length === 0 && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" />
                  No models selected — all models will be allowed.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="gap-1.5" onClick={handleSaveSettings}>
              <Save className="h-3.5 w-3.5" />
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Key Dialog */}
      <Dialog open={createOpen} onOpenChange={open => { if (!open) closeCreateDialog() }}>
        <DialogContent className="sm:max-w-md" onInteractOutside={e => { if (createdKeyFull) e.preventDefault() }}>
          {createdKeyFull ? (
            <>
              <DialogHeader>
                <DialogTitle>Key Created</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Copy your API key now. You won't be able to see it again.
                </p>
                <div className="relative">
                  <code className="block w-full rounded-md border border-border bg-muted/50 px-3 py-3 pr-20 text-sm font-mono text-foreground break-all select-all">
                    {createdKeyFull}
                  </code>
                  <Button
                    size="sm"
                    variant={createdKeyCopied ? 'outline' : 'default'}
                    className="absolute right-1.5 top-1.5 h-7 gap-1 text-xs"
                    onClick={copyCreatedKey}
                  >
                    <Copy className="h-3 w-3" />
                    {createdKeyCopied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <div className="rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 text-xs text-amber-600 dark:text-amber-400">
                  This key will not be shown again. Store it securely before closing this dialog.
                </div>
              </div>
              <DialogFooter>
                <Button onClick={closeCreateDialog}>Done</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Key Name</label>
                  <Input
                    value={newKeyName}
                    onChange={e => { setNewKeyName(e.target.value); if (nameError) setNameError('') }}
                    placeholder="e.g. prod-key-02"
                    onKeyDown={e => e.key === 'Enter' && handleCreateKey()}
                    aria-invalid={!!nameError}
                    className={cn(nameError && 'border-destructive focus-visible:ring-destructive')}
                    autoFocus
                  />
                  {nameError && <p className="text-xs text-destructive mt-1">{nameError}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Expiration</label>
                  <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[70]">
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="90d">90 days</SelectItem>
                      <SelectItem value="1y">1 year</SelectItem>
                      <SelectItem value="never">No expiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeCreateDialog}>Cancel</Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>Create Key</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive Project</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Archiving <strong>{project.name}</strong> will immediately revoke authentication for all{' '}
            <strong>{activeKeys}</strong> active key{activeKeys !== 1 ? 's' : ''}. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleArchive}>Archive Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Key Status Dialog */}
      <Dialog open={!!toggleKey} onOpenChange={open => { if (!open) setToggleKey(null) }}>
        <DialogContent className="sm:max-w-md" onCloseAutoFocus={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {toggleKey?.status === 'active' ? 'Disable API Key' : 'Activate API Key'}
            </DialogTitle>
            <DialogDescription>
              {toggleKey?.status === 'active' ? (
                <>
                  Disabling <strong>{toggleKey?.name}</strong> will immediately stop all API calls using this key. You can re-activate it later.
                </>
              ) : (
                <>
                  Activating <strong>{toggleKey?.name}</strong> will restore API access for this key.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleKey(null)}>Cancel</Button>
            {toggleKey?.status === 'active' ? (
              <Button variant="destructive" onClick={() => toggleKey && handleToggleKey(toggleKey)}>
                Disable Key
              </Button>
            ) : (
              <Button onClick={() => toggleKey && handleToggleKey(toggleKey)}>
                Activate Key
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Key Dialog */}
      <Dialog open={!!revokeKey} onOpenChange={() => setRevokeKey(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to revoke <strong>{revokeKey?.name}</strong>? This key will immediately stop authenticating and cannot be reactivated.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeKey(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => revokeKey && handleRevoke(revokeKey)}>Revoke Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rotate Key Dialog */}
      <Dialog open={!!rotateKey} onOpenChange={() => setRotateKey(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <RotateCcw className="h-4 w-4" /> Rotate Key
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-1">
            A new key will replace <strong className="text-foreground">"{rotateKey?.name}"</strong>. The current key stays valid for a <strong className="text-foreground">24-hour grace period</strong> so you can migrate without downtime.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRotateKey(null)}>Cancel</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => rotateKey && handleRotate(rotateKey)}>Rotate Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
