import { useState } from 'react'
import { Copy, RotateCcw, Trash2, Plus, ChevronRight, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Highlight, themes } from 'prism-react-renderer'
import { API_KEYS, PROJECTS, type ApiKey } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/PageHeader'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  revoked: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  rotating: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
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

export function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>(API_KEYS)
  const [createOpen, setCreateOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [revokeKey, setRevokeKey] = useState<ApiKey | null>(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyProject, setNewKeyProject] = useState('tf-proj_a1b2c3d4')
  const [newKeyExpiry, setNewKeyExpiry] = useState('never')

  const defaultKey = keys.find(k => k.status === 'active') ?? keys[0]

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).catch(() => {})
    toast.success('Copied to clipboard')
  }

  const handleRevoke = (key: ApiKey) => {
    setKeys(prev => prev.map(k => k.id === key.id ? { ...k, status: 'revoked' as const } : k))
    setRevokeKey(null)
    toast.success(`Key "${key.name}" revoked`)
  }

  const [nameError, setNameError] = useState('')

  const handleCreate = () => {
    if (!newKeyName.trim()) {
      setNameError('Key name is required')
      return
    }
    setNameError('')
    const proj = PROJECTS.find(p => p.id === newKeyProject)
    const expiryMap: Record<string, string | null> = {
      '30d': 'Apr 29, 2026',
      '90d': 'Jun 28, 2026',
      '1y': 'Mar 30, 2027',
      never: null,
    }
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      masked: `tf-sk_l...${Math.random().toString(36).slice(2, 6)}`,
      project: proj?.name ?? 'Unknown',
      projectId: newKeyProject,
      labels: [],
      lastUsed: 'Never',
      created: 'Mar 30, 2026',
      status: 'active',
      requests7d: 0,
      expiresAt: expiryMap[newKeyExpiry] ?? null,
    }
    setKeys(prev => [newKey, ...prev])
    setNewKeyName('')
    setCreateOpen(false)
    toast.success(`Key "${newKeyName}" created`)
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-w-0">
      <PageHeader title="API Keys" subtitle="Manage your API keys and projects">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setProjectsOpen(true)}>
          Projects <ChevronRight className="h-3 w-3" />
        </Button>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Create Key
        </Button>
      </PageHeader>

      {/* Hero key card */}
      {defaultKey && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active key</div>
            <Badge className={cn('text-xs border', STATUS_STYLES[defaultKey.status])}>
              {defaultKey.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3 flex-wrap min-w-0">
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-foreground truncate">{defaultKey.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{defaultKey.project}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <code className="text-xs font-mono bg-muted px-2.5 py-1.5 rounded border border-border text-muted-foreground">
                {defaultKey.masked}
              </code>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleCopy(defaultKey.masked)}>
                <Copy className="h-3.5 w-3.5" /> Copy Key
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quickstart */}
      <div className="rounded-lg border border-border p-4 bg-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quickstart</div>
        <QuickstartCode keyMasked={defaultKey?.masked ?? 'tf-sk_l...xxxx'} />
      </div>

      {/* Key table */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Project</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Requests (7d)</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Last Used</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Expires</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map(key => (
              <TableRow key={key.id} className={cn(key.status === 'revoked' ? 'opacity-50' : '')}>
                <TableCell>
                  <div className="text-sm font-medium text-foreground">{key.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <code className="text-xs font-mono text-muted-foreground">{key.masked}</code>
                    {key.labels.slice(0, 2).map(l => (
                      <Badge key={l} variant="secondary" className="text-xs px-1 py-0 h-4">{l}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{key.project}</TableCell>
                <TableCell className="text-sm font-mono text-foreground">
                  {key.requests7d.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{key.lastUsed}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {key.expiresAt ?? <span className="text-muted-foreground/60">Never</span>}
                </TableCell>
                <TableCell>
                  <Badge className={cn('text-xs border', STATUS_STYLES[key.status])}>
                    {key.status}
                  </Badge>
                  {key.status === 'rotating' && (
                    <div className="text-xs text-amber-500 mt-0.5">{key.rotatingExpiresIn} left</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(key.masked)} disabled={key.status === 'revoked'} aria-label="Copy key">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {key.status === 'rotating' ? (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-500" aria-label="Key is rotating">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-7 w-7" disabled={key.status === 'revoked'} aria-label="Rotate key">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setRevokeKey(key)} disabled={key.status === 'revoked'} aria-label="Revoke key">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="key-name" className="text-sm font-medium text-foreground mb-1.5 block">Key Name</label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={e => { setNewKeyName(e.target.value); if (nameError) setNameError('') }}
                placeholder="e.g. prod-key-02"
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                aria-invalid={!!nameError}
                className={cn(nameError && 'border-destructive focus-visible:ring-destructive')}
              />
              {nameError && <p className="text-xs text-destructive mt-1">{nameError}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Project</label>
              <Select value={newKeyProject} onValueChange={setNewKeyProject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECTS.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Expiration</label>
              <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                  <SelectItem value="never">No expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-muted/50 border border-border px-3 py-2.5 text-xs text-muted-foreground">
              The key will be shown once after creation. Copy it immediately — it cannot be recovered.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newKeyName.trim()}>Create Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke confirm */}
      <Dialog open={!!revokeKey} onOpenChange={() => setRevokeKey(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" /> Revoke Key
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-1">
            Revoking <strong className="text-foreground">"{revokeKey?.name}"</strong> will immediately stop all API calls using this key. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeKey(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => revokeKey && handleRevoke(revokeKey)}>Revoke Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Projects sheet */}
      <Sheet open={projectsOpen} onOpenChange={setProjectsOpen}>
        <SheetContent className="w-[400px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Projects</SheetTitle>
          </SheetHeader>
          <div className="space-y-3">
            {PROJECTS.map(proj => (
              <div key={proj.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{proj.name}</div>
                    <div className="text-xs font-mono text-muted-foreground mt-0.5">{proj.id}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">{proj.keyCount} keys</Badge>
                </div>
                {proj.description && (
                  <div className="text-xs text-muted-foreground mb-3">{proj.description}</div>
                )}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RPM Limit</span>
                    <span className="font-mono text-foreground">{proj.rpmLimit} req/min</span>
                  </div>
                  {proj.dailyCap && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Cap</span>
                      <span className="font-mono text-foreground">${proj.dailyCap}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Spend</span>
                    <span className="font-mono font-medium text-foreground">{proj.monthlySpend}</span>
                  </div>
                </div>
                {proj.modelAllowlist.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1.5">Model Allowlist</div>
                    <div className="flex flex-wrap gap-1">
                      {proj.modelAllowlist.map(m => (
                        <Badge key={m} variant="secondary" className="text-xs px-1.5">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
