import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  createElement,
  createContext,
  useContext,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useSearchParams } from 'react-router-dom'
import {
  SplitSquareHorizontal,
  Plus,
  History,
  SlidersHorizontal,
  Search,
  Check,
  ChevronUp,
  ChevronDown,
  Trophy,
  Clock,
  DollarSign,
  Sparkles,
  Send,
  Zap,
  Network,
  Code2,
  Copy,
} from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import { MODEL_CATALOG } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useModelParameters } from '@/hooks/useModelParameters'
import { ParameterPanel } from '@/components/ParameterPanel'
import { ProviderIcon, PROVIDER_MAP } from '@/components/ProviderIcon'

const MOCK_RESPONSES = [
  "That's a thoughtful question. Based on my analysis:\n\n1. **Key consideration** — Start with the simplest approach that meets your requirements\n2. **Performance** — For high-volume use cases, a smaller, faster model typically reduces costs by 60–80%\n3. **Quality** — For complex reasoning tasks, use a frontier model\n\nThe recommended strategy is to route requests intelligently: fast models for simple tasks, capable models for complex ones.",
  "Here's how you can implement this:\n\n```python\nfrom openai import OpenAI\n\nclient = OpenAI(\n    base_url='https://api.aigateway.infinia.ai/v1',\n    api_key='tf-sk_l...a4f2'\n)\n\nresponse = client.chat.completions.create(\n    model='llama-3.3-70b',\n    messages=[{'role': 'user', 'content': 'Hello'}]\n)\nprint(response.choices[0].message.content)\n```\n\nThis uses the OpenAI-compatible endpoint. You can also use the native Anthropic SDK format.",
  "AI Gateway supports **15 models** across 8 providers:\n\n| Provider | Models |\n|----------|--------|\n| Meta | LLaMA 3.3 70B, LLaMA 3.1 405B, LLaMA 3.2 3B |\n| DeepSeek | DeepSeek R1 671B, DeepSeek R1 70B, DeepSeek V3 |\n| Alibaba | Qwen 2.5 72B, Qwen 2.5 Coder 32B |\n| Mistral AI | Mistral Nemo 12B, Mistral Large 2 |\n| Google | Gemma 3 27B, Gemma 3 9B |\n| Microsoft | Phi-4 14B |\n| MBZUAI | Jais 70B |\n\nAll accessible via a single unified endpoint with your `tf-` API key.",
]

function createMockAdapter(
  modelIdRef: React.MutableRefObject<string>,
  responseIdxRef: React.MutableRefObject<number>,
  externalAbortRef: React.MutableRefObject<AbortController | null>,
): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const currentModelId = modelIdRef.current
      const text = MOCK_RESPONSES[responseIdxRef.current % MOCK_RESPONSES.length]
      responseIdxRef.current++

      // Rough estimate of input tokens from accumulated message text
      const accumulatedText = messages
        .map(m =>
          m.content
            .map(c => (c.type === 'text' ? c.text : ''))
            .join(' '),
        )
        .join(' ')

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

      const modelEntry = MODEL_CATALOG.find(m => m.id === currentModelId)
      const modelName = modelEntry?.name ?? currentModelId
      const inputTokens = Math.floor((accumulatedText.length / 4) * 0.3)
      const outputTokens = Math.floor(text.length / 4)
      const cost = modelEntry
        ? (inputTokens * modelEntry.inputCostPer1k + outputTokens * modelEntry.outputCostPer1k) /
          1000
        : 0
      const ttft = modelEntry
        ? Math.round(modelEntry.avgLatency * 0.3 + Math.random() * 60)
        : 120
      const latency = modelEntry
        ? Math.round(modelEntry.avgLatency + Math.random() * 120 - 60)
        : 300

      yield {
        content: [{ type: 'text' as const, text: accumulated }],
        status: { type: 'complete' as const, reason: 'stop' as const },
        metadata: {
          custom: {
            model: modelName,
            provider: modelEntry?.provider,
            ttft,
            latency,
            inputTokens,
            outputTokens,
            cost,
            requestId: 'req_' + Math.random().toString(36).slice(2, 10),
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

  const availableModels = useMemo(
    () => MODEL_CATALOG.filter(m => m.enabled && m.status !== 'down'),
    [],
  )

  const model = availableModels.find(m => m.id === value) ?? availableModels[0]

  const filtered = useMemo(() => {
    if (!query.trim()) return availableModels
    const q = query.toLowerCase()
    return availableModels.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q)),
    )
  }, [query, availableModels])

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
        aria-label={`Select model, current: ${model?.name}`}
        className="flex items-center gap-2 rounded-lg border border-border bg-card pl-2 pr-2.5 py-1.5 text-foreground hover:bg-accent transition-colors"
      >
        <ProviderIcon provider={model?.provider ?? ''} size={14} />
        <span className="text-xs font-medium whitespace-nowrap">{model?.name ?? value}</span>
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
                    onClick={() => {
                      onChange(m.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-2.5 w-full px-3 py-2 hover:bg-accent/60 transition-colors',
                      m.id === value && 'bg-accent/40',
                    )}
                  >
                    <ProviderIcon provider={m.provider} size={16} />
                    <div className="flex flex-col items-start leading-tight min-w-0 flex-1">
                      <span className="text-[13px] font-medium text-foreground truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{m.provider}</span>
                    </div>
                    {m.status === 'degraded' && (
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 px-1 text-amber-500 border-amber-500/30 bg-amber-500/5"
                      >
                        degraded
                      </Badge>
                    )}
                    {m.id === value && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
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
  const iconMarkup = renderToStaticMarkup(
    createElement(entry.icon, { size: iconSize, color: entry.fg }),
  )
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}">
    <rect width="${total}" height="${total}" rx="8" fill="${entry.bg}"/>
    <g transform="translate(${pad},${pad})">${iconMarkup}</g>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const CurrentModelContext = createContext<string>('m-1')

function modelNameToProvider(modelName: string | undefined): string {
  if (!modelName) return 'AI'
  const m = MODEL_CATALOG.find(mod => mod.name === modelName)
  return m?.provider ?? 'AI'
}

type MessageMeta = {
  model?: string
  provider?: string
  ttft?: number
  latency?: number
  inputTokens?: number
  outputTokens?: number
  cost?: number
  requestId?: string
}

function CustomAssistantMessage() {
  const { messages } = useThread()
  const msg = useMessage()
  const [showJson, setShowJson] = useState(false)

  const currentModelId = useContext(CurrentModelContext)
  const meta = (msg.metadata as { custom?: MessageMeta })?.custom

  const metaModelName = meta?.model
  const modelName =
    metaModelName ?? MODEL_CATALOG.find(m => m.id === currentModelId)?.name
  const provider = modelNameToProvider(modelName)
  const avatarSrc = buildAvatarDataUri(provider)

  // Find previous assistant message to detect model switch
  let showDivider = false
  let prevModelName: string | undefined
  const msgIdx = messages.findIndex(m => m.id === msg.id)
  if (msgIdx > 0) {
    for (let i = msgIdx - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        prevModelName = (
          messages[i].metadata as { custom?: { model?: string } }
        )?.custom?.model
        break
      }
    }
    if (prevModelName && modelName && prevModelName !== modelName) {
      showDivider = true
    }
  }

  const handleCopyCurl = () => {
    const curl = `curl https://api.aigateway.infinia.ai/v1/chat/completions \\
  -H "Authorization: Bearer tf-sk_l...a4f2" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${meta?.model ?? modelName}","messages":[{"role":"user","content":"..."}]}'`
    navigator.clipboard.writeText(curl).catch(() => {})
  }

  return (
    <>
      {showDivider && (
        <div className="flex items-center gap-3 px-4 py-3 mx-auto w-full max-w-2xl">
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            {avatarSrc && <img src={avatarSrc} alt="" className="w-4 h-4 rounded-sm" />}
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              Switched to{' '}
              <span className="font-medium text-foreground">{modelName}</span>
            </span>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}
      <div
        style={
          {
            '--aui-avatar-bg': PROVIDER_MAP[provider]?.bg ?? '#555',
            '--aui-avatar-fg': PROVIDER_MAP[provider]?.fg ?? '#fff',
            '--aui-avatar-img': avatarSrc ? `url("${avatarSrc}")` : 'none',
          } as React.CSSProperties
        }
      >
        <DefaultAssistantMessage />
      </div>
      {msg.status?.type === 'complete' && meta && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground mt-1 px-1">
          <span className="flex items-center gap-1">
            <Zap className="h-2.5 w-2.5" />
            {meta.inputTokens}↑ {meta.outputTokens}↓
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-2.5 w-2.5" />${meta.cost?.toFixed(6)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            TTFT {meta.ttft}ms · {meta.latency}ms
          </span>
          <span className="flex items-center gap-1">
            <Network className="h-2.5 w-2.5" />
            {meta.provider}
          </span>
          <span className="font-mono opacity-40">{meta.requestId}</span>
          <button
            onClick={() => setShowJson(v => !v)}
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            <Code2 className="h-2.5 w-2.5" />
            {showJson ? 'Hide' : 'JSON'}
          </button>
          <button
            onClick={handleCopyCurl}
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            <Copy className="h-2.5 w-2.5" />
            cURL
          </button>
        </div>
      )}
      {showJson && meta && (
        <pre className="mx-1 mt-1 p-2.5 rounded-lg bg-muted/60 text-[10px] font-mono leading-relaxed overflow-x-auto text-muted-foreground max-h-48">
          {JSON.stringify(
            {
              id: meta.requestId,
              model: meta.model,
              usage: {
                prompt_tokens: meta.inputTokens,
                completion_tokens: meta.outputTokens,
              },
              _gateway: {
                provider: meta.provider,
                ttft_ms: meta.ttft,
                latency_ms: meta.latency,
              },
            },
            null,
            2,
          )}
        </pre>
      )}
    </>
  )
}

function ChatTab({ modelId }: { modelId: string }) {
  const responseIdxRef = useRef(0)
  const modelIdRef = useRef(modelId)
  const externalAbortRef = useRef<AbortController | null>(null)

  // Stable adapter — reads modelId from ref at call time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adapter = useMemo(
    () => createMockAdapter(modelIdRef, responseIdxRef, externalAbortRef),
    [],
  )
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

  const model = MODEL_CATALOG.find(m => m.id === modelId)

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

function ModelVsPanel({ modelAId, modelBId }: { modelAId: string; modelBId: string }) {
  const [open, setOpen] = useState(true)
  const mA = MODEL_CATALOG.find(m => m.id === modelAId)
  const mB = MODEL_CATALOG.find(m => m.id === modelBId)
  if (!mA || !mB) return null

  const better = (a: number, b: number, lowerIsBetter = false) =>
    a === b ? ('tie' as const) : (lowerIsBetter ? a < b : a > b) ? ('a' as const) : ('b' as const)

  type Row = { label: string; a: React.ReactNode; b: React.ReactNode; winner?: 'a' | 'b' | 'tie' }
  const rows: Row[] = [
    {
      label: 'Provider',
      a: (
        <span className="flex items-center gap-1.5 justify-end">
          <ProviderIcon provider={mA.provider} size={14} /> {mA.provider}
        </span>
      ),
      b: (
        <span className="flex items-center gap-1.5">
          <ProviderIcon provider={mB.provider} size={14} /> {mB.provider}
        </span>
      ),
    },
    {
      label: 'Context',
      a: <span className="tabular-nums">{mA.contextWindow.toLocaleString()} tokens</span>,
      b: <span className="tabular-nums">{mB.contextWindow.toLocaleString()} tokens</span>,
      winner: better(mA.contextWindow, mB.contextWindow),
    },
    {
      label: 'Input /1M',
      a: `$${(mA.inputCostPer1k * 1000).toFixed(2)}`,
      b: `$${(mB.inputCostPer1k * 1000).toFixed(2)}`,
      winner: better(mA.inputCostPer1k, mB.inputCostPer1k, true),
    },
    {
      label: 'Output /1M',
      a: `$${(mA.outputCostPer1k * 1000).toFixed(2)}`,
      b: `$${(mB.outputCostPer1k * 1000).toFixed(2)}`,
      winner: better(mA.outputCostPer1k, mB.outputCostPer1k, true),
    },
    {
      label: 'Avg Latency',
      a: <span className="tabular-nums">{mA.avgLatency}ms</span>,
      b: <span className="tabular-nums">{mB.avgLatency}ms</span>,
      winner: better(mA.avgLatency, mB.avgLatency, true),
    },
    {
      label: 'Error Rate',
      a: <span className="tabular-nums">{mA.errorRate}%</span>,
      b: <span className="tabular-nums">{mB.errorRate}%</span>,
      winner: better(mA.errorRate, mB.errorRate, true),
    },
    {
      label: 'Status',
      a: (
        <span className="flex justify-end">
          <Badge
            variant="outline"
            className={cn(
              'text-[10px] h-5',
              mA.status === 'healthy'
                ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/5'
                : 'text-amber-500 border-amber-500/30 bg-amber-500/5',
            )}
          >
            {mA.status}
          </Badge>
        </span>
      ),
      b: (
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] h-5',
            mB.status === 'healthy'
              ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/5'
              : 'text-amber-500 border-amber-500/30 bg-amber-500/5',
          )}
        >
          {mB.status}
        </Badge>
      ),
    },
    {
      label: 'Tags',
      a: (
        <div className="flex flex-wrap gap-1 justify-end">
          {mA.tags.slice(0, 2).map(t => (
            <Badge key={t} variant="secondary" className="text-[10px] h-4 px-1.5">
              {t}
            </Badge>
          ))}
        </div>
      ),
      b: (
        <div className="flex flex-wrap gap-1">
          {mB.tags.slice(0, 2).map(t => (
            <Badge key={t} variant="secondary" className="text-[10px] h-4 px-1.5">
              {t}
            </Badge>
          ))}
        </div>
      ),
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
        <ChevronUp
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            !open && 'rotate-180',
          )}
        />
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
                  <span className="text-sm font-semibold text-foreground truncate">
                    {mA.name}
                  </span>
                </div>
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold px-2.5 h-5 bg-primary/5 text-primary border-primary/20"
                  >
                    VS
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <ProviderIcon provider={mB.provider} size={16} />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {mB.name}
                  </span>
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
                        (winner === 'a' || winner === 'b') && 'bg-emerald-500/[0.03]',
                      )}
                    >
                      <TableCell className="text-right py-2 px-3 w-[40%]">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5',
                            winner === 'a' &&
                              'text-emerald-600 dark:text-emerald-400 font-semibold',
                          )}
                        >
                          {a}
                          {winner === 'a' && (
                            <Trophy className="h-3 w-3 text-emerald-500 shrink-0" />
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2 px-2 w-[20%] bg-muted/30 border-x border-border text-muted-foreground font-medium whitespace-nowrap">
                        {label}
                      </TableCell>
                      <TableCell className="py-2 px-3 w-[40%]">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5',
                            winner === 'b' &&
                              'text-emerald-600 dark:text-emerald-400 font-semibold',
                          )}
                        >
                          {winner === 'b' && (
                            <Trophy className="h-3 w-3 text-emerald-500 shrink-0" />
                          )}
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

function CompareTab({ modelId }: { modelId: string }) {
  const availableModels = useMemo(
    () => MODEL_CATALOG.filter(m => m.enabled && m.status !== 'down'),
    [],
  )
  const defaultB =
    availableModels.find(m => m.id !== modelId)?.id ?? availableModels[0]?.id ?? 'm-1'

  const [modelA, setModelA] = useState(modelId)
  const [modelB, setModelB] = useState(defaultB)
  const [prompt, setPrompt] = useState('')
  const [responseA, setResponseA] = useState<{
    text: string
    cost: string
    latency: string
  } | null>(null)
  const [responseB, setResponseB] = useState<{
    text: string
    cost: string
    latency: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCompare = () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResponseA(null)
    setResponseB(null)

    const mA = MODEL_CATALOG.find(m => m.id === modelA)
    const mB = MODEL_CATALOG.find(m => m.id === modelB)
    const roughTokens = Math.floor(prompt.length / 4)

    setTimeout(() => {
      const costA = mA
        ? (
            (roughTokens * mA.inputCostPer1k + roughTokens * 2 * mA.outputCostPer1k) /
            1000
          ).toFixed(6)
        : '0.000000'
      const latencyA = mA ? Math.round(mA.avgLatency + Math.random() * 120 - 60) : 400
      setResponseA({ text: MOCK_RESPONSES[0], cost: `$${costA}`, latency: `${latencyA}ms` })
    }, 1200)
    setTimeout(() => {
      const costB = mB
        ? (
            (roughTokens * mB.inputCostPer1k + roughTokens * 2 * mB.outputCostPer1k) /
            1000
          ).toFixed(6)
        : '0.000000'
      const latencyB = mB ? Math.round(mB.avgLatency + Math.random() * 120 - 60) : 400
      setResponseB({ text: MOCK_RESPONSES[2], cost: `$${costB}`, latency: `${latencyB}ms` })
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
        <div className="flex flex-col gap-1.5 pb-1" style={{ height: '100%' }}>
          {/* Response panels */}
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
                    <Badge
                      variant="ghost"
                      className="text-[10px] font-bold uppercase tracking-wider h-5 px-1.5 text-muted-foreground"
                    >
                      {label}
                    </Badge>
                    <ModelSelector value={id} onChange={set as (v: string) => void} />
                    {resp && (
                      <div className="ml-auto flex items-center gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="gap-1 h-5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                            >
                              <DollarSign className="h-2.5 w-2.5" />
                              {resp.cost}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Estimated cost</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="gap-1 h-5 text-[10px] font-mono text-muted-foreground"
                            >
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
                            <span className="text-xs text-muted-foreground">
                              Response will appear here
                            </span>
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
              <label htmlFor="compare-prompt" className="sr-only">
                Comparison prompt
              </label>
              <Input
                id="compare-prompt"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCompare()
                }}
                placeholder="Type a prompt to compare both models side-by-side…"
                className="flex-1 h-10 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-0"
              />
              <Button
                onClick={handleCompare}
                disabled={loading || !prompt.trim()}
                className="gap-2 h-10 px-5"
              >
                <Send className="h-4 w-4" />
                Compare
              </Button>
            </div>
          </Card>
        </div>

        {/* Model comparison panel */}
        <div className="py-4">
          <ModelVsPanel modelAId={modelA} modelBId={modelB} />
        </div>
      </div>
    </TooltipProvider>
  )
}

export default function Playground() {
  const [searchParams] = useSearchParams()
  const availableModels = useMemo(
    () => MODEL_CATALOG.filter(m => m.enabled && m.status !== 'down'),
    [],
  )
  const defaultModelId = availableModels[0]?.id ?? 'm-1'
  const initialModel = searchParams.get('model') ?? defaultModelId

  const [modelId, setModelId] = useState(initialModel)
  const [tab, setTab] = useState('chat')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [paramsOpen, setParamsOpen] = useState(true)
  const { parameters, updateParameter, resetToDefaults } = useModelParameters()
  const [chatKey, setChatKey] = useState(0)
  const [compareKey, setCompareKey] = useState(0)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [streaming, setStreaming] = useState(true)
  const [chatHistory, setChatHistory] = useState([
    'What models does AI Gateway support?',
    'Show me a Python code example',
    'Compare LLaMA vs DeepSeek',
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
    <motion.div className="flex flex-col" style={{ height: 'calc(100dvh - 3.5rem - 1.5rem)' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="flex items-center gap-3 pt-4 pb-3 border-b border-border">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-8">
            <TabsTrigger value="chat" className="text-xs px-3 h-7">
              Chat
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-xs px-3 h-7">
              <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1.5" /> Compare
            </TabsTrigger>
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
            variant={paramsOpen ? 'default' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setParamsOpen(v => !v)}
            title="Parameters"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setHistoryOpen(true)}
            title="History"
          >
            <History className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleNewChat}
            title="New Chat"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <RuntimeAdapterProvider adapters={{}}>
        <div className="flex-1 min-h-0 pt-3 flex gap-4">
          <div className="flex-1 min-w-0 overflow-hidden">
            {tab === 'chat' && <ChatTab key={chatKey} modelId={modelId} />}
            {tab === 'compare' && <CompareTab key={compareKey} modelId={modelId} />}
          </div>
          {paramsOpen && (
            <ParameterPanel
              parameters={parameters}
              onUpdate={updateParameter}
              onReset={resetToDefaults}
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
              streaming={streaming}
              onStreamingChange={setStreaming}
            />
          )}
        </div>
      </RuntimeAdapterProvider>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-sm">Chat History</SheetTitle>
          </SheetHeader>
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
    </motion.div>
  )
}
