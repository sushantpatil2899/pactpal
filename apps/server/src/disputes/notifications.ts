import type { JsonValue } from "@pactpal/ledger";
import type { DisputeChecker } from "./checker.js";

/** PayPal's dispute notifications all start with this (none has reached the seller app so far). */
export const DISPUTE_EVENT_PREFIX = "CUSTOMER.DISPUTE.";

/**
 * Handles a stored PayPal notification: a dispute one starts a dispute check, which reads the
 * facts from PayPal itself; other kinds are left to their own handlers.
 */
export function disputeNotifications(checker: DisputeChecker) {
  return async (event: { eventId: string; eventType: string; body: JsonValue }): Promise<void> => {
    if (!event.eventType.startsWith(DISPUTE_EVENT_PREFIX)) return;
    await checker.start({ kind: "notification", eventId: event.eventId });
  };
}
