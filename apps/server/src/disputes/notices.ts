import {
  getDeal,
  getDispute,
  getUser,
  listDisputeEntriesSince,
  listDisputesDueBy,
  noticeKeysTaken,
  recordDisputeNotice,
  type Database,
  type DisputeEntry,
  type NoticeKind,
  type StoredDispute,
} from "@pactpal/db";
import type { EmailMessage, EmailSender } from "@pactpal/email";
import {
  disputeChangedEmail,
  disputeDecidedEmail,
  disputeOpenedEmail,
  disputeReminderEmail,
  type DisputeEmailFacts,
} from "../email/dispute-email.js";
import type { LogSink } from "../payments/payment-sync.js";
import { disputedAmountWords } from "./dispute-view.js";

/** Hours before the respond-by date when the seller is reminded (owner's choice, 5j). */
export const REMINDER_MARKS = [72, 24, 6] as const;

/** An event email still unsent this long after its entry is given up (owner's choice, 5j). */
export const NOTICE_WINDOW_MS = 3 * 24 * 3_600_000;

const HOUR_MS = 3_600_000;

/** One email that may be due, before checking whether it was already sent. */
export type DueNotice =
  | { key: string; kind: Exclude<NoticeKind, "reminder">; entry: DisputeEntry; disputeId: string }
  | {
      key: string;
      kind: "reminder";
      dispute: StoredDispute;
      dealId: string;
      mark: number;
      dueAt: Date;
    };

const EVENT_KINDS = {
  DISPUTE_OPENED: "opened",
  DISPUTE_UPDATED: "changed",
  DISPUTE_RESOLVED: "decided",
} as const;

/** The email about a dispute entry: one per entry, keyed by the deal and the entry's number. */
export function eventNotice(entry: DisputeEntry): DueNotice | undefined {
  const disputeId = entry.payload.disputeId;
  if (typeof disputeId !== "string") return undefined;
  return {
    key: `dispute-entry:${entry.dealId}:${String(entry.seq)}`,
    kind: EVENT_KINDS[entry.type],
    entry,
    disputeId,
  };
}

const reminderKey = (disputeId: string, dueAt: Date, mark: number) =>
  `dispute-reminder:${disputeId}:${dueAt.toISOString()}:${String(mark)}h`;

/**
 * The reminder due for a dispute waiting for the seller, if any: the nearest mark (72, 24 or 6
 * hours) the time left has reached. Its key names the respond-by date, so a moved date gets its
 * own reminders. Pure.
 */
export function reminderNotice(dispute: StoredDispute, now: Date): DueNotice | undefined {
  const { dealId, sellerDueAt } = dispute;
  if (dealId === null || sellerDueAt === null) return undefined;
  const left = sellerDueAt.getTime() - now.getTime();
  if (left <= 0) return undefined;
  const mark = [...REMINDER_MARKS].reverse().find((hours) => left <= hours * HOUR_MS);
  if (mark === undefined) return undefined;
  return {
    key: reminderKey(dispute.disputeId, sellerDueAt, mark),
    kind: "reminder",
    dispute,
    dealId,
    mark,
    dueAt: sellerDueAt,
  };
}

/**
 * Leaves out a change email when PayPal's decision is the very next entry of the same deal: the
 * decision email says it ("status now resolved" would only repeat it). Pure.
 */
export function withoutRepeats(notices: readonly DueNotice[]): DueNotice[] {
  const decided = new Set(
    notices.flatMap((n) =>
      n.kind === "decided" ? [`${n.entry.dealId}:${String(n.entry.seq)}`] : [],
    ),
  );
  return notices.filter(
    (n) => n.kind !== "changed" || !decided.has(`${n.entry.dealId}:${String(n.entry.seq + 1)}`),
  );
}

/**
 * The keys that make a notice already done: its own, and for a reminder those of nearer marks
 * for the same date (a reminder at 6 hours makes the 24-hour one pointless). Pure.
 */
export function doneKeys(notice: DueNotice): string[] {
  if (notice.kind !== "reminder") return [notice.key];
  return REMINDER_MARKS.filter((hours) => hours <= notice.mark).map((hours) =>
    reminderKey(notice.dispute.disputeId, notice.dueAt, hours),
  );
}

export interface NoticeDeps {
  db: Database;
  email: EmailSender;
  clock: () => Date;
  log: LogSink;
  /** The website's address, for the link to the dispute page. */
  publicBaseUrl: string;
}

/** The email for one due notice, or undefined when its deal, seller or dispute is gone. */
async function emailFor(deps: NoticeDeps, notice: DueNotice): Promise<EmailMessage | undefined> {
  const { db } = deps;
  const dealId = notice.kind === "reminder" ? notice.dealId : notice.entry.dealId;
  const disputeId = notice.kind === "reminder" ? notice.dispute.disputeId : notice.disputeId;
  const [deal, dispute] = await Promise.all([getDeal(db, dealId), getDispute(db, disputeId)]);
  const seller = deal && (await getUser(db, deal.sellerId));
  if (!deal || !dispute || !seller) return undefined;
  const now = deps.clock();
  const facts: DisputeEmailFacts = {
    to: seller.email,
    dealTitle: deal.title,
    disputeId,
    link: `${deps.publicBaseUrl}/deals/${dealId}/disputes/${encodeURIComponent(disputeId)}`,
    allowedActions: dispute.allowedActions,
    idempotencyKey: notice.key,
  };
  switch (notice.kind) {
    case "opened":
      return disputeOpenedEmail({
        ...facts,
        stage: dispute.stage,
        amount: disputedAmountWords(dispute),
        reason: dispute.reason,
        dueAt: dispute.sellerDueAt,
        now,
      });
    case "changed":
      return disputeChangedEmail({ ...facts, changes: notice.entry.payload.changes });
    case "decided": {
      const outcome = notice.entry.payload.outcome;
      return disputeDecidedEmail({
        ...facts,
        outcome: typeof outcome === "string" ? outcome : "decided",
      });
    }
    case "reminder":
      return disputeReminderEmail({ ...facts, dueAt: notice.dueAt, now });
  }
}

/**
 * Emails the seller what is due after a dispute check (5j): new dispute entries of the last 3 days
 * not emailed yet, and the reminders due. Each email has a fixed key (also Resend's), and is
 * recorded once sent or refused for good; a network or server failure records nothing, so the
 * next check tries again. With the stand-in email it does nothing. Never throws.
 */
export async function sendDisputeNotices(
  deps: NoticeDeps,
): Promise<{ sent: number; refused: number; failed: number }> {
  const counts = { sent: 0, refused: 0, failed: 0 };
  const { db, email, clock, log } = deps;
  if (!email.live) return counts;
  try {
    const now = clock();
    const [entries, due] = await Promise.all([
      listDisputeEntriesSince(db, new Date(now.getTime() - NOTICE_WINDOW_MS)),
      listDisputesDueBy(db, now, new Date(now.getTime() + REMINDER_MARKS[0] * HOUR_MS)),
    ]);
    const notices = withoutRepeats([
      ...entries.flatMap((entry) => eventNotice(entry) ?? []),
      ...due.flatMap((dispute) => reminderNotice(dispute, now) ?? []),
    ]);
    const taken = await noticeKeysTaken(db, notices.flatMap(doneKeys));
    for (const notice of notices.filter((n) => !doneKeys(n).some((key) => taken.has(key)))) {
      const message = await emailFor(deps, notice);
      if (!message) continue;
      const result = await email.send(message);
      const dealId = notice.kind === "reminder" ? notice.dealId : notice.entry.dealId;
      const disputeId = notice.kind === "reminder" ? notice.dispute.disputeId : notice.disputeId;
      const base = {
        key: notice.key,
        dealId,
        disputeId,
        kind: notice.kind,
        ...(notice.kind === "reminder" ? {} : { ledgerSeq: notice.entry.seq }),
      };
      if (result.ok) {
        counts.sent += 1;
        await recordDisputeNotice(db, { ...base, outcome: { emailId: result.id } }, clock());
      } else if (result.reason === "rejected") {
        counts.refused += 1;
        await recordDisputeNotice(db, { ...base, outcome: { failure: "rejected" } }, clock());
      } else {
        counts.failed += 1;
        log.warn({ disputeId, kind: notice.kind, reason: result.reason }, "Dispute email not sent");
      }
    }
  } catch (error) {
    log.error({ err: error instanceof Error ? error.name : "unknown" }, "Dispute emails failed");
  }
  return counts;
}
