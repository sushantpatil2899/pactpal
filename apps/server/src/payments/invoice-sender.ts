import type { PayPalInvoices } from "@pactpal/paypal";

/** What PactPal needs from PayPal's invoices: create and send one, and read one back. */
export type InvoiceSender = Pick<PayPalInvoices, "createAndSend" | "get">;
