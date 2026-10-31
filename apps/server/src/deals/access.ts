import type { Database, Deal, SessionAccess, User } from "@pactpal/db";
import type { FastifyReply, FastifyRequest } from "fastify";
import { currentSession } from "../auth/sign-in.js";

/** Who is asking, and what their session allows. */
export interface Viewer {
  user: User;
  access: SessionAccess;
}

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

/**
 * Whether this person may see this deal: the seller or the buyer when signed in with PayPal; only
 * the link's own deal, as its buyer, for a buyer-link session.
 */
export function canSeeDeal(viewer: Viewer, deal: Deal): boolean {
  const { user, access } = viewer;
  if (access.method === "link") return access.dealId === deal.id && deal.buyerId === user.id;
  return deal.sellerId === user.id || deal.buyerId === user.id;
}

/** The person's role in a deal they may see. */
export const roleIn = (viewer: Viewer, deal: Deal): "seller" | "buyer" =>
  deal.sellerId === viewer.user.id ? "seller" : "buyer";
