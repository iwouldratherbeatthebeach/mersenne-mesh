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
        ? new Response("<!doctype html><title>Mersenne Mesh</title>", {
            headers: { "content-type": "text/html" },
          })
        : new Response("Not found", { status: 404 });
    },
  },
};

test("reports an unconfigured local environment safely", async () => {
  const response = await worker.fetch(
    new Request("https://mesh.example/api/health"),
    env,
    {},
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    authConfigured: false,
    databaseBound: false,
    network: "validation",
    operatorContact: null,
  });
});

test("returns a null session until Google OAuth is configured", async () => {
  const response = await worker.fetch(
    new Request("https://mesh.example/api/auth/session"),
    env,
    {},
  );
  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
});

test("serves the single-page app for a human-facing route", async () => {
  const response = await worker.fetch(
    new Request("https://mesh.example/about", {
      headers: { accept: "text/html" },
    }),
    env,
    {},
  );
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Mersenne Mesh/);
});
