# Domain E: Cost & Usage Intelligence

## E1. Cost Intelligence Dashboard — M2 · Apr 5

Real-time spend tracking: total over time, by model, by API key. Date range picker. CSV export. Pivot table for multi-dimensional analysis.

### Features

- Real-time spend tracking
- By model breakdown
- By API key breakdown
- Date range picker
- CSV export
- Pivot table analysis

### User Flow

1. User navigates to Usage → Cost from sidebar.
2. Top bar: date range picker (Today, 7d, 30d, This Month, Custom) + CSV export button.
3. Total spend card at top with current period total and trend vs. previous period.
4. Spend over time chart (line/area chart) showing daily/weekly spend.
5. Spend by model bar chart: horizontal bars showing cost per model, sorted by spend.
6. Spend by API key table: key name, spend, % of total, request count.
7. Pivot table view: User can group by model × key × date × team to see any permutation of cost breakdown. Column visibility toggles. Drill-down by clicking group headers.
8. Clicks "Export CSV". Downloads current view as CSV file.

### Success Metrics

| Metric | Target |
|--------|--------|
| Pro/Enterprise users accessing weekly | >50% |
| Users exporting CSV at least once | >30% |
| Users using pivot table feature | >40% |

---

## E2. Budget Alerts — M2 · Apr 5

Monthly cost ceiling per organization. Email notifications at 80% and 100% thresholds.

### Features

- Monthly cost ceiling
- 80% threshold alert
- 100% threshold alert
- Email notifications

### User Flow

1. Owner/Admin navigates to Org Settings → Budget.
2. Sets monthly budget amount (e.g., $5,000).
3. Chooses behavior at 100%: "Alert only" or "Hard stop" (disable all keys).
4. At 80% ($4,000): automated email to all Admins + Owner. Yellow warning banner on dashboard.
5. At 100% ($5,000): automated email. Red banner. If hard-stop: all org keys return 429 until budget increased or next billing cycle.

### Success Metrics

| Metric | Target |
|--------|--------|
| Orgs setting a monthly budget | >60% |
| Users taking action within 24h of alert | >80% |
| Budget alert recipients increasing budget or upgrading | 30%+ |

---

## E3. Usage Analytics — M2 · Apr 5

Requests by model, token breakdown (input/output), latency p50/p95/p99, error rates. Filterable with pivot table for permutation/combination analysis.

### Features

- Requests by model
- Token breakdown (input/output)
- Latency p50/p95/p99
- Error rates
- Pivot table analysis

### User Flow

1. User navigates to Usage → Analytics from sidebar.
2. Request volume chart: Line chart showing requests over time, colored by model.
3. Token breakdown: Stacked bar chart (input vs. output tokens) by model.
4. Latency percentiles: Table showing p50, p95, p99 per model. Sparkline charts for trends.
5. Error rates: Error percentage per model. Breakdown by error code (429, 500, 503).
6. Pivot table: User can group and pivot by any combination of: Model, API Key, Status, Date, Team. See request counts, tokens, latency, error rate across all permutations.
7. All views filterable by model, API key, date range, status (success/error).

### Success Metrics

| Metric | Target |
|--------|--------|
| Active users checking analytics weekly | >40% |
| Users applying filters or using pivot table | >25% |
| Pro+ users viewing latency percentiles | >50% |
