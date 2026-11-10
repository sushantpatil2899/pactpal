import { canonicalJson, sha256Hex } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { readableCode } from "./intake.js";
import { appendLedgerEvent } from "./ledger-store.js";
import { hashToken } from "./sessions.js";

/** What an agent may ask the seller to let it do (8c): nothing else, and never for a buyer. */
export const AGENT_REQUEST_KINDS = ["send-invoice", "send-evidence"] as const;
export type AgentRequestKind = (typeof AGENT_REQUEST_KINDS)[number];

export const AGENT_REQUEST_STATUSES = [
  "waiting",
  "approved",
  "declined",
  "done",
  "failed",
  "expired",
] as const;
export type AgentRequestStatus = (typeof AGENT_REQUEST_STATUSES)[number];

/** How long an approval's code works. */
export const AGENT_CODE_LIFETIME_MS = 10 * 60 * 1000;
/** Wrong codes allowed before the approval is spent. */
export const MAX_WRONG_CODES = 5;
/** Characters in a code (5 bits each), shown as two groups of five. */
const CODE_LENGTH = 10;

const row = z
  .object({
    id: z.string(),
    seller_id: z.string(),
    deal_id: z.string(),
    key_ending: z.string(),
    kind: z.enum(AGENT_REQUEST_KINDS),
    path: z.string(),
    body: z.unknown(),
    body_sha256: z.string(),
    summary: z.string(),
    status: z.enum(AGENT_REQUEST_STATUSES),
    code_expires_at: z.date().nullable(),
    created_at: z.date(),
    answered_at: z.date().nullable(),
    used_at: z.date().nullable(),
    result_status: z.number().int().nullable(),
    result_error: z.string().nullable(),
  })
  .transform((r) => ({
    id: r.id,
    sellerId: r.seller_id,
    dealId: r.deal_id,
    keyEnding: r.key_ending,
    kind: r.kind,
    path: r.path,
    body: r.body,
    bodySha256: r.body_sha256,
    summary: r.summary,
    status: r.status,
    codeExpiresAt: r.code_expires_at ?? undefined,
    createdAt: r.created_at,
    answeredAt: r.answered_at ?? undefined,
    usedAt: r.used_at ?? undefined,
    resultStatus: r.result_status ?? undefined,
    resultError: r.result_error ?? undefined,
  }));
/** An agent's request as stored: never the code, only whether one was given. */
export type AgentRequest = z.output<typeof row>;

const COLUMNS = `id, seller_id, deal_id, key_ending, kind, path, body, body_sha256, summary, status,
  code_expires_at, created_at, answered_at, used_at, result_status, result_error`;

const newRequestSchema = z.object({
  id: z.uuid(),
  sellerId: z.uuid(),
  dealId: z.uuid(),
  keyEnding: z.string().length(4),
  kind: z.enum(AGENT_REQUEST_KINDS),
  path: z.string().regex(/^\/api\/deals\/[\w/-]+$/),
  body: z.record(z.string(), z.unknown()),
  summary: z.string().trim().min(1).max(2000),
});
export type NewAgentRequest = z.input<typeof newRequestSchema>;

/** The fingerprint of a request's exact body. */
export const agentBodySha256 = (body: Record<string, unknown>) => sha256Hex(canonicalJson(body));

/**
 * Stores what an agent asks to do, waiting for the seller, with an `AGENT_REQUESTED` log entry
 * (the kind, the key's last 4 characters and the body's fingerprint; never the body).
 */
export async function createAgentRequest(
  db: Database,
  input: NewAgentRequest,
  now: Date,
): Promise<AgentRequest> {
  const made = newRequestSchema.parse(input);
  const bodySha256 = agentBodySha256(made.body);
  return db.transaction(async (tx) => {
    await lockDeal(tx, made.dealId);
    const rows = await tx.query(
      `INSERT INTO agent_requests (id, seller_id, deal_id, key_ending, kind, path, body, body_sha256,
                                   summary, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'waiting', $10)
       RETURNING ${COLUMNS}`,
      [
        made.id,
        made.sellerId,
        made.dealId,
        made.keyEnding,
        made.kind,
        made.path,
        JSON.stringify(made.body),
        bodySha256,
        made.summary,
        now,
      ],
    );
    await appendLedgerEvent(
      tx,
      {
        dealId: made.dealId,
        type: "AGENT_REQUESTED",
        actor: "seller",
        actorId: made.sellerId,
        payload: { requestId: made.id, kind: made.kind, keyEnding: made.keyEnding, bodySha256 },
      },
      now,
    );
    return row.parse(rows[0]);
  });
}

/** One request of a seller's, or undefined (also for another seller's). */
export async function getAgentRequest(
  q: Queryable,
  sellerId: string,
  id: string,
): Promise<AgentRequest | undefined> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM agent_requests WHERE id = $1 AND seller_id = $2`,
    [id, sellerId],
  );
  return rows[0] === undefined ? undefined : row.parse(rows[0]);
}

/** A seller's requests still open (waiting, or approved and not used), newest first. */
export async function listOpenAgentRequests(
  q: Queryable,
  sellerId: string,
  dealId?: string,
): Promise<AgentRequest[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM agent_requests
      WHERE seller_id = $1 AND ($2::uuid IS NULL OR deal_id = $2)
        AND (status = 'waiting' OR (status = 'approved' AND used_at IS NULL))
      ORDER BY created_at DESC LIMIT 20`,
    [sellerId, dealId ?? null],
  );
  return rows.map((r) => row.parse(r));
}

/** A code as the seller reads it: upper case, in two groups of five. */
const shownCode = (code: string) => `${code.slice(0, 5)}-${code.slice(5)}`.toUpperCase();
/** A code as typed: case, spaces and dashes do not matter. */
const typedCode = (code: string) => code.toLowerCase().replace(/[\s-]/g, "");

/** Why a request could not be answered or used. */
export type AgentRequestRefusal =
  "not-found" | "not-waiting" | "not-approved" | "used" | "expired" | "wrong-code";

/**
 * The seller answers a waiting request: approving gives a one-time code (returned only now;
 * its hash is kept) that works for 10 minutes; declining ends it. Logs `AGENT_REQUEST_ANSWERED`.
 */
export async function answerAgentRequest(
  db: Database,
  input: { id: string; sellerId: string; approve: boolean },
  now: Date,
): Promise<
  { ok: true; request: AgentRequest; code?: string } | { ok: false; reason: AgentRequestRefusal }
> {
  return db.transaction(async (tx) => {
    const found = await lockedRequest(tx, input.sellerId, input.id);
    if (!found) return { ok: false, reason: "not-found" } as const;
    await lockDeal(tx, found.dealId);
    if (found.status !== "waiting") return { ok: false, reason: "not-waiting" } as const;
    const code = input.approve ? readableCode(CODE_LENGTH) : undefined;
    const rows = await tx.query(
      `UPDATE agent_requests SET status = $2, answered_at = $3, code_hash = $4,
              code_expires_at = $5
        WHERE id = $1 RETURNING ${COLUMNS}`,
      [
        found.id,
        input.approve ? "approved" : "declined",
        now,
        code === undefined ? null : hashToken(code),
        code === undefined ? null : new Date(now.getTime() + AGENT_CODE_LIFETIME_MS),
      ],
    );
    await appendLedgerEvent(
      tx,
      {
        dealId: found.dealId,
        type: "AGENT_REQUEST_ANSWERED",
        actor: "seller",
        actorId: input.sellerId,
        payload: { requestId: found.id, answer: input.approve ? "approved" : "declined" },
      },
      now,
    );
    const request = row.parse(rows[0]);
    return code === undefined
      ? ({ ok: true, request } as const)
      : ({ ok: true, request, code: shownCode(code) } as const);
  });
}

async function lockedRequest(tx: Queryable, sellerId: string, id: string) {
  const rows = await tx.query(
    `SELECT ${COLUMNS}, code_hash, wrong_codes FROM agent_requests
      WHERE id = $1 AND seller_id = $2 FOR UPDATE`,
    [id, sellerId],
  );
  if (rows[0] === undefined) return undefined;
  const extra = z
    .object({ code_hash: z.string().nullable(), wrong_codes: z.number().int() })
    .parse(rows[0]);
  return { ...row.parse(rows[0]), codeHash: extra.code_hash, wrongCodes: extra.wrong_codes };
}

/**
 * Uses an approval's code once: the request must be approved, not used, within its 10 minutes
 * and the code must match. A late code ends the approval (`expired`); five wrong codes spend it.
 * On success the request is marked used and returned with its exact body to run.
 */
export async function claimAgentRequest(
  db: Database,
  input: { id: string; sellerId: string; code: string },
  now: Date,
): Promise<{ ok: true; request: AgentRequest } | { ok: false; reason: AgentRequestRefusal }> {
  return db.transaction(async (tx) => {
    const found = await lockedRequest(tx, input.sellerId, input.id);
    if (!found) return { ok: false, reason: "not-found" } as const;
    if (found.status === "expired") return { ok: false, reason: "expired" } as const;
    if (found.status !== "approved") {
      return {
        ok: false,
        reason: found.status === "waiting" ? "not-approved" : "used",
      } as const;
    }
    if (found.usedAt !== undefined) return { ok: false, reason: "used" } as const;
    const late = found.codeExpiresAt === undefined || now > found.codeExpiresAt;
    const wrong = found.codeHash !== hashToken(typedCode(input.code));
    if (late || (wrong && found.wrongCodes + 1 >= MAX_WRONG_CODES)) {
      await tx.query(
        "UPDATE agent_requests SET status = 'expired', wrong_codes = wrong_codes + $2 WHERE id = $1",
        [found.id, wrong ? 1 : 0],
      );
      return { ok: false, reason: late ? "expired" : "wrong-code" } as const;
    }
    if (wrong) {
      await tx.query("UPDATE agent_requests SET wrong_codes = wrong_codes + 1 WHERE id = $1", [
        found.id,
      ]);
      return { ok: false, reason: "wrong-code" } as const;
    }
    const rows = await tx.query(
      `UPDATE agent_requests SET used_at = $2 WHERE id = $1 RETURNING ${COLUMNS}`,
      [found.id, now],
    );
    return { ok: true, request: row.parse(rows[0]) } as const;
  });
}

/**
 * Records how a used request ended (`done` or `failed`, the answer's HTTP status and a short
 * error), with an `AGENT_ACTED` log entry. The action's own entry (such as `INVOICE_SENT`) is
 * written by the step that ran it.
 */
export async function finishAgentRequest(
  db: Database,
  input: { id: string; sellerId: string; ok: boolean; status: number; error?: string },
  now: Date,
): Promise<AgentRequest> {
  return db.transaction(async (tx) => {
    const found = await lockedRequest(tx, input.sellerId, input.id);
    if (found?.status !== "approved" || found.usedAt === undefined) {
      throw new Error("agent_requests: only a used approval can be finished");
    }
    await lockDeal(tx, found.dealId);
    const rows = await tx.query(
      `UPDATE agent_requests SET status = $2, result_status = $3, result_error = $4
        WHERE id = $1 RETURNING ${COLUMNS}`,
      [found.id, input.ok ? "done" : "failed", input.status, input.error?.slice(0, 300) ?? null],
    );
    await appendLedgerEvent(
      tx,
      {
        dealId: found.dealId,
        type: "AGENT_ACTED",
        actor: "seller",
        actorId: input.sellerId,
        payload: {
          requestId: found.id,
          kind: found.kind,
          result: input.ok ? "done" : "failed",
          status: input.status,
        },
      },
      now,
    );
    return row.parse(rows[0]);
  });
}
