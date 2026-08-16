# Mersenne Mesh

Mersenne Mesh is a browser-native volunteer-computing alpha for Mersenne-number research. It runs explicit, user-controlled trial factoring in Web Workers or an experimental WebGPU kernel, leases validation work from a Cloudflare coordinator, and records verified contribution credit in D1.

This repository is built specifically for **Cloudflare Pages**:

- Vite + React interface
- Cloudflare Pages Advanced Mode worker (`dist/_worker.js`)
- Auth.js **email magic-link login/sign-up** plus optional Google OAuth
- Stable contributor identity keyed by Auth.js user ID
- Cloudflare D1 sessions, profiles, work leases, contribution ledger, and persistent audit events
- Contributor dashboard with public handle, totals, recent work, rank, and achievements
- CPU/Web Worker implementation and experimental WebGPU implementation

## Scientific status

This release is a **validation network**, not a new-prime search. The coordinator seeds 512 non-overlapping known-answer trial-factor ranges across M23, M29, M37, and M43. Signed-in browsers receive 30-minute leases, compute the range locally, and receive credit only after the server validates the result.

The ranges are intentionally replicated across contributors to test allocation and independent reproduction. Production discovery work still requires reconciliation with established searches, exclusive assignment rules, a complete primality-test path, independent verification, and a finalized credit policy.

Mersenne Mesh is independent and is not affiliated with GIMPS.

## Start here

- [CLOUDFLARE_PAGES.md](./CLOUDFLARE_PAGES.md) — initial Pages deployment.
- [OPERATIONS.md](./OPERATIONS.md) — v2 database migration, login/sign-up providers, coordinator behavior, runtime logs, and D1 verification queries.

For a quick UI-only preview:

```bash
npm install
npm run dev
```

For the production-equivalent build and smoke tests:

```bash
npm test
```

## Repository map

| Path | Purpose |
|---|---|
| `src/` | React UI, auth pages, contributor dashboard, and compute console |
| `public/mesh-worker.js` | BigInt CPU trial-factoring worker |
| `worker/index.ts` | Pages worker, Auth.js, coordinator, D1 APIs, logging, validation |
| `db/0001_initial.sql` | Original Auth.js/D1 schema |
| `db/0002_accounts_and_coordinator.sql` | User-ID migration, audit ledger, work queue and leases |
| `worker/vite.config.ts` | Bundles the server into Pages `_worker.js` |
| `.env.example` | Runtime variable template without secrets |
| `wrangler.toml.example` | Optional local Wrangler/D1 configuration |
| `OPERATIONS.md` | Deployment operations and verification queries |

## Commands

```bash
npm run dev        # Vite UI preview; APIs are not emulated
npm run build      # Create the Pages-ready dist/ directory
npm run preview    # Build and run Pages locally with Wrangler
npm run typecheck  # TypeScript verification
npm test           # Typecheck, build, and Worker smoke tests
```

## License

MIT. See [LICENSE](./LICENSE).
