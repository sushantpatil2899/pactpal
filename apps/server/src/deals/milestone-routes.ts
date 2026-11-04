import {
  MilestoneNotAllowedError,
  dropFailedInvoice,
  getUser,
  listMilestones,
  markInvoiceSent,
  recordInvoiceId,
  startInvoice,
  type Database,
  type Deal,
  type Milestone,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import {
  InvoiceSendError,
  PayPalApiError,
  PayPalNetworkError,
  PayPalResponseError,
} from "@pactpal/paypal";
import type { FastifyBaseLogger, FastifyPluginAsync, FastifyReply } from "fastify";
import { z } from "zod";
import { invoiceEmail } from "../email/invoice-email.js";
import type { InvoiceSender } from "../payments/invoice-sender.js";
import { invoiceFor, stageFacts, type StageInvoice } from "../payments/invoice-text.js";
import { checkInvoicePaid } from "../payments/payment-sync.js";
import { signedRecord } from "../payments/signed-record.js";
import { nameOf } from "./parties.js";
import { readBody, type DealLookup, type FoundDeal } from "./access.js";
import { roleIn } from "./visibility.js";

export interface MilestoneRouteOptions {
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  clock: () => Date;
  /** Absent until the seller app's PayPal keys are set. */
  invoices: InvoiceSender | undefined;
  /** Emails the buyer each invoice's link, and both sides each payment. */
  email: EmailSender;
}

/** A deal's payment status is checked with PayPal at most once in this many milliseconds. */
export const CHECK_INTERVAL_MS = 30_000;

const stageParams = z.object({ stage: z.coerce.number().int().min(1).max(20) });
const sendBody = z.object({ invoiceSha256: z.string().regex(/^[0-9a-f]{64}$/) });

/** One stage as the pages see it; the seller also sees the exact invoice before sending it. */
function stageView(
  invoice: StageInvoice,
  row: Milestone | undefined,
  preview: { to: string } | undefined,
) {
  return {
    stage: invoice.stage,
    title: invoice.title,
    amount: invoice.amount,
    dueDate: invoice.dueDate,
    status: row?.status ?? "not_invoiced",
    sentAt: row?.sentAt?.toISOString() ?? null,
    payUrl: row?.payUrl ?? null,
    paidAt: row?.paidAt?.toISOString() ?? null,
    transactionId: row?.transactionId ?? null,
    ...(preview && row?.status !== "sent" && row?.status !== "paid"
      ? {
          invoice: {
            to: preview.to,
            itemName: invoice.itemName,
            description: invoice.description,
            note: invoice.note,
            invoiceSha256: invoice.invoiceSha256,
          },
        }
      : {}),
  };
}

/** Why PayPal did not create or send an invoice, for the seller; never PayPal's own wording. */
function paypalProblem(error: unknown): { message: string; keepReservation: boolean } | undefined {
  if (error instanceof InvoiceSendError) {
    return { message: "the invoice was created but not sent; try again", keepReservation: true };
  }
  if (error instanceof PayPalApiError && error.status < 500) {
    const code = error.details[0]?.issue ?? error.errorName;
    return {
      message: `PayPal refused the invoice${code === undefined ? "" : ` (${code})`}`,
      keepReservation: false,
    };
  }
  if (
    error instanceof PayPalApiError ||
    error instanceof PayPalNetworkError ||
    error instanceof PayPalResponseError
  ) {
    return { message: "PayPal did not answer properly; try again", keepReservation: true };
  }
  return undefined;
}

/**
 * Payment stages of a signed deal and their PayPal invoices. Both sides read them; only the seller
 * sends an invoice, one stage at a time, after seeing exactly what PayPal will show the buyer.
 * Every send of a stage reaches PayPal with the same request id, so it is never invoiced twice.
 */
export const milestoneRoutes: FastifyPluginAsync<MilestoneRouteOptions> = (app, options) => {
  const { visibleDeal, sellersDeal, clock, invoices, email } = options;
  /** When each deal was last checked with PayPal (this server only; enough for one instance). */
  const lastChecked = new Map<string, number>();

  /**
   * Emails the buyer the new invoice's link. The invoice already exists, so a failure here is
   * logged (never with the address) and the page still shows the link.
   */
  async function emailInvoice(
    db: Database,
    deal: Deal,
    invoice: StageInvoice,
    buyerEmail: string,
    payUrl: string | undefined,
    log: FastifyBaseLogger,
  ) {
    try {
      const seller = await getUser(db, deal.sellerId);
      const sent = await email.send(
        invoiceEmail({
          to: buyerEmail,
          sellerName: nameOf(seller, "Seller"),
          facts: stageFacts(invoice),
          payUrl,
          idempotencyKey: invoice.requestId.replace(/^pp-/, "invoice:"),
        }),
      );
      if (sent.ok || email.live) {
        log.info({ dealId: deal.id, stage: invoice.stage, sent: sent.ok }, "Invoice email");
      }
    } catch (error) {
      log.error(
        { dealId: deal.id, err: error instanceof Error ? error.name : "unknown" },
        "Invoice email failed",
      );
    }
  }

  async function answer(reply: FastifyReply, { db, deal, viewer }: FoundDeal) {
    const record = await signedRecord(db, deal);
    if (!record)
      return reply.send({ signed: false, invoicing: invoices !== undefined, stages: [] });
    const rows = await listMilestones(db, deal.id);
    const preview = roleIn(viewer, deal) === "seller" ? { to: record.buyer.email } : undefined;
    const stages = record.scope.content.milestones.flatMap((_, n) => {
      const invoice = invoiceFor({ deal, ...record, stage: n + 1 });
      // A stage is the same stage in every version (change orders only add): its invoice may
      // have been sent under an earlier signed version.
      const row = rows.find((r) => r.stage === n + 1);
      return invoice ? [stageView(invoice, row, preview)] : [];
    });
    return reply.send({ signed: true, invoicing: invoices !== undefined, stages });
  }

  app.get("/api/deals/:id/milestones", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    return found ? answer(reply, found) : reply;
  });

  app.post("/api/deals/:id/milestones/:stage/invoice", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const params = stageParams.safeParse(request.params);
    if (!params.success) return reply.code(404).send({ error: "not found" });
    const body = await readBody(sendBody, request, reply);
    if (!body) return reply;
    if (!invoices) return reply.code(503).send({ error: "PayPal invoicing is not set up" });
    const { db, deal, viewer } = found;
    const record = await signedRecord(db, deal);
    if (!record) return reply.code(409).send({ error: "the deal is not signed yet" });
    const invoice = invoiceFor({ deal, ...record, stage: params.data.stage });
    if (!invoice) return reply.code(404).send({ error: "not found" });
    if (invoice.invoiceSha256 !== body.invoiceSha256) {
      return reply.code(409).send({ error: "the invoice changed; reload the page" });
    }
    const key = { dealId: deal.id, version: record.scope.version, stage: invoice.stage };
    let reservation;
    try {
      reservation = await startInvoice(
        db,
        {
          ...key,
          sellerId: viewer.user.id,
          amountMinor: invoice.amount.minor,
          currency: invoice.amount.currency,
          requestId: invoice.requestId,
          invoiceSha256: invoice.invoiceSha256,
        },
        clock(),
      );
    } catch (error) {
      if (!(error instanceof MilestoneNotAllowedError)) throw error;
      // Already sent (a second press): show the stage as it is.
      if (error.reason === "already-sent") return answer(reply, found);
      return reply.code(409).send({ error: "the deal is not signed yet" });
    }

    // A retry reaches PayPal with the reservation's own request id, even if it was made under an
    // earlier signed version, so PayPal never creates a second invoice for the stage.
    const sending = { ...invoice, requestId: reservation.requestId };
    const sent = await sendToPayPal(invoices, sending, record.buyer.email, request.log, key);
    if (!sent.ok) {
      if (!sent.keepReservation) await dropFailedInvoice(db, key);
      else if (sent.invoiceId !== undefined) await recordInvoiceId(db, key, sent.invoiceId);
      return reply.code(502).send({ error: sent.message });
    }
    await markInvoiceSent(
      db,
      {
        ...key,
        sellerId: viewer.user.id,
        invoiceId: sent.invoiceId,
        ...(sent.payUrl === undefined ? {} : { payUrl: sent.payUrl }),
        transport: sent.transport,
        recipientEmail: record.buyer.email,
        contentSha256: record.scope.contentSha256,
      },
      clock(),
    );
    request.log.info(
      { dealId: deal.id, stage: invoice.stage, invoiceId: sent.invoiceId },
      "Invoice sent",
    );
    await emailInvoice(db, deal, invoice, record.buyer.email, sent.payUrl, request.log);
    return answer(reply, found);
  });

  // Either side asks PayPal whether the sent invoices were paid (a backup for its notifications).
  app.post("/api/deals/:id/milestones/check", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    if (!invoices) return reply.code(503).send({ error: "PayPal invoicing is not set up" });
    const { db, deal } = found;
    const now = clock().getTime();
    const last = lastChecked.get(deal.id);
    if (last !== undefined && now - last < CHECK_INTERVAL_MS) {
      return reply.code(429).send({ error: "checked a moment ago; try again in a few seconds" });
    }
    lastChecked.set(deal.id, now);
    // Sent and not yet paid: the invoices worth asking PayPal about.
    const waiting = (await listMilestones(db, deal.id)).flatMap((row) =>
      row.status === "sent" && row.invoiceId !== null
        ? [{ stage: row.stage, invoiceId: row.invoiceId }]
        : [],
    );
    const deps = { db, invoices, email, clock, log: request.log };
    let failed = false;
    for (const row of waiting) {
      try {
        await checkInvoicePaid(deps, row.invoiceId, { kind: "status-check" });
      } catch (error) {
        if (!paypalProblem(error)) throw error;
        request.log.warn({ dealId: deal.id, stage: row.stage }, "Payment status not checked");
        failed = true;
      }
    }
    if (failed) return reply.code(502).send({ error: "PayPal did not answer; try again" });
    return answer(reply, found);
  });

  return Promise.resolve();
};

type SendOutcome =
  | { ok: true; invoiceId: string; payUrl: string | undefined; transport: "rest" | "mcp" }
  | { ok: false; message: string; keepReservation: boolean; invoiceId?: string };

/**
 * Creates and sends the invoice, then reads back the buyer's pay link (a failed read only leaves
 * the link out). PayPal failures come back as values, logged without the address or PayPal's text.
 */
async function sendToPayPal(
  invoices: InvoiceSender,
  invoice: StageInvoice,
  recipientEmail: string,
  log: FastifyBaseLogger,
  key: { dealId: string; stage: number },
): Promise<SendOutcome> {
  let invoiceId: string;
  let transport: "rest" | "mcp";
  try {
    const sent = await invoices.createAndSend({
      recipientEmail,
      amount: { minor: invoice.amount.minor, currency: invoice.amount.currency },
      itemName: invoice.itemName,
      description: invoice.description,
      scopeReference: invoice.scopeReference,
      requestId: invoice.requestId,
    });
    invoiceId = sent.invoiceId;
    transport = sent.create.transport;
  } catch (error) {
    const problem = paypalProblem(error);
    if (!problem) throw error;
    log.warn(
      { ...key, error: error instanceof Error ? error.name : "unknown" },
      "Invoice not sent",
    );
    return {
      ok: false,
      ...problem,
      ...(error instanceof InvoiceSendError ? { invoiceId: error.invoiceId } : {}),
    };
  }
  let payUrl: string | undefined;
  try {
    payUrl = (await invoices.get(invoiceId)).data.payerViewUrl;
  } catch (error) {
    if (!paypalProblem(error)) throw error;
    log.warn({ ...key, invoiceId }, "Invoice sent, but its pay link could not be read");
  }
  return { ok: true, invoiceId, payUrl, transport };
}
