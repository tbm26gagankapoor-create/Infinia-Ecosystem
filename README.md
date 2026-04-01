# AI Gateway

**Unified Open-Source LLM Inference Platform**

AI Gateway is a unified open-source LLM inference platform built by Infinia Technologies (IHC Group). It provides dual-compatible API endpoints (OpenAI and Anthropic formats) to many open-source and fine-tuned models on self-hosted GPUs with cost intelligence, enterprise governance, and compliance-as-architecture.

> PRD v1.0 · March 2026

---

## Documentation

| Folder | Description |
|--------|-------------|
| [`prd/`](prd/) | Full Product Requirements Document — 11 files covering vision, brand, personas, milestones, all 6 feature domains (A-F), and technical architecture |
| [`market_research/`](market_research/) | 14 in-depth market research documents covering opportunity analysis, competitive landscape, pricing, GTM, and more |
| [`user-portal/`](user-portal/) | React + TypeScript dashboard app (Vite, shadcn/ui, Tailwind) — Playground, Models, Projects, Analytics, API Keys |
| [`user-portal-app/`](user-portal-app/) | Production build output of the user portal (served by Netlify) |

---

## Timeline

| Date | Milestone |
|------|-----------|
| Mar 28 | **M1** — Sign Up + API |
| Apr 5 | **M2** — Playground + Teams |
| Apr 11 | **M3** — Billing Live |
| Apr 15 | **LAUNCH** |

---

## Brand Guidelines

AI Gateway follows a dark-first monochrome design system. Sharp corners, uppercase headings, and technical precision define the visual language.

### Logo

The AI Gateway logo is the Material Design `transit-connection-variant` icon — a network of connected nodes representing unified model routing and connectivity.

| On Dark Background | On Light Background |
|:--:|:--:|
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/logo-white.svg"><img src="assets/logo-white.svg" width="64" height="64" alt="AI Gateway logo (white)"></picture> | <picture><source media="(prefers-color-scheme: light)" srcset="assets/logo-black.svg"><img src="assets/logo-black.svg" width="64" height="64" alt="AI Gateway logo (black)"></picture> |

#### Logo Usage Rules

| Rule | Details |
|------|---------|
| Minimum size | 24px x 24px (icon only), 120px width (lockup) |
| Clear space | Minimum 50% of icon width on all sides |
| Dark backgrounds | White icon (#ffffff) |
| Light backgrounds | Black icon (#000000) |
| Do not | Rotate, distort, add drop shadows, change colors, place on busy backgrounds |
| Source | Material Design Icons: `transit-connection-variant` |
| Favicon | Use icon-only at 32px x 32px with transparent background |

### Color Palette

| Color | Value | Usage |
|-------|-------|-------|
| Black | `#000000` | Backgrounds |
| Dark | `#111111` | Surfaces |
| Card | `#1a1a1a` | Cards, panels |
| White | `#ffffff` | Primary text |
| White 80% | `rgba(255,255,255,0.8)` | Body text |
| Gray | `#9c9c9c` | Muted, labels |
| Border | `rgba(255,255,255,0.12)` | Borders |
| Success | `#22c55e` | Status |
| Warning | `#eab308` | Alerts |
| Error | `#ef4444` | Destructive |
| Info | `#3b82f6` | Links, accents |

### Typography

| Element | Spec |
|---------|------|
| Heading Level 1 | Space Grotesk · 2.4rem · 700 · uppercase · -0.02em |
| Heading Level 2 | Space Grotesk · 1.5rem · 700 · uppercase · 0.01em |
| Heading Level 3 | Space Grotesk · 1.15rem · 700 · uppercase · 0.02em |
| Label / Caption | Space Grotesk · 0.85rem · 600 · uppercase · 0.08em · Gray |
| Body | Space Grotesk · 0.95rem · 400 · rgba(255,255,255,0.8) · line-height 1.65 |
| Code | Roboto Mono · 0.82rem · 400 |

### Component Patterns

| Pattern | Properties | Usage |
|---------|-----------|-------|
| Card | bg: #1a1a1a, border: 1px rgba(255,255,255,0.12), padding: 1.5rem, radius: 0 | Content containers, stats, pricing |
| Featured Card | border: 2px #ffffff, box-shadow: 0 4px 20px rgba(255,255,255,0.08) | Highlighted items, popular tier |
| Feature Box | border-left: 3px rgba(255,255,255,0.6), bg: rgba(255,255,255,0.04) | Callouts, feature highlights |
| Table Header | bg: #1a1a1a, font: 0.75rem uppercase 0.06em spacing | All data tables |
| Hover State | translateY(-2px), box-shadow: 0 4px 16px rgba(0,0,0,0.3), transition: 0.2s | All interactive cards |
| Grid | auto-fit minmax, gap: 1.25rem | Responsive layouts |

### Spacing & Layout

| Element | Value |
|---------|-------|
| Card padding | 1.5rem |
| Grid gap | 1.25rem |
| Section margin | 2.5rem |
| Border width | 1px (standard), 2px (featured) |
| Border radius | 0 (always) |
| Content max-width | 1100px |
| Sidebar width | 260px |

### Brand Voice

Enterprise, technical, precise. Uppercase headings convey authority. Concise descriptions respect the reader's time. Monospace for all technical content. Dark-first design signals professional-grade tooling.

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

Dual-compatible inference API supporting both OpenAI and Anthropic SDK formats. Many open-source and fine-tuned models on self-hosted K8s GPU cluster. Drop-in replacement for both OpenAI and Anthropic SDKs.

**OpenAI endpoint:**
```
POST /v1/chat/completions
Authorization: Bearer tf-xxxx
base_url: https://api.aigateway.ai/v1
model: meta-llama/llama-3.1-70b-instruct
```

**Anthropic endpoint:**
```
POST /v1/messages
x-api-key: tf-xxxx
base_url: https://api.aigateway.ai
model: meta-llama/llama-3.1-70b-instruct
```

Each request generates a billing event: model, tokens (input/output), cost, latency, key ID.

| Metric | Target |
|--------|--------|
| Open-source and fine-tuned models at launch | Many |
| Developers successful on first API call | >80% |
| Users trying 2+ models (30d) | >50% |
| Week-1 to Week-2 retention | >70% |
| OpenAI SDK drop-in compatibility | 100% |
| Anthropic SDK drop-in compatibility | 100% |

#### B2. Model Catalog — M1

Browsable, searchable model list with rich metadata: provider, context window, cost per token, capabilities, speed, benchmarks (MMLU, HumanEval).

- Search via Command/Cmd+K
- Filter by capability (chat/code/vision), provider, price range, context window, speed tier
- "Try in Playground" from detail view

#### B3. Streaming Responses — M1

Real-time token-by-token streaming via Server-Sent Events. Supports both OpenAI and Anthropic streaming protocols.

- `"stream": true` in request body
- OpenAI format: SSE events with `data: {"choices":[{"delta":{"content":"token"}}]}`
- Anthropic format: Typed SSE events (`message_start`, `content_block_delta`, `message_stop`)
- Final usage object in last chunk
- 100% OpenAI and Anthropic SDK streaming compatibility

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
- Failed payment retry (3x over 7 days), then account restricted to prepaid only

#### F3. Per-Million-Token Pricing — M3

Two billing methods, both charged per million tokens at model-specific rates:

| Billing Method | How It Works | Volume Discounts |
|---------------|-------------|-----------------|
| **Prepaid (Credits)** | Purchase credits upfront. Deducted per million tokens consumed. $5 free credit on signup. | 5-15% on bulk purchases ($1K+) |
| **Postpaid (Invoice)** | Use now, invoiced monthly per million tokens consumed. Net-30 terms. | 15-30% on committed spend |

#### F4. Billing Dashboard — M3

Current billing method (Prepaid/Postpaid), credit balance or invoice history, per-model token consumption breakdown, payment method management.

#### F5. Enterprise & Volume Agreements — M3

Volume discounts on bulk credit purchases, committed spend agreements for postpaid customers, custom per-million-token rates.

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
  ┌────┴────┐
  ↓         ↓
Backend   Envoy Proxy ──→ PgSQL
  ↓         ↕ ext_auth/tcp    ↑
  └──→ Control Service        MongoDB
        ↕ ext_proc/grpc       ↑
      Envoy Proxy ────────→ Redis
        ↓
  Dynamic Forward Proxy
        ↓
  K8s GPU Cluster
    ↓    ↓    ↓
  Models Models Models
    ↑
  Operator ←→ GitHub
```

### Component Map

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Edge Layer | CloudFlare | CDN, DDoS mitigation, TLS termination, edge caching |
| Backend | Application server | Dashboard API, billing logic, org management |
| Control Service | Custom service | Auth decisions, ext_proc/gRPC processing, policy enforcement |
| API Gateway | Envoy Proxy | Auth (ext_auth/tcp), rate limiting, request routing |
| Dynamic Forward Proxy | Envoy | Routes inference requests to model endpoints in GPU cluster |
| Primary Database | PgSQL | Relational data — users, orgs, keys, billing, plans |
| Document Store | MongoDB | Usage logs, audit trails, model metadata |
| Cache | Redis | Session cache, rate limiting counters, real-time metrics |
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
| Jawad | Infrastructure & Data | Backend, Control Service, Envoy Proxy, PgSQL, MongoDB, Redis, Dynamic Forward Proxy |
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

## User Portal

The `user-portal/` directory contains the interactive dashboard built with React, TypeScript, Vite, and shadcn/ui. Key pages:

| Page | Description |
|------|-------------|
| Dashboard | Overview with quickstart guide, usage stats, and recent activity |
| Playground | Interactive chat interface with model selector, parameter panel, and streaming responses |
| Models | Browsable model catalog with provider icons, search, and filtering |
| Projects | Project-based API key and usage organization |
| Analytics | Usage analytics with request volume, token breakdown, and cost tracking |

### Local Development

```bash
cd user-portal
npm install
npm run dev
```

---

*AI Gateway · Infinia Technologies · IHC Group*
