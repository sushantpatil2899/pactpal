import { createHmac } from "node:crypto";
import { Secret } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import {
  RESEND_RECEIVED_URL,
  ResendReceivedEmails,
  bareAddress,
  verifyWebhookSignature,
} from "./index.js";
import { json, network } from "./testing.js";

const KEY = "re_inbound_secret_key";
const inbox = (deps: ReturnType<typeof network>["deps"]) =>
  new ResendReceivedEmails({ apiKey: new Secret(KEY), deps });

describe("ResendReceivedEmails", () => {
  it("reads a received email with the key, keeping bare addresses and the sender checks", async () => {
    const { deps, calls } = network([
      json(200, {
        object: "email",
        id: "e1",
        from: "Sophie Seller <Sophie@Example.org>",
        to: ["deals+abcd@in.pact-pal.app"],
        subject: "Fwd: Logo",
        text: "Hello",
        html: null,
        authentication: { spf: "pass", dkim: { result: "FAIL" } },
      }),
    ]);
    expect(await inbox(deps).get("e1")).toEqual({
      ok: true,
      email: {
        from: "sophie@example.org",
        to: ["deals+abcd@in.pact-pal.app"],
        subject: "Fwd: Logo",
        text: "Hello",
        html: undefined,
        checks: { spf: "pass", dkim: "fail" },
      },
    });
    expect(calls[0]?.url).toBe(`${RESEND_RECEIVED_URL}/e1`);
    expect(calls[0]?.init.headers).toEqual({ authorization: `Bearer ${KEY}` });
  });

  it("fails as values: no key, a bad id, an error status, a strange answer, no network", async () => {
    expect(await new ResendReceivedEmails({ apiKey: undefined }).get("e1")).toMatchObject({
      ok: false,
      reason: "not_configured",
    });
    expect(new ResendReceivedEmails({ apiKey: undefined }).live).toBe(false);
    const { deps } = network([
      json(404, {}),
      json(200, { nope: true }),
      new TypeError("down"),
      new TypeError("down"),
      new TypeError("down"),
      json(200, { from: "a@b.c", status: { status: "pass" } }),
    ]);
    const reader = inbox(deps);
    expect(reader.live).toBe(true);
    expect(await reader.get("bad id!")).toMatchObject({ ok: false, reason: "rejected" });
    expect(await reader.get("e1")).toMatchObject({
      ok: false,
      reason: "rejected",
      detail: "Resend answered 404",
    });
    expect(await reader.get("e2")).toMatchObject({ ok: false, reason: "server" });
    expect(await reader.get("e3")).toMatchObject({ ok: false, reason: "network" });
    expect(await reader.get("e4")).toMatchObject({
      ok: true,
      email: { subject: "", to: [], checks: { spf: undefined, dkim: undefined } },
    });
    const busy = network([
      json(429, {}),
      json(429, {}),
      json(429, {}),
      json(503, {}),
      json(503, {}),
      json(503, {}),
    ]);
    expect(await inbox(busy.deps).get("e5")).toMatchObject({ reason: "rate_limited" });
    expect(await inbox(busy.deps).get("e6")).toMatchObject({ reason: "server" });
  });

  it("finds the bare address in a display form", () => {
    expect(bareAddress("Sophie <s@x.org>")).toBe("s@x.org");
    expect(bareAddress(" S@X.org ")).toBe("s@x.org");
  });
});

describe("verifyWebhookSignature", () => {
  const secretBytes = Buffer.from("a-test-signing-secret-of-32-bytes");
  const secret = `whsec_${secretBytes.toString("base64")}`;
  const now = new Date("2026-11-05T09:00:00Z");
  const timestamp = String(now.getTime() / 1000);
  const body = '{"type":"email.received","data":{"email_id":"e1"}}';
  const sign = (content: string) =>
    createHmac("sha256", secretBytes).update(content).digest("base64");
  const good = `v1,${sign(`msg_1.${timestamp}.${body}`)}`;
  const check = (overrides: Partial<Parameters<typeof verifyWebhookSignature>[0]> = {}) =>
    verifyWebhookSignature({
      secret,
      id: "msg_1",
      timestamp,
      signature: good,
      body,
      now,
      ...overrides,
    });

  it("accepts a fresh, correctly signed body, also among several signatures", () => {
    expect(check()).toBe(true);
    expect(check({ signature: `v1,AAAA ${good}` })).toBe(true);
  });

  it("refuses a wrong secret, an altered body or id, an old timestamp and odd headers", () => {
    expect(check({ secret: `whsec_${Buffer.from("another-secret").toString("base64")}` })).toBe(
      false,
    );
    expect(check({ body: `${body} ` })).toBe(false);
    expect(check({ id: "msg_2" })).toBe(false);
    expect(check({ now: new Date(now.getTime() + 6 * 60_000) })).toBe(false);
    expect(check({ timestamp: "soon" })).toBe(false);
    expect(check({ signature: "v2,abc" })).toBe(false);
    expect(check({ signature: "v1" })).toBe(false);
    expect(check({ secret: "whsec_" })).toBe(false);
  });
});
