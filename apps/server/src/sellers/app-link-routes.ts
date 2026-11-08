import {
  activeConnection,
  disconnectSeller,
  linkOwnApp,
  setOwnAppWebhook,
  type Database,
  type SellerConnection,
} from "@pactpal/db";
import { Secret, type SecretBox } from "@pactpal/net";
import {
  PayPalApiError,
  PayPalNetworkError,
  PayPalResponseError,
  type PayPalAppCredentials,
  type SellerAppCheck,
} from "@pactpal/paypal";
import type { FastifyBaseLogger, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { currentSession } from "../auth/sign-in.js";
import { readBody } from "../deals/access.js";
import type { ConnectApp, LinkedApps } from "./linked-apps.js";
import { sellerWebhookUrl } from "../webhooks/paypal-webhook.js";

export const SELLER_APP_PATH = "/api/seller-app";

/** What linking a seller's own app needs; absent until the database and encryption key are set. */
export interface SellerAppLinking {
  /** Encrypts app secrets before they are stored (`SELLER_KEYS_ENCRYPTION_KEY`). */
  box: SecretBox;
  /** Checks the keys with PayPal and names the account (`checkSellerApp`; a stand-in in tests). */
  check: (credentials: PayPalAppCredentials) => Promise<SellerAppCheck>;
  /** Builds a linked app's clients (`ownAppClients`; stand-ins in tests). */
  connect: ConnectApp;
}

export interface SellerAppRouteOptions {
  database: Database | undefined;
  clock: () => Date;
  newId: () => string;
  sellerApps: SellerAppLinking | undefined;
  /** Opens linked apps, to register and remove their alert address (6h-4). */
  linked: LinkedApps | undefined;
  /** The site's own address; alerts are registered only when it is https. */
  publicBaseUrl: string | undefined;
}

/** A linked app as the page sees it: never the secret. */
export interface SellerAppView {
  merchantId: string;
  clientId: string;
  linkedAt: string;
  /** Whether PayPal sends this app's payment alerts to PactPal (6h-4). */
  alerts: boolean;
}

/** The seller's own-app link, or null (no link, or a "Connect with PayPal" one). */
export function sellerAppView(connection: SellerConnection | undefined): SellerAppView | null {
  if (connection?.method !== "own_app" || connection.merchantId === undefined) return null;
  return {
    merchantId: connection.merchantId,
    clientId: connection.clientId,
    linkedAt: (connection.connectedAt ?? connection.createdAt).toISOString(),
    alerts: connection.webhookId !== undefined,
  };
}

/** PayPal client ids and secrets are letters, digits, `-` and `_`; pasted spaces are trimmed. */
const key = (max: number) =>
  z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]+$/)
    .max(max);
const linkBody = z.object({ clientId: key(128), clientSecret: key(256) });

/** PayPal itself failed (not the keys): worth trying again later. */
const paypalUnavailable = (error: unknown): boolean =>
  error instanceof PayPalApiError ||
  error instanceof PayPalNetworkError ||
  error instanceof PayPalResponseError;

/**
 * "Your PayPal app" (6h-2): a seller signed in with PayPal links their own sandbox REST app, or
 * unlinks it. The secret is checked with PayPal, encrypted, stored, and never sent back or logged;
 * error answers name fields, never values. Buyers who came in through a link may not use it.
 */
export const sellerAppRoutes: FastifyPluginAsync<SellerAppRouteOptions> = (app, options) => {
  const { database, clock, newId, sellerApps, linked, publicBaseUrl } = options;

  /**
   * Asks PayPal, through the new link's app, to send its alerts to this link's own address. Best
   * effort: a refusal leaves the link working, with "Check payment status" as the way to see payments.
   */
  async function registerAlerts(db: Database, connectionId: string, log: FastifyBaseLogger) {
    if (!publicBaseUrl?.startsWith("https://")) return false;
    const linkedApp = await linked?.get(connectionId);
    if (!linkedApp) return false;
    try {
      const registered = await linkedApp.clients.webhooks.register(
        sellerWebhookUrl(publicBaseUrl, connectionId),
        `alerts-${connectionId}`,
      );
      return await setOwnAppWebhook(db, connectionId, registered.webhookId);
    } catch (error) {
      if (!paypalUnavailable(error)) throw error;
      const debugId = error instanceof PayPalApiError ? error.debugId : undefined;
      log.warn({ connectionId, debugId }, "Seller app alerts not registered");
      return false;
    }
  }

  /** Removes the link's alert address before the link (and its secret) ends. Best effort. */
  async function removeAlerts(connectionId: string, log: FastifyBaseLogger) {
    const linkedApp = await linked?.get(connectionId);
    if (linkedApp?.webhookId === undefined) return;
    try {
      await linkedApp.clients.webhooks.remove(linkedApp.webhookId, `alerts-off-${connectionId}`);
    } catch (error) {
      if (!paypalUnavailable(error)) throw error;
      const debugId = error instanceof PayPalApiError ? error.debugId : undefined;
      log.warn({ connectionId, debugId }, "Seller app alerts not removed");
    }
  }

  /** The PayPal-signed-in user, or undefined after answering 503, 401 or 403. */
  async function seller(request: FastifyRequest, reply: FastifyReply) {
    if (!database) {
      await reply.code(503).send({ error: "unavailable" });
      return undefined;
    }
    const session = await currentSession(request, database, clock());
    if (!session) {
      await reply.code(401).send({ error: "signed out" });
      return undefined;
    }
    if (session.access.method !== "paypal") {
      await reply.code(403).send({ error: "sign in with PayPal" });
      return undefined;
    }
    return { user: session.user, db: database };
  }

  app.get(SELLER_APP_PATH, async (request, reply) => {
    const found = await seller(request, reply);
    if (!found) return reply;
    return reply.send({
      available: sellerApps !== undefined,
      link: sellerAppView(await activeConnection(found.db, found.user.id)),
    });
  });

  app.post(SELLER_APP_PATH, async (request, reply) => {
    const found = await seller(request, reply);
    if (!found) return reply;
    if (!sellerApps) return reply.code(503).send({ error: "unavailable" });
    const body = await readBody(linkBody, request, reply);
    if (!body) return reply;
    const credentials = { clientId: body.clientId, clientSecret: new Secret(body.clientSecret) };

    let check: SellerAppCheck;
    try {
      check = await sellerApps.check(credentials);
    } catch (error) {
      if (!paypalUnavailable(error)) throw error;
      const debugId = error instanceof PayPalApiError ? error.debugId : undefined;
      request.log.warn({ debugId, kind: (error as Error).name }, "Seller app check: PayPal failed");
      return reply.code(502).send({ error: "paypal-unavailable" });
    }
    if (!check.ok) {
      request.log.info({ reason: check.reason }, "Seller app refused");
      return reply
        .code(422)
        .send(
          check.reason === "missing-features"
            ? { error: check.reason, missing: check.missing }
            : { error: check.reason },
        );
    }

    const id = newId();
    const result = await linkOwnApp(
      found.db,
      {
        id,
        userId: found.user.id,
        clientId: credentials.clientId,
        sealedSecret: sellerApps.box.seal(
          credentials.clientSecret,
          `${id}:${credentials.clientId}`,
        ),
        merchantId: check.merchantId,
        scopes: check.scopes,
      },
      clock(),
    );
    if (!result.ok) {
      request.log.info({ reason: result.reason }, "Seller app refused");
      return reply.code(409).send({ error: result.reason });
    }
    const alerts = await registerAlerts(found.db, id, request.log);
    request.log.info(
      { connectionId: id, merchantId: check.merchantId, alerts },
      "Seller app linked",
    );
    return reply.send({ link: sellerAppView(await activeConnection(found.db, found.user.id)) });
  });

  app.delete(SELLER_APP_PATH, async (request, reply) => {
    const found = await seller(request, reply);
    if (!found) return reply;
    // Only an own-app link is ended here; a "Connect with PayPal" one has its own page (6d).
    const current = await activeConnection(found.db, found.user.id);
    if (current?.method === "own_app") await removeAlerts(current.id, request.log);
    if (
      current?.method === "own_app" &&
      (await disconnectSeller(found.db, found.user.id, clock()))
    ) {
      request.log.info({ connectionId: current.id }, "Seller app unlinked");
    }
    return reply.code(204).send();
  });

  return Promise.resolve();
};
