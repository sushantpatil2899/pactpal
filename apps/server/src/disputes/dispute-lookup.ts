import { getDispute, type StoredDispute } from "@pactpal/db";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { DealLookup, FoundDeal } from "../deals/access.js";

const disputeParams = z.object({ disputeId: z.string().min(1).max(100) });

/** The deal's own dispute named in the address (`:disputeId`), or undefined after answering 404. */
export async function disputeOf(
  request: FastifyRequest,
  reply: FastifyReply,
  found: FoundDeal,
): Promise<StoredDispute | undefined> {
  const params = disputeParams.safeParse(request.params);
  const dispute = params.success ? await getDispute(found.db, params.data.disputeId) : undefined;
  if (dispute?.dealId === found.deal.id) return dispute;
  await reply.code(404).send({ error: "not found" });
  return undefined;
}

/** The seller's deal and its dispute named in the address, or undefined after answering. */
export async function sellersDispute(
  sellersDeal: DealLookup,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<{ found: FoundDeal; dispute: StoredDispute } | undefined> {
  const found = await sellersDeal(request, reply);
  const dispute = found && (await disputeOf(request, reply, found));
  return found && dispute ? { found, dispute } : undefined;
}
