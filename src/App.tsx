import { useEffect, useState, type ReactNode } from "react";
import MeshConsole from "./mesh-console";
import type { Health, Viewer } from "./types";

type SessionResponse = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
} | null;

async function submitAuthAction(action: "signin" | "signout") {
  const csrfResponse = await fetch("/api/auth/csrf", {
    credentials: "same-origin",
  });
  if (!csrfResponse.ok) throw new Error("Google sign-in is not configured.");
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const form = document.createElement("form");
  form.method = "post";
  form.action =
    action === "signin"
      ? "/api/auth/signin/google"
      : "/api/auth/signout";

  for (const [name, value] of Object.entries({
    csrfToken,
    callbackUrl: `${window.location.origin}/`,
  })) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

function handleFor(email: string) {
  return email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "-");
}

function SiteNav({
  user,
  authReady,
}: {
  user: Viewer | null;
  authReady: boolean;
}) {
  const handle = user ? handleFor(user.email) : null;

  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href="/" aria-label="Mersenne Mesh home">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Mersenne Mesh</span>
        <span className="alpha-pill">ALPHA</span>
      </a>
      <div className="nav-actions">
        <div className="nav-links">
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
        </div>
        <span className="network-status"><i /> Validation network online</span>
        {user && handle ? (
          <div className="account-chip">
            <span className="avatar">{handle.slice(0, 2).toUpperCase()}</span>
            <span className="account-copy">
              <strong>{handle}</strong>
              <small>Google account</small>
            </span>
            <button
              className="account-link"
              type="button"
              onClick={() => void submitAuthAction("signout")}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            className="sign-in-button google-button"
            type="button"
            disabled={!authReady}
            title={
              authReady
                ? "Sign in and save your contribution credit"
                : "Add Google OAuth variables in Cloudflare to enable sign-in"
            }
            onClick={() => void submitAuthAction("signin")}
          >
            <span aria-hidden="true">G</span>
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer>
      <a className="brand" href="/">
        <span className="brand-mark"><span /></span>
        <span>Mersenne Mesh</span>
      </a>
      <div className="footer-links">
        <a href="/about">About</a>
        <a href="/faq">FAQ</a>
        <a href="/privacy">Privacy</a>
        <a href="https://www.mersenne.org/" rel="noreferrer">GIMPS</a>
      </div>
      <span>Open-source validation alpha</span>
    </footer>
  );
}

function InfoShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="info-hero">
        <div className="eyebrow"><span>MM</span>{eyebrow}</div>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <section className="info-content">{children}</section>
    </>
  );
}

function AboutPage() {
  return (
    <InfoShell
      eyebrow="About the mesh"
      title="Serious mathematics, with a visible off switch."
      intro="Mersenne Mesh explores a simple idea: a normal web page can make volunteer computing understandable, reversible, and open to more people."
    >
      <div className="principle-grid">
        <article>
          <span>01</span>
          <h2>Consent is the first feature</h2>
          <p>Computing never starts automatically. You choose the engine, worker count, and intensity, and you can pause at any time. Closing the tab stops the work.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Credit should survive the session</h2>
          <p>A signed-in contributor receives a durable ledger of validated work. If this project later reaches discovery-grade searches, primary and verification credit will be recorded separately.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Claims need independent proof</h2>
          <p>A browser result is evidence, not a publication. Interesting results must be reproduced with an independent implementation before any discovery claim is made.</p>
        </article>
      </div>
      <div className="prose-card">
        <span className="panel-kicker">Scientific status</span>
        <h2>This release is a public validation network.</h2>
        <p>The current jobs replay known trial-factor ranges. That lets us test browser CPU and experimental WebGPU implementations against known answers without pretending the site is already searching an unexplored frontier. The next research milestone is a coordinator that leases unique ranges and reconciles them with existing searches.</p>
        <p>Mersenne Mesh is independent and is not affiliated with GIMPS. GIMPS remains the established project for production Mersenne-prime work.</p>
      </div>
      <div className="cta-band">
        <div><span className="panel-kicker">Open by design</span><h2>Inspect it, host it, improve it.</h2></div>
        <a className="sign-in-button" href="/faq">Read the FAQ</a>
      </div>
    </InfoShell>
  );
}

const questions = [
  ["What does the site calculate?", "This alpha performs trial factoring for numbers of the form 2^p − 1. It tests whether candidates q = 2kp + 1 divide a selected Mersenne number. The current queue uses known ranges so the implementation can be checked against known factors."],
  ["Can this version discover a new Mersenne prime?", "Not yet. Trial factoring can rule out composite candidates, but proving a large Mersenne number prime requires a full primality test and independent verification. The interface reserves attribution fields for that future workflow; it does not claim discovery capability today."],
  ["Does it use my computer without permission?", "No. Work begins only after you press Start contributing. You can pause immediately, lower intensity, choose fewer CPU workers, or close the tab. There is no background service after the page closes."],
  ["Will it use my GPU?", "Only when WebGPU is available and you choose GPU or Automatic. The current GPU kernel is experimental and limited to candidate values that fit its integer path. If setup fails, the interface falls back to CPU and tells you."],
  ["Why does my laptop get warm?", "Sustained arithmetic uses electricity and produces heat. Start with fewer workers and 25–50% intensity on laptops or battery power. Stop if the device becomes uncomfortable or its fans remain louder than you want."],
  ["What is a CPU core-hour?", "One CPU core working for one hour is one core-hour. Four workers running for 15 minutes are also roughly one core-hour. GPU time is recorded separately because it is not directly comparable."],
  ["Why sign in with Google?", "Google sign-in gives the server a stable account identity so validated hours can follow you across devices. The application stores your Google account identifier, email, display name, optional profile image, session records, and contribution totals. It never receives your Google password."],
  ["Who receives credit if a prime is eventually found?", "The intended policy separates the finder, contributing checkpoints, and independent verifier. The exact discovery policy will be published before unexplored production work begins, so participants can decide whether they agree before donating compute."],
  ["Is this GIMPS?", "No. Mersenne Mesh is an independent open-source experiment inspired by volunteer computing. It is not affiliated with or endorsed by GIMPS. For established production searches, use the official GIMPS software and servers."],
  ["Can I host my own copy?", "Yes. This repository includes a Cloudflare deployment guide, D1 migration, environment template, and Google OAuth checklist. Keep your OAuth secret out of Git and change the project name and callback URLs for your domain."],
] as const;

function FaqPage() {
  return (
    <InfoShell
      eyebrow="Questions, answered"
      title="Know what your machine is doing."
      intro="Volunteer computing should not require blind trust. Here are the practical and scientific details behind this alpha."
    >
      <div className="faq-list">
        {questions.map(([question, answer], index) => (
          <details key={question} open={index === 0}>
            <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true">+</i></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <div className="cta-band">
        <div><span className="panel-kicker">Ready to test it?</span><h2>You control every compute cycle.</h2></div>
        <a className="sign-in-button" href="/">Open the console</a>
      </div>
    </InfoShell>
  );
}

function PrivacyPage({ contact }: { contact: string | null }) {
  return (
    <InfoShell
      eyebrow="Privacy"
      title="Your account is for credit—not surveillance."
      intro="This plain-language notice describes the data this self-hostable alpha uses. The operator of each deployment is responsible for publishing accurate contact and retention details."
    >
      <div className="prose-card privacy-copy">
        <span className="panel-kicker">Data used</span>
        <h2>What the application stores</h2>
        <p>When you sign in, Google supplies an account identifier, email address, display name, and optional profile image. Auth.js stores the linked account and a server-side session. Mersenne Mesh stores your public handle and validated contribution metrics: work-unit identifier, exponent, engine, elapsed compute time, candidate count, returned factors, and verification status.</p>
        <h2>Why it is used</h2>
        <p>The data is used to authenticate you, prevent duplicate credit, preserve your contribution totals across devices, investigate invalid submissions, and attribute future discovery-grade work under the published credit policy.</p>
        <h2>Sharing and retention</h2>
        <p>The app does not sell personal data. Google processes the sign-in flow and Cloudflare hosts the site, database, and ordinary infrastructure logs under their respective terms. The deployment operator decides the retention period and is responsible for responding to access or deletion requests.</p>
        <h2>Your choices</h2>
        <p>You can compute without signing in; those totals stay in the current browser session and are not added to an account. You can sign out at any time. To request account data or deletion, contact the operator at {contact ? <a href={`mailto:${contact}`}>{contact}</a> : <strong> the support address published on this deployment’s Google consent screen</strong>}.</p>
        <h2>Before public launch</h2>
        <p>If you host this repository, review this notice for your jurisdiction, set PUBLIC_CONTACT_EMAIL, publish your retention period, and make sure the links and statements match your actual deployment.</p>
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
      fetch("/api/health", { signal: controller.signal }).then((response) =>
        response.ok ? (response.json() as Promise<Health>) : null,
      ),
      fetch("/api/auth/session", {
        credentials: "same-origin",
        signal: controller.signal,
      }).then((response) =>
        response.ok ? (response.json() as Promise<SessionResponse>) : null,
      ),
    ])
      .then(([healthResult, session]) => {
        if (healthResult) setHealth(healthResult);
        const sessionUser = session?.user;
        if (sessionUser?.email) {
          setUser({
            displayName: sessionUser.name || sessionUser.email,
            email: sessionUser.email,
            image: sessionUser.image || null,
          });
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title =
      path === "/about"
        ? "About — Mersenne Mesh"
        : path === "/faq"
          ? "FAQ — Mersenne Mesh"
          : path === "/privacy"
            ? "Privacy — Mersenne Mesh"
          : "Mersenne Mesh";
  }, [path]);

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <SiteNav user={user} authReady={Boolean(health?.authConfigured)} />
      {path === "/about" ? (
        <AboutPage />
      ) : path === "/faq" ? (
        <FaqPage />
      ) : path === "/privacy" ? (
        <PrivacyPage contact={health?.operatorContact ?? null} />
      ) : (
        <MeshConsole user={user} signInPath="/api/auth/signin" />
      )}
      <SiteFooter />
    </main>
  );
}
