# AI Gateway

**Unified Open-Source LLM Inference Platform**

AI Gateway is a unified open-source LLM inference platform built by Infinia Technologies (IHC Group). It provides a single OpenAI-compatible API endpoint to 40+ open-source models with cost intelligence, enterprise governance, and compliance-as-architecture.

> PRD v1.0 · March 2026

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Charts | Recharts |
| Data Tables | TanStack Table (pivot/grouping) |
| API Compatibility | OpenAI-compatible (`/v1/chat/completions`) |
| Payments | Stripe (metered billing) |
| Auth | NextAuth.js / Auth.js (email + Google OAuth) |
| API Key Prefix | `tf-` |

---

## Timeline

| Date | Milestone |
|------|-----------|
| Mar 28 | **M1** — Sign Up + API |
| Apr 5 | **M2** — Playground + Teams |
| Apr 11 | **M3** — Billing Live |
| Apr 15 | **LAUNCH** |

---

## Feature Domains

### Domain A: Authentication & User Management

#### A1. User Authentication — M1

Email/password signup, Google OAuth, email verification, forgot password. $5 free credit applied on verification.

- Email/password signup with validation (min 8 chars, mixed case, 1 number)
- Google OAuth (account created or linked if email matches)
- Email verification (link expires 24h, $5 credit on verification)
- Forgot password (reset link expires 1h)
- Onboarding redirect to dashboard

| Metric | Target |
|--------|--------|
| Signup completion rate | >90% |
| Email verification rate | >80% |
| Users making first API call within 24h | >60% |
| Signup to first API call | <2 min |

#### A2. Team/Org Management — M2

- Create organizations with URL-safe slug
- Invite members by email (Admin/Member roles, 7-day expiry)
- Org-level default settings (model allowlist, rate limits, cost ceilings)
- Context switching between personal and org

| Metric | Target |
|--------|--------|
| IHC subsidiaries onboarded | 3+ |
| Invite acceptance rate | >70% |
| Orgs with 3+ members (30d) | >50% |

---

### Domain B: Inference API & Models

#### B1. Unified Inference API — M1

Single OpenAI-compatible endpoint supporting 40+ open-source models. Drop-in replacement for any OpenAI SDK.

```
POST /v1/chat/completions
Authorization: Bearer tf-xxxx
base_url: https://api.aigateway.ai/v1
model: meta-llama/llama-3.1-70b-instruct
```

Each request generates a billing event: model, tokens (input/output), cost, latency, key ID.

| Metric | Target |
|--------|--------|
| Models at launch | 40+ |
| Developers successful on first API call | >80% |
| Users trying 2+ models (30d) | >50% |
| Week-1 to Week-2 retention | >70% |

#### B2. Model Catalog — M1

Browsable, searchable model list with rich metadata: provider, context window, cost per token, capabilities, speed, benchmarks (MMLU, HumanEval).

- Search via Command/Cmd+K
- Filter by capability (chat/code/vision), provider, price range, context window, speed tier
- "Try in Playground" from detail view

#### B3. Streaming Responses — M1

Real-time token-by-token streaming via Server-Sent Events for all chat completions.

- `"stream": true` in request body
- SSE events with `data: {"choices":[{"delta":{"content":"token"}}]}`
- Final usage object in last chunk
- 100% OpenAI SDK drop-in compatibility

---

### Domain C: API Key Management

#### C1. Basic API Key Management — M1

- Create keys with name and optional source/app label
- Key displayed once in full (`tf-sk_live_xxxx`), then masked
- Revoke with immediate effect (<1s)

#### C2. Advanced Key Scoping — M2

- Per-key model allowlists (403 for unauthorized models)
- RPM rate limits (429 with Retry-After)
- Monthly cost ceilings (email at 80% and 100%)
- Labels/tags for filtering and reporting (e.g., `env:production`, `team:ml-ops`)

#### C3. Key Rotation — M2

- Generate replacement key with 24-hour grace period
- Both old and new keys authenticate during overlap
- Dashboard countdown timer, cancel option during grace period

---

### Domain D: Dashboard & Playground

#### D1. Dashboard Shell — M1

Authenticated dashboard with sidebar navigation, user menu, and onboarding card.

- Sidebar: Overview, Playground, Models, API Keys, Usage, Billing, Settings, Team
- 3-step onboarding: Copy API key → Make first call → Explore playground
- Responsive: desktop sidebar, tablet collapsible, mobile hamburger

#### D2. Interactive Playground — M2

Web-based chat interface to test any model with system prompt, message composer, and streamed responses.

- Model selector (searchable, grouped by family)
- System prompt in collapsible text area
- Token-by-token streaming with typing indicator
- Post-response metadata: model, tokens, cost, TTFT, latency

#### D3. Side-by-Side Comparison — M2

Send same prompt to 2 models simultaneously. Responses stream in parallel with latency and cost comparison. Faster/cheaper model highlighted.

#### D4. Blind Comparison — M2

- Responses shown as "Response A" / "Response B" with no identifying info
- User picks winner, then reveal animation shows model names, costs, latency
- Shareable URLs for each comparison

#### D5. Public Playground — M3

- No account required, IP-based rate limit (5 requests/session)
- Signup prompt after 5th request with $5 credit incentive
- Usage counts against balance when authenticated

---

### Domain E: Cost & Usage Intelligence

#### E1. Cost Intelligence Dashboard — M2

- Real-time spend tracking with date range picker (Today, 7d, 30d, Custom)
- Spend over time chart (line/area)
- Spend by model (horizontal bar chart)
- Spend by API key (table with % of total)
- Pivot table: group by model × key × date × team
- CSV export

#### E2. Budget Alerts — M2

- Monthly cost ceiling per organization
- Email alerts at 80% and 100% thresholds
- Configurable behavior at 100%: "Alert only" or "Hard stop" (disable all keys)

#### E3. Usage Analytics — M2

- Request volume by model over time
- Token breakdown (input vs. output) by model
- Latency percentiles: p50, p95, p99 per model with sparkline trends
- Error rates by model and error code (429, 500, 503)
- Pivot table for any permutation of model × key × status × date × team

---

### Domain F: Billing & Payments

#### F1. Credit System — M1

- $5 free credit on signup (no credit card required)
- Credit consumed before paid billing
- Low balance notification at $1.00
- API returns 402 at $0.00 with no payment method

#### F2. Metered Billing — M3

- Per-token billing with model-specific rates
- Hourly usage aggregation via Stripe
- Monthly invoices with per-model line items
- Failed payment retry (3x over 7 days), then downgrade to free

#### F3. Pricing Tiers — M3

| Tier | Price | Discount | RPM | Keys | Key Features |
|------|-------|----------|-----|------|-------------|
| Free | $0/mo | None | 10 | 1 | $5 credit, playground |
| PAYG | $0/mo | None | 100 | Unlimited | Standard pricing, basic dashboard |
| Pro | $99/mo | 5-10% | 1,000 | Unlimited | RBAC, cost allocation, webhooks, fine-tuning, priority support |
| Team | $299/mo | 8-12% | 5,000 | Unlimited | SSO, team workspaces, advanced analytics |
| Enterprise | $2K+/mo | 15-30% | Custom | Unlimited | VPC, custom SLA, CSM, ZDR, audit logs, data residency |

#### F4. Billing Dashboard — M3

Current plan, usage summary, invoice history (with PDF download), payment method management, upgrade/downgrade flow.

#### F5. Enterprise Discounts — M3

Volume discounts, custom per-token pricing, prepaid token credit blocks at discounted rates.

---

## Target Users

| Segment | Description | Monthly Spend | Priority |
|---------|-------------|--------------|----------|
| C1: Indie Hacker | Individual devs, students, hobbyists | $0-50 | Medium (funnel) |
| C2: Startup Builder | Seed-to-Series B, 5-50 employees | $50-2,000 | High (growth) |
| C3: Mid-Market | 50-1,000 employees, 5-20 AI devs | $2K-25K | High |
| C4: Enterprise | Fortune 500, SOC 2, SSO, SLAs required | $25K-500K | High (revenue) |
| C5: AI-Native | AI is the product, multi-provider architecture | $10K-1M+ | Medium (credibility) |
| C6: Regulated | Healthcare, finance, government | $50K-2M+ | High (post-SOC 2) |
| C7: IHC Group | 50-100 tech-active subsidiaries | $5K-500K | Highest (launch) |

---

## Technical Architecture

### Request Flow

```
User Portal / App
       ↓
CloudFlare (CDN + Edge)
       ↓
Envoy Proxy (ext_auth/tcp ↔ Control Service)
       ↓
Dynamic Forward Proxy → K8s GPU Cluster → Models
```

### Component Map

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Edge Layer | CloudFlare | CDN, DDoS mitigation, TLS termination, edge caching |
| API Gateway | Envoy Proxy | Auth (ext_auth/tcp), rate limiting, request routing |
| Control Service | Custom service | Auth decisions, ext_proc/gRPC processing, policy enforcement |
| Backend | Application server | Dashboard API, billing logic, org management |
| Dynamic Forward Proxy | Envoy | Routes inference requests to model endpoints in GPU cluster |
| Model Serving | K8s GPU Cluster | Hosts open-source model instances (LLaMA, DeepSeek, Mistral, etc.) |
| Operator | K8s Operator | Model lifecycle management, scaling, health checks |
| CI/CD | GitHub | Source control, operator deployment pipelines |

### Envoy Proxy Integration

| Extension | Protocol | Purpose |
|-----------|----------|---------|
| ext_auth | TCP | Authentication & authorization — validates API keys, checks rate limits, verifies org membership |
| ext_proc | gRPC | Request/response processing — token counting, usage metering, request transformation, billing event emission |

### Ownership Domains

| Owner | Domain | Components |
|-------|--------|-----------|
| Jawad | Infrastructure & Data | Backend, Control Service, Envoy Proxy, Data Stores, Dynamic Forward Proxy |
| Shivank | Platform & Models | Plans/Tags/Org/Keys/Usage/Billing logic, Model Management & Operations, K8s GPU Cluster, Operator, GitHub CI/CD |

---

## Feature-to-Milestone Matrix

| ID | Feature | M1 | M2 | M3 | Priority |
|----|---------|----|----|-----|----------|
| A1 | User Authentication | ✓ | | | P0 |
| A2 | Team/Org Management | | ✓ | | P1 |
| B1 | Unified Inference API | ✓ | | | P0 |
| B2 | Model Catalog | ✓ | | | P0 |
| B3 | Streaming Responses | ✓ | | | P0 |
| C1 | Basic API Key Mgmt | ✓ | | | P0 |
| C2 | Advanced Key Scoping | | ✓ | | P1 |
| C3 | Key Rotation | | ✓ | | P1 |
| D1 | Dashboard Shell | ✓ | | | P0 |
| D2 | Interactive Playground | | ✓ | | P0 |
| D3 | Side-by-Side Comparison | | ✓ | | P0 |
| D4 | Blind Comparison | | ✓ | | P0 |
| D5 | Public Playground | | | ✓ | P1 |
| E1 | Cost Intelligence Dashboard | | ✓ | | P1 |
| E2 | Budget Alerts | | ✓ | | P1 |
| E3 | Usage Analytics | | ✓ | | P1 |
| F1 | Credit System | ✓ | | | P0 |
| F2 | Metered Billing | | | ✓ | P0 |
| F3 | Pricing Tiers | | | ✓ | P1 |
| F4 | Billing Dashboard | | | ✓ | P1 |
| F5 | Enterprise Discounts | | | ✓ | P2 |

---

*AI Gateway · Infinia Technologies · IHC Group*
