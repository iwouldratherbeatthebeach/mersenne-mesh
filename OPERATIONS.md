# Mersenne Mesh — account, coordinator, and logging setup

This release adds:

- **Log in / Sign up** with passwordless email magic links and optional Google OAuth.
- Stable contributor ownership keyed by the Auth.js `users.id` instead of email.
- A contributor dashboard with handle editing, totals, recent validated work, rank, achievements, and audit events.
- A D1-backed coordinator that leases non-overlapping validation ranges for 30 minutes.
- Structured Cloudflare runtime logs plus a persistent D1 `audit_events` ledger.

## 1. Apply the database upgrade

If `db/0001_initial.sql` has already been applied, run only:

```bash
npx wrangler d1 execute mersenne-mesh --remote --file=db/0002_accounts_and_coordinator.sql
```

For a brand-new database, run both files in order:

```bash
npx wrangler d1 execute mersenne-mesh --remote --file=db/0001_initial.sql
npx wrangler d1 execute mersenne-mesh --remote --file=db/0002_accounts_and_coordinator.sql
```

You can also paste each file into **Cloudflare → Storage & databases → D1 → mersenne-mesh → Console**.

The v2 migration preserves existing profiles/contributions by matching their email to the Auth.js user row and then converts ownership to `user_id`.

Verify:

```sql
SELECT count(*) AS work_units FROM work_units;
-- expected: 512

PRAGMA table_info(profiles);
-- first column should be user_id
```

`/api/health` reports `schemaReady: true` after this migration. The application intentionally refuses permanent contribution writes until the v2 schema is present, while existing Google sessions remain recoverable during the upgrade.

## 2. Cloudflare Pages bindings and secrets

Required:

- D1 binding `DB` → `mersenne-mesh`
- `AUTH_SECRET` → secret random value

Google option:

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET` (Secret)

Email option (Resend magic links):

- `AUTH_RESEND_KEY` (Secret)
- `AUTH_EMAIL_FROM` — e.g. `Mersenne Mesh <login@example.com>`

Public contact:

- `PUBLIC_CONTACT_EMAIL`

At least one of Google or email must be configured for `authConfigured` to become true.

## 3. Google OAuth

Authorized redirect URI:

```text
https://YOUR_DOMAIN/api/auth/callback/google
```

Keep the `pages.dev` callback too if you intend to use that hostname.

The Google provider is allowed to link to an existing magic-link user with the same verified email so contribution credit does not split into two identities.

## 4. Email login / sign-up

The email option uses Auth.js + Resend magic links. Verify your sending domain in Resend, create an API key, and set `AUTH_RESEND_KEY` and `AUTH_EMAIL_FROM`.

The UI deliberately labels the page **Log in / Sign up**:

- first verified email link → creates the account;
- later links to the same email → log into that same account;
- Google with the same verified email → links to the same Auth.js user.

Mersenne Mesh therefore does **not** store a password database or need a password-reset flow.

## 5. Runtime logs

For immediate Pages Function logs:

```bash
npx wrangler pages deployment tail
```

Or use **Workers & Pages → your Pages project → deployment → View details → Functions**.

The Worker emits structured objects such as:

- `auth.signin`
- `auth.signout`
- `auth.account_linked`
- `work.lease_created`
- `contribution.accepted`
- `contribution.rejected`
- `profile.handle_updated`
- `request.failed`

No password, magic-link token, OAuth token, session token, or full email address is deliberately written to those application logs.

## 6. Persistent audit verification

Pages tail logs are a real-time stream, so important application events are also persisted in D1:

```sql
SELECT id, user_id, event, metadata_json, created_at
FROM audit_events
ORDER BY created_at DESC
LIMIT 100;
```

Accepted work:

```sql
SELECT p.public_handle,
       c.work_unit_id,
       c.exponent,
       c.engine,
       c.cpu_core_milliseconds,
       c.gpu_milliseconds,
       c.candidates,
       c.factor_count,
       c.verified,
       c.created_at
FROM contributions c
JOIN profiles p ON p.user_id = c.user_id
ORDER BY c.created_at DESC
LIMIT 100;
```

Active leases:

```sql
SELECT l.id, p.public_handle, l.work_unit_id, l.engine, l.status,
       l.expires_at, l.created_at, l.completed_at
FROM work_leases l
JOIN profiles p ON p.user_id = l.user_id
ORDER BY l.created_at DESC
LIMIT 100;
```

Queue replication status:

```sql
SELECT w.id, w.exponent, w.start_k, w.count, w.target_replicas,
       sum(CASE WHEN l.status = 'completed' THEN 1 ELSE 0 END) AS completed_replicas
FROM work_units w
LEFT JOIN work_leases l ON l.work_unit_id = w.id
GROUP BY w.id
ORDER BY w.exponent, w.start_k;
```

## 7. Coordinator behavior

Signed-in contributors request `/api/work/lease`. The server:

1. expires stale leases;
2. returns an existing live lease to the same account if one exists;
3. otherwise leases a validation unit the account has not completed;
4. balances units by completed replica count;
5. gives the lease a 30-minute expiration.

A contribution is credited only when its lease belongs to the current user and the candidate/factor result matches the known validation answer. The contribution insert and lease completion are written in one D1 batch transaction.

The migration seeds **512 non-overlapping validation units** spanning M23, M29, M37, and M43. These are still known-answer validation ranges and are deliberately replicated across contributors. They are not unexplored discovery work.

## 8. Before real discovery work

Do not change `network` from `validation` merely to make the UI sound production-ready. Before unexplored ranges are issued:

- reconcile assignments with GIMPS / existing searches so work is not duplicated unintentionally;
- introduce a production lease policy with exclusive ranges and explicit retry rules;
- add a full Mersenne primality-test pipeline, not just trial factoring;
- independently verify candidate results with a separate implementation;
- publish finder / contributor / verifier credit rules;
- add abuse/rate-limit controls and operational monitoring;
- document data retention/deletion and incident response.
