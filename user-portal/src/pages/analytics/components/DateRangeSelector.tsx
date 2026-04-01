import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRESETS = [
  { label: 'Today', value: 'today' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
]

interface DateRangeSelectorProps {
  preset: string | null
  from: string
  to: string
  onPreset: (preset: string) => void
  onCustom: (from: string, to: string) => void
}

export function DateRangeSelector({ preset, from, to, onPreset, onCustom }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [customFrom, setCustomFrom] = useState(from)
  const [customTo, setCustomTo] = useState(to)

  const applyCustom = () => {
    if (customFrom && customTo) {
      onCustom(customFrom, customTo)
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1">
        {PRESETS.map(p => (
          <button
            key={p.value}
            onClick={() => onPreset(p.value)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              preset === p.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-7 w-fit gap-1.5 text-xs font-normal',
              !preset && 'border-primary/50 text-foreground'
            )}
          >
            <Calendar className="h-3 w-3" />
            Custom range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[70] w-auto p-3" align="start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-10">From</label>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-10">To</label>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-xs"
              />
            </div>
            <Button size="sm" className="h-7 text-xs mt-1" onClick={applyCustom}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
