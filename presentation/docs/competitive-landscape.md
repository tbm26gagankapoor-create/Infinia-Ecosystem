# Competitive Landscape

The open-source inference market is rapidly consolidating around a handful of well-funded players. **Yet no single competitor owns the full enterprise platform layer** — the combination of inference, FinOps, governance, and sovereign deployment that large organisations actually need. That gap is AI Gateway's opportunity.

---

## Key Competitors

<div class="competitor-grid" markdown>

<div class="competitor-card" markdown>

#### Together AI

<span class="competitor-tag" style="background:#fee2e2;color:#991b1b;">THREAT: HIGH</span>

- **Funding:** $533M raised
- **Revenue:** ~$300M ARR
- **Strength:** Research-grade models (own LLM development), training + inference
- **Weakness:** Training-heavy focus, less enterprise platform polish

</div>

<div class="competitor-card" markdown>

#### Fireworks AI

<span class="competitor-tag" style="background:#fecaca;color:#7f1d1d;">THREAT: VERY HIGH</span>

- **Funding:** $327M raised, $4B valuation
- **Revenue:** ~$130M ARR
- **Strength:** Fastest inference (compound AI systems), strong developer experience
- **Weakness:** Inference-only, no compliance/governance layer

</div>

<div class="competitor-card" markdown>

#### Groq

<span class="competitor-tag" style="background:#fef9c3;color:#854d0e;">THREAT: MEDIUM</span>

- **Status:** Nvidia acquisition ~$6.5B
- **Strength:** Custom LPU silicon, extreme speed (>500 tok/s)
- **Weakness:** Limited model support, supply-constrained, post-acquisition uncertainty

</div>

<div class="competitor-card" markdown>

#### OpenRouter

<span class="competitor-tag" style="background:#fef9c3;color:#854d0e;">THREAT: MEDIUM</span>

- **Valuation:** ~$500M
- **Users:** 5M users, 30T tokens/month
- **Strength:** Massive model catalog (open + proprietary), developer-friendly
- **Weakness:** Aggregator model, thin margins, no enterprise features

</div>

</div>

---

## Feature Comparison

| Capability | Description | AI Gateway | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|---|---|---|---|---|
| **OpenAI-Compatible API** | Drop-in replacement for the OpenAI SDK — change your base URL and API key, existing code works instantly. Zero migration effort. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Streaming (SSE)** | Real-time token-by-token output via Server-Sent Events for responsive chat and interactive AI applications. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Embeddings API** | Vector embedding generation for semantic search, RAG pipelines, and similarity matching via `/v1/embeddings`. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :white_check_mark: |
| **Function / Tool Calling** | Structured tool-use support matching the OpenAI function-calling spec, enabling agentic workflows and structured output. | :white_check_mark: | :white_check_mark: | :white_check_mark: | Partial | :white_check_mark: |
| **Vision / Multimodal** | Support for models that accept image inputs alongside text (e.g., LLaVA, Qwen-VL). | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :white_check_mark: |
| **Interactive Playground** | Browser-based model testing with real-time streaming and parameter adjustment — no code required. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Python & TypeScript SDKs** | Official client libraries with full type hints, async support, and streaming. Published on PyPI and npm. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | Community |
| **Framework Integrations** | Pre-built connectors for LangChain, Vercel AI SDK, LlamaIndex, and CrewAI. | :white_check_mark: | :white_check_mark: | :white_check_mark: | Partial | :white_check_mark: |
| **Free Tier** | Zero-cost entry point for evaluation and prototyping with real production models. | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Auto-Scaling** | Elastic capacity that scales with demand without manual intervention. | :white_check_mark: | :white_check_mark: | :white_check_mark: | Limited | N/A (aggregator) |
| **99.9%+ Uptime SLA** | Guaranteed availability with public status page, incident timelines, and post-mortems. | 99.99% (Enterprise) | :white_check_mark: | :white_check_mark: | :white_check_mark: | Best-effort |
| **Multi-model API** | Single API endpoint to access 40+ open-source models (LLaMA, DeepSeek, Mistral, Qwen, Command R) with OpenAI-compatible interface — no separate integrations needed. | :white_check_mark: | :white_check_mark: | :white_check_mark: | Limited | :white_check_mark: |
| **Cost Intelligence / FinOps** | Real-time spend dashboards, per-team/project cost allocation, budget alerts, spend forecasting, and intelligent routing that delivers 20–40% cost savings. The AI FinOps layer no competitor offers. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Enterprise Key Mgmt** | Full RBAC with team hierarchies, API key scoping (model, rate, cost, IP, expiry restrictions), department-level billing with chargeback, SSO/SAML, and complete audit trails. | :white_check_mark: | Basic | :x: | :x: | :x: |
| **Fine-tuning Pipeline** | End-to-end lifecycle: data preparation → LoRA/QLoRA training → live evaluation → A/B traffic splitting → one-click rollback → drift monitoring. Creates the strongest switching cost ($5–50K to recreate). | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :x: |
| **Compliance / Governance** | SOC 2 Type II, HIPAA, GDPR, EU AI Act, PCI-DSS, ISO 27001 — built into auth/authz layers from day one. Zero Data Retention (ZDR) with cryptographic proof. PII auto-redaction. 7+ year audit log retention. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Sovereign AI / MENA** | Data residency in UAE (Abu Dhabi), Saudi Arabia (Riyadh), EU (Frankfurt), and US (Virginia). Gulf-region regulatory pre-configuration (UAE PDPL, Saudi PDPL, Bahrain DPL). Arabic-English bilingual support. | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Custom Silicon** | Strategic hardware partnership reducing Nvidia dependency. AI Gateway + Tenstorrent RISC-V accelerators = full-stack sovereign AI (software + hardware). | Tenstorrent | :x: | :x: | LPU | :x: |

---

## Competitive Positioning Map

<svg viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;margin:0 auto;display:block;">
  <text x="350" y="25" text-anchor="middle" fill="white" font-size="16" font-weight="700" font-family="Space Grotesk,sans-serif" letter-spacing="0.04em">COMPETITIVE POSITIONING</text>
  <rect x="80" y="40" width="280" height="200" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <rect x="360" y="40" width="280" height="200" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <rect x="80" y="240" width="280" height="200" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <rect x="360" y="240" width="280" height="200" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <text x="220" y="145" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="14" font-weight="600" font-family="Space Grotesk,sans-serif" letter-spacing="0.06em">INFERENCE SPECIALISTS</text>
  <text x="500" y="145" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="14" font-weight="600" font-family="Space Grotesk,sans-serif" letter-spacing="0.06em">FULL PLATFORM LEADERS</text>
  <text x="220" y="345" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="14" font-weight="600" font-family="Space Grotesk,sans-serif" letter-spacing="0.06em">NICHE PLAYERS</text>
  <text x="500" y="345" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="14" font-weight="600" font-family="Space Grotesk,sans-serif" letter-spacing="0.06em">PLATFORM BUILDERS</text>
  <circle cx="136" cy="80" r="5" fill="white"/>
  <text x="148" y="84" fill="rgba(255,255,255,0.8)" font-size="13" font-family="Space Grotesk,sans-serif">Groq</text>
  <circle cx="178" cy="100" r="5" fill="white"/>
  <text x="190" y="104" fill="rgba(255,255,255,0.8)" font-size="13" font-family="Space Grotesk,sans-serif">Fireworks AI</text>
  <circle cx="220" cy="140" r="5" fill="white"/>
  <text x="232" y="130" fill="rgba(255,255,255,0.8)" font-size="13" font-family="Space Grotesk,sans-serif">Together AI</text>
  <circle cx="164" cy="260" r="5" fill="white"/>
  <text x="176" y="264" fill="rgba(255,255,255,0.8)" font-size="13" font-family="Space Grotesk,sans-serif">OpenRouter</text>
  <circle cx="528" cy="120" r="7" fill="white" stroke="rgba(255,255,255,0.4)" stroke-width="3"/>
  <text x="544" y="124" fill="white" font-size="14" font-weight="700" font-family="Space Grotesk,sans-serif">AI Gateway</text>
  <text x="80" y="470" fill="rgba(255,255,255,0.6)" font-size="11" font-family="Space Grotesk,sans-serif" letter-spacing="0.05em">LOW PLATFORM CAPABILITY</text>
  <text x="640" y="470" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="11" font-family="Space Grotesk,sans-serif" letter-spacing="0.05em">HIGH PLATFORM CAPABILITY</text>
  <text x="40" y="440" transform="rotate(-90,40,280)" fill="rgba(255,255,255,0.6)" font-size="11" font-family="Space Grotesk,sans-serif" letter-spacing="0.05em">LOW INFERENCE CAPABILITY</text>
  <text x="40" y="80" transform="rotate(-90,40,80)" fill="rgba(255,255,255,0.6)" font-size="11" font-family="Space Grotesk,sans-serif" letter-spacing="0.05em">HIGH INFERENCE CAPABILITY</text>
</svg>

---

## Our Advantage

<div class="feature-box" markdown>

#### Why AI Gateway Wins

- **"Full Platform Leader" quadrant** — AI Gateway is the only player positioned in the upper-right, combining strong inference *and* deep platform capability.
- **Unique stack** — No competitor combines inference + FinOps + governance + sovereign AI in a single platform.
- **Distribution moat** — IHC backing and the Infinia Technologies enterprise customer base provide a go-to-market advantage competitors cannot replicate.
- **Timing window** — 18-24 months before market consolidation (2027-2028). First-mover in the enterprise platform layer locks in switching costs before incumbents expand.

</div>
