import {
  activeConnection,
  disconnectSeller,
  linkOwnApp,
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
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { currentSession } from "../auth/sign-in.js";
import { readBody } from "../deals/access.js";

export const SELLER_APP_PATH = "/api/seller-app";

/** What linking a seller's own app needs; absent until the database and encryption key are set. */
export interface SellerAppLinking {
  /** Encrypts app secrets before they are stored (`SELLER_KEYS_ENCRYPTION_KEY`). */
  box: SecretBox;
  /** Checks the keys with PayPal and names the account (`checkSellerApp`; a stand-in in tests). */
  check: (credentials: PayPalAppCredentials) => Promise<SellerAppCheck>;
}

export interface SellerAppRouteOptions {
  database: Database | undefined;
  clock: () => Date;
  newId: () => string;
  sellerApps: SellerAppLinking | undefined;
}

/** A linked app as the page sees it: never the secret. */
export interface SellerAppView {
  merchantId: string;
  clientId: string;
  linkedAt: string;
}

/** The seller's own-app link, or null (no link, or a "Connect with PayPal" one). */
export function sellerAppView(connection: SellerConnection | undefined): SellerAppView | null {
  if (connection?.method !== "own_app" || connection.merchantId === undefined) return null;
  return {
    merchantId: connection.merchantId,
    clientId: connection.clientId,
    linkedAt: (connection.connectedAt ?? connection.createdAt).toISOString(),
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
  const { database, clock, newId, sellerApps } = options;

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
    const linked = await linkOwnApp(
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
    if (!linked.ok) {
      request.log.info({ reason: linked.reason }, "Seller app refused");
      return reply.code(409).send({ error: linked.reason });
    }
    request.log.info({ connectionId: id, merchantId: check.merchantId }, "Seller app linked");
    return reply.send({ link: sellerAppView(linked.connection) });
  });

  app.delete(SELLER_APP_PATH, async (request, reply) => {
    const found = await seller(request, reply);
    if (!found) return reply;
    // Only an own-app link is ended here; a "Connect with PayPal" one has its own page (6d).
    const current = await activeConnection(found.db, found.user.id);
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
