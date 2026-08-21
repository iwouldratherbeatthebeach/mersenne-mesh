import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/_worker.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async (request) => {
      const path = new URL(request.url).pathname;
      return path === "/index.html"
        ? new Response("<!doctype html><title>Mersenne Mesh</title>", { headers: { "content-type": "text/html" } })
        : new Response("Not found", { status: 404 });
    },
  },
};

test("reports an unconfigured local environment safely", async () => {
  const response = await worker.fetch(new Request("https://mesh.example/api/health"), env, {});
  assert.equal(response.status, 200);
  const body = await response.json();
  // Asserted field-by-field (rather than a single assert.deepEqual against a
  // fixed object) so this test doesn't have to be rewritten every time a new,
  // purely additive field shows up in the health payload. It previously went
  // stale exactly this way when `explorationReady` and `computeProtocol` were
  // added and the old deepEqual check silently stopped being run/updated.
  assert.equal(body.ok, true);
  assert.equal(body.authConfigured, false);
  assert.equal(body.googleConfigured, false);
  assert.equal(body.emailConfigured, false);
  assert.equal(body.databaseBound, false);
  assert.equal(body.schemaReady, false);
  assert.equal(body.explorationReady, false);
  assert.equal(body.network, "validation");
  assert.equal(body.operatorContact, null);
  assert.equal(typeof body.computeProtocol, "string");
});

test("returns a null session until authentication is configured", async () => {
  const response = await worker.fetch(new Request("https://mesh.example/api/auth/session"), env, {});
  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
});

test("serves the single-page app for a human-facing route", async () => {
  const response = await worker.fetch(new Request("https://mesh.example/login", { headers: { accept: "text/html" } }), env, {});
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Mersenne Mesh/);
});

test("applies security headers, including a restrictive CSP, to every response", async () => {
  const response = await worker.fetch(new Request("https://mesh.example/api/health"), env, {});
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  const csp = response.headers.get("content-security-policy");
  assert.ok(csp, "expected a content-security-policy header");
  assert.match(csp, /default-src 'self'/);
});

test("refuses lease and contribution requests without a D1 binding", async () => {
  // This smoke env has no DB binding, so the router's D1 guard fires before
  // auth is even checked (see worker/index.ts `route()`). This still proves
  // the endpoints don't silently accept unauthenticated writes; the
  // authenticated-but-unauthorized (401) path requires a bound D1 database
  // and is covered by integration tests against a real/local D1 instance.
  const leaseResponse = await worker.fetch(
    new Request("https://mesh.example/api/work/lease", { method: "POST" }),
    env,
    {},
  );
  assert.equal(leaseResponse.status, 503);

  const contributionResponse = await worker.fetch(
    new Request("https://mesh.example/api/contributions", { method: "POST" }),
    env,
    {},
  );
  assert.equal(contributionResponse.status, 503);
});
