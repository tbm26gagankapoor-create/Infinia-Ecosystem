import { useState, useMemo, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SplitSquareHorizontal, EyeOff, Plus, History } from 'lucide-react'
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from '@assistant-ui/react'
import { Thread } from '@assistant-ui/react-ui'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ChevronDown } from 'lucide-react'
import { MODELS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const MOCK_RESPONSES = [
  "That's a thoughtful question. Based on my analysis:\n\n1. **Key consideration** — Start with the simplest approach that meets your requirements\n2. **Performance** — For high-volume use cases, a smaller, faster model typically reduces costs by 60–80%\n3. **Quality** — For complex reasoning tasks, use a frontier model\n\nThe recommended strategy is to route requests intelligently: fast models for simple tasks, capable models for complex ones.",
  "Here's how you can implement this:\n\n```python\nfrom openai import OpenAI\n\nclient = OpenAI(\n    base_url='https://api.aigateway.infinia.ai/v1',\n    api_key='tf-sk_l...a4f2'\n)\n\nresponse = client.chat.completions.create(\n    model='claude-haiku-4-5',\n    messages=[{'role': 'user', 'content': 'Hello'}]\n)\nprint(response.choices[0].message.content)\n```\n\nThis uses the OpenAI-compatible endpoint. You can also use the native Anthropic SDK format.",
  "AI Gateway supports **9 models** across 6 providers:\n\n| Provider | Models |\n|----------|--------|\n| Anthropic | Claude Sonnet 4.6, Claude Haiku 4.5 |\n| OpenAI | GPT-4o, GPT-4o Mini |\n| Meta | Llama 3.1 70B, Llama 3.1 8B |\n| Mistral | Mixtral 8x22B |\n| Google | Gemini 1.5 Pro |\n| DeepSeek | DeepSeek R1 |\n\nAll accessible via a single unified endpoint with your `tf-` API key.",
]

function createMockAdapter(modelId: string, responseIdxRef: React.MutableRefObject<number>): ChatModelAdapter {
  return {
    async *run({ abortSignal }) {
      const text = MOCK_RESPONSES[responseIdxRef.current % MOCK_RESPONSES.length]
      responseIdxRef.current++

      let accumulated = ''
      for (const char of text) {
        if (abortSignal.aborted) break
        accumulated += char
        yield { content: [{ type: 'text' as const, text: accumulated }] }
        await new Promise(r => setTimeout(r, 12))
      }

      yield {
        content: [{ type: 'text' as const, text: accumulated }],
        status: { type: 'complete' as const, reason: 'stop' as const },
        metadata: {
          custom: {
            model: MODELS.find(m => m.id === modelId)?.name ?? modelId,
          },
        },
      }
    },
  }
}

function ModelSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const model = MODELS.find(m => m.id === value) ?? MODELS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Select model, current: ${model.name}`}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
      >
        <span className="text-muted-foreground text-xs uppercase tracking-wide">{model.provider}</span>
        <span>{model.name}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            aria-label="Select a model"
            className="absolute top-full left-0 mt-1 z-50 w-72 rounded-lg border border-border bg-popover shadow-lg overflow-hidden"
          >
            {['Anthropic', 'OpenAI', 'Meta', 'Mistral', 'Google', 'DeepSeek'].map(provider => {
              const providerModels = MODELS.filter(m => m.provider === provider)
              if (providerModels.length === 0) return null
              return (
                <div key={provider}>
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50">
                    {provider}
                  </div>
                  {providerModels.map(m => (
                    <button
                      key={m.id}
                      role="option"
                      aria-selected={m.id === value}
                      onClick={() => { onChange(m.id); setOpen(false) }}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-accent transition-colors',
                        m.id === value ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      <span>{m.name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{m.inputCost}/1M</span>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function ChatTab({ modelId }: { modelId: string }) {
  const responseIdxRef = useRef(0)
  const adapter = useMemo(() => createMockAdapter(modelId, responseIdxRef), [modelId])
  const runtime = useLocalRuntime(adapter)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-full flex flex-col">
        <Thread
          welcome={{
            message: `You're talking to ${MODELS.find(m => m.id === modelId)?.name ?? modelId}. Ask anything — this is a live mockup with simulated streaming.`,
            suggestions: [
              { prompt: 'What models does AI Gateway support?' },
              { prompt: 'Show me a Python code example' },
              { prompt: 'How does pricing work?' },
            ],
          }}
        />
      </div>
    </AssistantRuntimeProvider>
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

  return (
    <div className="flex flex-col h-full gap-0">
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden">
        {([{ id: modelA, set: setModelA, label: 'A', resp: responseA }, { id: modelB, set: setModelB, label: 'B', resp: responseB }] as const).map(({ id, set, label, resp }) => (
          <div key={label} className="flex flex-col border border-border rounded-lg overflow-hidden bg-card">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
              <span className="text-xs font-bold text-muted-foreground">Model {label}</span>
              <ModelSelector value={id} onChange={set as (v: string) => void} />
              {resp && (
                <div className="ml-auto flex gap-2 text-xs font-mono text-muted-foreground">
                  <span className="text-primary">{resp.cost}</span>
                  <span>{resp.latency}</span>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed text-foreground">
              {resp ? (
                <pre className="whitespace-pre-wrap font-sans">{resp.text}</pre>
              ) : loading ? (
                <div className="flex items-center gap-1.5 text-muted-foreground" aria-label="Loading response">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground text-xs">Response will appear here…</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-3 flex gap-2 items-center mt-3">
        <label htmlFor="compare-prompt" className="sr-only">Comparison prompt</label>
        <input
          id="compare-prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleCompare() }}
          placeholder="Type a prompt to compare both models side-by-side…"
          className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button onClick={handleCompare} disabled={loading || !prompt.trim()} className="gap-1.5 h-9">
          <SplitSquareHorizontal className="h-3.5 w-3.5" /> Compare
        </Button>
      </div>
    </div>
  )
}

function BlindTab({ modelId }: { modelId: string }) {
  const [modelA] = useState(modelId)
  const [modelB] = useState('gpt-4o')
  const [prompt, setPrompt] = useState('')
  const [responses, setResponses] = useState<{ a: string; b: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [winner, setWinner] = useState<'A' | 'B' | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleRun = () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResponses(null)
    setWinner(null)
    setRevealed(false)
    setTimeout(() => {
      setResponses({ a: MOCK_RESPONSES[0], b: MOCK_RESPONSES[2] })
      setLoading(false)
    }, 1800)
  }

  const pick = (w: 'A' | 'B') => {
    setWinner(w)
    setTimeout(() => setRevealed(true), 300)
  }

  const modelAName = MODELS.find(m => m.id === modelA)?.name ?? modelA
  const modelBName = MODELS.find(m => m.id === modelB)?.name ?? modelB

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
        <EyeOff className="h-3.5 w-3.5 flex-shrink-0" />
        Model names hidden. Read both responses and pick your favourite. Models revealed after your choice.
      </div>
      {responses ? (
        <div className="grid grid-cols-2 gap-3 flex-1 overflow-auto mb-3">
          {(['A', 'B'] as const).map(label => (
            <div key={label} className={cn('rounded-lg border p-4 flex flex-col gap-3 transition-all', revealed && winner === label ? 'border-primary bg-primary/5' : 'border-border bg-card', revealed && winner !== label && winner ? 'opacity-60' : '')}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Response {label}</span>
                {revealed && <span className="text-xs font-medium text-foreground">{label === 'A' ? modelAName : modelBName}</span>}
              </div>
              <pre className="text-xs leading-relaxed text-foreground whitespace-pre-wrap overflow-y-auto max-h-52 font-sans">{label === 'A' ? responses.a : responses.b}</pre>
              {!winner && <Button size="sm" variant="outline" className="text-xs mt-auto" onClick={() => pick(label)}>Pick Response {label}</Button>}
              {winner === label && <div className="text-xs font-semibold text-primary">★ Your pick</div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          {loading ? 'Generating responses…' : 'Enter a prompt below to start'}
        </div>
      )}
      <div className="border-t border-border pt-3 flex gap-2 items-center">
        <label htmlFor="blind-prompt" className="sr-only">Blind test prompt</label>
        <input
          id="blind-prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleRun() }}
          placeholder="Enter prompt for blind comparison…"
          className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button onClick={handleRun} disabled={loading || !prompt.trim()} className="gap-1.5 h-9">
          <EyeOff className="h-3.5 w-3.5" /> Go
        </Button>
      </div>
    </div>
  )
}

export function Playground() {
  const [searchParams] = useSearchParams()
  const initialModel = searchParams.get('model') ?? 'claude-haiku-4-5'
  const [modelId, setModelId] = useState(initialModel)
  const [tab, setTab] = useState('chat')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    'What models does AI Gateway support?',
    'Show me a Python code example',
    'Compare Claude vs GPT-4o',
    'How does pricing work?',
  ])

  const handleNewChat = useCallback(() => {
    setChatHistory(prev => [`New chat ${prev.length + 1}`, ...prev])
    setTab('chat')
  }, [])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - var(--topbar-h, 4rem) - 1.5rem)' }}>
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-8">
            <TabsTrigger value="chat" className="text-xs px-3">Chat</TabsTrigger>
            <TabsTrigger value="compare" className="text-xs px-3">
              <SplitSquareHorizontal className="h-3 w-3 mr-1.5" /> Compare
            </TabsTrigger>
            <TabsTrigger value="blind" className="text-xs px-3">
              <EyeOff className="h-3 w-3 mr-1.5" /> Blind
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator orientation="vertical" className="h-5" />
        {tab === 'chat' && <ModelSelector value={modelId} onChange={setModelId} />}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setHistoryOpen(true)}>
            <History className="h-3 w-3" /> History
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={handleNewChat}>
            <Plus className="h-3 w-3" /> New Chat
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden pt-3">
        {tab === 'chat' && <ChatTab modelId={modelId} />}
        {tab === 'compare' && <CompareTab modelId={modelId} />}
        {tab === 'blind' && <BlindTab modelId={modelId} />}
      </div>

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
    </div>
  )
}
