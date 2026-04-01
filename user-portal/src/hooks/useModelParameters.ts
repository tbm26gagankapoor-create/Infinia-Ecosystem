import { useState, useMemo, useCallback, useRef } from 'react'
import type {
  ModelContextProvider,
} from '@assistant-ui/react'

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
  temperature: { label: 'Temperature', min: 0, max: 2, step: 0.1 },
  maxTokens: { label: 'Max Tokens', min: 1, max: 4096, step: 1 },
  topP: { label: 'Top P', min: 0, max: 1, step: 0.05 },
  frequencyPenalty: { label: 'Frequency Penalty', min: 0, max: 2, step: 0.1 },
  presencePenalty: { label: 'Presence Penalty', min: 0, max: 2, step: 0.1 },
}

export function useModelParameters() {
  const [parameters, setParameters] =
    useState<Record<ParameterKey, number>>({ ...PARAMETER_DEFAULTS })

  const subscribersRef = useRef(new Set<() => void>())

  const updateParameter = useCallback(
    (key: ParameterKey, value: number) => {
      setParameters(prev => {
        const next = { ...prev, [key]: value }
        subscribersRef.current.forEach(cb => cb())
        return next
      })
    },
    [],
  )

  const resetToDefaults = useCallback(() => {
    setParameters(PARAMETER_DEFAULTS)
    subscribersRef.current.forEach(cb => cb())
  }, [])

  const provider: ModelContextProvider = useMemo(
    () => ({
      getModelContext: () => ({ callSettings: parameters }),
      subscribe: (callback: () => void) => {
        subscribersRef.current.add(callback)
        return () => {
          subscribersRef.current.delete(callback)
        }
      },
    }),
    [parameters],
  )

  return { provider, parameters, updateParameter, resetToDefaults }
}
