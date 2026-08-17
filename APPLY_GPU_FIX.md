# Mersenne Mesh — GPU frontier diagnostic/fix

No D1 migration is required.

Replace these two files in GitHub `main`:

- `src/mesh-console.tsx`
- `worker/index.ts`

Cloudflare Pages should auto-deploy after the commit.

## What changed

1. Before frontier GPU work is trusted, the browser runs a one-candidate WebGPU known-factor self-test:
   - exponent `141308467`
   - `k = 1149365`
   - expected factor `q = 324830012346911`
2. Every GPU result is checked locally with JavaScript BigInt before submission:
   - exact candidate count
   - `q = 2kp + 1`
   - assigned k-range
   - `q mod 8`
   - `2^p mod q = 1`
3. Server 422 responses now identify the exact failure:
   - `lease_not_found`
   - `lease_not_active`
   - `lease_expired`
   - `work_unit_mismatch`
   - `exponent_mismatch`
   - `engine_mismatch`
   - `elapsed_time_invalid`
   - `candidate_count_mismatch`
   - `known_answer_mismatch`
   - `reported_factor_invalid`
4. `/api/health` now includes:

   `"computeProtocol":"gpu-frontier-v2"`

## After deployment

Hard-refresh `https://mersennemesh.com`.

First check:

`https://mersennemesh.com/api/health`

and confirm `computeProtocol` is `gpu-frontier-v2`.

Then select GPU and press Start contributing.

The activity ledger should first show `Frontier WebGPU self-test passed`.

If a submission is still rejected, the console will now show the exact rejection code instead of the generic mismatch message.
