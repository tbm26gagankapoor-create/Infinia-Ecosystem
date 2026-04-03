export type Phase = 'rd' | 'alpha' | 'beta' | 'ga' | 'sunset'
export type ProductStatus = 'active' | 'paused' | 'deprecated'
export type ProductStream = 'foundation' | 'ai-foundation' | 'agents'
export type UpdateType = 'feature' | 'bugfix' | 'launch' | 'milestone'
export type DocType = 'prd' | 'market-research' | 'onepager' | 'technical'

export interface RevenueHistory { month: string; amount: number }
export interface UsageHistory { month: string; users: number }

export interface ProductDocument {
  label: string
  type: DocType
  url: string
  description: string
}

export interface ProductUpdate {
  date: string
  title: string
  type: UpdateType
  description: string
}

export interface Product {
  id: string
  name: string
  shortName: string
  description: string
  mission: string
  icon: string
  phase: Phase
  status: ProductStatus
  stream: ProductStream
  productManager: string
  foundedDate: string
  tags: string[]
  keyFeatures: string[]
  techStack: string[]
  relatedProductIds: string[]
  documents: ProductDocument[]
  revenue: {
    mrr: number
    arr: number
    growthRate: number
    history: RevenueHistory[]
  }
  usage: {
    dau: number
    mau: number
    totalUsers: number
    growthRate: number
    history: UsageHistory[]
  }
  updates: ProductUpdate[]
}

// 12-month window: Apr 2025 – Mar 2026
export const ALL_MONTHS = [
  '2025-04','2025-05','2025-06','2025-07','2025-08','2025-09',
  '2025-10','2025-11','2025-12','2026-01','2026-02','2026-03',
]

function makeRevHistory(start: number, rate: number): RevenueHistory[] {
  return ALL_MONTHS.map((month, i) => ({
    month,
    amount: Math.round(start * Math.pow(1 + rate / 100, i)),
  }))
}

function makeUsageHistory(start: number, rate: number): UsageHistory[] {
  return ALL_MONTHS.map((month, i) => ({
    month,
    users: Math.round(start * Math.pow(1 + rate / 100, i)),
  }))
}

export const PRODUCTS: Product[] = [

  // ── FOUNDATION STREAM ──────────────────────────────────────

  {
    id: 'prod-ccs',
    name: 'Coredge Container Service',
    shortName: 'CCS',
    description: 'Scalable container orchestration and management platform providing enterprise-grade container lifecycle management, registry, and networking across hybrid environments.',
    mission: 'Give every team a reliable, self-service container platform that runs consistently from dev laptops to production at scale.',
    icon: '📦',
    phase: 'ga',
    status: 'active',
    stream: 'foundation',
    productManager: 'Rami Nassar',
    foundedDate: '2023-06-01',
    tags: ['containers', 'orchestration', 'devops', 'infrastructure'],
    keyFeatures: ['Multi-cluster management', 'Private registry', 'Automated CI/CD integration', 'Network policy engine', 'RBAC & audit logs'],
    techStack: ['Go', 'containerd', 'etcd', 'PostgreSQL', 'React'],
    relatedProductIds: ['prod-ckp', 'prod-cvm', 'prod-aigw'],
    documents: [],
    revenue: { mrr: 185000, arr: 2220000, growthRate: 9.2, history: makeRevHistory(110000, 4.2) },
    usage: { dau: 620, mau: 2400, totalUsers: 5200, growthRate: 11, history: makeUsageHistory(1400, 5) },
    updates: [
      { date: '2026-03-18', title: 'v3.1 — Multi-arch images', type: 'launch', description: 'Native ARM64/AMD64 multi-architecture image builds via BuildKit.' },
      { date: '2026-02-10', title: 'Registry webhooks', type: 'feature', description: 'Push-event webhooks for triggering downstream CI pipelines.' },
      { date: '2026-01-08', title: 'Security scan integration', type: 'feature', description: 'Built-in Trivy scanning on every image push to private registry.' },
    ],
  },

  {
    id: 'prod-ckp',
    name: 'Coredge Kubernetes Platform',
    shortName: 'CKP',
    description: 'Enterprise-grade managed Kubernetes platform offering fully-automated cluster lifecycle management, multi-tenancy, and deep observability across on-premise and cloud deployments.',
    mission: 'Make Kubernetes production-ready for enterprises without requiring dedicated Kubernetes expertise in every team.',
    icon: '⚓',
    phase: 'ga',
    status: 'active',
    stream: 'foundation',
    productManager: 'Rami Nassar',
    foundedDate: '2023-01-15',
    tags: ['kubernetes', 'orchestration', 'infrastructure', 'enterprise'],
    keyFeatures: ['Automated cluster lifecycle', 'Multi-tenant namespacing', 'GitOps integration', 'Policy as code', 'Cluster observability'],
    techStack: ['Go', 'Kubernetes', 'Helm', 'ArgoCD', 'Prometheus'],
    relatedProductIds: ['prod-ccs', 'prod-cvm', 'prod-dflare'],
    documents: [],
    revenue: { mrr: 228000, arr: 2736000, growthRate: 7.4, history: makeRevHistory(142000, 3.8) },
    usage: { dau: 780, mau: 2900, totalUsers: 6400, growthRate: 9, history: makeUsageHistory(1800, 4.2) },
    updates: [
      { date: '2026-03-22', title: 'K8s 1.32 support', type: 'feature', description: 'Certified support for Kubernetes 1.32 across all cluster tiers.' },
      { date: '2026-02-14', title: 'GitOps workflows', type: 'feature', description: 'First-class ArgoCD integration for declarative cluster management.' },
      { date: '2025-12-01', title: 'Policy engine GA', type: 'launch', description: 'OPA-based policy engine now available to all customers.' },
    ],
  },

  {
    id: 'prod-cvm',
    name: 'Coredge Virtual Machines',
    shortName: 'CVM',
    description: 'Flexible, high-performance virtual machine infrastructure delivering bare-metal-like compute with cloud-native provisioning APIs, snapshots, and live migration.',
    mission: 'Provide the raw compute foundation that powers every Coredge product and customer workload, with the simplicity of cloud APIs.',
    icon: '🖥️',
    phase: 'ga',
    status: 'active',
    stream: 'foundation',
    productManager: 'Priya Mehta',
    foundedDate: '2022-09-01',
    tags: ['compute', 'vms', 'infrastructure', 'cloud'],
    keyFeatures: ['Instant provisioning', 'Live migration', 'Snapshot & restore', 'Custom networking', 'GPU passthrough'],
    techStack: ['Go', 'KVM/QEMU', 'Ceph', 'Linux', 'React'],
    relatedProductIds: ['prod-ccs', 'prod-ckp', 'prod-dflare'],
    documents: [],
    revenue: { mrr: 302000, arr: 3624000, growthRate: 6.1, history: makeRevHistory(198000, 3.2) },
    usage: { dau: 1100, mau: 3800, totalUsers: 9200, growthRate: 7, history: makeUsageHistory(2400, 3.5) },
    updates: [
      { date: '2026-03-10', title: 'GPU passthrough GA', type: 'launch', description: 'NVIDIA GPU passthrough now supported on all bare-metal tiers.' },
      { date: '2026-01-20', title: 'Live migration v2', type: 'feature', description: 'Zero-downtime live migration with under 50ms switchover.' },
    ],
  },

  {
    id: 'prod-orbiter',
    name: 'Cloud Orbiter',
    shortName: 'Cloud Orbiter',
    description: 'Multi-cloud management and orchestration platform that provides a unified control plane for workloads spanning public clouds, private data centres, and edge locations.',
    mission: 'Eliminate cloud vendor lock-in by giving enterprises a single pane of glass for all their cloud environments.',
    icon: '🌐',
    phase: 'beta',
    status: 'active',
    stream: 'foundation',
    productManager: 'Omar Khalil',
    foundedDate: '2024-08-01',
    tags: ['multi-cloud', 'orchestration', 'management', 'enterprise'],
    keyFeatures: ['Unified dashboard', 'Cross-cloud cost visibility', 'Policy enforcement', 'Workload migration', 'Cloud-agnostic networking'],
    techStack: ['Go', 'Terraform', 'React', 'PostgreSQL', 'Prometheus'],
    relatedProductIds: ['prod-ckp', 'prod-cvm'],
    documents: [],
    revenue: { mrr: 42000, arr: 504000, growthRate: 28.3, history: makeRevHistory(9000, 13) },
    usage: { dau: 145, mau: 520, totalUsers: 840, growthRate: 32, history: makeUsageHistory(120, 14) },
    updates: [
      { date: '2026-03-28', title: 'AWS + Azure connectors', type: 'feature', description: 'Native read/write connectors for AWS EC2 and Azure VMs.' },
      { date: '2026-02-15', title: 'Cost explorer', type: 'feature', description: 'Cross-cloud cost breakdown with attribution by team and project.' },
      { date: '2025-10-01', title: 'Beta launch', type: 'launch', description: 'Cloud Orbiter opens to public beta with 20 design partners.' },
    ],
  },

  // ── AI FOUNDATION STREAM ───────────────────────────────────

  {
    id: 'prod-dflare',
    name: 'Dflare AI',
    shortName: 'Dflare AI',
    description: 'Fully managed GPU-as-a-Service platform for AI, ML, and HPC workloads at scale. Delivers bare-metal GPU clusters as production-ready, multi-tenant compute with sovereign cloud capabilities.',
    mission: 'Bridge bare-metal GPU performance and cloud simplicity — enabling any organisation to deploy world-class AI infrastructure without the operational complexity.',
    icon: '⚡',
    phase: 'ga',
    status: 'active',
    stream: 'ai-foundation',
    productManager: 'Gagan Kapoor',
    foundedDate: '2023-11-01',
    tags: ['gpu', 'ai', 'hpc', 'infrastructure', 'sovereign-cloud'],
    keyFeatures: ['Bare-metal GPU provisioning', 'GPU cluster orchestration (K8s/HPC)', 'Tenant-isolated VPCs', 'High-performance parallel storage', 'RBAC & ABAC multi-tenancy', 'Usage billing & metering', 'Real-time GPU monitoring'],
    techStack: ['Go', 'Kubernetes', 'SLURM', 'NVIDIA DCGM', 'Ceph', 'React'],
    relatedProductIds: ['prod-aigw', 'prod-ckp', 'prod-cvm'],
    documents: [],
    revenue: { mrr: 420000, arr: 5040000, growthRate: 18.5, history: makeRevHistory(180000, 7.5) },
    usage: { dau: 840, mau: 3100, totalUsers: 5800, growthRate: 22, history: makeUsageHistory(1200, 9) },
    updates: [
      { date: '2026-03-25', title: 'H200 GPU support', type: 'feature', description: 'NVIDIA H200 clusters now available in all Tier-1 regions.' },
      { date: '2026-02-20', title: 'Sovereign AI tier', type: 'launch', description: 'On-premise sovereign GPU cloud tier for government and regulated industries.' },
      { date: '2026-01-10', title: 'Parallel storage v2', type: 'feature', description: 'New parallel filesystem delivering 400 GB/s aggregate throughput.' },
      { date: '2025-11-01', title: 'Multi-tenancy GA', type: 'launch', description: 'Full RBAC/ABAC tenant isolation reaches General Availability.' },
    ],
  },

  {
    id: 'prod-aigw',
    name: 'AI Gateway',
    shortName: 'AiGW',
    description: 'Enterprise-grade LLM routing and access control platform that unifies model providers under a single, observable, cost-efficient API surface.',
    mission: 'Make enterprise AI adoption frictionless by providing a secure, observable, and cost-efficient gateway to any LLM.',
    icon: '🔀',
    phase: 'ga',
    status: 'active',
    stream: 'ai-foundation',
    productManager: 'Gagan Kapoor',
    foundedDate: '2024-06-01',
    tags: ['api-gateway', 'llm', 'ai', 'enterprise', 'inference'],
    keyFeatures: ['Multi-provider routing', 'Rate limiting & budgets', 'Audit logging', 'Org-level isolation', 'Model allowlists', 'Streaming support'],
    techStack: ['Go', 'PostgreSQL', 'Redis', 'React', 'TypeScript'],
    relatedProductIds: ['prod-dflare', 'prod-llmops', 'prod-xaylon'],
    documents: [
      { label: 'User PRD', type: 'prd', url: '/PRD.html', description: 'Full product requirements for the user-facing portal and API.' },
      { label: 'Admin PRD', type: 'prd', url: '/admin-prd.html', description: 'Admin console requirements — org management, billing, audit logs.' },
      { label: 'LLMOps PRD', type: 'technical', url: '/llm-ops-prd.html', description: 'LLM operations layer: model routing, observability, cost control.' },
      { label: 'Market Research', type: 'market-research', url: '/market-research.html', description: 'Competitive landscape, market sizing, and strategic positioning.' },
      { label: 'One-Pager', type: 'onepager', url: '/product-onepager.html', description: 'Executive summary of product vision and traction.' },
    ],
    revenue: { mrr: 302400, arr: 3628800, growthRate: 8.5, history: makeRevHistory(180000, 4.5) },
    usage: { dau: 420, mau: 1840, totalUsers: 3200, growthRate: 14.2, history: makeUsageHistory(800, 7) },
    updates: [
      { date: '2026-03-28', title: 'v2.4 Released', type: 'launch', description: 'Added DeepSeek R1 671B support and improved streaming latency by 22%.' },
      { date: '2026-03-10', title: 'Budget Alerts', type: 'feature', description: 'Orgs can now configure spend threshold email + webhook alerts.' },
      { date: '2026-02-15', title: 'Audit Log Export', type: 'feature', description: 'CSV and JSON export for audit logs up to 90 days.' },
      { date: '2026-01-20', title: 'p99 Latency Fix', type: 'bugfix', description: 'Resolved tail latency spike under high concurrency on Redis pool exhaustion.' },
      { date: '2025-11-01', title: 'GA Launch', type: 'milestone', description: 'AI Gateway reaches General Availability after 8 months in beta.' },
    ],
  },

  {
    id: 'prod-llmops',
    name: 'LLMOps',
    shortName: 'LLMOps',
    description: 'Observability and operations platform for LLM workloads — traces every inference call, surfaces cost anomalies, and provides evaluation and fine-tuning pipelines.',
    mission: 'Give ML and platform teams full visibility into how LLMs behave in production at the request level.',
    icon: '🔭',
    phase: 'beta',
    status: 'active',
    stream: 'ai-foundation',
    productManager: 'Sara Al Rashid',
    foundedDate: '2025-01-15',
    tags: ['mlops', 'observability', 'llm', 'platform'],
    keyFeatures: ['Request tracing', 'Cost attribution', 'Latency percentiles (p50/p95/p99)', 'Fine-tuning pipelines', 'Eval framework'],
    techStack: ['Python', 'ClickHouse', 'Go', 'React', 'OpenTelemetry'],
    relatedProductIds: ['prod-aigw', 'prod-dflare'],
    documents: [
      { label: 'PRD', type: 'prd', url: '/llm-ops-prd.html', description: 'Full product requirements for the LLMOps platform.' },
    ],
    revenue: { mrr: 42000, arr: 504000, growthRate: 24.3, history: makeRevHistory(10000, 12) },
    usage: { dau: 140, mau: 520, totalUsers: 880, growthRate: 28, history: makeUsageHistory(120, 14) },
    updates: [
      { date: '2026-03-15', title: 'Eval framework', type: 'feature', description: 'Built-in evaluation harness for comparing model outputs across prompts.' },
      { date: '2026-02-20', title: 'Cost anomaly alerts', type: 'feature', description: 'Automatic alerts when per-org spend deviates >2σ from baseline.' },
      { date: '2026-01-10', title: 'OpenTelemetry bridge', type: 'feature', description: 'Traces export to any OTel-compatible backend (Grafana, Honeycomb).' },
    ],
  },

  // ── AGENTS & APPLICATIONS STREAM ──────────────────────────

  {
    id: 'prod-corobots',
    name: 'CoRobots',
    shortName: 'CoRobots',
    description: 'Edge computing platform for robotics and IoT workloads — provides low-latency compute, fleet management, OTA updates, and AI inference at the edge for connected devices.',
    mission: 'Bring cloud-grade orchestration to the edge so robotics and IoT teams can deploy and manage fleets at scale without connectivity constraints.',
    icon: '🤖',
    phase: 'beta',
    status: 'active',
    stream: 'agents',
    productManager: 'Nadia Osman',
    foundedDate: '2024-11-01',
    tags: ['edge', 'robotics', 'iot', 'ai-inference', 'fleet-management'],
    keyFeatures: ['Edge fleet management', 'OTA update pipelines', 'On-device AI inference', 'Low-latency messaging', 'Remote diagnostics'],
    techStack: ['Go', 'Rust', 'MQTT', 'Kubernetes', 'React'],
    relatedProductIds: ['prod-dflare', 'prod-aigw'],
    documents: [],
    revenue: { mrr: 28000, arr: 336000, growthRate: 35.8, history: makeRevHistory(6000, 15) },
    usage: { dau: 95, mau: 340, totalUsers: 580, growthRate: 42, history: makeUsageHistory(80, 18) },
    updates: [
      { date: '2026-03-20', title: 'OTA v2', type: 'feature', description: 'Delta OTA updates — only changed binaries transferred, reducing bandwidth 80%.' },
      { date: '2026-02-08', title: 'On-device inference', type: 'feature', description: 'Run ONNX models locally on edge nodes with CUDA/CPU fallback.' },
      { date: '2025-12-01', title: 'Beta launch', type: 'launch', description: 'CoRobots opens to beta with 15 robotics companies in manufacturing and logistics.' },
    ],
  },

  {
    id: 'prod-xaylon',
    name: 'Xaylon',
    shortName: 'Xaylon',
    description: 'AI agent platform for enterprise workflows — build, deploy, and monitor multi-step AI agents that integrate with existing business systems over a unified runtime.',
    mission: 'Turn LLM capabilities into reliable, auditable business workflows without requiring ML expertise.',
    icon: '🧠',
    phase: 'beta',
    status: 'active',
    stream: 'agents',
    productManager: 'Lena Hoffman',
    foundedDate: '2025-02-01',
    tags: ['agents', 'ai', 'automation', 'enterprise', 'workflow'],
    keyFeatures: ['Visual agent builder', 'Tool integrations (Slack, Jira, SF)', 'Human-in-the-loop approvals', 'Agent monitoring & traces', 'Version control & rollback'],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'React', 'LangGraph'],
    relatedProductIds: ['prod-aigw', 'prod-llmops'],
    documents: [],
    revenue: { mrr: 38000, arr: 456000, growthRate: 38.2, history: makeRevHistory(7000, 16) },
    usage: { dau: 120, mau: 440, totalUsers: 720, growthRate: 42, history: makeUsageHistory(80, 18) },
    updates: [
      { date: '2026-03-25', title: 'Salesforce connector', type: 'feature', description: 'Native Salesforce integration — agents can read/write CRM data.' },
      { date: '2026-02-18', title: 'Agent versioning', type: 'feature', description: 'Agents now support semantic versioning and one-click rollback.' },
      { date: '2026-01-15', title: 'Beta launch', type: 'launch', description: 'Xaylon opens to public beta after 3 months in private preview.' },
    ],
  },

  {
    id: 'prod-esal',
    name: 'Esal Tech',
    shortName: 'Esal',
    description: 'Sovereign cloud-based electronic invoicing platform combining blockchain security with automated compliance for UAE businesses. Peppol-certified with AI-powered fraud detection.',
    mission: 'Make e-invoicing seamless, compliant, and secure for every business operating in the UAE and GCC region.',
    icon: '/logos/esal-tech.svg',
    phase: 'ga',
    status: 'active',
    stream: 'agents',
    productManager: 'Omar Khalil',
    foundedDate: '2024-03-01',
    tags: ['einvoicing', 'compliance', 'blockchain', 'uae', 'fintech'],
    keyFeatures: ['Peppol-certified invoicing', 'Blockchain audit trails', 'AI fraud detection', 'VAT reconciliation', 'ERP integrations (SAP, Oracle, Dynamics 365)', 'Paper-to-digital scanning'],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'React', 'Blockchain'],
    relatedProductIds: ['prod-aigw', 'prod-xaylon'],
    documents: [],
    revenue: { mrr: 68000, arr: 816000, growthRate: 22.5, history: makeRevHistory(20000, 10) },
    usage: { dau: 280, mau: 1100, totalUsers: 2400, growthRate: 30, history: makeUsageHistory(300, 12) },
    updates: [
      { date: '2026-03-20', title: 'Peppol certification', type: 'milestone', description: 'Achieved full Peppol Access Point certification for international e-invoicing.' },
      { date: '2026-02-12', title: 'SAP connector', type: 'feature', description: 'Native SAP S/4HANA integration for automated invoice sync.' },
      { date: '2026-01-05', title: 'AI fraud detection', type: 'feature', description: 'ML model detects anomalous invoice patterns with 97% accuracy.' },
    ],
  },

  {
    id: 'prod-cyberpod',
    name: 'CyberPod',
    shortName: 'CyberPod',
    description: 'Flagship AI platform for enterprise data workflows — transforms enterprise data into institutional intelligence with sovereign, autonomous data processing pipelines.',
    mission: 'Enable enterprises to harness their data as institutional intelligence without compromising sovereignty or security.',
    icon: '/logos/zysec.svg',
    phase: 'beta',
    status: 'active',
    stream: 'agents',
    productManager: 'Sara Al Rashid',
    foundedDate: '2025-04-01',
    tags: ['ai', 'data-intelligence', 'enterprise', 'sovereign', 'automation'],
    keyFeatures: ['Autonomous data pipelines', 'Sovereign data processing', 'Enterprise knowledge graphs', 'AI-powered analytics', 'Data governance & compliance', 'Multi-source integration'],
    techStack: ['Python', 'TypeScript', 'PostgreSQL', 'React', 'LangChain'],
    relatedProductIds: ['prod-aigw', 'prod-dflare', 'prod-llmops'],
    documents: [],
    revenue: { mrr: 35000, arr: 420000, growthRate: 32.1, history: makeRevHistory(8000, 14) },
    usage: { dau: 110, mau: 420, totalUsers: 680, growthRate: 38, history: makeUsageHistory(90, 16) },
    updates: [
      { date: '2026-03-18', title: 'Knowledge graph engine', type: 'feature', description: 'Auto-builds enterprise knowledge graphs from unstructured documents.' },
      { date: '2026-02-22', title: 'Sovereign processing', type: 'feature', description: 'All data processing stays within customer-defined geographic boundaries.' },
      { date: '2026-01-15', title: 'Beta launch', type: 'launch', description: 'CyberPod opens to enterprise beta with 10 design partners.' },
    ],
  },

  {
    id: 'prod-xaylon-studio',
    name: 'Xaylon Studio',
    shortName: 'Xaylon Studio',
    description: 'Developer IDE and testing environment for building and debugging Xaylon agents locally before deployment — like VS Code for AI agent development.',
    mission: 'Give developers a fast, frictionless local development loop for agent building without needing a cloud environment.',
    icon: '🎛️',
    phase: 'alpha',
    status: 'active',
    stream: 'agents',
    productManager: 'Lena Hoffman',
    foundedDate: '2025-11-01',
    tags: ['devtools', 'agents', 'ide', 'developer', 'local'],
    keyFeatures: ['Local agent runner', 'Step debugger', 'Mock tool responses', 'Trace visualiser', 'One-click deploy to Xaylon'],
    techStack: ['TypeScript', 'Electron', 'React', 'Node.js'],
    relatedProductIds: ['prod-xaylon'],
    documents: [],
    revenue: { mrr: 0, arr: 0, growthRate: 0, history: makeRevHistory(0, 0) },
    usage: { dau: 28, mau: 85, totalUsers: 120, growthRate: 55, history: makeUsageHistory(15, 25) },
    updates: [
      { date: '2026-03-12', title: 'Trace visualiser', type: 'feature', description: 'Interactive flame graph for debugging multi-step agent execution.' },
      { date: '2026-02-05', title: 'Alpha access', type: 'launch', description: 'Opened to all Xaylon beta users as a companion dev tool.' },
    ],
  },
]

// ── Aggregates ─────────────────────────────────────────────────

export const TOTAL_MRR = PRODUCTS.reduce((s, p) => s + p.revenue.mrr, 0)
export const TOTAL_ARR = PRODUCTS.reduce((s, p) => s + p.revenue.arr, 0)
export const TOTAL_USERS = PRODUCTS.reduce((s, p) => s + p.usage.totalUsers, 0)
export const TOTAL_MAU = PRODUCTS.reduce((s, p) => s + p.usage.mau, 0)

export const PRODUCTS_BY_PHASE = {
  rd: PRODUCTS.filter(p => p.phase === 'rd').length,
  alpha: PRODUCTS.filter(p => p.phase === 'alpha').length,
  beta: PRODUCTS.filter(p => p.phase === 'beta').length,
  ga: PRODUCTS.filter(p => p.phase === 'ga').length,
  sunset: PRODUCTS.filter(p => p.phase === 'sunset').length,
}

export const PRODUCTS_BY_STREAM = {
  foundation: PRODUCTS.filter(p => p.stream === 'foundation'),
  'ai-foundation': PRODUCTS.filter(p => p.stream === 'ai-foundation'),
  agents: PRODUCTS.filter(p => p.stream === 'agents'),
}

// Portfolio combined revenue history (sum per month)
export const PORTFOLIO_REVENUE_HISTORY = ALL_MONTHS.map(month => ({
  month,
  amount: PRODUCTS.reduce((sum, p) => {
    const entry = p.revenue.history.find(h => h.month === month)
    return sum + (entry?.amount ?? 0)
  }, 0),
}))

// All unique PMs
export const ALL_PMS = [...new Set(PRODUCTS.map(p => p.productManager))].sort()

// All recent updates across all products, newest first
export const ALL_RECENT_UPDATES = PRODUCTS.flatMap(p =>
  p.updates.map(u => ({
    ...u,
    productId: p.id,
    productName: p.name,
    productShortName: p.shortName,
  }))
).sort((a, b) => b.date.localeCompare(a.date))
