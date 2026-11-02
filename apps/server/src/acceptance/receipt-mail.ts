import {
  getLatestAcceptance,
  getUser,
  readLedger,
  recordReceiptSent,
  type Database,
  type Deal,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import type { FastifyBaseLogger } from "fastify";
import { z } from "zod";
import { receiptEmail } from "../email/receipt-email.js";
import { buildReceipt } from "./receipt.js";

/** At most this many receipt emails per signed version, so a resend button cannot spam anyone. */
export const MAX_RECEIPT_EMAILS = 5;

const ROLES = ["buyer", "seller"] as const;
type Role = (typeof ROLES)[number];

const receiptSentPayload = z.object({ version: z.number(), to: z.enum(ROLES) });

/** The `RECEIPT_SENT` entries for one version, with which side each went to. */
export function receiptsSent(entries: readonly LedgerEntry[], version: number) {
  return entries.flatMap((entry) => {
    if (entry.type !== "RECEIPT_SENT") return [];
    const payload = receiptSentPayload.safeParse(entry.payload);
    return payload.success && payload.data.version === version
      ? [{ to: payload.data.to, at: entry.serverTime }]
      : [];
  });
}

export interface ReceiptMailDeps {
  db: Database;
  email: EmailSender;
  clock: () => Date;
  log: FastifyBaseLogger;
}

/** What one round of receipt emails did. */
export type ReceiptMailResult =
  | { status: "done"; sent: Role[]; failed: Role[] }
  | { status: "email-off" }
  | { status: "not-signed" }
  | { status: "limit-reached" };

/**
 * Emails the signed receipt (the same bytes as the download) to the buyer and the seller, and
 * records each email the service accepted as `RECEIPT_SENT`. Each email carries an idempotency key
 * numbered by how many receipts that side already got, so a retry after a lost answer or a crash
 * is never sent twice, while a deliberate resend is a new email. A failed send records nothing.
 * Throws `ReceiptIntegrityError` if the signed copy fails its checks.
 */
export async function emailReceipt(deps: ReceiptMailDeps, deal: Deal): Promise<ReceiptMailResult> {
  const { db, email, clock, log } = deps;
  if (!email.live) return { status: "email-off" };
  const acceptance = await getLatestAcceptance(db, deal.id);
  if (!acceptance || deal.buyerId === undefined) return { status: "not-signed" };
  const entries = await readLedger(db, deal.id);
  const before = receiptsSent(entries, acceptance.version);
  if (before.length >= MAX_RECEIPT_EMAILS) return { status: "limit-reached" };

  const receipt = await buildReceipt(
    acceptance,
    entries.find((entry) => entry.seq === acceptance.ledgerSeq),
  );
  const receiptSha256 = sha256Hex(receipt.bytes);
  const [buyer, seller] = await Promise.all([
    getUser(db, deal.buyerId),
    getUser(db, deal.sellerId),
  ]);
  const people: Record<Role, string | undefined> = { buyer: buyer?.email, seller: seller?.email };

  const sent: Role[] = [];
  const failed: Role[] = [];
  let total = before.length;
  for (const role of ROLES) {
    const to = people[role];
    if (to === undefined || total >= MAX_RECEIPT_EMAILS) {
      failed.push(role);
      continue;
    }
    const attempt = before.filter((entry) => entry.to === role).length + 1;
    const result = await email.send(
      receiptEmail({
        to,
        role,
        dealTitle: receipt.document.title,
        sellerName: receipt.document.sellerName,
        typedName: acceptance.typedName,
        signedAt: acceptance.createdAt,
        version: acceptance.version,
        receipt: { filename: receipt.filename, bytes: receipt.bytes, sha256: receiptSha256 },
        idempotencyKey: `receipt:${deal.id}:v${String(acceptance.version)}:${role}:${String(attempt)}`,
      }),
    );
    if (!result.ok) {
      // Never the address: which side, and why.
      log.warn(
        { dealId: deal.id, to: role, reason: result.reason, detail: result.detail },
        "Receipt email not sent",
      );
      failed.push(role);
      continue;
    }
    await recordReceiptSent(
      db,
      {
        dealId: deal.id,
        version: acceptance.version,
        to: role,
        receiptSha256,
        email: to,
        providerMessageId: result.id,
      },
      clock(),
    );
    log.info({ dealId: deal.id, to: role, providerMessageId: result.id }, "Receipt emailed");
    sent.push(role);
    total += 1;
  }
  return { status: "done", sent, failed };
}
