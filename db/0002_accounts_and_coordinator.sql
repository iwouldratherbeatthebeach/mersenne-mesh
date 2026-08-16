#hi mom
DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  user_id TEXT NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  public_handle TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  work_unit_id TEXT NOT NULL,
  exponent INTEGER NOT NULL,
  engine TEXT NOT NULL CHECK (engine IN ('cpu', 'gpu')),
  cpu_core_milliseconds INTEGER NOT NULL DEFAULT 0,
  gpu_milliseconds INTEGER NOT NULL DEFAULT 0,
  candidates INTEGER NOT NULL,
  factors_json TEXT NOT NULL DEFAULT '[]',
  factor_count INTEGER NOT NULL DEFAULT 0,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, work_unit_id)
);

CREATE INDEX contributions_user_created_idx
ON contributions (user_id, created_at);

CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  event TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS audit_events_user_created_idx
ON audit_events (user_id, created_at);

CREATE INDEX IF NOT EXISTS audit_events_event_created_idx
ON audit_events (event, created_at);

CREATE TABLE IF NOT EXISTS work_units (
  id TEXT NOT NULL PRIMARY KEY,
  network TEXT NOT NULL DEFAULT 'validation',
  exponent INTEGER NOT NULL,
  start_k INTEGER NOT NULL,
  count INTEGER NOT NULL,
  expected_candidates INTEGER NOT NULL,
  expected_factors_json TEXT NOT NULL DEFAULT '[]',
  target_replicas INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_leases (
  id TEXT NOT NULL PRIMARY KEY,
  work_unit_id TEXT NOT NULL REFERENCES work_units(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engine TEXT NOT NULL CHECK (engine IN ('cpu', 'gpu')),
  status TEXT NOT NULL DEFAULT 'leased'
    CHECK (status IN ('leased', 'completed', 'expired')),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS work_leases_unit_status_idx
ON work_leases (work_unit_id, status);

CREATE INDEX IF NOT EXISTS work_leases_user_status_idx
ON work_leases (user_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS work_leases_one_active_per_user
ON work_leases (user_id)
WHERE status = 'leased';

INSERT OR IGNORE INTO work_units
(id, exponent, start_k, count, expected_candidates, expected_factors_json, target_replicas, active)
VALUES
('validation-m23-k1-32768', 23, 1, 32768, 16384, '["47","178481"]', 1000, 1),
('validation-m29-k1-32768', 29, 1, 32768, 16384, '["233","1103","2089","256999","486737"]', 1000, 1),
('validation-m37-k1-32768', 37, 1, 32768, 16384, '["223"]', 1000, 1),
('validation-m43-k1-32768', 43, 1, 32768, 16384, '["431","9719","2099863"]', 1000, 1);
