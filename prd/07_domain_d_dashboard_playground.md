# Domain D: Dashboard & Playground

## D1. Dashboard Shell — M1 · Mar 28

Authenticated dashboard with sidebar navigation, user menu, and onboarding card for first-time users.

### Features

- Sidebar navigation
- User menu
- Onboarding card
- Authenticated access

### User Flow

1. User logs in. Redirected to `/dashboard`.
2. Sees sidebar with navigation: Overview, Playground, Models, API Keys, Usage, Billing, Settings, Team.
3. Top-right shows user avatar + dropdown: Profile, Organization, Billing, Logout.
4. First-time users see onboarding card with 3 steps: (1) Copy your API key, (2) Make your first API call, (3) Explore the playground. Progress tracked.
5. Onboarding card is dismissible. Does not reappear after dismissal.
6. Dashboard adapts: desktop (sidebar visible), tablet (collapsible sidebar), mobile (hamburger menu).

### Success Metrics

| Metric | Target |
|--------|--------|
| Onboarding card completion rate | >70% |
| Avg pages visited per session | >5 |
| Users returning within 7 days of signup | >60% |

---

## D2. Interactive Playground — M2 · Apr 5

Web-based chat interface to test any model with system prompt, message composer, and streamed responses.

### Features

- Chat interface
- Model selector
- System prompt
- Message composer
- Streamed responses

### User Flow

1. User navigates to Playground from sidebar.
2. Selects model from dropdown (searchable, grouped by family).
3. Optionally sets system prompt in collapsible text area at top.
4. Types message in composer at bottom. Send on Enter (Shift+Enter for newline).
5. Response streams token-by-token with typing indicator.
6. After response completes: shows model, tokens (input/output), cost, TTFT, total latency below the message.
7. User can continue conversation or click "New Chat" to clear.
8. Usage deducted from credit balance / billing. Appears in cost dashboard.

### Success Metrics

| Metric | Target |
|--------|--------|
| Avg session duration | >3 min |
| Avg prompts per session | >5 |
| Playground users who later use API programmatically | >40% |

---

## D3. Side-by-Side Comparison — M2 · Apr 5

Send same prompt to 2 models simultaneously. See responses stream in parallel with latency and cost comparison.

### Features

- Dual model selection
- Parallel streaming
- Latency comparison
- Cost comparison

### User Flow

1. User switches to "Compare" tab in Playground.
2. Selects Model A (left panel) and Model B (right panel).
3. Types prompt. Clicks "Compare" (or Enter). Prompt sent to both models simultaneously.
4. Both responses stream in parallel in side-by-side panels.
5. After completion: each panel shows tokens, cost, TTFT, total latency. Faster/cheaper model highlighted.

### Success Metrics

| Metric | Target |
|--------|--------|
| Comparisons per week by M2 | 100+ |
| Comparisons leading to model selection change | >60% |
| Playground users trying comparison mode | >30% |

---

## D4. Blind Comparison Mode — M2 · Apr 5

Responses shown without labels. User picks winner. Models revealed after choice. Shareable URLs.

### Features

- Anonymous responses
- Winner selection
- Model reveal
- Shareable URLs

### User Flow

1. User switches to "Blind" tab in Playground.
2. Selects 2 models (hidden from view after selection). Types prompt. Clicks "Go".
3. Responses stream as "Response A" and "Response B" with no identifying info.
4. After both complete, user clicks "Pick Winner" on preferred response.
5. Reveal animation: model names, costs, latency shown for both. Winner highlighted.
6. Unique shareable URL generated. Anyone with URL sees prompt, both responses (blinded), and can view reveal.

### Success Metrics

| Metric | Target |
|--------|--------|
| Shared URLs in first week | 100+ |
| Shared URLs viewed by at least 1 other person | >50% |
| Viewers who sign up after seeing a shared comparison | >20% |

---

## D5. Public Playground — M3 · Apr 11

No account required for basic use. Limited to 5 requests per session. Connected to billing when authenticated.

### Features

- No account required
- 5 requests/session limit
- Billing connection when authed

### User Flow

1. Unauthenticated visitor navigates to `/playground`.
2. Can select model and send prompts. IP-based rate limit: 5 requests per session.
3. After 5th request, banner: "Create a free account for unlimited playground access + $5 credit."
4. If signed in, playground usage counts against credit balance / billing method.

### Success Metrics

| Metric | Target |
|--------|--------|
| Playground to signup conversion | >15% |
| Avg prompts before signup | >3 |
| Converted users making API call within 24h | >50% |
