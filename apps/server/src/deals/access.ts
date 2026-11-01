import { getDeal, type Database, type Deal } from "@pactpal/db";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { currentSession } from "../auth/sign-in.js";
import { canSeeDeal, roleIn, type Viewer } from "./visibility.js";

/**
 * The signed-in person for this request, or undefined after answering 401. Every deal route
 * starts here.
 */
export async function requireViewer(
  request: FastifyRequest,
  reply: FastifyReply,
  database: Database,
  now: Date,
): Promise<Viewer | undefined> {
  const session = await currentSession(request, database, now);
  if (!session) await reply.code(401).send({ error: "signed out" });
  return session;
}

/** The request body checked against `schema`, or undefined after answering 400 with the bad fields. */
export async function readBody<T>(
  schema: z.ZodType<T>,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<T | undefined> {
  const body = schema.safeParse(request.body);
  if (body.success) return body.data;
  await reply.code(400).send({
    error: "invalid",
    fields: body.error.issues.map((issue) => issue.path.join(".")),
  });
  return undefined;
}

const dealParams = z.object({ id: z.uuid() });

/** A deal the asking person may see, with who they are and the database to use. */
export interface FoundDeal {
  viewer: Viewer;
  deal: Deal;
  db: Database;
}

/** Finds a route's deal for the asking person, or answers and returns undefined. */
export type DealLookup = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<FoundDeal | undefined>;

/**
 * Finds the deal behind a route's `:id` for the asking person. Each lookup returns the deal or
 * undefined after answering: 503 without a database, 401 signed out, 404 for a deal they may not
 * see (so its existence is not revealed). `sellersDeal` answers 403 unless they are its seller
 * signed in with PayPal; `buyersDeal` 403 unless they are its buyer (signed in or by link).
 */
export function dealAccess(database: Database | undefined, clock: () => Date) {
  async function visibleDeal(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<FoundDeal | undefined> {
    if (!database) {
      await reply.code(503).send({ error: "unavailable" });
      return undefined;
    }
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return undefined;
    const params = dealParams.safeParse(request.params);
    const deal = params.success ? await getDeal(database, params.data.id) : undefined;
    if (!deal || !canSeeDeal(viewer, deal)) {
      await reply.code(404).send({ error: "not found" });
      return undefined;
    }
    return { viewer, deal, db: database };
  }

  /** A deal the asking person may see and in which they have `role`; sellers must use PayPal. */
  const partyDeal =
    (role: "seller" | "buyer"): DealLookup =>
    async (request, reply) => {
      const found = await visibleDeal(request, reply);
      if (!found) return undefined;
      const { viewer, deal } = found;
      const allowed =
        roleIn(viewer, deal) === role && (role === "buyer" || viewer.access.method === "paypal");
      if (!allowed) {
        await reply.code(403).send({ error: `only the ${role} can do this` });
        return undefined;
      }
      return found;
    };

  return { visibleDeal, sellersDeal: partyDeal("seller"), buyersDeal: partyDeal("buyer") };
}
