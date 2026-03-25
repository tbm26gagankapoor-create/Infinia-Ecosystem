# Pricing Architecture & Monetization

## Introduction: Why Pricing Is the Most Consequential Strategic Decision

In a market where the core product — LLM inference — is rapidly commoditizing, pricing architecture becomes the single most consequential strategic decision Token Factory will make. Pricing determines not just revenue and margin but also market positioning, customer segmentation, competitive dynamics, and long-term platform defensibility. A platform that prices too high will fail to acquire users in a market where switching costs are low and alternatives are abundant. A platform that prices too low will attract cost-sensitive customers who churn at the first sign of a cheaper option, while simultaneously destroying the margin needed to fund platform development. A platform that prices incoherently — with a structure that confuses customers or creates perverse incentives — will generate friction at every stage of the customer journey, from signup to expansion.

Token Factory's pricing architecture must accomplish five objectives simultaneously. First, it must attract developers and small teams with zero-friction entry, because developer adoption is the foundation of the entire go-to-market strategy. Second, it must capture increasing value as customers grow, ensuring that Token Factory's revenue scales proportionally with the value it delivers. Third, it must generate stable, predictable revenue that is at least partially insulated from the ongoing collapse in per-token pricing. Fourth, it must create natural expansion paths that align customer growth with increased platform usage, so that expansion revenue is the result of customer success rather than sales pressure. Fifth, it must accommodate IHC Group's inter-company billing requirements without creating separate systems or processes that add operational complexity.

The two-method pricing model — offering both Prepaid (credit-based) and Postpaid (invoice-based) billing, both charged per million tokens at model-specific rates — is the architecture that best accomplishes all five objectives. This approach provides maximum flexibility: developers and small teams can start immediately with prepaid credits (including a $5 free signup credit), while enterprises can opt for postpaid invoicing with committed spend agreements. Both methods use identical, transparent per-million-token rates, ensuring pricing consistency regardless of billing preference. This model mirrors successful developer platforms like cloud providers (AWS, GCP) that offer both on-demand and committed-use pricing without complex tier structures.

## Billing Architecture: Prepaid and Postpaid

The billing architecture provides two methods that serve different customer needs while maintaining a single, transparent rate card.

### Prepaid (Credit-Based)

The Prepaid method targets developers, startups, and teams who prefer budget control and upfront cost certainty. Customers purchase credits that are deducted per million tokens consumed at model-specific rates. The $5 free credit at signup with no credit card required eliminates the single largest friction point in the developer funnel — industry data consistently shows that requiring a credit card at signup reduces conversion rates by 50-70%. The free credit allocation is carefully calibrated: sufficient for meaningful evaluation (approximately 5-10 million tokens with efficient models, enough for hundreds of test queries) but insufficient for sustained production use.

Key characteristics of Prepaid billing:

- **Immediate access**: Credits available instantly upon purchase. No approval process.
- **Budget control**: Customers can never spend more than their credit balance. No surprise invoices.
- **Volume discounts**: Bulk credit purchases receive automatic discounts (5% at $1K+, 10% at $5K+, 15% at $10K+).
- **Auto-top-up**: Optional automatic credit replenishment at configurable thresholds.
- **Real-time tracking**: Credit balance and per-model consumption visible in real time on the dashboard.

The Prepaid method serves as Token Factory's primary customer acquisition channel. The zero-friction onboarding (signup → free credits → first API call in 2 minutes) creates a large top-of-funnel that feeds conversion to sustained paid usage. Expected customer behavior ranges from pure evaluators who consume only the $5 free credit to production users who maintain rolling credit balances of $1,000-50,000 per month.

### Postpaid (Invoice-Based)

The Postpaid method targets enterprises, high-volume users, and organizations that require invoiced billing for procurement and accounting purposes. Usage is metered per million tokens consumed at model-specific rates and invoiced monthly with Net-30 payment terms.

Key characteristics of Postpaid billing:

- **No upfront payment**: Use first, pay after. Monthly invoicing aligned with enterprise procurement cycles.
- **Committed spend agreements**: Enterprise customers can commit to minimum monthly or annual spend in exchange for discounted per-million-token rates (15-30% discount).
- **Custom rates**: High-volume enterprise accounts can negotiate custom per-million-token rates.
- **Net-30 terms**: Standard payment terms that align with enterprise accounts payable processes.
- **Detailed invoicing**: Line-item breakdown by model showing token consumption, rate per million, and total cost.

The Postpaid method is strategically important for enterprise revenue because it aligns with how large organizations purchase infrastructure services. Enterprise procurement teams are accustomed to monthly invoicing and committed-use agreements, and requiring prepaid credits would create unnecessary friction in the sales cycle. The committed spend component generates predictable, contracted revenue that enables financial planning and investor confidence.

## Per-Million-Token Pricing: The Rate Card

Both billing methods use identical per-million-token rates. This transparency is a deliberate strategic choice: customers can compare rates directly against competitors without navigating tier-specific discounts or opaque pricing structures.

Token rates are set based on three factors:

1. **Cost floor**: The fully loaded cost of inference (GPU compute, infrastructure overhead, engineering amortization) establishes the minimum viable price. For a 70B-parameter model on current-generation GPUs, this ranges from $0.30-0.75 per million tokens.

2. **Competitive positioning**: For marquee models (LLaMA 3.1 70B, Mistral Large, DeepSeek V3) where customers have direct price comparisons, Token Factory prices at or 5-10% below the lowest competitor price.

3. **Model category**: Smaller models (7-8B parameters) are priced near cost as funnel entry points, while larger models (70B+) carry healthier margins that reflect their higher value delivery.

Input and output tokens are metered and priced separately, reflecting the different computational costs of processing prompts versus generating completions.

### Strategic Loss Leaders

Small models (8B-13B parameters) popular for experimentation and evaluation are priced at or near cost. Their primary function is funnel entry: developers who start with a small model for prototyping graduate to larger, higher-margin models as their applications move to production. This loss-leader strategy must be executed deliberately — with clear internal guidelines about which models are designated as loss leaders and what margin floor applies to all others.

## Competitive Pricing Strategy

Token Factory's per-million-token pricing does not follow a single strategy but rather layers multiple pricing approaches:

**Cost-plus pricing** serves as the internal pricing floor — the minimum price at which any model can be offered without destroying margin. Any pricing decision that breaches the cost-plus floor must be explicitly approved as a strategic loss leader with a clear path to profitability.

**Competitive pricing** drives Token Factory's rates for marquee models where customers have direct price comparisons against Together AI, Fireworks AI, and other platforms. For these models, Token Factory prices at or 5-10% below the lowest competitor price, accepting reduced margin to eliminate price as a switching barrier.

**Value pricing (EDLP)** is Token Factory's strategic commitment to price transparency and consistency. All per-million-token rates are published on the website with no hidden fees, no variable pricing based on negotiation leverage (except for high-volume enterprise agreements), and no surprise charges. This transparency appeals to the developer market, which distrusts opaque pricing. Price reductions are applied retroactively to existing customers; price increases are communicated 90 days in advance.

**Psychological pricing** applies to the free credit allocation: $5 establishes the perceived value of Token Factory's service before the customer has spent anything, creating a reference point that makes subsequent paid usage feel like a continuation of established value rather than a new expenditure.

## Purchase Inducement Programs: Accelerating Acquisition and Conversion

Purchase inducement programs complement the billing architecture by reducing specific friction points in the customer journey.

**$5 free credit at signup** (no credit card required) attacks the single largest friction point in the developer funnel. Expected impact: 3x increase in signup rates relative to a credit-card-required alternative. Cost per signup ($5 maximum) is well below the $15-30 cost-per-acquisition of paid advertising channels.

**$100 migration bonus** ($100 credit for verified competitor spend) targets developers and teams already paying for AI inference from a competing platform. Verification via competitor invoice prevents abuse while providing competitive intelligence. Expected yield: 5,000 migrations in year one.

**Volume discounts** (5-30% depending on commitment level) serve dual strategic purposes: generating predictable, committed revenue and creating contractual switching costs that reduce churn. Applicable to both bulk prepaid credit purchases and committed postpaid spend agreements.

**$25 referral credit** (for both referrer and referred) leverages developer word-of-mouth with a financial incentive. The symmetrical reward structure creates a social dynamic where the referrer is offering a gift rather than earning a commission. Expected impact: 20% of signups originating from referrals.

**$10K Startup Program** ($10,000 in credits over 12 months for companies with less than $5 million in raised capital) targets venture-backed startups building AI-powered products. Expected yield: 500 startups in year one, of which 50-100 will scale to $1,000+ monthly spend within 18 months.

**50% Academic Discount** on all token rates serves a long-term strategic purpose: today's university researchers and computer science students are tomorrow's technical decision-makers.

**IHC Group program** (20-30% discount on published rates) balances maximizing adoption across IHC Group subsidiaries with generating meaningful revenue. Formula-based pricing eliminates political complexity of custom negotiations.

## Margin Architecture and Revenue Sustainability

The margin architecture must be understood at two levels: the per-million-token margin on inference, and the platform feature margin.

**Inference margins** (per-million-token revenue) carry gross margins of 40-60%, reflecting the GPU compute costs that scale directly with volume. As per-token market pricing continues to decline (driven by GPU cost reductions, inference optimization improvements, and competitive pressure), these margins will compress if Token Factory matches market rates.

**Platform feature margins** (cost intelligence, compliance tooling, key management, fine-tuning pipeline, team workspaces) carry gross margins of 85-95%, because these are software features that scale with negligible incremental cost. These features are available to all customers regardless of billing method and create the switching costs that drive retention.

**Revenue mix target**: Year 1 revenue is predominantly usage-based (per-million-token charges). By year two, the target revenue mix is approximately 30% from platform feature upsells and 70% from token consumption. By year three, the target shifts to 40% platform / 60% token as platform value increasingly drives customer retention and expansion.

The blended gross margin target is 40-60%. Margin improvement comes primarily from:

1. **Volume efficiency**: Higher GPU utilization through batching, caching, and intelligent routing
2. **Platform feature adoption**: High-margin features become a larger share of revenue
3. **Customer mix shift**: Enterprise postpaid customers with committed spend generate healthier margins than small prepaid accounts

## Dynamic Pricing Considerations and Future Evolution

Token Factory's pricing architecture must be designed for evolution. Several trends will require adaptation:

1. **Per-token price decline**: Token rates will continue falling, potentially reaching near-zero for small models within 2-3 years. The platform feature layer provides insulation, and future pricing may shift from per-token to per-outcome (charging for successful task completion rather than raw token consumption).

2. **Agent architectures**: AI agents make multiple model calls per user interaction, changing the relationship between user value and token consumption. Future pricing models may charge per agent interaction or per workflow completion.

3. **Intelligent routing maturity**: As Token Factory's routing engine matures, outcome-based pricing becomes possible — customers specify quality requirements and budget constraints, and the platform delivers optimal results within those parameters.

Token Factory should begin collecting the performance data (quality scores, latency distributions, cost-per-outcome metrics) that will enable outcome-based pricing when the market matures, while maintaining the simple, transparent prepaid/postpaid model that the market currently expects.

---

## Competitive Pricing Intelligence

*Live market data captured March 2026. All prices per million tokens (input / output) unless stated.*

### Billing Structure Comparison

| Dimension | Token Factory | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|---|---|---|---|
| **Free Entry** | $5 credit, no card | Read-only until deposit | $6 credit, card required | Free tier, no card | Free models, no card |
| **Spending Tiers / Caps** | Customer-set ceilings per key / team | None | Tier 1 = $50/mo cap (manual upgrade) | Rate limits by tier | Per-key limits |
| **Postpaid / Invoice** | Yes — Net-30 | Yes | Yes — monthly | Yes — Dev/Enterprise | **No** |
| **Volume Discounts** | 5–30% | Yes | Yes | Yes (Enterprise) | None |
| **Migration Incentive** | $100 migration bonus | None | None | None | None |
| **Startup Program** | $10K / 12 months | Yes | Yes | Yes | None |
| **Academic Discount** | 50% | None | None | None | None |

### Per-Token Rate Comparison — Key Models

#### Large Models (70B+)

| Model | Token Factory | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|---|---|---|---|
| **LLaMA 3.1 70B** | $0.50–0.90 / $0.50–1.20 | ~$0.90 / ~$0.90 | ~$0.70 / ~$0.70 | N/A | ~$0.50 / ~$0.75 |
| **LLaMA 3.3 70B** | ~$0.59 / ~$0.79 | ~$0.59 / ~$0.59 | ~$0.70 / ~$0.90 | $0.59 / $0.79 | ~$0.59 / ~$0.79 |
| **DeepSeek V3** | ~$0.28 / ~$1.10 | ~$0.28 / ~$1.10 | ~$0.22 / ~$0.88 | N/A | ~$0.28 / ~$1.10 |
| **DeepSeek R1** | ~$0.55 / ~$2.19 | ~$3.00 / ~$7.00 | ~$3.00 / ~$7.00 | N/A | ~$0.50 / ~$2.19 |
| **Mistral Large 2** | ~$1.00 / ~$3.00 | ~$1.20 / ~$1.20 | ~$0.90 / ~$0.90 | N/A | ~$1.00 / ~$3.00 |
| **Kimi K2.5** | ~$0.50 / ~$2.80 | ~$0.50 / ~$2.80 | $0.60 uncached / **$0.10 cached** / $2.50 out | N/A | ~$0.50 / ~$2.50 |
| **MiniMax M2.5** | ~$0.30 / ~$1.20 | ~$0.30 / ~$1.20 | ~$0.30 / ~$1.20 | N/A | ~$0.30 / ~$1.20 |
| **Qwen 2.5 72B** | ~$0.60 / ~$0.80 | ~$0.60 / ~$3.60 | ~$0.60 / ~$0.60 | $0.29 / $0.39 (32B only) | ~$0.40 / ~$0.40 |

#### Small Models (7–13B) — Loss Leaders

| Model | Token Factory | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|---|---|---|---|
| **LLaMA 3.1 8B** | **$0.10–0.20 / $0.10–0.20** | ~$0.06 / ~$0.06 | ~$0.05 / ~$0.05 | ~$0.05 / ~$0.08 | ~$0.06 / ~$0.06 |
| **Mistral 7B** | **$0.10–0.20 / $0.10–0.20** | ~$0.10 / ~$0.10 | ~$0.10 / ~$0.10 | N/A | ~$0.04 / ~$0.04 |
| **Gemma 3N** | ~$0.02 / ~$0.02 | ~$0.02 / ~$0.02 | ~$0.02 / ~$0.02 | N/A | ~$0.02 / ~$0.02 |

> **Pricing gap alert — Small models:** Token Factory's small model pricing ($0.10–0.20/M) is 2–4x above the market floor (~$0.05–0.06/M). Small models are loss leaders whose function is developer acquisition, not margin generation. Recommendation: price LLaMA 3.1 8B at $0.05/M to match market floor. The margin lost on small models is recovered the moment a developer graduates to any 70B+ model or platform feature.

#### Embeddings

| Model Category | Token Factory | Together AI | Fireworks AI | Groq | OpenRouter |
|---|---|---|---|---|---|
| **General embeddings** | $0.01–0.05 / — | ~$0.008 / — | ~$0.013–0.016 / — | **Not available** | ~$0.013 / — |

> **Groq embeddings gap:** Groq has no embeddings capability at all. Any enterprise workload requiring semantic search, RAG pipelines, or similarity matching cannot use Groq. Token Factory's embeddings support is a direct differentiator against Groq for end-to-end workloads.

### Fireworks Cached Input Pricing — The Competitor Innovation to Counter

Fireworks is the only competitor offering tiered input pricing based on prompt caching, representing their best single-feature cost intelligence proxy.

| Model | Uncached | Cached | Savings |
|---|---|---|---|
| Kimi K2.5 | $0.60/M | $0.10/M | **83%** |
| DeepSeek V3.2 | $0.27/M | $0.07/M | **74%** |
| NVIDIA Nemotron 120B | $1.00/M | $0.25/M | **75%** |
| MiniMax-M2.5 | $0.30/M | $0.07/M | **77%** |

Fireworks' cached pricing requires developers to engineer their prompts to exploit it — identical prefix token sequences, manually structured. Token Factory's semantic caching response is architecturally superior: automatic detection of semantically similar requests (cosine similarity > 0.97), zero developer code changes required, savings attributed and displayed in the dashboard. Message to market: "Fireworks makes you work for the cache savings. Token Factory gives them to you automatically."

### Recommended Pricing Additions Based on Competitive Analysis

| Addition | Rationale | Competitive Context |
|---|---|---|
| **Batch Processing: 50% of real-time rate** | Both Fireworks and Groq offer ~50% batch discount. Without it, all high-volume async workloads go to competitors by default | Fireworks and Groq offer this; Together AI and OpenRouter do not |
| **Semantic Caching: free on cache hit** | Zero-code savings beat Fireworks' developer-managed prefix caching | Fireworks offers 74–83% savings on cached prefixes; yours should be automatic and free |
| **Sovereign Tier: +20–30% on token rates + $2,000/month platform fee** | Named compliance tier creates a priceable product that maps to enterprise procurement checklists | No competitor has a named compliance tier. Groq gates compliance behind "Enterprise" with custom pricing |
| **Small model floor: $0.05/M** | Close the 2–4x gap vs. market floor to avoid losing developer funnel acquisitions on price | Together AI and Fireworks both at $0.05–0.06/M for 8B models |
| **Agentic session pricing (future, 2027+)** | As agents multiply per-user token consumption 10–100x, per-token pricing misaligns with value delivered | No competitor has this yet; collect session boundary data now to enable the transition |

### Gross Margin by Revenue Stream

| Revenue Stream | Gross Margin | Driver |
|---|---|---|
| Inference — small models (8B) | ~0–15% | Near-cost loss leaders for funnel acquisition |
| Inference — large models (70B+) | ~40–55% | Volume + GPU utilization efficiency |
| Inference — enterprise postpaid committed | ~50–65% | Committed spend provides GPU pre-allocation efficiency |
| Batch processing | ~35–50% | Lower priority queue, higher GPU utilization |
| Semantic caching (cache hits) | ~95%+ | Served from cache, near-zero compute cost |
| Platform features (FinOps, RBAC, compliance) | ~85–95% | Software, scales with negligible marginal cost |
| Fine-tuning compute | ~30–45% | GPU-intensive; one-time revenue per training run |
| Sovereign tier platform fee ($2K/mo) | ~90%+ | Fixed SLA + compliance overhead, software-only |

**Revenue mix target by year:**

| Year | Inference % | Platform Features % | Blended Gross Margin |
|---|---|---|---|
| Year 1 | ~85% | ~15% | ~40–50% |
| Year 2 | ~70% | ~30% | ~50–60% |
| Year 3 | ~60% | ~40% | ~60–70% |

The structural improvement in blended margin as platform feature revenue grows is the core financial thesis: inference is a commodity with compressing margins; platform features are software with 85–95% margins. The more deeply customers adopt cost intelligence, compliance tooling, fine-tuning, and team governance, the more the revenue mix shifts toward the high-margin software layer — making Token Factory more profitable per dollar of revenue even as per-token prices decline industrywide.
