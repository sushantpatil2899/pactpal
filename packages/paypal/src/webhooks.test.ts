import { describe, expect, it } from "vitest";
import { fakeClients } from "./test-fakes.js";
import { PayPalWebhooks, WEBHOOK_EVENT_TYPES } from "./webhooks.js";

function setup(rest: unknown[] = []) {
  const { rest: client, restCalls } = fakeClients({ mcp: "none", rest });
  return { webhooks: new PayPalWebhooks(client), restCalls };
}

const headers = {
  "paypal-auth-algo": "SHA256withRSA",
  "paypal-cert-url": "https://api.sandbox.paypal.com/v1/notifications/certs/CERT-1",
  "paypal-transmission-id": "TX-1",
  "paypal-transmission-sig": "c2lnbmF0dXJl",
  "paypal-transmission-time": "2026-10-29T10:00:00Z",
};

// Spacing and key order as PayPal sent them; verification must keep them exactly.
const rawBody = '{"id":"WH-1",  "event_type":"INVOICING.INVOICE.CREATED","amount":1.10}';

describe("PayPalWebhooks.verify", () => {
  it("asks PayPal with the raw event embedded byte for byte", async () => {
    const { webhooks, restCalls } = setup([{ verification_status: "SUCCESS" }]);
    expect(await webhooks.verify(rawBody, headers, "WEBHOOK-1")).toEqual({ verified: true });

    const call = restCalls[0] as { rawJson: string; requestId: string; path: string };
    expect(call.path).toBe("/v1/notifications/verify-webhook-signature");
    expect(call.requestId).toBe("verify-TX-1");
    expect(call.rawJson).toBe(
      '{"auth_algo":"SHA256withRSA","cert_url":"https://api.sandbox.paypal.com/v1/notifications/certs/CERT-1",' +
        '"transmission_id":"TX-1","transmission_sig":"c2lnbmF0dXJl","transmission_time":"2026-10-29T10:00:00Z",' +
        `"webhook_id":"WEBHOOK-1","webhook_event":${rawBody}}`,
    );
  });

  it("reports PayPal's FAILURE as not verified", async () => {
    const { webhooks } = setup([{ verification_status: "FAILURE" }]);
    expect(await webhooks.verify(rawBody, headers, "WEBHOOK-1")).toEqual({
      verified: false,
      reason: "PayPal reported FAILURE",
    });
  });

  it.each([
    [{ ...headers, "paypal-transmission-sig": undefined }, "missing paypal-transmission-sig"],
    [{ ...headers, "paypal-auth-algo": "" }, "missing paypal-auth-algo"],
    [
      { ...headers, "paypal-cert-url": "https://evil.example.com/cert" },
      "certificate address is not on paypal.com",
    ],
    [
      { ...headers, "paypal-cert-url": "http://api.paypal.com/cert" },
      "certificate address is not on paypal.com",
    ],
    [
      { ...headers, "paypal-cert-url": "https://paypal.com.evil.example/cert" },
      "certificate address is not on paypal.com",
    ],
    [{ ...headers, "paypal-cert-url": "not a url" }, "certificate address is not on paypal.com"],
  ])("refuses without asking PayPal: %j", async (badHeaders, reason) => {
    const { webhooks, restCalls } = setup();
    expect(await webhooks.verify(rawBody, badHeaders, "WEBHOOK-1")).toEqual({
      verified: false,
      reason,
    });
    expect(restCalls).toEqual([]);
  });

  it("accepts a certificate on paypal.com itself", async () => {
    const { webhooks } = setup([{ verification_status: "SUCCESS" }]);
    const result = await webhooks.verify(
      rawBody,
      { ...headers, "paypal-cert-url": "https://paypal.com/c" },
      "W",
    );
    expect(result).toEqual({ verified: true });
  });

  it("throws when PayPal cannot be asked, so the notification is retried later", async () => {
    const { webhooks } = setup([new Error("PayPal down")]);
    await expect(webhooks.verify(rawBody, headers, "WEBHOOK-1")).rejects.toThrow("PayPal down");
  });
});

describe("PayPalWebhooks registrations and events", () => {
  const registered = {
    id: "WEBHOOK-1",
    url: "https://pactpal.example/webhooks/paypal",
    event_types: WEBHOOK_EVENT_TYPES.map((name) => ({ name, description: "x" })),
  };

  it("registers an address for PactPal's notification types", async () => {
    const { webhooks, restCalls } = setup([registered]);
    const result = await webhooks.register("https://pactpal.example/webhooks/paypal", "r-1");
    expect(result).toEqual({
      webhookId: "WEBHOOK-1",
      url: "https://pactpal.example/webhooks/paypal",
      eventTypes: [...WEBHOOK_EVENT_TYPES],
    });
    expect(restCalls[0]).toMatchObject({
      method: "POST",
      path: "/v1/notifications/webhooks",
      requestId: "r-1",
      body: {
        url: "https://pactpal.example/webhooks/paypal",
        event_types: WEBHOOK_EVENT_TYPES.map((name) => ({ name })),
      },
    });
  });

  it("lists registrations, including none", async () => {
    const { webhooks } = setup([{ webhooks: [registered] }, {}]);
    expect((await webhooks.list()).map((r) => r.webhookId)).toEqual(["WEBHOOK-1"]);
    expect(await webhooks.list()).toEqual([]);
  });

  it("removes a registration", async () => {
    const { webhooks, restCalls } = setup([undefined]);
    await webhooks.remove("WEBHOOK-1", "r-2");
    expect(restCalls[0]).toMatchObject({
      method: "DELETE",
      path: "/v1/notifications/webhooks/WEBHOOK-1",
    });
  });

  it("reads PayPal's record of recent notifications and their deliveries", async () => {
    const { webhooks, restCalls } = setup([
      {
        events: [
          {
            id: "WH-1",
            event_type: "INVOICING.INVOICE.CREATED",
            create_time: "2026-10-29T10:00:00Z",
            summary: "An invoice was created",
            transmissions: [
              {
                webhook_url: "https://pactpal.example/webhooks/paypal",
                status: "SUCCESS",
                http_status: 200,
              },
            ],
          },
          { id: "WH-2", event_type: "CUSTOMER.DISPUTE.CREATED" },
        ],
      },
    ]);
    expect(await webhooks.recentEvents(5)).toEqual([
      {
        eventId: "WH-1",
        eventType: "INVOICING.INVOICE.CREATED",
        createdAt: "2026-10-29T10:00:00Z",
        summary: "An invoice was created",
        deliveries: [
          { url: "https://pactpal.example/webhooks/paypal", status: "SUCCESS", httpStatus: 200 },
        ],
      },
      {
        eventId: "WH-2",
        eventType: "CUSTOMER.DISPUTE.CREATED",
        createdAt: undefined,
        summary: undefined,
        deliveries: [],
      },
    ]);
    expect(restCalls[0]).toMatchObject({
      path: "/v1/notifications/webhooks-events",
      query: { page_size: 5 },
    });
  });

  it("asks for 10 recent notifications by default", async () => {
    const { webhooks, restCalls } = setup([{}]);
    expect(await webhooks.recentEvents()).toEqual([]);
    expect(restCalls[0]).toMatchObject({ query: { page_size: 10 } });
  });
});
