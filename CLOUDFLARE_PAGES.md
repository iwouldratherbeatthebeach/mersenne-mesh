# Deploy Mersenne Mesh to Cloudflare Pages

This guide takes the provided source from a ZIP file to a live Cloudflare Pages site with GitHub deployments, Google sign-in, Cloudflare D1 persistence, and contribution attribution.

Cloudflare Pages supports a bundled `_worker.js` in the output directory through [Pages Functions Advanced Mode](https://developers.cloudflare.com/pages/functions/advanced-mode/). This repository builds exactly that artifact, so the React app, OAuth routes, and D1 API deploy as one Pages project.

## 1. What you need

- A GitHub account
- A Cloudflare account
- A Google account with access to Google Cloud Console
- Node.js 22.13 or newer for local builds
- Git, if you use the recommended command-line upload

Do not commit Google client secrets, `AUTH_SECRET`, `.dev.vars`, or `.env` files.

## 2. Put the source on GitHub

Extract the ZIP, open a terminal in the folder containing `package.json`, and run:

```bash
git init
git add .
git commit -m "Initial Mersenne Mesh release"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_NAME/YOUR_REPOSITORY.git
git push -u origin main
```

Create the empty GitHub repository before the last two commands. Do not add a generated README or `.gitignore` on GitHub because both already exist here.

If you prefer GitHub’s browser upload, create an empty repository, choose **Add file → Upload files**, and upload the extracted contents. Include dotfiles such as `.env.example` and `.gitignore`; do not upload `node_modules` or `dist`.

Cloudflare’s [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/) will create a deployment for each push and preview deployments for eligible pull requests.

## 3. Create the first Pages deployment

In Cloudflare:

1. Open **Workers & Pages**.
2. Choose **Create application → Pages → Connect to Git**.
3. Authorize the Cloudflare Workers & Pages GitHub App for this repository.
4. Select the repository and use these build settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | `22` |

5. Deploy once.

The first deployment can be anonymous. It gives you a stable URL such as `https://YOUR_PROJECT.pages.dev`, which you need for Google’s exact OAuth callback URI.

The build creates:

- versioned browser assets under `dist/assets/`
- the CPU worker at `dist/mesh-worker.js`
- the bundled Pages Function at `dist/_worker.js`

## 4. Create and initialize D1

You can use the Cloudflare dashboard or Wrangler.

### Dashboard method

1. Open **Storage & Databases → D1 SQL database**.
2. Choose **Create database**.
3. Name it `mersenne-mesh`.
4. Open its **Console**, paste the contents of `db/0001_initial.sql`, and run it.

### Wrangler method

```bash
npx wrangler login
npx wrangler d1 create mersenne-mesh
npx wrangler d1 execute mersenne-mesh --remote --file=db/0001_initial.sql
```

Cloudflare documents the same create/bind/execute flow in the [D1 getting-started guide](https://developers.cloudflare.com/d1/get-started/).

### Bind D1 to Pages

1. Return to **Workers & Pages → your Pages project**.
2. Open **Settings → Bindings**.
3. Add a **D1 database binding**.
4. Set the variable name to exactly `DB`.
5. Select the `mersenne-mesh` database.
6. Add it to Production. Add a separate preview database to Preview if you intend to test writes on preview deployments.
7. Save, then redeploy the latest commit.

The binding name is case-sensitive. The code expects `env.DB`.

## 5. Configure Google sign-in

Auth.js uses this callback path:

```text
https://YOUR_PROJECT.pages.dev/api/auth/callback/google
```

If you use a custom domain, also add:

```text
https://YOUR_DOMAIN/api/auth/callback/google
```

The exact callback path comes from the official [Auth.js Google provider documentation](https://authjs.dev/getting-started/providers/google). Google requires redirect URIs to match exactly; its [OAuth web-server guide](https://developers.google.com/identity/protocols/oauth2/web-server) explains the requirement.

In Google Cloud Console:

1. Create or select a Google Cloud project.
2. Open **Google Auth Platform**.
3. Under **Branding**, set the application name to `Mersenne Mesh`, choose a support email, and add your homepage, Privacy page, and terms/contact details as applicable.
4. Under **Audience**, choose **External** for public Google accounts. While testing, add your own Google account as a test user.
5. Under **Data Access**, keep only the basic OpenID Connect identity scopes used by Auth.js: `openid`, `email`, and `profile`.
6. Under **Clients**, create an **OAuth client ID** with application type **Web application**.
7. Add the production Pages callback URI shown above under **Authorized redirect URIs**.
8. Copy the client ID and client secret.

Google projects in Testing are limited to listed test users; Google’s [audience documentation](https://support.google.com/cloud/answer/15549945) explains Testing versus In production. Before a public launch, review Google’s branding and verification requirements and make sure `/privacy` contains your real operator contact and practices.

## 6. Add Pages variables and secrets

Generate an Auth.js session secret locally:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

In **Workers & Pages → your Pages project → Settings → Variables and Secrets**, add:

| Name | Type | Value |
|---|---|---|
| `AUTH_GOOGLE_ID` | Variable | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Secret | Google OAuth client secret |
| `AUTH_SECRET` | Secret | Random value generated above |
| `PUBLIC_CONTACT_EMAIL` | Variable | Public support/privacy email |

Cloudflare distinguishes readable environment variables from encrypted secrets in its [Pages bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/). Use **Secret** for both sensitive values.

Add the values to Production and redeploy. Do not put them in GitHub Actions variables unless you intentionally change the build; this app reads them at Pages runtime.

Preview deployment URLs change. Google does not accept wildcard OAuth redirect URIs, so either leave Google sign-in disabled on previews or give a preview branch a fixed custom domain and register its exact callback URI.

## 7. Verify the deployment

Open:

```text
https://YOUR_PROJECT.pages.dev/api/health
```

The healthy production response should include:

```json
{
  "ok": true,
  "authConfigured": true,
  "databaseBound": true,
  "network": "validation",
  "operatorContact": "you@example.com"
}
```

Then complete this checklist:

1. Open `/about`, `/faq`, and `/privacy` directly and confirm each route loads.
2. Choose **Sign in with Google** and complete the Google flow.
3. Return to the console and confirm your contributor handle appears.
4. Choose CPU, press **Start contributing**, and wait for a validation result.
5. Pause, refresh the page, and confirm the signed-in totals remain.
6. In D1, check that `users`, `sessions`, `profiles`, and `contributions` contain the expected rows.

The app credits each validation work unit only once per account. Re-running a known unit can test the device, but it cannot inflate durable account totals.

## 8. Optional custom domain

In the Pages project, open **Custom domains → Set up a domain**. After it becomes active:

1. Add `https://YOUR_DOMAIN/api/auth/callback/google` to the Google OAuth client.
2. Update Google Branding links to use the custom domain.
3. Confirm `/api/health` and Google sign-in on the custom domain.

Keep the `pages.dev` callback registered only if you still intend to use that hostname.

## 9. Local full-stack development

Install dependencies:

```bash
npm install
```

Copy the local templates:

```bash
cp .env.example .dev.vars
cp wrangler.toml.example wrangler.toml
```

Replace every placeholder. Use the D1 database ID returned by `wrangler d1 create`. Add this local callback URI to the Google OAuth client:

```text
http://localhost:8788/api/auth/callback/google
```

Initialize local D1 and start Pages:

```bash
npx wrangler d1 execute mersenne-mesh --local --file=db/0001_initial.sql
npm run preview
```

`npm run dev` is faster for interface-only work, but it does not emulate Pages bindings or OAuth routes.

## 10. Direct upload instead of GitHub

Cloudflare supports `_worker.js` in a Pages direct upload. Build and deploy with Wrangler:

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name mersenne-mesh
```

The dashboard’s drag-and-drop uploader can also accept the contents of `dist`, but GitHub or Wrangler is easier to reproduce. Cloudflare documents both options in its [Pages Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/).

## 11. Production checklist

Before assigning unexplored work:

- Replace the validation-only job list with server-leased, non-overlapping units.
- Reconcile ranges with existing projects so volunteers do not duplicate known work.
- Add signed work leases and server-side replay protection beyond account/unit deduplication.
- Add a full large-integer primality-test pipeline; trial factoring alone cannot prove primality.
- Independently reproduce every interesting result with a separate implementation.
- Publish the exact finder/contributor/verifier credit policy first.
- Publish operator identity, privacy contact, retention/deletion policy, and abuse process.
- Add rate limiting, monitoring, backups, migration procedures, and incident response.
- Test the WebGPU kernel on representative hardware; CPU fallback is the reference path in this alpha.

Until those items are complete, keep `network: "validation"` and do not advertise the site as a new-prime discovery service.

## Troubleshooting

### The Google button is disabled

Open `/api/health`. `authConfigured` becomes `true` only when the `DB` binding and all three Auth variables are present. Save the bindings and redeploy.

### Google reports `redirect_uri_mismatch`

Copy the callback URI from the browser error and compare it character-for-character with the Google OAuth client. Check the scheme, hostname, optional `www`, and `/api/auth/callback/google` path.

### Sign-in works but totals do not persist

Confirm the binding name is exactly `DB`, run `db/0001_initial.sql` against the remote database, and inspect the Pages Function logs for a D1 error.

### A direct route returns 404

Confirm `dist/_worker.js` exists after `npm run build`. That worker provides the SPA fallback for `/about`, `/faq`, and `/privacy`.

### WebGPU is unavailable

WebGPU support depends on browser, operating system, driver, and secure context. Choose CPU or Automatic; the interface will fall back without losing the current validation loop.
