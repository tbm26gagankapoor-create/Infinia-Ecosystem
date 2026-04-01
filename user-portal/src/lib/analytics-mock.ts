import { MODELS, PROJECTS } from './mock-data'

// --- Types ---

export type AnalyticsDataPoint = {
  date: string
  timestamp: number
  requests: number
  inputTokens: number
  outputTokens: number
  cost: number
  errors: number
  errorRate: number
  p50: number
  p95: number
  p99: number
  ttfb: number
  throughput: number
}

export type ModelAnalyticsRow = {
  modelId: string
  model: string
  provider: string
  requests: number
  inputTokens: number
  outputTokens: number
  cost: number
  errorRate: number
  p50: number
  p95: number
  p99: number
  trend: number[]
}

export type ErrorLogEntry = {
  id: string
  timestamp: string
  model: string
  project: string
  errorType: 'rate_limit' | 'timeout' | 'invalid_request' | 'server_error' | 'auth_error'
  statusCode: number
  message: string
}

export type CostByProject = {
  projectId: string
  projectName: string
  cost: number
  budget: number
  requests: number
}

export type AnalyticsKPIs = {
  totalRequests: number
  totalTokens: number
  totalCost: number
  errorRate: number
  avgLatency: number
  p95Latency: number
}

// --- Seeded random for stability ---

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

// --- Date helpers ---

function formatDate(d: Date, granularity: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (granularity === 'hourly') {
    return `${months[d.getMonth()]} ${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:00`
  }
  if (granularity === 'weekly') {
    return `W${getWeekNumber(d)} ${months[d.getMonth()]} ${d.getDate()}`
  }
  if (granularity === 'monthly') {
    return `${months[d.getMonth()]} ${d.getFullYear()}`
  }
  return `${months[d.getMonth()]} ${d.getDate()}`
}

function getWeekNumber(d: Date): number {
  const oneJan = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7)
}

function parseDateString(s: string): Date {
  return new Date(s + 'T00:00:00')
}

function getStepMs(granularity: string): number {
  switch (granularity) {
    case 'hourly': return 3600000
    case 'weekly': return 7 * 86400000
    case 'monthly': return 30 * 86400000
    default: return 86400000
  }
}

// --- Generators ---

export function generateTimeSeries(
  from: string,
  to: string,
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly'
): AnalyticsDataPoint[] {
  const start = parseDateString(from)
  const end = parseDateString(to)
  const stepMs = getStepMs(granularity)
  const rand = seededRandom(hashString(from + to + granularity))
  const points: AnalyticsDataPoint[] = []
  const baseRequests = granularity === 'hourly' ? 400 : granularity === 'weekly' ? 50000 : granularity === 'monthly' ? 200000 : 8000

  let current = new Date(start)
  let i = 0
  while (current <= end) {
    const dayOfWeek = current.getDay()
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.0
    const trendFactor = 1 + (i * 0.01)
    const noise = 0.7 + rand() * 0.6
    const hourFactor = granularity === 'hourly' ? (0.3 + 0.7 * Math.sin((current.getHours() - 6) * Math.PI / 12)) : 1

    const requests = Math.round(baseRequests * weekendFactor * trendFactor * noise * hourFactor)
    const inputTokens = Math.round(requests * (70 + rand() * 30) * 1000 / baseRequests * baseRequests / 100)
    const outputTokens = Math.round(inputTokens * (0.25 + rand() * 0.15))
    const cost = +(inputTokens * 0.0000025 + outputTokens * 0.000012).toFixed(2)
    const errors = Math.round(requests * (0.002 + rand() * 0.008))
    const errorRate = +(errors / requests * 100).toFixed(2)

    const baseLat = 350
    const p50 = Math.round(baseLat + rand() * 80 - 40)
    const p95 = Math.round(p50 * (2.0 + rand() * 0.5))
    const p99 = Math.round(p95 * (1.3 + rand() * 0.3))
    const ttfb = Math.round(p50 * (0.3 + rand() * 0.15))
    const throughput = Math.round((inputTokens + outputTokens) / (granularity === 'hourly' ? 3600 : 86400))

    points.push({
      date: formatDate(current, granularity),
      timestamp: current.getTime(),
      requests,
      inputTokens,
      outputTokens,
      cost,
      errors,
      errorRate,
      p50, p95, p99,
      ttfb,
      throughput,
    })

    current = new Date(current.getTime() + stepMs)
    i++
  }

  return points
}

export function generateModelAnalytics(
  modelIds?: string[],
): ModelAnalyticsRow[] {
  const models = modelIds?.length
    ? MODELS.filter(m => modelIds.includes(m.id))
    : MODELS.slice(0, 8)

  const rand = seededRandom(42)
  return models.map(m => {
    const requests = Math.round(500 + rand() * 10000)
    const inputTokens = Math.round(requests * (60 + rand() * 40) * 10)
    const outputTokens = Math.round(inputTokens * (0.2 + rand() * 0.2))
    const costPerInput = m.inputCostRaw / 1_000_000
    const costPerOutput = (parseFloat(m.outputCost.replace('$', '')) || m.inputCostRaw * 3) / 1_000_000
    const cost = +(inputTokens * costPerInput + outputTokens * costPerOutput).toFixed(2)
    const baseLat = m.speed === 'Fast' ? 250 : m.speed === 'Quality' ? 700 : 450

    return {
      modelId: m.id,
      model: m.name,
      provider: m.provider,
      requests,
      inputTokens,
      outputTokens,
      cost,
      errorRate: +(0.2 + rand() * 2.5).toFixed(1),
      p50: Math.round(baseLat + rand() * 100),
      p95: Math.round(baseLat * 2.2 + rand() * 200),
      p99: Math.round(baseLat * 3.5 + rand() * 400),
      trend: Array.from({ length: 7 }, () => Math.round(baseLat + rand() * 100 - 50)),
    }
  })
}

const ERROR_TYPES: { type: ErrorLogEntry['errorType']; code: number; msgs: string[] }[] = [
  { type: 'rate_limit', code: 429, msgs: ['Rate limit exceeded: 500 RPM', 'Too many requests, retry after 2s', 'Quota exhausted for project'] },
  { type: 'timeout', code: 504, msgs: ['Request timed out after 30s', 'Gateway timeout: upstream unresponsive', 'Connection deadline exceeded'] },
  { type: 'invalid_request', code: 400, msgs: ['Invalid model parameter', 'Max tokens exceeds model limit', 'Malformed JSON in request body'] },
  { type: 'server_error', code: 500, msgs: ['Internal server error', 'Upstream provider returned 500', 'Unexpected processing error'] },
  { type: 'auth_error', code: 401, msgs: ['Invalid API key', 'Key expired or revoked', 'Insufficient permissions for model'] },
]

const ERROR_WEIGHTS = [0.40, 0.25, 0.15, 0.12, 0.08]

export function generateErrorLog(count: number = 50): ErrorLogEntry[] {
  const rand = seededRandom(99)
  const modelNames = MODELS.slice(0, 6).map(m => m.name)
  const projectNames = PROJECTS.map(p => p.name)
  const entries: ErrorLogEntry[] = []
  const baseDate = new Date('2026-03-30T12:00:00')

  for (let i = 0; i < count; i++) {
    let r = rand()
    let typeIdx = 0
    let cumulative = 0
    for (let j = 0; j < ERROR_WEIGHTS.length; j++) {
      cumulative += ERROR_WEIGHTS[j]
      if (r < cumulative) { typeIdx = j; break }
    }
    const errType = ERROR_TYPES[typeIdx]
    const ts = new Date(baseDate.getTime() - i * (300000 + Math.round(rand() * 600000)))

    entries.push({
      id: `err-${String(i + 1).padStart(4, '0')}`,
      timestamp: ts.toISOString().replace('T', ' ').slice(0, 19),
      model: modelNames[Math.floor(rand() * modelNames.length)],
      project: projectNames[Math.floor(rand() * projectNames.length)],
      errorType: errType.type,
      statusCode: errType.code,
      message: errType.msgs[Math.floor(rand() * errType.msgs.length)],
    })
  }

  return entries
}

export function generateCostByProject(): CostByProject[] {
  const rand = seededRandom(77)
  return PROJECTS.map(p => ({
    projectId: p.id,
    projectName: p.name,
    cost: +(1 + rand() * 20).toFixed(2),
    budget: p.monthlyCap ?? p.dailyCap ? (p.dailyCap ?? 10) * 30 : 500,
    requests: Math.round(1000 + rand() * 15000),
  }))
}

export function computeKPIs(data: AnalyticsDataPoint[]): AnalyticsKPIs {
  if (!data.length) {
    return { totalRequests: 0, totalTokens: 0, totalCost: 0, errorRate: 0, avgLatency: 0, p95Latency: 0 }
  }

  const totalRequests = data.reduce((s, d) => s + d.requests, 0)
  const totalTokens = data.reduce((s, d) => s + d.inputTokens + d.outputTokens, 0)
  const totalCost = +data.reduce((s, d) => s + d.cost, 0).toFixed(2)
  const totalErrors = data.reduce((s, d) => s + d.errors, 0)
  const errorRate = +(totalErrors / totalRequests * 100).toFixed(2)
  const avgLatency = Math.round(data.reduce((s, d) => s + d.p50, 0) / data.length)
  const p95Latency = Math.round(data.reduce((s, d) => s + d.p95, 0) / data.length)

  return { totalRequests, totalTokens, totalCost, errorRate, avgLatency, p95Latency }
}
