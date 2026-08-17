import { useEffect, useState, type ReactNode } from "react";
import MeshConsole from "./mesh-console";
import ContributorDashboard from "./dashboard";
import { LoginPage, VerifyRequestPage } from "./auth-pages";
import { signOut } from "./auth-client";
import type { Health, Viewer } from "./types";

type SessionResponse = {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    publicHandle?: string | null;
  };
} | null;

function SiteNav({ user, health }: { user: Viewer | null; health: Health | null }) {
  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href="/" aria-label="Mersenne Mesh home">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Mersenne Mesh</span>
        <span className="alpha-pill">ALPHA</span>
      </a>
      <div className="nav-actions">
        <div className="nav-links"><a href="/about">About</a><a href="/faq">FAQ</a></div>
        <span className="network-status"><i /> {health?.explorationReady ? "Frontier mesh online" : "Validation network online"}</span>
        {user ? (
          <div className="account-chip">
            <a className="avatar" href="/account">{user.publicHandle.slice(0, 2).toUpperCase()}</a>
            <span className="account-copy"><strong>{user.publicHandle}</strong><small>Contributor account</small></span>
            <a className="account-link" href="/account">Dashboard</a>
            <button className="account-link" type="button" onClick={() => void signOut()}>Sign out</button>
          </div>
        ) : (
          <a className={`sign-in-button ${!health?.authConfigured ? "disabled-link" : ""}`} href="/login" aria-disabled={!health?.authConfigured}>
            Log in / Sign up
          </a>
        )}
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer>
      <a className="brand" href="/"><span className="brand-mark"><span /></span><span>Mersenne Mesh</span></a>
      <div className="footer-links"><a href="/about">About</a><a href="/faq">FAQ</a><a href="/privacy">Privacy</a><a href="https://www.mersenne.org/" rel="noreferrer">GIMPS</a></div>
      <span>Open-source exploration alpha</span>
    </footer>
  );
}

function InfoShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <><header className="info-hero"><div className="eyebrow"><span>MM</span>{eyebrow}</div><h1>{title}</h1><p>{intro}</p></header><section className="info-content">{children}</section></>;
}

function AboutPage() {
  return (
    <InfoShell eyebrow="About the mesh" title="Serious mathematics, with a visible off switch." intro="Mersenne Mesh is a browser-native volunteer network for validating compute engines and screening frontier Mersenne trial-factor ranges.">
      <div className="principle-grid">
        <article><span>01</span><h2>Consent is the first feature</h2><p>Computing begins only after you press Start. One click keeps the client active until you pause or close the tab; you choose the engine, CPU workers, and intensity.</p></article>
        <article><span>02</span><h2>Credit should survive the session</h2><p>Authenticated work is attached to an internal user ID and durable D1 ledger so contributions survive refreshes, devices, and authentication-provider changes.</p></article>
        <article><span>03</span><h2>Claims need independent proof</h2><p>Known validation ranges are checked against known factors. A frontier no-factor result remains pending until another contributor independently returns the same result.</p></article>
      </div>
      <div className="prose-card"><span className="panel-kicker">Scientific status</span><h2>Frontier trial factoring is live; record-prime testing is not.</h2><p>The exploration queue uses prime exponents beginning at the first-test floor captured from the GIMPS milestone report on August 16, 2026. The browser currently performs trial factoring only. Finding a valid factor definitively proves a candidate composite, but finding no factor does not prove a Mersenne number prime.</p><p>A production record-prime pipeline still needs PRP/Lucas–Lehmer testing, proof/checkpoint formats, independent implementations, and explicit coordination rules. Mersenne Mesh is independent and is not affiliated with GIMPS; a queued exponent may overlap work being done elsewhere.</p></div>
      <div className="cta-band"><div><span className="panel-kicker">Open by design</span><h2>Inspect it, host it, improve it.</h2></div><a className="sign-in-button" href="/faq">Read the FAQ</a></div>
    </InfoShell>
  );
}

const questions = [
  ["What does the site calculate?", "It performs trial factoring for Mersenne numbers 2^p − 1. The coordinator first serves known-answer validation work, then frontier ranges using CPU BigInt or a WebGPU wide-integer kernel built from 32-bit limbs."],
  ["Can this version discover a new Mersenne prime?", "Not by itself yet. A factor immediately proves a candidate composite, but a no-factor trial-factoring result is only one preprocessing step. A large Mersenne prime requires a full PRP/Lucas–Lehmer primality test and independent confirmation."],
  ["Can frontier work use my GPU?", "Yes. Frontier WebGPU represents candidate factors as two 32-bit limbs and performs modular arithmetic explicitly across those limbs. Automatic mode may fall back to CPU BigInt if WebGPU fails; explicit GPU mode stops instead of silently using CPU."],
  ["Do I have to keep pressing Start?", "No. After one explicit Start click, the page continuously requests the next lease. If the queue is temporarily empty or the coordinator is unavailable, it stays in a waiting state and retries automatically until you pause or close the tab."],
  ["How are frontier results trusted?", "The server verifies every reported factor mathematically. A no-factor range is stored as pending and becomes verified only after an independent contributor returns the same result. Disagreements remain visible in the audit trail."],
  ["Does this duplicate GIMPS work?", "It can. Mersenne Mesh is currently independent and does not reserve assignments from PrimeNet. The initial frontier was chosen using GIMPS public progress data, but individual exponents may be assigned or completed by GIMPS concurrently. Direct coordination is a future integration step."],
  ["What is a CPU core-hour?", "One CPU core working for one hour is one core-hour. Four workers running for 15 minutes are also roughly one core-hour. GPU time is recorded separately because it is not directly comparable."],
  ["Why create an account?", "An account gives the server a stable internal user ID so hours and work units follow you across devices. You can use a one-time email link or Google; your public handle is separate from your email."],
  ["Why is email passwordless?", "Mersenne Mesh sends a single-use sign-in link instead of operating a password database. This reduces sensitive credential infrastructure while still providing a non-Google login option."],
  ["Where is my work recorded?", "Accepted work is written to Cloudflare D1. Authentication, leases, profile changes, rejections, exploration disagreements, and accepted results are also written to a D1 audit table and emitted as structured runtime logs."],
  ["Is this GIMPS?", "No. Mersenne Mesh is an independent open-source experiment inspired by volunteer computing. It is not affiliated with or endorsed by GIMPS."],
] as const;

function FaqPage() {
  return (
    <InfoShell eyebrow="Questions, answered" title="Know what your machine is doing." intro="Volunteer computing should not require blind trust. Here are the practical and scientific details behind the current alpha.">
      <div className="faq-list">{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div>
      <div className="cta-band"><div><span className="panel-kicker">Ready to contribute?</span><h2>One click. Continuous leases. Your off switch.</h2></div><a className="sign-in-button" href="/">Open the console</a></div>
    </InfoShell>
  );
}

function PrivacyPage({ contact }: { contact: string | null }) {
  return (
    <InfoShell eyebrow="Privacy" title="Your account is for credit—not surveillance." intro="This plain-language notice describes the data this self-hostable alpha uses. The operator of each deployment is responsible for publishing accurate contact and retention details.">
      <div className="prose-card privacy-copy">
        <span className="panel-kicker">Data used</span><h2>What the application stores</h2>
        <p>If you use Google, Google supplies an account identifier, email address, display name, and optional profile image. If you use email sign-in, Auth.js stores a short-lived verification token until you use the link. Auth.js stores linked account/session records in D1. Mersenne Mesh stores an internal user ID, private email, public handle, contribution metrics, work leases, pending/verified result state, and a limited audit trail of important account/work events.</p>
        <h2>Why it is used</h2><p>The data is used to authenticate you, prevent duplicate credit, preserve totals across devices, investigate invalid or disagreeing submissions, manage work leases, and attribute mathematically verified results.</p>
        <h2>Passwords</h2><p>This deployment does not store Mersenne Mesh passwords. Email authentication uses a single-use magic link, and Google authentication is handled by Google.</p>
        <h2>Sharing and retention</h2><p>The app does not sell personal data. Google processes Google sign-in, Resend processes email delivery when configured, and Cloudflare hosts the site/database and ordinary infrastructure logs. The deployment operator decides the retention period.</p>
        <h2>Your choices</h2><p>You can still run local validation work without signing in, but only authenticated server-leased work is added to a permanent account. To request account data or deletion, contact {contact ? <a href={`mailto:${contact}`}>{contact}</a> : <strong>the deployment operator</strong>}.</p>
      </div>
    </InfoShell>
  );
}

export default function App() {
  const [user, setUser] = useState<Viewer | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/health", { signal: controller.signal }).then((response) => response.ok ? response.json() as Promise<Health> : null),
      fetch("/api/auth/session", { credentials: "same-origin", signal: controller.signal }).then((response) => response.ok ? response.json() as Promise<SessionResponse> : null),
    ]).then(([healthResult, session]) => {
      if (healthResult) setHealth(healthResult);
      const sessionUser = session?.user;
      if (sessionUser?.id && sessionUser.email && sessionUser.publicHandle) {
        setUser({ id: sessionUser.id, displayName: sessionUser.name || sessionUser.email, email: sessionUser.email, image: sessionUser.image || null, publicHandle: sessionUser.publicHandle });
      }
    }).catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const titles: Record<string, string> = { "/about": "About — Mersenne Mesh", "/faq": "FAQ — Mersenne Mesh", "/privacy": "Privacy — Mersenne Mesh", "/login": "Log in — Mersenne Mesh", "/verify-request": "Check your email — Mersenne Mesh", "/account": "Contributor dashboard — Mersenne Mesh" };
    document.title = titles[path] ?? "Mersenne Mesh";
  }, [path]);

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <SiteNav user={user} health={health} />
      {path === "/about" ? <AboutPage />
        : path === "/faq" ? <FaqPage />
        : path === "/privacy" ? <PrivacyPage contact={health?.operatorContact ?? null} />
        : path === "/login" ? <LoginPage health={health} user={user} />
        : path === "/verify-request" ? <VerifyRequestPage />
        : path === "/account" ? <ContributorDashboard user={user} />
        : <MeshConsole user={user} signInPath="/login" />}
      <SiteFooter />
    </main>
  );
}
