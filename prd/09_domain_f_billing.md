# Domain F: Billing & Payments

## F1. Credit System — M1 · Mar 28

$5 free credit on signup. Consumed before any paid billing method is charged.

### Features

- $5 free credit
- Auto-apply on signup
- Consumed before paid billing

### User Flow

1. User completes email verification (or Google OAuth signup).
2. $5.00 credit automatically applied to account. No credit card required.
3. Credit balance visible in dashboard header and billing page.
4. API usage deducts from credit balance first.
5. When balance falls below $1.00: email + dashboard notification ("Low credit balance").
6. When balance reaches $0.00: if no payment method, API calls return 402. Prompt to add payment method or upgrade plan.

### Success Metrics

| Metric | Target |
|--------|--------|
| Signup lift vs credit-card-required flow | 3x |
| Free to paid conversion within 90 days | 5-10% |
| Users consuming >$1 of free credit | >70% |

---

## F2. Metered Billing — M3 · Apr 11

Automatic per-token billing with hourly usage aggregation via Stripe.

### Features

- Per-token billing
- Hourly usage aggregation
- Stripe integration

### User Flow

1. User adds payment method (credit/debit card via Stripe Elements).
2. API usage generates billing events per request (input tokens + output tokens at model-specific rates).
3. Usage aggregated hourly. Real-time estimates on dashboard (not billed until aggregation).
4. At end of billing period (monthly): invoice generated with line items per model.
5. Stripe charges payment method. Invoice status: paid/pending/failed.
6. Failed payment: retry 3 times over 7 days. After final failure, account downgraded to free tier.

### Success Metrics

| Metric | Target |
|--------|--------|
| Billing disputes per 1000 invoices | 0 |
| Users understanding their invoice on first view | >90% |
| Invoices paid without manual intervention | >95% |

---

## F3. Pricing Tiers — M3 · Apr 11

Free, Pay-As-You-Go, Pro ($99/mo), Team ($299/mo), Enterprise (custom $2K+/mo). Prepaid and postpaid options.

### Features

- Free tier
- Pay-As-You-Go
- Pro ($99/mo)
- Team ($299/mo)
- Enterprise ($2K+/mo)
- Prepaid/postpaid options

### Tier Details

| Tier | Price | Discount | RPM | Keys | Key Features |
|------|-------|----------|-----|------|-------------|
| Free | $0/mo | None | 10 | 1 | $5 credit, playground |
| PAYG | $0/mo | None | 100 | Unlimited | Standard pricing, basic dashboard |
| Pro | $99/mo | 5-10% | 1,000 | Unlimited | RBAC, cost allocation, webhooks, fine-tuning, priority support |
| Team | $299/mo | 8-12% | 5,000 | Unlimited | SSO, team workspaces, advanced analytics |
| Enterprise | $2K+/mo | 15-30% | Custom | Unlimited | VPC, custom SLA, CSM, ZDR, audit logs, data residency |

### User Flow

1. User navigates to Billing → Plans. Sees tier comparison cards.
2. Each card shows: tier name, price, token discount, RPM limit, included features.
3. Clicks "Upgrade" on desired tier. Confirms plan change in dialog.
4. Upgrade: immediate. Pro-rated charge for remainder of billing cycle.
5. Downgrade: takes effect at end of current billing cycle. No refund for current period.
6. Enterprise: "Contact Sales" button opens form or calendly link.

### Success Metrics

| Metric | Target |
|--------|--------|
| Free to paid conversion (90d) | >7% |
| PAYG to Pro upgrade rate (90d) | >2% |
| Pricing page visitors who start checkout | >30% |

---

## F4. Billing Dashboard — M3 · Apr 11

Current plan, usage summary, invoice history, payment method, upgrade/downgrade flow.

### Features

- Current plan display
- Usage summary
- Invoice history
- Payment method
- Upgrade/downgrade flow

### User Flow

1. User navigates to Billing from sidebar.
2. Current Plan card: Tier name, renewal date, included features summary.
3. Usage summary card: Current period tokens and dollar amount.
4. Invoice history table: Date, amount, status (paid/pending/failed), download PDF.
5. Payment method section: Card on file (masked), "Update" and "Add backup" buttons.
6. Plan management: "Upgrade" / "Downgrade" buttons with plan comparison.

### Success Metrics

| Metric | Target |
|--------|--------|
| Users self-serving billing questions (no support ticket) | >80% |
| Users downloading at least one invoice PDF | >50% |
| Plan changes completed without abandonment | >90% |

---

## F5. Enterprise Discounts — M3 · Apr 11

Enterprise volume discounts, custom pricing, prepaid token credit purchases.

### Features

- Volume discounts
- Custom pricing
- Prepaid token credits

### User Flow

1. **Volume discounts:** Enterprise customers on committed spend get automatic discount applied at invoice level.
2. **Custom pricing:** Admin sets custom per-token rates for specific enterprise accounts via internal tool.
3. **Prepaid:** Enterprise customer purchases token credit block at discounted rate. Balance tracked. Consumed before metered billing.
4. All discounts visible on invoice as separate line items.

### Success Metrics

| Metric | Target |
|--------|--------|
| Committed ARR from discount programs | $5M+ |
| Enterprise customers on committed spend agreements | >80% |
| Prepaid credit blocks fully consumed before expiry | >90% |
