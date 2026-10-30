import type { Migration } from "./migrate.js";

/**
 * Every database change, oldest first. Add a new entry to change the structure;
 * never edit one that has been released (the runner refuses a changed migration).
 */
export const MIGRATIONS: readonly Migration[] = [
  {
    id: "0001_append_only_guard",
    // Attach to a table with: CREATE TRIGGER ... BEFORE UPDATE OR DELETE ... EXECUTE FUNCTION pactpal_forbid_change()
    sql: `CREATE FUNCTION pactpal_forbid_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% on % is not allowed: the table is append-only', TG_OP, TG_TABLE_NAME
    USING ERRCODE = 'restrict_violation';
END;
$$`,
  },
  {
    id: "0002_users_deals_ledger",
    // See docs/data-model.md for what each table and column means.
    sql: `CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text NOT NULL CHECK (email <> ''),
  email_verified_at timestamptz,
  display_name text,
  paypal_user_id text UNIQUE,
  paypal_payer_id text UNIQUE,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE UNIQUE INDEX users_email_unique ON users (lower(email));

CREATE TABLE deals (
  id uuid PRIMARY KEY,
  seller_id uuid NOT NULL REFERENCES users (id),
  buyer_id uuid REFERENCES users (id),
  title text NOT NULL CHECK (title <> ''),
  kind text NOT NULL CHECK (kind IN ('service', 'digital', 'physical')),
  category text NOT NULL CHECK (category <> ''),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  status text NOT NULL
    CHECK (status IN ('draft', 'awaiting_acceptance', 'active', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT deals_seller_is_not_buyer CHECK (buyer_id IS NULL OR buyer_id <> seller_id)
);
CREATE INDEX deals_seller_idx ON deals (seller_id, created_at DESC);
CREATE INDEX deals_buyer_idx ON deals (buyer_id) WHERE buyer_id IS NOT NULL;

CREATE TABLE ledger_entries (
  deal_id uuid NOT NULL REFERENCES deals (id),
  seq integer NOT NULL CHECK (seq >= 0),
  type text NOT NULL,
  actor text NOT NULL CHECK (actor IN ('seller', 'buyer', 'system')),
  actor_user_id uuid REFERENCES users (id),
  payload jsonb NOT NULL,
  payload_hash text NOT NULL CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
  prev_hash text NOT NULL CHECK (prev_hash ~ '^[0-9a-f]{64}$'),
  entry_hash text NOT NULL UNIQUE CHECK (entry_hash ~ '^[0-9a-f]{64}$'),
  server_time timestamptz NOT NULL,
  -- Plain text, not inet: inet rewrites addresses, and the exact text is part of the hash.
  ip text,
  user_agent text,
  PRIMARY KEY (deal_id, seq)
);
-- Row triggers do not fire for TRUNCATE, so it gets its own.
CREATE TRIGGER ledger_entries_append_only BEFORE UPDATE OR DELETE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER ledger_entries_no_truncate BEFORE TRUNCATE ON ledger_entries
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
];
