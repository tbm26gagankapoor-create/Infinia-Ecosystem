import { useState, useMemo, useCallback, useRef, useEffect, createElement, createContext, useContext } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useSearchParams } from 'react-router-dom'
import { SplitSquareHorizontal, Plus, History, SlidersHorizontal, Search, Check, Code, ChevronUp, ChevronDown, Trophy, Clock, DollarSign, Sparkles, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AssistantRuntimeProvider,
  RuntimeAdapterProvider,
  useLocalRuntime,
  useMessage,
  useThread,
  type ChatModelAdapter,
} from '@assistant-ui/react'
import { Thread, AssistantMessage as DefaultAssistantMessage } from '@assistant-ui/react-ui'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { QuickstartCode } from '@/components/QuickstartCode'
import { Separator } from '@/components/ui/separator'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import { MODELS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useModelParameters } from '@/hooks/useModelParameters'
import { ParameterPanel } from '@/components/ParameterPanel'
import { ProviderIcon, PROVIDER_MAP } from '@/components/ProviderIcon'

const MOCK_RESPONSES = [
  "That's a thoughtful question. Based on my analysis:\n\n1. **Key consideration** — Start with the simplest approach that meets your requirements\n2. **Performance** — For high-volume use cases, a smaller, faster model typically reduces costs by 60–80%\n3. **Quality** — For complex reasoning tasks, use a frontier model\n\nThe recommended strategy is to route requests intelligently: fast models for simple tasks, capable models for complex ones.",
  "Here's how you can implement this:\n\n```python\nfrom openai import OpenAI\n\nclient = OpenAI(\n    base_url='https://api.aigateway.infinia.ai/v1',\n    api_key='tf-sk_l...a4f2'\n)\n\nresponse = client.chat.completions.create(\n    model='claude-haiku-4-5',\n    messages=[{'role': 'user', 'content': 'Hello'}]\n)\nprint(response.choices[0].message.content)\n```\n\nThis uses the OpenAI-compatible endpoint. You can also use the native Anthropic SDK format.",
  "AI Gateway supports **9 models** across 6 providers:\n\n| Provider | Models |\n|----------|--------|\n| Anthropic | Claude Sonnet 4.6, Claude Haiku 4.5 |\n| OpenAI | GPT-4o, GPT-4o Mini |\n| Meta | Llama 3.1 70B, Llama 3.1 8B |\n| Mistral | Mixtral 8x22B |\n| Google | Gemini 1.5 Pro |\n| DeepSeek | DeepSeek R1 |\n\nAll accessible via a single unified endpoint with your `tf-` API key.",
]

function createMockAdapter(
  modelIdRef: React.MutableRefObject<string>,
  responseIdxRef: React.MutableRefObject<number>,
  externalAbortRef: React.MutableRefObject<AbortController | null>,
): ChatModelAdapter {
  return {
    async *run({ abortSignal }) {
      const currentModelId = modelIdRef.current
      const text = MOCK_RESPONSES[responseIdxRef.current % MOCK_RESPONSES.length]
      responseIdxRef.current++

      // Create an abort controller for external cancellation
      const ctrl = new AbortController()
      externalAbortRef.current = ctrl

      const isAborted = () => abortSignal.aborted || ctrl.signal.aborted

      let accumulated = ''
      for (const char of text) {
        if (isAborted()) break
        accumulated += char
        yield { content: [{ type: 'text' as const, text: accumulated }] }
        await new Promise(r => setTimeout(r, 12))
      }

      externalAbortRef.current = null

      yield {
        content: [{ type: 'text' as const, text: accumulated }],
        status: { type: 'complete' as const, reason: 'stop' as const },
        metadata: {
          custom: {
            model: MODELS.find(m => m.id === currentModelId)?.name ?? currentModelId,
          },
        },
      }
    },
  }
}

function ModelSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const model = MODELS.find(m => m.id === value) ?? MODELS[0]

  const filtered = useMemo(() => {
    if (!query.trim()) return MODELS
    const q = query.toLowerCase()
    return MODELS.filter(
      m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q),
    )
  }, [query])

  const handleOpen = () => {
    setOpen(true)
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Select model, current: ${model.name}`}
        className="flex items-center gap-2 rounded-lg border border-border bg-card pl-2 pr-2.5 py-1.5 text-foreground hover:bg-accent transition-colors"
      >
        <ProviderIcon provider={model.provider} size={14} />
        <span className="text-xs font-medium whitespace-nowrap">{model.name}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            aria-label="Select a model"
            className="absolute top-full left-0 mt-1.5 z-50 w-80 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search model"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No models found
                </div>
              ) : (
                filtered.map(m => (
                  <button
                    key={m.id}
                    role="option"
                    aria-selected={m.id === value}
                    onClick={() => { onChange(m.id); setOpen(false) }}
                    className={cn(
                      'flex items-center gap-2.5 w-full px-3 py-2 hover:bg-accent/60 transition-colors',
                      m.id === value && 'bg-accent/40',
                    )}
                  >
                    <ProviderIcon provider={m.provider} size={16} />
                    <div className="flex flex-col items-start leading-tight min-w-0 flex-1">
                      <span className="text-[13px] font-medium text-foreground truncate">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground">{m.provider}</span>
                    </div>
                    {m.id === value && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}


function buildAvatarDataUri(provider: string): string | undefined {
  const entry = PROVIDER_MAP[provider]
  if (!entry) return undefined
  const iconSize = 20
  const pad = 6
  const total = iconSize + pad * 2
  const iconMarkup = renderToStaticMarkup(createElement(entry.icon, { size: iconSize, color: entry.fg }))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}">
    <rect width="${total}" height="${total}" rx="8" fill="${entry.bg}"/>
    <g transform="translate(${pad},${pad})">${iconMarkup}</g>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const CurrentModelContext = createContext<string>('claude-haiku-4-5')

/** Resolves model name → provider name */
function modelNameToProvider(modelName: string | undefined): string {
  if (!modelName) return 'AI'
  const m = MODELS.find(mod => mod.name === modelName)
  return m?.provider ?? 'AI'
}

/** Custom AssistantMessage that shows per-message avatar + model-switch divider */
function CustomAssistantMessage() {
  const { messages } = useThread()
  const msg = useMessage()

  const currentModelId = useContext(CurrentModelContext)
  const metaModelName = (msg.metadata as { custom?: { model?: string } })?.custom?.model
  // Fall back to current model name during streaming (before metadata is set)
  const modelName = metaModelName ?? MODELS.find(m => m.id === currentModelId)?.name
  const provider = modelNameToProvider(modelName)
  const avatarSrc = buildAvatarDataUri(provider)

  // Find previous assistant message to detect model switch
  let showDivider = false
  let prevModelName: string | undefined
  const msgIdx = messages.findIndex(m => m.id === msg.id)
  if (msgIdx > 0) {
    // Walk backwards to find the previous assistant message
    for (let i = msgIdx - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        prevModelName = (messages[i].metadata as { custom?: { model?: string } })?.custom?.model
        break
      }
    }
    if (prevModelName && modelName && prevModelName !== modelName) {
      showDivider = true
    }
  }

  return (
    <>
      {showDivider && (
        <div className="flex items-center gap-3 px-4 py-3 mx-auto w-full max-w-2xl">
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            {avatarSrc && (
              <img src={avatarSrc} alt="" className="w-4 h-4 rounded-sm" />
            )}
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              Switched to <span className="font-medium text-foreground">{modelName}</span>
            </span>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}
      <div
        style={{
          '--aui-avatar-bg': PROVIDER_MAP[provider]?.bg ?? '#555',
          '--aui-avatar-fg': PROVIDER_MAP[provider]?.fg ?? '#fff',
          '--aui-avatar-img': avatarSrc ? `url("${avatarSrc}")` : 'none',
        } as React.CSSProperties}
      >
        <DefaultAssistantMessage />
      </div>
    </>
  )
}

function ChatTab({ modelId }: { modelId: string }) {
  const responseIdxRef = useRef(0)
  const modelIdRef = useRef(modelId)
  const externalAbortRef = useRef<AbortController | null>(null)

  // Stable adapter — reads modelId from ref at call time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adapter = useMemo(() => createMockAdapter(modelIdRef, responseIdxRef, externalAbortRef), [])
  const runtime = useLocalRuntime(adapter)

  // Track model changes — cancel any in-flight response
  useEffect(() => {
    if (modelIdRef.current !== modelId) {
      if (externalAbortRef.current) {
        externalAbortRef.current.abort()
        externalAbortRef.current = null
      }
      modelIdRef.current = modelId
    }
  }, [modelId])

  const model = MODELS.find(m => m.id === modelId)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <CurrentModelContext.Provider value={modelId}>
      <div className="h-full flex flex-col overflow-hidden">
        <Thread
          welcome={{
            message: `You're talking to ${model?.name ?? modelId}. Ask anything — this is a live mockup with simulated streaming.`,
            suggestions: [
              { prompt: 'What models does AI Gateway support?' },
              { prompt: 'Show me a Python code example' },
              { prompt: 'How does pricing work?' },
            ],
          }}
          components={{
            AssistantMessage: CustomAssistantMessage,
          }}
        />
      </div>
      </CurrentModelContext.Provider>
    </AssistantRuntimeProvider>
  )
}

const SPEED_STYLE: Record<string, string> = {
  Fast: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Balanced: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Quality: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
}
const SPEED_RANK: Record<string, number> = { Fast: 3, Balanced: 2, Quality: 1 }

function ModelVsPanel({ modelAId, modelBId }: { modelAId: string; modelBId: string }) {
  const [open, setOpen] = useState(true)
  const mA = MODELS.find(m => m.id === modelAId)
  const mB = MODELS.find(m => m.id === modelBId)
  if (!mA || !mB) return null

  const better = (a: number, b: number, lowerIsBetter = false) =>
    a === b ? ('tie' as const) : (lowerIsBetter ? a < b : a > b) ? ('a' as const) : ('b' as const)

  type Row = { label: string; a: React.ReactNode; b: React.ReactNode; winner?: 'a' | 'b' | 'tie' }
  const rows: Row[] = [
    {
      label: 'Provider',
      a: <span className="flex items-center gap-1.5 justify-end"><ProviderIcon provider={mA.provider} size={14} /> {mA.provider}</span>,
      b: <span className="flex items-center gap-1.5"><ProviderIcon provider={mB.provider} size={14} /> {mB.provider}</span>,
    },
    {
      label: 'Context',
      a: mA.contextWindow,
      b: mB.contextWindow,
      winner: better(mA.contextWindowRaw, mB.contextWindowRaw),
    },
    {
      label: 'Input /1M',
      a: mA.inputCost,
      b: mB.inputCost,
      winner: better(mA.inputCostRaw, mB.inputCostRaw, true),
    },
    {
      label: 'Output /1M',
      a: mA.outputCost,
      b: mB.outputCost,
      winner: better(parseFloat(mA.outputCost.replace('$', '')), parseFloat(mB.outputCost.replace('$', '')), true),
    },
    {
      label: 'Speed',
      a: <span className="flex justify-end"><Badge variant="outline" className={cn('text-[10px] h-5', SPEED_STYLE[mA.speed])}>{mA.speed}</Badge></span>,
      b: <Badge variant="outline" className={cn('text-[10px] h-5', SPEED_STYLE[mB.speed])}>{mB.speed}</Badge>,
      winner: better(SPEED_RANK[mA.speed], SPEED_RANK[mB.speed]),
    },
    {
      label: 'Params',
      a: mA.paramCount,
      b: mB.paramCount,
      winner: mA.paramCountRaw === 0 || mB.paramCountRaw === 0 ? 'tie' : better(mA.paramCountRaw, mB.paramCountRaw),
    },
    {
      label: 'MMLU',
      a: <span className="flex justify-end"><BenchmarkBar value={mA.mmlu} /></span>,
      b: <BenchmarkBar value={mB.mmlu} />,
      winner: better(mA.mmlu, mB.mmlu),
    },
    {
      label: 'HumanEval',
      a: <span className="flex justify-end"><BenchmarkBar value={mA.humanEval} /></span>,
      b: <BenchmarkBar value={mB.humanEval} />,
      winner: better(mA.humanEval, mB.humanEval),
    },
    {
      label: 'Capabilities',
      a: <div className="flex flex-wrap gap-1 justify-end">{mA.capabilities.map(c => <Badge key={c} variant="secondary" className="text-[10px] h-4 px-1.5">{c}</Badge>)}</div>,
      b: <div className="flex flex-wrap gap-1">{mB.capabilities.map(c => <Badge key={c} variant="secondary" className="text-[10px] h-4 px-1.5">{c}</Badge>)}</div>,
    },
    {
      label: 'License',
      a: <Badge variant="outline" className="text-[10px] h-5">{mA.license}</Badge>,
      b: <Badge variant="outline" className="text-[10px] h-5">{mB.license}</Badge>,
    },
  ]

  return (
    <Card size="sm" className="overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <span className="flex items-center gap-2">
          <SplitSquareHorizontal className="h-3.5 w-3.5" />
          Model Comparison
        </span>
        <ChevronUp className={cn('h-3.5 w-3.5 transition-transform duration-200', !open && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <CardContent className="p-0">
              {/* VS header */}
              <div className="grid grid-cols-[1fr_72px_1fr] items-center px-4 py-3 border-t border-border bg-muted/20">
                <div className="flex items-center justify-end gap-2">
                  <ProviderIcon provider={mA.provider} size={16} />
                  <span className="text-sm font-semibold text-foreground truncate">{mA.name}</span>
                </div>
                <div className="flex justify-center">
                  <Badge variant="outline" className="text-[10px] font-bold px-2.5 h-5 bg-primary/5 text-primary border-primary/20">VS</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <ProviderIcon provider={mB.provider} size={16} />
                  <span className="text-sm font-semibold text-foreground truncate">{mB.name}</span>
                </div>
              </div>

              {/* Comparison table */}
              <Table>
                <TableBody>
                  {rows.map(({ label, a, b, winner }) => (
                    <TableRow
                      key={label}
                      className={cn(
                        'text-xs',
                        winner === 'a' && 'bg-emerald-500/[0.03]',
                        winner === 'b' && 'bg-emerald-500/[0.03]',
                      )}
                    >
                      <TableCell className="text-right py-2 px-3 w-[40%]">
                        <span className={cn('inline-flex items-center gap-1.5', winner === 'a' && 'text-emerald-600 dark:text-emerald-400 font-semibold')}>
                          {a}
                          {winner === 'a' && <Trophy className="h-3 w-3 text-emerald-500 shrink-0" />}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2 px-2 w-[20%] bg-muted/30 border-x border-border text-muted-foreground font-medium whitespace-nowrap">
                        {label}
                      </TableCell>
                      <TableCell className="py-2 px-3 w-[40%]">
                        <span className={cn('inline-flex items-center gap-1.5', winner === 'b' && 'text-emerald-600 dark:text-emerald-400 font-semibold')}>
                          {winner === 'b' && <Trophy className="h-3 w-3 text-emerald-500 shrink-0" />}
                          {b}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function BenchmarkBar({ value }: { value: number }) {
  const colorClass =
    value >= 85
      ? '[&_[data-slot=progress-indicator]]:bg-emerald-500'
      : value >= 70
        ? '[&_[data-slot=progress-indicator]]:bg-blue-500'
        : '[&_[data-slot=progress-indicator]]:bg-amber-500'

  return (
    <span className="inline-flex items-center gap-2 min-w-[100px]">
      <Progress value={value} className={cn('h-2 w-16', colorClass)} />
      <span className="font-mono tabular-nums text-xs">{value}%</span>
    </span>
  )
}

function CompareTab({ modelId }: { modelId: string }) {
  const [modelA, setModelA] = useState(modelId)
  const [modelB, setModelB] = useState('gpt-4o')
  const [prompt, setPrompt] = useState('')
  const [responseA, setResponseA] = useState<{ text: string; cost: string; latency: string } | null>(null)
  const [responseB, setResponseB] = useState<{ text: string; cost: string; latency: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCompare = () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResponseA(null)
    setResponseB(null)

    setTimeout(() => {
      setResponseA({ text: MOCK_RESPONSES[0], cost: '$0.0024', latency: `${Math.floor(Math.random() * 600 + 200)}ms` })
    }, 1200)
    setTimeout(() => {
      setResponseB({ text: MOCK_RESPONSES[2], cost: '$0.0018', latency: `${Math.floor(Math.random() * 600 + 200)}ms` })
      setLoading(false)
    }, 1800)
  }

  const panels = [
    { id: modelA, set: setModelA, label: 'A' as const, resp: responseA },
    { id: modelB, set: setModelB, label: 'B' as const, resp: responseB },
  ]

  return (
    <TooltipProvider>
      <div className="h-full overflow-y-auto">
        {/* Top section: panels + prompt bar — exactly viewport height */}
        <div className="flex flex-col gap-1.5 pb-1" style={{ height: '100%' }}>
          {/* Response panels — fill available height */}
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            {panels.map(({ id, set, label, resp }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="flex min-h-0"
              >
                <Card size="sm" className="flex-1 flex flex-col py-0 gap-0 overflow-hidden">
                  <CardHeader className="!flex flex-row items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/20 rounded-t-xl shrink-0">
                    <Badge variant="ghost" className="text-[10px] font-bold uppercase tracking-wider h-5 px-1.5 text-muted-foreground">
                      {label}
                    </Badge>
                    <ModelSelector value={id} onChange={set as (v: string) => void} />
                    {resp && (
                      <div className="ml-auto flex items-center gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="gap-1 h-5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                              <DollarSign className="h-2.5 w-2.5" />
                              {resp.cost}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Estimated cost</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="gap-1 h-5 text-[10px] font-mono text-muted-foreground">
                              <Clock className="h-2.5 w-2.5" />
                              {resp.latency}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Response latency</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 min-h-0 p-0 overflow-y-auto">
                    <div className="p-4">
                      <AnimatePresence mode="wait">
                        {resp ? (
                          <motion.div
                            key="response"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm leading-relaxed text-foreground [&_strong]:font-semibold [&_p]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-1 [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:mb-2 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:w-full [&_table]:text-xs [&_table]:mb-2 [&_th]:text-left [&_th]:px-2 [&_th]:py-1 [&_th]:border-b [&_th]:border-border [&_td]:px-2 [&_td]:py-1 [&_td]:border-b [&_td]:border-border"
                          >
                            <ReactMarkdown>{resp.text}</ReactMarkdown>
                          </motion.div>
                        ) : loading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3"
                          >
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-4/5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[160px] gap-2"
                          >
                            <Sparkles className="h-8 w-8 text-muted-foreground/20" />
                            <span className="text-xs text-muted-foreground">Response will appear here</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Prompt input bar */}
          <Card size="sm" className="py-0 shrink-0">
            <div className="flex items-center gap-3 px-4 py-2.5">
              <label htmlFor="compare-prompt" className="sr-only">Comparison prompt</label>
              <Input
                id="compare-prompt"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCompare() }}
                placeholder="Type a prompt to compare both models side-by-side…"
                className="flex-1 h-10 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-0"
              />
              <Button onClick={handleCompare} disabled={loading || !prompt.trim()} className="gap-2 h-10 px-5">
                <Send className="h-4 w-4" />
                Compare
              </Button>
            </div>
          </Card>
        </div>

        {/* Model comparison — scroll down to see */}
        <div className="py-4">
          <ModelVsPanel modelAId={modelA} modelBId={modelB} />
        </div>
      </div>
    </TooltipProvider>
  )
}

export function Playground() {
  const [searchParams] = useSearchParams()
  const initialModel = searchParams.get('model') ?? 'claude-haiku-4-5'
  const [modelId, setModelId] = useState(initialModel)
  const [tab, setTab] = useState('chat')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [paramsOpen, setParamsOpen] = useState(true)
  const { provider, parameters, updateParameter, resetToDefaults } = useModelParameters()
  const [chatKey, setChatKey] = useState(0)
  const [compareKey, setCompareKey] = useState(0)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [streaming, setStreaming] = useState(true)
  const [tryApiOpen, setTryApiOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    'What models does AI Gateway support?',
    'Show me a Python code example',
    'Compare Claude vs GPT-4o',
    'How does pricing work?',
  ])

  const handleNewChat = useCallback(() => {
    if (tab === 'compare') {
      setCompareKey(k => k + 1)
    } else {
      setChatKey(k => k + 1)
      setChatHistory(prev => [`New chat ${prev.length + 1}`, ...prev])
      setTab('chat')
    }
  }, [tab])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 3.5rem - 1.5rem)' }}>
      <div className="flex items-center gap-3 pt-4 pb-3 border-b border-border">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-8">
            <TabsTrigger value="chat" className="text-xs px-3 h-7">Chat</TabsTrigger>
            <TabsTrigger value="compare" className="text-xs px-3 h-7">
              <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1.5" /> Compare
            </TabsTrigger>
            {/* Blind tab hidden for now */}
          </TabsList>
        </Tabs>
        {tab !== 'compare' && (
          <>
            <Separator orientation="vertical" className="h-8" />
            <ModelSelector value={modelId} onChange={setModelId} />
          </>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs px-2.5"
            onClick={() => setTryApiOpen(true)}
          >
            <Code className="h-3.5 w-3.5" />
            Try the API
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button
            variant={paramsOpen ? 'default' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setParamsOpen(v => !v)}
            title="Parameters"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setHistoryOpen(true)} title="History">
            <History className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleNewChat} title="New Chat">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <RuntimeAdapterProvider adapters={{ modelContext: provider }}>
        <div className="flex-1 min-h-0 pt-3 flex gap-4">
          <div className="flex-1 min-w-0 overflow-hidden">
            {tab === 'chat' && <ChatTab key={chatKey} modelId={modelId} />}
            {tab === 'compare' && <CompareTab key={compareKey} modelId={modelId} />}
            {/* {tab === 'blind' && <BlindTab modelId={modelId} />} */}
          </div>
          {paramsOpen && (
            <ParameterPanel
              parameters={parameters}
              onUpdate={updateParameter}
              onReset={resetToDefaults}
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
              files={files}
              onFilesChange={setFiles}
              streaming={streaming}
              onStreamingChange={setStreaming}
            />
          )}
        </div>
      </RuntimeAdapterProvider>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader><SheetTitle className="text-sm">Chat History</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-1">
            {chatHistory.map((t, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded hover:bg-accent text-xs text-muted-foreground hover:text-foreground transition-colors truncate"
                onClick={() => setHistoryOpen(false)}
              >
                {t}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={tryApiOpen} onOpenChange={setTryApiOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Try the API</DialogTitle>
            <DialogDescription>
              Use these code snippets to call <span className="font-medium text-foreground">{MODELS.find(m => m.id === modelId)?.name ?? modelId}</span> via the AI Gateway API.
            </DialogDescription>
          </DialogHeader>
          <QuickstartCode keyMasked="tf-sk_l...a4f2" modelId={modelId} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
