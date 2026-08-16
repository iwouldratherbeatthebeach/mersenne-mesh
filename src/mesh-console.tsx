"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContributionStats, Viewer } from "./types";

type EngineMode = "auto" | "cpu" | "gpu";
type ActiveEngine = "cpu" | "gpu";

type WorkJob = {
  leaseId?: string;
  workUnitId: string;
  exponent: number;
  startK: number;
  count: number;
  expectedCandidates?: number;
  expiresAt?: string;
};

type ContributionResult = {
  leaseId?: string;
  exponent: number;
  workUnitId: string;
  engine: ActiveEngine;
  elapsedMs: number;
  candidates: number;
  factors: string[];
};

type CpuWorkerMessage =
  | { type: "progress"; processed: number; tested: number }
  | { type: "done"; processed: number; tested: number; factors: string[] }
  | { type: "canceled"; processed: number; tested: number; factors: string[] };

type ActivityItem = {
  id: string;
  tone: "lime" | "blue" | "amber";
  title: string;
  detail: string;
  time: string;
};

const EMPTY_STATS: ContributionStats = {
  cpuCoreMilliseconds: 0,
  gpuMilliseconds: 0,
  candidates: 0,
  factors: 0,
  validatedUnits: 0,
};

const GUEST_VALIDATION_JOBS: WorkJob[] = [
  { exponent: 23, startK: 1, count: 32_768, workUnitId: "guest-validation-m23-k1-32768" },
  { exponent: 29, startK: 1, count: 32_768, workUnitId: "guest-validation-m29-k1-32768" },
  { exponent: 37, startK: 1, count: 32_768, workUnitId: "guest-validation-m37-k1-32768" },
  { exponent: 43, startK: 1, count: 32_768, workUnitId: "guest-validation-m43-k1-32768" },
];

const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: "network-ready", tone: "lime", title: "Validation network ready", detail: "Known Mersenne ranges are queued to test this browser.", time: "now" },
  { id: "lease-ready", tone: "blue", title: "Server coordinator online", detail: "Signed-in work is leased, verified, and written to the durable ledger.", time: "policy" },
];

function formatCount(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function formatHours(milliseconds: number) {
  const hours = milliseconds / 3_600_000;
  if (hours < 0.01) return `${Math.round(milliseconds / 1000)}s`;
  return `${hours.toFixed(hours < 10 ? 2 : 1)}h`;
}

function clockTime() {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
}

function trialFactorShader() {
  return /* wgsl */ `
struct Params { exponent: u32, start_k: u32, count: u32, max_hits: u32, }
struct Results { hit_count: atomic<u32>, tested_count: atomic<u32>, factors: array<u32, 64>, }
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read_write> results: Results;
fn add_mod(a: u32, b: u32, modulus: u32) -> u32 {
  if (a >= modulus - b) { return a - (modulus - b); }
  return a + b;
}
fn mul_mod(left: u32, right: u32, modulus: u32) -> u32 {
  var a = left % modulus; var b = right; var result = 0u;
  loop {
    if (b == 0u) { break; }
    if ((b & 1u) == 1u) { result = add_mod(result, a, modulus); }
    b = b >> 1u;
    if (b != 0u) { a = add_mod(a, a, modulus); }
  }
  return result;
}
fn pow_mod(base: u32, exponent: u32, modulus: u32) -> u32 {
  var value = base % modulus; var power = exponent; var result = 1u;
  loop {
    if (power == 0u) { break; }
    if ((power & 1u) == 1u) { result = mul_mod(result, value, modulus); }
    power = power >> 1u;
    if (power != 0u) { value = mul_mod(value, value, modulus); }
  }
  return result;
}
@compute @workgroup_size(128)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= params.count) { return; }
  let k = params.start_k + id.x;
  let q = 2u * k * params.exponent + 1u;
  let residue8 = q & 7u;
  if (q <= 1u || (residue8 != 1u && residue8 != 7u)) { return; }
  atomicAdd(&results.tested_count, 1u);
  if (pow_mod(2u, params.exponent, q) == 1u) {
    let slot = atomicAdd(&results.hit_count, 1u);
    if (slot < params.max_hits) { results.factors[slot] = q; }
  }
}`;
}

async function runGpuJob(job: WorkJob) {
  if (!navigator.gpu) throw new Error("WebGPU is unavailable");
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
  if (!adapter) throw new Error("No compatible GPU adapter was found");
  const device = await adapter.requestDevice();
  const params = new Uint32Array([job.exponent, job.startK, job.count, 64]);
  const resultByteLength = 8 + 64 * Uint32Array.BYTES_PER_ELEMENT;
  const paramsBuffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const resultBuffer = device.createBuffer({ size: resultByteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
  const readBuffer = device.createBuffer({ size: resultByteLength, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
  device.queue.writeBuffer(paramsBuffer, 0, params);
  device.queue.writeBuffer(resultBuffer, 0, new Uint32Array(resultByteLength / 4));
  const shaderModule = device.createShaderModule({ code: trialFactorShader() });
  const pipeline = await device.createComputePipelineAsync({ layout: "auto", compute: { module: shaderModule, entryPoint: "main" } });
  const bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: paramsBuffer } }, { binding: 1, resource: { buffer: resultBuffer } }] });
  const startedAt = performance.now();
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline); pass.setBindGroup(0, bindGroup); pass.dispatchWorkgroups(Math.ceil(job.count / 128)); pass.end();
  encoder.copyBufferToBuffer(resultBuffer, 0, readBuffer, 0, resultByteLength);
  device.queue.submit([encoder.finish()]);
  await readBuffer.mapAsync(GPUMapMode.READ);
  const values = new Uint32Array(readBuffer.getMappedRange().slice(0));
  const hitCount = Math.min(values[0], 64);
  const tested = values[1];
  const factors = Array.from(values.slice(2, 2 + hitCount)).map(String);
  readBuffer.unmap(); paramsBuffer.destroy(); resultBuffer.destroy(); readBuffer.destroy();
  return { elapsedMs: performance.now() - startedAt, candidates: tested, factors };
}

function runCpuJob(job: WorkJob, cores: number, workerPool: React.MutableRefObject<Worker[]>) {
  const startedAt = performance.now();
  const workerCount = Math.max(1, Math.min(cores, job.count));
  const baseSize = Math.floor(job.count / workerCount);
  let remainder = job.count % workerCount;
  let offset = job.startK;
  return new Promise<{ elapsedMs: number; candidates: number; factors: string[]; canceled: boolean }>((resolve) => {
    const summaries: Array<{ tested: number; factors: string[]; canceled: boolean }> = [];
    const finish = () => {
      if (summaries.length !== workerCount) return;
      workerPool.current.forEach((worker) => worker.terminate());
      workerPool.current = [];
      resolve({ elapsedMs: performance.now() - startedAt, candidates: summaries.reduce((sum, value) => sum + value.tested, 0), factors: [...new Set(summaries.flatMap((value) => value.factors))], canceled: summaries.some((value) => value.canceled) });
    };
    for (let index = 0; index < workerCount; index += 1) {
      const count = baseSize + (remainder > 0 ? 1 : 0);
      remainder -= remainder > 0 ? 1 : 0;
      const worker = new Worker("/mesh-worker.js");
      workerPool.current.push(worker);
      worker.onmessage = (event: MessageEvent<CpuWorkerMessage>) => {
        if (event.data.type === "done" || event.data.type === "canceled") {
          summaries.push({ tested: event.data.tested, factors: event.data.factors, canceled: event.data.type === "canceled" });
          finish();
        }
      };
      worker.onerror = () => { summaries.push({ tested: 0, factors: [], canceled: true }); finish(); };
      worker.postMessage({ type: "start", exponent: job.exponent, startK: offset, count });
      offset += count;
    }
  });
}

async function requestLease(engine: ActiveEngine) {
  const response = await fetch("/api/work/lease", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ engine }),
  });
  const body = (await response.json()) as { job?: WorkJob | null; error?: string; message?: string };
  if (!response.ok) throw new Error(body.error || "Unable to lease work from the coordinator.");
  return body.job ?? null;
}

export default function MeshConsole({ user, signInPath }: { user: Viewer | null; signInPath: string }) {
  const [mode, setMode] = useState<EngineMode>("auto");
  const [cores, setCores] = useState(1);
  const [intensity, setIntensity] = useState(75);
  const [availableCores, setAvailableCores] = useState(1);
  const [webGpuAvailable, setWebGpuAvailable] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeEngine, setActiveEngine] = useState<ActiveEngine | null>(null);
  const [currentExponent, setCurrentExponent] = useState(23);
  const [currentRangeCount, setCurrentRangeCount] = useState(32_768);
  const [progress, setProgress] = useState(0);
  const [sessionStats, setSessionStats] = useState<ContributionStats>(EMPTY_STATS);
  const [accountStats, setAccountStats] = useState<ContributionStats>(EMPTY_STATS);
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [statusMessage, setStatusMessage] = useState("Ready to validate the compute engine");
  const runningRef = useRef(false);
  const workersRef = useRef<Worker[]>([]);
  const jobIndexRef = useRef(0);

  const displayStats = user ? accountStats : sessionStats;
  const publicHandle = useMemo(() => user?.publicHandle ?? "guest-contributor", [user]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const detected = Math.max(1, navigator.hardwareConcurrency || 1);
      setAvailableCores(detected);
      setCores(Math.max(1, Math.min(4, detected - 1 || 1)));
      setWebGpuAvailable(Boolean(navigator.gpu));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/contributions", { credentials: "same-origin" })
      .then((response) => response.ok ? response.json().then((value) => value as { stats?: ContributionStats }) : null)
      .then((data) => { if (data?.stats) setAccountStats(data.stats); })
      .catch(() => undefined);
  }, [user]);

  useEffect(() => {
    const running = runningRef; const workerPool = workersRef;
    return () => { running.current = false; workerPool.current.forEach((worker) => worker.postMessage({ type: "cancel" })); };
  }, []);

  function addActivity(item: Omit<ActivityItem, "id" | "time">) {
    setActivity((current) => [{ ...item, id: `${Date.now()}-${Math.random()}`, time: clockTime() }, ...current].slice(0, 5));
  }

  function addLocalResult(result: ContributionResult, coreCount: number) {
    setSessionStats((current) => ({
      cpuCoreMilliseconds: current.cpuCoreMilliseconds + (result.engine === "cpu" ? result.elapsedMs * coreCount : 0),
      gpuMilliseconds: current.gpuMilliseconds + (result.engine === "gpu" ? result.elapsedMs : 0),
      candidates: current.candidates + result.candidates,
      factors: current.factors + result.factors.length,
      validatedUnits: current.validatedUnits + 1,
    }));
  }

  async function recordResult(result: ContributionResult, coreCount: number) {
    addLocalResult(result, coreCount);
    if (!user) return true;
    try {
      const response = await fetch("/api/contributions", {
        method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...result, cores: coreCount }),
      });
      const data = (await response.json()) as { stats?: ContributionStats; error?: string };
      if (!response.ok) throw new Error(data.error || "The server rejected this result.");
      if (data.stats) setAccountStats(data.stats);
      return true;
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Work completed but account sync failed");
      return false;
    }
  }

  function selectedEngine(): ActiveEngine {
    if (mode === "gpu" && webGpuAvailable) return "gpu";
    if (mode === "auto" && webGpuAvailable) return "gpu";
    return "cpu";
  }

  async function nextJob(engine: ActiveEngine) {
    if (user) return requestLease(engine);
    const job = GUEST_VALIDATION_JOBS[jobIndexRef.current % GUEST_VALIDATION_JOBS.length];
    jobIndexRef.current += 1;
    return job;
  }

  async function startContributing() {
    if (runningRef.current) return;
    runningRef.current = true; setIsRunning(true); setStatusMessage(user ? "Requesting a server lease…" : "Starting local validation…");

    while (runningRef.current) {
      const engine = selectedEngine();
      setActiveEngine(engine);
      let job: WorkJob | null;
      try {
        job = await nextJob(engine);
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Unable to obtain work");
        runningRef.current = false;
        break;
      }
      if (!job) {
        setStatusMessage("No new validation units are available for this account right now.");
        addActivity({ tone: "blue", title: "Validation queue complete", detail: "You have completed the currently published validation units." });
        runningRef.current = false;
        break;
      }

      setCurrentExponent(job.exponent); setCurrentRangeCount(job.count); setProgress(8);
      setStatusMessage(`${engine.toUpperCase()} screening M${job.exponent} · ${formatCount(job.count)} k-values`);

      try {
        const outcome = engine === "gpu" ? { ...(await runGpuJob(job)), canceled: false } : await runCpuJob(job, cores, workersRef);
        if (outcome.canceled || !runningRef.current) break;
        setProgress(100);
        const result: ContributionResult = {
          leaseId: job.leaseId,
          exponent: job.exponent,
          workUnitId: job.workUnitId,
          engine,
          elapsedMs: Math.max(1, Math.round(outcome.elapsedMs)),
          candidates: outcome.candidates,
          factors: outcome.factors.sort((a, b) => Number(a) - Number(b)),
        };
        const accepted = await recordResult(result, cores);
        if (!accepted && user) {
          runningRef.current = false;
          addActivity({ tone: "amber", title: "Server validation rejected a unit", detail: "Contribution paused so the same mismatch is not repeated." });
          break;
        }

        addActivity({
          tone: result.factors.length ? "amber" : "lime",
          title: result.factors.length ? `M${job.exponent} factors confirmed` : `M${job.exponent} range validated`,
          detail: result.factors.length ? result.factors.map((factor) => `q = ${factor}`).join(" · ") : `${formatCount(result.candidates)} candidates cleared`,
        });
        setStatusMessage(`${formatCount(result.candidates)} candidates validated on ${engine.toUpperCase()}${user ? " · ledger saved" : " · local only"}`);
        const idleMs = Math.round((100 - intensity) * 12);
        if (idleMs > 0) await new Promise((resolve) => setTimeout(resolve, idleMs));
        setProgress(0);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Compute engine error";
        if (engine === "gpu") {
          setWebGpuAvailable(false); setMode("cpu"); setStatusMessage(`GPU unavailable (${message}); switched to CPU`);
          addActivity({ tone: "blue", title: "Automatic CPU fallback", detail: "The existing lease remains valid; the range will retry on CPU." });
          continue;
        }
        setStatusMessage(message); runningRef.current = false;
      }
    }

    setActiveEngine(null); setIsRunning(false); setProgress(0);
    if (!runningRef.current && !statusMessage.startsWith("No new")) {
      // Preserve a more useful terminal status if one was already set above.
    }
  }

  function pauseContributing() {
    runningRef.current = false;
    workersRef.current.forEach((worker) => worker.postMessage({ type: "cancel" }));
    setStatusMessage("Pausing after the current compute slice…");
  }

  return (
    <div className="mesh-content">
      <section className="hero" id="top">
        <div className="eyebrow"><span>01</span> Open distributed mathematics</div>
        <h1>Put spare compute<br /><em>toward discovery.</em></h1>
        <p>A browser-native volunteer network for screening Mersenne numbers. Start instantly, stay in control, and keep permanent credit for every server-validated calculation.</p>
        <div className="hero-metrics" aria-label="Prototype capabilities"><div><strong>CPU</strong><span>Web workers</span></div><div><strong>GPU</strong><span>WebGPU compute</span></div><div><strong>Lease</strong><span>Server coordination</span></div></div>
      </section>

      <section className="console-grid" aria-label="Contribution console">
        <article className="compute-panel panel">
          <header className="panel-header"><div><span className="panel-kicker">Compute console</span><h2>{isRunning ? "Contributing now" : "Ready when you are"}</h2></div><div className={`pulse-orbit ${isRunning ? "active" : ""}`} aria-hidden="true"><span>M{currentExponent}</span></div></header>
          <div className="engine-tabs" role="group" aria-label="Compute engine">
            {(["auto", "cpu", "gpu"] as EngineMode[]).map((engine) => <button key={engine} className={mode === engine ? "selected" : ""} onClick={() => setMode(engine)} disabled={isRunning || (engine === "gpu" && !webGpuAvailable)}>{engine === "auto" ? "Automatic" : engine.toUpperCase()}{engine === "gpu" && !webGpuAvailable && <small>Unavailable</small>}</button>)}
          </div>
          <div className="capability-row"><span><i className="good" /> Worker engine ready</span><span><i className={webGpuAvailable ? "good" : "muted"} /> {webGpuAvailable ? "WebGPU detected" : "CPU fallback"}</span><span><i className="good" /> {user ? "Server leases enabled" : "Local validation"}</span></div>
          <div className="control-stack">
            <label><span><b>CPU workers</b><output>{cores} of {availableCores}</output></span><input type="range" min="1" max={availableCores} value={cores} disabled={isRunning} onChange={(event) => setCores(Number(event.target.value))} style={{ "--range-progress": `${((cores - 1) / Math.max(1, availableCores - 1)) * 100}%` } as React.CSSProperties} /></label>
            <label><span><b>Compute intensity</b><output>{intensity}%</output></span><input type="range" min="25" max="100" step="5" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} style={{ "--range-progress": `${intensity}%` } as React.CSSProperties} /></label>
          </div>
          <div className="work-card">
            <div className="work-card-top"><span>Current assignment</span><b>{activeEngine ? activeEngine.toUpperCase() : selectedEngine().toUpperCase()}</b></div>
            <div className="assignment-number">2<sup>{currentExponent}</sup> − 1</div>
            <div className="assignment-meta"><span>Trial factoring</span><span>{user ? "Server-leased validation" : "Local validation"}</span><span>{formatCount(currentRangeCount)} k-values</span></div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div><p>{statusMessage}</p>
          </div>
          <button className={`compute-button ${isRunning ? "stop" : ""}`} onClick={isRunning ? pauseContributing : startContributing}><span className="button-icon" aria-hidden="true">{isRunning ? "Ⅱ" : "▶"}</span>{isRunning ? "Pause contribution" : "Start contributing"}</button>
          <p className="consent-note">Nothing starts without your click. Signed-in work is leased for 30 minutes and credited only after server validation.</p>
        </article>

        <aside className="dashboard-column">
          <article className="identity-card panel">
            <div className="identity-top"><div><span className="panel-kicker">Your contribution</span><h2>{user ? publicHandle : "This session"}</h2></div><span className={user ? "saved-badge" : "local-badge"}>{user ? "Saved" : "Local only"}</span></div>
            <div className="stats-grid"><div><span>CPU core-hours</span><strong>{formatHours(displayStats.cpuCoreMilliseconds)}</strong></div><div><span>GPU time</span><strong>{formatHours(displayStats.gpuMilliseconds)}</strong></div><div><span>Candidates</span><strong>{formatCount(displayStats.candidates)}</strong></div><div><span>Validated units</span><strong>{displayStats.validatedUnits}</strong></div></div>
            <div className="factor-strip"><span className="factor-icon">ƒ</span><div><strong>{displayStats.factors} factors confirmed</strong><small>Discovery-grade results will appear here</small></div><span className="arrow">↗</span></div>
            {!user && <a className="account-callout" href={signInPath}>Log in / sign up to receive server leases and preserve your hours →</a>}
            {user && <a className="account-callout" href="/account">Open your contributor dashboard and audit ledger →</a>}
          </article>
          <article className="activity-card panel"><header><div><span className="panel-kicker">Live ledger</span><h2>Recent activity</h2></div><span className="live-label"><i /> LIVE</span></header><ol>{activity.map((item) => <li key={item.id}><i className={item.tone} /><div><strong>{item.title}</strong><span>{item.detail}</span></div><time>{item.time}</time></li>)}</ol></article>
        </aside>
      </section>

      <section className="credit-section">
        <div className="section-heading"><div className="eyebrow"><span>02</span> Credit that lasts</div><h2>A discovery is more<br />than the final click.</h2></div>
        <div className="credit-steps"><article><span>01</span><div><b>Finder</b><p>When discovery search launches, the first valid prime result will receive primary credit.</p></div></article><article><span>02</span><div><b>Contributors</b><p>Every validated checkpoint remains attached to the contributor identity that produced it.</p></div></article><article><span>03</span><div><b>Verifier</b><p>An independent calculation confirms the result before it enters the permanent public record.</p></div></article></div>
      </section>
    </div>
  );
}
