import { Auth, type AuthConfig } from "@auth/core";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { D1Adapter } from "@auth/d1-adapter";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  AUTH_SECRET?: string;
  AUTH_GOOGLE_ID?: string;
  AUTH_GOOGLE_SECRET?: string;
  AUTH_RESEND_KEY?: string;
  AUTH_EMAIL_FROM?: string;
  PUBLIC_CONTACT_EMAIL?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type SessionUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  publicHandle?: string | null;
};

type ContributionPayload = {
  leaseId?: string;
  exponent?: number;
  workUnitId?: string;
  engine?: "cpu" | "gpu";
  elapsedMs?: number;
  candidates?: number;
  factors?: string[];
  cores?: number;
};

type WorkUnitRow = {
  leaseId: string;
  workUnitId: string;
  exponent: number;
  startK: number;
  count: number;
  expectedCandidates: number;
  expectedFactorsJson: string;
  expiresAt: string;
  status: string;
};

const HANDLE_RE = /^[a-z0-9_-]{3,32}$/;
const MAX_ELAPSED_MS = 3_600_000;

async function schemaV2Ready(env: Env) {
  if (!env.DB) return false;
  try {
    const row = await env.DB.prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'work_units'`,
    ).first<{ name: string }>();
    return row?.name === "work_units";
  } catch {
    return false;
  }
}

function googleConfigured(env: Env) {
  return Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET);
}

function emailConfigured(env: Env) {
  return Boolean(env.AUTH_RESEND_KEY && env.AUTH_EMAIL_FROM);
}

function authConfigured(env: Env) {
  return Boolean(
    env.DB &&
      env.AUTH_SECRET &&
      (googleConfigured(env) || emailConfigured(env)),
  );
}

function safeMetadata(metadata: Record<string, unknown>) {
  return JSON.stringify(metadata, (_key, value) => {
    if (typeof value === "string" && value.length > 500) return `${value.slice(0, 500)}…`;
    return value;
  });
}

async function audit(
  env: Env,
  event: string,
  userId: string | null,
  metadata: Record<string, unknown> = {},
) {
  const log = { event, userId, ...metadata };
  console.log(log);
  if (!env.DB || !(await schemaV2Ready(env))) return;
  try {
    await env.DB.prepare(
      `INSERT INTO audit_events (user_id, event, metadata_json)
       VALUES (?, ?, ?)`,
    )
      .bind(userId, event, safeMetadata(metadata))
      .run();
  } catch (error) {
    console.error({
      event: "audit.write_failed",
      originalEvent: event,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function defaultHandle(email: string, userId: string) {
  const local = normalizeEmail(email)
    .split("@")[0]
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 22);
  const prefix = local.length >= 3 ? local : "mesh";
  return `${prefix}-${userId.replace(/[^a-z0-9]/gi, "").slice(0, 6).toLowerCase()}`.slice(0, 32);
}

async function ensureProfile(env: Env, user: SessionUser) {
  if (!user.id || !user.email) throw new Error("Authenticated user is missing an id or email.");
  const email = normalizeEmail(user.email);
  const displayName = user.name || email;
  const handle = defaultHandle(email, user.id);

  if (!(await schemaV2Ready(env))) {
    const existing = await env.DB.prepare(
      `SELECT public_handle AS publicHandle FROM profiles WHERE lower(email) = ?`,
    ).bind(email).first<{ publicHandle: string }>();
    if (existing?.publicHandle) {
      await env.DB.prepare(
        `UPDATE profiles SET display_name = ?, updated_at = CURRENT_TIMESTAMP WHERE lower(email) = ?`,
      ).bind(displayName, email).run();
      return existing.publicHandle;
    }
    await env.DB.prepare(
      `INSERT INTO profiles (email, display_name, public_handle) VALUES (?, ?, ?)`,
    ).bind(email, displayName, handle).run();
    return handle;
  }

  const existing = await env.DB.prepare(
    `SELECT public_handle AS publicHandle FROM profiles WHERE user_id = ?`,
  ).bind(user.id).first<{ publicHandle: string }>();
  if (existing?.publicHandle) {
    await env.DB.prepare(
      `UPDATE profiles SET email = ?, display_name = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
    ).bind(email, displayName, user.id).run();
    return existing.publicHandle;
  }

  await env.DB.prepare(
    `INSERT INTO profiles (user_id, email, display_name, public_handle) VALUES (?, ?, ?, ?)`,
  ).bind(user.id, email, displayName, handle).run();
  return handle;
}

function authConfig(env: Env): AuthConfig {
  if (!env.AUTH_SECRET || !env.DB) {
    throw new Error("Auth.js requires AUTH_SECRET and the D1 DB binding.");
  }

  const providers: AuthConfig["providers"] = [];

  if (googleConfigured(env)) {
    providers.push(
      Google({
        clientId: env.AUTH_GOOGLE_ID!,
        clientSecret: env.AUTH_GOOGLE_SECRET!,
        // Google verifies the primary email address. This lets a user who first
        // used an email magic link later choose Google without splitting credit.
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  if (emailConfigured(env)) {
    providers.push(
      Resend({
        apiKey: env.AUTH_RESEND_KEY!,
        from: env.AUTH_EMAIL_FROM!,
      }),
    );
  }

  return {
    adapter: D1Adapter(env.DB),
    basePath: "/api/auth",
    providers,
    secret: env.AUTH_SECRET,
    session: { strategy: "database" },
    trustHost: true,
    pages: {
      signIn: "/login",
      verifyRequest: "/verify-request",
      error: "/login",
    },
    callbacks: {
      async session({ session, user }) {
        if (!session.user || !user?.id || !user.email) return session;
        const publicHandle = await ensureProfile(env, {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        });
        const extended = session.user as SessionUser;
        extended.id = user.id;
        extended.publicHandle = publicHandle;
        return session;
      },
    },
    events: {
      async signIn({ user, account }) {
        await audit(env, "auth.signin", user.id ?? null, {
          provider: account?.provider ?? "email",
        });
      },
      async signOut() {
        await audit(env, "auth.signout", null);
      },
      async linkAccount({ user, account }) {
        await audit(env, "auth.account_linked", user.id ?? null, {
          provider: account.provider,
        });
      },
    },
  };
}

function secure(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  headers.set("cross-origin-opener-policy", "same-origin-allow-popups");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function sessionUser(request: Request, env: Env) {
  if (!authConfigured(env)) return null;
  const sessionUrl = new URL(request.url);
  sessionUrl.pathname = "/api/auth/session";
  sessionUrl.search = "";
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const response = await Auth(
    new Request(sessionUrl, { method: "GET", headers }),
    authConfig(env),
  );
  if (!response.ok) return null;

  const session = (await response.json()) as { user?: SessionUser } | null;
  return session?.user?.id && session.user.email ? session.user : null;
}

async function statsFor(env: Env, userId: string) {
  const row = await env.DB.prepare(
    `SELECT
       coalesce(sum(cpu_core_milliseconds), 0) AS cpuCoreMilliseconds,
       coalesce(sum(gpu_milliseconds), 0) AS gpuMilliseconds,
       coalesce(sum(candidates), 0) AS candidates,
       coalesce(sum(factor_count), 0) AS factors,
       coalesce(sum(CASE WHEN verified = 1 THEN 1 ELSE 0 END), 0) AS validatedUnits
     FROM contributions
     WHERE user_id = ?`,
  )
    .bind(userId)
    .first<Record<string, number>>();

  return {
    cpuCoreMilliseconds: Number(row?.cpuCoreMilliseconds ?? 0),
    gpuMilliseconds: Number(row?.gpuMilliseconds ?? 0),
    candidates: Number(row?.candidates ?? 0),
    factors: Number(row?.factors ?? 0),
    validatedUnits: Number(row?.validatedUnits ?? 0),
  };
}

async function accountApi(request: Request, env: Env) {
  if (!(await schemaV2Ready(env))) return Response.json({ error: "Database migration 0002 is required.", migrationRequired: true }, { status: 503 });
  const user = await sessionUser(request, env);
  if (!user?.id || !user.email) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }
  let publicHandle = await ensureProfile(env, user);

  if (request.method === "PATCH") {
    let body: { publicHandle?: string };
    try {
      body = (await request.json()) as { publicHandle?: string };
    } catch {
      return Response.json({ error: "Invalid JSON." }, { status: 400 });
    }
    const handle = String(body.publicHandle ?? "").trim().toLowerCase();
    if (!HANDLE_RE.test(handle)) {
      return Response.json(
        { error: "Handle must be 3–32 characters using letters, numbers, _ or -." },
        { status: 400 },
      );
    }
    try {
      await env.DB.prepare(
        `UPDATE profiles
         SET public_handle = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
      )
        .bind(handle, user.id)
        .run();
      publicHandle = handle;
      await audit(env, "profile.handle_updated", user.id, { publicHandle: handle });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes("unique")) {
        return Response.json({ error: "That handle is already taken." }, { status: 409 });
      }
      throw error;
    }
  } else if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { allow: "GET, PATCH" },
    });
  }

  const [profile, stats, recentResult, auditResult] = await Promise.all([
    env.DB.prepare(
      `SELECT email, display_name AS displayName, public_handle AS publicHandle,
              created_at AS createdAt
       FROM profiles WHERE user_id = ?`,
    )
      .bind(user.id)
      .first(),
    statsFor(env, user.id),
    env.DB.prepare(
      `SELECT work_unit_id AS workUnitId, exponent, engine,
              cpu_core_milliseconds AS cpuCoreMilliseconds,
              gpu_milliseconds AS gpuMilliseconds, candidates,
              factor_count AS factorCount, created_at AS createdAt
       FROM contributions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 12`,
    )
      .bind(user.id)
      .all(),
    env.DB.prepare(
      `SELECT event, metadata_json AS metadataJson, created_at AS createdAt
       FROM audit_events
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 12`,
    )
      .bind(user.id)
      .all(),
  ]);

  const rank = await env.DB.prepare(
    `WITH totals AS (
       SELECT user_id, count(*) AS units
       FROM contributions
       WHERE verified = 1
       GROUP BY user_id
     ), mine AS (
       SELECT coalesce((SELECT units FROM totals WHERE user_id = ?), 0) AS units
     )
     SELECT 1 + count(*) AS rank
     FROM totals, mine
     WHERE totals.units > mine.units`,
  )
    .bind(user.id)
    .first<{ rank: number }>();

  const contributors = await env.DB.prepare(
    `SELECT count(*) AS count FROM profiles`,
  ).first<{ count: number }>();

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.name || user.email,
      image: user.image || null,
      publicHandle,
    },
    profile,
    stats,
    rank: Number(rank?.rank ?? 1),
    contributors: Number(contributors?.count ?? 0),
    recentContributions: recentResult.results ?? [],
    recentEvents: (auditResult.results ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      metadata: (() => {
        try {
          return JSON.parse(String(row.metadataJson ?? "{}"));
        } catch {
          return {};
        }
      })(),
    })),
  });
}

async function leaseApi(request: Request, env: Env) {
  if (!(await schemaV2Ready(env))) return Response.json({ error: "Database migration 0002 is required.", migrationRequired: true }, { status: 503 });
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { allow: "POST" },
    });
  }
  const user = await sessionUser(request, env);
  if (!user?.id || !user.email) {
    return Response.json({ error: "Sign in required for server-leased work." }, { status: 401 });
  }
  await ensureProfile(env, user);

  let body: { engine?: string } = {};
  try {
    body = (await request.json()) as { engine?: string };
  } catch {
    // An empty body is fine; CPU is the conservative default.
  }
  const engine = body.engine === "gpu" ? "gpu" : "cpu";

  await env.DB.prepare(
    `UPDATE work_leases
     SET status = 'expired'
     WHERE user_id = ? AND status = 'leased' AND expires_at <= CURRENT_TIMESTAMP`,
  )
    .bind(user.id)
    .run();

  const existing = await env.DB.prepare(
    `SELECT l.id AS leaseId, l.work_unit_id AS workUnitId,
            w.exponent, w.start_k AS startK, w.count,
            w.expected_candidates AS expectedCandidates,
            w.expected_factors_json AS expectedFactorsJson,
            l.expires_at AS expiresAt, l.status
     FROM work_leases l
     JOIN work_units w ON w.id = l.work_unit_id
     WHERE l.user_id = ? AND l.status = 'leased' AND l.expires_at > CURRENT_TIMESTAMP
     ORDER BY l.created_at DESC LIMIT 1`,
  )
    .bind(user.id)
    .first<WorkUnitRow>();

  if (existing) {
    return Response.json({ job: existing });
  }

  const leaseId = crypto.randomUUID();
  try {
    const inserted = await env.DB.prepare(
      `INSERT INTO work_leases (id, work_unit_id, user_id, engine, expires_at)
       SELECT ?, w.id, ?, ?, datetime('now', '+30 minutes')
       FROM work_units w
       WHERE w.active = 1
         AND NOT EXISTS (
           SELECT 1 FROM work_leases mine
           WHERE mine.user_id = ? AND mine.work_unit_id = w.id AND mine.status = 'completed'
         )
         AND (
           SELECT count(*) FROM work_leases done
           WHERE done.work_unit_id = w.id AND done.status = 'completed'
         ) < w.target_replicas
       ORDER BY (
         SELECT count(*) FROM work_leases done
         WHERE done.work_unit_id = w.id AND done.status = 'completed'
       ) ASC, w.exponent ASC, w.start_k ASC
       LIMIT 1`,
    )
      .bind(leaseId, user.id, engine, user.id)
      .run();

    if (!inserted.meta.changes) {
      return Response.json({ job: null, message: "No validation work is currently available." });
    }
  } catch (error) {
    // A simultaneous tab may have won the one-active-lease constraint.
    const retryExisting = await env.DB.prepare(
      `SELECT l.id AS leaseId, l.work_unit_id AS workUnitId,
              w.exponent, w.start_k AS startK, w.count,
              w.expected_candidates AS expectedCandidates,
              w.expected_factors_json AS expectedFactorsJson,
              l.expires_at AS expiresAt, l.status
       FROM work_leases l JOIN work_units w ON w.id = l.work_unit_id
       WHERE l.user_id = ? AND l.status = 'leased' AND l.expires_at > CURRENT_TIMESTAMP
       ORDER BY l.created_at DESC LIMIT 1`,
    )
      .bind(user.id)
      .first<WorkUnitRow>();
    if (retryExisting) return Response.json({ job: retryExisting });
    throw error;
  }

  const leased = await env.DB.prepare(
    `SELECT l.id AS leaseId, l.work_unit_id AS workUnitId,
            w.exponent, w.start_k AS startK, w.count,
            w.expected_candidates AS expectedCandidates,
            w.expected_factors_json AS expectedFactorsJson,
            l.expires_at AS expiresAt, l.status
     FROM work_leases l JOIN work_units w ON w.id = l.work_unit_id
     WHERE l.id = ?`,
  )
    .bind(leaseId)
    .first<WorkUnitRow>();

  if (!leased) return Response.json({ job: null });
  await audit(env, "work.lease_created", user.id, {
    leaseId,
    workUnitId: leased.workUnitId,
    engine,
  });
  return Response.json({ job: leased }, { status: 201 });
}

async function contributionsApi(request: Request, env: Env) {
  if (!(await schemaV2Ready(env))) return Response.json({ error: "Database migration 0002 is required.", migrationRequired: true }, { status: 503 });
  const user = await sessionUser(request, env);
  if (!user?.id || !user.email) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }
  await ensureProfile(env, user);

  if (request.method === "GET") {
    return Response.json({ stats: await statsFor(env, user.id) });
  }
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { allow: "GET, POST" },
    });
  }

  let payload: ContributionPayload;
  try {
    payload = (await request.json()) as ContributionPayload;
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const leaseId = String(payload.leaseId ?? "").slice(0, 80);
  const workUnitId = String(payload.workUnitId ?? "").slice(0, 120);
  const exponent = Math.trunc(Number(payload.exponent));
  const elapsedMs = Math.trunc(Number(payload.elapsedMs));
  const candidates = Math.trunc(Number(payload.candidates));
  const cores = Math.max(1, Math.min(256, Math.trunc(Number(payload.cores))));
  const engine = payload.engine === "gpu" ? "gpu" : "cpu";
  const receivedFactors = [...new Set((payload.factors ?? []).map(String))].sort(
    (a, b) => Number(a) - Number(b),
  );

  const lease = await env.DB.prepare(
    `SELECT l.id AS leaseId, l.work_unit_id AS workUnitId,
            w.exponent, w.start_k AS startK, w.count,
            w.expected_candidates AS expectedCandidates,
            w.expected_factors_json AS expectedFactorsJson,
            l.expires_at AS expiresAt, l.status
     FROM work_leases l JOIN work_units w ON w.id = l.work_unit_id
     WHERE l.id = ? AND l.user_id = ?`,
  )
    .bind(leaseId, user.id)
    .first<WorkUnitRow>();

  const expectedFactors = lease
    ? (JSON.parse(lease.expectedFactorsJson || "[]") as string[]).map(String).sort(
        (a, b) => Number(a) - Number(b),
      )
    : [];

  const valid = Boolean(
    lease &&
      lease.status === "leased" &&
      Date.parse(`${lease.expiresAt.replace(" ", "T")}Z`) > Date.now() &&
      lease.workUnitId === workUnitId &&
      lease.exponent === exponent &&
      Number.isFinite(elapsedMs) &&
      elapsedMs >= 1 &&
      elapsedMs <= MAX_ELAPSED_MS &&
      candidates === lease.expectedCandidates &&
      JSON.stringify(receivedFactors) === JSON.stringify(expectedFactors),
  );

  if (!valid || !lease) {
    await audit(env, "contribution.rejected", user.id, {
      leaseId,
      workUnitId,
      reason: "validation_mismatch",
    });
    return Response.json(
      { error: "The result did not match the active server lease." },
      { status: 422 },
    );
  }

  try {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO contributions (
           user_id, work_unit_id, exponent, engine,
           cpu_core_milliseconds, gpu_milliseconds, candidates,
           factors_json, factor_count, verified
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      ).bind(
        user.id,
        workUnitId,
        exponent,
        engine,
        engine === "cpu" ? elapsedMs * cores : 0,
        engine === "gpu" ? elapsedMs : 0,
        candidates,
        JSON.stringify(receivedFactors),
        receivedFactors.length,
      ),
      env.DB.prepare(
        `UPDATE work_leases
         SET status = 'completed', completed_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ? AND status = 'leased'`,
      ).bind(leaseId, user.id),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("unique")) {
      return Response.json({ stats: await statsFor(env, user.id), duplicate: true });
    }
    throw error;
  }

  await audit(env, "contribution.accepted", user.id, {
    leaseId,
    workUnitId,
    exponent,
    engine,
    elapsedMs,
    candidates,
    factorCount: receivedFactors.length,
  });

  return Response.json(
    { stats: await statsFor(env, user.id) },
    { status: 201 },
  );
}

async function healthApi(env: Env) {
  const schemaReady = await schemaV2Ready(env);
  return Response.json({
    ok: true,
    authConfigured: authConfigured(env),
    googleConfigured: Boolean(env.DB && env.AUTH_SECRET && googleConfigured(env)),
    emailConfigured: Boolean(env.DB && env.AUTH_SECRET && emailConfigured(env)),
    databaseBound: Boolean(env.DB),
    schemaReady,
    network: "validation",
    operatorContact: env.PUBLIC_CONTACT_EMAIL || null,
  });
}

async function route(request: Request, env: Env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") return healthApi(env);

  if (url.pathname.startsWith("/api/auth")) {
    if (!authConfigured(env)) {
      if (url.pathname === "/api/auth/session") return Response.json(null);
      return Response.json(
        { error: "Authentication is not configured." },
        { status: 503 },
      );
    }
    return Auth(request, authConfig(env));
  }

  if (!env.DB && url.pathname.startsWith("/api/")) {
    return Response.json({ error: "D1 binding DB is missing." }, { status: 503 });
  }

  if (url.pathname === "/api/account") return accountApi(request, env);
  if (url.pathname === "/api/work/lease") return leaseApi(request, env);
  if (url.pathname === "/api/contributions") return contributionsApi(request, env);

  let response = await env.ASSETS.fetch(request);
  if (
    response.status === 404 &&
    request.method === "GET" &&
    (request.headers.get("accept") ?? "").includes("text/html")
  ) {
    const fallback = new URL(request.url);
    fallback.pathname = "/index.html";
    fallback.search = "";
    response = await env.ASSETS.fetch(new Request(fallback, request));
  }
  return response;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    try {
      return secure(await route(request, env));
    } catch (error) {
      console.error({
        event: "request.failed",
        path: new URL(request.url).pathname,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return secure(
        Response.json(
          { error: "The service could not complete this request." },
          { status: 500 },
        ),
      );
    }
  },
};
