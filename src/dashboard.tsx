import { useEffect, useMemo, useState } from "react";
import type { ContributionStats, Viewer } from "./types";

type RecentContribution = {
  workUnitId: string;
  exponent: number;
  engine: "cpu" | "gpu";
  cpuCoreMilliseconds: number;
  gpuMilliseconds: number;
  candidates: number;
  factorCount: number;
  createdAt: string;
};

type RecentEvent = {
  event: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

type AccountResponse = {
  user: Viewer;
  profile: {
    email: string;
    displayName: string;
    publicHandle: string;
    createdAt: string;
  } | null;
  stats: ContributionStats;
  rank: number;
  contributors: number;
  recentContributions: RecentContribution[];
  recentEvents: RecentEvent[];
};

function formatHours(milliseconds: number) {
  const hours = milliseconds / 3_600_000;
  if (hours < 0.01) return `${Math.round(milliseconds / 1000)}s`;
  return `${hours.toFixed(hours < 10 ? 2 : 1)}h`;
}

function formatCount(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function achievementLabels(stats: ContributionStats) {
  const labels = ["Mesh member"];
  if (stats.validatedUnits >= 1) labels.push("First proof");
  if (stats.validatedUnits >= 10) labels.push("Validator ×10");
  if (stats.validatedUnits >= 25) labels.push("Range runner");
  if (stats.cpuCoreMilliseconds >= 3_600_000) labels.push("One core-hour");
  if (stats.gpuMilliseconds >= 60_000) labels.push("GPU minute");
  if (stats.factors >= 1) labels.push("Factor finder");
  return labels;
}

export default function ContributorDashboard({ user }: { user: Viewer | null }) {
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [handle, setHandle] = useState(user?.publicHandle ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/account", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load contributor account.");
        return (await response.json()) as AccountResponse;
      })
      .then((value) => {
        setAccount(value);
        setHandle(value.user.publicHandle);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Unable to load account."));
  }, [user]);

  const achievements = useMemo(
    () => achievementLabels(account?.stats ?? { cpuCoreMilliseconds: 0, gpuMilliseconds: 0, candidates: 0, factors: 0, validatedUnits: 0 }),
    [account],
  );

  if (!user) {
    return (
      <section className="account-page empty-account">
        <div className="account-hero panel">
          <span className="panel-kicker">Contributor dashboard</span>
          <h1>Sign in to open your permanent ledger.</h1>
          <p>Your validated CPU/GPU work is attached to an account only after authentication.</p>
          <a className="auth-primary-link" href="/login">Log in / Sign up</a>
        </div>
      </section>
    );
  }

  async function saveHandle(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ publicHandle: handle }),
      });
      const body = (await response.json()) as AccountResponse & { error?: string };
      if (!response.ok) throw new Error(body.error || "Unable to update handle.");
      setAccount(body);
      setHandle(body.user.publicHandle);
      setStatus("Contributor handle saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to update handle.");
    } finally {
      setSaving(false);
    }
  }

  if (!account) {
    return (
      <section className="account-page empty-account">
        <div className="account-hero panel"><span className="panel-kicker">Contributor dashboard</span><h1>Loading your ledger…</h1><p>{status ?? "Reading your profile and validated work from D1."}</p></div>
      </section>
    );
  }

  return (
    <section className="account-page">
      <header className="account-hero panel">
        <div>
          <span className="panel-kicker">Contributor dashboard</span>
          <h1>{account.user.publicHandle}</h1>
          <p>{account.user.displayName} · member since {new Date(account.profile?.createdAt ?? Date.now()).toLocaleDateString()}</p>
        </div>
        <div className="rank-chip"><span>Validation rank</span><strong>#{account.rank}</strong><small>of {account.contributors} contributors</small></div>
      </header>

      <div className="account-stat-grid">
        <article className="panel"><span>CPU core-hours</span><strong>{formatHours(account.stats.cpuCoreMilliseconds)}</strong></article>
        <article className="panel"><span>GPU time</span><strong>{formatHours(account.stats.gpuMilliseconds)}</strong></article>
        <article className="panel"><span>Candidates screened</span><strong>{formatCount(account.stats.candidates)}</strong></article>
        <article className="panel"><span>Validated units</span><strong>{account.stats.validatedUnits}</strong></article>
        <article className="panel"><span>Factors confirmed</span><strong>{account.stats.factors}</strong></article>
      </div>

      <div className="account-columns">
        <article className="panel account-settings">
          <span className="panel-kicker">Identity</span>
          <h2>Public contributor handle</h2>
          <form onSubmit={saveHandle}>
            <input value={handle} minLength={3} maxLength={32} pattern="[a-zA-Z0-9_-]+" onChange={(event) => setHandle(event.target.value)} />
            <button disabled={saving} type="submit">{saving ? "Saving…" : "Save handle"}</button>
          </form>
          <small>Your email remains private. Public leaderboards and future discovery attribution should use this handle.</small>
          {status && <p className="settings-status">{status}</p>}

          <div className="achievement-list">
            <span className="panel-kicker">Achievements</span>
            {achievements.map((label) => <span className="achievement" key={label}>{label}</span>)}
          </div>
        </article>

        <article className="panel ledger-table-card">
          <div className="account-card-heading"><div><span className="panel-kicker">Verified work</span><h2>Recent contributions</h2></div><a href="/">Open compute console</a></div>
          {account.recentContributions.length ? (
            <div className="ledger-table-wrap">
              <table className="ledger-table">
                <thead><tr><th>Unit</th><th>Engine</th><th>Candidates</th><th>Factors</th><th>When</th></tr></thead>
                <tbody>
                  {account.recentContributions.map((item) => (
                    <tr key={`${item.workUnitId}-${item.createdAt}`}>
                      <td><strong>M{item.exponent}</strong><small>{item.workUnitId}</small></td>
                      <td>{item.engine.toUpperCase()}</td>
                      <td>{formatCount(item.candidates)}</td>
                      <td>{item.factorCount}</td>
                      <td>{new Date(`${item.createdAt.replace(" ", "T")}Z`).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty-ledger">No validated server-leased work yet. Start the console to earn your first unit.</p>}
        </article>
      </div>

      <article className="panel audit-card">
        <div className="account-card-heading"><div><span className="panel-kicker">Account audit</span><h2>Recent recorded events</h2></div><span>D1-backed</span></div>
        <ol>
          {account.recentEvents.map((item, index) => (
            <li key={`${item.event}-${item.createdAt}-${index}`}><strong>{item.event}</strong><span>{new Date(`${item.createdAt.replace(" ", "T")}Z`).toLocaleString()}</span></li>
          ))}
        </ol>
      </article>
    </section>
  );
}
