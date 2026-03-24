# Product Feature Matrix

**AI Gateway vs. Competitors — Comprehensive Capability Comparison**

---

## Executive Summary

| Capability Area | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|:---:|:---:|:---:|:---:|:---:|
| **Core Inference Platform** | :white_check_mark: | :white_check_mark: | :white_check_mark: | Partial | :white_check_mark: |
| **Cost Intelligence / FinOps** | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Enterprise Access & Governance** | :white_check_mark: | Basic | :x: | :x: | :x: |
| **Fine-Tuning & Customisation** | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :x: |
| **Compliance & Regulatory** | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Developer Experience** | :white_check_mark: | Partial | Partial | Partial | Partial |
| **Sovereign AI / MENA** | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Custom Silicon Strategy** | Tenstorrent | :x: | :x: | LPU | :x: |

> **AI Gateway is the only platform positioned in the "Full Platform Leader" quadrant** — combining strong inference capability with deep platform features. Every competitor excels in one dimension but lacks the unified platform layer that enterprises require.

---

## 1. Core Inference Platform

Baseline capabilities required to serve production LLM workloads. These are table-stakes for market entry.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Multi-Model API** | Single API endpoint to access many open-source and fine-tuned model families (LLaMA, DeepSeek, Mistral, Qwen, Command R) without managing separate integrations. Self-hosted on K8s GPU cluster. | :white_check_mark: | :white_check_mark: 150+ models | :white_check_mark: 80+ models | Limited ~20 models | :white_check_mark: 300+ (open + proprietary) |
| **OpenAI + Anthropic Compatible Endpoints** | Drop-in replacement for both the OpenAI API (`/v1/chat/completions`) and Anthropic Messages API (`/v1/messages`), enabling migration with zero code changes from either SDK. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Streaming (SSE)** | Real-time token-by-token output via Server-Sent Events for responsive chat, writing, and interactive AI applications. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Inference Speed (TTFT)** | Time-to-first-token latency — how quickly the model begins generating output. Critical for perceived responsiveness. | Sub-second globally | Fast | Very fast (FireAttention) | Extreme (>500 tok/s via LPU) | Varies by upstream provider |
| **Embeddings API** | Vector embedding generation for semantic search, RAG pipelines, and similarity matching via `/v1/embeddings`. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :white_check_mark: |
| **Function / Tool Calling** | Structured tool-use support matching the OpenAI function-calling spec, enabling agentic workflows and structured output. | :white_check_mark: | :white_check_mark: | :white_check_mark: | Partial | :white_check_mark: |
| **Vision / Multimodal** | Support for models that accept image inputs alongside text (e.g., LLaVA, Qwen-VL). | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :white_check_mark: |

---

## 2. Cost Intelligence & FinOps

:star: **AI Gateway exclusive** — No competitor offers integrated cost intelligence. This is an entirely greenfield capability addressing the $16B cloud FinOps market applied to AI inference.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Real-Time Cost Dashboards** | Live spend visualisation broken down by model, team, project, and time period. Transforms AI inference from opaque cost centre into a managed budget item. | :white_check_mark: | :x: Aggregate only | :x: Basic per-model | :x: | :x: Basic per-key |
| **Per-Key/Project/Team Cost Allocation** | Automatic cost attribution to specific projects, teams, or applications based on API key. Enables chargeback and ROI reporting at the business-unit level without code changes. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Spend Forecasting & Anomaly Detection** | Predictive best/expected/worst-case monthly projections with anomaly alerts (e.g., 340% spike from unfamiliar IP, off-hours usage patterns). | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Budget Alerts & Hard Ceilings** | Configurable threshold alerts and hard spend caps that automatically stop requests when limits are reached — preventing bill shock. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Intelligent Routing** | Automatic model selection based on configurable preferences: `quality`, `cost`, `speed`, or `balanced`. Routes requests to the optimal model meeting the specified SLA, delivering 20–40% cost savings. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Semantic Caching** | Detects semantically similar requests and returns cached responses, eliminating redundant inference calls and reducing both cost and latency. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Optimisation Recommendations** | AI-driven analysis of usage patterns that surfaces specific, quantified savings opportunities (e.g., "Switch model X to Y — save 62%"). Actionable suggestions, not just raw data. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Cross-Model Cost Comparison** | Side-by-side cost-per-quality analysis across models for a given use case (e.g., "LLaMA 70B delivers 92% of GPT-4 quality at 15% of the cost for your support use case"). | :white_check_mark: | :x: | :x: | :x: | :x: |

---

## 3. Enterprise Access & Governance

Capabilities required by organisations with multiple teams, compliance requirements, and department-level billing needs.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **RBAC with Team Hierarchies** | Role-Based Access Control with granular permissions mirroring organisational structure. Admins, managers, and developers see different capabilities. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **API Key Scoping — Model Restrictions** | Limit specific API keys to only access certain models (e.g., this key can use LLaMA and Mistral but not DeepSeek). | :white_check_mark: | :x: | :x: | :x: | :x: |
| **API Key Scoping — Rate Limits** | Per-key requests-per-minute caps to prevent runaway usage from individual applications or teams. | :white_check_mark: | Basic | Basic | Basic | :x: |
| **API Key Scoping — Cost Ceilings** | Daily/monthly spend limits per key with hard stops — the key automatically stops working when the budget is exhausted. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **API Key Scoping — IP Allowlists** | Restrict API key usage to specific CIDR ranges, preventing unauthorised use from unexpected network locations. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **API Key Scoping — Expiration Policies** | Auto-expire keys after a configurable duration, preventing stale credentials from accumulating. Includes dual-active-key rotation for zero-downtime replacement. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Department-Level Billing & Chargeback** | Automatic cost routing to business units through inter-company accounting with ERP workflow integration. Supports subsidiary-level chargeback for conglomerates (e.g., IHC Group's 422 entities). | :white_check_mark: | :x: | :x: | :x: | :x: |
| **SSO / SAML Integration** | Enterprise single sign-on via SAML 2.0 and OIDC providers (Okta, Azure AD, etc.) for centralised identity management. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Complete Audit Trails** | Immutable record of every API interaction — timestamp, user identity, model accessed, token count, source IP, response status — retained for 7+ years. Exportable to SIEM systems for centralised security monitoring. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Usage Quotas per Team/Project** | Configurable consumption limits by team, project, or individual — enforced in real time to maintain budget discipline across the organisation. | :white_check_mark: | :x: | :x: | :x: | :x: |

---

## 4. Fine-Tuning & Model Customisation

End-to-end pipeline for customising open-source models. Fine-tuned models create the strongest switching cost — recreating one costs $5–50K in compute, data, and engineering time.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **LoRA / QLoRA Fine-Tuning** | Parameter-efficient fine-tuning methods that customise models at a fraction of full fine-tuning cost. QLoRA further reduces memory requirements for larger models. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :x: |
| **Full Fine-Tuning** | Complete weight update for maximum model customisation when parameter-efficient methods are insufficient. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :x: |
| **Dataset Versioning** | Track every iteration of training data with full version history. Enables reproducible training runs and rollback to previous data versions if quality issues emerge. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Data Preparation Pipeline** | Built-in tools for data cleaning, formatting, validation, and deduplication before training — ensuring data quality without external tooling. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Live Training Visualisation** | Real-time loss curves during training, enabling early detection of overfitting, divergence, or slow convergence — saving GPU cost by catching problems before completion. | :white_check_mark: | :x: | Basic | :x: | :x: |
| **Evaluation Dashboards** | Side-by-side quality comparison between model versions with customisable metrics (accuracy, relevance, safety, latency) and automated regression detection. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **A/B Traffic Splitting** | Gradual migration from base to fine-tuned model: route 10% of traffic to the new model, compare metrics, increase split as confidence grows. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **One-Click Rollback** | Instant reversion to a previous model version if quality degrades in production — no redeployment or config changes needed. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Drift Detection & Monitoring** | Continuous monitoring of fine-tuned model performance in production with alerts when output quality degrades over time. | :white_check_mark: | :x: | :x: | :x: | :x: |

---

## 5. Compliance & Regulatory

:star: **AI Gateway exclusive** — Compliance built as core architecture, not retrofitted. No competitor treats regulatory compliance as a foundational design principle. EU AI Act fines reach up to €35M or 7% of global turnover.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **SOC 2 Type II** | Independent security audit verifying controls over data security, availability, processing integrity, confidentiality, and privacy. The baseline credential for enterprise procurement. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **HIPAA Compliance (BAA)** | Healthcare data protection with Business Associate Agreement available. Enables use in healthcare AI applications handling protected health information (PHI). | :white_check_mark: | :x: | :x: | :x: | :x: |
| **GDPR Data Protection** | EU General Data Protection Regulation compliance woven into auth/authz layers — data protection by design, not by afterthought. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **EU AI Act Readiness** | Prepared for enforcement (August 2026) with transparency documentation, risk assessment frameworks, and audit capabilities for AI system classification. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **UAE AI Governance** | Alignment with UAE PDPL (Personal Data Protection Law) and national AI strategy. Built-in awareness of Gulf-region regulatory requirements from day one. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Saudi Arabia & Bahrain DPL** | Compliance with Saudi PDPL and Bahrain Data Protection Law, enabling deployment for government and regulated-industry customers across the GCC. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **PCI-DSS** | Payment Card Industry Data Security Standard compliance for fintech workloads that process or reference payment card data. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **ISO 27001** | International standard for information security management systems. Demonstrates systematic approach to managing sensitive company and customer information. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Zero Data Retention (ZDR)** | Cryptographic proof that prompts and completions are processed in memory only and never persisted to storage. Independently audited. Configurable at account, key, or per-request level. Data never used for model training. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **PII Auto-Redaction** | Automatic detection and redaction of personally identifiable information (names, emails, SSNs, credit cards, medical records) in request payloads before processing. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Data Residency Options** | Choose where data is processed: UAE (Abu Dhabi), EU (Frankfurt), US (Virginia), Saudi Arabia (Riyadh). Requests to a specific region never leave regional boundaries. | :white_check_mark: | :x: US-only | :x: US-only | :x: US-only | :x: Varies |

---

## 6. Developer Experience

The primary acquisition channel for infrastructure products. Stripe won payments with DX; AI Gateway wins inference with DX.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Time to First API Call** | How quickly a new developer can sign up, get an API key, and make their first successful inference call. | **2 minutes** | ~5 minutes | ~5 minutes | ~3 minutes | ~3 minutes |
| **Interactive Playground** | Browser-based environment to test models with real-time streaming, parameter adjustment, and instant feedback — no code required. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Blind Model Comparison** | Test 2–3 models head-to-head with outputs labelled A/B/C — model identity hidden until after selection. Eliminates bias and enables objective, data-driven model selection. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Conversation Forking** | Branch any conversation at any point to explore alternative prompts, system messages, or models on parallel paths. Essential for complex prompt engineering and agentic workflow development. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **One-Click Code Export** | Generate production-ready code snippets in Python, TypeScript, Go, Ruby, Java, and curl — including error handling, retry logic, streaming support, and env var management. | :white_check_mark: | Partial | Partial | Partial | Partial |
| **Request Replay** | Re-execute any previous API call with modified parameters (different model, temperature, system prompt) and compare output against the original — a debugging and optimisation workflow. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Python SDK** | Official Python client library with full type hints, async support, and streaming. Published on PyPI. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | Community |
| **TypeScript SDK** | Official TypeScript/Node.js client library with full type definitions. Published on npm. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | Community |
| **Framework Integrations** | Pre-built connectors for LangChain, Vercel AI SDK, LlamaIndex, and CrewAI — enabling adoption within existing AI application stacks. | :white_check_mark: | :white_check_mark: | :white_check_mark: | Partial | :white_check_mark: |
| **Migration Guides** | Step-by-step documentation for migrating from each major competitor with code examples, mapping tables, and gotcha warnings. | :white_check_mark: | :x: | :x: | :x: | :x: |

---

## 7. Infrastructure & Scale

Production reliability, global reach, and hardware strategy for long-term competitiveness.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Global Regions** | Geographically distributed inference endpoints to minimise latency and meet data residency requirements. | US, EU, UAE, KSA | US | US | US | Varies (aggregator) |
| **Uptime SLA** | Guaranteed availability with financial penalties for downtime. Public status page with historical uptime data, incident timelines, and post-mortems. | 99.99% (Enterprise) | 99.9% | 99.9% | 99.9% | Best-effort |
| **Custom Silicon Strategy** | Proprietary or strategic hardware partnerships for long-term cost and performance advantages beyond commodity Nvidia GPUs. | Tenstorrent (RISC-V AI accelerators) | :x: Nvidia GPUs | :x: Nvidia GPUs | LPU (custom ASIC) | :x: No hardware |
| **VPC Peering / Dedicated Infra** | Private network connectivity between customer cloud and AI Gateway — data never traverses the public internet. Available on Enterprise tier. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Auto-Scaling** | Elastic capacity that scales with demand without manual intervention. GPU-based architecture enables smoother scaling than supply-constrained custom silicon. | :white_check_mark: | :white_check_mark: | :white_check_mark: | Limited (LPU supply) | N/A (aggregator) |
| **Cloud Marketplace Listings** | Available for purchase through AWS Marketplace, GCP Marketplace, and Azure Marketplace — enabling procurement through existing enterprise cloud contracts. | :white_check_mark: | :white_check_mark: | Partial | :x: | :x: |

---

## 8. Pricing & Business Model

Transparent, developer-friendly pricing designed to convert free users into enterprise customers.

| Feature | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Free Tier** | Zero-cost entry point for evaluation and prototyping with real production models. | :white_check_mark: $5 credit, 3 models, 100 RPM | :white_check_mark: Limited | :white_check_mark: Limited | :white_check_mark: Limited | :white_check_mark: Free models available |
| **Pay-As-You-Go** | Usage-based billing with no minimum commitment. All models accessible, charges per million tokens. | :white_check_mark: All models, 500 RPM | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Pro Tier** | Enhanced tier with platform features: cost analytics, fine-tuning access, priority support. | $99/month | :x: No equivalent | :x: No equivalent | :x: No equivalent | :x: No equivalent |
| **Team Tier** | Collaborative tier with team workspaces, SSO, and dedicated support for growing organisations. | $299/month | :x: | :x: | :x: | :x: |
| **Enterprise Custom Pricing** | Tailored pricing with committed spend, VPC peering, dedicated CSM, and custom SLA. | $2K–25K/month | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: |
| **Transparent Per-Token Pricing** | Publicly listed input/output token rates for every model with no hidden fees or opaque "compute unit" abstractions. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Startup Programme** | Dedicated credits and support for early-stage companies building on AI. | $10K credits (12 months) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: |
| **Academic Discount** | Reduced pricing for universities and research institutions. | 50% discount | :x: | :x: | :x: | :x: |
| **Migration Bonus** | Credit incentive for developers switching from a competitor to reduce switching friction. | $100 credit | :x: | :x: | :x: | :x: |
| **Referral Programme** | Credit reward for existing users who bring new developers to the platform. | $25 per conversion | :x: | :x: | :x: | :x: |

---

## Competitive Positioning Summary

### Where AI Gateway Uniquely Wins

**1. The Only Full Platform Leader**
Every competitor excels at one thing: Together AI has the broadest catalog, Fireworks has the fastest inference, Groq has the fastest TTFT, and OpenRouter has the simplest aggregation. **None of them offer a unified platform** combining inference + FinOps + governance + compliance + fine-tuning lifecycle. AI Gateway occupies the "full platform leader" quadrant alone.

**2. Zero Competitors in Cost Intelligence**
The $16B cloud FinOps market has no AI-native player. Every enterprise running AI at scale will need cost intelligence within 18–24 months as agentic AI multiplies request volumes 10–100x. AI Gateway is building this capability now, before demand peaks.

**3. Compliance as Architecture, Not Afterthought**
Retrofitting compliance into an existing inference platform is like adding safety to a car after manufacturing. AI Gateway's SOC 2, GDPR, EU AI Act, and MENA data residency are woven into auth/authz layers from day one. Competitors would need to re-architect to match.

**4. Distribution Moat That Cannot Be Replicated**
IHC Group's $238B ecosystem with 422 subsidiaries across healthcare, real estate, finance, and agriculture provides a built-in enterprise customer base with near-zero acquisition cost. No Silicon Valley competitor can replicate this advantage.

**5. Hardware Sovereignty**
The Tenstorrent partnership (RISC-V AI accelerators) provides a strategic path to reduce the 80–90% Nvidia dependency that constrains every other inference provider. Combined with AI Gateway's software platform, this creates a full-stack sovereign AI offering.

---

### Competitor-by-Competitor Summary

| Competitor | Their Strength | Their Gap | AI Gateway's Answer |
|---|---|---|---|
| **Together AI** | Broadest model catalog, research-grade models, training + inference | No FinOps, basic key management, no compliance, training-heavy focus | Full platform layer with cost intelligence, governance, and compliance on top of comparable inference |
| **Fireworks AI** | Fastest inference (FireAttention), strong developer experience | Inference-only — no compliance, no governance, no fine-tuning lifecycle | Match speed within 20%, win on everything above the inference layer |
| **Groq** | Extreme TTFT via custom LPU hardware | Limited model support (~20), supply-constrained, no platform features, post-Nvidia acquisition uncertainty | Broader model catalog, enterprise platform, scalable GPU infrastructure without supply constraints |
| **OpenRouter** | 5M users, 300+ model catalog (open + proprietary), simple pricing | Aggregator with thin margins, no enterprise features, no fine-tuning, no compliance | Depth with breadth — same model access plus platform features that OpenRouter cannot provide |

---

*AI Gateway by Infinia Technologies (IHC Group) — Every open-source model. One platform. Total control.*
