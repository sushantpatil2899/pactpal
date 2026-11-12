import { z } from "zod";
import { payPalAmount, toPayPalMoney, type MinorAmount } from "./money.js";
import { PayPalOperations } from "./operations.js";
import type { PayPalResult } from "./types.js";

const INVOICES_PATH = "/v2/invoicing/invoices";

/** One milestone invoice to create and send. */
export interface InvoiceDraft {
  recipientEmail: string;
  amount: MinorAmount;
  /** Line item name, e.g. "Milestone 1: sketches". */
  itemName: string;
  description: string;
  /** Scope version id and hash, written into the invoice note. */
  scopeReference: string;
  /** Stable key so retries never create duplicate invoices; the send uses `${requestId}-send`. */
  requestId: string;
  /**
   * The seller's name for the invoice's header. Without it PayPal shows the account's invoicing
   * default, which on sandbox accounts is "Test Store".
   */
  invoicerName?: string | undefined;
}

/** PayPal's limit for an invoicer's business name. */
const MAX_INVOICER_NAME = 300;

/** The invoice's note as PayPal shows it to the buyer: the agreed scope it pays for. */
export const invoiceNote = (scopeReference: string): string => `Agreed scope: ${scopeReference}`;

/** Which route served a step, and why MCP was not used. */
export type Route = Omit<PayPalResult<unknown>, "data">;

/** An invoice created as a draft: not sent, so the recipient sees nothing yet. */
export interface DraftInvoice {
  invoiceId: string;
  create: Route;
}

export interface SentInvoice extends DraftInvoice {
  send: Route;
}

export interface InvoiceDetails {
  invoiceId: string;
  /** PayPal's own number for the invoice, e.g. "0042"; disputes name the invoice by it. */
  invoiceNumber: string | undefined;
  /** PayPal's status, e.g. "DRAFT", "SENT", "PAID". */
  status: string;
  amount: MinorAmount | undefined;
  recipientEmail: string | undefined;
  note: string | undefined;
  /** Where the buyer views and pays the invoice. */
  payerViewUrl: string | undefined;
  /** Whose invoice it is: the sending seller's PayPal email, when PayPal shows it. */
  invoicerEmail?: string | undefined;
  /** What has been paid: the total and each payment, as PayPal records them. */
  payments: {
    paidAmount: MinorAmount | undefined;
    transactions: {
      /** PayPal's transaction id for the payment. */
      paymentId: string | undefined;
      /** When it was paid, as PayPal writes it (e.g. "2026-11-02" or a timestamp). */
      paymentDate: string | undefined;
      /** How it was paid, e.g. "PAYPAL" or, for a payment recorded by hand, "BANK_TRANSFER". */
      method: string | undefined;
    }[];
  };
}

/** The invoice was created but sending it failed; retrying the send is safe. */
export class InvoiceSendError extends Error {
  override readonly name = "InvoiceSendError";

  constructor(
    readonly invoiceId: string,
    options: { cause: unknown },
  ) {
    super(`Invoice ${invoiceId} was created but not sent`, options);
  }
}

// Create answers either with the invoice itself or with a link to it, depending on PayPal's mode.
const createdInvoice = z
  .looseObject({ id: z.string().min(1).optional(), href: z.string().min(1).optional() })
  .transform((body, ctx) => {
    const id = body.id ?? body.href?.split("/").pop();
    if (id === undefined || id === "") {
      ctx.addIssue({ code: "custom", message: "no invoice id or link" });
      return z.NEVER;
    }
    return id;
  });

// Send answers with a link, or with nothing at all; either means it was accepted.
const sentInvoice = z.unknown();

const invoiceDetails = z
  .looseObject({
    id: z.string(),
    status: z.string(),
    detail: z
      .looseObject({
        invoice_number: z.string().optional(),
        note: z.string().optional(),
        metadata: z.looseObject({ recipient_view_url: z.string().optional() }).optional(),
      })
      .optional(),
    invoicer: z.looseObject({ email_address: z.string().optional() }).optional(),
    primary_recipients: z
      .array(
        z.looseObject({
          billing_info: z.looseObject({ email_address: z.string().optional() }).optional(),
        }),
      )
      .optional(),
    amount: payPalAmount.optional(),
    payments: z
      .looseObject({
        paid_amount: payPalAmount.optional(),
        transactions: z
          .array(
            z.looseObject({
              payment_id: z.string().optional(),
              payment_date: z.string().optional(),
              method: z.string().optional(),
            }),
          )
          .optional(),
      })
      .optional(),
  })
  .transform((invoice): InvoiceDetails => ({
    invoiceId: invoice.id,
    invoiceNumber: invoice.detail?.invoice_number,
    status: invoice.status,
    amount: invoice.amount,
    recipientEmail: invoice.primary_recipients?.[0]?.billing_info?.email_address,
    note: invoice.detail?.note,
    payerViewUrl: invoice.detail?.metadata?.recipient_view_url,
    invoicerEmail: invoice.invoicer?.email_address,
    payments: {
      paidAmount: invoice.payments?.paid_amount,
      transactions: (invoice.payments?.transactions ?? []).map((payment) => ({
        paymentId: payment.payment_id,
        paymentDate: payment.payment_date,
        method: payment.method,
      })),
    },
  }));

function route<T>({ transport, fallbackReason, debugId }: PayPalResult<T>): Route {
  return { transport, fallbackReason, debugId };
}

/**
 * Milestone invoices for one PayPal app. Each step tries PayPal's MCP tool
 * first and falls back to the REST API through `McpFallback`.
 */
export class PayPalInvoices extends PayPalOperations {
  /** Creates the invoice as a draft; nothing reaches the recipient until it is sent. */
  async createDraft(draft: InvoiceDraft): Promise<DraftInvoice> {
    const unitAmount = toPayPalMoney(draft.amount);
    const note = invoiceNote(draft.scopeReference);
    const primary_recipients = [{ billing_info: { email_address: draft.recipientEmail } }];
    const items = [
      {
        name: draft.itemName,
        description: draft.description,
        quantity: "1",
        unit_amount: unitAmount,
      },
    ];

    const name = draft.invoicerName?.trim().slice(0, MAX_INVOICER_NAME);
    const invoicer = name ? { invoicer: { business_name: name } } : {};
    const created = await this.fallback.run({
      operation: "create invoice",
      kind: "write",
      mcp: this.mcpCall("create_invoice", createdInvoice, {
        currency_code: unitAmount.currency_code,
        note,
        primary_recipients,
        items,
      }),
      rest: () =>
        this.rest.request({
          method: "POST",
          path: INVOICES_PATH,
          body: {
            detail: { currency_code: unitAmount.currency_code, note },
            ...invoicer,
            primary_recipients,
            items,
          },
          requestId: draft.requestId,
          schema: createdInvoice,
        }),
    });
    return { invoiceId: created.data, create: route(created) };
  }

  /** Creates the invoice, then sends it to the recipient. */
  async createAndSend(draft: InvoiceDraft): Promise<SentInvoice> {
    const { invoiceId, create } = await this.createDraft(draft);
    let sent: PayPalResult<unknown>;
    try {
      sent = await this.fallback.run({
        operation: "send invoice",
        kind: "write",
        mcp: this.mcpCall("send_invoice", sentInvoice, {
          invoice_id: invoiceId,
          send_to_recipient: true,
        }),
        rest: () =>
          this.rest.request({
            method: "POST",
            path: `${INVOICES_PATH}/${encodeURIComponent(invoiceId)}/send`,
            body: { send_to_recipient: true, send_to_invoicer: false },
            requestId: `${draft.requestId}-send`,
            schema: sentInvoice,
          }),
      });
    } catch (error) {
      throw new InvoiceSendError(invoiceId, { cause: error });
    }
    return { invoiceId, create, send: route(sent) };
  }

  /** Reads an invoice's current status, amount and payment link. */
  async get(invoiceId: string): Promise<PayPalResult<InvoiceDetails>> {
    return this.fallback.run({
      operation: "get invoice",
      kind: "read",
      mcp: this.mcpCall("get_invoice", invoiceDetails, { invoice_id: invoiceId }),
      rest: () =>
        this.rest.request({
          method: "GET",
          path: `${INVOICES_PATH}/${encodeURIComponent(invoiceId)}`,
          schema: invoiceDetails,
        }),
    });
  }
}
