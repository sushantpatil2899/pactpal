import type { WebhookVerification } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import type { ConfigReport } from "../config.js";
import { MemorySeenEvents } from "./seen-events.js";

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
  const app = buildApp(report, {
    logger: { stream: { write: (line) => logs.push(line) } },
    webhooks: {
      verifier: options.noVerifier ? undefined : verifier,
      webhookId: "webhookId" in options ? options.webhookId : "WEBHOOK-1",
      seen: new MemorySeenEvents(),
    },
  });
  const post = (payload = rawBody) =>
    app.inject({ method: "POST", url: "/webhooks/paypal", headers, payload });
  return { app, post, calls, logs };
}

describe("POST /webhooks/paypal", () => {
  it("verifies the exact bytes received, then accepts the notification", async () => {
    const { app, post, calls, logs } = setup();
    const res = await post();
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "received" });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.rawBody).toBe(rawBody);
    expect(calls[0]?.webhookId).toBe("WEBHOOK-1");
    expect(calls[0]?.headers["paypal-transmission-id"]).toBe("TX-1");
    expect(logs.join("")).toContain('"eventId":"WH-1"');
    await app.close();
  });

  it("acknowledges a repeat without handling it again", async () => {
    const { app, post } = setup();
    await post();
    const res = await post();
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "repeat" });
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
