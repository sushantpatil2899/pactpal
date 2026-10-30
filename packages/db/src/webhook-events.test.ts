import { describe, expect, it } from "vitest";
import { recordWebhookEvent, type NewWebhookEvent } from "./index.js";
import { TEST_NOW, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();

const event: NewWebhookEvent = {
  source: "paypal",
  eventId: "WH-1",
  eventType: "INVOICING.INVOICE.PAID",
  resourceType: "invoices",
  eventCreatedAt: new Date("2026-10-02T09:59:48.000Z"),
  body: { id: "WH-1", resource: { amount: { value: "10.00" }, tags: ["a", null] } },
};

describe("recordWebhookEvent", () => {
  it("saves a new event in full, with the time it was received", async () => {
    expect(await recordWebhookEvent(db, event, TEST_NOW)).toBe("new");
    expect(await db.query("SELECT * FROM webhook_events")).toEqual([
      {
        source: "paypal",
        event_id: "WH-1",
        event_type: "INVOICING.INVOICE.PAID",
        resource_type: "invoices",
        event_created_at: new Date("2026-10-02T09:59:48.000Z"),
        received_at: TEST_NOW,
        body: event.body,
      },
    ]);
  });

  it("saves an event that has no resource type or creation time", async () => {
    const bare = { source: "paypal", eventId: "WH-2", eventType: "X", body: {} };
    expect(await recordWebhookEvent(db, bare, TEST_NOW)).toBe("new");
    expect(await db.query("SELECT resource_type, event_created_at FROM webhook_events")).toEqual([
      { resource_type: null, event_created_at: null },
    ]);
  });

  it("recognises a repeat and keeps the first copy untouched", async () => {
    await recordWebhookEvent(db, event, TEST_NOW);
    const later = new Date("2026-10-03T00:00:00.000Z");
    expect(await recordWebhookEvent(db, { ...event, body: { changed: true } }, later)).toBe(
      "repeat",
    );
    const rows = await db.query("SELECT received_at, body FROM webhook_events");
    expect(rows).toEqual([{ received_at: TEST_NOW, body: event.body }]);
  });

  it("keeps the same id from another source, and another id from the same source, apart", async () => {
    await recordWebhookEvent(db, event, TEST_NOW);
    expect(await recordWebhookEvent(db, { ...event, source: "zapier" }, TEST_NOW)).toBe("new");
    expect(await recordWebhookEvent(db, { ...event, eventId: "WH-9" }, TEST_NOW)).toBe("new");
    expect(await db.query("SELECT 1 FROM webhook_events")).toHaveLength(3);
  });

  it.each([
    ["no event id", { eventId: "" }],
    ["no event type", { eventType: "" }],
    ["no source", { source: "" }],
    ["a body that is not JSON", { body: () => 1 }],
  ])("rejects %s before touching the database", async (_name, overrides) => {
    await expect(
      recordWebhookEvent(db, { ...event, ...overrides } as NewWebhookEvent, TEST_NOW),
    ).rejects.toThrow();
    expect(await db.query("SELECT 1 FROM webhook_events")).toEqual([]);
  });
});
