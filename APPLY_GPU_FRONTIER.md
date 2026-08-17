# Mersenne Mesh — GPU Frontier Upgrade

No D1 migration is required for this upgrade. Migration 0003 is already sufficient.

## Upload these three files to GitHub `main`

Replace the existing files with the versions in this bundle:

- `src/mesh-console.tsx`
- `worker/index.ts`
- `src/App.tsx`

Cloudflare Pages has automatic deployments enabled for `main`, so the commit should trigger a production build.

## After Cloudflare deploys

1. Open `https://mersennemesh.com/api/health` and verify `explorationReady: true` remains present.
2. Hard-refresh `https://mersennemesh.com` (`Ctrl+Shift+R`).
3. Select **GPU**.
4. Press **Start contributing** once.
5. The Current assignment card should say **GPU** for frontier work.
6. The capability row should say **Frontier WebGPU**.
7. GPU mode will never silently fall back to CPU. If WebGPU fails, it stops and reports the error. **Automatic** may fall back to CPU.

## What changed

- Frontier trial factoring now uses a WebGPU wide-integer kernel.
- Candidate factors are represented as two `u32` limbs (64 bits total).
- Current seeded frontier ranges require at most 56 bits for `q = 2kp + 1`.
- Modular addition, multiplication, and exponentiation are implemented explicitly across the two limbs.
- Frontier GPU work is sliced into 262,144-k chunks to avoid one huge dispatch and to expose progress.
- Frontier workgroups use 256 invocations.
- GPU factors are returned as exact decimal strings using JavaScript `BigInt` conversion.
- The server accepts CPU or GPU exploration leases and independently verifies every reported factor using server-side `BigInt` arithmetic.
- Explicit **GPU** mode stops on GPU failure; **Automatic** mode may fall back to CPU.
- Existing unexpired leases may be changed to the currently requested engine before execution.

## Validation performed before packaging

The two-limb modular arithmetic was independently simulated and compared with arbitrary-precision integer arithmetic across 1,000 randomized cases within the seeded frontier's modulus range.

It was also checked against factors already produced by the live Mersenne Mesh frontier:

- M141308543: q = 3,391,405,033
- M141308543: q = 114,459,919,831
- M141308477: q = 7,913,274,713
- M141308467: q = 324,830,012,346,911

All satisfy the Mersenne-factor form/range relation and `2^p mod q = 1`.

The maximum possible `q` in the currently seeded 64-exponent / 16-range queue is 37,932,511,476,580,353 (56 bits), below the 64-bit limb ceiling.

A TypeScript parse/typecheck pass found only expected missing-dependency/type-environment errors because this isolated upgrade bundle does not contain the repo's `node_modules` or all source files; it reported no syntax errors in the changed files.
