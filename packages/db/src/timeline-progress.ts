import { sha256Hex, type EventType, type LedgerEntry } from "@pactpal/ledger";
import {
  allowedUpdates,
  timelineOf,
  timelineProgress,
  type StepUpdate,
  type StepUpdateStatus,
} from "@pactpal/timeline";
import { z } from "zod";
import { originOf } from "./acceptance.js";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { appendLedgerEvent } from "./ledger-store.js";
import { postNotice } from "./chat.js";
import { getScopeVersion } from "./scope.js";
import { signedVersionOf } from "./signed.js";

/** Why a step update was refused. */
export type StepRefusal =
  /** Not this deal's seller or buyer. */
  | "not-your-deal"
  /** The deal is not signed and running (draft, waiting for a signature, or finished). */
  | "not-running"
  /** The signed timeline has no such step. */
  | "no-step"
  /** That update does not fit the step's kind, its state, or who is asking. */
  | "not-allowed"
  /** A file named is not a file of this deal. */
  | "no-file";

export class StepNotAllowedError extends Error {
  override readonly name = "StepNotAllowedError";
  constructor(readonly reason: StepRefusal) {
    super(`The step update was refused: ${reason}`);
  }
}

const EVENT_FOR: Record<StepUpdateStatus, EventType> = {
  submitted: "STEP_SUBMITTED",
  approved: "STEP_APPROVED",
  changes: "STEP_CHANGES_REQUESTED",
  done: "STEP_DONE",
};

export const stepUpdateSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  actorId: z.uuid(),
  /** The step's number in the signed timeline, from 1. */
  step: z.number().int().min(1),
  status: z.enum(["submitted", "approved", "changes", "done"]),
  note: z.string().trim().min(1).max(1000).optional(),
  /** Files already added to the deal (by either side) that go with the update. */
  fileIds: z.array(z.uuid()).max(10).default([]),
  ip: z.string().max(100).optional(),
  userAgent: z.string().max(1000).optional(),
});
export type NewStepUpdate = z.input<typeof stepUpdateSchema>;

const fileRef = z.object({ id: z.string(), filename: z.string(), sha256: z.string() });

const updateRow = z.object({
  id: z.string(),
  step: z.number().int(),
  status: z.enum(["submitted", "approved", "changes", "done"]),
  actor: z.enum(["seller", "buyer"]),
  note: z.string().nullable(),
  files: z.array(fileRef),
  ledgerSeq: z.number().int(),
  createdAt: z.date(),
});
export type StepUpdateRecord = z.output<typeof updateRow>;

const COLUMNS = `id, step, status, actor, note, files, ledger_seq AS "ledgerSeq",
  created_at AS "createdAt"`;

/**
 * The recorded step updates of a deal, oldest first, across signed versions: a change order
 * keeps the signed steps first and in order, so a step's number never changes.
 */
export async function listStepUpdates(q: Queryable, dealId: string): Promise<StepUpdateRecord[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM timeline_progress WHERE deal_id = $1 ORDER BY created_at, ledger_seq`,
    [dealId],
  );
  return rows.map((row) => updateRow.parse(row));
}

/** The updates as the progress rules read them. */
export const asStepUpdates = (records: readonly StepUpdateRecord[]): StepUpdate[] =>
  records.map((r) => ({
    step: r.step,
    status: r.status,
    actor: r.actor,
    at: r.createdAt.toISOString(),
  }));

/**
 * Records an update of a manual step of the deal's signed timeline (7k), in one transaction
 * with its log entry: the version, step, kind, the files' ids and fingerprints, and the note's
 * fingerprint (its words stay in the table). Only the deal's seller or buyer, only while it runs,
 * and only an update the step's kind and state allow for that side (`allowedUpdates`).
 */
export async function recordStepUpdate(
  db: Database,
  input: NewStepUpdate,
  now: Date,
): Promise<{ update: StepUpdateRecord; entry: LedgerEntry; version: number }> {
  const update = stepUpdateSchema.parse(input);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, update.dealId);
    const role =
      deal.seller_id === update.actorId
        ? "seller"
        : deal.buyer_id === update.actorId
          ? "buyer"
          : undefined;
    if (role === undefined) throw new StepNotAllowedError("not-your-deal");
    const version = await signedVersionOf(tx, update.dealId);
    if (deal.status !== "active" || version === undefined) {
      throw new StepNotAllowedError("not-running");
    }
    const scope = await getScopeVersion(tx, update.dealId, version);
    const steps = scope ? timelineOf(scope.content) : [];
    const step = steps[update.step - 1];
    if (!step) throw new StepNotAllowedError("no-step");
    const earlier = asStepUpdates(await listStepUpdates(tx, update.dealId));
    const state = timelineProgress(steps, earlier, [])[update.step - 1]?.state ?? "open";
    if (!allowedUpdates(step, state, role).includes(update.status)) {
      throw new StepNotAllowedError("not-allowed");
    }
    const files = await filesOf(tx, update.dealId, update.fileIds);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: update.dealId,
        type: EVENT_FOR[update.status],
        actor: role,
        actorId: update.actorId,
        payload: {
          version,
          step: update.step,
          kind: step.kind,
          files: files.map(({ id, sha256 }) => ({ id, sha256 })),
          ...(update.note === undefined ? {} : { noteSha256: sha256Hex(update.note) }),
        },
        ...originOf(update),
      },
      now,
    );
    const rows = await tx.query(
      `INSERT INTO timeline_progress (id, deal_id, version, step, status, actor, actor_id, note,
                                      files, ledger_seq, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11)
       RETURNING ${COLUMNS}`,
      [
        update.id,
        update.dealId,
        version,
        update.step,
        update.status,
        role,
        update.actorId,
        update.note ?? null,
        JSON.stringify(files),
        entry.seq,
        now,
      ],
    );
    return { update: updateRow.parse(rows[0]), entry, version };
  });
}

/** The named files, each a file of the deal (any kind), with name and fingerprint. */
async function filesOf(tx: Queryable, dealId: string, ids: readonly string[]) {
  const files = [];
  for (const id of new Set(ids)) {
    const rows = await tx.query(
      "SELECT id, filename, sha256 FROM artifacts WHERE id = $1 AND deal_id = $2",
      [id, dealId],
    );
    const file = fileRef.safeParse(rows[0]);
    if (!file.success) throw new StepNotAllowedError("no-file");
    files.push(file.data);
  }
  return files;
}

const dealIdRow = z.object({ id: z.string() });

/** The ids of deals whose timeline is running (signed and not finished), for reminders (7l). */
export async function runningDealIds(q: Queryable): Promise<string[]> {
  const rows = await q.query("SELECT id FROM deals WHERE status = 'active' ORDER BY created_at");
  return rows.map((row) => dealIdRow.parse(row).id);
}

export const reminderSchema = z.object({
  dealId: z.uuid(),
  step: z.number().int().min(1),
  to: z.enum(["seller", "buyer"]),
  kind: z.enum(["soon", "overdue"]),
  dueDate: z.iso.date(),
  day: z.iso.date(),
  /** The card's id and words in the deal's chat. */
  cardId: z.uuid(),
  words: z.string().trim().min(1).max(500),
});
export type NewReminder = z.input<typeof reminderSchema>;

/**
 * Records a reminder about a step, once per step and day (7l): the row, a `REMINDER_SENT` log
 * entry from the system (step, who it went to, the kind, the due date and the day) and a card in
 * the deal's chat, all in one transaction. A second reminder for the same step and day records
 * nothing and returns `created: false`.
 */
export async function recordReminder(
  db: Database,
  input: NewReminder,
  now: Date,
): Promise<{ created: boolean }> {
  const reminder = reminderSchema.parse(input);
  return db.transaction(async (tx) => {
    await lockDeal(tx, reminder.dealId);
    const taken = await tx.query(
      "SELECT 1 FROM timeline_reminders WHERE deal_id = $1 AND step = $2 AND day = $3",
      [reminder.dealId, reminder.step, reminder.day],
    );
    if (taken.length > 0) return { created: false };
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: reminder.dealId,
        type: "REMINDER_SENT",
        actor: "system",
        payload: {
          step: reminder.step,
          to: reminder.to,
          kind: reminder.kind,
          dueDate: reminder.dueDate,
          day: reminder.day,
        },
      },
      now,
    );
    await tx.query(
      `INSERT INTO timeline_reminders (deal_id, step, day, recipient, kind, ledger_seq, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [reminder.dealId, reminder.step, reminder.day, reminder.to, reminder.kind, entry.seq, now],
    );
    await postNotice(
      tx,
      {
        id: reminder.cardId,
        dealId: reminder.dealId,
        body: reminder.words,
        notice: { type: "reminder", step: reminder.step },
        ledgerSeq: entry.seq,
      },
      now,
    );
    return { created: true };
  });
}
