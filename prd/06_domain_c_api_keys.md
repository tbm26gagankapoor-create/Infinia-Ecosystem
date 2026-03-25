# Domain C: Projects & API Keys

## C0. Project Management — M2 · Apr 5

Create and manage projects that group API keys and enforce shared controls. Each project has its own model allowlist, rate limit, and optional cost ceilings that apply to all keys within it.

### Project Entity

| Field | Format / Example |
|-------|-----------------|
| `project_id` | `tf-proj_a1b2c3d4` (auto-generated) |
| `name` | Human-readable label (e.g., "Production App", "ML Experiments") |
| `description` | Optional free-text |
| `status` | `active` / `archived` |
| `created_at` | ISO 8601 timestamp |
| `created_by` | User ID of creator |
| `key_count` | Live count of active keys in this project |

### Project-Level Controls

All keys within a project inherit these controls. There are no per-key overrides.

- **Model allowlist:** Multi-select from model catalog. Only selected models are allowed for any key in this project. Requests using unlisted models return 403.
- **RPM rate limit:** Aggregate requests-per-minute cap across all keys in the project. Excess requests return 429 with `Retry-After` header.
- **Daily cost ceiling** *(optional)*: Dollar cap per day (UTC reset). All keys in the project stop authenticating when ceiling is hit. Email alerts at 80% and 100%. Resets at 00:00 UTC.
- **Monthly cost ceiling** *(optional)*: Dollar cap per calendar month (resets 1st of each month). All keys in the project stop authenticating when ceiling is hit. Email alerts at 80% and 100%. If not configured, no monthly cap is enforced.

### User Flow

1. User navigates to **Projects** from dashboard sidebar.
2. Clicks "New Project". Dialog: enter project name, optional description.
3. Project created instantly. Auto-generated ID shown: `tf-proj_a1b2c3d4`. Prominent "Copy ID" button.
4. User configures project-level controls in the **Settings** tab of the project:
   - Model allowlist (multi-select)
   - RPM rate limit (number input)
   - Daily cost ceiling (optional dollar amount)
   - Monthly cost ceiling (optional dollar amount)
5. Settings saved. Enforcement begins immediately for all keys in the project.
6. Project card on listing page shows: Name, Project ID, Key Count, Monthly Spend, Status.
7. **Archive project:** All keys under the project immediately stop authenticating. Project and its keys are preserved for audit/reporting. Archived projects cannot have new keys added.

### Error Handling

- **Duplicate project name within org** → Warning: "A project with this name already exists. Names don't need to be unique, but consider using a distinct name for clarity."
- **Archive project with active keys** → Confirmation dialog: "Archiving this project will immediately revoke authentication for all {n} active keys. This cannot be undone."

### Success Metrics

| Metric | Target |
|--------|--------|
| Users creating a project within first session | >70% |
| Projects with model allowlist configured | >60% |
| Projects with RPM limit configured | >50% |

---

## C1. Basic API Key Management — M1 · Mar 28

Create, view (masked), copy, and revoke API keys. Keys prefixed with `tf-` and always belong to a project.

### Features

- Create API keys within a project
- View (masked)
- Copy to clipboard
- Revoke keys
- `tf-` prefix
- `project_id` and project name on each key

### User Flow

1. User navigates to **API Keys** page from dashboard sidebar (shows all keys across projects) or enters a specific project and goes to its **Keys** tab.
2. Clicks "Create Key". Dialog:
   - Key name (required)
   - Project selector — dropdown of active projects. Defaults to the current project context if navigated from a project. Required; no key can exist outside a project.
   - Optional source/app label.
3. Key generated and displayed once in full: `tf-sk_live_xxxxxxxxxxxxxxxxxxxx`. Prominent "Copy" button.
4. After dialog close, key shows as masked: `tf-sk_l...xxxx`.
5. Key list shows: Name, Masked Value, Project, Source/App, Created, Last Used, Status (active/revoked).
6. User clicks "Revoke" on a key. AlertDialog confirmation. Key immediately stops authenticating (<1s).

### Error Handling

- **User dismissed key without copying** → Warning: "This key will not be shown again. Are you sure?"
- **No projects exist** → "You must create a project before creating an API key." with inline "Create Project" CTA.

### Success Metrics

| Metric | Target |
|--------|--------|
| Users creating a key within first session | >95% |
| Keys named with descriptive labels | >80% |
| Revoked keys immediately stop authenticating | 100% |

---

## C2. API Key Labels & Tags — M2 · Apr 5

Per-key metadata for filtering and reporting. Rate limits, cost ceilings, and model allowlists are configured at the project level (see C0) and apply uniformly to all keys in a project.

### Features

- Labels/tags (key-value pairs)

### User Flow

1. User creates or edits a key. "Labels" section expands.
2. **Labels/tags:** Key-value pairs for filtering and reporting (e.g., `env:production`, `team:ml-ops`, `service:recommendation-engine`).
3. Labels saved. Available immediately for filtering in the API Keys list and Usage analytics.

> **Note:** Model allowlists, RPM rate limits, and cost ceilings are set at the **project level** in C0. All keys within a project share those controls with no per-key override.

### Success Metrics

| Metric | Target |
|--------|--------|
| Enterprise keys using at least one label | >80% |
| Labels used as filters in Usage analytics | >40% |

---

## C3. Key Rotation — M2 · Apr 5

Generate replacement key with 24-hour grace period where both old and new keys work.

### Features

- Generate replacement key
- 24-hour grace period
- Dual-key overlap

### User Flow

1. User clicks "Rotate" on an active key.
2. New key generated and displayed once. Old key enters 24-hour grace period.
3. Dashboard shows countdown timer on old key. Both keys labeled clearly ("Current" / "Rotating out").
4. Both keys authenticate successfully for 24 hours.
5. After 24h, old key auto-revoked. New key becomes sole active key.
6. User can cancel rotation during grace period (old key restored as primary).

### Success Metrics

| Metric | Target |
|--------|--------|
| Rotations completed without support tickets | >90% |
| API calls failing due to rotation gaps | 0 |
| Enterprise keys rotated at least quarterly | >70% |
