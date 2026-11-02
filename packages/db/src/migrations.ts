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
  {
    id: "0003_artifacts",
    // See docs/data-model.md. The tables are append-only, like the ledger.
    sql: `CREATE TABLE file_contents (
  sha256 text PRIMARY KEY CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  size_bytes integer NOT NULL CHECK (size_bytes > 0),
  bytes bytea NOT NULL,
  created_at timestamptz NOT NULL,
  CONSTRAINT file_contents_size_matches CHECK (octet_length(bytes) = size_bytes)
);

-- No link to file_contents: the bytes may move to another store later (docs/decisions.md).
CREATE TABLE artifacts (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  kind text NOT NULL CHECK (kind IN ('source', 'deliverable')),
  filename text NOT NULL CHECK (filename <> ''),
  media_type text NOT NULL CHECK (media_type <> ''),
  size_bytes integer NOT NULL CHECK (size_bytes > 0),
  sha256 text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  added_by uuid REFERENCES users (id),
  ledger_seq integer NOT NULL,
  created_at timestamptz NOT NULL,
  CONSTRAINT artifacts_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq),
  UNIQUE (deal_id, ledger_seq)
);
CREATE INDEX artifacts_deal_idx ON artifacts (deal_id, ledger_seq);

CREATE TRIGGER file_contents_append_only BEFORE UPDATE OR DELETE ON file_contents
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER file_contents_no_truncate BEFORE TRUNCATE ON file_contents
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER artifacts_append_only BEFORE UPDATE OR DELETE ON artifacts
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER artifacts_no_truncate BEFORE TRUNCATE ON artifacts
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0004_webhook_events",
    // Notifications as received. No append-only guard: later phases mark events processed,
    // and a retention purge may need to delete (docs/decisions.md).
    sql: `CREATE TABLE webhook_events (
  source text NOT NULL CHECK (source <> ''),
  event_id text NOT NULL CHECK (event_id <> ''),
  event_type text NOT NULL CHECK (event_type <> ''),
  resource_type text,
  event_created_at timestamptz,
  received_at timestamptz NOT NULL,
  body jsonb NOT NULL,
  PRIMARY KEY (source, event_id)
);
CREATE INDEX webhook_events_received_idx ON webhook_events (received_at)`,
  },
  {
    id: "0005_sessions",
    // Only the SHA-256 of each sign-in token is stored, so a leaked table cannot be used to sign in.
    sql: `CREATE TABLE sessions (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  CONSTRAINT sessions_expire_after_creation CHECK (expires_at > created_at)
);
CREATE INDEX sessions_user_idx ON sessions (user_id);
CREATE INDEX sessions_expires_idx ON sessions (expires_at)`,
  },
  {
    id: "0006_links",
    // Buyer links store only the SHA-256 of their secret, like sessions. A link session is
    // limited to one deal; a PayPal session is not (docs/decisions.md).
    sql: `CREATE TABLE link_tokens (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  deal_id uuid NOT NULL REFERENCES deals (id),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  purpose text NOT NULL CHECK (purpose IN ('deal-access')),
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  last_used_at timestamptz,
  CONSTRAINT link_tokens_expire_after_creation CHECK (expires_at > created_at)
);
CREATE INDEX link_tokens_deal_user_idx ON link_tokens (deal_id, user_id);

ALTER TABLE sessions ADD COLUMN method text NOT NULL DEFAULT 'paypal'
  CHECK (method IN ('paypal', 'link'));
ALTER TABLE sessions ALTER COLUMN method DROP DEFAULT;
ALTER TABLE sessions ADD COLUMN deal_id uuid REFERENCES deals (id);
ALTER TABLE sessions ADD CONSTRAINT sessions_link_has_deal
  CHECK ((method = 'link') = (deal_id IS NOT NULL))`,
  },
  {
    id: "0007_scope_versions",
    // Each saved version of the agreed work, never edited; its fingerprint is in the ledger.
    sql: `CREATE TABLE scope_versions (
  deal_id uuid NOT NULL REFERENCES deals (id),
  version integer NOT NULL CHECK (version >= 1),
  format integer NOT NULL CHECK (format >= 1),
  content jsonb NOT NULL,
  content_sha256 text NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
  created_by uuid NOT NULL REFERENCES users (id),
  ledger_seq integer NOT NULL,
  created_at timestamptz NOT NULL,
  PRIMARY KEY (deal_id, version),
  CONSTRAINT scope_versions_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq),
  UNIQUE (deal_id, ledger_seq)
);

CREATE TRIGGER scope_versions_append_only BEFORE UPDATE OR DELETE ON scope_versions
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER scope_versions_no_truncate BEFORE TRUNCATE ON scope_versions
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0008_scope_drafts",
    // AI drafts of the agreed work. A draft is a proposal, not evidence: the row may move from
    // running to ready or failed once. Only a ready draft is recorded in the ledger, by
    // fingerprint (docs/data-model.md).
    sql: `ALTER TABLE artifacts ADD CONSTRAINT artifacts_deal_id_id_key UNIQUE (deal_id, id);

CREATE TABLE scope_drafts (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  source_artifact_id uuid NOT NULL,
  source_sha256 text NOT NULL CHECK (source_sha256 ~ '^[0-9a-f]{64}$'),
  created_by uuid NOT NULL REFERENCES users (id),
  status text NOT NULL CHECK (status IN ('running', 'ready', 'failed')),
  created_at timestamptz NOT NULL,
  finished_at timestamptz,
  draft_prompt_version integer NOT NULL CHECK (draft_prompt_version >= 1),
  rank_prompt_version integer NOT NULL CHECK (rank_prompt_version >= 1),
  draft jsonb,
  draft_sha256 text CHECK (draft_sha256 ~ '^[0-9a-f]{64}$'),
  council jsonb,
  failure_reason text CHECK (failure_reason <> ''),
  ledger_seq integer,
  CONSTRAINT scope_drafts_source_in_deal FOREIGN KEY (deal_id, source_artifact_id)
    REFERENCES artifacts (deal_id, id),
  CONSTRAINT scope_drafts_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT scope_drafts_state CHECK (
    (status = 'running' AND finished_at IS NULL AND draft IS NULL AND draft_sha256 IS NULL
       AND council IS NULL AND failure_reason IS NULL AND ledger_seq IS NULL)
    OR (status = 'ready' AND finished_at IS NOT NULL AND draft IS NOT NULL
       AND draft_sha256 IS NOT NULL AND council IS NOT NULL AND failure_reason IS NULL
       AND ledger_seq IS NOT NULL)
    OR (status = 'failed' AND finished_at IS NOT NULL AND draft IS NULL AND draft_sha256 IS NULL
       AND failure_reason IS NOT NULL AND ledger_seq IS NULL)
  )
);
CREATE INDEX scope_drafts_deal_idx ON scope_drafts (deal_id, created_at DESC);
-- At most one draft runs per deal at a time.
CREATE UNIQUE INDEX scope_drafts_one_running ON scope_drafts (deal_id) WHERE status = 'running'`,
  },
  {
    id: "0009_acceptances",
    // Each signed acceptance: the exact terms the buyer saw (the acceptance document), its
    // fingerprint and the typed name, never edited. The ACCEPTED ledger entry holds the same
    // fingerprint (docs/data-model.md).
    sql: `CREATE TABLE acceptances (
  deal_id uuid NOT NULL REFERENCES deals (id),
  version integer NOT NULL CHECK (version >= 1),
  document jsonb NOT NULL,
  document_sha256 text NOT NULL CHECK (document_sha256 ~ '^[0-9a-f]{64}$'),
  buyer_id uuid NOT NULL REFERENCES users (id),
  typed_name text NOT NULL CHECK (char_length(typed_name) BETWEEN 2 AND 200),
  ledger_seq integer NOT NULL,
  created_at timestamptz NOT NULL,
  PRIMARY KEY (deal_id, ledger_seq),
  UNIQUE (deal_id, version),
  CONSTRAINT acceptances_version_exists FOREIGN KEY (deal_id, version)
    REFERENCES scope_versions (deal_id, version),
  CONSTRAINT acceptances_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq)
);

CREATE TRIGGER acceptances_append_only BEFORE UPDATE OR DELETE ON acceptances
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER acceptances_no_truncate BEFORE TRUNCATE ON acceptances
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0010_milestones",
    // One row per payment stage of a signed version that has a PayPal invoice: reserved as
    // 'sending' before PayPal is asked, 'sent' once PayPal confirms (with its INVOICE_SENT ledger
    // entry), 'paid' later (4e). Not append-only: the status moves on; the ledger is the evidence.
    sql: `CREATE TABLE milestones (
  deal_id uuid NOT NULL REFERENCES deals (id),
  version integer NOT NULL CHECK (version >= 1),
  stage integer NOT NULL CHECK (stage >= 1),
  amount_minor integer NOT NULL CHECK (amount_minor > 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  status text NOT NULL CHECK (status IN ('sending', 'sent', 'paid')),
  request_id text NOT NULL UNIQUE,
  invoice_sha256 text NOT NULL CHECK (invoice_sha256 ~ '^[0-9a-f]{64}$'),
  invoice_id text UNIQUE CHECK (invoice_id <> ''),
  pay_url text CHECK (pay_url <> ''),
  ledger_seq integer,
  created_at timestamptz NOT NULL,
  sent_at timestamptz,
  PRIMARY KEY (deal_id, version, stage),
  CONSTRAINT milestones_version_exists FOREIGN KEY (deal_id, version)
    REFERENCES scope_versions (deal_id, version),
  CONSTRAINT milestones_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT milestones_state CHECK (
    (status = 'sending' AND ledger_seq IS NULL AND sent_at IS NULL)
    OR (status <> 'sending' AND ledger_seq IS NOT NULL AND sent_at IS NOT NULL
      AND invoice_id IS NOT NULL)
  )
)`,
  },
  {
    id: "0011_milestone_payments",
    // When PayPal confirms a stage's invoice is fully paid: the time, the PAYMENT_RECEIVED ledger
    // entry and PayPal's transaction id. A paid stage must have its entry.
    sql: `ALTER TABLE milestones ADD COLUMN paid_at timestamptz;
ALTER TABLE milestones ADD COLUMN payment_ledger_seq integer;
ALTER TABLE milestones ADD COLUMN transaction_id text CHECK (transaction_id <> '');
ALTER TABLE milestones ADD CONSTRAINT milestones_payment_in_ledger
  FOREIGN KEY (deal_id, payment_ledger_seq) REFERENCES ledger_entries (deal_id, seq);
ALTER TABLE milestones ADD CONSTRAINT milestones_paid_state
  CHECK ((status = 'paid') = (paid_at IS NOT NULL AND payment_ledger_seq IS NOT NULL))`,
  },
];
