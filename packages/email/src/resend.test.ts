import { Secret, type HttpDeps } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { json, network } from "./testing.js";
import {
  EMAIL_RETRY_POLICY,
  RESEND_EMAILS_URL,
  ResendEmailSender,
  StandInEmailSender,
  isReservedTestAddress,
  type EmailMessage,
} from "./index.js";

const KEY = "re_test_secret_key_value";
const FROM = "PactPal <receipts@send.pactpal.test>";

const message: EmailMessage = {
  kind: "receipt",
  to: "chris@buyer.pact-pal.app",
  subject: "Receipt",
  text: "Private text with a link https://pactpal.test/link#t=SECRET",
  idempotencyKey: "receipt:deal:v1:buyer:1",
  attachments: [{ filename: "pactpal-receipt-v1.pdf", bytes: new Uint8Array([37, 80, 68, 70]) }],
};

const sender = (deps: HttpDeps) =>
  new ResendEmailSender({ apiKey: new Secret(KEY), from: FROM, deps });

/** The JSON body a recorded request sent. */
const sentBody = (init: RequestInit | undefined): unknown => JSON.parse(init?.body as string);

describe("ResendEmailSender", () => {
  it("sends one email with the key, the idempotency key and the attachment in base64", async () => {
    const { deps, calls } = network([json(200, { id: "msg_123" })]);
    expect(await sender(deps).send(message)).toEqual({ ok: true, id: "msg_123" });
    expect(calls).toHaveLength(1);
    const [call] = calls;
    expect(call?.url).toBe(RESEND_EMAILS_URL);
    expect(call?.init.method).toBe("POST");
    expect(call?.init.headers).toEqual({
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      "idempotency-key": "receipt:deal:v1:buyer:1",
    });
    expect(sentBody(call?.init)).toEqual({
      from: FROM,
      to: ["chris@buyer.pact-pal.app"],
      subject: "Receipt",
      text: message.text,
      attachments: [{ filename: "pactpal-receipt-v1.pdf", content: "JVBERg==" }],
    });
  });

  it("retries a keyed email after a 429, waiting as long as Resend asks", async () => {
    const { deps, calls, waits } = network([
      json(429, { name: "rate_limit_exceeded" }, { "retry-after": "2" }),
      json(200, { id: "msg_2" }),
    ]);
    expect(await sender(deps).send(message)).toEqual({ ok: true, id: "msg_2" });
    expect(calls).toHaveLength(2);
    expect(waits[0]).toBeGreaterThanOrEqual(2000);
    // The same idempotency key both times, so Resend sends it once.
    expect(calls.map((c) => (c.init.headers as Record<string, string>)["idempotency-key"])).toEqual(
      ["receipt:deal:v1:buyer:1", "receipt:deal:v1:buyer:1"],
    );
  });

  it("does not retry an email without an idempotency key, and sends no attachments field", async () => {
    const { deps, calls } = network([json(503, {})]);
    const plain: EmailMessage = {
      kind: message.kind,
      to: message.to,
      subject: message.subject,
      text: message.text,
    };
    expect(await sender(deps).send(plain)).toEqual({
      ok: false,
      reason: "server",
      detail: "Resend answered 503",
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.init.headers).not.toHaveProperty("idempotency-key");
    expect(sentBody(calls[0]?.init)).not.toHaveProperty("attachments");
    expect(sentBody(calls[0]?.init)).not.toHaveProperty("html");
  });

  it("sends the designed version with the plain text when the email has one (9h)", async () => {
    const { deps, calls } = network([json(200, { id: "msg_3" })]);
    await sender(deps).send({ ...message, html: "<p>Designed</p>" });
    expect(sentBody(calls[0]?.init)).toMatchObject({ text: message.text, html: "<p>Designed</p>" });
  });

  it.each([
    [
      422,
      { name: "validation_error", message: "chris@buyer.pact-pal.app is invalid" },
      "rejected",
      "Resend answered 422 (validation_error)",
    ],
    [403, { name: "validation_error" }, "rejected", "Resend answered 403 (validation_error)"],
    [401, "not json", "rejected", "Resend answered 401"],
    [
      429,
      { name: "daily_quota_exceeded" },
      "rate_limited",
      "Resend answered 429 (daily_quota_exceeded)",
    ],
    [500, { name: "a name with spaces is not shown" }, "server", "Resend answered 500"],
  ])(
    "reports a %i answer without the address or the provider's message",
    async (status, body, reason, detail) => {
      const answers = Array.from({ length: EMAIL_RETRY_POLICY.maxAttempts }, () =>
        typeof body === "string" ? new Response(body, { status }) : json(status, body),
      );
      const result = await sender(network(answers).deps).send(message);
      expect(result).toEqual({ ok: false, reason, detail });
      expect(JSON.stringify(result)).not.toContain("chris@");
    },
  );

  it("reports no answer at all as a network failure, after its retries", async () => {
    const { deps, calls } = network([
      new TypeError("down"),
      new TypeError("down"),
      new TypeError("down"),
    ]);
    expect(await sender(deps).send(message)).toEqual({
      ok: false,
      reason: "network",
      detail: "Resend: could not reach Resend",
    });
    expect(calls).toHaveLength(EMAIL_RETRY_POLICY.maxAttempts);
  });

  it("reports a timeout", async () => {
    const timeout = new DOMException("The operation timed out.", "TimeoutError");
    const { deps } = network([timeout, timeout, timeout]);
    expect(await sender(deps).send(message)).toMatchObject({
      reason: "network",
      detail: "Resend: timed out",
    });
  });

  it("reports a success answer without a message id as a server failure", async () => {
    const { deps } = network([json(200, { nope: true })]);
    expect(await sender(deps).send(message)).toEqual({
      ok: false,
      reason: "server",
      detail: "Resend's answer had no message id",
    });
  });

  it("sends nothing without a key, and never shows the key", async () => {
    const { deps, calls } = network([]);
    const unset = new ResendEmailSender({ apiKey: undefined, from: FROM, deps });
    expect(unset.live).toBe(true);
    expect(await unset.send(message)).toEqual({
      ok: false,
      reason: "not_configured",
      detail: "RESEND_API_KEY is not set",
    });
    expect(calls).toHaveLength(0);
    expect(JSON.stringify(sender(deps))).not.toContain(KEY);
  });

  it.each([
    "sb-47abc@business.example.com",
    "buyer@personal.example.com",
    "someone@EXAMPLE.org",
    "x@example.net",
    "rosa@example.test",
    "a@shop.invalid",
    "a@host.localhost",
    "a@site.example",
  ])("never sends to the reserved test address %s", async (to) => {
    const { deps, calls } = network([]);
    expect(await sender(deps).send({ ...message, to })).toEqual({
      ok: false,
      reason: "rejected",
      detail: "reserved test address",
    });
    expect(calls).toHaveLength(0);
  });

  it.each(["you+buyer@gmail.com", "a@notexample.com", "a@example.com.au", "a@testing.dev"])(
    "sends to the real address %s",
    (to) => {
      expect(isReservedTestAddress(to)).toBe(false);
    },
  );

  it("refuses a message that is not valid before sending anything", async () => {
    const { deps, calls } = network([]);
    await expect(sender(deps).send({ ...message, to: "not an address" })).rejects.toThrow();
    expect(calls).toHaveLength(0);
  });
});

describe("StandInEmailSender", () => {
  it("sends nothing and logs only the kind of email, never the address or the link", async () => {
    const lines: string[] = [];
    const standIn = new StandInEmailSender({
      info: (details, text) => lines.push(JSON.stringify({ details, text })),
    });
    expect(standIn.live).toBe(false);
    expect(await standIn.send(message)).toEqual({
      ok: false,
      reason: "not_configured",
      detail: "no email service",
    });
    expect(lines).toEqual([
      JSON.stringify({
        details: { kind: "receipt" },
        text: "Email not sent: no email service yet",
      }),
    ]);
  });
});
