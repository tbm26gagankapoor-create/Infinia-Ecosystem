import { useState, type ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  value: string
  label: string
  /** Optional secondary text (e.g., provider name) shown muted beside label */
  subtitle?: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onToggle: (value: string) => void
  placeholder: string
  label: string
  /** Render an icon for a given option value */
  renderIcon?: (value: string) => ReactNode
}

export function MultiSelect({ options, selected, onToggle, placeholder, label, renderIcon }: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const displayText = selected.length === 0
    ? `All ${label}`
    : selected.length === 1
      ? options.find(o => o.value === selected[0])?.label ?? '1 selected'
      : `${selected.length} selected`

  const selectedIcon = selected.length === 1 && renderIcon
    ? renderIcon(selected[0])
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 gap-1.5 text-xs font-normal',
            selected.length > 0 && 'border-primary/50'
          )}
        >
          {selectedIcon}
          {displayText}
          <ChevronDown className="ml-0.5 h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[70] w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    data-checked={isSelected}
                    onSelect={() => onToggle(option.value)}
                    className="gap-2"
                  >
                    {renderIcon && renderIcon(option.value)}
                    <div className="flex flex-col">
                      <span className={cn('text-xs', !isSelected && 'opacity-70')}>{option.label}</span>
                      {option.subtitle && (
                        <span className="text-[10px] text-muted-foreground">{option.subtitle}</span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {selected.length > 0 && (
          <div className="border-t p-2 flex flex-wrap gap-1">
            {selected.map(val => {
              const opt = options.find(o => o.value === val)
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="text-xs cursor-pointer gap-1"
                  onClick={() => onToggle(val)}
                >
                  {renderIcon && renderIcon(val)}
                  {opt?.label ?? val} ×
                </Badge>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
