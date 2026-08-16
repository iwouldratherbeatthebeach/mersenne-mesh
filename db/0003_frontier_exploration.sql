-- Frontier exploration support. Apply once after 0002_accounts_and_coordinator.sql.
-- The starting floor was captured from the GIMPS milestones page at
-- 2026-08-16 23:00:15 UTC: all exponents below 141,308,443 had been tested
-- at least once. These are independent trial-factoring ranges; they are not
-- claims that GIMPS has no assignment or result for a specific exponent.

ALTER TABLE work_units ADD COLUMN confirmed_at TEXT;
ALTER TABLE work_units ADD COLUMN confirmed_factors_json TEXT;

CREATE INDEX IF NOT EXISTS work_units_network_active_idx
ON work_units (network, active, exponent, start_k);

CREATE TABLE IF NOT EXISTS network_state (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  source TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR REPLACE INTO network_state (key, value, source, updated_at)
VALUES
  ('exploration_floor', '141308443', 'GIMPS milestones', '2026-08-16 23:00:15'),
  ('exploration_mode', 'independent-trial-factoring', 'Mersenne Mesh', CURRENT_TIMESTAMP);

WITH RECURSIVE
  ranges(i) AS (
    SELECT 0
    UNION ALL
    SELECT i + 1 FROM ranges WHERE i < 15
  ),
  exponents(p) AS (
    VALUES
    (141308443),
    (141308467),
    (141308477),
    (141308543),
    (141308549),
    (141308551),
    (141308569),
    (141308597),
    (141308603),
    (141308611),
    (141308627),
    (141308689),
    (141308693),
    (141308701),
    (141308729),
    (141308747),
    (141308749),
    (141308753),
    (141308767),
    (141308779),
    (141308807),
    (141308813),
    (141308821),
    (141308861),
    (141308863),
    (141308891),
    (141308903),
    (141308969),
    (141308977),
    (141308983),
    (141309011),
    (141309073),
    (141309107),
    (141309109),
    (141309131),
    (141309163),
    (141309167),
    (141309173),
    (141309187),
    (141309193),
    (141309209),
    (141309211),
    (141309227),
    (141309277),
    (141309281),
    (141309283),
    (141309293),
    (141309317),
    (141309323),
    (141309347),
    (141309349),
    (141309353),
    (141309359),
    (141309379),
    (141309391),
    (141309397),
    (141309419),
    (141309449),
    (141309461),
    (141309473),
    (141309557),
    (141309583),
    (141309587),
    (141309617)
  )
INSERT OR IGNORE INTO work_units (
  id, network, exponent, start_k, count, expected_candidates,
  expected_factors_json, target_replicas, active
)
SELECT
  printf('exploration-m%d-k%d-%d', p, 1 + i * 8388608, 8388608),
  'exploration',
  p,
  1 + i * 8388608,
  8388608,
  4194304,
  '[]',
  5,
  1
FROM exponents CROSS JOIN ranges;
