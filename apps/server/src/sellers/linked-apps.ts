import {
  connectedSellers,
  listMilestones,
  liveLinkForAccount,
  ownAppKeys,
  type Database,
  type StoredDispute,
} from "@pactpal/db";
import type { SecretBox } from "@pactpal/net";
import type { PayPalAppCredentials, PayPalWebhooks } from "@pactpal/paypal";
import type { DisputeWriter } from "../disputes/action-service.js";
import type { DisputeReader, LinkedDisputeAccount } from "../disputes/dispute-reader.js";
import type { InvoiceSender } from "../payments/invoice-sender.js";

/** What PactPal uses of a seller's own app. */
export interface LinkedAppClients {
  invoices: InvoiceSender;
  /** Reading its disputes and answering them (6h-5). */
  disputes: DisputeReader & DisputeWriter;
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

  /**
   * The app to reach the PayPal account of `connectionId` with: that link while live, else the
   * same seller's later link to the same account (6h-5). For reads and dispute answers only:
   * sending an invoice stays on its own link, so a request id never reaches another app.
   */
  async forAccount(connectionId: string): Promise<LinkedApp | undefined> {
    const live = await liveLinkForAccount(this.#db, connectionId);
    return live === undefined ? undefined : this.get(live);
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
  /** `account`: also through a later link to the same account (payment checks, not sending). */
  reach: "link" | "account" = "link",
): Promise<{ ok: true; account: InvoiceAccount } | { ok: false; reason: NoInvoiceAccount }> {
  if (connectionId === null || connectionId === undefined) {
    return accounts.invoices
      ? { ok: true, account: { kind: "pactpal", invoices: accounts.invoices } }
      : { ok: false, reason: "not-set-up" };
  }
  const app =
    reach === "account"
      ? await accounts.linked?.forAccount(connectionId)
      : await accounts.linked?.get(connectionId);
  return app
    ? {
        ok: true,
        account: { kind: "own-app", merchantId: app.merchantId, invoices: app.clients.invoices },
      }
    : { ok: false, reason: "account-unlinked" };
}

/** Finds who answers a dispute; undefined when no account can (sending is then off). */
export type DisputeWriterLookup = (
  db: Database,
  dispute: Pick<StoredDispute, "dealId" | "stage">,
) => Promise<DisputeWriter | undefined>;

/**
 * Who answers a dispute (6h-5): the account its disputed stage was invoiced from, PactPal's own app
 * or the seller's linked app (through a later link to the same account, if relinked).
 */
export function disputeWriters(
  pactpal: DisputeWriter | undefined,
  linked: LinkedApps | undefined,
): DisputeWriterLookup {
  return async (db, dispute) => {
    if (dispute.dealId === null || dispute.stage === null) return undefined;
    const stage = (await listMilestones(db, dispute.dealId)).find((m) => m.stage === dispute.stage);
    const connectionId = stage?.sellerConnectionId ?? null;
    if (connectionId === null) return pactpal;
    return (await linked?.forAccount(connectionId))?.clients.disputes;
  };
}

/**
 * Every live linked app whose secret opens, for one dispute check (6h-5). A link whose secret
 * cannot be opened is left out; the check logs nothing about it here.
 */
export async function linkedDisputeAccounts(
  db: Database,
  linked: LinkedApps,
): Promise<LinkedDisputeAccount[]> {
  const accounts: LinkedDisputeAccount[] = [];
  for (const connection of await connectedSellers(db)) {
    if (connection.method !== "own_app") continue;
    const app = await linked.get(connection.id);
    if (app) {
      accounts.push({
        connectionId: connection.id,
        merchantId: app.merchantId,
        disputes: app.clients.disputes,
      });
    }
  }
  return accounts;
}
