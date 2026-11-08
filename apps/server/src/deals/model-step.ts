import type { FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { readBody, type DealLookup, type FoundDeal } from "./access.js";

/**
 * The start of a seller's step that runs AI models: their deal, the checked request body and
 * the models, or undefined after answering (not found, a bad body, or 503 when no model is set).
 */
export async function sellerModelStep<T>(
  sellersDeal: DealLookup,
  schema: z.ZodType<T>,
  drafting: DraftingRuntime | undefined,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<{ found: FoundDeal; body: T; drafting: DraftingRuntime } | undefined> {
  const found = await sellersDeal(request, reply);
  if (!found) return undefined;
  const body = await readBody(schema, request, reply);
  if (!body) return undefined;
  if (!drafting || drafting.clients.length === 0) {
    await reply.code(503).send({ error: "no AI model is configured" });
    return undefined;
  }
  return { found, body, drafting };
}
