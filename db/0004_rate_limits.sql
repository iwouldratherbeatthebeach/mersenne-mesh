-- Backs a lightweight fixed-window rate limiter for the coordinator API
-- (POST /api/work/lease and POST /api/contributions). Apply once after
-- db/0003_frontier_exploration.sql.
--
-- The limiter keys on "<endpoint>:<user_id>" and a window-start timestamp
-- (worker/index.ts computes both); this table only needs to support fast
-- upserts and point lookups by (rl_key, window_start). Old rows are cheap
-- to prune periodically (see the DELETE below) since expired windows are
-- never read again.

CREATE TABLE IF NOT EXISTS rate_limits (
  rl_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (rl_key, window_start)
);

-- Optional maintenance query (safe to run periodically, e.g. from a cron
-- Worker or manually via `wrangler d1 execute`): removes rate-limit rows
-- older than a day so the table doesn't grow unbounded.
--
-- DELETE FROM rate_limits WHERE window_start < CAST(strftime('%s','now') AS INTEGER) - 86400;
