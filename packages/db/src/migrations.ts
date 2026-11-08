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
  {
    id: "0012_deliveries",
    // Each delivery the seller sends (files for one stage of the signed version, with an optional
    // message) and its files; both append-only. The DELIVERY_SENT ledger entry names every file
    // by fingerprint (docs/data-model.md).
    sql: `CREATE TABLE deliveries (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  version integer NOT NULL CHECK (version >= 1),
  stage integer NOT NULL CHECK (stage >= 1),
  message text CHECK (char_length(message) BETWEEN 1 AND 1000),
  sent_by uuid NOT NULL REFERENCES users (id),
  ledger_seq integer NOT NULL,
  created_at timestamptz NOT NULL,
  UNIQUE (deal_id, id),
  UNIQUE (deal_id, ledger_seq),
  CONSTRAINT deliveries_version_exists FOREIGN KEY (deal_id, version)
    REFERENCES scope_versions (deal_id, version),
  CONSTRAINT deliveries_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq)
);

CREATE TABLE delivery_files (
  deal_id uuid NOT NULL,
  delivery_id uuid NOT NULL,
  artifact_id uuid NOT NULL,
  position integer NOT NULL CHECK (position >= 1),
  PRIMARY KEY (delivery_id, artifact_id),
  UNIQUE (delivery_id, position),
  CONSTRAINT delivery_files_delivery FOREIGN KEY (deal_id, delivery_id)
    REFERENCES deliveries (deal_id, id),
  CONSTRAINT delivery_files_file_of_deal FOREIGN KEY (deal_id, artifact_id)
    REFERENCES artifacts (deal_id, id)
);

CREATE TRIGGER deliveries_append_only BEFORE UPDATE OR DELETE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER deliveries_no_truncate BEFORE TRUNCATE ON deliveries
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER delivery_files_append_only BEFORE UPDATE OR DELETE ON delivery_files
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER delivery_files_no_truncate BEFORE TRUNCATE ON delivery_files
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0013_delivery_answers",
    // The buyer's one answer to a delivery: approved, or changes requested (with the request and
    // its revision number). Append-only; the key makes a second answer impossible.
    sql: `CREATE TABLE delivery_answers (
  delivery_id uuid PRIMARY KEY,
  deal_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('approved', 'changes')),
  request text CHECK (char_length(request) BETWEEN 1 AND 2000),
  revision integer CHECK (revision >= 1),
  answered_by uuid NOT NULL REFERENCES users (id),
  ledger_seq integer NOT NULL,
  created_at timestamptz NOT NULL,
  UNIQUE (deal_id, ledger_seq),
  CONSTRAINT delivery_answers_delivery FOREIGN KEY (deal_id, delivery_id)
    REFERENCES deliveries (deal_id, id),
  CONSTRAINT delivery_answers_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT delivery_answers_changes_have_request
    CHECK ((kind = 'changes') = (request IS NOT NULL AND revision IS NOT NULL))
);

CREATE TRIGGER delivery_answers_append_only BEFORE UPDATE OR DELETE ON delivery_answers
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER delivery_answers_no_truncate BEFORE TRUNCATE ON delivery_answers
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0014_change_orders",
    // A change order (4j): the seller proposes a later version of a signed agreement (stored in
    // scope_versions) and the buyer accepts it (a new acceptances row) or declines it, or the
    // seller withdraws it. The status moves once from 'proposed'; rows are never removed. At most
    // one waits per deal. A payment stage is the same stage in every version (change orders only
    // add), so a deal has at most one invoice per stage.
    sql: `CREATE TABLE change_orders (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  from_version integer NOT NULL CHECK (from_version >= 1),
  to_version integer NOT NULL,
  message text CHECK (char_length(message) BETWEEN 1 AND 1000),
  status text NOT NULL CHECK (status IN ('proposed', 'accepted', 'declined', 'withdrawn')),
  reason text CHECK (char_length(reason) BETWEEN 1 AND 1000),
  proposed_by uuid NOT NULL REFERENCES users (id),
  proposed_seq integer NOT NULL,
  answered_seq integer,
  created_at timestamptz NOT NULL,
  answered_at timestamptz,
  UNIQUE (deal_id, to_version),
  CHECK (to_version > from_version),
  CONSTRAINT change_orders_version FOREIGN KEY (deal_id, to_version)
    REFERENCES scope_versions (deal_id, version),
  CONSTRAINT change_orders_proposed_in_ledger FOREIGN KEY (deal_id, proposed_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT change_orders_answered_in_ledger FOREIGN KEY (deal_id, answered_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT change_orders_answered_state
    CHECK ((status = 'proposed') = (answered_seq IS NULL AND answered_at IS NULL)),
  CONSTRAINT change_orders_reason_on_decline CHECK (reason IS NULL OR status = 'declined')
);

CREATE UNIQUE INDEX change_orders_one_waiting ON change_orders (deal_id) WHERE status = 'proposed';

CREATE FUNCTION pactpal_change_order_answered_once() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP <> 'UPDATE' OR OLD.status <> 'proposed' OR NEW.status = 'proposed'
     OR NEW.id <> OLD.id OR NEW.deal_id <> OLD.deal_id OR NEW.from_version <> OLD.from_version
     OR NEW.to_version <> OLD.to_version OR NEW.message IS DISTINCT FROM OLD.message
     OR NEW.proposed_by <> OLD.proposed_by OR NEW.proposed_seq <> OLD.proposed_seq
     OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'change_orders: only a proposed change can be answered, once (append-only)'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER change_orders_answered_once BEFORE UPDATE OR DELETE ON change_orders
  FOR EACH ROW EXECUTE FUNCTION pactpal_change_order_answered_once();
CREATE TRIGGER change_orders_no_truncate BEFORE TRUNCATE ON change_orders
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change();

CREATE UNIQUE INDEX milestones_one_per_stage ON milestones (deal_id, stage)`,
  },
  {
    id: "0015_buyer_questions",
    // A buyer's question about the page they are asked to sign (4k): asked while a model answers,
    // then answered from the agreement (the AI's answer kept here, apart from the log) or sent to
    // the seller, who answers it. The status only moves forward and rows are never removed; at
    // most one question is being answered per deal.
    sql: `CREATE TABLE buyer_questions (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  version integer NOT NULL,
  document_sha256 text NOT NULL CHECK (document_sha256 ~ '^[0-9a-f]{64}$'),
  question text NOT NULL CHECK (char_length(question) BETWEEN 1 AND 500),
  status text NOT NULL CHECK (status IN ('asked', 'answered', 'forwarded', 'seller-answered')),
  ai_answer jsonb,
  forward_reason text
    CHECK (forward_reason IN ('not-in-agreement', 'quote-not-found', 'no-model', 'buyer-asked')),
  seller_answer text CHECK (char_length(seller_answer) BETWEEN 1 AND 2000),
  asked_by uuid NOT NULL REFERENCES users (id),
  asked_seq integer NOT NULL,
  answered_seq integer,
  forwarded_seq integer,
  seller_seq integer,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT buyer_questions_version FOREIGN KEY (deal_id, version)
    REFERENCES scope_versions (deal_id, version),
  CONSTRAINT buyer_questions_asked_in_ledger FOREIGN KEY (deal_id, asked_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT buyer_questions_answered_in_ledger FOREIGN KEY (deal_id, answered_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT buyer_questions_forwarded_in_ledger FOREIGN KEY (deal_id, forwarded_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT buyer_questions_seller_in_ledger FOREIGN KEY (deal_id, seller_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT buyer_questions_ai_answer_shown CHECK ((ai_answer IS NULL) = (answered_seq IS NULL)),
  CONSTRAINT buyer_questions_forwarded
    CHECK ((forward_reason IS NULL) = (forwarded_seq IS NULL)),
  CONSTRAINT buyer_questions_seller_answer
    CHECK ((seller_answer IS NULL) = (seller_seq IS NULL)),
  CONSTRAINT buyer_questions_state CHECK (
    (status = 'asked' AND answered_seq IS NULL AND forwarded_seq IS NULL AND seller_seq IS NULL)
    OR (status = 'answered' AND answered_seq IS NOT NULL AND forwarded_seq IS NULL
      AND seller_seq IS NULL)
    OR (status = 'forwarded' AND forwarded_seq IS NOT NULL AND seller_seq IS NULL)
    OR (status = 'seller-answered' AND forwarded_seq IS NOT NULL AND seller_seq IS NOT NULL)
  )
);

CREATE UNIQUE INDEX buyer_questions_one_asking ON buyer_questions (deal_id) WHERE status = 'asked';

CREATE FUNCTION pactpal_buyer_question_moves_on() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP <> 'UPDATE'
     OR NEW.id <> OLD.id OR NEW.deal_id <> OLD.deal_id OR NEW.version <> OLD.version
     OR NEW.document_sha256 <> OLD.document_sha256 OR NEW.question <> OLD.question
     OR NEW.asked_by <> OLD.asked_by OR NEW.asked_seq <> OLD.asked_seq
     OR NEW.created_at <> OLD.created_at
     OR (OLD.ai_answer IS NOT NULL AND NEW.ai_answer IS DISTINCT FROM OLD.ai_answer)
     OR (OLD.forward_reason IS NOT NULL AND NEW.forward_reason IS DISTINCT FROM OLD.forward_reason)
     OR (OLD.seller_answer IS NOT NULL AND NEW.seller_answer IS DISTINCT FROM OLD.seller_answer)
     OR NOT ((OLD.status = 'asked' AND NEW.status IN ('answered', 'forwarded'))
       OR (OLD.status = 'answered' AND NEW.status = 'forwarded')
       OR (OLD.status = 'forwarded' AND NEW.status = 'seller-answered')) THEN
    RAISE EXCEPTION 'buyer_questions: a question only moves forward and keeps what it recorded (append-only)'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER buyer_questions_moves_on BEFORE UPDATE OR DELETE ON buyer_questions
  FOR EACH ROW EXECUTE FUNCTION pactpal_buyer_question_moves_on();
CREATE TRIGGER buyer_questions_no_truncate BEFORE TRUNCATE ON buyer_questions
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0016_delivery_checks",
    // A seller's pre-delivery check (4l): code checks and a vision model's look at delivered
    // files against the signed agreement. Advice for the seller only, kept apart from the
    // evidence log and never changed or removed.
    sql: `CREATE TABLE delivery_checks (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  version integer NOT NULL,
  stage integer NOT NULL CHECK (stage BETWEEN 1 AND 20),
  files jsonb NOT NULL CHECK (jsonb_typeof(files) = 'array' AND jsonb_array_length(files) BETWEEN 1 AND 10),
  report jsonb NOT NULL,
  checked_by uuid NOT NULL REFERENCES users (id),
  created_at timestamptz NOT NULL,
  CONSTRAINT delivery_checks_version FOREIGN KEY (deal_id, version)
    REFERENCES scope_versions (deal_id, version)
);
CREATE INDEX delivery_checks_by_deal ON delivery_checks (deal_id, created_at);
CREATE TRIGGER delivery_checks_append_only BEFORE UPDATE OR DELETE ON delivery_checks
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER delivery_checks_no_truncate BEFORE TRUNCATE ON delivery_checks
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0017_message_reviews",
    // A council's review of a buyer's new message (4m): labels, a drafted reply and change lines,
    // advice for the seller only and kept apart from the evidence log. The message itself is a
    // source file. A review moves once, from running to ready or failed, and is never removed.
    sql: `CREATE TABLE message_reviews (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  version integer NOT NULL,
  source_artifact_id uuid NOT NULL,
  source_sha256 text NOT NULL CHECK (source_sha256 ~ '^[0-9a-f]{64}$'),
  status text NOT NULL CHECK (status IN ('running', 'ready', 'failed')),
  prompt_version integer NOT NULL CHECK (prompt_version >= 1),
  rank_prompt_version integer NOT NULL CHECK (rank_prompt_version >= 1),
  review jsonb,
  council jsonb,
  failure_reason text CHECK (failure_reason <> ''),
  requested_by uuid NOT NULL REFERENCES users (id),
  created_at timestamptz NOT NULL,
  finished_at timestamptz,
  CONSTRAINT message_reviews_version FOREIGN KEY (deal_id, version)
    REFERENCES scope_versions (deal_id, version),
  CONSTRAINT message_reviews_source_in_deal FOREIGN KEY (deal_id, source_artifact_id)
    REFERENCES artifacts (deal_id, id),
  CONSTRAINT message_reviews_state CHECK (
    (status = 'running' AND finished_at IS NULL AND review IS NULL AND council IS NULL
       AND failure_reason IS NULL)
    OR (status = 'ready' AND finished_at IS NOT NULL AND review IS NOT NULL
       AND council IS NOT NULL AND failure_reason IS NULL)
    OR (status = 'failed' AND finished_at IS NOT NULL AND review IS NULL
       AND failure_reason IS NOT NULL)
  )
);
CREATE INDEX message_reviews_by_deal ON message_reviews (deal_id, created_at DESC);
-- At most one review runs per deal at a time.
CREATE UNIQUE INDEX message_reviews_one_running ON message_reviews (deal_id) WHERE status = 'running';

CREATE FUNCTION pactpal_message_review_moves_once() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' OR OLD.status <> 'running' OR NEW.status = 'running'
     OR NEW.id <> OLD.id OR NEW.deal_id <> OLD.deal_id OR NEW.version <> OLD.version
     OR NEW.source_artifact_id <> OLD.source_artifact_id OR NEW.source_sha256 <> OLD.source_sha256
     OR NEW.prompt_version <> OLD.prompt_version
     OR NEW.rank_prompt_version <> OLD.rank_prompt_version
     OR NEW.requested_by <> OLD.requested_by OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'message_reviews: a review moves once and keeps what it recorded (append-only)'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER message_reviews_moves_once BEFORE UPDATE OR DELETE ON message_reviews
  FOR EACH ROW EXECUTE FUNCTION pactpal_message_review_moves_once();
CREATE TRIGGER message_reviews_no_truncate BEFORE TRUNCATE ON message_reviews
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0018_intake_keys",
    // A seller's private intake key (4p): a tool posts text with it and a draft deal is created.
    // Only the key's SHA-256 and last 4 characters are kept. One key is on per seller; a key's
    // owner, hash and defaults never change, it is turned off once, and it is never removed.
    sql: `CREATE TABLE intake_keys (
  id uuid PRIMARY KEY,
  seller_id uuid NOT NULL REFERENCES users (id),
  token_hash text NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  key_ending text NOT NULL CHECK (char_length(key_ending) = 4),
  default_category text NOT NULL,
  default_currency text NOT NULL CHECK (default_currency ~ '^[A-Z]{3}$'),
  created_at timestamptz NOT NULL,
  last_used_at timestamptz,
  turned_off_at timestamptz,
  -- Deals created today with this key, for the daily limit (the day is UTC).
  uses_day date,
  uses_count integer NOT NULL DEFAULT 0 CHECK (uses_count >= 0)
);
CREATE UNIQUE INDEX intake_keys_one_on ON intake_keys (seller_id) WHERE turned_off_at IS NULL;

CREATE FUNCTION pactpal_intake_key_keeps() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE'
     OR NEW.id <> OLD.id OR NEW.seller_id <> OLD.seller_id OR NEW.token_hash <> OLD.token_hash
     OR NEW.key_ending <> OLD.key_ending OR NEW.default_category <> OLD.default_category
     OR NEW.default_currency <> OLD.default_currency OR NEW.created_at <> OLD.created_at
     OR (OLD.turned_off_at IS NOT NULL AND NEW.turned_off_at IS DISTINCT FROM OLD.turned_off_at) THEN
    RAISE EXCEPTION 'intake_keys: a key keeps its owner, hash and defaults and is turned off once (append-only)'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER intake_keys_keeps BEFORE UPDATE OR DELETE ON intake_keys
  FOR EACH ROW EXECUTE FUNCTION pactpal_intake_key_keeps();
CREATE TRIGGER intake_keys_no_truncate BEFORE TRUNCATE ON intake_keys
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0019_intake_addresses",
    // A seller's private forwarding address (4p-2) is a second kind of intake secret: one key and
    // one address can be on per seller. The kind never changes.
    sql: `ALTER TABLE intake_keys ADD COLUMN kind text NOT NULL DEFAULT 'key'
  CHECK (kind IN ('key', 'address'));
DROP INDEX intake_keys_one_on;
CREATE UNIQUE INDEX intake_keys_one_on_per_kind ON intake_keys (seller_id, kind)
  WHERE turned_off_at IS NULL;

CREATE OR REPLACE FUNCTION pactpal_intake_key_keeps() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE'
     OR NEW.id <> OLD.id OR NEW.seller_id <> OLD.seller_id OR NEW.token_hash <> OLD.token_hash
     OR NEW.key_ending <> OLD.key_ending OR NEW.default_category <> OLD.default_category
     OR NEW.default_currency <> OLD.default_currency OR NEW.created_at <> OLD.created_at
     OR NEW.kind <> OLD.kind
     OR (OLD.turned_off_at IS NOT NULL AND NEW.turned_off_at IS DISTINCT FROM OLD.turned_off_at) THEN
    RAISE EXCEPTION 'intake_keys: a key keeps its owner, hash and defaults and is turned off once (append-only)'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$`,
  },
  {
    id: "0020_disputes",
    // PayPal disputes found by checking the seller's dispute list (5a), and each check. A dispute
    // row is a working copy of PayPal's answer, not evidence (the ledger entries are): it moves
    // with PayPal, but once linked to a deal and stage it stays linked, and the entries that
    // recorded its opening and decision stay set. Rows are never removed. The PayPal invoice number
    // of each paid stage is kept so a dispute can also be matched by it.
    sql: `ALTER TABLE milestones ADD COLUMN invoice_number text CHECK (invoice_number <> '');

CREATE TABLE disputes (
  dispute_id text PRIMARY KEY CHECK (dispute_id <> '' AND char_length(dispute_id) <= 100),
  deal_id uuid REFERENCES deals (id),
  stage integer CHECK (stage >= 1),
  invoice_id text,
  matched_by text CHECK (matched_by IN ('transaction', 'invoice-number')),
  reason text,
  status text NOT NULL,
  dispute_state text,
  stage_name text,
  amount_minor integer CHECK (amount_minor >= 0),
  currency text CHECK (currency ~ '^[A-Z]{3}$'),
  seller_due_at timestamptz,
  buyer_due_at timestamptz,
  allowed_actions jsonb NOT NULL DEFAULT '[]',
  offer_types jsonb NOT NULL DEFAULT '[]',
  outcome text,
  details jsonb,
  paypal_created_at timestamptz,
  paypal_updated_at timestamptz,
  first_seen_at timestamptz NOT NULL,
  checked_at timestamptz NOT NULL,
  opened_seq integer,
  resolved_seq integer,
  CONSTRAINT disputes_opened_in_ledger FOREIGN KEY (deal_id, opened_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT disputes_resolved_in_ledger FOREIGN KEY (deal_id, resolved_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT disputes_linked CHECK (
    (deal_id IS NULL AND stage IS NULL AND matched_by IS NULL AND opened_seq IS NULL
      AND resolved_seq IS NULL)
    OR (deal_id IS NOT NULL AND stage IS NOT NULL AND matched_by IS NOT NULL
      AND opened_seq IS NOT NULL)
  )
);
CREATE INDEX disputes_by_deal ON disputes (deal_id) WHERE deal_id IS NOT NULL;

CREATE FUNCTION pactpal_dispute_keeps() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE'
     OR NEW.dispute_id <> OLD.dispute_id OR NEW.first_seen_at <> OLD.first_seen_at
     OR (OLD.deal_id IS NOT NULL AND (NEW.deal_id IS DISTINCT FROM OLD.deal_id
       OR NEW.stage IS DISTINCT FROM OLD.stage OR NEW.invoice_id IS DISTINCT FROM OLD.invoice_id
       OR NEW.matched_by IS DISTINCT FROM OLD.matched_by
       OR NEW.opened_seq IS DISTINCT FROM OLD.opened_seq))
     OR (OLD.resolved_seq IS NOT NULL AND NEW.resolved_seq IS DISTINCT FROM OLD.resolved_seq) THEN
    RAISE EXCEPTION 'disputes: a dispute stays linked to its deal and keeps its log entries'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER disputes_keeps BEFORE UPDATE OR DELETE ON disputes
  FOR EACH ROW EXECUTE FUNCTION pactpal_dispute_keeps();
CREATE TRIGGER disputes_no_truncate BEFORE TRUNCATE ON disputes
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change();

CREATE TABLE dispute_checks (
  id uuid PRIMARY KEY,
  source text NOT NULL CHECK (source IN ('schedule', 'button', 'notification')),
  started_at timestamptz NOT NULL,
  finished_at timestamptz,
  listed integer CHECK (listed >= 0),
  read_in_full integer CHECK (read_in_full >= 0),
  matched integer CHECK (matched >= 0),
  unmatched integer CHECK (unmatched >= 0),
  new_entries integer CHECK (new_entries >= 0),
  failure text CHECK (failure <> '' AND char_length(failure) <= 200)
);
CREATE INDEX dispute_checks_newest ON dispute_checks (started_at DESC)`,
  },
  {
    id: "0021_claim_analyses",
    // A council's comparison of a buyer's dispute claim with the agreement and the deal's record
    // (5d): a draft for the seller only, kept apart from the evidence log, which gets only its
    // fingerprint (CLAIM_ANALYZED) when it is ready. An analysis moves once, from running to ready
    // or failed, keeps what it recorded and is never removed.
    sql: `CREATE TABLE claim_analyses (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  dispute_id text NOT NULL REFERENCES disputes (dispute_id),
  pasted_artifact_id uuid,
  status text NOT NULL CHECK (status IN ('running', 'ready', 'failed')),
  prompt_version integer NOT NULL CHECK (prompt_version >= 1),
  rank_prompt_version integer NOT NULL CHECK (rank_prompt_version >= 1),
  claim_sha256 text CHECK (claim_sha256 ~ '^[0-9a-f]{64}$'),
  record_sha256 text CHECK (record_sha256 ~ '^[0-9a-f]{64}$'),
  analysis jsonb,
  council jsonb,
  failure_reason text CHECK (failure_reason <> ''),
  ledger_seq integer,
  requested_by uuid NOT NULL REFERENCES users (id),
  created_at timestamptz NOT NULL,
  finished_at timestamptz,
  CONSTRAINT claim_analyses_pasted_in_deal FOREIGN KEY (deal_id, pasted_artifact_id)
    REFERENCES artifacts (deal_id, id),
  CONSTRAINT claim_analyses_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT claim_analyses_state CHECK (
    (status = 'running' AND finished_at IS NULL AND analysis IS NULL AND council IS NULL
       AND failure_reason IS NULL AND ledger_seq IS NULL)
    OR (status = 'ready' AND finished_at IS NOT NULL AND analysis IS NOT NULL
       AND council IS NOT NULL AND failure_reason IS NULL AND ledger_seq IS NOT NULL
       AND claim_sha256 IS NOT NULL AND record_sha256 IS NOT NULL)
    OR (status = 'failed' AND finished_at IS NOT NULL AND analysis IS NULL
       AND failure_reason IS NOT NULL AND ledger_seq IS NULL)
  )
);
CREATE INDEX claim_analyses_by_dispute ON claim_analyses (dispute_id, created_at DESC);
-- At most one analysis runs per dispute at a time.
CREATE UNIQUE INDEX claim_analyses_one_running ON claim_analyses (dispute_id)
  WHERE status = 'running';

CREATE FUNCTION pactpal_claim_analysis_moves_once() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' OR OLD.status <> 'running' OR NEW.status = 'running'
     OR NEW.id <> OLD.id OR NEW.deal_id <> OLD.deal_id OR NEW.dispute_id <> OLD.dispute_id
     OR NEW.pasted_artifact_id IS DISTINCT FROM OLD.pasted_artifact_id
     OR NEW.prompt_version <> OLD.prompt_version
     OR NEW.rank_prompt_version <> OLD.rank_prompt_version
     OR NEW.requested_by <> OLD.requested_by OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'claim_analyses: an analysis moves once and keeps what it recorded (append-only)'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER claim_analyses_moves_once BEFORE UPDATE OR DELETE ON claim_analyses
  FOR EACH ROW EXECUTE FUNCTION pactpal_claim_analysis_moves_once();
CREATE TRIGGER claim_analyses_no_truncate BEFORE TRUNCATE ON claim_analyses
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0022_evidence_packets",
    // Each evidence packet built for a dispute (5e): the packet PDF's fingerprint (its bytes are
    // stored in file_contents like any file), the exhibits it included and left out, the total
    // size and the log's seal it carries, with its PACKET_BUILT entry. Append-only.
    sql: `CREATE TABLE evidence_packets (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  dispute_id text NOT NULL REFERENCES disputes (dispute_id),
  packet_sha256 text NOT NULL CHECK (packet_sha256 ~ '^[0-9a-f]{64}$'),
  packet_bytes integer NOT NULL CHECK (packet_bytes > 0),
  exhibits jsonb NOT NULL,
  total_bytes integer NOT NULL CHECK (total_bytes > 0),
  chain_entries integer NOT NULL CHECK (chain_entries > 0),
  chain_head text NOT NULL CHECK (chain_head ~ '^[0-9a-f]{64}$'),
  built_by uuid NOT NULL REFERENCES users (id),
  ledger_seq integer NOT NULL,
  created_at timestamptz NOT NULL,
  CONSTRAINT evidence_packets_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq)
);
CREATE INDEX evidence_packets_by_dispute ON evidence_packets (dispute_id, created_at DESC);
CREATE TRIGGER evidence_packets_append_only BEFORE UPDATE OR DELETE ON evidence_packets
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER evidence_packets_no_truncate BEFORE TRUNCATE ON evidence_packets
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0023_dispute_council_kinds",
    // The packet summary (5f) is a second kind of dispute council job in claim_analyses, based on a
    // ready comparison: one running per dispute and kind. A packet may carry a checked comparison
    // and summary, named by id.
    sql: `ALTER TABLE claim_analyses ADD COLUMN kind text NOT NULL DEFAULT 'claim'
  CHECK (kind IN ('claim', 'summary'));
ALTER TABLE claim_analyses ADD COLUMN based_on uuid REFERENCES claim_analyses (id);
ALTER TABLE claim_analyses ADD CONSTRAINT claim_analyses_based_on
  CHECK ((kind = 'summary') = (based_on IS NOT NULL));
DROP INDEX claim_analyses_one_running;
CREATE UNIQUE INDEX claim_analyses_one_running_per_kind ON claim_analyses (dispute_id, kind)
  WHERE status = 'running';

CREATE OR REPLACE FUNCTION pactpal_claim_analysis_moves_once() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' OR OLD.status <> 'running' OR NEW.status = 'running'
     OR NEW.id <> OLD.id OR NEW.deal_id <> OLD.deal_id OR NEW.dispute_id <> OLD.dispute_id
     OR NEW.pasted_artifact_id IS DISTINCT FROM OLD.pasted_artifact_id
     OR NEW.kind <> OLD.kind OR NEW.based_on IS DISTINCT FROM OLD.based_on
     OR NEW.prompt_version <> OLD.prompt_version
     OR NEW.rank_prompt_version <> OLD.rank_prompt_version
     OR NEW.requested_by <> OLD.requested_by OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'claim_analyses: an analysis moves once and keeps what it recorded (append-only)'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

ALTER TABLE evidence_packets ADD COLUMN analysis_id uuid REFERENCES claim_analyses (id);
ALTER TABLE evidence_packets ADD COLUMN summary_id uuid REFERENCES claim_analyses (id);
ALTER TABLE evidence_packets ADD CONSTRAINT evidence_packets_ai_together
  CHECK ((analysis_id IS NULL) = (summary_id IS NULL))`,
  },
  {
    id: "0024_dispute_actions",
    // What the seller sent PayPal for a dispute (5g): an escalation or an evidence upload, with
    // the confirmed note, the files' fingerprints and a fixed PayPal-Request-Id. A row moves from
    // sending to sent (with its log entry), unknown (PayPal may have it) or refused; an unknown one
    // may be sent again, with the same request id. Nothing else changes and nothing is removed.
    sql: `CREATE TABLE dispute_actions (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  dispute_id text NOT NULL REFERENCES disputes (dispute_id),
  seller_id uuid NOT NULL REFERENCES users (id),
  kind text NOT NULL CHECK (kind IN ('escalate', 'evidence')),
  status text NOT NULL CHECK (status IN ('sending', 'sent', 'unknown', 'refused')),
  request_id text NOT NULL UNIQUE,
  packet_id uuid REFERENCES evidence_packets (id),
  evidence_type text CHECK (evidence_type ~ '^[A-Z0-9_]{1,255}$'),
  note text NOT NULL CHECK (char_length(note) BETWEEN 1 AND 2000),
  note_sha256 text NOT NULL CHECK (note_sha256 ~ '^[0-9a-f]{64}$'),
  files jsonb NOT NULL,
  total_bytes integer NOT NULL CHECK (total_bytes >= 0),
  transport text CHECK (transport IN ('rest', 'mcp')),
  debug_id text,
  failure text,
  ledger_seq integer,
  created_at timestamptz NOT NULL,
  finished_at timestamptz,
  CONSTRAINT dispute_actions_evidence_fields
    CHECK ((kind = 'evidence') = (packet_id IS NOT NULL AND evidence_type IS NOT NULL)),
  CONSTRAINT dispute_actions_sent_logged CHECK ((status = 'sent') = (ledger_seq IS NOT NULL)),
  CONSTRAINT dispute_actions_recorded_in_ledger FOREIGN KEY (deal_id, ledger_seq)
    REFERENCES ledger_entries (deal_id, seq)
);
CREATE INDEX dispute_actions_by_dispute ON dispute_actions (dispute_id, created_at DESC);
CREATE UNIQUE INDEX dispute_actions_one_sending ON dispute_actions (dispute_id)
  WHERE status = 'sending';

CREATE FUNCTION pactpal_dispute_action_moves() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE'
     OR NOT ((OLD.status = 'sending' AND NEW.status IN ('sent', 'unknown', 'refused'))
             OR (OLD.status = 'unknown' AND NEW.status = 'sending'))
     OR NEW.id <> OLD.id OR NEW.deal_id <> OLD.deal_id OR NEW.dispute_id <> OLD.dispute_id
     OR NEW.seller_id <> OLD.seller_id OR NEW.kind <> OLD.kind
     OR NEW.request_id <> OLD.request_id
     OR NEW.packet_id IS DISTINCT FROM OLD.packet_id
     OR NEW.evidence_type IS DISTINCT FROM OLD.evidence_type
     OR NEW.note <> OLD.note OR NEW.note_sha256 <> OLD.note_sha256
     OR NEW.files <> OLD.files OR NEW.total_bytes <> OLD.total_bytes
     OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'dispute_actions: an action only moves on and keeps what was confirmed'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER dispute_actions_moves BEFORE UPDATE OR DELETE ON dispute_actions
  FOR EACH ROW EXECUTE FUNCTION pactpal_dispute_action_moves();
CREATE TRIGGER dispute_actions_no_truncate BEFORE TRUNCATE ON dispute_actions
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0025_dispute_answers",
    // Answering an inquiry (5h): a third dispute council job (help drafting an answer), and three
    // more seller sends (a message, a refund offer, accepting the claim) with the amount and offer
    // type, kept as confirmed like the others.
    sql: `ALTER TABLE claim_analyses DROP CONSTRAINT claim_analyses_kind_check;
ALTER TABLE claim_analyses ADD CONSTRAINT claim_analyses_kind_check
  CHECK (kind IN ('claim', 'summary', 'response'));

ALTER TABLE dispute_actions DROP CONSTRAINT dispute_actions_kind_check;
ALTER TABLE dispute_actions ADD CONSTRAINT dispute_actions_kind_check
  CHECK (kind IN ('escalate', 'evidence', 'message', 'offer', 'accept'));
ALTER TABLE dispute_actions ADD COLUMN offer_type text CHECK (offer_type ~ '^[A-Z_]{1,60}$');
ALTER TABLE dispute_actions ADD COLUMN amount_minor bigint CHECK (amount_minor > 0);
ALTER TABLE dispute_actions ADD COLUMN currency text CHECK (currency ~ '^[A-Z]{3}$');
ALTER TABLE dispute_actions ADD CONSTRAINT dispute_actions_offer_type
  CHECK ((kind = 'offer') = (offer_type IS NOT NULL));
ALTER TABLE dispute_actions ADD CONSTRAINT dispute_actions_amount
  CHECK ((kind IN ('offer', 'accept')) = (amount_minor IS NOT NULL AND currency IS NOT NULL));

CREATE OR REPLACE FUNCTION pactpal_dispute_action_moves() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE'
     OR NOT ((OLD.status = 'sending' AND NEW.status IN ('sent', 'unknown', 'refused'))
             OR (OLD.status = 'unknown' AND NEW.status = 'sending'))
     OR NEW.id <> OLD.id OR NEW.deal_id <> OLD.deal_id OR NEW.dispute_id <> OLD.dispute_id
     OR NEW.seller_id <> OLD.seller_id OR NEW.kind <> OLD.kind
     OR NEW.request_id <> OLD.request_id
     OR NEW.packet_id IS DISTINCT FROM OLD.packet_id
     OR NEW.evidence_type IS DISTINCT FROM OLD.evidence_type
     OR NEW.offer_type IS DISTINCT FROM OLD.offer_type
     OR NEW.amount_minor IS DISTINCT FROM OLD.amount_minor
     OR NEW.currency IS DISTINCT FROM OLD.currency
     OR NEW.note <> OLD.note OR NEW.note_sha256 <> OLD.note_sha256
     OR NEW.files <> OLD.files OR NEW.total_bytes <> OLD.total_bytes
     OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'dispute_actions: an action only moves on and keeps what was confirmed'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$`,
  },
  {
    id: "0026_appeal_check",
    // The appeal check (5i) is a fourth dispute council job: whether evidence not sent before
    // speaks to the claim PayPal decided for the buyer.
    sql: `ALTER TABLE claim_analyses DROP CONSTRAINT claim_analyses_kind_check;
ALTER TABLE claim_analyses ADD CONSTRAINT claim_analyses_kind_check
  CHECK (kind IN ('claim', 'summary', 'response', 'appeal'))`,
  },
  {
    id: "0027_appeal_statement",
    // The appeal statement (5i-2) is a fifth dispute council job, based on a ready appeal check
    // like a summary is on a comparison; the appeal itself is a seller send with a packet and an
    // evidence type, like evidence.
    sql: `ALTER TABLE claim_analyses DROP CONSTRAINT claim_analyses_kind_check;
ALTER TABLE claim_analyses ADD CONSTRAINT claim_analyses_kind_check
  CHECK (kind IN ('claim', 'summary', 'response', 'appeal', 'statement'));
ALTER TABLE claim_analyses DROP CONSTRAINT claim_analyses_based_on;
ALTER TABLE claim_analyses ADD CONSTRAINT claim_analyses_based_on
  CHECK ((kind IN ('summary', 'statement')) = (based_on IS NOT NULL));

ALTER TABLE dispute_actions DROP CONSTRAINT dispute_actions_kind_check;
ALTER TABLE dispute_actions ADD CONSTRAINT dispute_actions_kind_check
  CHECK (kind IN ('escalate', 'evidence', 'message', 'offer', 'accept', 'appeal'));
ALTER TABLE dispute_actions DROP CONSTRAINT dispute_actions_evidence_fields;
ALTER TABLE dispute_actions ADD CONSTRAINT dispute_actions_evidence_fields
  CHECK ((kind IN ('evidence', 'appeal')) = (packet_id IS NOT NULL AND evidence_type IS NOT NULL))`,
  },
  {
    id: "0028_dispute_notices",
    // Emails sent to the seller about disputes (5j): a new dispute, a change, PayPal's decision and
    // deadline reminders. Notices, not evidence: never in the log. One row per email key, kept.
    sql: `CREATE TABLE dispute_notices (
  key text PRIMARY KEY CHECK (char_length(key) BETWEEN 1 AND 256),
  deal_id uuid NOT NULL REFERENCES deals (id),
  dispute_id text NOT NULL REFERENCES disputes (dispute_id),
  kind text NOT NULL CHECK (kind IN ('opened', 'changed', 'decided', 'reminder')),
  ledger_seq integer,
  sent_at timestamptz NOT NULL,
  email_id text,
  failure text,
  CONSTRAINT dispute_notices_sent_or_refused CHECK ((email_id IS NULL) <> (failure IS NULL))
);
CREATE INDEX dispute_notices_by_dispute ON dispute_notices (dispute_id, sent_at DESC);
CREATE TRIGGER dispute_notices_append_only BEFORE UPDATE OR DELETE ON dispute_notices
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER dispute_notices_no_truncate BEFORE TRUNCATE ON dispute_notices
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0029_seller_connections",
    // Which PactPal seller is connected to which PayPal account through Partner Referrals (6c).
    // Not append-only (the status changes) and not evidence; a reconnection is a new row.
    sql: `CREATE TABLE seller_connections (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  method text NOT NULL CHECK (method IN ('partner')),
  tracking_id text NOT NULL UNIQUE CHECK (char_length(tracking_id) BETWEEN 1 AND 127),
  status text NOT NULL CHECK (status IN ('pending', 'connected', 'disconnected')),
  merchant_id text CHECK (merchant_id ~ '^[A-Za-z0-9]{1,64}$'),
  scopes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL,
  connected_at timestamptz,
  disconnected_at timestamptz,
  CONSTRAINT seller_connections_pending CHECK (
    status <> 'pending' OR (merchant_id IS NULL AND connected_at IS NULL AND disconnected_at IS NULL)),
  CONSTRAINT seller_connections_connected CHECK (
    status <> 'connected'
    OR (merchant_id IS NOT NULL AND connected_at IS NOT NULL AND disconnected_at IS NULL)),
  CONSTRAINT seller_connections_disconnected CHECK (
    status <> 'disconnected' OR disconnected_at IS NOT NULL)
);
-- One live connection per PactPal user, and one per PayPal account.
CREATE UNIQUE INDEX seller_connections_one_per_user ON seller_connections (user_id)
  WHERE status = 'connected';
CREATE UNIQUE INDEX seller_connections_one_per_account ON seller_connections (merchant_id)
  WHERE status = 'connected'`,
  },
  {
    id: "0030_seller_own_apps",
    // A seller's own sandbox REST app (6h): its client id, and its secret encrypted with a key held
    // outside the database. Linked directly (never pending); unlinking wipes the secret.
    sql: `ALTER TABLE seller_connections DROP CONSTRAINT seller_connections_method_check;
ALTER TABLE seller_connections ADD CONSTRAINT seller_connections_method_check
  CHECK (method IN ('partner', 'own_app'));
ALTER TABLE seller_connections ALTER COLUMN tracking_id DROP NOT NULL;
ALTER TABLE seller_connections
  ADD COLUMN client_id text CHECK (client_id ~ '^[A-Za-z0-9_-]{1,128}$'),
  ADD COLUMN client_secret_sealed text CHECK (char_length(client_secret_sealed) BETWEEN 1 AND 1024),
  ADD CONSTRAINT seller_connections_partner_fields CHECK (
    method <> 'partner'
    OR (tracking_id IS NOT NULL AND client_id IS NULL AND client_secret_sealed IS NULL)),
  ADD CONSTRAINT seller_connections_own_app_fields CHECK (
    method <> 'own_app'
    OR (tracking_id IS NULL AND client_id IS NOT NULL AND status <> 'pending'
        AND (status <> 'connected' OR client_secret_sealed IS NOT NULL))),
  ADD CONSTRAINT seller_connections_no_secret_once_ended CHECK (
    status <> 'disconnected' OR client_secret_sealed IS NULL)`,
  },
  {
    id: "0031_milestone_paypal_account",
    // Which PayPal account a stage's invoice is sent from (6h-3): a seller's own linked app, or
    // empty for PactPal's own sandbox seller app. Fixed at the reservation, so every retry, payment
    // check and dispute for that invoice uses the same account.
    sql: `ALTER TABLE milestones
  ADD COLUMN seller_connection_id uuid REFERENCES seller_connections (id)`,
  },
  {
    id: "0032_seller_app_alerts",
    // PayPal's id for the notification address registered on a seller's own app (6h-4). Not
    // secret; it is what that app's notifications are verified against. Own apps only.
    sql: `ALTER TABLE seller_connections
  ADD COLUMN webhook_id text CHECK (webhook_id ~ '^[A-Za-z0-9-]{1,64}$'),
  ADD CONSTRAINT seller_connections_webhook_own_app CHECK (method = 'own_app' OR webhook_id IS NULL)`,
  },
  {
    id: "0033_deal_messages",
    // The deal's chat (7b): messages from the seller and the buyer, each recorded by a
    // MESSAGE_SENT log entry holding its fingerprint, and PactPal's own cards (notices) from
    // "system", which point at the log entry they announce. Append-only: a message is never
    // edited or removed. client_id lets a page retry a post without making a second message.
    sql: `CREATE TABLE deal_messages (
  id uuid PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals (id),
  seq integer NOT NULL CHECK (seq >= 1),
  author_id uuid REFERENCES users (id),
  role text NOT NULL CHECK (role IN ('seller', 'buyer', 'system')),
  kind text NOT NULL CHECK (kind IN ('text', 'notice')),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  body_sha256 text NOT NULL CHECK (body_sha256 ~ '^[0-9a-f]{64}$'),
  notice jsonb,
  client_id text CHECK (client_id ~ '^[A-Za-z0-9_-]{8,64}$'),
  ledger_seq integer,
  created_at timestamptz NOT NULL,
  UNIQUE (deal_id, seq),
  UNIQUE (deal_id, author_id, client_id),
  FOREIGN KEY (deal_id, ledger_seq) REFERENCES ledger_entries (deal_id, seq),
  CONSTRAINT deal_messages_author CHECK ((role = 'system') = (author_id IS NULL)),
  CONSTRAINT deal_messages_text CHECK (
    kind <> 'text' OR (role <> 'system' AND notice IS NULL AND ledger_seq IS NOT NULL)),
  CONSTRAINT deal_messages_notice CHECK (
    kind <> 'notice' OR (role = 'system' AND notice IS NOT NULL AND client_id IS NULL))
);
CREATE TRIGGER deal_messages_append_only BEFORE UPDATE OR DELETE ON deal_messages
  FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change();
CREATE TRIGGER deal_messages_no_truncate BEFORE TRUNCATE ON deal_messages
  FOR EACH STATEMENT EXECUTE FUNCTION pactpal_forbid_change()`,
  },
  {
    id: "0034_message_reads",
    // How far each person has read a deal's chat (7c). Changes as they read, so not append-only;
    // the evidence is the MESSAGES_READ log entry, written when the position moves and at most
    // once a minute per person (logged_seq and logged_at say what was last logged).
    sql: `CREATE TABLE message_reads (
  deal_id uuid NOT NULL REFERENCES deals (id),
  user_id uuid NOT NULL REFERENCES users (id),
  read_seq integer NOT NULL CHECK (read_seq >= 0),
  logged_seq integer NOT NULL DEFAULT 0 CHECK (logged_seq >= 0 AND logged_seq <= read_seq),
  logged_at timestamptz,
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (deal_id, user_id)
)`,
  },
];
