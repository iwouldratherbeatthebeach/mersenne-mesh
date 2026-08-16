# Mersenne Mesh v2 upgrade bundle

Extract this bundle over the root of the existing `iwouldratherbeatthebeach/mersenne-mesh` repository.
It adds passwordless email login/sign-up alongside Google, stable user-ID contribution ownership,
a contributor dashboard, a D1-backed validation work coordinator, and structured/persistent audit logging.

## Apply to GitHub in one commit

From a local clone, extract this ZIP into the repository root and overwrite matching files, then run:

```bash
git add -A
git commit -m "Add accounts, coordinator, dashboard, and observability"
git push origin main
```

Cloudflare Pages should build with the existing `npm run build` -> `dist` configuration.

## Database upgrade

After the code deploys:

```bash
npx wrangler d1 execute mersenne-mesh --remote --file=db/0002_accounts_and_coordinator.sql
```

For a brand-new D1 database, apply the existing repository's `db/0001_initial.sql` first, then `0002`.

Check `/api/health`; `schemaReady` should become `true`.

## Authentication variables

Required:
- `AUTH_SECRET`
- D1 binding named `DB`

Google:
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

Email magic links via Resend:
- `AUTH_RESEND_KEY`
- `AUTH_EMAIL_FROM`, e.g. `Mersenne Mesh <login@example.com>`

Optional/public:
- `PUBLIC_CONTACT_EMAIL`

Google callback:
`https://YOUR_DOMAIN/api/auth/callback/google`

## Verification

Open `/login`, sign in, then open `/account`.
Start a signed-in contribution and verify D1 `contributions`, `work_leases`, and `audit_events`.
See `OPERATIONS.md` for SQL queries and live-log locations.

The network remains `validation`; seeded coordinator jobs are known-answer validation work, not unexplored prime discovery.
