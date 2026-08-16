# Mersenne Mesh

Mersenne Mesh is a browser-native volunteer-computing alpha for Mersenne-number research. It runs explicit, user-controlled trial factoring in Web Workers or an experimental WebGPU kernel, then records validated contribution totals for Google-authenticated accounts.

This repository is built specifically for **Cloudflare Pages**:

- Vite + React static interface
- Cloudflare Pages Advanced Mode worker (`dist/_worker.js`)
- Auth.js Google OAuth
- Cloudflare D1 sessions, profiles, and contribution ledger
- `/about`, `/faq`, and `/privacy` routes
- CPU/Web Worker implementation and experimental WebGPU implementation

## Scientific status

This release is a **validation network**, not a new-prime search. Its four work units replay known trial-factor ranges so the CPU and GPU implementations can be checked against known answers. A production discovery network still needs unique work leasing, range reconciliation, a full primality-test path, independent verification, and a finalized credit policy.

Mersenne Mesh is independent and is not affiliated with GIMPS.

## Start here

Read [CLOUDFLARE_PAGES.md](./CLOUDFLARE_PAGES.md) for the complete GitHub, D1, Google OAuth, Pages deployment, and verification checklist.

For a quick local UI-only preview:

```bash
npm install
npm run dev
```

For a production-equivalent build and test:

```bash
npm test
```

## Repository map

| Path | Purpose |
|---|---|
| `src/` | React interface, About, FAQ, Privacy, and compute console |
| `public/mesh-worker.js` | BigInt CPU trial-factoring worker |
| `worker/index.ts` | Pages worker, Auth.js, D1 API, result validation |
| `db/0001_initial.sql` | D1 schema for OAuth and contribution records |
| `worker/vite.config.ts` | Bundles the server into Pages `_worker.js` |
| `.env.example` | Required runtime variables without secrets |
| `wrangler.toml.example` | Optional local Wrangler/D1 configuration |
| `CLOUDFLARE_PAGES.md` | Complete deployment instructions |

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
