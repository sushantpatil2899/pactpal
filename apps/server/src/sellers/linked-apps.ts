import { ownAppKeys, type Database } from "@pactpal/db";
import type { SecretBox } from "@pactpal/net";
import type { PayPalAppCredentials, PayPalWebhooks } from "@pactpal/paypal";
import type { InvoiceSender } from "../payments/invoice-sender.js";

/** What PactPal uses of a seller's own app; grows with 6h-5 (disputes). */
export interface LinkedAppClients {
  invoices: InvoiceSender;
  /** Its alert address (6h-4): registering, removing, and checking alerts are genuine. */
  webhooks: Pick<PayPalWebhooks, "verify" | "register" | "remove">;
}

/** A linked app's clients, the PayPal account they act as, and its alert address id if any. */
export interface LinkedApp {
  merchantId: string;
  webhookId: string | undefined;
  clients: LinkedAppClients;
}

/** Builds the clients for one app's keys (`ownAppClients` in the server; stand-ins in tests). */
export type ConnectApp = (credentials: PayPalAppCredentials) => LinkedAppClients;

/**
 * Sellers' own linked apps (6h): opens a live link's sealed secret and builds its clients once per
 * link. A link that has ended has no secret any more, so it gives nothing.
 */
export class LinkedApps {
  readonly #db: Database;
  readonly #box: SecretBox;
  readonly #connect: ConnectApp;
  readonly #known = new Map<string, LinkedApp>();

  constructor(db: Database, box: SecretBox, connect: ConnectApp) {
    this.#db = db;
    this.#box = box;
    this.#connect = connect;
  }

  /** The link's clients, or undefined once it has ended (or its secret cannot be opened). */
  async get(connectionId: string): Promise<LinkedApp | undefined> {
    // Asked every time, so an unlinked app is never used again even if its clients were built.
    const keys = await ownAppKeys(this.#db, connectionId);
    if (!keys) {
      this.#known.delete(connectionId);
      return undefined;
    }
    const known = this.#known.get(connectionId);
    // The alert id is set after linking, so it is read fresh each time.
    if (known) return { ...known, webhookId: keys.webhookId };
    const clientSecret = this.#box.open(keys.sealedSecret, `${connectionId}:${keys.clientId}`);
    if (!clientSecret) return undefined;
    const app = {
      merchantId: keys.merchantId,
      webhookId: keys.webhookId,
      clients: this.#connect({ clientId: keys.clientId, clientSecret }),
    };
    this.#known.set(connectionId, app);
    return app;
  }
}

/** Where a stage's invoice goes: PactPal's own seller app, or a seller's linked app. */
export type InvoiceAccount =
  | { kind: "pactpal"; invoices: InvoiceSender }
  | { kind: "own-app"; merchantId: string; invoices: InvoiceSender };

/** Why no account could be used. */
export type NoInvoiceAccount = "not-set-up" | "account-unlinked";

/** The PayPal invoice access PactPal has: its own seller app and sellers' linked apps. */
export interface InvoiceAccounts {
  /** PactPal's own seller app; undefined until its keys are set. */
  invoices: InvoiceSender | undefined;
  /** Sellers' own apps; absent until the database and encryption key are set. */
  linked?: LinkedApps | undefined;
}

/**
 * The account for a stage: its linked app when `connectionId` is set (refused once unlinked, never
 * swapped for another account), otherwise PactPal's own app.
 */
export async function invoicesFor(
  accounts: InvoiceAccounts,
  connectionId: string | null | undefined,
): Promise<{ ok: true; account: InvoiceAccount } | { ok: false; reason: NoInvoiceAccount }> {
  if (connectionId === null || connectionId === undefined) {
    return accounts.invoices
      ? { ok: true, account: { kind: "pactpal", invoices: accounts.invoices } }
      : { ok: false, reason: "not-set-up" };
  }
  const app = await accounts.linked?.get(connectionId);
  return app
    ? {
        ok: true,
        account: { kind: "own-app", merchantId: app.merchantId, invoices: app.clients.invoices },
      }
    : { ok: false, reason: "account-unlinked" };
}
