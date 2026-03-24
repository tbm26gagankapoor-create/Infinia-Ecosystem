# Domain A: Authentication & User Management — Entra ID SSO Integration

## Context

The AI Gateway platform needs enterprise-grade authentication for IHC Group's 422 subsidiaries and external enterprise customers. The PRD specifies email/password + Google OAuth via Auth.js, with SSO listed as future. This design promotes Microsoft Entra ID (OIDC) to a primary sign-in method, built multi-tenant from day one, with automatic group-to-role mapping.

**Why now:** IHC Group uses Entra ID internally. Making it the primary SSO method ensures frictionless adoption across subsidiaries and positions the platform for enterprise customers who expect SSO on day one.

## Approach

Auth.js's built-in `MicrosoftEntraID` provider with a single multi-tenant Entra app registration. Each customer org stores its Entra tenant config in a `sso_connections` table. JIT user provisioning and Entra group-to-role mapping happen automatically on sign-in.

## Authentication Flow

1. User visits `/login` and enters email, clicks "Continue"
2. App calls `POST /auth/sso/discover` — extracts domain, looks up `sso_connections.allowed_domains`
3. If SSO configured: redirect to Entra's `/authorize` with the org's `tenantId`
4. User authenticates in Entra (MFA if their tenant requires it)
5. Entra returns `id_token` + `access_token` with profile and group claims
6. Auth.js callback: upsert user, map groups to roles, create session
7. User lands in org-scoped dashboard

**Alternative:** "Sign in with Microsoft" button bypasses discovery, redirects to Entra common endpoint.

### Multi-Tenant Resolution

- Domain-based: email domain -> `sso_connections.allowed_domains` GIN index lookup -> org's Entra config
- Auth.js dynamically configures `MicrosoftEntraID` provider per request

### Entra App Registration

- Single multi-tenant app registration (audience: `organizations`)
- Customers grant admin consent in their own tenant
- No per-customer app registration needed

## Database Schema

### New: `sso_connections`

```sql
CREATE TABLE sso_connections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
  provider        VARCHAR(50) NOT NULL DEFAULT 'entra',
  tenant_id       VARCHAR(255) NOT NULL,
  client_id       VARCHAR(255) NOT NULL,
  client_secret   TEXT NOT NULL,              -- AES-256 encrypted at rest
  allowed_domains TEXT[] NOT NULL,
  group_mapping   JSONB DEFAULT '{}',
  enforce_sso     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, provider)
);

CREATE INDEX idx_sso_domains ON sso_connections USING GIN (allowed_domains);
```

### Users table additions

```sql
ALTER TABLE users ADD COLUMN entra_oid VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN sso_provider VARCHAR(50);
```

## Group-to-Role Mapping

### Configuration (per org)

```json
{
  "a1b2c3d4-xxxx-...": "owner",
  "e5f6g7h8-xxxx-...": "admin",
  "*": "member"
}
```

### Logic

1. Read `groups` claim from `id_token`
2. Match against `group_mapping`
3. Highest-privilege match wins (owner > admin > member)
4. Wildcard `"*"` used as fallback
5. No match + no wildcard = deny sign-in
6. Role updated on every login (stays in sync with Entra)

### Group Overage

Entra limits group claims to ~200. If overage indicator `_claim_names` detected, fetch full list via `GET https://graph.microsoft.com/v1.0/me/memberOf`.

## JIT User Provisioning

- **Existing user (email match):** Link by setting `entra_oid`, `sso_provider = 'entra'`; add to org
- **New user:** Create with `email_verified = true`, `password_hash = NULL`, `sso_provider = 'entra'`
- Auto-add to `org_members` with mapped role
- Apply $5 free credit

## API Endpoints

### SSO Management (org owner/admin)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/orgs/:orgId/sso` | Configure SSO |
| GET | `/orgs/:orgId/sso` | Get config (secret redacted) |
| PATCH | `/orgs/:orgId/sso` | Update settings |
| DELETE | `/orgs/:orgId/sso` | Remove SSO |
| POST | `/orgs/:orgId/sso/test` | Test connection |

### Auth Flow

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/sso/discover` | Email -> redirect URL or "use password" |
| GET | `/auth/entra/callback` | OIDC callback |

## Login Page UX

1. Email-first: single email input + "Continue"
2. SSO detected -> redirect to Entra (no password field shown)
3. No SSO -> reveal password + Google OAuth
4. "Sign in with Microsoft" always visible as alternative
5. Post-auth -> org-scoped dashboard

## Security

| Concern | Mitigation |
|---------|-----------|
| Secret storage | AES-256 app-level encryption before DB write |
| Token validation | Auth.js validates iss, aud, exp, nbf, JWKS signature |
| Group tampering | Groups from signed id_token only |
| Account takeover | Email linking only during authenticated SSO callback |
| Enforce SSO | `enforce_sso` flag disables password for org members |
| Scopes | `openid profile email` + `GroupMember.Read.All` |

## Files to Create

| File | Purpose |
|------|---------|
| `src/auth/auth.config.ts` | Auth.js config with dynamic Entra provider |
| `src/auth/entra-provider.ts` | Entra provider factory (per-org config) |
| `src/auth/callbacks/entra.ts` | Sign-in callback: JIT, group mapping |
| `src/auth/sso-discovery.ts` | Domain -> SSO connection lookup |
| `src/db/migrations/001_sso_connections.sql` | Schema migration |
| `src/api/orgs/[orgId]/sso/route.ts` | SSO CRUD endpoints |
| `src/api/auth/sso/discover/route.ts` | Discovery endpoint |
| `src/app/login/page.tsx` | Login page |
| `src/app/orgs/[orgId]/settings/sso/page.tsx` | SSO admin UI |
| `src/lib/crypto.ts` | AES-256 encrypt/decrypt |

## Verification

- Unit tests: group mapping logic, SSO discovery, JIT provisioning
- Integration: Auth.js callback with mocked Entra tokens
- E2E: Full sign-in with test Entra tenant
- Security: secret redaction, token validation, cross-org isolation
