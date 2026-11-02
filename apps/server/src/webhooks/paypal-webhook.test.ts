import { recordWebhookEvent, type NewWebhookEvent, type RecordResult } from "@pactpal/db";
import { useMigratedTestDatabase } from "@pactpal/db/testing";
import type { WebhookVerification } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import type { ConfigReport } from "../config.js";

const report: ConfigReport = { settings: [], features: [] };

const event = {
  id: "WH-1",
  event_type: "INVOICING.INVOICE.CREATED",
  create_time: "2026-10-29T10:00:00Z",
  resource: {
    id: "INV2-AAAA",
    primary_recipients: [{ billing_info: { email_address: "buyer@example.com" } }],
  },
};
const rawBody = JSON.stringify(event, null, 1); // unusual spacing, as PayPal might send

const headers = {
  "content-type": "application/json",
  "paypal-transmission-id": "TX-1",
  "paypal-transmission-sig": "SECRET-SIGNATURE",
};

function setup(
  options: {
    answer?: WebhookVerification | Error;
    webhookId?: string | undefined;
    noVerifier?: boolean;
    noEvents?: boolean;
    failSaving?: boolean;
    events?: { record(event: NewWebhookEvent): Promise<RecordResult> };
    process?: (event: { eventId: string; eventType: string }) => Promise<void>;
  } = {},
) {
  const logs: string[] = [];
  const calls: {
    rawBody: string;
    headers: Record<string, string | undefined>;
    webhookId: string;
  }[] = [];
  const verifier = {
    verify: (body: string, h: Readonly<Record<string, string | undefined>>, webhookId: string) => {
      calls.push({ rawBody: body, headers: { ...h }, webhookId });
      const answer = options.answer ?? { verified: true };
      return answer instanceof Error ? Promise.reject(answer) : Promise.resolve(answer);
    },
  };
  const saved: NewWebhookEvent[] = [];
  const known = new Set<string>();
  const events = options.events ?? {
    record: (e: NewWebhookEvent) => {
      if (options.failSaving) return Promise.reject(new Error("database down"));
      const repeat = known.has(e.eventId);
      known.add(e.eventId);
      if (!repeat) saved.push(e);
      return Promise.resolve<RecordResult>(repeat ? "repeat" : "new");
    },
  };
  const app = buildApp(report, {
    logger: { stream: { write: (line) => logs.push(line) } },
    webhooks: {
      verifier: options.noVerifier ? undefined : verifier,
      webhookId: "webhookId" in options ? options.webhookId : "WEBHOOK-1",
      events: options.noEvents ? undefined : events,
      ...(options.process ? { process: options.process } : {}),
    },
  });
  const post = (payload = rawBody) =>
    app.inject({ method: "POST", url: "/webhooks/paypal", headers, payload });
  return { app, post, calls, logs, saved };
}

describe("POST /webhooks/paypal", () => {
  it("verifies the exact bytes received, then accepts the notification", async () => {
    const { app, post, calls, logs, saved } = setup();
    const res = await post();
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "received" });
    expect(saved).toEqual([
      {
        source: "paypal",
        eventId: "WH-1",
        eventType: "INVOICING.INVOICE.CREATED",
        resourceType: undefined,
        eventCreatedAt: new Date("2026-10-29T10:00:00Z"),
        body: event,
      },
    ]);
    expect(logs.join("")).toContain("PayPal notification stored");
    expect(calls).toHaveLength(1);
    expect(calls[0]?.rawBody).toBe(rawBody);
    expect(calls[0]?.webhookId).toBe("WEBHOOK-1");
    expect(calls[0]?.headers["paypal-transmission-id"]).toBe("TX-1");
    expect(logs.join("")).toContain('"eventId":"WH-1"');
    await app.close();
  });

  it("acknowledges a repeat without saving it again", async () => {
    const { app, post, saved } = setup();
    await post();
    const res = await post();
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "repeat" });
    expect(saved).toHaveLength(1);
    await app.close();
  });

  it("keeps a genuine event whose creation time is not a date, leaving the time out", async () => {
    const { app, post, saved } = setup();
    const odd = JSON.stringify({
      ...event,
      create_time: "yesterday-ish",
      resource_type: "invoices",
    });
    expect((await post(odd)).statusCode).toBe(200);
    expect(saved[0]).toMatchObject({ eventCreatedAt: undefined, resourceType: "invoices" });
    await app.close();
  });

  it("does not acknowledge an event it could not save, so PayPal sends it again", async () => {
    const { app, post, saved, logs } = setup({ failSaving: true });
    const res = await post();
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: "could not save" });
    expect(saved).toEqual([]);
    expect(logs.join("")).toContain("could not be saved");
    await app.close();
  });

  it("never logs the body, signature or personal data", async () => {
    const { app, post, logs } = setup({
      answer: { verified: false, reason: "PayPal reported FAILURE" },
    });
    await post();
    const ok = setup();
    await ok.post();
    const all = [...logs, ...ok.logs].join("");
    for (const secret of ["SECRET-SIGNATURE", "buyer@example.com", "INV2-AAAA"]) {
      expect(all).not.toContain(secret);
    }
    await app.close();
    await ok.app.close();
  });

  it.each([
    [
      "not verified",
      { answer: { verified: false as const, reason: "x" } },
      rawBody,
      400,
      "not verified",
    ],
    ["not JSON", {}, "{oops", 400, "body is not JSON"],
    ["not a PayPal event", {}, JSON.stringify({ hello: 1 }), 400, "not a PayPal event"],
    [
      "PayPal unreachable",
      { answer: new Error("PayPal down") },
      rawBody,
      500,
      "verification unavailable",
    ],
    ["no webhook id", { webhookId: undefined }, rawBody, 503, "not configured"],
    ["no seller keys", { noVerifier: true }, rawBody, 503, "not configured"],
    ["no database", { noEvents: true }, rawBody, 503, "not configured"],
  ])("answers %s", async (_label, options, payload, status, error) => {
    const { app, post } = setup(options);
    const res = await post(payload);
    expect(res.statusCode).toBe(status);
    expect(res.json()).toEqual({ error });
    await app.close();
  });

  it("is not configured by default", async () => {
    const app = buildApp(report, { logger: false });
    const res = await app.inject({
      method: "POST",
      url: "/webhooks/paypal",
      headers,
      payload: rawBody,
    });
    expect(res.statusCode).toBe(503);
    await app.close();
  });
});

describe("POST /webhooks/paypal with the real event log", () => {
  const db = useMigratedTestDatabase();

  it("saves the event once in the database and recognises the repeat", async () => {
    const { app, post } = setup({
      events: { record: (e) => recordWebhookEvent(db, e, new Date("2026-10-29T10:00:05Z")) },
    });
    expect((await post()).json()).toEqual({ status: "received" });
    expect((await post()).json()).toEqual({ status: "repeat" });
    expect(
      await db.query("SELECT source, event_id, received_at, body FROM webhook_events"),
    ).toEqual([
      {
        source: "paypal",
        event_id: "WH-1",
        received_at: new Date("2026-10-29T10:00:05Z"),
        body: event,
      },
    ]);
    await app.close();
  });

  it("hands each saved notification, new or repeated, to processing", async () => {
    const seen: string[] = [];
    const { app, post } = setup({
      process: (e) => {
        seen.push(`${e.eventId}:${e.eventType}`);
        return Promise.resolve();
      },
    });
    expect((await post()).json()).toEqual({ status: "received" });
    expect((await post()).json()).toEqual({ status: "repeat" });
    expect(seen).toEqual(["WH-1:INVOICING.INVOICE.CREATED", "WH-1:INVOICING.INVOICE.CREATED"]);
    await app.close();
  });

  it("answers 500 when processing fails, so PayPal sends it again", async () => {
    const { app, post, logs, saved } = setup({
      process: () => Promise.reject(new TypeError("PayPal down")),
    });
    const res = await post();
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: "could not process" });
    expect(saved).toHaveLength(1);
    expect(logs.join("")).toContain("stored but not processed");
    expect(logs.join("")).not.toContain("buyer@example.com");
    await app.close();
  });
});
