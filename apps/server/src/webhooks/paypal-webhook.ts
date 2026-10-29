import type { PayPalWebhooks } from "@pactpal/paypal";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { SeenEvents } from "./seen-events.js";

export const PAYPAL_WEBHOOK_PATH = "/webhooks/paypal";

export interface PayPalWebhookOptions {
  /** Checks signatures with PayPal; undefined when the seller app keys are not set. */
  verifier: Pick<PayPalWebhooks, "verify"> | undefined;
  /** PayPal's id for this registered address; undefined until it is configured. */
  webhookId: string | undefined;
  seen: SeenEvents;
}

// Only the envelope is read; the event's contents are used by later phases.
const envelope = z.looseObject({
  id: z.string().min(1),
  event_type: z.string().min(1),
  create_time: z.string().optional(),
  resource_type: z.string().optional(),
});

function isJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * `POST /webhooks/paypal`: receives PayPal notifications. Each is verified
 * with PayPal against the exact bytes received before anything in it is used;
 * repeats are acknowledged without being handled again.
 *
 * Answers: 200 handled or repeat; 400 not genuine or malformed (PayPal stops);
 * 500 PayPal could not be asked (PayPal retries); 503 not configured yet.
 * Bodies, signatures and personal data are never logged.
 */
export const paypalWebhookRoutes: FastifyPluginAsync<PayPalWebhookOptions> = (app, options) => {
  // Keep the body as text: verification must use the bytes exactly as PayPal sent them.
  app.addContentTypeParser("application/json", { parseAs: "string" }, (_request, body, done) => {
    done(null, body);
  });

  app.post(PAYPAL_WEBHOOK_PATH, async (request, reply) => {
    const { verifier, webhookId, seen } = options;
    if (verifier === undefined || webhookId === undefined) {
      request.log.warn("PayPal notification refused: webhooks are not configured");
      return reply.code(503).send({ error: "not configured" });
    }
    const rawBody = typeof request.body === "string" ? request.body : "";
    if (!isJson(rawBody)) return reply.code(400).send({ error: "body is not JSON" });

    const headers = Object.fromEntries(
      Object.entries(request.headers).map(([name, value]) => [
        name,
        Array.isArray(value) ? value[0] : value,
      ]),
    );
    let verification;
    try {
      verification = await verifier.verify(rawBody, headers, webhookId);
    } catch (error) {
      request.log.error({ err: error }, "PayPal notification could not be verified now");
      return reply.code(500).send({ error: "verification unavailable" });
    }
    if (!verification.verified) {
      request.log.warn({ reason: verification.reason }, "PayPal notification rejected");
      return reply.code(400).send({ error: "not verified" });
    }

    const event = envelope.safeParse(JSON.parse(rawBody));
    if (!event.success) return reply.code(400).send({ error: "not a PayPal event" });
    const { id, event_type: eventType, create_time: createdAt } = event.data;
    if (seen.has(id)) {
      request.log.info({ eventId: id, eventType }, "PayPal notification repeated; ignored");
      return reply.code(200).send({ status: "repeat" });
    }
    seen.add(id);
    request.log.info({ eventId: id, eventType, createdAt }, "PayPal notification received");
    return reply.code(200).send({ status: "received" });
  });

  return Promise.resolve();
};
