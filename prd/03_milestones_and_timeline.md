# Milestones & Timeline

## Overview

| Date | Milestone |
|------|-----------|
| Mar 28 | **M1** |
| Apr 5 | **M2** |
| Apr 11 | **M3** |
| Apr 15 | **Launch** |

## M1: March 28 — Users Can Sign Up and Make API Calls

**Features:** A1 (Auth), B1 (Unified API), B2 (Model Catalog), B3 (Streaming), C1 (API Keys), D1 (Dashboard Shell), F1 (Credits)

**Exit criteria:** New user signs up, receives $5 credit, creates API key, makes successful inference call via either `/v1/chat/completions` (OpenAI) or `/v1/messages` (Anthropic) with streaming. All models accessible.

## M2: April 5 — Playground, Cost Dashboard, Team Management

**Features:** D2 (Playground), D3 (Side-by-Side), D4 (Blind Comparison), E1 (Cost Dashboard), E2 (Budget Alerts), E3 (Usage Analytics), C2 (Key Scoping), C3 (Key Rotation), A2 (Team/Org)

**Exit criteria:** Full playground with comparison modes. Cost dashboard with real-time spend. Org creation with role-based access. Key scoping and rotation working.

## M3: April 11 — Billing Live

**Features:** F2 (Metered Billing), F3 (Pricing Tiers), F4 (Billing Dashboard), F5 (Enterprise Discounts), D5 (Public Playground)

**Exit criteria:** Stripe billing active. All tiers purchasable. Invoices generated. Public playground with IP-based rate limiting.

## M4: April 15 — LAUNCH

**Gate criteria:**
- All M1-M3 features passing
- 99.9% uptime for 7+ consecutive days
- Load test at 2x peak
- Security audit complete
- 1+ IHC subsidiary onboarded end-to-end
- Monitoring and on-call operational

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
