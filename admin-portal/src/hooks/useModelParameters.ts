import { useState, useCallback } from 'react'

export const PARAMETER_DEFAULTS = {
  temperature: 1.0,
  maxTokens: 1024,
  topP: 1.0,
  frequencyPenalty: 0,
  presencePenalty: 0,
} as const

export type ParameterKey = keyof typeof PARAMETER_DEFAULTS

export const PARAMETER_CONFIG: Record<
  ParameterKey,
  { label: string; min: number; max: number; step: number }
> = {
  temperature:      { label: 'Temperature',       min: 0, max: 2,    step: 0.1 },
  maxTokens:        { label: 'Max Tokens',         min: 1, max: 4096, step: 1 },
  topP:             { label: 'Top P',              min: 0, max: 1,    step: 0.05 },
  frequencyPenalty: { label: 'Frequency Penalty',  min: 0, max: 2,    step: 0.1 },
  presencePenalty:  { label: 'Presence Penalty',   min: 0, max: 2,    step: 0.1 },
}

export function useModelParameters() {
  const [parameters, setParameters] = useState<Record<ParameterKey, number>>({
    ...PARAMETER_DEFAULTS,
  })

  const updateParameter = useCallback((key: string, value: number) => {
    setParameters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setParameters({ ...PARAMETER_DEFAULTS })
  }, [])

  return { parameters, updateParameter, resetToDefaults }
}
