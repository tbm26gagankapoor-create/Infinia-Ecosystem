import { type ComponentType, type SVGProps } from 'react'
import { cn } from '@/lib/utils'

import {
  Anthropic,
  OpenAI,
  Meta,
  Mistral,
  DeepSeek,
  Microsoft,
  Cohere,
  Qwen,
  Gemini,
} from '@lobehub/icons'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>

export const PROVIDER_MAP: Record<string, { icon: IconComponent; bg: string; fg: string }> = {
  Anthropic:  { icon: Anthropic as unknown as IconComponent,  bg: '#F1F0E8', fg: '#141413' },
  OpenAI:     { icon: OpenAI as unknown as IconComponent,     bg: '#000000', fg: '#ffffff' },
  Meta:       { icon: Meta as unknown as IconComponent,       bg: '#1877F2', fg: '#ffffff' },
  Mistral:    { icon: Mistral as unknown as IconComponent,    bg: '#FF7000', fg: '#ffffff' },
  Google:     { icon: Gemini as unknown as IconComponent,     bg: '#1A73E8', fg: '#ffffff' },
  DeepSeek:   { icon: DeepSeek as unknown as IconComponent,   bg: '#4D6BFE', fg: '#ffffff' },
  Microsoft:  { icon: Microsoft as unknown as IconComponent,  bg: '#00A4EF', fg: '#ffffff' },
  Cohere:     { icon: Cohere as unknown as IconComponent,     bg: '#39594D', fg: '#ffffff' },
  Qwen:       { icon: Qwen as unknown as IconComponent,       bg: '#615CED', fg: '#ffffff' },
}

interface ProviderIconProps {
  provider: string
  size?: number
  className?: string
}

export function ProviderIcon({ provider, size = 18, className }: ProviderIconProps) {
  const entry = PROVIDER_MAP[provider]

  const padding = Math.round(size * 0.25)
  const outerSize = size + padding * 2

  if (!entry) {
    return (
      <div
        className={cn('shrink-0 rounded-lg flex items-center justify-center font-semibold text-white', className)}
        style={{ width: outerSize, height: outerSize, backgroundColor: '#555', fontSize: size * 0.5 }}
      >
        {provider.charAt(0)}
      </div>
    )
  }

  const { icon: Icon, bg, fg } = entry

  return (
    <div
      className={cn('shrink-0 rounded-lg flex items-center justify-center', className)}
      style={{ width: outerSize, height: outerSize, backgroundColor: bg }}
    >
      <Icon size={size} color={fg} />
    </div>
  )
}
