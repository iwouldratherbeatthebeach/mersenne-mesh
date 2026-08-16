import { Auth, type AuthConfig } from "@auth/core";
import Google from "@auth/core/providers/google";
import { D1Adapter } from "@auth/d1-adapter";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  AUTH_SECRET?: string;
  AUTH_GOOGLE_ID?: string;
  AUTH_GOOGLE_SECRET?: string;
  PUBLIC_CONTACT_EMAIL?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type ContributionPayload = {
  exponent?: number;
  workUnitId?: string;
  engine?: "cpu" | "gpu";
  elapsedMs?: number;
  candidates?: number;
  factors?: string[];
  cores?: number;
};

const VALIDATION_JOBS: Record<
  number,
  { startK: number; count: number; factors: string[] }
> = {
  23: { startK: 1, count: 32_768, factors: ["47", "178481"] },
  29: {
    startK: 1,
    count: 32_768,
    factors: ["233", "1103", "2089", "256999", "486737"],
  },
  37: { startK: 1, count: 32_768, factors: ["223"] },
  43: { startK: 1, count: 32_768, factors: ["431", "9719", "2099863"] },
};

function authConfigured(env: Env) {
  return Boolean(
    env.DB &&
      env.AUTH_SECRET &&
      env.AUTH_GOOGLE_ID &&
      env.AUTH_GOOGLE_SECRET,
  );
}

function authConfig(env: Env): AuthConfig {
  if (
    !env.AUTH_SECRET ||
    !env.AUTH_GOOGLE_ID ||
    !env.AUTH_GOOGLE_SECRET
  ) {
    throw new Error("Google OAuth environment variables are missing.");
  }

  return {
    adapter: D1Adapter(env.DB),
    basePath: "/api/auth",
    providers: [
      Google({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
      }),
    ],
    secret: env.AUTH_SECRET,
    session: { strategy: "database" },
    trustHost: true,
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
  return session?.user?.email ? session.user : null;
}

function publicHandle(email: string) {
  const value = email
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return value || `mesh-${crypto.randomUUID().slice(0, 8)}`;
}

async function ensureProfile(env: Env, user: SessionUser) {
  const email = user.email!;
  const displayName = user.name || email;
  await env.DB.prepare(
    `INSERT INTO profiles (email, display_name, public_handle)
     VALUES (?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       display_name = excluded.display_name,
       updated_at = CURRENT_TIMESTAMP`,
  )
    .bind(email, displayName, publicHandle(email))
    .run();
}

async function statsFor(env: Env, email: string) {
  const row = await env.DB.prepare(
    `SELECT
       coalesce(sum(cpu_core_milliseconds), 0) AS cpuCoreMilliseconds,
       coalesce(sum(gpu_milliseconds), 0) AS gpuMilliseconds,
       coalesce(sum(candidates), 0) AS candidates,
       coalesce(sum(factor_count), 0) AS factors,
       coalesce(sum(CASE WHEN verified = 1 THEN 1 ELSE 0 END), 0) AS validatedUnits
     FROM contributions
     WHERE user_email = ?`,
  )
    .bind(email)
    .first<Record<string, number>>();

  return {
    cpuCoreMilliseconds: Number(row?.cpuCoreMilliseconds ?? 0),
    gpuMilliseconds: Number(row?.gpuMilliseconds ?? 0),
    candidates: Number(row?.candidates ?? 0),
    factors: Number(row?.factors ?? 0),
    validatedUnits: Number(row?.validatedUnits ?? 0),
  };
}

async function contributionsApi(request: Request, env: Env) {
  if (!env.DB) {
    return Response.json({ error: "D1 binding DB is missing." }, { status: 503 });
  }

  const user = await sessionUser(request, env);
  if (!user?.email) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }
  await ensureProfile(env, user);

  if (request.method === "GET") {
    return Response.json({ stats: await statsFor(env, user.email) });
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

  const exponent = Math.trunc(Number(payload.exponent));
  const job = VALIDATION_JOBS[exponent];
  const elapsedMs = Math.trunc(Number(payload.elapsedMs));
  const candidates = Math.trunc(Number(payload.candidates));
  const cores = Math.max(1, Math.min(256, Math.trunc(Number(payload.cores))));
  const engine = payload.engine === "gpu" ? "gpu" : "cpu";
  const workUnitId = String(payload.workUnitId ?? "").slice(0, 120);
  const receivedFactors = [...new Set((payload.factors ?? []).map(String))].sort();
  const expectedFactors = job?.factors.slice().sort();
  const expectedWorkUnitId = job
    ? `validation-m${exponent}-k${job.startK}-${job.count}`
    : "";

  if (
    !job ||
    workUnitId !== expectedWorkUnitId ||
    !Number.isFinite(elapsedMs) ||
    elapsedMs < 1 ||
    elapsedMs > 3_600_000 ||
    candidates !== 16_384 ||
    JSON.stringify(receivedFactors) !== JSON.stringify(expectedFactors)
  ) {
    return Response.json(
      { error: "The result did not match the assigned validation range." },
      { status: 422 },
    );
  }

  await env.DB.prepare(
    `INSERT INTO contributions (
       user_email, work_unit_id, exponent, engine,
       cpu_core_milliseconds, gpu_milliseconds, candidates,
       factors_json, factor_count, verified
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
     ON CONFLICT(user_email, work_unit_id) DO NOTHING`,
  )
    .bind(
      user.email,
      workUnitId,
      exponent,
      engine,
      engine === "cpu" ? elapsedMs * cores : 0,
      engine === "gpu" ? elapsedMs : 0,
      candidates,
      JSON.stringify(receivedFactors),
      receivedFactors.length,
    )
    .run();

  return Response.json(
    { stats: await statsFor(env, user.email) },
    { status: 201 },
  );
}

async function route(request: Request, env: Env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return Response.json({
      ok: true,
      authConfigured: authConfigured(env),
      databaseBound: Boolean(env.DB),
      network: "validation",
      operatorContact: env.PUBLIC_CONTACT_EMAIL || null,
    });
  }

  if (url.pathname.startsWith("/api/auth")) {
    if (!authConfigured(env)) {
      if (url.pathname === "/api/auth/session") return Response.json(null);
      return Response.json(
        { error: "Google sign-in is not configured." },
        { status: 503 },
      );
    }
    return Auth(request, authConfig(env));
  }

  if (url.pathname === "/api/contributions") {
    return contributionsApi(request, env);
  }

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
      console.error("Mersenne Mesh request failed", error);
      return secure(
        Response.json(
          { error: "The service could not complete this request." },
          { status: 500 },
        ),
      );
    }
  },
};
