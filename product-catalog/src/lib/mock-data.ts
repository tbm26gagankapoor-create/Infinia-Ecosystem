import type { LayerId } from './constants'

export type Phase = 'rd' | 'alpha' | 'beta' | 'ga' | 'sunset'
export type ProductStatus = 'active' | 'paused' | 'deprecated'
export type ProductLayer = LayerId
export type UpdateType = 'feature' | 'bugfix' | 'launch' | 'milestone'
export type DocType = 'prd' | 'market-research' | 'onepager' | 'technical'

export interface RevenueHistory { month: string; amount: number }
export interface UsageHistory { month: string; users: number }

export interface MarkdownDoc {
  slug: string
  title: string
  filename: string
  description: string
}

export interface ProductDocument {
  id: string
  label: string
  type: DocType
  url: string
  description: string
  accentColor?: string
  basePath?: string
  markdownDocs?: MarkdownDoc[]
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
  screenshot?: string
  phase: Phase
  status: ProductStatus
  layer: ProductLayer
  productManager: string
  foundedDate: string
  websiteUrl: string
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

  // ── L1: INFRASTRUCTURE ────────────────────────────────────────

  {
    id: 'prod-ccs',
    name: 'Cirrus Cloud Suite',
    shortName: 'CCS',
    description: 'Full-stack IaaS and PaaS built on OpenStack and Kubernetes foundations — the ultimate cloud toolkit for VMs, storage, networking, and multi-cloud operations from a single unified platform.',
    mission: 'Give enterprises and governments a sovereign cloud toolkit with the completeness of public cloud and the control of on-premise — from edge deployments to full data-centre IaaS.',
    icon: '☁️',
    phase: 'ga',
    status: 'active',
    layer: 'l1',
    productManager: 'Rami Nassar',
    foundedDate: '2022-03-01',
    websiteUrl: 'https://coredge.io',
    tags: ['cloud', 'sovereign', 'iaas', 'paas', 'openstack', 'multi-cloud', 'enterprise'],
    keyFeatures: ['Multi-tenant isolation with self-service portal', 'Unified compute, storage & network management', 'OpenStack + Kubernetes foundation', 'Edge-ready design for distributed deployments', 'White-label capability for cloud service providers', 'Containerised control plane tested beyond 1,000 nodes', 'Zero-downtime operations with live migration'],
    techStack: ['OpenStack', 'Kubernetes', 'Go', 'Python', 'Ceph', 'Neutron', 'React'],
    relatedProductIds: ['prod-dflare', 'prod-hci', 'prod-ckp'],
    documents: [],
    revenue: { mrr: 280000, arr: 3360000, growthRate: 7.5, history: makeRevHistory(175000, 3.8) },
    usage: { dau: 950, mau: 3400, totalUsers: 8200, growthRate: 8, history: makeUsageHistory(2200, 4) },
    updates: [
      { date: '2026-03-22', title: 'Compass UI v3', type: 'feature', description: 'Redesigned Compass portal with instant VM provisioning, cost dashboards, and RBAC management.' },
      { date: '2026-01-18', title: '1,000-node scale validation', type: 'milestone', description: 'CCS control plane validated at 1,000+ node clusters with zero-downtime rolling upgrades.' },
      { date: '2025-11-05', title: 'Edge deployment GA', type: 'launch', description: 'Edge-ready CCS deployment packages now available for distributed sovereign zones.' },
    ],
  },

  {
    id: 'prod-dflare',
    name: 'Dflare.AI',
    shortName: 'Dflare.AI',
    description: 'Fully managed GPU-as-a-Service platform for organisations running large-scale AI, ML, and HPC workloads — converts bare-metal GPU servers into production-ready multi-tenant environments with hardware-enforced sovereignty.',
    mission: 'Power the complete AI lifecycle at scale — from raw GPU provisioning to LLM fine-tuning and inference — with sovereign, on-premise infrastructure that organisations fully control.',
    icon: '🔥',
    phase: 'ga',
    status: 'active',
    layer: 'l1',
    productManager: 'Rami Nassar',
    foundedDate: '2024-01-01',
    websiteUrl: 'https://coredge.io',
    tags: ['hpc', 'gpu-as-a-service', 'ai-cloud', 'slurm', 'infiniband', 'sovereign', 'mlops'],
    keyFeatures: ['Automated bare-metal GPU server provisioning (days → minutes)', 'Kubernetes & Slurm HPC cluster orchestration on GPU hardware', 'Per-tenant VPC with InfiniBand partition key isolation', 'High-performance parallel filesystem (multi-hundred GB/s throughput)', 'Multi-vendor GPU support: NVIDIA, AMD, Intel accelerators', 'Zero-trust security: RBAC + ABAC, mTLS, immutable audit logs', 'Usage-based billing across GPU-hours, storage, and networking', 'NIST 800-53, ISO 27001, HIPAA & GDPR aligned'],
    techStack: ['Go', 'Kubernetes', 'Slurm', 'InfiniBand / RDMA', 'NVIDIA GPU Operator', 'OAuth2 / JWT', 'Ceph', 'React'],
    relatedProductIds: ['prod-ccs', 'prod-hci', 'prod-corerun-mlops'],
    documents: [],
    revenue: { mrr: 195000, arr: 2340000, growthRate: 35.0, history: makeRevHistory(40000, 15) },
    usage: { dau: 380, mau: 1400, totalUsers: 2800, growthRate: 40, history: makeUsageHistory(350, 17) },
    updates: [
      { date: '2026-03-28', title: 'Slurm HPC operator GA', type: 'launch', description: 'Operator-based Slurm deployment for batch HPC workloads now generally available alongside Kubernetes clusters.' },
      { date: '2026-02-10', title: 'Multi-vendor GPU support', type: 'feature', description: 'AMD and Intel accelerators now fully supported alongside NVIDIA across all cluster tiers.' },
      { date: '2026-01-05', title: 'Zero-trust security layer', type: 'feature', description: 'mTLS between all services, immutable audit logging, and NIST 800-53 alignment shipped to all deployments.' },
    ],
  },

  {
    id: 'prod-hci',
    name: 'Infinia HCI',
    shortName: 'HCI',
    description: 'Next-generation Kubernetes-based hyperconverged infrastructure platform that unifies compute, storage, and networking into a single sovereign stack — the physical bedrock underpinning every Infinia deployment.',
    mission: 'Eliminate infrastructure complexity by converging all data-centre resources into a single, software-defined platform built for sovereign operation.',
    icon: '🖥️',
    phase: 'ga',
    status: 'active',
    layer: 'l1',
    productManager: 'Rami Nassar',
    foundedDate: '2022-06-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['infrastructure', 'hyperconverged', 'compute', 'storage', 'sovereign', 'kubernetes'],
    keyFeatures: ['Unified compute & storage plane', 'Software-defined networking', 'Live migration', 'Rack-scale deployment', 'Zero-trust networking'],
    techStack: ['Go', 'KVM/QEMU', 'Ceph', 'Linux', 'Kubernetes', 'React'],
    relatedProductIds: ['prod-ccs', 'prod-ckp', 'prod-cvm'],
    documents: [],
    revenue: { mrr: 310000, arr: 3720000, growthRate: 6.8, history: makeRevHistory(195000, 3.4) },
    usage: { dau: 1200, mau: 4100, totalUsers: 9800, growthRate: 7, history: makeUsageHistory(2600, 3.6) },
    updates: [
      { date: '2026-03-20', title: 'GPU passthrough GA', type: 'launch', description: 'NVIDIA GPU passthrough now supported on all bare-metal tiers.' },
      { date: '2026-01-15', title: 'Live migration v2', type: 'feature', description: 'Zero-downtime live migration with sub-50ms switchover.' },
      { date: '2025-11-01', title: 'Software-defined networking', type: 'feature', description: 'Integrated SDN layer with microsegmentation and policy enforcement.' },
    ],
  },

  {
    id: 'prod-ckp',
    name: 'Cloud Kubernetes Platform',
    shortName: 'CKP',
    description: 'Enterprise-grade Kubernetes distribution built and maintained by Coredge — takes upstream K8s and produces PGP-signed, supply-chain-verified binaries deployable on bare-metal and VMs across AMD64 and ARM64 architectures.',
    mission: 'Give every enterprise a Kubernetes distribution they can fully trust — supply-chain verified, lifecycle-managed, and deployable anywhere from data centres to air-gapped sovereign networks.',
    icon: '🐳',
    phase: 'ga',
    status: 'active',
    layer: 'l1',
    productManager: 'Rami Nassar',
    foundedDate: '2023-01-01',
    websiteUrl: 'https://coredge.io',
    tags: ['kubernetes', 'cncf', 'containers', 'sovereign', 'on-premise', 'supply-chain'],
    keyFeatures: ['PGP-signed package distribution via BYOH bundles', 'Supports K8s v1.29, v1.30, v1.31 (CNCF certified)', 'Automated cluster lifecycle via Cluster API + Kamaji', 'Karpenter-based autoscaling for CCS VM provider', 'Ceph-backed persistent storage (ckp-block storage class)', 'Velero backup & disaster recovery', 'TLS certificate management (10-year validity)', 'AMD64 & ARM64 architecture support'],
    techStack: ['Kubernetes', 'Go', 'Cluster API v1.7.7', 'Kamaji v0.16.0', 'Cert-Manager v1.15.3', 'containerd', 'Velero', 'Ceph'],
    relatedProductIds: ['prod-hci', 'prod-corerun-mlops', 'prod-cvm'],
    documents: [],
    revenue: { mrr: 245000, arr: 2940000, growthRate: 8.1, history: makeRevHistory(148000, 4.1) },
    usage: { dau: 820, mau: 3000, totalUsers: 6800, growthRate: 9.5, history: makeUsageHistory(1900, 4.5) },
    updates: [
      { date: '2026-04-01', title: 'CKP v2.0 release', type: 'launch', description: 'CKP v2.0 ships with Kubernetes 1.31.2, ARM64 support, and Kamaji hosted control planes.' },
      { date: '2026-02-14', title: 'Karpenter autoscaling', type: 'feature', description: 'Karpenter-based node autoscaling for CCS VM provider — scale clusters dynamically based on workload demand.' },
      { date: '2025-12-01', title: 'Supply-chain verification', type: 'feature', description: 'All K8s binaries (kubeadm, kubelet, kubectl) now PGP-signed and distributed via verified BYOH bundles.' },
    ],
  },

  {
    id: 'prod-cvm',
    name: 'Coredge Virtualization Machine',
    shortName: 'CVM',
    description: 'Sovereign OpenStack distribution engineered for performance-optimised VM workloads — eliminates virtualisation overhead while delivering full IaaS with block storage, network virtualisation, and identity management.',
    mission: 'Deliver virtualisation without the overhead — a lean, performance-first OpenStack distro that enterprises can operate on-premise with complete data sovereignty.',
    icon: '🏗️',
    phase: 'ga',
    status: 'active',
    layer: 'l1',
    productManager: 'Rami Nassar',
    foundedDate: '2022-01-01',
    websiteUrl: 'https://coredge.io',
    tags: ['openstack', 'virtual-machines', 'iaas', 'sovereign', 'kvm', 'cloud'],
    keyFeatures: ['Performance-optimised OpenStack distro (LTS support)', 'VM lifecycle management with live migration', 'Block, object & file storage via Ceph integration', 'Software-defined networking & network virtualisation', 'Built-in identity & access management', 'Ironic-based bare-metal provisioning'],
    techStack: ['OpenStack', 'Python', 'KVM / QEMU', 'Ceph', 'Neutron', 'Nova', 'Ironic', 'Linux'],
    relatedProductIds: ['prod-hci', 'prod-ckp', 'prod-ccs'],
    documents: [],
    revenue: { mrr: 180000, arr: 2160000, growthRate: 4.2, history: makeRevHistory(145000, 2) },
    usage: { dau: 680, mau: 2400, totalUsers: 6200, growthRate: 5, history: makeUsageHistory(1800, 2.5) },
    updates: [
      { date: '2026-03-15', title: 'Performance profile tuning', type: 'feature', description: 'BIOS/OS performance profiles — C-states disabled, NUMA alignment, huge pages — now applied automatically on CVM nodes.' },
      { date: '2026-01-20', title: 'Ironic bare-metal provisioning', type: 'feature', description: 'Ironic-based bare-metal provisioning integrated into CVM for high-performance dedicated workloads.' },
      { date: '2025-10-01', title: 'Ceph storage integration GA', type: 'launch', description: 'Native Ceph block and object storage fully integrated — persistent volumes provisioned automatically on deployment.' },
    ],
  },

  // ── L2: AI CORE ENGINE ─────────────────────────────────────

  {
    id: 'prod-corerun-mlops',
    name: 'CoreRunAI MLOps',
    shortName: 'CoreRunAI MLOps',
    description: 'End-to-end machine learning operations platform for training and fine-tuning models on sovereign infrastructure — manages the full model lifecycle from data preparation to production deployment.',
    mission: 'Give ML teams a sovereign platform to train, fine-tune, and version models without compromising data residency or intellectual property.',
    icon: '🧪',
    phase: 'beta',
    status: 'active',
    layer: 'l2',
    productManager: 'Gagan Kapoor',
    foundedDate: '2024-03-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['mlops', 'training', 'fine-tuning', 'ai', 'sovereign'],
    keyFeatures: ['Distributed model training', 'Fine-tuning pipelines', 'Experiment tracking', 'Model registry & versioning', 'Dataset management', 'GPU resource scheduling'],
    techStack: ['Python', 'PyTorch', 'Kubernetes', 'MLflow', 'Ray', 'React'],
    relatedProductIds: ['prod-corerun-aigw', 'prod-dflare', 'prod-agentsight'],
    documents: [],
    revenue: { mrr: 120000, arr: 1440000, growthRate: 28.0, history: makeRevHistory(32000, 12) },
    usage: { dau: 280, mau: 1050, totalUsers: 2200, growthRate: 32, history: makeUsageHistory(350, 14) },
    updates: [
      { date: '2026-03-25', title: 'Distributed training GA', type: 'launch', description: 'Multi-node distributed training with automatic fault tolerance and checkpointing.' },
      { date: '2026-02-18', title: 'Fine-tuning wizard', type: 'feature', description: 'One-click fine-tuning of open-source LLMs with LoRA and QLoRA support.' },
      { date: '2026-01-10', title: 'Model registry v2', type: 'feature', description: 'Versioned model registry with lineage tracking and A/B deployment.' },
    ],
  },

  {
    id: 'prod-corerun-aigw',
    name: 'CoreRun AI Gateway',
    shortName: 'CoreRun AI Gateway',
    description: 'Unified open-source LLM inference platform with dual-compatible APIs (OpenAI and Anthropic SDK formats). Provides enterprise governance, cost intelligence, and sovereign AI capabilities for teams routing across dozens of open-source models.',
    mission: 'Give every developer and enterprise team a cost-transparent, policy-governed gateway to open-source LLMs — without lock-in to any single provider.',
    icon: '🔀',
    phase: 'ga',
    status: 'active',
    layer: 'l2',
    productManager: 'Gagan Kapoor',
    foundedDate: '2024-06-01',
    websiteUrl: 'https://tokenfactoryinfinia.netlify.app/',
    tags: ['api-gateway', 'llm', 'ai', 'enterprise', 'inference', 'open-source', 'sovereign-ai', 'finops'],
    keyFeatures: ['OpenAI & Anthropic dual-compatible inference API', 'Enterprise key management — scoping, RPM limits, 24h rotation grace', 'Interactive playground with side-by-side & blind comparison modes', 'Real-time cost intelligence with per-model/key budget alerts', 'Team & org management with RBAC (user, admin, owner roles)', 'Metered billing — $5 signup credit, per-1M-token pricing, volume discounts'],
    techStack: ['Go', 'Envoy Proxy', 'CloudFlare', 'Kubernetes', 'PostgreSQL', 'Redis', 'Stripe', 'React', 'TypeScript'],
    relatedProductIds: ['prod-cyberpod', 'prod-agentsight', 'prod-corerun-mlops'],
    documents: [
      {
        id: 'prd',
        label: 'Product Requirements',
        type: 'prd',
        url: '/PRD.html',
        description: 'Full PRD with 6 feature domains, 21 features, user flows, success metrics, and technical architecture.',
        accentColor: '#06b6d4',
        basePath: 'prd',
        markdownDocs: [
          { slug: 'overview-and-vision', title: 'Overview & Vision', filename: '00_overview_and_vision.md', description: 'Product summary, tech stack, timeline' },
          { slug: 'brand-guidelines', title: 'Brand Guidelines', filename: '01_brand_guidelines.md', description: 'Design system, colors, typography, component patterns' },
          { slug: 'users-and-personas', title: 'Users & Personas', filename: '02_users_and_personas.md', description: 'Customer segments (C1-C7), behavioral segments' },
          { slug: 'milestones-and-timeline', title: 'Milestones & Timeline', filename: '03_milestones_and_timeline.md', description: 'M1-M4 milestones, exit criteria, feature-to-milestone matrix' },
          { slug: 'authentication', title: 'Domain A: Authentication', filename: '04_domain_a_authentication.md', description: 'User auth (A1), team/org management (A2)' },
          { slug: 'inference-api', title: 'Domain B: Inference API', filename: '05_domain_b_inference_api.md', description: 'Unified API (B1), model catalog (B2), streaming (B3)' },
          { slug: 'api-keys', title: 'Domain C: API Keys', filename: '06_domain_c_api_keys.md', description: 'Key management (C1), scoping (C2), rotation (C3)' },
          { slug: 'dashboard-playground', title: 'Domain D: Dashboard & Playground', filename: '07_domain_d_dashboard_playground.md', description: 'Dashboard shell (D1), playground (D2), comparison modes (D3-D4)' },
          { slug: 'cost-intelligence', title: 'Domain E: Cost Intelligence', filename: '08_domain_e_cost_intelligence.md', description: 'Cost dashboard (E1), budget alerts (E2), usage analytics (E3)' },
          { slug: 'billing', title: 'Domain F: Billing', filename: '09_domain_f_billing.md', description: 'Credits (F1), metered billing (F2), pricing tiers (F3), billing dashboard (F4)' },
          { slug: 'technical-architecture', title: 'Technical Architecture', filename: '10_technical_architecture.md', description: 'System overview, request flow, component map, Envoy integration' },
        ],
      },
      {
        id: 'market-research',
        label: 'Market Research & Strategy',
        type: 'market-research',
        url: '/market-research.html',
        description: 'Competitive landscape, market sizing, pricing architecture, go-to-market, and developer marketing.',
        accentColor: '#8b5cf6',
        basePath: 'market_research',
        markdownDocs: [
          { slug: 'market-opportunity', title: 'Market Opportunity & Customer Value', filename: '01_market_opportunity_and_customer_value.md', description: 'Core problem, value progression, TAM/SAM/SOM analysis' },
          { slug: 'competitive-landscape', title: 'Competitive Landscape & Ecosystem', filename: '02_competitive_landscape_and_ecosystem.md', description: 'Competitor analysis, ecosystem mapping, positioning' },
          { slug: 'industry-structure', title: 'Industry Structure & Profitability', filename: '03_industry_structure_and_profitability.md', description: "Porter's Five Forces, industry economics, margins" },
          { slug: 'macro-environment', title: 'Macro Environment & Regulatory', filename: '04_macro_environment_and_regulatory_landscape.md', description: 'PESTEL analysis, SOC 2, HIPAA, GDPR, EU AI Act' },
          { slug: 'strategic-strengths', title: 'Strategic Strengths & Vulnerabilities', filename: '05_strategic_strengths_and_vulnerabilities.md', description: 'SWOT analysis, strategic advantages, risk assessment' },
          { slug: 'customer-segments', title: 'Customer Segments & Buyer Profiles', filename: '06_customer_segments_and_buyer_profiles.md', description: 'Detailed persona profiles, buying behavior, decision criteria' },
          { slug: 'target-markets', title: 'Target Markets & Prioritization', filename: '07_target_markets_and_prioritization.md', description: 'Market prioritization framework, geographic targeting' },
          { slug: 'brand-positioning', title: 'Brand Positioning & Differentiation', filename: '08_brand_positioning_and_differentiation.md', description: 'Brand strategy, positioning statement, differentiation pillars' },
          { slug: 'product-strategy', title: 'Product Strategy & Roadmap', filename: '09_product_strategy_and_roadmap.md', description: 'Product vision, feature roadmap, build-buy-partner decisions' },
          { slug: 'pricing-architecture', title: 'Pricing Architecture & Monetization', filename: '10_pricing_architecture_and_monetization.md', description: 'Pricing model, tier structure, monetization strategy' },
          { slug: 'distribution-channels', title: 'Distribution Channels & Go-to-Market', filename: '11_distribution_channels_and_go_to_market.md', description: 'Channel strategy, GTM motions, partnership model' },
          { slug: 'communications', title: 'Communications & Developer Marketing', filename: '12_communications_and_developer_marketing.md', description: 'Developer relations, content strategy, community building' },
          { slug: 'quick-wins', title: 'Quick Wins & Strategic Advantages', filename: '13_quick_wins_and_strategic_advantages.md', description: 'Low-hanging fruit, early traction, IHC Group advantages' },
          { slug: 'feature-offering', title: 'Feature Offering & Prioritization', filename: '14_feature_offering_and_prioritization.md', description: 'Feature matrix, prioritization framework, MVP scope' },
        ],
      },
    ],
    revenue: { mrr: 302400, arr: 3628800, growthRate: 24.3, history: makeRevHistory(180000, 4.5) },
    usage: { dau: 420, mau: 1840, totalUsers: 3200, growthRate: 14.2, history: makeUsageHistory(800, 7) },
    updates: [
      { date: '2026-04-15', title: 'Milestone 4 — Full Launch', type: 'milestone', description: '99.9% uptime SLA live, independent security audit complete, load-tested at 2× capacity.' },
      { date: '2026-04-11', title: 'Milestone 3 — Live Billing', type: 'launch', description: 'Postpaid monthly invoicing, per-million-token metered pricing, volume discounts, public playground.' },
      { date: '2026-04-05', title: 'Milestone 2 — Playground & Cost Intelligence', type: 'launch', description: 'Interactive playground, side-by-side model comparison, cost dashboard, budget alerts.' },
      { date: '2026-03-28', title: 'Milestone 1 Complete', type: 'milestone', description: 'Auth, unified inference API, model catalog, streaming, API key management all shipped.' },
    ],
  },

  {
    id: 'prod-cyberpod',
    name: 'CyberPod',
    shortName: 'CyberPod',
    description: 'Flagship AI platform for enterprise data workflows — transforms enterprise data into institutional intelligence with sovereign, autonomous data processing pipelines.',
    mission: 'Enable enterprises to harness their data as institutional intelligence without compromising sovereignty or security.',
    icon: '🧠',
    phase: 'beta',
    status: 'active',
    layer: 'l2',
    productManager: 'Venky',
    foundedDate: '2025-04-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['ai', 'data-intelligence', 'enterprise', 'sovereign', 'automation'],
    keyFeatures: ['Autonomous data pipelines', 'Sovereign data processing', 'Enterprise knowledge graphs', 'AI-powered analytics', 'Data governance & compliance', 'Multi-source integration'],
    techStack: ['Python', 'TypeScript', 'PostgreSQL', 'React', 'LangChain'],
    relatedProductIds: ['prod-corerun-aigw', 'prod-agentsight'],
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
    id: 'prod-agentsight',
    name: 'AgentSight',
    shortName: 'AgentSight',
    description: 'Observability and monitoring platform for AI agents and LLM workloads — traces every inference call, surfaces anomalies, and provides full auditability for sovereign AI deployments.',
    mission: 'Give enterprises complete visibility into AI agent behaviour in production, at the request level.',
    icon: '👁️',
    phase: 'beta',
    status: 'active',
    layer: 'l2',
    productManager: 'Sara Al Rashid',
    foundedDate: '2025-01-15',
    websiteUrl: 'https://infinia.ai/',
    tags: ['mlops', 'observability', 'llm', 'agents', 'platform'],
    keyFeatures: ['Request tracing', 'Cost attribution', 'Latency percentiles (p50/p95/p99)', 'Agent audit logs', 'Anomaly detection', 'Eval framework'],
    techStack: ['Python', 'ClickHouse', 'Go', 'React', 'OpenTelemetry'],
    relatedProductIds: ['prod-corerun-aigw', 'prod-cyberpod'],
    documents: [],
    revenue: { mrr: 42000, arr: 504000, growthRate: 24.3, history: makeRevHistory(10000, 12) },
    usage: { dau: 140, mau: 520, totalUsers: 880, growthRate: 28, history: makeUsageHistory(120, 14) },
    updates: [
      { date: '2026-03-15', title: 'Eval framework', type: 'feature', description: 'Built-in evaluation harness for comparing model outputs across prompts.' },
      { date: '2026-02-20', title: 'Cost anomaly alerts', type: 'feature', description: 'Automatic alerts when per-org spend deviates >2σ from baseline.' },
      { date: '2026-01-10', title: 'OTel bridge', type: 'feature', description: 'Traces export to any OTel-compatible backend (Grafana, Honeycomb).' },
    ],
  },

  {
    id: 'prod-agentic-ocr',
    name: 'Agentic OCR',
    shortName: 'Agentic OCR',
    description: 'AI-powered document understanding platform that extracts structured data from any document type — invoices, contracts, forms — with sovereign processing and enterprise-grade accuracy.',
    mission: 'Eliminate manual data entry by turning any document into structured, actionable data within the enterprise boundary.',
    icon: '📄',
    phase: 'alpha',
    status: 'active',
    layer: 'l2',
    productManager: 'Nadia Osman',
    foundedDate: '2025-08-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['ocr', 'document-ai', 'extraction', 'automation', 'sovereign'],
    keyFeatures: ['Multi-format document parsing', 'Table and form extraction', 'On-premise processing', 'Confidence scoring', 'Human-in-the-loop review', 'ERP integration'],
    techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'PostgreSQL'],
    relatedProductIds: ['prod-cyberpod', 'prod-corerun-aigw', 'prod-corerun-mlops'],
    documents: [],
    revenue: { mrr: 12000, arr: 144000, growthRate: 45.0, history: makeRevHistory(2000, 20) },
    usage: { dau: 85, mau: 310, totalUsers: 480, growthRate: 52, history: makeUsageHistory(60, 22) },
    updates: [
      { date: '2026-03-10', title: 'Arabic document support', type: 'feature', description: 'Full RTL document processing with 98.2% accuracy on Arabic invoices.' },
      { date: '2026-02-05', title: 'Human-in-the-loop', type: 'feature', description: 'Review queue for low-confidence extractions with correction feedback loop.' },
      { date: '2025-11-01', title: 'Alpha launch', type: 'launch', description: 'Agentic OCR enters alpha with 5 enterprise design partners.' },
    ],
  },

  {
    id: 'prod-c3',
    name: 'C3',
    shortName: 'C3',
    description: 'AI-powered cyber security platform providing real-time threat intelligence, SOC automation, and sovereign security operations — the nerve centre for enterprise cyber defence.',
    mission: 'Give security teams a single pane of glass for threat detection, incident response, and compliance across all Infinia-managed assets.',
    icon: '🛡️',
    phase: 'ga',
    status: 'active',
    layer: 'l2',
    productManager: 'Sana Al Rashid',
    foundedDate: '2023-09-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['security', 'soc', 'threat-intelligence', 'compliance', 'cyber', 'ai'],
    keyFeatures: ['Real-time threat intelligence', 'SOC automation', 'SIEM integration', 'Incident response playbooks', 'AI threat scoring', 'Compliance dashboards'],
    techStack: ['Python', 'Go', 'Elasticsearch', 'React', 'Kafka'],
    relatedProductIds: ['prod-cyberpod', 'prod-agentsight', 'prod-stratify'],
    documents: [],
    revenue: { mrr: 192000, arr: 2304000, growthRate: 14.2, history: makeRevHistory(88000, 6.5) },
    usage: { dau: 340, mau: 1200, totalUsers: 2600, growthRate: 18, history: makeUsageHistory(600, 8) },
    updates: [
      { date: '2026-03-15', title: 'AI threat scoring', type: 'feature', description: 'ML model scores threats in real time — reduces analyst triage time 60%.' },
      { date: '2026-02-01', title: 'SIEM connectors v2', type: 'feature', description: 'Native connectors for Splunk, QRadar, and Microsoft Sentinel.' },
      { date: '2025-10-01', title: 'SOC playbooks', type: 'launch', description: 'Pre-built incident response playbooks for 40+ attack scenarios.' },
    ],
  },

  // ── L3: APPLICATIONS ──────────────────────────────────────────

  {
    id: 'prod-digink',
    name: 'Digink Lite',
    shortName: 'Digink Lite',
    description: 'Digital signature and document workflow platform for SMEs — makes it simple to send, sign, and store legally binding documents without enterprise complexity or cost.',
    mission: 'Democratise digital signatures by making legally binding document workflows accessible to every business, from solopreneurs to mid-market companies.',
    icon: '✍️',
    phase: 'ga',
    status: 'active',
    layer: 'l3',
    productManager: 'Sara Al Rashid',
    foundedDate: '2023-05-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['esignature', 'documents', 'sme', 'workflow', 'legal'],
    keyFeatures: ['Legally binding e-signatures', 'Document templates', 'Multi-party signing', 'Audit trail', 'Mobile signing', 'CRM integrations'],
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS S3'],
    relatedProductIds: ['prod-esal', 'prod-novis'],
    documents: [],
    revenue: { mrr: 95000, arr: 1140000, growthRate: 22.4, history: makeRevHistory(42000, 10.5) },
    usage: { dau: 1800, mau: 6500, totalUsers: 18000, growthRate: 28, history: makeUsageHistory(4000, 12) },
    updates: [
      { date: '2026-03-20', title: 'Bulk send', type: 'feature', description: 'Send the same document to 500+ recipients in one click for mass signing.' },
      { date: '2026-02-08', title: 'Template library', type: 'feature', description: '200+ legally reviewed templates for UAE and GCC business contexts.' },
      { date: '2026-01-15', title: 'Mobile app GA', type: 'launch', description: 'iOS and Android apps for on-the-go signing now generally available.' },
    ],
  },

  {
    id: 'prod-novis',
    name: 'Novis Studio',
    shortName: 'Novis Studio',
    description: 'AI-powered creative and content production studio — enables teams to produce, manage, and distribute branded content at enterprise scale with sovereign AI generation and full brand compliance.',
    mission: 'Give every team the creative superpower to produce on-brand content at the speed of thought, without compromising quality or governance.',
    icon: '🎨',
    phase: 'alpha',
    status: 'active',
    layer: 'l3',
    productManager: 'Nadia Osman',
    foundedDate: '2025-06-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['content', 'creative', 'ai', 'brand', 'marketing'],
    keyFeatures: ['AI image & copy generation', 'Brand kit enforcement', 'Content workflow & approvals', 'Asset management (DAM)', 'Multi-channel publishing', 'Performance analytics'],
    techStack: ['Python', 'TypeScript', 'React', 'PostgreSQL', 'S3'],
    relatedProductIds: ['prod-actionly', 'prod-harmony-crm', 'prod-digink'],
    documents: [],
    revenue: { mrr: 18000, arr: 216000, growthRate: 55.0, history: makeRevHistory(2500, 25) },
    usage: { dau: 420, mau: 1600, totalUsers: 2800, growthRate: 62, history: makeUsageHistory(400, 28) },
    updates: [
      { date: '2026-03-18', title: 'Brand AI engine', type: 'feature', description: 'Generative AI that learns brand voice and visual identity from existing assets.' },
      { date: '2026-02-05', title: 'DAM integration', type: 'feature', description: 'Digital asset management with AI-powered tagging and search.' },
      { date: '2025-10-01', title: 'Alpha launch', type: 'launch', description: 'Novis Studio enters alpha with 8 marketing-led design partners.' },
    ],
  },

  {
    id: 'prod-actionly',
    name: 'Actionly',
    shortName: 'Actionly',
    description: 'AI-powered task and action management platform that bridges strategy and execution — captures actions from meetings, emails, and decisions and routes them to the right people with contextual AI assistance.',
    mission: 'Ensure nothing falls through the cracks by making every commitment visible, tracked, and completed on time.',
    icon: '⚡',
    phase: 'beta',
    status: 'active',
    layer: 'l3',
    productManager: 'Lena Hoffman',
    foundedDate: '2025-02-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['productivity', 'tasks', 'ai', 'meetings', 'execution'],
    keyFeatures: ['Meeting action extraction', 'AI task prioritisation', 'Cross-team visibility', 'Deadline intelligence', 'Email action capture', 'Calendar integration'],
    techStack: ['TypeScript', 'React', 'Go', 'PostgreSQL', 'Redis'],
    relatedProductIds: ['prod-support-ops', 'prod-skillforge'],
    documents: [],
    revenue: { mrr: 38000, arr: 456000, growthRate: 38.2, history: makeRevHistory(7000, 16) },
    usage: { dau: 1400, mau: 5200, totalUsers: 9800, growthRate: 42, history: makeUsageHistory(1500, 18) },
    updates: [
      { date: '2026-03-25', title: 'Meeting AI', type: 'feature', description: 'Auto-extracts and assigns actions from recorded meeting transcripts.' },
      { date: '2026-02-18', title: 'Deadline AI', type: 'feature', description: 'AI predicts task completion risk and surfaces at-risk actions 48h early.' },
      { date: '2026-01-15', title: 'Beta launch', type: 'launch', description: 'Actionly opens to public beta after 3 months of private preview.' },
    ],
  },

  {
    id: 'prod-skillforge',
    name: 'Skill Forge',
    shortName: 'Skill Forge',
    description: 'AI-powered human resource management system that maps organisational skills, identifies gaps, and builds personalised learning paths to develop the workforce your strategy demands.',
    mission: 'Turn HR from an administrative function into a strategic talent engine that continuously closes skill gaps before they become business risks.',
    icon: '🎓',
    phase: 'ga',
    status: 'active',
    layer: 'l3',
    productManager: 'Lena Hoffman',
    foundedDate: '2023-08-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['hr', 'talent', 'learning', 'workforce', 'skills'],
    keyFeatures: ['Skills ontology & gap analysis', 'AI learning path generation', 'Performance management', 'Workforce planning', 'Succession planning', 'Payroll integration'],
    techStack: ['TypeScript', 'React', 'PostgreSQL', 'Python', 'Redis'],
    relatedProductIds: ['prod-actionly', 'prod-support-ops', 'prod-harmony-crm'],
    documents: [],
    revenue: { mrr: 168000, arr: 2016000, growthRate: 15.2, history: makeRevHistory(88000, 7.2) },
    usage: { dau: 1100, mau: 4200, totalUsers: 9600, growthRate: 18, history: makeUsageHistory(2400, 8) },
    updates: [
      { date: '2026-03-22', title: 'Skills AI v2', type: 'feature', description: 'GPT-4 powered skill inference from job descriptions and resumes.' },
      { date: '2026-02-10', title: 'Succession planning', type: 'feature', description: 'AI-ranked succession candidates with readiness scoring.' },
      { date: '2026-01-08', title: 'Payroll connector', type: 'feature', description: 'Native payroll integration with 12 regional payroll providers.' },
    ],
  },

  {
    id: 'prod-lead-the-ai',
    name: 'Lead the AI',
    shortName: 'Lead the AI',
    description: 'Executive AI literacy and leadership platform — equips C-suite and senior leaders with the frameworks, simulations, and peer learning needed to lead AI transformation with confidence.',
    mission: 'Bridge the AI knowledge gap at the leadership level so organisations can make better AI investment, governance, and strategy decisions.',
    icon: '🏆',
    phase: 'beta',
    status: 'active',
    layer: 'l3',
    productManager: 'Gagan Kapoor',
    foundedDate: '2025-04-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['education', 'ai-literacy', 'leadership', 'executive', 'training'],
    keyFeatures: ['AI strategy simulations', 'Personalised learning paths', 'Peer cohort sessions', 'Board-level AI governance frameworks', 'ROI modelling tools', 'Certification programme'],
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
    relatedProductIds: ['prod-novis', 'prod-actionly'],
    documents: [],
    revenue: { mrr: 28000, arr: 336000, growthRate: 42.0, history: makeRevHistory(5000, 18) },
    usage: { dau: 380, mau: 1400, totalUsers: 2600, growthRate: 48, history: makeUsageHistory(400, 20) },
    updates: [
      { date: '2026-03-25', title: 'Board governance module', type: 'feature', description: 'AI governance framework tailored for board-level AI oversight responsibilities.' },
      { date: '2026-02-10', title: 'Cohort programme', type: 'launch', description: '12-week peer cohort programme for C-suite AI transformation leadership.' },
      { date: '2026-01-15', title: 'Beta launch', type: 'launch', description: 'Lead the AI opens to beta with 50 senior leaders across 12 organisations.' },
    ],
  },

  {
    id: 'prod-harmony-crm',
    name: 'Harmony CRM',
    shortName: 'Harmony CRM',
    description: 'AI-enriched customer relationship management platform built for B2B enterprises — unifies sales, customer success, and account management with sovereign data handling and deep Infinia stack integration.',
    mission: 'Give every customer-facing team the relationship intelligence and AI assistance they need to grow accounts and reduce churn.',
    icon: '🤝',
    phase: 'ga',
    status: 'active',
    layer: 'l3',
    productManager: 'Nadia Osman',
    foundedDate: '2023-07-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['crm', 'sales', 'customer-success', 'ai', 'enterprise'],
    keyFeatures: ['AI deal scoring', 'Account health monitoring', 'Pipeline forecasting', 'Email intelligence', 'Integration hub (40+ connectors)', 'Customer success playbooks'],
    techStack: ['TypeScript', 'React', 'PostgreSQL', 'Go', 'Redis'],
    relatedProductIds: ['prod-xailon', 'prod-support-ops', 'prod-skillforge'],
    documents: [],
    revenue: { mrr: 198000, arr: 2376000, growthRate: 20.1, history: makeRevHistory(95000, 9.5) },
    usage: { dau: 920, mau: 3400, totalUsers: 7800, growthRate: 24, history: makeUsageHistory(1900, 11) },
    updates: [
      { date: '2026-03-28', title: 'AI deal coach', type: 'feature', description: 'Real-time deal coaching with next-best-action recommendations.' },
      { date: '2026-02-14', title: 'Churn prediction', type: 'feature', description: 'ML model predicts churn risk 90 days out with 87% accuracy.' },
      { date: '2026-01-08', title: 'Pipeline AI', type: 'feature', description: 'AI-generated pipeline forecasts with confidence intervals by quarter.' },
    ],
  },

  {
    id: 'prod-support-ops',
    name: 'Support Ops',
    shortName: 'Support Ops',
    description: 'AI-powered customer support operations platform that automates ticket routing, resolution, and knowledge management — enabling support teams to handle 3x the volume with the same headcount.',
    mission: 'Transform support from a cost centre into a competitive advantage by resolving customer issues faster and learning from every interaction.',
    icon: '🎧',
    phase: 'ga',
    status: 'active',
    layer: 'l3',
    productManager: 'Venky',
    foundedDate: '2023-12-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['support', 'customer-service', 'ai', 'automation', 'helpdesk'],
    keyFeatures: ['AI ticket routing & triage', 'Automated resolution suggestions', 'Knowledge base AI', 'SLA tracking & escalation', 'Customer sentiment analysis', 'Agent performance analytics'],
    techStack: ['TypeScript', 'React', 'PostgreSQL', 'Go', 'Redis'],
    relatedProductIds: ['prod-harmony-crm', 'prod-skillforge', 'prod-actionly'],
    documents: [],
    revenue: { mrr: 122000, arr: 1464000, growthRate: 17.3, history: makeRevHistory(60000, 8.2) },
    usage: { dau: 780, mau: 2800, totalUsers: 6200, growthRate: 21, history: makeUsageHistory(1600, 9.5) },
    updates: [
      { date: '2026-03-25', title: 'AI resolution engine', type: 'feature', description: 'AI resolves 42% of L1 tickets automatically without agent involvement.' },
      { date: '2026-02-12', title: 'Sentiment alerts', type: 'feature', description: 'Real-time alerts when customer sentiment score drops below threshold.' },
      { date: '2026-01-15', title: 'Knowledge AI', type: 'feature', description: 'AI-powered knowledge base that auto-drafts articles from resolved tickets.' },
    ],
  },

  {
    id: 'prod-stratify',
    name: 'Stratify',
    shortName: 'Stratify',
    description: 'Governance and policy management platform — defines, enforces, and audits policies across the entire Infinia stack, ensuring compliance with regulatory frameworks and internal standards.',
    mission: 'Make governance a first-class capability by automating policy enforcement and providing evidence-grade audit trails.',
    icon: '📋',
    phase: 'ga',
    status: 'active',
    layer: 'l3',
    productManager: 'Sana Al Rashid',
    foundedDate: '2023-11-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['governance', 'policy', 'compliance', 'audit', 'enterprise'],
    keyFeatures: ['Policy-as-code engine', 'Automated compliance checks', 'Audit trail generation', 'Regulatory framework mappings (ISO 27001, SOC 2, GDPR)', 'Exception management'],
    techStack: ['Go', 'OPA', 'PostgreSQL', 'React', 'Kafka'],
    relatedProductIds: ['prod-scalerisk', 'prod-c3'],
    documents: [],
    revenue: { mrr: 128000, arr: 1536000, growthRate: 16.4, history: makeRevHistory(58000, 7.8) },
    usage: { dau: 420, mau: 1500, totalUsers: 3200, growthRate: 20, history: makeUsageHistory(800, 9) },
    updates: [
      { date: '2026-03-12', title: 'ISO 27001:2022 mapping', type: 'feature', description: 'Complete control mapping for ISO 27001:2022 with evidence collection.' },
      { date: '2026-02-18', title: 'AI policy generator', type: 'feature', description: 'Draft policies from plain-English descriptions using LLM assistance.' },
      { date: '2026-01-05', title: 'Exception management', type: 'feature', description: 'Structured exception approval workflow with time-boxed waivers.' },
    ],
  },

  {
    id: 'prod-scalerisk',
    name: 'ScaleRisk',
    shortName: 'ScaleRisk',
    description: 'Enterprise risk management platform that quantifies, tracks, and mitigates operational and strategic risks — replacing spreadsheets with a dynamic, data-driven risk register.',
    mission: 'Transform risk management from a periodic compliance exercise into a continuous, data-driven practice embedded in daily operations.',
    icon: '⚖️',
    phase: 'beta',
    status: 'active',
    layer: 'l3',
    productManager: 'Priya Mehta',
    foundedDate: '2024-05-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['risk', 'compliance', 'enterprise', 'governance', 'audit'],
    keyFeatures: ['Dynamic risk register', 'Monte Carlo simulation', 'Risk heat maps', 'Control effectiveness scoring', 'Board-level reporting'],
    techStack: ['Python', 'TypeScript', 'React', 'PostgreSQL', 'D3.js'],
    relatedProductIds: ['prod-stratify', 'prod-c3'],
    documents: [],
    revenue: { mrr: 72000, arr: 864000, growthRate: 22.8, history: makeRevHistory(22000, 10.5) },
    usage: { dau: 210, mau: 780, totalUsers: 1600, growthRate: 28, history: makeUsageHistory(300, 12) },
    updates: [
      { date: '2026-03-20', title: 'Monte Carlo simulation', type: 'feature', description: 'Probabilistic risk quantification with 10,000-scenario simulation engine.' },
      { date: '2026-02-08', title: 'Board reporting', type: 'feature', description: 'One-click board pack generation with risk narrative and heat maps.' },
      { date: '2025-11-01', title: 'Beta launch', type: 'launch', description: 'ScaleRisk opens to beta with 8 enterprise design partners.' },
    ],
  },

  {
    id: 'prod-esal',
    name: 'ESAL eInvoicing',
    shortName: 'ESAL eInvoicing',
    description: 'Sovereign cloud-based electronic invoicing platform combining blockchain security with automated compliance for UAE businesses. Peppol-certified with AI-powered fraud detection.',
    mission: 'Make e-invoicing seamless, compliant, and secure for every business operating in the UAE and GCC region.',
    icon: '🧾',
    phase: 'ga',
    status: 'active',
    layer: 'l3',
    productManager: 'Omar Khalil',
    foundedDate: '2024-03-01',
    websiteUrl: 'https://www.esal.tech/',
    tags: ['einvoicing', 'compliance', 'blockchain', 'uae', 'fintech'],
    keyFeatures: ['Peppol-certified invoicing', 'Blockchain audit trails', 'AI fraud detection', 'VAT reconciliation', 'ERP integrations (SAP, Oracle, Dynamics 365)', 'Paper-to-digital scanning'],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'React', 'Blockchain'],
    relatedProductIds: ['prod-finance-engine', 'prod-digink'],
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
    id: 'prod-finance-engine',
    name: 'Finance Console',
    shortName: 'Finance Console',
    description: 'Automated financial consolidation platform that aggregates, reconciles, and reports across complex multi-entity corporate structures — cutting close cycles from weeks to hours.',
    mission: 'Eliminate the month-end close bottleneck by automating every reconciliation, intercompany elimination, and consolidation task.',
    icon: '💹',
    phase: 'ga',
    status: 'active',
    layer: 'l3',
    productManager: 'Priya Mehta',
    foundedDate: '2023-04-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['finance', 'consolidation', 'reporting', 'enterprise', 'accounting'],
    keyFeatures: ['Multi-entity consolidation', 'Intercompany eliminations', 'FX translation & revaluation', 'IFRS & GAAP reporting', 'Close checklist automation'],
    techStack: ['Python', 'TypeScript', 'React', 'PostgreSQL', 'Apache Spark'],
    relatedProductIds: ['prod-xailon', 'prod-esal', 'prod-scalerisk'],
    documents: [],
    revenue: { mrr: 228000, arr: 2736000, growthRate: 9.8, history: makeRevHistory(145000, 4.8) },
    usage: { dau: 340, mau: 1200, totalUsers: 2600, growthRate: 12, history: makeUsageHistory(800, 5.5) },
    updates: [
      { date: '2026-03-10', title: 'IFRS 17 support', type: 'feature', description: 'Full IFRS 17 insurance contract consolidation for financial institutions.' },
      { date: '2026-02-01', title: 'Close time reduced 70%', type: 'milestone', description: 'Average close cycle drops from 14 days to 4 days across customer base.' },
      { date: '2025-12-15', title: 'FX automation', type: 'feature', description: 'Real-time FX translation with ECB and central bank rate feeds.' },
    ],
  },

  {
    id: 'prod-xailon',
    name: 'XAILON',
    shortName: 'XAILON',
    description: 'AI-native enterprise resource planning platform that unifies financials, operations, and supply chain with embedded AI agents — delivering the intelligence of a team of analysts at every workflow step.',
    mission: 'Replace legacy ERP rigidity with a composable, AI-first operating system for the modern enterprise.',
    icon: '🏢',
    phase: 'beta',
    status: 'active',
    layer: 'l3',
    productManager: 'Omar Khalil',
    foundedDate: '2024-03-01',
    websiteUrl: 'https://infinia.ai/',
    tags: ['erp', 'ai', 'enterprise', 'finance', 'operations'],
    keyFeatures: ['AI-native financial management', 'Intelligent procurement', 'Supply chain visibility', 'Embedded AI agents', 'Multi-entity consolidation'],
    techStack: ['TypeScript', 'React', 'PostgreSQL', 'Go', 'Redis'],
    relatedProductIds: ['prod-finance-engine', 'prod-harmony-crm', 'prod-skillforge'],
    documents: [],
    revenue: { mrr: 185000, arr: 2220000, growthRate: 28.4, history: makeRevHistory(55000, 12) },
    usage: { dau: 620, mau: 2200, totalUsers: 4800, growthRate: 32, history: makeUsageHistory(1200, 14) },
    updates: [
      { date: '2026-03-28', title: 'AI procurement agent', type: 'feature', description: 'Autonomous procurement agent negotiates vendor terms and raises POs.' },
      { date: '2026-02-15', title: 'Multi-entity consolidation', type: 'feature', description: 'Consolidated financials across 50+ legal entities with currency conversion.' },
      { date: '2026-01-20', title: 'Supply chain module', type: 'launch', description: 'Real-time supply chain visibility with demand forecasting AI.' },
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

export const PRODUCTS_BY_LAYER = {
  l1: PRODUCTS.filter(p => p.layer === 'l1'),
  l2: PRODUCTS.filter(p => p.layer === 'l2'),
  l3: PRODUCTS.filter(p => p.layer === 'l3'),
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
