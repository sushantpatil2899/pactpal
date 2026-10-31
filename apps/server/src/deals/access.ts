import type { Database } from "@pactpal/db";
import type { FastifyReply, FastifyRequest } from "fastify";
import { currentSession } from "../auth/sign-in.js";
import type { Viewer } from "./visibility.js";

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
