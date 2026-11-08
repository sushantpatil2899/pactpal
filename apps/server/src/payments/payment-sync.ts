import {
  findMilestoneByInvoice,
  getDeal,
  getUser,
  markInvoicePaid,
  type Database,
  type Milestone,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import type { JsonValue } from "@pactpal/ledger";
import { z } from "zod";
import { invoicesFor, type InvoiceAccounts } from "../sellers/linked-apps.js";
import { paymentEmail } from "../email/payment-email.js";
import { invoiceFor, stageFacts } from "./invoice-text.js";
import { signedRecord } from "./signed-record.js";

/** Where these steps write their log lines (the server's logger fits). */
export interface LogSink {
  info(details: object, message: string): void;
  warn(details: object, message: string): void;
  error(details: object, message: string): void;
}

/** `invoices` is PactPal's own seller app; `linked` reaches sellers' own apps (6h-3). */
export interface PaymentSyncDeps extends InvoiceAccounts {
  db: Database;
  email: EmailSender;
  clock: () => Date;
  log: LogSink;
}

/** How PactPal came to check: PayPal's notification (with its id), or someone pressing "check". */
export type CheckSource = { kind: "notification"; eventId: string } | { kind: "status-check" };

/**
 * What a check found. `account-unlinked`: the invoice was sent from a seller's own app that is no
 * longer linked (or from PactPal's app, now without keys), so PayPal cannot be asked.
 */
export type PaymentCheck = "unknown" | "not-paid" | "already-paid" | "paid" | "account-unlinked";

/**
 * Asks PayPal, from the account that sent it, whether one of PactPal's invoices is fully paid and, if it is, records the payment
 * (once) and emails both sides. A notification or a button only starts the check: the facts come
 * from PayPal's own answer, and only status PAID counts (partial and pending payments do not).
 * PayPal and database failures are thrown, so a notification is answered 500 and sent again.
 */
export async function checkInvoicePaid(
  deps: PaymentSyncDeps,
  invoiceId: string,
  source: CheckSource,
): Promise<PaymentCheck> {
  const row = await findMilestoneByInvoice(deps.db, invoiceId);
  if (!row) return "unknown";
  if (row.status === "paid") return "already-paid";
  if (row.status !== "sent") return "not-paid";
  // Always the account that sent it: another account could not see the invoice.
  const access = await invoicesFor(deps, row.sellerConnectionId);
  if (!access.ok) return "account-unlinked";
  const { data: invoice } = await access.account.invoices.get(invoiceId);
  if (invoice.status !== "PAID") return "not-paid";
  const { milestone, entry } = await markInvoicePaid(
    deps.db,
    {
      dealId: row.dealId,
      version: row.version,
      stage: row.stage,
      invoiceId,
      ...(invoice.invoiceNumber === undefined ? {} : { invoiceNumber: invoice.invoiceNumber }),
      paidAmount: invoice.payments.paidAmount ??
        invoice.amount ?? { minor: row.amountMinor, currency: row.currency },
      transactions: invoice.payments.transactions.map((t) => ({
        ...(t.paymentId === undefined ? {} : { paymentId: t.paymentId }),
        ...(t.paymentDate === undefined ? {} : { paymentDate: t.paymentDate }),
        ...(t.method === undefined ? {} : { method: t.method }),
      })),
      source: source.kind,
      ...(source.kind === "notification" ? { eventId: source.eventId } : {}),
    },
    deps.clock(),
  );
  if (!entry) return "already-paid";
  deps.log.info({ dealId: row.dealId, stage: row.stage, invoiceId }, "Payment recorded");
  await emailPayment(deps, milestone);
  return "paid";
}

/**
 * Emails both sides that the stage was paid. The payment is already recorded, so a failure here is
 * logged (never with an address) and never undoes it.
 */
async function emailPayment(deps: PaymentSyncDeps, milestone: Milestone): Promise<void> {
  const { db, email, log } = deps;
  try {
    const deal = await getDeal(db, milestone.dealId);
    if (!deal || milestone.paidAt === null) return;
    const [record, seller] = await Promise.all([
      signedRecord(db, deal),
      getUser(db, deal.sellerId),
    ]);
    if (!record || !seller) return;
    const invoice = invoiceFor({ deal, ...record, stage: milestone.stage });
    if (!invoice) return;
    const people = { buyer: record.buyer.email, seller: seller.email } as const;
    for (const role of ["buyer", "seller"] as const) {
      const sent = await email.send(
        paymentEmail({
          to: people[role],
          role,
          facts: stageFacts(invoice),
          paidAt: milestone.paidAt,
          transactionId: milestone.transactionId ?? undefined,
          idempotencyKey: `payment:${milestone.dealId}:v${String(milestone.version)}:s${String(milestone.stage)}:${role}`,
        }),
      );
      if (sent.ok || email.live) {
        log.info(
          {
            dealId: milestone.dealId,
            to: role,
            sent: sent.ok,
            ...(sent.ok ? {} : { reason: sent.reason }),
          },
          "Payment email",
        );
      }
    }
  } catch (error) {
    log.error(
      { dealId: milestone.dealId, err: error instanceof Error ? error.name : "unknown" },
      "Payment email failed",
    );
  }
}

const paidNotification = z.looseObject({
  resource: z.looseObject({
    id: z.string().min(1).optional(),
    invoice: z.looseObject({ id: z.string().min(1).optional() }).optional(),
  }),
});

/** PayPal's notification that an invoice was paid. Other kinds are stored but not acted on. */
export const INVOICE_PAID_EVENT = "INVOICING.INVOICE.PAID";

/**
 * Handles a stored PayPal notification: an invoice-paid one starts a check of that invoice. The
 * invoice's id is read from either shape PayPal uses (`resource.invoice.id` or `resource.id`).
 */
export function paymentNotifications(deps: PaymentSyncDeps) {
  return async (event: { eventId: string; eventType: string; body: JsonValue }): Promise<void> => {
    if (event.eventType !== INVOICE_PAID_EVENT) return;
    const parsed = paidNotification.safeParse(event.body);
    const invoiceId = parsed.success
      ? (parsed.data.resource.invoice?.id ?? parsed.data.resource.id)
      : undefined;
    if (invoiceId === undefined) {
      deps.log.warn({ eventId: event.eventId }, "Invoice-paid notification without an invoice id");
      return;
    }
    const result = await checkInvoicePaid(deps, invoiceId, {
      kind: "notification",
      eventId: event.eventId,
    });
    deps.log.info(
      { eventId: event.eventId, invoiceId, result },
      "Invoice-paid notification checked",
    );
  };
}
