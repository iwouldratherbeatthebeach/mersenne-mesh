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

function SiteNav({ user, authReady }: { user: Viewer | null; authReady: boolean }) {
  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href="/" aria-label="Mersenne Mesh home">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Mersenne Mesh</span>
        <span className="alpha-pill">ALPHA</span>
      </a>
      <div className="nav-actions">
        <div className="nav-links"><a href="/about">About</a><a href="/faq">FAQ</a></div>
        <span className="network-status"><i /> Validation network online</span>
        {user ? (
          <div className="account-chip">
            <a className="avatar" href="/account">{user.publicHandle.slice(0, 2).toUpperCase()}</a>
            <span className="account-copy"><strong>{user.publicHandle}</strong><small>Contributor account</small></span>
            <a className="account-link" href="/account">Dashboard</a>
            <button className="account-link" type="button" onClick={() => void signOut()}>Sign out</button>
          </div>
        ) : (
          <a className={`sign-in-button ${!authReady ? "disabled-link" : ""}`} href="/login" aria-disabled={!authReady}>
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
      <span>Open-source validation alpha</span>
    </footer>
  );
}

function InfoShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <><header className="info-hero"><div className="eyebrow"><span>MM</span>{eyebrow}</div><h1>{title}</h1><p>{intro}</p></header><section className="info-content">{children}</section></>
  );
}

function AboutPage() {
  return (
    <InfoShell eyebrow="About the mesh" title="Serious mathematics, with a visible off switch." intro="Mersenne Mesh explores a simple idea: a normal web page can make volunteer computing understandable, reversible, and open to more people.">
      <div className="principle-grid">
        <article><span>01</span><h2>Consent is the first feature</h2><p>Computing never starts automatically. You choose the engine, worker count, and intensity, and you can pause at any time. Closing the tab stops the work.</p></article>
        <article><span>02</span><h2>Credit should survive the session</h2><p>A signed-in contributor receives a durable ledger of validated work. The ledger is keyed to an internal user ID rather than a changeable email address.</p></article>
        <article><span>03</span><h2>Claims need independent proof</h2><p>A browser result is evidence, not a publication. Interesting results must be reproduced with an independent implementation before any discovery claim is made.</p></article>
      </div>
      <div className="prose-card"><span className="panel-kicker">Scientific status</span><h2>This release is a public validation network.</h2><p>Signed-in browsers now receive short-lived work leases from the coordinator. The queue deliberately replays known trial-factor ranges so we can test allocation, browser CPU/WebGPU execution, result validation, accounting, and independent replication without pretending the site is searching an unexplored frontier.</p><p>Mersenne Mesh is independent and is not affiliated with GIMPS. GIMPS remains the established project for production Mersenne-prime work.</p></div>
      <div className="cta-band"><div><span className="panel-kicker">Open by design</span><h2>Inspect it, host it, improve it.</h2></div><a className="sign-in-button" href="/faq">Read the FAQ</a></div>
    </InfoShell>
  );
}

const questions = [
  ["What does the site calculate?", "This alpha performs trial factoring for numbers of the form 2^p − 1. Signed-in contributors receive server-leased slices of known validation ranges. The known answers let the server reject incorrect results before awarding credit."],
  ["Can this version discover a new Mersenne prime?", "Not yet. Trial factoring can rule out composite candidates, but proving a large Mersenne number prime requires a full primality test and independent verification. Production discovery work remains intentionally disabled in this alpha."],
  ["Does it use my computer without permission?", "No. Work begins only after you press Start contributing. You can pause immediately, lower intensity, choose fewer CPU workers, or close the tab."],
  ["Will it use my GPU?", "Only when WebGPU is available and you choose GPU or Automatic. If setup fails, the interface falls back to CPU and tells you."],
  ["What is a CPU core-hour?", "One CPU core working for one hour is one core-hour. Four workers running for 15 minutes are also roughly one core-hour. GPU time is recorded separately because it is not directly comparable."],
  ["Why create an account?", "An account gives the server a stable internal user ID so validated hours and work units follow you across devices. You can use a one-time email link or Google. Your public handle is separate from your email."],
  ["Why is email passwordless?", "Mersenne Mesh sends a single-use sign-in link instead of storing a password database. This reduces the amount of sensitive credential infrastructure the project has to operate while still giving you a non-Google login option."],
  ["Where is my work recorded?", "Accepted work is written to Cloudflare D1. Important authentication, lease, profile, rejection, and contribution events are also written to a D1 audit table and emitted as structured runtime logs."],
  ["Who receives credit if a prime is eventually found?", "The intended policy separates the finder, contributing checkpoints, and independent verifier. The exact discovery policy will be published before unexplored production work begins."],
  ["Is this GIMPS?", "No. Mersenne Mesh is an independent open-source experiment inspired by volunteer computing. It is not affiliated with or endorsed by GIMPS."],
] as const;

function FaqPage() {
  return (
    <InfoShell eyebrow="Questions, answered" title="Know what your machine is doing." intro="Volunteer computing should not require blind trust. Here are the practical and scientific details behind this alpha.">
      <div className="faq-list">{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div>
      <div className="cta-band"><div><span className="panel-kicker">Ready to test it?</span><h2>You control every compute cycle.</h2></div><a className="sign-in-button" href="/">Open the console</a></div>
    </InfoShell>
  );
}

function PrivacyPage({ contact }: { contact: string | null }) {
  return (
    <InfoShell eyebrow="Privacy" title="Your account is for credit—not surveillance." intro="This plain-language notice describes the data this self-hostable alpha uses. The operator of each deployment is responsible for publishing accurate contact and retention details.">
      <div className="prose-card privacy-copy">
        <span className="panel-kicker">Data used</span><h2>What the application stores</h2>
        <p>If you use Google, Google supplies an account identifier, email address, display name, and optional profile image. If you use email sign-in, Auth.js stores a short-lived verification token until you use the link. Auth.js stores the linked account/session records in D1. Mersenne Mesh stores an internal user ID, private email, public handle, validated contribution metrics, work leases, and a limited audit trail of important account/work events.</p>
        <h2>Why it is used</h2><p>The data is used to authenticate you, prevent duplicate credit, preserve contribution totals across devices, investigate invalid submissions, manage work leases, and attribute future discovery-grade work under the published credit policy.</p>
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
      <SiteNav user={user} authReady={Boolean(health?.authConfigured)} />
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
