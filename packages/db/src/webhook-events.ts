import { z } from "zod";
import type { Queryable } from "./database.js";

export const newWebhookEventSchema = z.object({
  /** Who sent it, for example `paypal`. Together with `eventId` it identifies the event. */
  source: z.string().min(1),
  /** The sender's own id for the event; the same id again means a repeat. */
  eventId: z.string().min(1),
  eventType: z.string().min(1),
  resourceType: z.string().min(1).optional(),
  /** When the sender says the event happened. */
  eventCreatedAt: z.date().optional(),
  /** The whole event as received. */
  body: z.json(),
});
export type NewWebhookEvent = z.infer<typeof newWebhookEventSchema>;

/** `new`: saved now. `repeat`: already saved earlier, nothing changed. */
export type RecordResult = "new" | "repeat";

/**
 * Saves a notification unless one with the same source and id is already saved. The database
 * decides, in one step, so two copies arriving at once cannot both count as new. `now` is the
 * server's clock.
 */
export async function recordWebhookEvent(
  q: Queryable,
  event: NewWebhookEvent,
  now: Date,
): Promise<RecordResult> {
  const e = newWebhookEventSchema.parse(event);
  const rows = await q.query(
    `INSERT INTO webhook_events (source, event_id, event_type, resource_type, event_created_at,
                                 received_at, body)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     ON CONFLICT (source, event_id) DO NOTHING
     RETURNING event_id`,
    [
      e.source,
      e.eventId,
      e.eventType,
      e.resourceType ?? null,
      e.eventCreatedAt ?? null,
      now,
      JSON.stringify(e.body),
    ],
  );
  return rows.length === 1 ? "new" : "repeat";
}
