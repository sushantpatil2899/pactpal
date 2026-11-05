import {
  InvoiceSendError,
  PayPalApiError,
  PayPalNetworkError,
  type InvoiceDraft,
} from "@pactpal/paypal";
import type { InvoiceSender } from "./invoice-sender.js";

/** How the fake answers the next calls. */
export type FakePayPalMode = "ok" | "refuse" | "unsent" | "down" | "no-link";

/**
 * Test code only: a stand-in for PayPal's invoices. One invoice id per request id, as PayPal
 * does; `mode` makes calls fail; invoices in `paid` read back as PAID with one PayPal payment.
 */
export function fakePayPal() {
  const drafts: InvoiceDraft[] = [];
  const ids = new Map<string, string>();
  const paid = new Set<string>();
  const state: { mode: FakePayPalMode; reads: number } = { mode: "ok", reads: 0 };
  const invoices: InvoiceSender = {
    createAndSend: (draft) => {
      drafts.push(draft);
      const invoiceId = ids.get(draft.requestId) ?? `INV2-TEST-${String(ids.size + 1)}`;
      ids.set(draft.requestId, invoiceId);
      switch (state.mode) {
        case "refuse":
          return Promise.reject(
            new PayPalApiError(
              "create invoice",
              422,
              "UNPROCESSABLE_ENTITY",
              "x",
              [
                {
                  field: "/primary_recipients",
                  issue: "INVALID_EMAIL",
                  description: "secret text",
                },
              ],
              "dbg1",
            ),
          );
        case "unsent":
          return Promise.reject(
            new InvoiceSendError(invoiceId, { cause: new Error("send failed") }),
          );
        case "down":
          return Promise.reject(new PayPalNetworkError("create invoice", true));
        case "ok":
        case "no-link":
          return Promise.resolve({
            invoiceId,
            create: { transport: "rest" },
            send: { transport: "rest" },
          });
      }
    },
    get: (invoiceId) => {
      state.reads += 1;
      if (state.mode === "no-link" || state.mode === "down") {
        return Promise.reject(new PayPalNetworkError("get invoice", false));
      }
      const isPaid = paid.has(invoiceId);
      return Promise.resolve({
        transport: "rest",
        data: {
          invoiceId,
          invoiceNumber: isPaid ? `N-${invoiceId}` : undefined,
          status: isPaid ? "PAID" : "SENT",
          amount: { minor: 12_000, currency: "USD" },
          recipientEmail: undefined,
          note: undefined,
          payerViewUrl: `https://www.sandbox.paypal.com/invoice/p/#${invoiceId}`,
          payments: isPaid
            ? {
                paidAmount: { minor: 12_000, currency: "USD" },
                transactions: [
                  { paymentId: `TX-${invoiceId}`, paymentDate: "2026-11-02", method: "PAYPAL" },
                ],
              }
            : { paidAmount: undefined, transactions: [] },
        },
      });
    },
  };
  return { invoices, drafts, paid, state };
}
