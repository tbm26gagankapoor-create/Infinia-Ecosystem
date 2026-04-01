import { cn } from '@/lib/utils'

const OPTIONS = ['hourly', 'daily', 'weekly', 'monthly'] as const
const LABELS: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' }

interface GranularitySelectorProps {
  value: string
  onChange: (v: 'hourly' | 'daily' | 'weekly' | 'monthly') => void
}

export function GranularitySelector({ value, onChange }: GranularitySelectorProps) {
  return (
    <div className="flex w-fit items-center rounded-lg border bg-muted/50 p-0.5">
      {OPTIONS.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
            value === opt
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {LABELS[opt]}
        </button>
      ))}
    </div>
  )
}
