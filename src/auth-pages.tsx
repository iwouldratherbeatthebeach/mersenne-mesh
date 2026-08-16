import { useMemo, useState } from "react";
import { submitAuthProvider } from "./auth-client";
import type { Health, Viewer } from "./types";

type AuthMode = "login" | "signup";

export function LoginPage({ health, user }: { health: Health | null; user: Viewer | null }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const error = useMemo(() => new URLSearchParams(window.location.search).get("error"), []);

  if (user) {
    return (
      <section className="auth-shell compact-auth-shell">
        <div className="auth-card">
          <span className="panel-kicker">Already signed in</span>
          <h1>Welcome back, {user.publicHandle}.</h1>
          <p>Your contribution identity is active on this browser.</p>
          <a className="auth-primary-link" href="/account">Open contributor dashboard</a>
        </div>
      </section>
    );
  }

  async function emailAction(event: React.FormEvent) {
    event.preventDefault();
    if (!health?.emailConfigured) return;
    setBusy(true);
    setMessage(null);
    try {
      await submitAuthProvider("resend", {
        email: email.trim(),
        callbackUrl: `${window.location.origin}/account`,
      });
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Unable to start email sign-in.");
      setBusy(false);
    }
  }

  async function googleAction() {
    if (!health?.googleConfigured) return;
    setBusy(true);
    setMessage(null);
    try {
      await submitAuthProvider("google", {
        callbackUrl: `${window.location.origin}/account`,
      });
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Unable to start Google sign-in.");
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand-lockup">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <div><span className="panel-kicker">Contributor identity</span><h1>{mode === "login" ? "Welcome back." : "Join the mesh."}</h1></div>
        </div>
        <p className="auth-intro">
          {mode === "login"
            ? "Sign in to keep your CPU/GPU credit, validated work, and contributor handle across devices."
            : "Create a contributor identity. Your first verified email link creates the account automatically."}
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Account action">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">Log in</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">Sign up</button>
        </div>

        {error && <div className="auth-error">Sign-in could not be completed. Try another method or retry the same account.</div>}
        {message && <div className="auth-error">{message}</div>}

        <form className="auth-form" onSubmit={emailAction}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={!health?.emailConfigured || busy}
          />
          <button className="auth-submit" disabled={!health?.emailConfigured || busy} type="submit">
            {mode === "login" ? "Email me a login link" : "Create account by email"}
          </button>
          {!health?.emailConfigured && (
            <small>Email login will appear after AUTH_RESEND_KEY and AUTH_EMAIL_FROM are configured in Cloudflare.</small>
          )}
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button
          type="button"
          className="auth-google"
          onClick={() => void googleAction()}
          disabled={!health?.googleConfigured || busy}
        >
          <span aria-hidden="true">G</span>
          Continue with Google
        </button>
        {!health?.googleConfigured && (
          <small className="auth-provider-note">Google will appear after the OAuth client ID and secret are configured.</small>
        )}

        <p className="auth-fineprint">
          We use a one-time email link instead of storing a password. Google is optional. Both methods resolve to the same contributor identity when they use the same verified email address.
        </p>
      </div>
    </section>
  );
}

export function VerifyRequestPage() {
  return (
    <section className="auth-shell compact-auth-shell">
      <div className="auth-card">
        <span className="panel-kicker">Check your inbox</span>
        <h1>Your sign-in link is on the way.</h1>
        <p>Open the email from Mersenne Mesh and use the verification link. The link is single-use and returns you to your contributor dashboard.</p>
        <a className="auth-primary-link" href="/">Back to Mersenne Mesh</a>
      </div>
    </section>
  );
}
