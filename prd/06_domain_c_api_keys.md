# Domain C: API Key Management

## C1. Basic API Key Management — M1 · Mar 28

Create, view (masked), copy, and revoke API keys. Keys prefixed with `tf-`.

### Features

- Create API keys
- View (masked)
- Copy to clipboard
- Revoke keys
- `tf-` prefix

### User Flow

1. User navigates to API Keys page from dashboard sidebar.
2. Clicks "Create Key". Dialog: enter key name, optional source/app label.
3. Key generated and displayed once in full: `tf-sk_live_xxxxxxxxxxxxxxxxxxxx`. Prominent "Copy" button.
4. After dialog close, key shows as masked: `tf-sk_l...xxxx`.
5. Key list shows: Name, Masked Value, Source/App, Created, Last Used, Status (active/revoked).
6. User clicks "Revoke" on a key. AlertDialog confirmation. Key immediately stops authenticating (<1s).

### Error Handling

- **User dismissed key without copying** → Warning: "This key will not be shown again. Are you sure?"

### Success Metrics

| Metric | Target |
|--------|--------|
| Users creating a key within first session | >95% |
| Keys named with descriptive labels | >80% |
| Revoked keys immediately stop authenticating | 100% |

---

## C2. Advanced API Key Scoping — M2 · Apr 5

Per-key model allowlists, RPM rate limits, monthly cost ceilings, labels/tags.

### Features

- Model allowlists
- RPM rate limits
- Monthly cost ceilings
- Labels/tags

### User Flow

1. User creates or edits a key. "Advanced Settings" section expands.
2. **Model allowlist:** Multi-select from model catalog. Only selected models allowed. Others return 403.
3. **RPM limit:** Number input. Requests exceeding limit get 429 with `Retry-After` header.
4. **Monthly cost ceiling:** Dollar amount. Key stops working when ceiling hit. Email at 80% and 100%.
5. **Labels/tags:** Key-value pairs for filtering and reporting (e.g., `env:production`, `team:ml-ops`).
6. Settings saved. Enforcement immediate for new requests.

### Success Metrics

| Metric | Target |
|--------|--------|
| Enterprise keys using at least one scope | 80%+ |
| Scoped keys with model allowlists set | >50% |
| Keys with cost ceilings among Pro+ users | >60% |

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
