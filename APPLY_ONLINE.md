# Mersenne Mesh frontier upgrade — browser-only deployment

No Wrangler is required.

## 1. Upload the code to GitHub

Open `iwouldratherbeatthebeach/mersenne-mesh` in GitHub.

Replace these existing files with the versions in this bundle:

- `worker/index.ts`
- `src/mesh-console.tsx`
- `src/types.ts`
- `src/App.tsx`

Add this new file:

- `db/0003_frontier_exploration.sql`

Commit all five changes to `main`. Cloudflare Pages will automatically build the commit.

The worker is backward compatible with schema 0002. Until 0003 is installed, `/api/health` reports `explorationReady: false` and the existing validation queue remains the only server work.

## 2. Apply migration 0003 in the Cloudflare dashboard

Open Cloudflare → Storage & databases → D1 → `mersenne-mesh` → Console.

Open `db/0003_frontier_exploration.sql` in GitHub, copy the complete SQL file, paste it into the D1 Console, and Execute it once.

Then verify:

```sql
SELECT COUNT(*) AS exploration_units
FROM work_units
WHERE network = 'exploration';
```

Expected: `1024`.

Verify the exponent range:

```sql
SELECT MIN(exponent) AS first_exponent,
       MAX(exponent) AS last_exponent,
       COUNT(DISTINCT exponent) AS prime_exponents
FROM work_units
WHERE network = 'exploration';
```

Expected:

- first_exponent: 141308443
- last_exponent: 141309617
- prime_exponents: 64

## 3. Redeploy/check health

Cloudflare Pages normally redeploys automatically from the GitHub commit. After the deployment is green, open:

`https://mersennemesh.com/api/health`

You want:

```json
{
  "databaseBound": true,
  "schemaReady": true,
  "explorationReady": true,
  "network": "validation+exploration"
}
```

## 4. Run it

Open `https://mersennemesh.com`, sign in, and press **Start contributing** once.

The client now stays active until you press Pause or close the tab. If no lease is available it remains in a waiting state and polls again automatically.

Existing known-answer validation work can use WebGPU. Frontier exploration work currently uses the CPU BigInt worker because the current WebGPU kernel is 32-bit and is not safe for the high-exponent ranges.

A server-verified factor is immediately definitive for compositeness. A no-factor frontier result stays pending until a second contributor independently returns the same result.
