import { RotateCcw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  PARAMETER_CONFIG,
  PARAMETER_DEFAULTS,
  type ParameterKey,
} from '@/hooks/useModelParameters'

interface ParameterPanelProps {
  parameters: Record<string, number>
  onUpdate: (key: string, value: number) => void
  onReset: () => void
  systemPrompt: string
  onSystemPromptChange: (value: string) => void
  streaming: boolean
  onStreamingChange: (value: boolean) => void
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
      {children}
    </span>
  )
}

function ParameterRow({
  paramKey,
  value,
  onUpdate,
}: {
  paramKey: ParameterKey
  value: number
  onUpdate: (key: ParameterKey, value: number) => void
}) {
  const config = PARAMETER_CONFIG[paramKey]
  const isInteger = config.step >= 1

  const displayValue = isInteger
    ? String(value)
    : value.toFixed(String(config.step).split('.')[1]?.length ?? 1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value)
    if (isNaN(raw)) return
    const clamped = Math.min(config.max, Math.max(config.min, raw))
    onUpdate(paramKey, isInteger ? Math.round(clamped) : clamped)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{config.label}</span>
        <input
          type="number"
          min={config.min}
          max={config.max}
          step={config.step}
          value={displayValue}
          onChange={handleInputChange}
          className="w-14 bg-transparent text-right text-xs font-mono tabular-nums text-foreground outline-none border-none p-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:text-primary transition-colors"
        />
      </div>
      <Slider
        min={config.min}
        max={config.max}
        step={config.step}
        value={[value]}
        onValueChange={([v]) => onUpdate(paramKey, v)}
      />
    </div>
  )
}

const PARAM_ORDER: ParameterKey[] = [
  'temperature',
  'maxTokens',
  'topP',
  'frequencyPenalty',
  'presencePenalty',
]

export function ParameterPanel({
  parameters,
  onUpdate,
  onReset,
  systemPrompt,
  onSystemPromptChange,
  streaming,
  onStreamingChange,
}: ParameterPanelProps) {
  const isDefault =
    JSON.stringify(parameters) === JSON.stringify(PARAMETER_DEFAULTS)

  return (
    <div
      className="shrink-0 border-l border-border px-4 flex flex-col overflow-y-auto"
      style={{ width: 240 }}
    >
      {/* System Prompt */}
      <div className="mb-3 pt-1">
        <SectionHeader>System Prompt</SectionHeader>
        <Textarea
          value={systemPrompt}
          onChange={e => onSystemPromptChange(e.target.value)}
          placeholder="Enter system instructions..."
          rows={6}
          className="mt-2 text-xs min-h-[120px] resize-y bg-transparent"
        />
      </div>

      <Separator className="mb-3" />

      {/* Parameters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader>Parameters</SectionHeader>
          {!isDefault && (
            <button
              onClick={onReset}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <RotateCcw className="h-2.5 w-2.5" /> Reset
            </button>
          )}
        </div>
        <div className="space-y-5">
          {PARAM_ORDER.map(key => (
            <ParameterRow
              key={key}
              paramKey={key}
              value={(parameters[key] as number) ?? PARAMETER_DEFAULTS[key]!}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Streaming toggle */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="text-xs text-muted-foreground">Streaming</span>
          <p className="text-[10px] text-muted-foreground/50">Token-by-token output</p>
        </div>
        <Switch checked={streaming} onCheckedChange={onStreamingChange} />
      </div>
    </div>
  )
}
