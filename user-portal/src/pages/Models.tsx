import { useState, useDeferredValue } from 'react'
import { Search, ExternalLink, Zap, LayoutGrid, List, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { MODELS, type Model } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/PageHeader'
import { ProviderIcon } from '@/components/ProviderIcon'
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

const PROVIDERS = ['All', 'Anthropic', 'OpenAI', 'Meta', 'Mistral', 'Google', 'DeepSeek', 'Microsoft', 'Cohere', 'Qwen']
const CAPABILITIES = ['All', 'Chat', 'Code', 'Vision', 'Reasoning']
const SPEEDS = ['All', 'Fast', 'Balanced', 'Quality']
const LICENSES = ['All', 'Proprietary', 'Open Source']
const SIZES = ['All', 'Small', 'Medium', 'Large']


const SPEED_STYLE: Record<string, string> = {
  Fast: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900',
  Balanced: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
  Quality: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900',
}

type SortKey = 'name' | 'contextWindowRaw' | 'inputCostRaw'
type SortDir = 'asc' | 'desc'

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'px-3 py-1 text-xs font-medium rounded-full transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      {children}
    </button>
  )
}

function CodeSnippet({ model, lang }: { model: Model; lang: string }) {
  const snippets: Record<string, { code: string; language: string }> = {
    Python: {
      language: 'python',
      code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.aigateway.infinia.ai/v1",
    api_key="tf-sk_l...a4f2",
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    },
    'Node.js': {
      language: 'javascript',
      code: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.aigateway.infinia.ai/v1',
  apiKey: 'tf-sk_l...a4f2',
});

const response = await client.chat.completions.create({
  model: '${model.id}',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);`,
    },
    cURL: {
      language: 'bash',
      code: `curl https://api.aigateway.infinia.ai/v1/chat/completions \\
  -H "Authorization: Bearer tf-sk_l...a4f2" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model.id}",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
    },
  }

  const s = snippets[lang]
  if (!s) return null

  return (
    <Highlight theme={themes.oneDark} code={s.code} language={s.language}>
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
  )
}

function ModelCard({ model, onClick }: { model: Model; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer gap-3 hover:ring-foreground/20 transition-all duration-150"
    >
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-1.5">
          <ProviderIcon provider={model.provider} size={13} />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {model.provider}
          </span>
        </div>
        <CardTitle>{model.name}</CardTitle>
        <CardAction>
          <Badge className={cn('text-xs border', SPEED_STYLE[model.speed])}>
            {model.speed}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {model.capabilities.map(c => (
            <Badge key={c} variant="secondary" className="text-xs px-1.5 py-0 h-5">
              {c}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 font-normal">
            {model.license}
          </Badge>
          {model.paramCount !== '—' && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 font-normal">
              {model.paramCount}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-3 gap-2 border-t bg-muted/30 py-3">
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">Context</div>
          <div className="text-sm font-mono font-semibold">{model.contextWindow}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">Input /1M</div>
          <div className="text-sm font-mono font-semibold">{model.inputCost}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">Output /1M</div>
          <div className="text-sm font-mono font-semibold">{model.outputCost}</div>
        </div>
      </CardFooter>
    </Card>
  )
}

function ModelDetailSheet({
  model,
  open,
  onClose,
}: {
  model: Model | null
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [codeTab, setCodeTab] = useState('Python')

  if (!model) return null

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent className="w-full max-w-[90vw] sm:w-[480px] sm:max-w-[520px] overflow-y-auto pb-24 p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-popover border-b border-border px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <ProviderIcon provider={model.provider} size={16} />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {model.provider}
            </span>
            <Badge className={cn('text-xs border ml-auto', SPEED_STYLE[model.speed])}>{model.speed}</Badge>
          </div>
          <SheetTitle className="text-lg mb-2">{model.name}</SheetTitle>
          <div className="flex flex-wrap gap-1.5">
            {model.capabilities.map(c => (
              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{model.description}</p>

          {/* Pricing */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-3.5 py-2 bg-muted/40 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pricing</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              {[
                { label: 'Context', value: model.contextWindow },
                { label: 'Input /1M', value: model.inputCost },
                { label: 'Output /1M', value: model.outputCost },
              ].map(item => (
                <div key={item.label} className="p-3.5 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-sm font-mono font-semibold text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmarks */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-3.5 py-2 bg-muted/40 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Benchmarks</span>
            </div>
            <div className="p-3.5 space-y-3">
              {[
                { label: 'MMLU', value: model.mmlu },
                { label: 'HumanEval', value: model.humanEval },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="text-xs font-medium text-muted-foreground w-20">{b.label}</div>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${b.value}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono font-semibold text-foreground w-10 text-right">{b.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-3.5 py-2 bg-muted/40 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Use Cases</span>
            </div>
            <div className="p-3.5 flex flex-wrap gap-1.5">
              {model.useCases.map(uc => (
                <Badge key={uc} variant="outline" className="text-xs">{uc}</Badge>
              ))}
            </div>
          </div>

          {/* Quickstart */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-3.5 py-2 bg-muted/40 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quickstart</span>
            </div>
            <div className="p-3.5">
              <Tabs value={codeTab} onValueChange={setCodeTab}>
                <TabsList className="h-8">
                  {['Python', 'Node.js', 'cURL'].map(l => (
                    <TabsTrigger key={l} value={l} className="text-xs px-3">{l}</TabsTrigger>
                  ))}
                </TabsList>
                {['Python', 'Node.js', 'cURL'].map(l => (
                  <TabsContent key={l} value={l} className="mt-2">
                    <CodeSnippet model={model} lang={l} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 gap-2"
              onClick={() => { onClose(); navigate(`/playground?model=${model.id}`) }}
            >
              <Zap className="h-3.5 w-3.5" />
              Try in Playground
            </Button>
            <Button variant="outline" size="icon" aria-label="View model documentation">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Models() {
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('All')
  const [capability, setCapability] = useState('All')
  const [speed, setSpeed] = useState('All')
  const [license, setLicense] = useState('All')
  const [size, setSize] = useState('All')
  const [selected, setSelected] = useState<Model | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filterOpen, setFilterOpen] = useState(false)
  const deferredSearch = useDeferredValue(search)

  const clearAll = () => { setProvider('All'); setCapability('All'); setSpeed('All'); setLicense('All'); setSize('All') }

  const activeChips = [
    provider !== 'All' && { label: provider, clear: () => setProvider('All') },
    speed !== 'All' && { label: speed, clear: () => setSpeed('All') },
    capability !== 'All' && { label: capability, clear: () => setCapability('All') },
    license !== 'All' && { label: license, clear: () => setLicense('All') },
    size !== 'All' && { label: `${size} models`, clear: () => setSize('All') },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  const filtered = MODELS.filter(m => {
    if (deferredSearch && !m.name.toLowerCase().includes(deferredSearch.toLowerCase()) && !m.provider.toLowerCase().includes(deferredSearch.toLowerCase())) return false
    if (provider !== 'All' && m.provider !== provider) return false
    if (capability !== 'All' && !m.capabilities.includes(capability)) return false
    if (speed !== 'All' && m.speed !== speed) return false
    if (license !== 'All') {
      const isOpen = m.license !== 'Proprietary'
      if (license === 'Open Source' && !isOpen) return false
      if (license === 'Proprietary' && isOpen) return false
    }
    if (size !== 'All') {
      if (m.paramCountRaw === 0) return false
      if (size === 'Small' && m.paramCountRaw >= 10) return false
      if (size === 'Medium' && (m.paramCountRaw < 10 || m.paramCountRaw > 70)) return false
      if (size === 'Large' && m.paramCountRaw <= 70) return false
    }
    return true
  }).sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1
    if (sortKey === 'name') return mul * a.name.localeCompare(b.name)
    if (sortKey === 'contextWindowRaw') return mul * (a.contextWindowRaw - b.contextWindowRaw)
    if (sortKey === 'inputCostRaw') return mul * (a.inputCostRaw - b.inputCostRaw)
    return 0
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIndicator = ({ k }: { k: SortKey }) =>
    sortKey === k ? <span className="ml-1 opacity-60">{sortDir === 'asc' ? '↑' : '↓'}</span> : null

  const ariaSortFor = (k: SortKey): 'ascending' | 'descending' | 'none' =>
    sortKey === k ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader title="Models" subtitle={`${MODELS.length} models across ${new Set(MODELS.map(m => m.provider)).size} providers`}>
        <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
          <button onClick={() => setViewMode('grid')} aria-label="Grid view" className={cn('p-1.5 rounded transition-colors', viewMode === 'grid' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} aria-label="List view" className={cn('p-1.5 rounded transition-colors', viewMode === 'list' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </PageHeader>

      {/* Filter drawer */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col gap-0">
          <SheetHeader className="px-5 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
              {activeChips.length > 0 && (
                <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Reset all
                </button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {/* Provider */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Provider</p>
              <div className="grid grid-cols-2 gap-1.5">
                {PROVIDERS.map(p => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left',
                      provider === p
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {p !== 'All' && <ProviderIcon provider={p} size={12} />}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Speed</p>
              <div className="flex flex-wrap gap-1.5">
                {SPEEDS.map(s => (
                  <FilterButton key={s} active={speed === s} onClick={() => setSpeed(s)}>{s}</FilterButton>
                ))}
              </div>
            </div>

            {/* Capability */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Capability</p>
              <div className="flex flex-wrap gap-1.5">
                {CAPABILITIES.map(c => (
                  <FilterButton key={c} active={capability === c} onClick={() => setCapability(c)}>{c}</FilterButton>
                ))}
              </div>
            </div>

            {/* License */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">License</p>
              <div className="flex flex-wrap gap-1.5">
                {LICENSES.map(l => (
                  <FilterButton key={l} active={license === l} onClick={() => setLicense(l)}>{l}</FilterButton>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Model Size</p>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map(s => (
                  <FilterButton key={s} active={size === s} onClick={() => setSize(s)}>{s}</FilterButton>
                ))}
              </div>
              {size !== 'All' && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {size === 'Small' ? '< 10B params' : size === 'Medium' ? '10B – 70B params' : '> 70B params'}
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
            aria-label="Search models"
          />
        </div>
        <Button
          variant={activeChips.length > 0 ? 'default' : 'outline'}
          size="sm"
          className="h-9 gap-2 px-4"
          onClick={() => setFilterOpen(true)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeChips.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] text-primary font-bold">
              {activeChips.length}
            </span>
          )}
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} {filtered.length === 1 ? 'model' : 'models'}
        </span>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-2">
          {activeChips.map(chip => (
            <button
              key={chip.label}
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground hover:bg-muted/70 transition-colors"
            >
              {chip.label}
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}


      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(model => (
            <ModelCard key={model.id} model={model} onClick={() => setSelected(model)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-16 flex flex-col items-center gap-3 text-muted-foreground">
              <SearchX className="h-8 w-8 opacity-40" />
              <div className="text-sm">No models match your filters.</div>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setProvider('All'); setCapability('All'); setSpeed('All'); setSearch(''); setLicense('All'); setSize('All') }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead
                  className="text-xs font-semibold uppercase tracking-wider cursor-pointer select-none w-[260px]"
                  onClick={() => toggleSort('name')}
                  aria-sort={ariaSortFor('name')}
                >
                  Model <SortIndicator k="name" />
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Provider</TableHead>
                <TableHead
                  className="text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => toggleSort('contextWindowRaw')}
                  aria-sort={ariaSortFor('contextWindowRaw')}
                >
                  Context <SortIndicator k="contextWindowRaw" />
                </TableHead>
                <TableHead
                  className="text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => toggleSort('inputCostRaw')}
                  aria-sort={ariaSortFor('inputCostRaw')}
                >
                  Input /1M <SortIndicator k="inputCostRaw" />
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Output /1M</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Speed</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Params</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Capabilities</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(model => (
                <TableRow
                  key={model.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(model)}
                >
                  <TableCell className="font-medium text-sm text-foreground">{model.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <ProviderIcon provider={model.provider} size={13} />
                      <span className="text-xs text-muted-foreground">{model.provider}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{model.contextWindow}</TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{model.inputCost}</TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{model.outputCost}</TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs border', SPEED_STYLE[model.speed])}>
                      {model.speed}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{model.paramCount}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.slice(0, 3).map(c => (
                        <Badge key={c} variant="secondary" className="text-xs px-1.5 py-0 h-5">{c}</Badge>
                      ))}
                      {model.capabilities.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">+{model.capabilities.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <SearchX className="h-7 w-7 opacity-40" />
                      <span className="text-sm">No models match your filters.</span>
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setProvider('All'); setCapability('All'); setSpeed('All'); setSearch(''); setLicense('All'); setSize('All') }}>
                        Clear filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ModelDetailSheet model={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  )
}
