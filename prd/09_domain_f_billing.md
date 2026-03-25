# Domain F: Billing & Payments

## F1. Credit System (Prepaid) — M1 · Mar 28

Prepaid billing method. Users purchase credits upfront; credits are deducted per million tokens consumed at model-specific rates.

### Features

- Purchase credit balance via card or bank transfer
- $5 free credit on signup (no credit card required)
- Credits deducted per million tokens at model-specific rates
- Real-time balance tracking
- Auto-top-up option at configurable threshold

### User Flow

1. User completes email verification (or Google OAuth signup).
2. $5.00 credit automatically applied to account. No credit card required.
3. Credit balance visible in dashboard header and billing page.
4. API usage deducts from credit balance based on per-million-token rate for each model used (input and output tokens metered separately).
5. When balance falls below configurable threshold (default $1.00): email + dashboard notification ("Low credit balance").
6. If auto-top-up enabled: automatically purchase additional credits at configured amount.
7. When balance reaches $0.00: if no auto-top-up, API calls return 402. Prompt to add credits.
8. Users can purchase additional credits anytime. Bulk credit purchases receive volume discounts.

### Success Metrics

| Metric | Target |
|--------|--------|
| Signup lift vs credit-card-required flow | 3x |
| Free credit to paid conversion within 90 days | 5-10% |
| Users consuming >$1 of free credit | >70% |

---

## F2. Postpaid Billing (Invoice) — M3 · Apr 11

Postpaid billing method. Usage is metered per million tokens consumed at model-specific rates and invoiced monthly. **Postpaid is not self-serve — it requires sales engagement, SLA signature, and activation by an Infinia admin.**

### Features

- Per-million-token billing at model-specific rates
- Input and output tokens metered separately
- Hourly usage aggregation
- Monthly invoice generation via Stripe
- Net-30 payment terms
- Per-organisation credit limit (set by admin); prevents unbounded exposure
- Postpaid activation gated on signed SLA and admin approval

### Activation Flow (Sales-Led)

1. User clicks "Switch to Postpaid" in Billing settings → shown a **Contact Sales** prompt (email: sales@infinia.ai and Calendly booking link). No self-serve approval.
2. Sales team qualifies the organisation, agrees on credit limit and terms, and sends SLA for signature (DocuSign or equivalent).
3. Once SLA is signed, an Infinia admin activates postpaid for the organisation in the **Admin Portal** and sets the credit limit (dollar amount).
4. Organisation owner receives an email confirming postpaid is active, showing the allocated credit limit.
5. Organisation's billing dashboard updates to show "Postpaid (Active)" status and the credit limit.

### Billing Cycle Flow (Post-Activation)

1. API usage generates billing events per request (input tokens + output tokens at model-specific rates per million tokens).
2. Usage aggregated hourly. Real-time estimates on dashboard (not billed until invoice).
3. Credit limit enforced: at 80% of limit, email alert sent to org owner and all admins. At 100%, API calls return 402 until the next billing cycle resets or admin increases the limit.
4. At end of billing period (monthly): invoice generated with line items per model showing token consumption and cost.
5. Invoice sent via email and available in dashboard. Payment due Net-30.
6. Stripe charges payment method on file, or customer pays via bank transfer.
7. Failed payment: retry 3 times over 7 days. After final failure, postpaid suspended and account restricted to prepaid only until resolved with sales.

### Success Metrics

| Metric | Target |
|--------|--------|
| Billing disputes per 1000 invoices | 0 |
| Orgs understanding their invoice on first view | >90% |
| Invoices paid without manual intervention | >95% |
| Sales-to-activation cycle time | <3 business days |

---

## F3. Per-Million-Token Model Pricing — M3 · Apr 11

All models priced per million tokens with separate input and output rates. Both prepaid and postpaid methods use the same published rates.

### Features

- Per-million-token pricing for every model
- Separate input and output token rates
- Published rate card on website
- Volume discounts for bulk prepaid purchases or committed postpaid spend
- Custom enterprise rates available

### Model Pricing Structure

| Model Category | Example Models | Input (per 1M tokens) | Output (per 1M tokens) |
|----------------|---------------|----------------------|----------------------|
| Small (7-8B) | LLaMA 3.1 8B, Mistral 7B | $0.10–0.20 | $0.10–0.20 |
| Medium (13-34B) | LLaMA 3.1 13B, CodeLlama 34B | $0.30–0.60 | $0.30–0.60 |
| Large (70B+) | LLaMA 3.1 70B, Mistral Large, DeepSeek V3 | $0.50–1.20 | $0.50–1.50 |
| Embeddings | Various embedding models | $0.01–0.05 | — |

### Volume Discounts

| Commitment Level | Discount |
|-----------------|----------|
| $1K+ prepaid credit purchase | 5% |
| $5K+ prepaid credit purchase | 10% |
| $10K+ prepaid or committed postpaid spend | 15% |
| $50K+ committed annual spend | 20-30% (custom) |

### User Flow

1. User navigates to Pricing page. Sees per-million-token rates for all models.
2. Chooses billing method: Prepaid (buy credits) or Postpaid (monthly invoice).
3. For Prepaid: enters credit purchase amount, applies payment. Credits available immediately.
4. For Postpaid: contacts sales, signs SLA, and is activated by an Infinia admin. Usage billed monthly once active.
5. Volume discounts applied automatically based on purchase/commitment level.
6. Enterprise customers: "Contact Sales" button opens form for custom rates and committed spend agreements.

### Success Metrics

| Metric | Target |
|--------|--------|
| Free to paid conversion (90d) | >7% |
| Prepaid users who top up within 30 days | >40% |
| Pricing page visitors who complete purchase | >30% |

---

## F4. Billing Dashboard — M3 · Apr 11

Current billing method, usage summary, credit balance or invoice history, payment method, and method switching flow.

### Features

- Current billing method display (Prepaid or Postpaid)
- Credit balance (Prepaid) or current period usage (Postpaid)
- Token consumption breakdown by model
- Invoice history (Postpaid) or top-up history (Prepaid)
- Payment method management
- Switch to Postpaid: shows "Contact Sales" prompt (not self-serve)

### User Flow

1. User navigates to Billing from sidebar.
2. Billing method card: Shows "Prepaid" or "Postpaid (Active)". Prepaid users see a "Switch to Postpaid" link that opens the Contact Sales prompt — not a self-serve toggle.
3. For Prepaid: Credit balance, recent deductions by model, top-up history, "Add Credits" button.
4. For Postpaid: Current period usage by model, estimated invoice amount, invoice history table (date, amount, status, download PDF).
5. Token consumption breakdown: Per-model table showing tokens consumed, rate per million, and cost.
6. Payment method section: Card on file (masked), "Update" and "Add backup" buttons.

### Success Metrics

| Metric | Target |
|--------|--------|
| Users self-serving billing questions (no support ticket) | >80% |
| Users downloading at least one invoice PDF | >50% |
| Billing method switches completed without abandonment | >90% |

---

## F5. Enterprise & Volume Agreements — M3 · Apr 11

Custom pricing, volume discounts, and committed spend agreements for high-volume customers.

### Features

- Volume discounts on prepaid credit purchases
- Committed spend agreements for postpaid customers
- Custom per-million-token rates for enterprise accounts
- IHC Group inter-company billing

### User Flow

1. **Volume discounts (Prepaid):** Customers purchasing bulk credits receive automatic discounts at defined thresholds.
2. **Committed spend (Postpaid):** Enterprise customers commit to minimum monthly or annual spend in exchange for discounted per-million-token rates.
3. **Custom pricing:** Admin sets custom per-million-token rates for specific enterprise accounts via internal tool.
4. **IHC Group billing:** Inter-company billing with 20-30% discount on published rates. Automated cost allocation and cross-charging.
5. All discounts visible on invoice or credit purchase receipt as separate line items.

### Success Metrics

| Metric | Target |
|--------|--------|
| Committed ARR from volume agreements | $5M+ |
| Enterprise customers on committed spend agreements | >80% |
| Prepaid credit blocks fully consumed before expiry | >90% |
