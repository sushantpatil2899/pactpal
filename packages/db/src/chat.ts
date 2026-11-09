import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import { originOf } from "./acceptance.js";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { appendLedgerEvent } from "./ledger-store.js";

/** The longest chat message, in characters. */
export const MAX_MESSAGE_CHARS = 4000;
/** At most this many messages per deal, so one page cannot fill the database. */
export const MAX_MESSAGES_PER_DEAL = 5000;
/** The most messages one read returns; a page reads on from the last one it has. */
export const MESSAGE_PAGE_SIZE = 200;

/**
 * What a card from PactPal in the chat is about: the agreement sent for review (or withdrawn),
 * the buyer asking for changes or signing, a timeline step changing, or a reminder. The words
 * shown are in `body`; these fields let pages link the card to the right tab.
 */
export const chatNoticeSchema = z.strictObject({
  type: z.enum([
    "review-requested",
    "review-withdrawn",
    "changes-requested",
    "signed",
    "step",
    "reminder",
  ]),
  version: z.number().int().min(1).optional(),
  step: z.number().int().min(1).optional(),
});
export type ChatNotice = z.output<typeof chatNoticeSchema>;

export type ChatRole = "seller" | "buyer" | "system";

/** Why a message was not posted. */
export type ChatRefusal =
  /** Not this deal's seller or buyer. */
  | "not-your-deal"
  /** The deal was cancelled; its chat is closed. */
  | "closed"
  /** The deal already has the most messages allowed. */
  | "too-many";

export class ChatNotAllowedError extends Error {
  override readonly name = "ChatNotAllowedError";
  constructor(readonly reason: ChatRefusal) {
    super(`The message was not posted: ${reason}`);
  }
}

const messageRow = z.object({
  id: z.string(),
  dealId: z.string(),
  seq: z.number().int(),
  authorId: z.string().nullable(),
  role: z.enum(["seller", "buyer", "system"]),
  kind: z.enum(["text", "notice"]),
  body: z.string(),
  bodySha256: z.string(),
  notice: chatNoticeSchema.nullable(),
  clientId: z.string().nullable(),
  ledgerSeq: z.number().int().nullable(),
  createdAt: z.date(),
});
export type ChatMessage = z.output<typeof messageRow>;

const COLUMNS = `id, deal_id AS "dealId", seq, author_id AS "authorId", role, kind, body,
  body_sha256 AS "bodySha256", notice, client_id AS "clientId", ledger_seq AS "ledgerSeq",
  created_at AS "createdAt"`;

const body = z.string().trim().min(1).max(MAX_MESSAGE_CHARS);
const lastSeq = z.object({ last: z.coerce.number().int(), count: z.coerce.number().int() });

export const newMessageSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  authorId: z.uuid(),
  body,
  /** Chosen by the page for each message, so a retried post is the same message. */
  clientId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{8,64}$/)
    .optional(),
  ip: z.string().max(100).optional(),
  userAgent: z.string().max(1000).optional(),
});
export type NewMessage = z.input<typeof newMessageSchema>;

/** The next position in a deal's chat and how many messages it has. Inside a transaction. */
async function nextSeq(tx: Queryable, dealId: string) {
  const rows = await tx.query(
    "SELECT COALESCE(MAX(seq), 0) AS last, COUNT(*) AS count FROM deal_messages WHERE deal_id = $1",
    [dealId],
  );
  const { last, count } = lastSeq.parse(rows[0]);
  return { seq: last + 1, count };
}

async function insertMessage(
  tx: Queryable,
  row: Omit<ChatMessage, "bodySha256" | "createdAt">,
  now: Date,
): Promise<ChatMessage> {
  const saved = await tx.query(
    `INSERT INTO deal_messages (id, deal_id, seq, author_id, role, kind, body, body_sha256, notice,
                                client_id, ledger_seq, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12)
     RETURNING ${COLUMNS}`,
    [
      row.id,
      row.dealId,
      row.seq,
      row.authorId,
      row.role,
      row.kind,
      row.body,
      sha256Hex(row.body),
      row.notice === null ? null : JSON.stringify(row.notice),
      row.clientId,
      row.ledgerSeq,
      now,
    ],
  );
  return messageRow.parse(saved[0]);
}

/**
 * Posts a message from the deal's seller or buyer, in one transaction with its `MESSAGE_SENT`
 * log entry (the message id, its position, and the text's fingerprint and length; the text
 * itself stays in the table). The deal row is locked, so two posts at once get different
 * positions. A post repeating a `clientId` the author already used returns that message and
 * writes nothing (`created: false`).
 */
export async function postMessage(
  db: Database,
  input: NewMessage,
  now: Date,
): Promise<{ message: ChatMessage; created: boolean; entry?: LedgerEntry }> {
  const message = newMessageSchema.parse(input);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, message.dealId);
    const role =
      deal.seller_id === message.authorId
        ? "seller"
        : deal.buyer_id === message.authorId
          ? "buyer"
          : undefined;
    if (role === undefined) throw new ChatNotAllowedError("not-your-deal");
    if (message.clientId !== undefined) {
      const earlier = await tx.query(
        `SELECT ${COLUMNS} FROM deal_messages
          WHERE deal_id = $1 AND author_id = $2 AND client_id = $3`,
        [message.dealId, message.authorId, message.clientId],
      );
      if (earlier[0] !== undefined)
        return { message: messageRow.parse(earlier[0]), created: false };
    }
    if (deal.status === "cancelled") throw new ChatNotAllowedError("closed");
    const { seq, count } = await nextSeq(tx, message.dealId);
    if (count >= MAX_MESSAGES_PER_DEAL) throw new ChatNotAllowedError("too-many");
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: message.dealId,
        type: "MESSAGE_SENT",
        actor: role,
        actorId: message.authorId,
        payload: {
          messageId: message.id,
          seq,
          bodySha256: sha256Hex(message.body),
          chars: message.body.length,
        },
        ...originOf(message),
      },
      now,
    );
    const saved = await insertMessage(
      tx,
      {
        id: message.id,
        dealId: message.dealId,
        seq,
        authorId: message.authorId,
        role,
        kind: "text",
        body: message.body,
        notice: null,
        clientId: message.clientId ?? null,
        ledgerSeq: entry.seq,
      },
      now,
    );
    return { message: saved, created: true, entry };
  });
}

/**
 * Posts a card from PactPal into a deal's chat: `body` is the words shown, `notice` what it is
 * about and `ledgerSeq` the log entry it announces, if any. Call inside the transaction that
 * records what it announces, after its log entry, so both are saved or neither.
 */
export async function postNotice(
  tx: Queryable,
  input: { id: string; dealId: string; body: string; notice: ChatNotice; ledgerSeq?: number },
  now: Date,
): Promise<ChatMessage> {
  const words = body.parse(input.body);
  const notice = chatNoticeSchema.parse(input.notice);
  const { seq } = await nextSeq(tx, input.dealId);
  return insertMessage(
    tx,
    {
      id: z.uuid().parse(input.id),
      dealId: input.dealId,
      seq,
      authorId: null,
      role: "system",
      kind: "notice",
      body: words,
      notice,
      clientId: null,
      ledgerSeq: input.ledgerSeq ?? null,
    },
    now,
  );
}

/**
 * A deal's messages after position `afterSeq` (0 for the start), oldest first, at most
 * `MESSAGE_PAGE_SIZE`. Each text is checked against its fingerprint before it is returned.
 */
export async function listMessages(
  q: Queryable,
  dealId: string,
  afterSeq = 0,
): Promise<ChatMessage[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM deal_messages WHERE deal_id = $1 AND seq > $2 ORDER BY seq LIMIT $3`,
    [dealId, afterSeq, MESSAGE_PAGE_SIZE],
  );
  return rows.map((row) => checkedMessage(row));
}

/** Every message of a deal after position `after`, oldest first, read a page at a time. */
export async function listAllMessages(
  q: Queryable,
  dealId: string,
  after = 0,
): Promise<ChatMessage[]> {
  const all: ChatMessage[] = [];
  for (let from = after; ;) {
    const page = await listMessages(q, dealId, from);
    all.push(...page);
    if (page.length < MESSAGE_PAGE_SIZE) return all;
    from = page.at(-1)?.seq ?? from;
  }
}

/** A stored message no longer matches its fingerprint. */
export class ChatIntegrityError extends Error {
  override readonly name = "ChatIntegrityError";
}

function checkedMessage(row: unknown): ChatMessage {
  const message = messageRow.parse(row);
  if (sha256Hex(message.body) !== message.bodySha256) {
    throw new ChatIntegrityError(
      `Deal ${message.dealId} message ${String(message.seq)} does not match its fingerprint`,
    );
  }
  return message;
}

/** How often, at most, a person's reading is written to the log while they keep reading. */
export const READ_LOG_INTERVAL_MS = 60_000;

const readRow = z.object({
  read_seq: z.number().int(),
  logged_seq: z.number().int(),
  logged_at: z.date().nullable(),
});
const maxSeq = z.object({ last: z.coerce.number().int() });

/**
 * Records that the deal's seller or buyer has read the chat up to position `seq` (never past
 * its last message, never backwards). The log gets a `MESSAGES_READ` entry when the position
 * has moved past what was last logged, at most once per `READ_LOG_INTERVAL_MS`, or whenever
 * `flush` is set (a page closing), so the last position read always reaches the log.
 */
export async function markRead(
  db: Database,
  input: { dealId: string; userId: string; seq: number; flush?: boolean },
  now: Date,
): Promise<{ readSeq: number; moved: boolean; entry?: LedgerEntry }> {
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, input.dealId);
    const role =
      deal.seller_id === input.userId
        ? "seller"
        : deal.buyer_id === input.userId
          ? "buyer"
          : undefined;
    if (role === undefined) throw new ChatNotAllowedError("not-your-deal");
    const rows = await tx.query(
      "SELECT read_seq, logged_seq, logged_at FROM message_reads WHERE deal_id = $1 AND user_id = $2",
      [input.dealId, input.userId],
    );
    const before = rows[0] === undefined ? undefined : readRow.parse(rows[0]);
    const { last } = maxSeq.parse(
      (
        await tx.query(
          "SELECT COALESCE(MAX(seq), 0) AS last FROM deal_messages WHERE deal_id = $1",
          [input.dealId],
        )
      )[0],
    );
    const readSeq = Math.max(before?.read_seq ?? 0, Math.min(Math.max(input.seq, 0), last));
    const moved = readSeq > (before?.read_seq ?? 0);
    const loggedSeq = before?.logged_seq ?? 0;
    const due =
      input.flush === true ||
      !before?.logged_at ||
      now.getTime() - before.logged_at.getTime() >= READ_LOG_INTERVAL_MS;
    const entry =
      readSeq > loggedSeq && due
        ? await appendLedgerEvent(
            tx,
            {
              dealId: input.dealId,
              type: "MESSAGES_READ",
              actor: role,
              actorId: input.userId,
              payload: { upToSeq: readSeq },
            },
            now,
          )
        : undefined;
    await tx.query(
      `INSERT INTO message_reads (deal_id, user_id, read_seq, logged_seq, logged_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (deal_id, user_id) DO UPDATE
         SET read_seq = $3, logged_seq = $4, logged_at = $5, updated_at = $6`,
      [
        input.dealId,
        input.userId,
        readSeq,
        entry ? readSeq : loggedSeq,
        entry ? now : (before?.logged_at ?? null),
        now,
      ],
    );
    return { readSeq, moved, ...(entry ? { entry } : {}) };
  });
}

/** How far each side has read the deal's chat, by role (0 before they read anything). */
export async function readPositions(
  q: Queryable,
  deal: { id: string; sellerId: string; buyerId?: string | undefined },
): Promise<{ seller: number; buyer: number }> {
  const rows = await q.query("SELECT user_id, read_seq FROM message_reads WHERE deal_id = $1", [
    deal.id,
  ]);
  const positions = z
    .array(z.object({ user_id: z.string(), read_seq: z.number().int() }))
    .parse(rows);
  const of = (userId: string | undefined) =>
    positions.find((row) => row.user_id === userId)?.read_seq ?? 0;
  return { seller: of(deal.sellerId), buyer: of(deal.buyerId) };
}
