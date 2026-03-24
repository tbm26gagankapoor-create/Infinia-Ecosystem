#!/usr/bin/env python3
"""Insert Section 0 into the blueprint docx before existing content."""
from docx import Document
from docx.shared import Pt
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from copy import deepcopy

DOCX = "/Users/gagan.kapoor/Downloads/Token Factory/llm_api_platform_blueprint.docx"
doc = Document(DOCX)
body = doc.element.body

nsmap = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
W = nsmap['w']

def make_run(text, bold=False, italic=False, size_pt=11):
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    if bold:
        b = OxmlElement('w:b')
        rPr.append(b)
    if italic:
        i = OxmlElement('w:i')
        rPr.append(i)
    sz = OxmlElement('w:sz')
    sz.set(qn('w:val'), str(size_pt * 2))
    rPr.append(sz)
    r.append(rPr)
    t = OxmlElement('w:t')
    t.text = text
    t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    r.append(t)
    return r

def make_para(text, style_id=None, bold=False, italic=False, size_pt=11):
    p = OxmlElement('w:p')
    if style_id:
        pPr = OxmlElement('w:pPr')
        pStyle = OxmlElement('w:pStyle')
        pStyle.set(qn('w:val'), style_id)
        pPr.append(pStyle)
        p.append(pPr)
    if text:
        p.append(make_run(text, bold=bold, italic=italic, size_pt=size_pt))
    return p

def make_heading(text, level=1):
    return make_para(text, style_id=f'Heading{level}', bold=True, size_pt=14 if level==1 else 13 if level==2 else 12)

def make_table(headers, rows):
    """Build a table element."""
    ncols = len(headers)
    tbl = OxmlElement('w:tbl')
    # Table properties
    tblPr = OxmlElement('w:tblPr')
    tblStyle = OxmlElement('w:tblStyle')
    tblStyle.set(qn('w:val'), 'TableGrid')
    tblPr.append(tblStyle)
    tblW = OxmlElement('w:tblW')
    tblW.set(qn('w:w'), '0')
    tblW.set(qn('w:type'), 'auto')
    tblPr.append(tblW)
    tblBorders = OxmlElement('w:tblBorders')
    for border_name in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        b = OxmlElement(f'w:{border_name}')
        b.set(qn('w:val'), 'single')
        b.set(qn('w:sz'), '4')
        b.set(qn('w:space'), '0')
        b.set(qn('w:color'), '000000')
        tblBorders.append(b)
    tblPr.append(tblBorders)
    tbl.append(tblPr)
    # Grid
    tblGrid = OxmlElement('w:tblGrid')
    for _ in range(ncols):
        gc = OxmlElement('w:gridCol')
        gc.set(qn('w:w'), str(9000 // ncols))
        tblGrid.append(gc)
    tbl.append(tblGrid)
    # Header row
    tr = OxmlElement('w:tr')
    for h in headers:
        tc = OxmlElement('w:tc')
        tc.append(make_para(h, bold=True, size_pt=10))
        tr.append(tc)
    tbl.append(tr)
    # Data rows
    for row in rows:
        tr = OxmlElement('w:tr')
        for val in row:
            tc = OxmlElement('w:tc')
            tc.append(make_para(str(val), size_pt=10))
            tr.append(tc)
        tbl.append(tr)
    return tbl

def page_break():
    p = OxmlElement('w:p')
    r = OxmlElement('w:r')
    br = OxmlElement('w:br')
    br.set(qn('w:type'), 'page')
    r.append(br)
    p.append(r)
    return p

# ── Build all Section 0 elements ──

elems = []

elems.append(make_heading("Section 0: Business Strategy & Market Intelligence", 1))
elems.append(make_para(
    "This section provides comprehensive business strategy, market intelligence, and go-to-market analysis for Token Factory — "
    "an open-source model inference platform with fine-tuning capabilities built by Infinia Technologies (IHC Group). "
    "Detailed deep-dive research files (65,000+ words) are in the /market_research/ directory.",
    italic=True))

# 0.1
elems.append(make_heading("0.1 Executive Summary", 2))
elems.append(make_para(
    "Token Factory enters the open-source LLM inference market — projected to reach $4.0-4.8 billion by 2026 — "
    "with a platform-first approach addressing the critical enterprise governance gap. While Together AI ($533M funding, "
    "~$300M ARR), Fireworks AI ($327M funding, 20x YoY growth), and OpenRouter (5M users) lead in raw inference, "
    "none offers comprehensive cost intelligence, fine-tuning lifecycle management, and compliance architecture."))
elems.append(make_para(
    "Token Factory's structural advantages come from IHC Group — a $238B Abu Dhabi conglomerate with 422 subsidiaries "
    "across healthcare (Burjeel/PureHealth), real estate (ALDAR), financial services (2PointZero), and technology. "
    "This provides: (1) built-in enterprise customers via internal procurement, (2) $20.4B cash reserves without VC dilution, "
    "(3) sovereign AI credibility through Infinia's Tenstorrent partnership, (4) compliance fast-tracking within IHC entities. "
    "Revenue projections: Year 1 $18.9M, Year 2 $120.8M, Year 3 $377M."))

# 0.2
elems.append(make_heading("0.2 Market Opportunity & Customer Value", 2))
elems.append(make_para("Reference: market_research/01_market_opportunity_and_customer_value.md", italic=True))
elems.append(make_para(
    "The open-source LLM inference market has exploded with model releases (LLaMA 3.1, Mistral Large 2, DeepSeek V3, "
    "Qwen 2.5) but infrastructure remains fragmented. Managing multiple inference providers creates 2-4 developer-weeks "
    "per quarter of operational overhead. The core value proposition: one platform, one API key, one bill, one compliance "
    "contract, every open-source model."))
elems.append(make_para(
    "Quantified value for teams spending $10K+/month: engineering time savings ($50K-$150K/year), cost optimization "
    "(20-40% through intelligent routing), compliance consolidation ($32K-$128K per vendor eliminated). For IHC Group's "
    "422 subsidiaries, group-wide net value could exceed $10M/year. Global enterprise LLM API spend: $8.4B H1 2025, "
    "projected $15B+ by end 2026. Middle East AI market: $3.2B (2025) to $8.5B (2028)."))

# 0.3
elems.append(make_heading("0.3 Competitive Landscape", 2))
elems.append(make_para("Reference: market_research/02_competitive_landscape_and_ecosystem.md", italic=True))
elems.append(make_table(
    ["Competitor", "Funding", "Est. ARR", "Key Strength", "Weakness vs TF", "Threat"],
    [
        ["Together AI", "$533M", "~$300M", "Full-stack training+inference", "Thin governance", "HIGH"],
        ["Fireworks AI", "$327M", "~$130M", "Fastest inference (FireAttention)", "Minimal cost intel", "VERY HIGH"],
        ["Groq", "Nvidia-backed", "N/A", "18x faster (custom LPU)", "Limited models/platform", "MEDIUM"],
        ["OpenRouter", "a16z/Menlo", "~$5M", "300+ models, 5M users", "No fine-tuning/compliance", "MEDIUM"],
        ["Replicate", "$100M+", "~$50M", "Image/video focus", "Different segment", "LOW"],
    ]))
elems.append(make_para(
    "Indirect competitors: OpenAI ($20B ARR), Anthropic ($14B ARR), cloud platforms (Bedrock, Vertex, Azure OpenAI). "
    "Adjacent: API gateways (Portkey, LiteLLM), observability (Helicone, Langfuse), frameworks (LangChain, LlamaIndex). "
    "Token Factory positioning: platform-first. Inference is table stakes; the platform layer is the moat. "
    "Brand essence: 'The Stripe of Open-Source AI Inference.'"))

# 0.4
elems.append(make_heading("0.4 Industry Structure & Profitability", 2))
elems.append(make_para("Reference: market_research/03_industry_structure_and_profitability.md", italic=True))
elems.append(make_table(
    ["Force", "Intensity", "Key Driver", "TF Response"],
    [
        ["Buyer Power", "MOD-HIGH", "Near-zero switching (OpenAI-compatible API)", "Switching costs via fine-tuning, compliance"],
        ["Supplier Power", "HIGH", "Nvidia GPU monopoly (60-70% COGS)", "Tenstorrent, multi-cloud, AMD"],
        ["Substitution", "MODERATE", "Self-hosting, proprietary APIs, edge", "Platform value beyond inference"],
        ["New Entrants", "HIGH", "Low barriers (vLLM + cloud)", "IHC capital, brand, SOC 2"],
        ["Rivalry", "VERY HIGH", "80% price decline, commodity market", "Inference=acquisition, platform=monetization"],
    ]))
elems.append(make_para(
    "HHI ~1,200-1,500 (moderately concentrated). Market in Late Growth / Early Shakeout. Time-sensitive window to build "
    "position before consolidation to 3-5 platforms (2027-2028). Pure inference margins: 5-15%. Token Factory must "
    "monetize platform features, not just tokens."))

# 0.5
elems.append(make_heading("0.5 Strategic Strengths & Vulnerabilities", 2))
elems.append(make_para("Reference: market_research/05_strategic_strengths_and_vulnerabilities.md", italic=True))
elems.append(make_table(
    ["Type", "Factor", "Assessment"],
    [
        ["Strength", "13-section platform vision", "Deepest cost intelligence, fine-tuning, compliance in market"],
        ["Strength", "IHC Group ($238B, 422 subs)", "Capital + customers + credibility vs all competitors"],
        ["Strength", "OpenAI-compatible API", "One-line migration from any competitor"],
        ["Strength", "Compliance-first architecture", "ZDR, PII redaction, audit trails designed in"],
        ["Strength", "Fine-tuning with A/B testing", "Strongest switching cost mechanism"],
        ["Strength", "Tenstorrent partnership", "Only platform with chip-level hardware partner"],
        ["Weakness", "Late entry (2-3yr behind)", "Must take customers from established providers"],
        ["Weakness", "Zero developer brand", "Mitigated by IHC brand in ME enterprise"],
        ["Weakness", "Thin margins (5-15%)", "Must monetize platform, not just tokens"],
        ["Opportunity", "Enterprise governance gap", "AI governance market $2.5B by 2027"],
        ["Opportunity", "EU AI Act (Aug 2026)", "Compliance-first = switching catalyst"],
        ["Opportunity", "ME sovereign AI ($10B+)", "Uniquely positioned via Infinia/IHC"],
        ["Threat", "Incumbents adding features", "Different DNA (infra vs platform) buffers"],
        ["Threat", "Continued price war", "Platform revenue must decouple from tokens"],
    ]))

# 0.6
elems.append(make_heading("0.6 Customer Segments & Targeting", 2))
elems.append(make_para("References: market_research/06 and 07", italic=True))
elems.append(make_table(
    ["Segment", "Size", "Monthly Spend", "Priority", "Rationale"],
    [
        ["IHC Group Internal", "50-100 subs", "$5K-500K", "P0 Immediate", "Zero CAC, 2-4wk procurement"],
        ["Startup Builders", "~500K teams", "$50-2K", "P1 Primary", "Fastest adoption, vocal advocates"],
        ["AI-Native", "~5K orgs", "$10K-1M+", "P1 Primary", "Highest sophistication"],
        ["Mid-Market", "~80K orgs", "$2K-25K", "P2 Secondary", "Need cost allocation, RBAC"],
        ["Enterprise", "~15K orgs", "$25K-500K", "P3 Tertiary", "Highest LTV, longest cycle"],
        ["Regulated", "~10K orgs", "$50K-2M+", "P3 Tertiary", "Compliance-first required"],
        ["Indie Hackers", "~8M devs", "$0-50", "Funnel Top", "Brand building, community"],
    ]))

elems.append(make_heading("Revenue Projections", 3))
elems.append(make_table(
    ["Metric", "Year 1", "Year 2", "Year 3"],
    [
        ["IHC subsidiary accounts", "20", "60", "150"],
        ["External registered developers", "50,000", "200,000", "500,000"],
        ["External paying accounts", "5,000", "15,000", "40,000"],
        ["IHC Group revenue", "$2.4M", "$10.8M", "$27M"],
        ["External revenue", "$16.5M", "$110M", "$350M"],
        ["Total ARR", "$18.9M", "$120.8M", "$377M"],
    ]))

# 0.7
elems.append(make_heading("0.7 Brand Positioning & Differentiation", 2))
elems.append(make_para("Reference: market_research/08_brand_positioning_and_differentiation.md", italic=True))
elems.append(make_para(
    "Positioning: FOR developers and AI-first enterprises needing production-grade open-source LLM access with cost "
    "predictability, governance, and compliance — TOKEN FACTORY IS the inference platform by Infinia Technologies (IHC Group) "
    "providing LLaMA, Mistral, DeepSeek, and 200+ models with enterprise cost intelligence, managed fine-tuning, and "
    "built-in compliance. UNLIKE Together AI (thin governance), OpenRouter (no fine-tuning/compliance), or Groq (limited "
    "models) — TOKEN FACTORY combines competitive speed with a full platform, FinOps controls, lifecycle fine-tuning, "
    "and audit-ready compliance backed by a $238B conglomerate."))
elems.append(make_table(
    ["Point of Difference", "Description", "Gap"],
    [
        ["1. Cost Intelligence", "Per-key allocation, projections, anomaly detection", "No competitor offers this"],
        ["2. Key Management", "Model restrictions, spend caps, IP allowlisting, rotation", "Unmatched granularity"],
        ["3. Fine-Tuning Lifecycle", "Versioning, A/B testing, one-click rollback", "Competitors: basic train-only"],
        ["4. Developer Experience", "Blind comparison, code export, forking, replay", "Unique features"],
        ["5. Compliance", "ZDR, PII redaction, 7yr audit trails, data residency", "Most lack depth"],
        ["6. IHC Ecosystem", "SAIF, Gulf regulatory, Arabic-English, inter-co billing", "Exclusive"],
    ]))

# 0.8
elems.append(make_heading("0.8 Pricing Architecture", 2))
elems.append(make_para("Reference: market_research/10_pricing_architecture_and_monetization.md", italic=True))
elems.append(make_table(
    ["Tier", "Fee", "Token Pricing", "Key Features", "Target"],
    [
        ["Free", "$0", "Standard", "$5 credits, playground, 1 key", "Indie devs"],
        ["Pay-as-you-go", "$0", "Standard", "Unlimited keys, 100 RPM", "Light usage"],
        ["Pro", "$99/mo", "5-10% off", "RBAC, cost allocation, fine-tuning", "Startups"],
        ["Team", "$299/mo", "8-12% off", "+SSO, workspaces, analytics", "Mid-market"],
        ["Enterprise", "$2K-25K/mo", "15-30% off", "+VPC, SLA, CSM, ZDR", "Enterprise"],
        ["IHC Group", "Inter-co", "Group rates", "+Group admin, SAIF", "IHC subs"],
    ]))
elems.append(make_para(
    "Two-part model: platform subscription captures governance value; per-token pricing aligns with consumption. "
    "Insulates revenue from inference price war."))

# 0.9
elems.append(make_heading("0.9 Distribution & Go-to-Market", 2))
elems.append(make_para("Reference: market_research/11_distribution_channels_and_go_to_market.md", italic=True))
elems.append(make_para(
    "Phase 1 (Mo 1-6): Maximize Reach — D2C self-serve, cloud marketplaces (AWS/GCP/Azure), integration partners "
    "(LangChain, Vercel), IHC internal channel. Phase 2 (Mo 6-12): Build Switching Costs — fine-tuning adoption, "
    "team expansion, cost analytics as exec reporting, compliance integration. Phase 3 (Mo 12-24): Enterprise Expansion "
    "— SOC 2 complete, sales team, 1-3yr contracts, VPC peering."))

# 0.10
elems.append(make_heading("0.10 Quick Wins & Strategic Advantages", 2))
elems.append(make_para("Reference: market_research/13_quick_wins_and_strategic_advantages.md", italic=True))
elems.append(make_para(
    "Right to Win: (1) IHC Group's 422-subsidiary customer base, (2) Sovereign AI positioning in Gulf, "
    "(3) Capital without VC pressure ($20.4B), (4) Platform-first DNA, (5) Tenstorrent hardware partnership.", bold=True))
elems.append(make_table(
    ["Week", "Action", "Revenue", "Brand"],
    [
        ["1-2", "Price comparison + IHC outreach", "—", "Medium"],
        ["2-4", "Migration guides + IHC pilot", "$10-50K MRR", "Low"],
        ["2-6", "Playground public launch", "—", "HIGH"],
        ["1-8", "Content blitz (16-24 posts)", "—", "Compounds"],
        ["4-8", "Startup program ($10K credits)", "—", "Medium"],
        ["6-10", "Hacker News launch", "$5-20K MRR", "HIGH"],
        ["4-12", "IHC rollout (3-5 subs)", "$100-500K MRR", "HIGH"],
        ["Aligned", "GITEX presence", "Leads", "Medium"],
    ]))

# 0.11
elems.append(make_heading("0.11 Supporting Research Files", 2))
elems.append(make_para("Deep-dive analysis (65,000+ words) in /market_research/:"))
elems.append(make_table(
    ["File", "Topic", "Words"],
    [
        ["01_market_opportunity_and_customer_value.md", "Problem, value, demand, loyalty", "~5,000"],
        ["02_competitive_landscape_and_ecosystem.md", "Company, customers, competitors, partners", "~5,200"],
        ["03_industry_structure_and_profitability.md", "5 competitive forces analysis", "~4,800"],
        ["04_macro_environment_and_regulatory_landscape.md", "6 external forces analysis", "~5,300"],
        ["05_strategic_strengths_and_vulnerabilities.md", "Internal/external assessment", "~6,300"],
        ["06_customer_segments_and_buyer_profiles.md", "7 clusters, psychographics, behavior", "~5,500"],
        ["07_target_markets_and_prioritization.md", "TAM/SAM/SOM, priorities, projections", "~4,000"],
        ["08_brand_positioning_and_differentiation.md", "PoP/PoD, credibility, positioning", "~5,600"],
        ["09_product_strategy_and_roadmap.md", "Product levels, lifecycle, portfolio", "~6,200"],
        ["10_pricing_architecture_and_monetization.md", "6-tier pricing, 7 strategies", "~4,500"],
        ["11_distribution_channels_and_go_to_market.md", "3-phase GTM, channels", "~3,900"],
        ["12_communications_and_developer_marketing.md", "Advertising, media, DevRel", "~4,000"],
        ["13_quick_wins_and_strategic_advantages.md", "Right to Win, Easy Wins, 90-day plan", "~4,900"],
    ]))

# Page break
elems.append(page_break())

# ── Insert all elements at the beginning of the body ──
# Find the first element in body
first_el = body[0] if len(body) > 0 else None

for i, el in enumerate(elems):
    if first_el is not None:
        first_el.addprevious(el)
    else:
        body.append(el)

doc.save(DOCX)
print(f"Done! Section 0 inserted. Document: {len(doc.paragraphs)} paragraphs.")
