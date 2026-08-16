CREATE TABLE IF NOT EXISTS "accounts" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "oauth_token_secret" TEXT,
  "oauth_token" TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_identity_unique"
  ON "accounts" ("provider", "providerAccountId");

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "expires" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT,
  "emailVerified" TEXT,
  "image" TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique"
  ON "users" ("email");

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL PRIMARY KEY,
  "expires" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "profiles" (
  "email" TEXT NOT NULL PRIMARY KEY,
  "display_name" TEXT NOT NULL,
  "public_handle" TEXT NOT NULL UNIQUE,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "contributions" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_email" TEXT NOT NULL REFERENCES "profiles" ("email"),
  "work_unit_id" TEXT NOT NULL,
  "exponent" INTEGER NOT NULL,
  "engine" TEXT NOT NULL CHECK ("engine" IN ('cpu', 'gpu')),
  "cpu_core_milliseconds" INTEGER NOT NULL DEFAULT 0,
  "gpu_milliseconds" INTEGER NOT NULL DEFAULT 0,
  "candidates" INTEGER NOT NULL,
  "factors_json" TEXT NOT NULL DEFAULT '[]',
  "factor_count" INTEGER NOT NULL DEFAULT 0,
  "verified" INTEGER NOT NULL DEFAULT 0,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("user_email", "work_unit_id")
);

CREATE INDEX IF NOT EXISTS "contributions_user_created_idx"
  ON "contributions" ("user_email", "created_at");
