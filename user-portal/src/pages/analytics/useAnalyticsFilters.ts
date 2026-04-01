import { useReducer } from 'react'

export type AnalyticsFilters = {
  dateRange: { preset: string | null; from: string; to: string }
  models: string[]
  providers: string[]
  projects: string[]
  status: 'all' | 'success' | 'error'
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly'
}

export type Action =
  | { type: 'SET_PRESET'; preset: string }
  | { type: 'SET_CUSTOM_RANGE'; from: string; to: string }
  | { type: 'TOGGLE_MODEL'; modelId: string }
  | { type: 'TOGGLE_PROVIDER'; provider: string }
  | { type: 'TOGGLE_PROJECT'; projectId: string }
  | { type: 'SET_STATUS'; status: 'all' | 'success' | 'error' }
  | { type: 'SET_GRANULARITY'; granularity: AnalyticsFilters['granularity'] }
  | { type: 'RESET' }
  | { type: 'RESET_DATE_RANGE' }
  | { type: 'RESET_MODELS' }
  | { type: 'RESET_PROVIDERS' }
  | { type: 'RESET_PROJECTS' }
  | { type: 'RESET_STATUS' }
  | { type: 'RESET_GRANULARITY' }

function getDateRange(preset: string): { from: string; to: string } {
  const today = new Date()
  const to = today.toISOString().slice(0, 10)
  const daysBack = (n: number) => new Date(today.getTime() - n * 86400000).toISOString().slice(0, 10)

  switch (preset) {
    case 'today': return { from: to, to }
    case '7d': return { from: daysBack(7), to }
    case '30d': return { from: daysBack(30), to }
    case '90d': return { from: daysBack(90), to }
    case 'month': {
      const from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10)
      return { from, to }
    }
    case 'quarter': {
      const qMonth = Math.floor(today.getMonth() / 3) * 3
      const from = new Date(today.getFullYear(), qMonth, 1).toISOString().slice(0, 10)
      return { from, to }
    }
    default: return { from: daysBack(30), to }
  }
}

const defaultRange = getDateRange('30d')

export const initialState: AnalyticsFilters = {
  dateRange: { preset: '30d', ...defaultRange },
  models: [],
  providers: [],
  projects: [],
  status: 'all',
  granularity: 'daily',
}

function toggleItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter(v => v !== item) : [...arr, item]
}

function reducer(state: AnalyticsFilters, action: Action): AnalyticsFilters {
  switch (action.type) {
    case 'SET_PRESET': {
      const range = getDateRange(action.preset)
      return { ...state, dateRange: { preset: action.preset, ...range } }
    }
    case 'SET_CUSTOM_RANGE':
      return { ...state, dateRange: { preset: null, from: action.from, to: action.to } }
    case 'TOGGLE_MODEL':
      return { ...state, models: toggleItem(state.models, action.modelId) }
    case 'TOGGLE_PROVIDER':
      return { ...state, providers: toggleItem(state.providers, action.provider) }
    case 'TOGGLE_PROJECT':
      return { ...state, projects: toggleItem(state.projects, action.projectId) }
    case 'SET_STATUS':
      return { ...state, status: action.status }
    case 'SET_GRANULARITY':
      return { ...state, granularity: action.granularity }
    case 'RESET':
      return initialState
    case 'RESET_DATE_RANGE':
      return { ...state, dateRange: initialState.dateRange }
    case 'RESET_MODELS':
      return { ...state, models: [] }
    case 'RESET_PROVIDERS':
      return { ...state, providers: [] }
    case 'RESET_PROJECTS':
      return { ...state, projects: [] }
    case 'RESET_STATUS':
      return { ...state, status: 'all' }
    case 'RESET_GRANULARITY':
      return { ...state, granularity: 'daily' }
    default:
      return state
  }
}

export function useAnalyticsFilters() {
  const [filters, dispatch] = useReducer(reducer, initialState)
  return { filters, dispatch }
}
