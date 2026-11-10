import {
  answerAgentRequest,
  listOpenAgentRequests,
  type AgentRequest,
  type Database,
} from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requirePayPalUser } from "../deals/access.js";

export interface AgentRequestRouteOptions {
  database: Database | undefined;
  clock: () => Date;
}

const listQuery = z.object({ dealId: z.uuid().optional() });
const params = z.object({ id: z.uuid() });

/** A request as the seller's page shows it: what it would do, never the stored body. */
const view = (request: AgentRequest) => ({
  id: request.id,
  dealId: request.dealId,
  kind: request.kind,
  status: request.status,
  summary: request.summary,
  keyEnding: request.keyEnding,
  createdAt: request.createdAt.toISOString(),
  codeExpiresAt: request.codeExpiresAt?.toISOString() ?? null,
});

const REFUSED = {
  "not-found": { status: 404, error: "not found" },
  "not-waiting": { status: 409, error: "this request was already answered" },
} as const;

/**
 * The seller's side of agent requests (8c): the open ones, and approving (which gives the
 * one-time code, shown once) or declining one. Only the seller signed in with PayPal; a buyer
 * link cannot see or answer them.
 */
export const agentRequestRoutes: FastifyPluginAsync<AgentRequestRouteOptions> = (app, options) => {
  const { database, clock } = options;

  const REFUSAL = "sign in with PayPal to answer your agent";

  app.get("/api/agent-requests", async (request, reply) => {
    const query = listQuery.safeParse(request.query);
    if (!query.success) return reply.code(400).send({ error: "invalid", fields: ["dealId"] });
    const viewer = await requirePayPalUser(request, reply, database, clock(), REFUSAL);
    if (!viewer || !database) return reply;
    const open = await listOpenAgentRequests(database, viewer.user.id, query.data.dealId);
    return reply.send({ requests: open.map(view) });
  });

  for (const answer of ["approve", "decline"] as const) {
    app.post(`/api/agent-requests/:id/${answer}`, async (request, reply) => {
      const viewer = await requirePayPalUser(request, reply, database, clock(), REFUSAL);
      if (!viewer || !database) return reply;
      const found = params.safeParse(request.params);
      if (!found.success) return reply.code(404).send({ error: "not found" });
      const answered = await answerAgentRequest(
        database,
        { id: found.data.id, sellerId: viewer.user.id, approve: answer === "approve" },
        clock(),
      );
      if (!answered.ok) {
        const refusal =
          answered.reason === "not-found" || answered.reason === "not-waiting"
            ? REFUSED[answered.reason]
            : REFUSED["not-waiting"];
        return reply.code(refusal.status).send({ error: refusal.error });
      }
      request.log.info({ requestId: found.data.id, answer }, "Agent request answered");
      // The only time the code is sent: the page shows it once for the seller to give their agent.
      return reply.send({
        request: view(answered.request),
        ...(answered.code === undefined ? {} : { code: answered.code }),
      });
    });
  }

  return Promise.resolve();
};
