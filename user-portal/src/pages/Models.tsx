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

const PROVIDER_ICONS: Record<string, { path: string; hex: string }> = {
  Anthropic: {
    path: 'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
    hex: '191919',
  },
  OpenAI: {
    path: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
    hex: '412991',
  },
  Meta: {
    path: 'M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z',
    hex: '0467DF',
  },
  Mistral: {
    path: 'M17.143 3.429v3.428h-3.429v3.429h-3.428V6.857H6.857V3.43H3.43v13.714H0v3.428h10.286v-3.428H6.857v-3.429h3.429v3.429h3.429v-3.429h3.428v3.429h-3.428v3.428H24v-3.428h-3.43V3.429z',
    hex: 'FA520F',
  },
  Google: {
    path: 'M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81',
    hex: '8E75B2',
  },
  Microsoft: {
    path: 'M0 0h11.5v11.5H0V0zm12.5 0H24v11.5H12.5V0zM0 12.5h11.5V24H0V12.5zm12.5 0H24V24H12.5V12.5z',
    hex: '0078D4',
  },
  DeepSeek: {
    path: 'M23.748 9.614c-.136-.054-.274-.102-.414-.143a7.895 7.895 0 0 0-.24-2.123c-.502-1.97-1.696-3.234-3.347-3.511-.882-.15-1.795.012-2.813.497a9.483 9.483 0 0 0-.584.31c-.638-.29-1.312-.484-2.001-.576C12.66 2.87 11.008 3.5 9.748 4.876c-.553.598-.968 1.333-1.272 2.06-.144-.019-.29-.033-.437-.042-1.655-.1-3.044.504-3.904 1.697-.777 1.079-1.016 2.506-.683 4.05.044.203.098.408.162.614a7.61 7.61 0 0 0-.618.7c-1.021 1.33-1.39 2.842-1.04 4.26.38 1.537 1.504 2.714 3.125 3.234.6.19 1.24.276 1.902.254a7.62 7.62 0 0 0 .739-.065c.441.552.975 1.02 1.579 1.38 1.27.753 2.773.96 4.234.58.658-.174 1.27-.49 1.822-.935.333.064.67.1 1.007.108 1.668.036 3.109-.559 4.061-1.677.9-1.057 1.244-2.49 1.007-4.09a7.494 7.494 0 0 0-.222-.994 7.5 7.5 0 0 0 .594-.647c.982-1.232 1.41-2.7 1.185-4.087a4.728 4.728 0 0 0-.661-1.663z',
    hex: '4D6BFE',
  },
}

const PROVIDER_FALLBACKS: Record<string, { bg: string; initials: string }> = {
  Cohere: { bg: '#39594F', initials: 'CO' },
  Qwen:   { bg: '#6366F1', initials: 'QW' },
}

function ProviderIcon({ provider, size = 14 }: { provider: string; size?: number }) {
  const icon = PROVIDER_ICONS[provider]
  const padding = Math.round(size * 0.3)
  const boxSize = size + padding * 2

  if (icon) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded bg-white"
        style={{ width: boxSize, height: boxSize, padding }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" width={size} height={size} fill={`#${icon.hex}`}>
          <path d={icon.path} />
        </svg>
      </span>
    )
  }

  const fallback = PROVIDER_FALLBACKS[provider] ?? { bg: '#6B7280', initials: provider.slice(0, 2).toUpperCase() }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded font-bold text-white"
      style={{ width: boxSize, height: boxSize, backgroundColor: fallback.bg, fontSize: Math.round(size * 0.5) }}
      aria-hidden
    >
      {fallback.initials}
    </span>
  )
}

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
      <SheetContent className="w-full max-w-[90vw] sm:w-[480px] sm:max-w-[520px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {model.provider}
          </div>
          <SheetTitle className="text-lg">{model.name}</SheetTitle>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {model.capabilities.map(c => (
              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
            ))}
            <Badge className={cn('text-xs border', SPEED_STYLE[model.speed])}>{model.speed}</Badge>
          </div>
        </SheetHeader>

        <div className="py-4 space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{model.description}</p>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pricing</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Context', value: model.contextWindow },
                { label: 'Input /1M tokens', value: model.inputCost },
                { label: 'Output /1M tokens', value: model.outputCost },
              ].map(item => (
                <div key={item.label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-base font-mono font-semibold text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Benchmarks</div>
            <div className="space-y-2.5">
              {[
                { label: 'MMLU', value: model.mmlu },
                { label: 'HumanEval', value: model.humanEval },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground w-20">{b.label}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                  </div>
                  <div className="text-xs font-mono font-semibold text-foreground w-8 text-right">{b.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Use Cases</div>
            <div className="flex flex-wrap gap-1.5">
              {model.useCases.map(uc => (
                <Badge key={uc} variant="outline" className="text-xs">{uc}</Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quickstart</div>
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

          <div className="flex gap-2 pt-2">
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
