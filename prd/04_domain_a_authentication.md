# Domain A: Authentication & User Management

## A1. User Authentication — M1 · Mar 28

Email/password signup, Google OAuth, email verification, forgot password. $5 free credit applied on verification.

### Features

- Email/password signup
- Google OAuth
- Email verification
- Forgot password
- $5 free credit on verification

### User Flow

1. User visits `/signup`. Sees form with email, password, confirm password fields and "Sign up with Google" OAuth button.
2. **Email path:** User enters email + password (min 8 chars, mixed case, 1 number). Clicks "Create Account".
3. System creates account in `pending_verification` state. Sends verification email within 30 seconds.
4. User clicks verification link (expires 24h). Account moves to `active`. $5 credit applied. Redirected to dashboard with onboarding card.
5. **Google OAuth path:** User clicks "Sign up with Google". Redirected to Google consent. On return, account created (or linked if email matches) and immediately active. $5 credit applied.
6. **Forgot password:** User clicks "Forgot password" on `/login`. Enters email. Reset email sent within 30s. Link expires 1h. User sets new password. Existing sessions preserved.

### Error Handling

- **Duplicate email** → "An account with this email already exists. Sign in or use a different email."
- **Weak password** → Inline validation showing requirements not met.
- **Expired verification link** → "This link has expired. Click here to resend verification email."

### Success Metrics

| Metric | Target |
|--------|--------|
| Signup completion rate | >90% |
| Email verification rate | >80% |
| Users making first API call within 24h | >60% |
| Signup to first API call | <2 min |

---

## A2. Team/Org Management — M2 · Apr 5

Create organizations, invite members by email, Admin/Member roles, org-level default settings.

### Features

- Create organizations
- Invite members by email
- Admin/Member roles
- Org-level default settings

### User Flow

1. Authenticated user navigates to Settings → Organization. Clicks "Create Organization".
2. Dialog opens: org name, URL-safe slug (auto-generated, editable). Clicks "Create". User becomes Owner.
3. Owner navigates to Team tab. Clicks "Invite Member". Enters email + selects role (Admin or Member).
4. Invitee receives email with join link (expires 7 days). Clicks link, signs up or signs in, joins org.
5. Owner/Admin navigates to Org Settings. Sets default model allowlist, rate limits, and cost ceilings for new keys.
6. Members see org context in dashboard. Can switch between personal and org contexts via user menu.

### Error Handling

- **Duplicate org slug** → "This URL is already taken. Please choose another."
- **Invite expired** → "This invitation has expired. Ask your admin to send a new invite."

### Success Metrics

| Metric | Target |
|--------|--------|
| IHC subsidiaries onboarded | 3+ |
| Invite acceptance rate | >70% |
| Orgs with 3+ members (30d) | >50% |
| Orgs using custom default settings | >40% |
