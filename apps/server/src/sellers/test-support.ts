import { fakeDisputes, fakeWriter } from "../disputes/test-support.js";
import { fakeAppWebhooks, fakePayPal } from "../payments/paypal-test-support.js";
import type { LinkedAppClients } from "./linked-apps.js";

/** Test code only: a linked app's clients, each a stand-in unless given. */
export function fakeAppClients(parts: Partial<LinkedAppClients> = {}): LinkedAppClients {
  return {
    invoices: parts.invoices ?? fakePayPal().invoices,
    webhooks: parts.webhooks ?? fakeAppWebhooks().webhooks,
    disputes: parts.disputes ?? { ...fakeDisputes().reader, ...fakeWriter().writer },
  };
}
