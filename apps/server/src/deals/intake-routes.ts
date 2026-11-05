import {
  addArtifact,
  createDeal,
  currentIntakeKey,
  makeIntakeKey,
  newDealSchema,
  postgresContentStore,
  turnOffIntakeKey,
  useIntakeKey,
  type Database,
  type IntakeKey,
} from "@pactpal/db";
import { numberSourceLines } from "@pactpal/scope-draft";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { readBody, requireViewer } from "./access.js";

export interface IntakeRouteOptions {
  database: Database | undefined;
  clock: () => Date;
  newId: () => string;
  /** The site's own address, for the new deal's link in the answer. */
  publicBaseUrl: string | undefined;
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

/** The key status the settings show: never the key, only its ending and defaults. */
const keyView = (key: IntakeKey | undefined) => ({
  key:
    key === undefined
      ? null
      : {
          ending: key.keyEnding,
          defaultCategory: key.defaultCategory,
          defaultCurrency: key.defaultCurrency,
          createdAt: key.createdAt.toISOString(),
          lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
        },
});

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
  const { database, clock, newId, publicBaseUrl } = options;

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
    return reply.send(keyView(await currentIntakeKey(database, viewer.user.id)));
  });

  app.post("/api/intake/key", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await payPalSeller(request, reply, database);
    if (!viewer) return reply;
    const body = await readBody(keyBody, request, reply);
    if (!body) return reply;
    const { key, record } = await makeIntakeKey(
      database,
      { ...body, id: newId(), sellerId: viewer.user.id },
      clock(),
    );
    request.log.info({ keyId: record.id }, "Intake key made");
    // The only time the key itself is sent: the page shows it once.
    return reply.code(201).send({ ...keyView(record), secret: key });
  });

  app.post("/api/intake/key/off", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await payPalSeller(request, reply, database);
    if (!viewer) return reply;
    await turnOffIntakeKey(database, viewer.user.id, clock());
    return reply.send(keyView(undefined));
  });

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
    const { deal } = await createDeal(
      database,
      {
        id: newId(),
        sellerId: record.sellerId,
        title: body.title ?? titleFrom(body.text),
        category: body.category ?? record.defaultCategory,
        currency: body.currency ?? record.defaultCurrency,
      },
      clock(),
      { via: "intake", keyEnding: record.keyEnding },
    );
    await addArtifact(
      database,
      postgresContentStore(database, clock),
      {
        id: newId(),
        dealId: deal.id,
        kind: "source",
        filename: `intake-${clock().toISOString().slice(0, 10)}.txt`,
        bytes: new TextEncoder().encode(body.text),
        addedBy: { actor: "seller", actorId: record.sellerId },
      },
      clock(),
    );
    request.log.info({ dealId: deal.id, keyId: record.id }, "Deal created from an intake key");
    return reply
      .code(201)
      .send({ dealId: deal.id, url: `${publicBaseUrl ?? ""}/deals/${deal.id}` });
  });

  return Promise.resolve();
};
