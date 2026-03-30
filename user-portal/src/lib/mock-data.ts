export type Model = {
  id: string
  name: string
  provider: string
  providerColor: string
  contextWindow: string
  contextWindowRaw: number
  inputCost: string
  outputCost: string
  inputCostRaw: number
  speed: 'Fast' | 'Balanced' | 'Quality'
  capabilities: string[]
  license: 'Proprietary' | 'Apache-2.0' | 'MIT' | 'Llama' | 'Gemma'
  paramCount: string      // e.g. '7B', '72B', '—' for undisclosed
  paramCountRaw: number   // in billions, 0 = undisclosed
  mmlu: number
  humanEval: number
  description: string
  useCases: string[]
}

export const MODELS: Model[] = [
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    providerColor: '#D97706',
    contextWindow: '200K',
    contextWindowRaw: 200000,
    inputCost: '$3.00',
    outputCost: '$15.00',
    inputCostRaw: 3.00,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code', 'Vision', 'Analysis'],
    license: 'Proprietary',
    paramCount: '—',
    paramCountRaw: 0,
    mmlu: 90.4,
    humanEval: 73.0,
    description: "Anthropic's most intelligent model to date, balancing intelligence and speed. Excels at complex reasoning, nuanced instruction following, and long-context tasks.",
    useCases: ['Complex reasoning', 'Code generation', 'Document analysis', 'Customer support'],
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    providerColor: '#D97706',
    contextWindow: '200K',
    contextWindowRaw: 200000,
    inputCost: '$0.80',
    outputCost: '$4.00',
    inputCostRaw: 0.80,
    speed: 'Fast',
    capabilities: ['Chat', 'Code', 'Vision'],
    license: 'Proprietary',
    paramCount: '—',
    paramCountRaw: 0,
    mmlu: 88.9,
    humanEval: 75.9,
    description: 'Fastest and most compact model for near-instant responsiveness. Ideal for real-time interactions and lightweight tasks that require low latency.',
    useCases: ['Real-time chat', 'Content moderation', 'Data extraction', 'Summarization'],
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerColor: '#10A37F',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$2.50',
    outputCost: '$10.00',
    inputCostRaw: 2.50,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code', 'Vision', 'Audio'],
    license: 'Proprietary',
    paramCount: '—',
    paramCountRaw: 0,
    mmlu: 88.7,
    humanEval: 90.2,
    description: "OpenAI's flagship multimodal model with native audio, vision, and text capabilities. Optimized for speed and real-time applications.",
    useCases: ['Multimodal tasks', 'Voice applications', 'Code review', 'Creative writing'],
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    providerColor: '#10A37F',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$0.15',
    outputCost: '$0.60',
    inputCostRaw: 0.15,
    speed: 'Fast',
    capabilities: ['Chat', 'Code', 'Vision'],
    license: 'Proprietary',
    paramCount: '—',
    paramCountRaw: 0,
    mmlu: 82.0,
    humanEval: 87.2,
    description: 'Small, affordable, and intelligent model for fast tasks. Faster and cheaper than GPT-4o while maintaining strong performance on most tasks.',
    useCases: ['Classification', 'Extraction', 'Quick Q&A', 'Chatbots'],
  },
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B Instruct',
    provider: 'Meta',
    providerColor: '#0668E1',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$0.88',
    outputCost: '$0.88',
    inputCostRaw: 0.88,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code'],
    license: 'Llama',
    paramCount: '70B',
    paramCountRaw: 70,
    mmlu: 86.0,
    humanEval: 80.5,
    description: "Meta's most capable open-source model. Competitive with closed-source frontier models on many benchmarks at a fraction of the cost.",
    useCases: ['General assistant', 'Code generation', 'Research', 'Fine-tuning base'],
  },
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B Instruct',
    provider: 'Meta',
    providerColor: '#0668E1',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$0.18',
    outputCost: '$0.18',
    inputCostRaw: 0.18,
    speed: 'Fast',
    capabilities: ['Chat', 'Code'],
    license: 'Llama',
    paramCount: '8B',
    paramCountRaw: 8,
    mmlu: 73.0,
    humanEval: 72.6,
    description: 'Efficient and capable small model. Ideal for latency-sensitive applications and high-volume workloads where cost is the primary concern.',
    useCases: ['High-volume pipelines', 'Edge deployment', 'Rapid prototyping', 'Simple tasks'],
  },
  {
    id: 'mixtral-8x22b',
    name: 'Mixtral 8x22B',
    provider: 'Mistral',
    providerColor: '#FF7000',
    contextWindow: '65K',
    contextWindowRaw: 65000,
    inputCost: '$1.20',
    outputCost: '$1.20',
    inputCostRaw: 1.20,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code'],
    license: 'Apache-2.0',
    paramCount: '141B',
    paramCountRaw: 141,
    mmlu: 77.8,
    humanEval: 75.1,
    description: "Mistral's best open model. Uses a sparse mixture of experts architecture for high performance with efficient inference.",
    useCases: ['Multilingual tasks', 'Code completion', 'Reasoning', 'Creative content'],
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    providerColor: '#4285F4',
    contextWindow: '1M',
    contextWindowRaw: 1000000,
    inputCost: '$1.25',
    outputCost: '$5.00',
    inputCostRaw: 1.25,
    speed: 'Quality',
    capabilities: ['Chat', 'Code', 'Vision', 'Audio'],
    license: 'Proprietary',
    paramCount: '—',
    paramCountRaw: 0,
    mmlu: 85.9,
    humanEval: 71.9,
    description: "Google's multimodal model with breakthrough 1M token context window. Process entire codebases, books, or hours of video in a single prompt.",
    useCases: ['Long-context analysis', 'Video understanding', 'Document QA', 'Research'],
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    providerColor: '#7C3AED',
    contextWindow: '64K',
    contextWindowRaw: 64000,
    inputCost: '$0.55',
    outputCost: '$2.19',
    inputCostRaw: 0.55,
    speed: 'Quality',
    capabilities: ['Chat', 'Code', 'Reasoning'],
    license: 'MIT',
    paramCount: '671B',
    paramCountRaw: 671,
    mmlu: 90.8,
    humanEval: 92.3,
    description: 'Open-source reasoning model with chain-of-thought capabilities. Trained via reinforcement learning to produce step-by-step reasoning traces before answering.',
    useCases: ['Math problems', 'Scientific reasoning', 'Complex code', 'Logic puzzles'],
  },
  {
    id: 'o1-mini',
    name: 'o1-mini',
    provider: 'OpenAI',
    providerColor: '#10A37F',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$3.00',
    outputCost: '$12.00',
    inputCostRaw: 3.00,
    speed: 'Quality',
    capabilities: ['Chat', 'Code', 'Reasoning'],
    license: 'Proprietary',
    paramCount: '—',
    paramCountRaw: 0,
    mmlu: 90.0,
    humanEval: 88.4,
    description: "OpenAI's compact reasoning model trained with reinforcement learning to produce step-by-step reasoning. Excels at math, science, and complex problem solving at lower cost than o1.",
    useCases: ['Math problems', 'Scientific reasoning', 'Complex coding', 'Logic puzzles'],
  },
  {
    id: 'mistral-7b-instruct',
    name: 'Mistral 7B Instruct',
    provider: 'Mistral',
    providerColor: '#FF7000',
    contextWindow: '32K',
    contextWindowRaw: 32000,
    inputCost: '$0.06',
    outputCost: '$0.06',
    inputCostRaw: 0.06,
    speed: 'Fast',
    capabilities: ['Chat', 'Code'],
    license: 'Apache-2.0',
    paramCount: '7B',
    paramCountRaw: 7,
    mmlu: 64.1,
    humanEval: 35.0,
    description: 'Lightweight, fast open-source model with Apache 2.0 license. Punches well above its weight class for a 7B parameter model, ideal for high-throughput, cost-sensitive workloads.',
    useCases: ['High-volume pipelines', 'Edge deployment', 'Fine-tuning base', 'Quick classification'],
  },
  {
    id: 'phi-4',
    name: 'Phi-4',
    provider: 'Microsoft',
    providerColor: '#0078D4',
    contextWindow: '16K',
    contextWindowRaw: 16000,
    inputCost: '$0.07',
    outputCost: '$0.14',
    inputCostRaw: 0.07,
    speed: 'Fast',
    capabilities: ['Chat', 'Code', 'Reasoning'],
    license: 'MIT',
    paramCount: '14B',
    paramCountRaw: 14,
    mmlu: 84.8,
    humanEval: 82.6,
    description: "Microsoft's small language model with exceptional reasoning capabilities for its size. Trained on high-quality synthetic data, Phi-4 outperforms much larger models on reasoning benchmarks.",
    useCases: ['On-device inference', 'Math reasoning', 'Code generation', 'Structured output'],
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    providerColor: '#39594F',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$2.50',
    outputCost: '$10.00',
    inputCostRaw: 2.50,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code'],
    license: 'Proprietary',
    paramCount: '104B',
    paramCountRaw: 104,
    mmlu: 75.7,
    humanEval: 65.1,
    description: "Cohere's most capable model, optimized for enterprise RAG and tool use. Features advanced grounding, citation generation, and multi-step tool chaining out of the box.",
    useCases: ['Retrieval-augmented generation', 'Enterprise search', 'Tool use', 'Multi-step agents'],
  },
  {
    id: 'qwen2.5-72b-instruct',
    name: 'Qwen2.5 72B Instruct',
    provider: 'Qwen',
    providerColor: '#6366F1',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$0.40',
    outputCost: '$0.40',
    inputCostRaw: 0.40,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code', 'Reasoning'],
    license: 'Apache-2.0',
    paramCount: '72B',
    paramCountRaw: 72,
    mmlu: 86.0,
    humanEval: 86.1,
    description: "Alibaba's flagship open-weight model with state-of-the-art performance across reasoning, coding, and mathematics. Competitive with top closed-source models at a fraction of the cost.",
    useCases: ['Multilingual tasks', 'Code generation', 'Math reasoning', 'Agent workflows'],
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    providerColor: '#4285F4',
    contextWindow: '1M',
    contextWindowRaw: 1000000,
    inputCost: '$0.10',
    outputCost: '$0.40',
    inputCostRaw: 0.10,
    speed: 'Fast',
    capabilities: ['Chat', 'Code', 'Vision', 'Audio'],
    license: 'Proprietary',
    paramCount: '—',
    paramCountRaw: 0,
    mmlu: 88.9,
    humanEval: 82.0,
    description: "Google's fastest multimodal model with a 1M token context window and native audio/image understanding. Optimized for real-time applications and high-throughput workloads.",
    useCases: ['Real-time applications', 'Document processing', 'Multimodal tasks', 'Long-context Q&A'],
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    providerColor: '#0668E1',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$0.59',
    outputCost: '$0.79',
    inputCostRaw: 0.59,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code'],
    license: 'Llama',
    paramCount: '70B',
    paramCountRaw: 70,
    mmlu: 88.5,
    humanEval: 88.4,
    description: "Meta's latest and most capable Llama release. Delivers performance on par with Llama 3.1 405B on many benchmarks at a fraction of the compute cost.",
    useCases: ['General assistant', 'Code generation', 'Instruction following', 'Fine-tuning base'],
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    providerColor: '#7C3AED',
    contextWindow: '128K',
    contextWindowRaw: 128000,
    inputCost: '$0.27',
    outputCost: '$1.10',
    inputCostRaw: 0.27,
    speed: 'Balanced',
    capabilities: ['Chat', 'Code', 'Reasoning'],
    license: 'MIT',
    paramCount: '671B',
    paramCountRaw: 671,
    mmlu: 88.5,
    humanEval: 89.1,
    description: "DeepSeek's MoE frontier model with 671B total parameters and 37B active per token. Achieves frontier-level performance at remarkably low inference cost through efficient sparse activation.",
    useCases: ['Code generation', 'Complex reasoning', 'Multilingual tasks', 'Long-form writing'],
  },
]

export type ApiKey = {
  id: string
  name: string
  masked: string
  project: string
  projectId: string
  labels: string[]
  lastUsed: string
  created: string
  status: 'active' | 'revoked' | 'rotating'
  rotatingExpiresIn?: string
  requests7d: number
  expiresAt: string | null
}

export const API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'prod-key-01',
    masked: 'tf-sk_l...a4f2',
    project: 'Production API',
    projectId: 'tf-proj_a1b2c3d4',
    labels: ['env:production', 'team:backend'],
    lastUsed: '2 min ago',
    created: 'Mar 28, 2026',
    status: 'active',
    requests7d: 64210,
    expiresAt: null,
  },
  {
    id: 'key-2',
    name: 'staging-key-02',
    masked: 'tf-sk_l...7c91',
    project: 'Staging',
    projectId: 'tf-proj_e5f6g7h8',
    labels: ['env:staging'],
    lastUsed: '1h ago',
    created: 'Mar 25, 2026',
    status: 'rotating',
    rotatingExpiresIn: '23h',
    requests7d: 3840,
    expiresAt: 'Jun 25, 2026',
  },
  {
    id: 'key-3',
    name: 'analytics-pipeline',
    masked: 'tf-sk_l...2b38',
    project: 'Analytics Pipeline',
    projectId: 'tf-proj_i9j0k1l2',
    labels: ['env:dev', 'team:ml-ops'],
    lastUsed: '3h ago',
    created: 'Mar 20, 2026',
    status: 'active',
    requests7d: 12480,
    expiresAt: 'Sep 20, 2026',
  },
  {
    id: 'key-4',
    name: 'ci-pipeline-key',
    masked: 'tf-sk_l...9x12',
    project: 'Internal Tooling',
    projectId: 'tf-proj_a1b2c3d4',
    labels: ['env:ci', 'service:pipeline'],
    lastUsed: '12h ago',
    created: 'Mar 15, 2026',
    status: 'active',
    requests7d: 880,
    expiresAt: 'Mar 15, 2027',
  },
]

export type Project = {
  id: string
  name: string
  description: string
  modelAllowlist: string[]
  rpmLimit: number
  dailyCap?: number
  monthlyCap?: number
  keyCount: number
  monthlySpend: string
  status: 'active' | 'archived'
}

export const PROJECTS: Project[] = [
  {
    id: 'tf-proj_a1b2c3d4',
    name: 'Production API',
    description: 'Customer-facing production environment',
    modelAllowlist: ['claude-sonnet-4-6', 'claude-haiku-4-5', 'gpt-4o-mini'],
    rpmLimit: 500,
    dailyCap: 50,
    monthlyCap: 1000,
    keyCount: 2,
    monthlySpend: '$8.42',
    status: 'active',
  },
  {
    id: 'tf-proj_e5f6g7h8',
    name: 'Staging',
    description: 'Pre-production testing environment',
    modelAllowlist: ['claude-sonnet-4-6', 'gpt-4o', 'llama-3.1-70b'],
    rpmLimit: 100,
    dailyCap: 10,
    keyCount: 1,
    monthlySpend: '$2.15',
    status: 'active',
  },
  {
    id: 'tf-proj_i9j0k1l2',
    name: 'Analytics Pipeline',
    description: 'Batch processing and model evaluation',
    modelAllowlist: [],
    rpmLimit: 200,
    dailyCap: 10,
    keyCount: 1,
    monthlySpend: '$2.00',
    status: 'active',
  },
  {
    id: 'tf-proj_m3n4o5p6',
    name: 'Internal Tooling',
    description: 'CI/CD and internal automation',
    modelAllowlist: ['claude-haiku-4-5', 'gpt-4o-mini'],
    rpmLimit: 60,
    dailyCap: 5,
    keyCount: 1,
    monthlySpend: '$0.00',
    status: 'active',
  },
]

export type UsageStat = {
  date: string
  requests: number
  tokens: number
  cost: number
  errors: number
}

export const USAGE_DAILY: UsageStat[] = [
  { date: 'Mar 17', requests: 4200, tokens: 310000, cost: 0.72, errors: 12 },
  { date: 'Mar 18', requests: 5800, tokens: 420000, cost: 0.98, errors: 8 },
  { date: 'Mar 19', requests: 5100, tokens: 380000, cost: 0.89, errors: 15 },
  { date: 'Mar 20', requests: 7200, tokens: 540000, cost: 1.24, errors: 22 },
  { date: 'Mar 21', requests: 6400, tokens: 480000, cost: 1.12, errors: 9 },
  { date: 'Mar 22', requests: 8100, tokens: 620000, cost: 1.43, errors: 18 },
  { date: 'Mar 23', requests: 7700, tokens: 590000, cost: 1.37, errors: 11 },
  { date: 'Mar 24', requests: 9200, tokens: 710000, cost: 1.65, errors: 24 },
  { date: 'Mar 25', requests: 8600, tokens: 660000, cost: 1.52, errors: 14 },
  { date: 'Mar 26', requests: 10400, tokens: 800000, cost: 1.88, errors: 31 },
  { date: 'Mar 27', requests: 9900, tokens: 760000, cost: 1.77, errors: 19 },
  { date: 'Mar 28', requests: 11500, tokens: 890000, cost: 2.07, errors: 28 },
  { date: 'Mar 29', requests: 10800, tokens: 830000, cost: 1.93, errors: 16 },
  { date: 'Mar 30', requests: 12481, tokens: 962000, cost: 2.24, errors: 35 },
]

export type ModelUsage = {
  model: string
  provider: string
  requests: number
  inputTokens: number
  outputTokens: number
  cost: number
  p50: number
  p95: number
  p99: number
  errorRate: number
  trend: number[]
}

export const MODEL_USAGE: ModelUsage[] = [
  {
    model: 'claude-haiku-4-5',
    provider: 'Anthropic',
    requests: 8200,
    inputTokens: 4100000,
    outputTokens: 1200000,
    cost: 4.28,
    p50: 320,
    p95: 780,
    p99: 1240,
    errorRate: 0.8,
    trend: [310, 318, 305, 322, 315, 320, 317],
  },
  {
    model: 'gpt-4o-mini',
    provider: 'OpenAI',
    requests: 2900,
    inputTokens: 1900000,
    outputTokens: 580000,
    cost: 3.63,
    p50: 410,
    p95: 920,
    p99: 1580,
    errorRate: 1.2,
    trend: [395, 420, 408, 415, 410, 418, 410],
  },
  {
    model: 'claude-sonnet-4-6',
    provider: 'Anthropic',
    requests: 850,
    inputTokens: 1200000,
    outputTokens: 380000,
    cost: 9.30,
    p50: 890,
    p95: 2100,
    p99: 3400,
    errorRate: 0.4,
    trend: [880, 910, 870, 895, 890, 885, 890],
  },
  {
    model: 'llama-3.1-70b',
    provider: 'Meta',
    requests: 480,
    inputTokens: 620000,
    outputTokens: 180000,
    cost: 0.70,
    p50: 540,
    p95: 1200,
    p99: 2100,
    errorRate: 2.1,
    trend: [560, 520, 545, 535, 550, 540, 540],
  },
]

export type Transaction = {
  id: string
  date: string
  model: string
  inputTokens: number
  outputTokens: number
  cost: string
  keyName: string
}

export const TRANSACTIONS: Transaction[] = [
  { id: 'tx-001', date: 'Mar 30, 2026 11:48', model: 'claude-haiku-4-5', inputTokens: 1240, outputTokens: 380, cost: '$0.0024', keyName: 'prod-key-01' },
  { id: 'tx-002', date: 'Mar 30, 2026 11:45', model: 'gpt-4o-mini', inputTokens: 890, outputTokens: 210, cost: '$0.0003', keyName: 'prod-key-01' },
  { id: 'tx-003', date: 'Mar 30, 2026 11:41', model: 'claude-sonnet-4-6', inputTokens: 3200, outputTokens: 1100, cost: '$0.0261', keyName: 'analytics-pipeline' },
  { id: 'tx-004', date: 'Mar 30, 2026 11:38', model: 'claude-haiku-4-5', inputTokens: 680, outputTokens: 220, cost: '$0.0014', keyName: 'prod-key-01' },
  { id: 'tx-005', date: 'Mar 30, 2026 11:30', model: 'llama-3.1-70b', inputTokens: 2100, outputTokens: 640, cost: '$0.0024', keyName: 'staging-key-02' },
  { id: 'tx-006', date: 'Mar 30, 2026 11:22', model: 'gpt-4o-mini', inputTokens: 540, outputTokens: 180, cost: '$0.0002', keyName: 'prod-key-01' },
  { id: 'tx-007', date: 'Mar 30, 2026 11:15', model: 'claude-haiku-4-5', inputTokens: 920, outputTokens: 310, cost: '$0.0020', keyName: 'ci-pipeline-key' },
]

export const ACTIVITY = [
  { type: 'error', title: 'Rate limit hit', desc: '14 requests dropped on prod-key-01 · Production API', time: '4m ago' },
  { type: 'warn', title: 'Budget alert', desc: 'Analytics Pipeline at 80% of $10/day cap', time: '1h ago' },
  { type: 'info', title: 'Key rotation started', desc: 'staging-key-02 — 23h grace period remaining', time: '3h ago' },
  { type: 'success', title: 'Webhook delivered', desc: 'POST api.acme.com/hooks/inference · 200 OK', time: '5h ago' },
  { type: 'success', title: 'New API key created', desc: 'analytics-pipeline created by gk@infinia.ai', time: '10h ago' },
  { type: 'info', title: 'Model added', desc: 'gpt-4o-mini enabled on Production API project', time: '1d ago' },
  { type: 'warn', title: 'Slow response detected', desc: 'llama-3.1-70b p99 latency > 3s for 12min', time: '2d ago' },
  { type: 'success', title: 'Project created', desc: 'Internal Tooling project created', time: '2d ago' },
]

export const PLAYGROUND_MESSAGES = [
  {
    role: 'user' as const,
    content: 'What models does AI Gateway support?',
  },
  {
    role: 'assistant' as const,
    content: 'AI Gateway supports models from multiple providers accessible via a unified OpenAI-compatible API:\n\n**Anthropic** — Claude Sonnet 4.6, Claude Haiku 4.5\n**OpenAI** — GPT-4o, GPT-4o Mini\n**Meta** — Llama 3.1 8B, 70B Instruct\n**Mistral** — Mixtral 8x22B\n**Google** — Gemini 1.5 Pro\n**DeepSeek** — DeepSeek R1\n\nAll models are accessible via `POST /v1/chat/completions` with your `tf-` prefixed API key.',
    meta: { model: 'claude-haiku-4-5', inputTokens: 12, outputTokens: 78, cost: 0.0003, latency: 340 },
  },
]
