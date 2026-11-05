import { createHmac } from "node:crypto";
import { listDealsForUser, readLedger, type Database } from "@pactpal/db";
import { TEST_NOW, createTestDeal, useMigratedTestDatabase } from "@pactpal/db/testing";
import type { ReadResult, ReceivedEmail, ReceivedEmails } from "@pactpal/email";
import { Secret } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { dealTestApp, signedInAs } from "../deals/test-app.js";
import { RESEND_INBOUND_PATH, forwardingCode } from "./resend-inbound.js";

const db = useMigratedTestDatabase();
const DOMAIN = "in.pact-pal.app";
const SECRET_BYTES = Buffer.from("a-test-signing-secret-of-32-bytes");
const CHAT =
  "Rosa: Hi Daniel, I need a website for my bakery\nDaniel: Three pages for $900 in total";

/** A stand-in inbox: emails by id, or a failure. */
function inbox(
  emails: Record<string, ReceivedEmail | "fail">,
): ReceivedEmails & { reads: string[] } {
  const reads: string[] = [];
  return {
    live: true,
    reads,
    get: (id: string): Promise<ReadResult> => {
      reads.push(id);
      const found = emails[id];
      return Promise.resolve(
        found === undefined || found === "fail"
          ? { ok: false, reason: "server", detail: "Resend answered 500" }
          : { ok: true, email: found },
      );
    },
  };
}

const received = (to: string, overrides: Partial<ReceivedEmail> = {}): ReceivedEmail => ({
  from: "maya@example.com",
  to: [to],
  subject: "Fwd: Bakery website",
  text: CHAT,
  html: undefined,
  checks: { spf: "fail", dkim: "pass" },
  ...overrides,
});

/** The seller with a forwarding address, the app with forwarding on, and a way to post signed events. */
async function forwarding(emails: (address: string) => Record<string, ReceivedEmail | "fail">) {
  const deal = await createTestDeal(db);
  let reader = inbox({});
  const env = dealTestApp(db, undefined, {
    inbound: {
      inbox: { live: true, get: (id) => reader.get(id) },
      webhookSecret: new Secret(`whsec_${SECRET_BYTES.toString("base64")}`),
      domain: DOMAIN,
    },
  });
  const seller = await signedInAs(db, deal.seller.id);
  const made = await env.call("POST", "/api/intake/address", seller, {
    defaultCategory: "web-and-software",
    defaultCurrency: "USD",
  });
  const address = made.json<{ secret: string }>().secret;
  reader = inbox(emails(address));
  const post = (
    emailId: string,
    eventId = `msg_${emailId}`,
    signature?: string,
    type = "email.received",
  ) => {
    const body = JSON.stringify({
      type,
      data: { email_id: emailId, to: [address], received_for: [] },
    });
    const timestamp = String(TEST_NOW.getTime() / 1000);
    const signed = createHmac("sha256", SECRET_BYTES)
      .update(`${eventId}.${timestamp}.${body}`)
      .digest("base64");
    return env.app.inject({
      method: "POST",
      url: RESEND_INBOUND_PATH,
      payload: body,
      headers: {
        "content-type": "application/json",
        "svix-id": eventId,
        "svix-timestamp": timestamp,
        "svix-signature": signature ?? `v1,${signed}`,
      },
    });
  };
  const sellerDeals = async () =>
    (await listDealsForUser(db as Database, deal.seller.id)).filter((d) => d.id !== deal.dealId);
  return { ...env, ...deal, made, address, post, sellerDeals, reads: () => reader.reads };
}

describe("email forwarding", () => {
  it("makes a draft deal from the seller's forwarded email and tells only the seller", async () => {
    const env = await forwarding((address) => ({ e1: received(address) }));
    expect(env.address).toMatch(/^deals\+[a-z2-9]{16}@in\.pact-pal\.app$/);
    const res = await env.post("e1");
    expect(res.statusCode).toBe(200);
    const [deal] = await env.sellerDeals();
    expect(deal).toMatchObject({
      title: "Fwd: Bakery website",
      category: "web-and-software",
      status: "draft",
    });
    const entries = await readLedger(db, deal?.id ?? "");
    const code = forwardingCode([env.address], DOMAIN) ?? "";
    expect(entries[0]?.payload).toMatchObject({ via: "email", keyEnding: code.slice(-4) });
    expect(entries[1]?.payload).toMatchObject({ filename: "email-2026-10-02.txt" });
    expect(env.sent).toHaveLength(1);
    expect(env.sent[0]).toMatchObject({
      kind: "intake-created",
      to: "maya@example.com",
      subject: 'Draft deal created: "Fwd: Bakery website"',
      idempotencyKey: `intake-email:${deal?.id ?? ""}`,
    });
    expect(env.sent[0]?.text).toContain(`https://pactpal.test/deals/${deal?.id ?? ""}`);
    // A repeat of the same event creates nothing new.
    expect((await env.post("e1")).statusCode).toBe(200);
    expect(await env.sellerDeals()).toHaveLength(1);
    expect(env.logs.join("\n")).not.toMatch(/bakery|maya@example|deals\+/i);
  });

  it("drops emails from anyone else, failing sender checks, or to no known address, telling nobody", async () => {
    const env = await forwarding((address) => ({
      stranger: received(address, { from: "someone@else.test" }),
      spoofed: received(address, { checks: { spf: "fail", dkim: "fail" } }),
      unknown: received("deals+zzzzzzzzzzzzzzzz@in.pact-pal.app"),
      empty: received(address, { text: "   ", html: undefined }),
    }));
    for (const id of ["stranger", "spoofed", "empty"])
      expect((await env.post(id)).statusCode).toBe(200);
    expect(await env.sellerDeals()).toEqual([]);
    expect(env.sent).toEqual([]);
    expect(env.logs.join("\n")).toMatch(/sender is not the seller/);
    expect(env.logs.join("\n")).toMatch(/sender checks failed/);
    expect(env.logs.join("\n")).toMatch(/text empty/);
  });

  it("reads an HTML-only email as text, and is tried again when the email cannot be read", async () => {
    const env = await forwarding((address) => ({
      html: received(address, {
        text: undefined,
        html: "<p>Rosa: Three pages &amp; hosting</p><p>Daniel: $900</p>",
      }),
      broken: "fail",
    }));
    expect((await env.post("broken")).statusCode).toBe(500);
    expect((await env.post("html")).statusCode).toBe(200);
    const [deal] = await env.sellerDeals();
    expect(deal?.title).toBe("Fwd: Bakery website");
  });

  it("refuses a bad signature, ignores other events and addresses, and is off without its settings", async () => {
    const env = await forwarding((address) => ({ e1: received(address) }));
    expect((await env.post("e1", "msg_1", "v1,AAAA")).statusCode).toBe(400);
    expect((await env.post("e1", "msg_2", undefined, "email.sent")).statusCode).toBe(200);
    expect(env.reads()).toEqual([]);
    const off = dealTestApp(db);
    expect(
      (
        await off.app.inject({
          method: "POST",
          url: RESEND_INBOUND_PATH,
          payload: "{}",
          headers: { "content-type": "application/json" },
        })
      ).statusCode,
    ).toBe(503);
  });

  it("finds the forwarding code among the addresses", () => {
    expect(forwardingCode(["Sophie <DEALS+ABCDEFGHJKMNPQRS@In.Pact-Pal.App>"], DOMAIN)).toBe(
      "abcdefghjkmnpqrs",
    );
    expect(
      forwardingCode(["deals+abc@in.pact-pal.app", "other@in.pact-pal.app"], DOMAIN),
    ).toBeUndefined();
    expect(
      forwardingCode(["deals+abcdefghjkmnpqrs@in.pact-pal.app.evil.test"], DOMAIN),
    ).toBeUndefined();
  });
});
