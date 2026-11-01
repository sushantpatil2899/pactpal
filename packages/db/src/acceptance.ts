import { canonicalJson, sha256Hex, type JsonValue, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError, appendLedgerEvent } from "./ledger-store.js";

/** Why an acceptance step was refused. */
export type AcceptanceRefusal =
  /** The person is not this deal's seller (send, withdraw) or buyer (sign, decline). */
  | "not-your-deal"
  /** The deal is not at the stage this step needs (a draft to send, waiting otherwise). */
  | "wrong-status"
  /** Sending needs a buyer. */
  | "no-buyer"
  /** Sending needs a saved version of the agreed work. */
  | "no-scope"
  /** The version named is not the newest, or its fingerprint differs: the page is out of date. */
  | "stale";

export class AcceptanceNotAllowedError extends Error {
  override readonly name = "AcceptanceNotAllowedError";
  constructor(readonly reason: AcceptanceRefusal) {
    super(`The acceptance step was refused: ${reason}`);
  }
}

/** A stored acceptance no longer matches its fingerprint. */
export class AcceptanceIntegrityError extends Error {
  override readonly name = "AcceptanceIntegrityError";
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const version = z.number().int().min(1);

/** The fingerprint of an acceptance document: SHA-256 of its canonical JSON. */
export const documentFingerprint = (document: JsonValue): string =>
  sha256Hex(canonicalJson(document));

/** Where a step came from, recorded on its log entry. */
const origin = { ip: z.string().min(1).max(100).optional(), userAgent: z.string().optional() };

export const requestAcceptanceSchema = z.object({
  dealId: z.uuid(),
  sellerId: z.uuid(),
  version,
  contentSha256: sha256,
  documentSha256: sha256,
});
export type RequestAcceptance = z.input<typeof requestAcceptanceSchema>;

export const withdrawAcceptanceSchema = z.object({ dealId: z.uuid(), sellerId: z.uuid() });
export type WithdrawAcceptance = z.input<typeof withdrawAcceptanceSchema>;

/** The name a buyer types to sign: 2 to 200 characters after trimming, compared with nothing. */
export const typedNameSchema = z.string().trim().min(2).max(200);

export const acceptTermsSchema = z.object({
  dealId: z.uuid(),
  buyerId: z.uuid(),
  version,
  contentSha256: sha256,
  /** The terms exactly as shown; stored whole, and fingerprinted here. */
  document: z.json(),
  noticeVersion: z.number().int().min(1),
  typedName: typedNameSchema,
  /** How the buyer reached the page: their buyer link, or signed in with PayPal. */
  access: z.enum(["link", "paypal"]),
  ...origin,
});
export type AcceptTerms = z.input<typeof acceptTermsSchema>;

/** A decline's optional reason: up to 1,000 characters; blank counts as none. */
export const declineReasonSchema = z
  .string()
  .trim()
  .max(1000)
  .transform((text) => (text === "" ? undefined : text));

export const declineTermsSchema = z.object({
  dealId: z.uuid(),
  buyerId: z.uuid(),
  version,
  documentSha256: sha256,
  reason: declineReasonSchema.optional(),
  ...origin,
});
export type DeclineTerms = z.input<typeof declineTermsSchema>;

const lockedDeal = z.object({
  seller_id: z.string(),
  buyer_id: z.string().nullable(),
  status: z.enum(DEAL_STATUSES),
});
const newestVersion = z.object({ version: z.number().int(), content_sha256: z.string() });

type Status = (typeof DEAL_STATUSES)[number];

/**
 * Locks the deal row and checks that `userId` is its `role` and that it is at `status`; then,
 * when `expected` is given, that the newest version of the agreed work is that version with that
 * fingerprint. Every acceptance step starts here, inside its transaction.
 */
async function lockFor(
  tx: Queryable,
  dealId: string,
  check: {
    role: "seller" | "buyer";
    userId: string;
    status: Status;
    /** Sending needs a buyer. */
    needsBuyer?: boolean;
    expected?: { version: number; contentSha256?: string };
  },
): Promise<void> {
  const rows = await tx.query(
    "SELECT seller_id, buyer_id, status FROM deals WHERE id = $1 FOR UPDATE",
    [dealId],
  );
  const deal = lockedDeal.safeParse(rows[0]);
  if (!deal.success) throw new DealNotFoundError(`No deal ${dealId}`);
  const party = check.role === "seller" ? deal.data.seller_id : deal.data.buyer_id;
  if (party !== check.userId) throw new AcceptanceNotAllowedError("not-your-deal");
  if (deal.data.status !== check.status) throw new AcceptanceNotAllowedError("wrong-status");
  if (check.needsBuyer === true && deal.data.buyer_id === null) {
    throw new AcceptanceNotAllowedError("no-buyer");
  }
  if (check.expected) {
    const latest = await tx.query(
      `SELECT version, content_sha256 FROM scope_versions WHERE deal_id = $1
        ORDER BY version DESC LIMIT 1`,
      [dealId],
    );
    const newest = newestVersion.safeParse(latest[0]);
    if (!newest.success) throw new AcceptanceNotAllowedError("no-scope");
    const { version: wanted, contentSha256 } = check.expected;
    if (
      newest.data.version !== wanted ||
      (contentSha256 !== undefined && newest.data.content_sha256 !== contentSha256)
    ) {
      throw new AcceptanceNotAllowedError("stale");
    }
  }
}

/** The connection details of a buyer's step, for its log entry; absent ones are left out. */
const originOf = ({
  ip,
  userAgent,
}: {
  ip?: string | undefined;
  userAgent?: string | undefined;
}) => ({
  ...(ip === undefined ? {} : { ip }),
  ...(userAgent === undefined ? {} : { userAgent }),
});

async function setStatus(tx: Queryable, dealId: string, status: Status, now: Date) {
  await tx.query("UPDATE deals SET status = $2, updated_at = $3 WHERE id = $1", [
    dealId,
    status,
    now,
  ]);
}

/** The version the deal is waiting on: the newest, since editing is draft-only. */
async function waitingVersion(tx: Queryable, dealId: string): Promise<number> {
  const rows = await tx.query(
    "SELECT COALESCE(MAX(version), 0) AS last FROM scope_versions WHERE deal_id = $1",
    [dealId],
  );
  return z.object({ last: z.coerce.number().int() }).parse(rows[0]).last;
}

/**
 * The seller asks the buyer to accept the newest version: the deal moves from draft to
 * `awaiting_acceptance` with an `ACCEPTANCE_REQUESTED` entry naming the version and the
 * fingerprints of its content and of the document the buyer will see. Needs a buyer, and the
 * version must still be the newest (the seller's page may be out of date).
 */
export async function requestAcceptance(
  db: Database,
  input: RequestAcceptance,
  now: Date,
): Promise<LedgerEntry> {
  const request = requestAcceptanceSchema.parse(input);
  return db.transaction(async (tx) => {
    await lockFor(tx, request.dealId, {
      role: "seller",
      userId: request.sellerId,
      status: "draft",
      needsBuyer: true,
      expected: { version: request.version, contentSha256: request.contentSha256 },
    });
    await setStatus(tx, request.dealId, "awaiting_acceptance", now);
    return appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "ACCEPTANCE_REQUESTED",
        actor: "seller",
        actorId: request.sellerId,
        payload: {
          version: request.version,
          contentSha256: request.contentSha256,
          documentSha256: request.documentSha256,
        },
      },
      now,
    );
  });
}

/** The seller takes back a request the buyer has not answered: the deal is a draft again. */
export async function withdrawAcceptance(
  db: Database,
  input: WithdrawAcceptance,
  now: Date,
): Promise<LedgerEntry> {
  const request = withdrawAcceptanceSchema.parse(input);
  return db.transaction(async (tx) => {
    await lockFor(tx, request.dealId, {
      role: "seller",
      userId: request.sellerId,
      status: "awaiting_acceptance",
    });
    await setStatus(tx, request.dealId, "draft", now);
    return appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "ACCEPTANCE_WITHDRAWN",
        actor: "seller",
        actorId: request.sellerId,
        payload: { version: await waitingVersion(tx, request.dealId) },
      },
      now,
    );
  });
}

/** The stored columns, named as the record's fields. */
const ACCEPTANCE_COLUMNS = `deal_id AS "dealId", version, document, document_sha256 AS "documentSha256",
  buyer_id AS "buyerId", typed_name AS "typedName", ledger_seq AS "ledgerSeq",
  created_at AS "createdAt"`;

const acceptanceRow = z.object({
  dealId: z.string(),
  version: z.number().int(),
  document: z.json(),
  documentSha256: z.string(),
  buyerId: z.string(),
  typedName: z.string(),
  ledgerSeq: z.number().int(),
  createdAt: z.date(),
});
export type Acceptance = z.output<typeof acceptanceRow>;

/** Checks a stored acceptance against its fingerprint before it is trusted. */
function checkedAcceptance(row: unknown): Acceptance {
  const stored = acceptanceRow.parse(row);
  if (documentFingerprint(stored.document) !== stored.documentSha256) {
    throw new AcceptanceIntegrityError(
      `Deal ${stored.dealId} acceptance of version ${String(stored.version)}: the document does not match its fingerprint`,
    );
  }
  return stored;
}

/**
 * The buyer signs: the document they saw is stored whole with its fingerprint and their typed
 * name, an `ACCEPTED` entry records the same (with where they connected from), and the deal
 * becomes `active`, all in one transaction. The version must still be the one waiting, with the
 * same content fingerprint.
 */
export async function acceptTerms(
  db: Database,
  input: AcceptTerms,
  now: Date,
): Promise<{ acceptance: Acceptance; entry: LedgerEntry }> {
  const request = acceptTermsSchema.parse(input);
  const documentSha256 = documentFingerprint(request.document);
  return db.transaction(async (tx) => {
    await lockFor(tx, request.dealId, {
      role: "buyer",
      userId: request.buyerId,
      status: "awaiting_acceptance",
      expected: { version: request.version, contentSha256: request.contentSha256 },
    });
    await setStatus(tx, request.dealId, "active", now);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "ACCEPTED",
        actor: "buyer",
        actorId: request.buyerId,
        payload: {
          version: request.version,
          contentSha256: request.contentSha256,
          documentSha256,
          typedName: request.typedName,
          noticeVersion: request.noticeVersion,
          access: request.access,
        },
        ...originOf(request),
      },
      now,
    );
    const saved = await tx.query(
      `INSERT INTO acceptances (deal_id, version, document, document_sha256, buyer_id, typed_name,
                                ledger_seq, created_at)
       VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8)
       RETURNING ${ACCEPTANCE_COLUMNS}`,
      [
        request.dealId,
        request.version,
        JSON.stringify(request.document),
        documentSha256,
        request.buyerId,
        request.typedName,
        entry.seq,
        now,
      ],
    );
    return { acceptance: checkedAcceptance(saved[0]), entry };
  });
}

/**
 * The buyer declines, with an optional reason: a `DECLINED` entry records it (with where they
 * connected from) and the deal is a draft again, so the seller can change the terms and resend.
 */
export async function declineTerms(
  db: Database,
  input: DeclineTerms,
  now: Date,
): Promise<LedgerEntry> {
  const request = declineTermsSchema.parse(input);
  return db.transaction(async (tx) => {
    await lockFor(tx, request.dealId, {
      role: "buyer",
      userId: request.buyerId,
      status: "awaiting_acceptance",
      expected: { version: request.version },
    });
    await setStatus(tx, request.dealId, "draft", now);
    return appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "DECLINED",
        actor: "buyer",
        actorId: request.buyerId,
        payload: {
          version: request.version,
          documentSha256: request.documentSha256,
          ...(request.reason === undefined ? {} : { reason: request.reason }),
        },
        ...originOf(request),
      },
      now,
    );
  });
}

/** The deal's newest acceptance, checked against its fingerprint; undefined if never signed. */
export async function getLatestAcceptance(
  q: Queryable,
  dealId: string,
): Promise<Acceptance | undefined> {
  const rows = await q.query(
    `SELECT ${ACCEPTANCE_COLUMNS} FROM acceptances WHERE deal_id = $1
      ORDER BY ledger_seq DESC LIMIT 1`,
    [dealId],
  );
  return rows[0] === undefined ? undefined : checkedAcceptance(rows[0]);
}
