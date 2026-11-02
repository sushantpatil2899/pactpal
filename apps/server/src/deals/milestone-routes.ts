import {
  MilestoneNotAllowedError,
  dropFailedInvoice,
  getLatestAcceptance,
  getScopeVersion,
  getUser,
  listMilestones,
  markInvoiceSent,
  recordInvoiceId,
  startInvoice,
  type Database,
  type Deal,
  type Milestone,
} from "@pactpal/db";
import {
  InvoiceSendError,
  PayPalApiError,
  PayPalNetworkError,
  PayPalResponseError,
  type PayPalInvoices,
} from "@pactpal/paypal";
import type { FastifyBaseLogger, FastifyPluginAsync, FastifyReply } from "fastify";
import { z } from "zod";
import { invoiceFor, type StageInvoice } from "../payments/invoice-text.js";
import { readBody, type DealLookup, type FoundDeal } from "./access.js";
import { roleIn } from "./visibility.js";

/** What the routes need from PayPal: create and send an invoice, and read one back. */
export type InvoiceSender = Pick<PayPalInvoices, "createAndSend" | "get">;

export interface MilestoneRouteOptions {
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  clock: () => Date;
  /** Absent until the seller app's PayPal keys are set. */
  invoices: InvoiceSender | undefined;
}

const stageParams = z.object({ stage: z.coerce.number().int().min(1).max(20) });
const sendBody = z.object({ invoiceSha256: z.string().regex(/^[0-9a-f]{64}$/) });

/** The signed record a deal's invoices are made from, or undefined if it is not signed. */
async function signedRecord(db: Database, deal: Deal) {
  if (deal.status !== "active" && deal.status !== "completed") return undefined;
  const acceptance = await getLatestAcceptance(db, deal.id);
  if (!acceptance || deal.buyerId === undefined) return undefined;
  const [scope, buyer] = await Promise.all([
    getScopeVersion(db, deal.id, acceptance.version),
    getUser(db, deal.buyerId),
  ]);
  if (!scope || !buyer) return undefined;
  return { acceptance, scope, buyer };
}

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
  const { visibleDeal, sellersDeal, clock, invoices } = options;

  async function answer(reply: FastifyReply, { db, deal, viewer }: FoundDeal) {
    const record = await signedRecord(db, deal);
    if (!record)
      return reply.send({ signed: false, invoicing: invoices !== undefined, stages: [] });
    const rows = await listMilestones(db, deal.id);
    const preview = roleIn(viewer, deal) === "seller" ? { to: record.buyer.email } : undefined;
    const stages = record.scope.content.milestones.flatMap((_, n) => {
      const invoice = invoiceFor({ deal, ...record, stage: n + 1 });
      const row = rows.find((r) => r.version === record.scope.version && r.stage === n + 1);
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
    try {
      await startInvoice(
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

    const sent = await sendToPayPal(invoices, invoice, record.buyer.email, request.log, key);
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
