// ─── Organizations ───
export type Org = {
  id: string
  name: string
  plan: 'Free' | 'Developer' | 'Pro' | 'Team' | 'Enterprise'
  postpaidStatus: 'inactive' | 'active' | 'suspended'
  slaStatus: 'unsigned' | 'signed'
  creditLimit: number
  currentUsage: number
  creditBalance: number
  members: number
  apiKeys: number
  totalRequests: number
  createdAt: string
}

export const ORGS: Org[] = [
  { id: 'org-1', name: 'IHC Digital Solutions', plan: 'Enterprise', postpaidStatus: 'active', slaStatus: 'signed', creditLimit: 50000, currentUsage: 32450, creditBalance: 17550, members: 28, apiKeys: 12, totalRequests: 1240000, createdAt: '2026-01-15' },
  { id: 'org-2', name: 'Presight AI', plan: 'Enterprise', postpaidStatus: 'active', slaStatus: 'signed', creditLimit: 75000, currentUsage: 48200, creditBalance: 26800, members: 42, apiKeys: 18, totalRequests: 2180000, createdAt: '2026-01-20' },
  { id: 'org-3', name: 'Abu Dhabi Media', plan: 'Team', postpaidStatus: 'inactive', slaStatus: 'unsigned', creditLimit: 0, currentUsage: 890, creditBalance: 4110, members: 12, apiKeys: 5, totalRequests: 45600, createdAt: '2026-02-03' },
  { id: 'org-4', name: 'Multiply Group', plan: 'Pro', postpaidStatus: 'inactive', slaStatus: 'unsigned', creditLimit: 0, currentUsage: 420, creditBalance: 2580, members: 8, apiKeys: 3, totalRequests: 18900, createdAt: '2026-02-10' },
  { id: 'org-5', name: 'Response Plus Medical', plan: 'Team', postpaidStatus: 'active', slaStatus: 'signed', creditLimit: 15000, currentUsage: 8750, creditBalance: 6250, members: 15, apiKeys: 7, totalRequests: 312000, createdAt: '2026-02-14' },
  { id: 'org-6', name: 'Yas Holding', plan: 'Enterprise', postpaidStatus: 'active', slaStatus: 'signed', creditLimit: 100000, currentUsage: 67300, creditBalance: 32700, members: 55, apiKeys: 24, totalRequests: 3450000, createdAt: '2026-01-08' },
  { id: 'org-7', name: 'Alpha Dhabi', plan: 'Team', postpaidStatus: 'inactive', slaStatus: 'unsigned', creditLimit: 0, currentUsage: 1560, creditBalance: 3440, members: 18, apiKeys: 6, totalRequests: 67800, createdAt: '2026-02-22' },
  { id: 'org-8', name: 'Mubadala Health', plan: 'Pro', postpaidStatus: 'inactive', slaStatus: 'unsigned', creditLimit: 0, currentUsage: 290, creditBalance: 4710, members: 6, apiKeys: 2, totalRequests: 12300, createdAt: '2026-03-01' },
  { id: 'org-9', name: 'Palantir ME', plan: 'Enterprise', postpaidStatus: 'active', slaStatus: 'signed', creditLimit: 60000, currentUsage: 41200, creditBalance: 18800, members: 35, apiKeys: 15, totalRequests: 1890000, createdAt: '2026-01-25' },
  { id: 'org-10', name: 'G42 Cloud', plan: 'Enterprise', postpaidStatus: 'active', slaStatus: 'signed', creditLimit: 120000, currentUsage: 89400, creditBalance: 30600, members: 72, apiKeys: 30, totalRequests: 4200000, createdAt: '2026-01-05' },
  { id: 'org-11', name: 'Injazat Data Systems', plan: 'Team', postpaidStatus: 'active', slaStatus: 'signed', creditLimit: 20000, currentUsage: 12400, creditBalance: 7600, members: 20, apiKeys: 9, totalRequests: 534000, createdAt: '2026-02-07' },
  { id: 'org-12', name: 'EDGE Group AI', plan: 'Pro', postpaidStatus: 'inactive', slaStatus: 'unsigned', creditLimit: 0, currentUsage: 780, creditBalance: 4220, members: 10, apiKeys: 4, totalRequests: 34500, createdAt: '2026-03-05' },
  { id: 'org-13', name: 'StartupXYZ', plan: 'Developer', postpaidStatus: 'inactive', slaStatus: 'unsigned', creditLimit: 0, currentUsage: 48, creditBalance: 4952, members: 2, apiKeys: 1, totalRequests: 2100, createdAt: '2026-03-15' },
  { id: 'org-14', name: 'SmartCity Labs', plan: 'Free', postpaidStatus: 'inactive', slaStatus: 'unsigned', creditLimit: 0, currentUsage: 3.2, creditBalance: 1.8, members: 1, apiKeys: 1, totalRequests: 87, createdAt: '2026-03-28' },
  { id: 'org-15', name: 'National Health Services', plan: 'Enterprise', postpaidStatus: 'suspended', slaStatus: 'signed', creditLimit: 40000, currentUsage: 40000, creditBalance: 0, members: 30, apiKeys: 11, totalRequests: 1560000, createdAt: '2026-01-30' },
]

// ─── Users ───
export type User = {
  id: string
  name: string
  email: string
  orgId: string
  orgName: string
  role: 'Admin' | 'Member' | 'Viewer'
  status: 'active' | 'inactive' | 'pending'
  lastActive: string
  createdAt: string
}

export const USERS: User[] = [
  { id: 'u-1', name: 'Ahmed Al Mansoori', email: 'ahmed@ihc-digital.ae', orgId: 'org-1', orgName: 'IHC Digital Solutions', role: 'Admin', status: 'active', lastActive: '2026-04-02T09:15:00', createdAt: '2026-01-15' },
  { id: 'u-2', name: 'Sara Khan', email: 'sara@ihc-digital.ae', orgId: 'org-1', orgName: 'IHC Digital Solutions', role: 'Member', status: 'active', lastActive: '2026-04-01T16:42:00', createdAt: '2026-01-18' },
  { id: 'u-3', name: 'Thomas Chen', email: 'thomas@presight.ai', orgId: 'org-2', orgName: 'Presight AI', role: 'Admin', status: 'active', lastActive: '2026-04-02T11:30:00', createdAt: '2026-01-20' },
  { id: 'u-4', name: 'Fatima Al Hashimi', email: 'fatima@presight.ai', orgId: 'org-2', orgName: 'Presight AI', role: 'Member', status: 'active', lastActive: '2026-04-02T08:55:00', createdAt: '2026-01-22' },
  { id: 'u-5', name: 'Omar Al Baloushi', email: 'omar@admedia.ae', orgId: 'org-3', orgName: 'Abu Dhabi Media', role: 'Admin', status: 'active', lastActive: '2026-03-31T14:20:00', createdAt: '2026-02-03' },
  { id: 'u-6', name: 'Priya Sharma', email: 'priya@multiply.ae', orgId: 'org-4', orgName: 'Multiply Group', role: 'Admin', status: 'active', lastActive: '2026-04-01T10:15:00', createdAt: '2026-02-10' },
  { id: 'u-7', name: 'Khalid Rahman', email: 'khalid@responseplus.ae', orgId: 'org-5', orgName: 'Response Plus Medical', role: 'Admin', status: 'active', lastActive: '2026-04-02T07:45:00', createdAt: '2026-02-14' },
  { id: 'u-8', name: 'David Park', email: 'david@yas.ae', orgId: 'org-6', orgName: 'Yas Holding', role: 'Admin', status: 'active', lastActive: '2026-04-02T12:00:00', createdAt: '2026-01-08' },
  { id: 'u-9', name: 'Nora Al Ketbi', email: 'nora@yas.ae', orgId: 'org-6', orgName: 'Yas Holding', role: 'Member', status: 'active', lastActive: '2026-04-01T17:30:00', createdAt: '2026-01-12' },
  { id: 'u-10', name: 'James Wilson', email: 'james@alphadhabi.ae', orgId: 'org-7', orgName: 'Alpha Dhabi', role: 'Admin', status: 'active', lastActive: '2026-03-30T09:00:00', createdAt: '2026-02-22' },
  { id: 'u-11', name: 'Aisha Mohammed', email: 'aisha@mubadalahealth.ae', orgId: 'org-8', orgName: 'Mubadala Health', role: 'Admin', status: 'active', lastActive: '2026-04-01T13:10:00', createdAt: '2026-03-01' },
  { id: 'u-12', name: 'Robert Zhang', email: 'robert@palantir.me', orgId: 'org-9', orgName: 'Palantir ME', role: 'Admin', status: 'active', lastActive: '2026-04-02T10:45:00', createdAt: '2026-01-25' },
  { id: 'u-13', name: 'Maryam Al Zaabi', email: 'maryam@g42cloud.ae', orgId: 'org-10', orgName: 'G42 Cloud', role: 'Admin', status: 'active', lastActive: '2026-04-02T11:20:00', createdAt: '2026-01-05' },
  { id: 'u-14', name: 'Alex Johnson', email: 'alex@g42cloud.ae', orgId: 'org-10', orgName: 'G42 Cloud', role: 'Member', status: 'active', lastActive: '2026-04-02T09:50:00', createdAt: '2026-01-10' },
  { id: 'u-15', name: 'Hassan Ali', email: 'hassan@injazat.ae', orgId: 'org-11', orgName: 'Injazat Data Systems', role: 'Admin', status: 'active', lastActive: '2026-04-01T15:30:00', createdAt: '2026-02-07' },
  { id: 'u-16', name: 'Liam Cooper', email: 'liam@edge-ai.ae', orgId: 'org-12', orgName: 'EDGE Group AI', role: 'Admin', status: 'active', lastActive: '2026-03-29T11:00:00', createdAt: '2026-03-05' },
  { id: 'u-17', name: 'Max Indie', email: 'max@startupxyz.io', orgId: 'org-13', orgName: 'StartupXYZ', role: 'Admin', status: 'active', lastActive: '2026-03-28T16:20:00', createdAt: '2026-03-15' },
  { id: 'u-18', name: 'Yuki Tanaka', email: 'yuki@smartcity.ae', orgId: 'org-14', orgName: 'SmartCity Labs', role: 'Admin', status: 'pending', lastActive: '2026-03-28T10:00:00', createdAt: '2026-03-28' },
  { id: 'u-19', name: 'Rania Mahmoud', email: 'rania@nhs.ae', orgId: 'org-15', orgName: 'National Health Services', role: 'Admin', status: 'active', lastActive: '2026-04-01T08:30:00', createdAt: '2026-01-30' },
  { id: 'u-20', name: 'John Doe', email: 'john@nhs.ae', orgId: 'org-15', orgName: 'National Health Services', role: 'Viewer', status: 'inactive', lastActive: '2026-02-15T12:00:00', createdAt: '2026-02-01' },
]

// ─── API Keys ───
export type ApiKey = {
  id: string
  name: string
  prefix: string
  orgId: string
  orgName: string
  modelAllowlist: string[]
  rpmLimit: number
  monthlyCostCeiling: number
  currentMonthSpend: number
  status: 'active' | 'revoked' | 'expired'
  requestCount: number
  lastUsed: string
  createdAt: string
  tags: string[]
}

export const API_KEYS: ApiKey[] = [
  { id: 'key-1', name: 'Production API', prefix: 'sk-prod-****a3f2', orgId: 'org-1', orgName: 'IHC Digital Solutions', modelAllowlist: ['*'], rpmLimit: 1000, monthlyCostCeiling: 10000, currentMonthSpend: 4520, status: 'active', requestCount: 482000, lastUsed: '2026-04-02T09:14:00', createdAt: '2026-01-16', tags: ['env:production', 'team:backend'] },
  { id: 'key-2', name: 'Staging Key', prefix: 'sk-stg-****b1e9', orgId: 'org-1', orgName: 'IHC Digital Solutions', modelAllowlist: ['llama-3.3-70b', 'deepseek-r1-70b'], rpmLimit: 200, monthlyCostCeiling: 500, currentMonthSpend: 85, status: 'active', requestCount: 12400, lastUsed: '2026-04-01T16:40:00', createdAt: '2026-01-18', tags: ['env:staging'] },
  { id: 'key-3', name: 'ML Pipeline', prefix: 'sk-ml-****c4d7', orgId: 'org-2', orgName: 'Presight AI', modelAllowlist: ['*'], rpmLimit: 2000, monthlyCostCeiling: 25000, currentMonthSpend: 12800, status: 'active', requestCount: 890000, lastUsed: '2026-04-02T11:28:00', createdAt: '2026-01-21', tags: ['env:production', 'team:ml-ops'] },
  { id: 'key-4', name: 'Research Lab', prefix: 'sk-lab-****d8a1', orgId: 'org-2', orgName: 'Presight AI', modelAllowlist: ['deepseek-r1-671b', 'qwen-2.5-72b'], rpmLimit: 500, monthlyCostCeiling: 8000, currentMonthSpend: 3400, status: 'active', requestCount: 156000, lastUsed: '2026-04-02T10:55:00', createdAt: '2026-02-01', tags: ['env:production', 'team:research'] },
  { id: 'key-5', name: 'Content Gen', prefix: 'sk-cg-****e2f5', orgId: 'org-3', orgName: 'Abu Dhabi Media', modelAllowlist: ['llama-3.3-70b', 'mistral-nemo-12b'], rpmLimit: 300, monthlyCostCeiling: 2000, currentMonthSpend: 340, status: 'active', requestCount: 18700, lastUsed: '2026-03-31T14:18:00', createdAt: '2026-02-05', tags: ['team:content'] },
  { id: 'key-6', name: 'Analytics Bot', prefix: 'sk-ab-****f7c3', orgId: 'org-6', orgName: 'Yas Holding', modelAllowlist: ['*'], rpmLimit: 1500, monthlyCostCeiling: 20000, currentMonthSpend: 9870, status: 'active', requestCount: 1230000, lastUsed: '2026-04-02T12:00:00', createdAt: '2026-01-10', tags: ['env:production', 'team:analytics'] },
  { id: 'key-7', name: 'Customer Support', prefix: 'sk-cs-****g1a8', orgId: 'org-6', orgName: 'Yas Holding', modelAllowlist: ['llama-3.3-70b'], rpmLimit: 800, monthlyCostCeiling: 5000, currentMonthSpend: 2100, status: 'active', requestCount: 345000, lastUsed: '2026-04-02T11:45:00', createdAt: '2026-01-15', tags: ['env:production', 'team:support'] },
  { id: 'key-8', name: 'Old Integration', prefix: 'sk-old-****h5b2', orgId: 'org-5', orgName: 'Response Plus Medical', modelAllowlist: ['mistral-nemo-12b'], rpmLimit: 100, monthlyCostCeiling: 1000, currentMonthSpend: 0, status: 'revoked', requestCount: 45000, lastUsed: '2026-02-28T09:00:00', createdAt: '2026-02-15', tags: ['deprecated'] },
  { id: 'key-9', name: 'Dev Testing', prefix: 'sk-dev-****i9d4', orgId: 'org-10', orgName: 'G42 Cloud', modelAllowlist: ['*'], rpmLimit: 3000, monthlyCostCeiling: 50000, currentMonthSpend: 24500, status: 'active', requestCount: 2100000, lastUsed: '2026-04-02T11:18:00', createdAt: '2026-01-07', tags: ['env:production'] },
  { id: 'key-10', name: 'Prototype Key', prefix: 'sk-proto-****j3e6', orgId: 'org-13', orgName: 'StartupXYZ', modelAllowlist: ['llama-3.3-70b'], rpmLimit: 60, monthlyCostCeiling: 50, currentMonthSpend: 12, status: 'active', requestCount: 870, lastUsed: '2026-03-28T16:15:00', createdAt: '2026-03-16', tags: ['env:development'] },
  { id: 'key-11', name: 'Data Pipeline', prefix: 'sk-dp-****k7f1', orgId: 'org-9', orgName: 'Palantir ME', modelAllowlist: ['deepseek-r1-671b', 'qwen-2.5-72b', 'llama-3.3-70b'], rpmLimit: 1200, monthlyCostCeiling: 18000, currentMonthSpend: 11200, status: 'active', requestCount: 678000, lastUsed: '2026-04-02T10:42:00', createdAt: '2026-01-28', tags: ['env:production', 'team:data'] },
  { id: 'key-12', name: 'NHS Portal', prefix: 'sk-nhs-****l2g8', orgId: 'org-15', orgName: 'National Health Services', modelAllowlist: ['llama-3.3-70b', 'mistral-nemo-12b'], rpmLimit: 600, monthlyCostCeiling: 8000, currentMonthSpend: 8000, status: 'active', requestCount: 520000, lastUsed: '2026-04-01T08:28:00', createdAt: '2026-02-01', tags: ['env:production', 'team:portal'] },
]

// ─── Analytics time-series ───
function generateDailyData(days: number) {
  const data = []
  const now = new Date('2026-04-02')
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const base = 35000 + Math.random() * 15000
    const errors = Math.floor(base * (0.005 + Math.random() * 0.015))
    data.push({
      date: date.toISOString().split('T')[0],
      requests: Math.floor(base),
      errors,
      tokens: Math.floor(base * (800 + Math.random() * 400)),
      inputTokens: Math.floor(base * (300 + Math.random() * 200)),
      outputTokens: Math.floor(base * (500 + Math.random() * 200)),
      spend: Math.round(base * 0.028 * 100) / 100,
      latencyP50: Math.floor(280 + Math.random() * 80),
      latencyP95: Math.floor(620 + Math.random() * 180),
      latencyP99: Math.floor(1100 + Math.random() * 400),
      activeUsers: Math.floor(120 + Math.random() * 60),
      activeOrgs: Math.floor(10 + Math.random() * 5),
    })
  }
  return data
}

export const DAILY_ANALYTICS = generateDailyData(30)

export const SPEND_BY_MODEL = [
  { model: 'DeepSeek R1 671B', spend: 42300, requests: 890000, tokens: 12400000000 },
  { model: 'LLaMA 3.3 70B', spend: 28900, requests: 2340000, tokens: 8900000000 },
  { model: 'Qwen 2.5 72B', spend: 18700, requests: 1120000, tokens: 6200000000 },
  { model: 'Mistral Nemo 12B', spend: 8400, requests: 1890000, tokens: 4100000000 },
  { model: 'DeepSeek R1 70B', spend: 6200, requests: 780000, tokens: 2800000000 },
  { model: 'Gemma 3 27B', spend: 3100, requests: 420000, tokens: 1500000000 },
  { model: 'LLaMA 3.2 3B', spend: 890, requests: 1200000, tokens: 800000000 },
]

export const SPEND_BY_ORG = [
  { org: 'G42 Cloud', spend: 89400, percentage: 29.8 },
  { org: 'Yas Holding', spend: 67300, percentage: 22.4 },
  { org: 'Presight AI', spend: 48200, percentage: 16.1 },
  { org: 'Palantir ME', spend: 41200, percentage: 13.7 },
  { org: 'National Health Services', spend: 40000, percentage: 13.3 },
  { org: 'IHC Digital Solutions', spend: 32450, percentage: 10.8 },
  { org: 'Others', spend: 14850, percentage: 4.9 },
]

export const ERROR_BREAKDOWN = [
  { type: '429 Rate Limit', count: 4520, percentage: 38.2 },
  { type: '500 Internal Error', count: 2890, percentage: 24.4 },
  { type: '400 Bad Request', count: 2100, percentage: 17.7 },
  { type: '403 Forbidden', count: 1340, percentage: 11.3 },
  { type: '408 Timeout', count: 680, percentage: 5.7 },
  { type: '503 Unavailable', count: 310, percentage: 2.6 },
]

export const MODEL_HEALTH = [
  { model: 'LLaMA 3.3 70B', status: 'healthy' as const, uptime: 99.97, avgLatency: 312, errorRate: 0.8 },
  { model: 'DeepSeek R1 671B', status: 'healthy' as const, uptime: 99.92, avgLatency: 890, errorRate: 1.2 },
  { model: 'Qwen 2.5 72B', status: 'healthy' as const, uptime: 99.95, avgLatency: 345, errorRate: 0.6 },
  { model: 'Mistral Nemo 12B', status: 'healthy' as const, uptime: 99.99, avgLatency: 145, errorRate: 0.3 },
  { model: 'DeepSeek R1 70B', status: 'degraded' as const, uptime: 98.4, avgLatency: 520, errorRate: 3.8 },
  { model: 'Gemma 3 27B', status: 'healthy' as const, uptime: 99.96, avgLatency: 210, errorRate: 0.5 },
  { model: 'LLaMA 3.2 3B', status: 'healthy' as const, uptime: 99.99, avgLatency: 62, errorRate: 0.1 },
]

// ─── Model Catalog ───
export type ModelCatalogEntry = {
  id: string
  name: string
  provider: string
  family: string
  contextWindow: number
  inputCostPer1k: number
  outputCostPer1k: number
  uptime: number
  avgLatency: number
  errorRate: number
  requestsToday: number
  status: 'healthy' | 'degraded' | 'down'
  enabled: boolean
  tags: string[]
}

export const MODEL_CATALOG: ModelCatalogEntry[] = [
  { id: 'm-1', name: 'LLaMA 3.3 70B', provider: 'Meta', family: 'LLaMA', contextWindow: 128000, inputCostPer1k: 0.0008, outputCostPer1k: 0.0016, uptime: 99.97, avgLatency: 312, errorRate: 0.8, requestsToday: 42300, status: 'healthy', enabled: true, tags: ['chat', 'instruct', 'popular'] },
  { id: 'm-2', name: 'LLaMA 3.1 405B', provider: 'Meta', family: 'LLaMA', contextWindow: 128000, inputCostPer1k: 0.003, outputCostPer1k: 0.006, uptime: 99.85, avgLatency: 980, errorRate: 1.1, requestsToday: 8100, status: 'healthy', enabled: true, tags: ['chat', 'instruct', 'large'] },
  { id: 'm-3', name: 'LLaMA 3.2 3B', provider: 'Meta', family: 'LLaMA', contextWindow: 128000, inputCostPer1k: 0.0001, outputCostPer1k: 0.0002, uptime: 99.99, avgLatency: 62, errorRate: 0.1, requestsToday: 28900, status: 'healthy', enabled: true, tags: ['chat', 'fast', 'cheap'] },
  { id: 'm-4', name: 'DeepSeek R1 671B', provider: 'DeepSeek', family: 'DeepSeek', contextWindow: 64000, inputCostPer1k: 0.0014, outputCostPer1k: 0.0028, uptime: 99.92, avgLatency: 890, errorRate: 1.2, requestsToday: 18700, status: 'healthy', enabled: true, tags: ['reasoning', 'chat', 'popular'] },
  { id: 'm-5', name: 'DeepSeek R1 70B', provider: 'DeepSeek', family: 'DeepSeek', contextWindow: 64000, inputCostPer1k: 0.0005, outputCostPer1k: 0.001, uptime: 98.4, avgLatency: 520, errorRate: 3.8, requestsToday: 6200, status: 'degraded', enabled: true, tags: ['reasoning'] },
  { id: 'm-6', name: 'DeepSeek V3', provider: 'DeepSeek', family: 'DeepSeek', contextWindow: 128000, inputCostPer1k: 0.0009, outputCostPer1k: 0.0018, uptime: 99.90, avgLatency: 410, errorRate: 0.9, requestsToday: 14500, status: 'healthy', enabled: true, tags: ['chat', 'coding'] },
  { id: 'm-7', name: 'Qwen 2.5 72B', provider: 'Alibaba', family: 'Qwen', contextWindow: 128000, inputCostPer1k: 0.0007, outputCostPer1k: 0.0014, uptime: 99.95, avgLatency: 345, errorRate: 0.6, requestsToday: 11200, status: 'healthy', enabled: true, tags: ['chat', 'multilingual'] },
  { id: 'm-8', name: 'Qwen 2.5 Coder 32B', provider: 'Alibaba', family: 'Qwen', contextWindow: 128000, inputCostPer1k: 0.0004, outputCostPer1k: 0.0008, uptime: 99.93, avgLatency: 290, errorRate: 0.4, requestsToday: 7800, status: 'healthy', enabled: true, tags: ['coding', 'instruct'] },
  { id: 'm-9', name: 'Mistral Nemo 12B', provider: 'Mistral AI', family: 'Mistral', contextWindow: 128000, inputCostPer1k: 0.00015, outputCostPer1k: 0.00025, uptime: 99.99, avgLatency: 145, errorRate: 0.3, requestsToday: 21000, status: 'healthy', enabled: true, tags: ['chat', 'fast', 'cheap'] },
  { id: 'm-10', name: 'Mistral Large 2', provider: 'Mistral AI', family: 'Mistral', contextWindow: 128000, inputCostPer1k: 0.002, outputCostPer1k: 0.004, uptime: 99.88, avgLatency: 580, errorRate: 0.7, requestsToday: 5400, status: 'healthy', enabled: true, tags: ['chat', 'instruct'] },
  { id: 'm-11', name: 'Gemma 3 27B', provider: 'Google', family: 'Gemma', contextWindow: 131072, inputCostPer1k: 0.0003, outputCostPer1k: 0.0006, uptime: 99.96, avgLatency: 210, errorRate: 0.5, requestsToday: 9300, status: 'healthy', enabled: true, tags: ['chat', 'multilingual'] },
  { id: 'm-12', name: 'Gemma 3 9B', provider: 'Google', family: 'Gemma', contextWindow: 131072, inputCostPer1k: 0.00008, outputCostPer1k: 0.00015, uptime: 99.98, avgLatency: 98, errorRate: 0.2, requestsToday: 15600, status: 'healthy', enabled: true, tags: ['chat', 'fast'] },
  { id: 'm-13', name: 'Phi-4 14B', provider: 'Microsoft', family: 'Phi', contextWindow: 16000, inputCostPer1k: 0.00013, outputCostPer1k: 0.00025, uptime: 99.91, avgLatency: 175, errorRate: 0.4, requestsToday: 4200, status: 'healthy', enabled: true, tags: ['chat', 'instruct'] },
  { id: 'm-14', name: 'Falcon 180B', provider: 'TII', family: 'Falcon', contextWindow: 4096, inputCostPer1k: 0.004, outputCostPer1k: 0.008, uptime: 97.2, avgLatency: 1420, errorRate: 5.2, requestsToday: 800, status: 'down', enabled: false, tags: ['chat'] },
  { id: 'm-15', name: 'Jais 70B', provider: 'MBZUAI', family: 'Jais', contextWindow: 32768, inputCostPer1k: 0.001, outputCostPer1k: 0.002, uptime: 99.80, avgLatency: 420, errorRate: 1.5, requestsToday: 3100, status: 'healthy', enabled: true, tags: ['arabic', 'bilingual', 'regional'] },
]

// ─── Audit Logs ───
export type AuditEntry = {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  orgName: string
  details: string
}

export const AUDIT_LOGS: AuditEntry[] = [
  { id: 'a-1', timestamp: '2026-04-02T11:30:00', actor: 'gagan@infinia.ae', action: 'key.created', resource: 'sk-new-****m4h2', orgName: 'IHC Digital Solutions', details: 'Created new production API key with full model access' },
  { id: 'a-2', timestamp: '2026-04-02T10:45:00', actor: 'gagan@infinia.ae', action: 'org.postpaid.activated', resource: 'Injazat Data Systems', orgName: 'Injazat Data Systems', details: 'Activated postpaid billing, credit limit set to $20,000' },
  { id: 'a-3', timestamp: '2026-04-02T09:15:00', actor: 'admin@infinia.ae', action: 'user.role.changed', resource: 'sara@ihc-digital.ae', orgName: 'IHC Digital Solutions', details: 'Role changed from Viewer to Member' },
  { id: 'a-4', timestamp: '2026-04-01T17:30:00', actor: 'gagan@infinia.ae', action: 'key.revoked', resource: 'sk-old-****h5b2', orgName: 'Response Plus Medical', details: 'Revoked deprecated integration key' },
  { id: 'a-5', timestamp: '2026-04-01T15:00:00', actor: 'admin@infinia.ae', action: 'org.credit_limit.updated', resource: 'G42 Cloud', orgName: 'G42 Cloud', details: 'Credit limit increased from $100,000 to $120,000' },
  { id: 'a-6', timestamp: '2026-04-01T14:20:00', actor: 'gagan@infinia.ae', action: 'billing.method.updated', resource: 'Presight AI', orgName: 'Presight AI', details: 'Payment method updated to corporate card ending 8841' },
  { id: 'a-7', timestamp: '2026-04-01T11:00:00', actor: 'system', action: 'budget.alert.triggered', resource: 'National Health Services', orgName: 'National Health Services', details: 'Usage reached 100% of credit limit ($40,000)' },
  { id: 'a-8', timestamp: '2026-04-01T10:30:00', actor: 'admin@infinia.ae', action: 'org.suspended', resource: 'National Health Services', orgName: 'National Health Services', details: 'Postpaid account suspended — credit limit exceeded' },
  { id: 'a-9', timestamp: '2026-03-31T16:45:00', actor: 'gagan@infinia.ae', action: 'key.rotated', resource: 'sk-prod-****a3f2', orgName: 'IHC Digital Solutions', details: 'Production key rotated, old key expires in 24h' },
  { id: 'a-10', timestamp: '2026-03-31T14:00:00', actor: 'admin@infinia.ae', action: 'org.member.invited', resource: 'nora@yas.ae', orgName: 'Yas Holding', details: 'Invited as Member role' },
  { id: 'a-11', timestamp: '2026-03-31T11:20:00', actor: 'system', action: 'budget.alert.triggered', resource: 'National Health Services', orgName: 'National Health Services', details: 'Usage reached 80% of credit limit ($32,000 of $40,000)' },
  { id: 'a-12', timestamp: '2026-03-30T16:00:00', actor: 'gagan@infinia.ae', action: 'key.scoping.updated', resource: 'sk-lab-****d8a1', orgName: 'Presight AI', details: 'Added deepseek-r1-671b to model allowlist' },
  { id: 'a-13', timestamp: '2026-03-30T09:30:00', actor: 'admin@infinia.ae', action: 'org.created', resource: 'SmartCity Labs', orgName: 'SmartCity Labs', details: 'New organization created on Free plan' },
  { id: 'a-14', timestamp: '2026-03-29T15:15:00', actor: 'gagan@infinia.ae', action: 'pricing.tier.updated', resource: 'Enterprise', orgName: 'Platform', details: 'Enterprise tier updated: added 15% volume discount' },
  { id: 'a-15', timestamp: '2026-03-29T10:00:00', actor: 'system', action: 'key.auto_rotated', resource: 'sk-dp-****k7f1', orgName: 'Palantir ME', details: 'Auto-rotation triggered (90-day policy)' },
]

// ─── Billing / Pricing ───
export const PRICING_TIERS = [
  { name: 'Free', monthlyPrice: 0, credits: 5, rateLimit: 10, models: 3, support: 'Community', features: ['5 free credits', '10 RPM', '3 models'] },
  { name: 'Developer', monthlyPrice: 0, credits: 0, rateLimit: 60, models: 10, support: 'Email', features: ['Pay-as-you-go', '60 RPM', '10 models', 'API key scoping'] },
  { name: 'Pro', monthlyPrice: 49, credits: 50, rateLimit: 300, models: 20, support: 'Priority Email', features: ['$50 credits included', '300 RPM', 'All open models', 'Cost dashboard'] },
  { name: 'Team', monthlyPrice: 199, credits: 200, rateLimit: 1000, models: 50, support: 'Priority', features: ['$200 credits included', '1,000 RPM', 'All models', 'Team management', 'Budget alerts'] },
  { name: 'Enterprise', monthlyPrice: 0, credits: 0, rateLimit: 5000, models: 999, support: 'Dedicated', features: ['Custom pricing', '5,000+ RPM', 'All models', 'Postpaid billing', 'SLA', 'Volume discounts'] },
]

// ─── Revenue summary ───
export const REVENUE_SUMMARY = {
  totalRevenueMTD: 302400,
  totalRevenueLastMonth: 278600,
  totalCreditsOutstanding: 148500,
  totalOrgs: 15,
  activeOrgs: 13,
  paidOrgs: 11,
  postpaidOrgs: 6,
}

// ─── Providers ───
export type ProviderEntry = {
  id: string
  name: string
  shortName: string
  color: string
  status: 'connected' | 'degraded' | 'disconnected'
  apiKeyMasked: string
  region: string
  modelsRouted: string[]
  requestsToday: number
  costToday: number
  avgLatency: number
  errorRate: number
  uptime: number
  lastChecked: string
}

export const PROVIDERS_LIST: ProviderEntry[] = [
  { id: 'pv-1', name: 'Together AI', shortName: 'Together', color: '#6366f1', status: 'connected', apiKeyMasked: 'tog-****e7f2', region: 'us-east-1', modelsRouted: ['LLaMA 3.3 70B', 'LLaMA 3.1 405B', 'LLaMA 3.2 3B', 'DeepSeek R1 671B', 'DeepSeek R1 70B', 'Qwen 2.5 72B'], requestsToday: 68400, costToday: 42.8, avgLatency: 310, errorRate: 0.9, uptime: 99.95, lastChecked: '2026-04-02T11:58:00' },
  { id: 'pv-2', name: 'Groq', shortName: 'Groq', color: '#f59e0b', status: 'connected', apiKeyMasked: 'grq-****b3a1', region: 'us-west-2', modelsRouted: ['LLaMA 3.2 3B', 'Mistral Nemo 12B', 'Gemma 3 9B'], requestsToday: 54200, costToday: 8.1, avgLatency: 72, errorRate: 0.3, uptime: 99.99, lastChecked: '2026-04-02T11:58:00' },
  { id: 'pv-3', name: 'Fireworks AI', shortName: 'Fireworks', color: '#ef4444', status: 'connected', apiKeyMasked: 'fw-****c9d4', region: 'us-central', modelsRouted: ['DeepSeek V3', 'Qwen 2.5 Coder 32B', 'Gemma 3 27B'], requestsToday: 31700, costToday: 19.4, avgLatency: 290, errorRate: 0.6, uptime: 99.91, lastChecked: '2026-04-02T11:57:00' },
  { id: 'pv-4', name: 'Replicate', shortName: 'Replicate', color: '#8b5cf6', status: 'degraded', apiKeyMasked: 'r8-****h2k5', region: 'us-east-1', modelsRouted: ['Falcon 180B'], requestsToday: 800, costToday: 5.6, avgLatency: 1420, errorRate: 5.2, uptime: 97.2, lastChecked: '2026-04-02T11:55:00' },
  { id: 'pv-5', name: 'Mistral AI', shortName: 'Mistral', color: '#ec4899', status: 'connected', apiKeyMasked: 'ms-****j7p1', region: 'eu-west-3', modelsRouted: ['Mistral Nemo 12B', 'Mistral Large 2'], requestsToday: 26400, costToday: 14.9, avgLatency: 360, errorRate: 0.5, uptime: 99.94, lastChecked: '2026-04-02T11:58:00' },
  { id: 'pv-6', name: 'MBZUAI Inference', shortName: 'MBZUAI', color: '#14b8a6', status: 'connected', apiKeyMasked: 'mb-****q3w8', region: 'me-south-1', modelsRouted: ['Jais 70B'], requestsToday: 3100, costToday: 2.2, avgLatency: 420, errorRate: 1.5, uptime: 99.80, lastChecked: '2026-04-02T11:56:00' },
  { id: 'pv-7', name: 'Microsoft Azure', shortName: 'Azure', color: '#0ea5e9', status: 'connected', apiKeyMasked: 'az-****r5v2', region: 'eastus', modelsRouted: ['Phi-4 14B'], requestsToday: 4200, costToday: 0.7, avgLatency: 175, errorRate: 0.4, uptime: 99.91, lastChecked: '2026-04-02T11:58:00' },
]

export type ModelRoute = {
  modelId: string
  modelName: string
  primaryProvider: string
  fallbackProvider: string | null
  strategy: 'latency' | 'cost' | 'reliability'
}

export const MODEL_ROUTES: ModelRoute[] = [
  { modelId: 'm-1', modelName: 'LLaMA 3.3 70B', primaryProvider: 'Together AI', fallbackProvider: 'Fireworks AI', strategy: 'latency' },
  { modelId: 'm-2', modelName: 'LLaMA 3.1 405B', primaryProvider: 'Together AI', fallbackProvider: null, strategy: 'reliability' },
  { modelId: 'm-3', modelName: 'LLaMA 3.2 3B', primaryProvider: 'Groq', fallbackProvider: 'Together AI', strategy: 'latency' },
  { modelId: 'm-4', modelName: 'DeepSeek R1 671B', primaryProvider: 'Together AI', fallbackProvider: 'Fireworks AI', strategy: 'cost' },
  { modelId: 'm-5', modelName: 'DeepSeek R1 70B', primaryProvider: 'Together AI', fallbackProvider: 'Fireworks AI', strategy: 'cost' },
  { modelId: 'm-6', modelName: 'DeepSeek V3', primaryProvider: 'Fireworks AI', fallbackProvider: 'Together AI', strategy: 'cost' },
  { modelId: 'm-7', modelName: 'Qwen 2.5 72B', primaryProvider: 'Together AI', fallbackProvider: 'Fireworks AI', strategy: 'latency' },
  { modelId: 'm-8', modelName: 'Qwen 2.5 Coder 32B', primaryProvider: 'Fireworks AI', fallbackProvider: null, strategy: 'cost' },
  { modelId: 'm-9', modelName: 'Mistral Nemo 12B', primaryProvider: 'Groq', fallbackProvider: 'Mistral AI', strategy: 'latency' },
  { modelId: 'm-10', modelName: 'Mistral Large 2', primaryProvider: 'Mistral AI', fallbackProvider: null, strategy: 'reliability' },
  { modelId: 'm-11', modelName: 'Gemma 3 27B', primaryProvider: 'Fireworks AI', fallbackProvider: 'Together AI', strategy: 'latency' },
  { modelId: 'm-12', modelName: 'Gemma 3 9B', primaryProvider: 'Groq', fallbackProvider: 'Fireworks AI', strategy: 'latency' },
  { modelId: 'm-13', modelName: 'Phi-4 14B', primaryProvider: 'Microsoft Azure', fallbackProvider: null, strategy: 'reliability' },
  { modelId: 'm-14', modelName: 'Falcon 180B', primaryProvider: 'Replicate', fallbackProvider: null, strategy: 'reliability' },
  { modelId: 'm-15', modelName: 'Jais 70B', primaryProvider: 'MBZUAI Inference', fallbackProvider: null, strategy: 'reliability' },
]

// ─── Alerts & Incidents ───
export type Incident = {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'monitoring' | 'resolved'
  affectedModel: string
  affectedProvider: string
  startedAt: string
  resolvedAt?: string
  description: string
  updates: { time: string; message: string }[]
}

export const INCIDENTS: Incident[] = [
  {
    id: 'inc-1', title: 'Falcon 180B — Provider Unavailable', severity: 'critical', status: 'active',
    affectedModel: 'Falcon 180B', affectedProvider: 'Replicate',
    startedAt: '2026-04-02T09:22:00',
    description: 'Replicate is returning 503 errors for Falcon 180B. All requests are failing. Failover unavailable — no secondary provider configured.',
    updates: [
      { time: '2026-04-02T11:45:00', message: 'Replicate support ticket #R-90821 opened. Awaiting response.' },
      { time: '2026-04-02T10:30:00', message: 'Model automatically disabled for new requests.' },
      { time: '2026-04-02T09:22:00', message: 'Incident detected via health check. Error rate 100%.' },
    ]
  },
  {
    id: 'inc-2', title: 'DeepSeek R1 70B — Elevated Latency', severity: 'high', status: 'monitoring',
    affectedModel: 'DeepSeek R1 70B', affectedProvider: 'Together AI',
    startedAt: '2026-04-01T22:10:00',
    description: 'p95 latency for DeepSeek R1 70B has exceeded 2,000ms — 4× normal baseline. Error rate at 3.8%. Together AI reports infrastructure issues in us-east-1.',
    updates: [
      { time: '2026-04-02T08:00:00', message: 'Latency improving. p95 now at 1,800ms. Continuing to monitor.' },
      { time: '2026-04-02T01:00:00', message: 'Traffic partially shifted to Fireworks AI fallback.' },
      { time: '2026-04-01T22:10:00', message: 'Alert triggered. p95 latency crossed 2s threshold.' },
    ]
  },
  {
    id: 'inc-3', title: 'National Health Services — Credit Limit Exceeded', severity: 'medium', status: 'active',
    affectedModel: 'All', affectedProvider: 'N/A',
    startedAt: '2026-04-01T10:30:00',
    description: 'National Health Services postpaid account has exceeded the $40,000 credit limit. Account suspended — API keys returning 402 errors.',
    updates: [
      { time: '2026-04-02T09:00:00', message: 'Finance team notified. Awaiting customer payment confirmation.' },
      { time: '2026-04-01T10:30:00', message: 'Account auto-suspended by billing system.' },
    ]
  },
  {
    id: 'inc-4', title: 'Groq API Key Rotation Required', severity: 'low', status: 'monitoring',
    affectedModel: 'LLaMA 3.2 3B, Mistral Nemo 12B', affectedProvider: 'Groq',
    startedAt: '2026-04-02T00:00:00',
    description: 'Groq API key is 85 days old. Security policy requires rotation every 90 days. No service impact yet — action required within 5 days.',
    updates: [
      { time: '2026-04-02T00:00:00', message: 'Automated reminder triggered at 85-day threshold.' },
    ]
  },
  {
    id: 'inc-5', title: 'Together AI — Partial Outage (Resolved)', severity: 'high', status: 'resolved',
    affectedModel: 'LLaMA 3.3 70B', affectedProvider: 'Together AI',
    startedAt: '2026-03-28T14:00:00', resolvedAt: '2026-03-28T16:45:00',
    description: 'Together AI experienced a partial us-east-1 outage affecting LLaMA 3.3 70B. Traffic automatically routed to Fireworks AI fallback.',
    updates: [
      { time: '2026-03-28T16:45:00', message: 'Together AI confirmed full recovery. Traffic restored to primary.' },
      { time: '2026-03-28T14:30:00', message: 'Failover to Fireworks AI successful. Error rate back to normal.' },
      { time: '2026-03-28T14:00:00', message: 'Outage detected. Automatic failover initiated.' },
    ]
  },
]

export type AlertRule = {
  id: string
  name: string
  type: 'error_rate' | 'latency' | 'budget' | 'provider' | 'security'
  threshold: string
  target: string
  enabled: boolean
  channel: string
  lastTriggered?: string
}

export const ALERT_RULES: AlertRule[] = [
  { id: 'ar-1', name: 'Model Error Rate > 5%', type: 'error_rate', threshold: '> 5%', target: 'All models', enabled: true, channel: 'Slack #ops-alerts', lastTriggered: '2026-04-02T09:22:00' },
  { id: 'ar-2', name: 'p95 Latency > 2,000ms', type: 'latency', threshold: '> 2,000ms', target: 'All models', enabled: true, channel: 'Slack #ops-alerts', lastTriggered: '2026-04-01T22:10:00' },
  { id: 'ar-3', name: 'Org Credit Usage > 80%', type: 'budget', threshold: '> 80%', target: 'Postpaid orgs', enabled: true, channel: 'Email + Slack', lastTriggered: '2026-03-31T11:20:00' },
  { id: 'ar-4', name: 'Org Credit Usage > 100%', type: 'budget', threshold: '> 100%', target: 'Postpaid orgs', enabled: true, channel: 'Email + Slack', lastTriggered: '2026-04-01T10:30:00' },
  { id: 'ar-5', name: 'Provider API Key Age > 85 days', type: 'security', threshold: '> 85 days', target: 'All providers', enabled: true, channel: 'Email', lastTriggered: '2026-04-02T00:00:00' },
  { id: 'ar-6', name: 'Provider Error Rate > 10%', type: 'provider', threshold: '> 10%', target: 'All providers', enabled: true, channel: 'Slack #ops-alerts' },
  { id: 'ar-7', name: 'Daily Spend > $500', type: 'budget', threshold: '> $500/day', target: 'Platform-wide', enabled: false, channel: 'Email' },
  { id: 'ar-8', name: 'New Org Signup', type: 'security', threshold: 'Any', target: 'Platform', enabled: false, channel: 'Slack #growth' },
]

// ─── Reports ───
export const MRR_TREND = [
  { month: 'Sep 25', mrr: 142000, newMrr: 28000, churnedMrr: 4200 },
  { month: 'Oct 25', mrr: 165000, newMrr: 31000, churnedMrr: 8000 },
  { month: 'Nov 25', mrr: 189000, newMrr: 36000, churnedMrr: 12000 },
  { month: 'Dec 25', mrr: 218000, newMrr: 44000, churnedMrr: 15000 },
  { month: 'Jan 26', mrr: 241000, newMrr: 38000, churnedMrr: 15000 },
  { month: 'Feb 26', mrr: 262000, newMrr: 34000, churnedMrr: 13000 },
  { month: 'Mar 26', mrr: 278600, newMrr: 29000, churnedMrr: 12400 },
  { month: 'Apr 26', mrr: 302400, newMrr: 35000, churnedMrr: 11200 },
]

export const REVENUE_BY_PLAN = [
  { plan: 'Enterprise', revenue: 198400, orgs: 4, pct: 65.6 },
  { plan: 'Team', revenue: 62400, orgs: 3, pct: 20.6 },
  { plan: 'Pro', revenue: 29800, orgs: 4, pct: 9.9 },
  { plan: 'Developer', revenue: 11800, orgs: 3, pct: 3.9 },
  { plan: 'Free', revenue: 0, orgs: 1, pct: 0 },
]

export const TOP_SPENDING_ORGS_REPORT = [
  { org: 'G42 Cloud', plan: 'Enterprise', mtd: 68400, lastMonth: 61200, yoy: 18.2 },
  { org: 'IHC Digital Solutions', plan: 'Enterprise', mtd: 54200, lastMonth: 48900, yoy: 22.1 },
  { org: 'Injazat Data Systems', plan: 'Enterprise', mtd: 41800, lastMonth: 38100, yoy: 14.9 },
  { org: 'Presight AI', plan: 'Enterprise', mtd: 34000, lastMonth: 30600, yoy: 31.0 },
  { org: 'Palantir ME', plan: 'Team', mtd: 22400, lastMonth: 20800, yoy: 9.8 },
  { org: 'Yas Holding', plan: 'Team', mtd: 19800, lastMonth: 17200, yoy: 20.4 },
  { org: 'Mubadala Tech', plan: 'Team', mtd: 20400, lastMonth: 18100, yoy: 17.8 },
  { org: 'Etihad Digital', plan: 'Pro', mtd: 12200, lastMonth: 11800, yoy: 11.2 },
]

export const SCHEDULED_REPORTS = [
  { id: 'sr-1', name: 'Monthly Revenue Summary', frequency: 'Monthly', nextRun: '2026-05-01', recipients: 'gagan@infinia.ae, cfo@infinia.ae', format: 'PDF + CSV', enabled: true },
  { id: 'sr-2', name: 'Weekly Usage Digest', frequency: 'Weekly', nextRun: '2026-04-07', recipients: 'gagan@infinia.ae', format: 'Email', enabled: true },
  { id: 'sr-3', name: 'Postpaid Billing Report', frequency: 'Monthly', nextRun: '2026-05-01', recipients: 'finance@infinia.ae', format: 'CSV', enabled: true },
  { id: 'sr-4', name: 'Model Health Weekly', frequency: 'Weekly', nextRun: '2026-04-07', recipients: 'ops@infinia.ae', format: 'Email', enabled: false },
]
