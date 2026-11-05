import {
  currentIntakeKey,
  makeIntakeKey,
  newDealSchema,
  turnOffIntakeKey,
  useIntakeKey,
  type Database,
  type IntakeKey,
} from "@pactpal/db";
import { numberSourceLines } from "@pactpal/scope-draft";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { readBody, requireViewer } from "./access.js";
import { createIntakeDeal, intakeFilename } from "./intake.js";

export interface IntakeRouteOptions {
  database: Database | undefined;
  clock: () => Date;
  newId: () => string;
  /** The site's own address, for the new deal's link in the answer. */
  publicBaseUrl: string | undefined;
  /** The forwarding domain (4p-2); while undefined, forwarding addresses cannot be made. */
  inboundDomain?: string | undefined;
}

/** The longest body a tool may post (the chat limit is 60,000 characters). */
const INTAKE_BODY_LIMIT = 128 * 1024;

const { category, currency, title } = newDealSchema.shape;
const keyBody = z.object({ defaultCategory: category, defaultCurrency: currency });
const intakeBody = z.object({
  text: z.string().min(1).max(60_000),
  title: title.optional(),
  category: category.optional(),
  currency: currency.optional(),
});

/** One secret as the settings show it: never the secret, only its ending and defaults. */
const secretView = (key: IntakeKey | undefined) =>
  key === undefined
    ? null
    : {
        ending: key.keyEnding,
        defaultCategory: key.defaultCategory,
        defaultCurrency: key.defaultCurrency,
        createdAt: key.createdAt.toISOString(),
        lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
      };

/** "From another tool: " and the text's first words, up to 60 characters in all. */
function titleFrom(text: string): string {
  const first = text.trim().split(/\r?\n/)[0] ?? "";
  const words = first.length > 41 ? `${first.slice(0, 40).trimEnd()}…` : first;
  return `From another tool: ${words}`;
}

/** The key in `Authorization: Bearer …`, or an empty string. */
const bearerOf = (request: FastifyRequest) =>
  /^Bearer\s+(\S+)$/.exec(request.headers.authorization ?? "")?.[1] ?? "";

/**
 * "Create a deal from text" (4p): a seller makes a private intake key; a tool posts text with it
 * and a draft deal is created for that seller, with the text saved as its chat file. Only a
 * seller signed in with PayPal manages keys; a key can create draft deals for its owner, nothing
 * else. Neither the key nor the text reaches the server's logs.
 */
export const intakeRoutes: FastifyPluginAsync<IntakeRouteOptions> = (app, options) => {
  const { database, clock, newId, publicBaseUrl, inboundDomain } = options;

  /** The seller's key and forwarding address, whether forwarding is on, and their own email. */
  async function settingsView(db: Database, seller: { id: string; email: string }) {
    const [key, address] = await Promise.all([
      currentIntakeKey(db, seller.id),
      currentIntakeKey(db, seller.id, "address"),
    ]);
    return {
      key: secretView(key),
      address: secretView(address),
      forwarding: inboundDomain !== undefined,
      sellerEmail: seller.email,
    };
  }

  /** The seller signed in with PayPal, or undefined after answering 401 or 403. */
  async function payPalSeller(request: FastifyRequest, reply: FastifyReply, db: Database) {
    const viewer = await requireViewer(request, reply, db, clock());
    if (viewer && viewer.access.method !== "paypal") {
      await reply.code(403).send({ error: "sign in with PayPal to manage intake keys" });
      return undefined;
    }
    return viewer;
  }

  app.get("/api/intake/key", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await payPalSeller(request, reply, database);
    if (!viewer) return reply;
    return reply.send(await settingsView(database, viewer.user));
  });

  for (const kind of ["key", "address"] as const) {
    app.post(`/api/intake/${kind}`, async (request, reply) => {
      if (!database) return reply.code(503).send({ error: "unavailable" });
      const viewer = await payPalSeller(request, reply, database);
      if (!viewer) return reply;
      if (kind === "address" && inboundDomain === undefined) {
        return reply.code(503).send({ error: "email forwarding is not set up yet" });
      }
      const body = await readBody(keyBody, request, reply);
      if (!body) return reply;
      const { key, record } = await makeIntakeKey(
        database,
        { ...body, id: newId(), sellerId: viewer.user.id },
        clock(),
        kind,
      );
      request.log.info({ keyId: record.id, kind }, "Intake secret made");
      // The only time the secret itself is sent: the page shows it once.
      const secret = kind === "key" ? key : `deals+${key}@${inboundDomain ?? ""}`;
      return reply.code(201).send({ ...(await settingsView(database, viewer.user)), secret });
    });

    app.post(`/api/intake/${kind}/off`, async (request, reply) => {
      if (!database) return reply.code(503).send({ error: "unavailable" });
      const viewer = await payPalSeller(request, reply, database);
      if (!viewer) return reply;
      await turnOffIntakeKey(database, viewer.user.id, clock(), kind);
      return reply.send(await settingsView(database, viewer.user));
    });
  }

  app.post("/api/intake/deals", { bodyLimit: INTAKE_BODY_LIMIT }, async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const body = await readBody(intakeBody, request, reply);
    if (!body) return reply;
    const numbered = numberSourceLines(body.text);
    if (!numbered.ok) return reply.code(422).send({ error: numbered.message });
    const used = await useIntakeKey(database, bearerOf(request), clock());
    if (!used.ok) {
      return used.reason === "too-many"
        ? reply.code(429).send({ error: "this key has created the most deals allowed today" })
        : reply.code(401).send({ error: "not a valid key" });
    }
    const { record } = used;
    const dealId = await createIntakeDeal(
      { db: database, clock, newId },
      {
        record,
        via: "intake",
        title: body.title ?? titleFrom(body.text),
        text: body.text,
        filename: intakeFilename("intake", clock()),
        ...(body.category === undefined ? {} : { category: body.category }),
        ...(body.currency === undefined ? {} : { currency: body.currency }),
      },
    );
    request.log.info({ dealId, keyId: record.id }, "Deal created from an intake key");
    return reply.code(201).send({ dealId, url: `${publicBaseUrl ?? ""}/deals/${dealId}` });
  });

  return Promise.resolve();
};
