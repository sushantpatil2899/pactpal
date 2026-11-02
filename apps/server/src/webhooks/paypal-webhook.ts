import type { NewWebhookEvent, RecordResult } from "@pactpal/db";
import type { JsonValue } from "@pactpal/ledger";
import type { PayPalWebhooks } from "@pactpal/paypal";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const PAYPAL_WEBHOOK_PATH = "/webhooks/paypal";

export interface PayPalWebhookOptions {
  /** Checks signatures with PayPal; undefined when the seller app keys are not set. */
  verifier: Pick<PayPalWebhooks, "verify"> | undefined;
  /** PayPal's id for this registered address; undefined until it is configured. */
  webhookId: string | undefined;
  /** Saves each notification; undefined until `DATABASE_URL` is set. */
  events: { record(event: NewWebhookEvent): Promise<RecordResult> } | undefined;
  /**
   * Acts on a saved notification (new or repeated; it must be safe to run twice). A failure is
   * answered 500, so PayPal sends the notification again and it is tried again.
   */
  process?: (event: { eventId: string; eventType: string; body: JsonValue }) => Promise<void>;
}

// Only the envelope is read; the event's contents are used by later phases.
const envelope = z.looseObject({
  id: z.string().min(1),
  event_type: z.string().min(1),
  create_time: z.string().optional(),
  resource_type: z.string().optional(),
});

type ParsedJson = { ok: true; value: z.infer<ReturnType<typeof z.json>> } | { ok: false };

function parseJson(text: string): ParsedJson {
  try {
    return { ok: true, value: z.json().parse(JSON.parse(text)) };
  } catch {
    return { ok: false };
  }
}

/** PayPal's time as a date; a value that is not a date is left out rather than refusing a genuine event. */
function toDate(value: string | undefined): Date | undefined {
  const date = value === undefined ? undefined : new Date(value);
  return date === undefined || Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * `POST /webhooks/paypal`: receives PayPal notifications. Each is verified
 * with PayPal against the exact bytes received before anything in it is used,
 * then saved in full; only then is it acknowledged, so an event we have not
 * saved is never acknowledged. Repeats are acknowledged without being saved again.
 *
 * A saved notification (new or repeated) is then handed to `process`, if given.
 *
 * Answers: 200 saved or repeat; 400 not genuine or malformed (PayPal stops);
 * 500 PayPal could not be asked, the event could not be saved, or it could not be processed
 * (PayPal retries);
 * 503 not configured yet (no seller keys, webhook id or database).
 * Bodies, signatures and personal data are never logged.
 */
export const paypalWebhookRoutes: FastifyPluginAsync<PayPalWebhookOptions> = (app, options) => {
  // Keep the body as text: verification must use the bytes exactly as PayPal sent them.
  app.addContentTypeParser("application/json", { parseAs: "string" }, (_request, body, done) => {
    done(null, body);
  });

  app.post(PAYPAL_WEBHOOK_PATH, async (request, reply) => {
    const { verifier, webhookId, events } = options;
    if (verifier === undefined || webhookId === undefined || events === undefined) {
      request.log.warn("PayPal notification refused: webhooks are not configured");
      return reply.code(503).send({ error: "not configured" });
    }
    const rawBody = typeof request.body === "string" ? request.body : "";
    const body = parseJson(rawBody);
    if (!body.ok) return reply.code(400).send({ error: "body is not JSON" });

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

    const event = envelope.safeParse(body.value);
    if (!event.success) return reply.code(400).send({ error: "not a PayPal event" });
    const { id, event_type: eventType, create_time: createdAt, resource_type } = event.data;
    let result: RecordResult;
    try {
      result = await events.record({
        source: "paypal",
        eventId: id,
        eventType,
        resourceType: resource_type,
        eventCreatedAt: toDate(createdAt),
        body: body.value,
      });
    } catch (error) {
      request.log.error({ err: error, eventId: id }, "PayPal notification could not be saved");
      return reply.code(500).send({ error: "could not save" });
    }
    if (result === "repeat") {
      request.log.info({ eventId: id, eventType }, "PayPal notification repeated");
    } else {
      request.log.info({ eventId: id, eventType, createdAt }, "PayPal notification stored");
    }
    if (options.process) {
      try {
        await options.process({ eventId: id, eventType, body: body.value });
      } catch (error) {
        request.log.error(
          { eventId: id, eventType, err: error instanceof Error ? error.name : "unknown" },
          "PayPal notification stored but not processed; PayPal will send it again",
        );
        return reply.code(500).send({ error: "could not process" });
      }
    }
    return reply.code(200).send({ status: result === "repeat" ? "repeat" : "received" });
  });

  return Promise.resolve();
};
