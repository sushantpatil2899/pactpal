import { MAX_INTAKE_DEALS_PER_DAY, getDeal, readLedger } from "@pactpal/db";
import { createTestDeal, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();
const CHAT =
  "Rosa: Hi Daniel, I need a website for my bakery\nDaniel: Three pages for $900 in total";

interface KeyView {
  key: {
    ending: string;
    defaultCategory: string;
    defaultCurrency: string;
    lastUsedAt: string | null;
  } | null;
  secret?: string;
}

/** A seller (signed in with PayPal) with a fresh intake key, and a way to post text with any key. */
async function withKey() {
  const deal = await createTestDeal(db);
  const env = dealTestApp(db);
  const seller = await signedInAs(db, deal.seller.id);
  const made = await env.call("POST", "/api/intake/key", seller, {
    defaultCategory: "web-and-software",
    defaultCurrency: "EUR",
  });
  const secret = made.json<KeyView>().secret ?? "";
  const post = (body: object, key = secret) =>
    env.call(
      "POST",
      "/api/intake/deals",
      undefined,
      body,
      key === "" ? {} : { authorization: `Bearer ${key}` },
    );
  return { ...env, ...deal, seller, made, secret, post };
}

describe("intake keys", () => {
  it("create a draft deal with the text saved as its chat, logged by the key's ending only", async () => {
    const env = await withKey();
    expect(env.made.statusCode).toBe(201);
    expect(env.secret).toMatch(/^ppk_/);
    const status = (await env.call("GET", "/api/intake/key", env.seller)).json<KeyView>();
    expect(status).toEqual({
      key: expect.objectContaining({
        ending: env.secret.slice(-4),
        defaultCategory: "web-and-software",
        defaultCurrency: "EUR",
      }) as unknown,
    });
    expect(JSON.stringify(status)).not.toContain(env.secret);

    const res = await env.post({ text: CHAT });
    expect(res.statusCode).toBe(201);
    const { dealId, url } = res.json<{ dealId: string; url: string }>();
    expect(url).toBe(`https://pactpal.test/deals/${dealId}`);
    expect(await getDeal(db, dealId)).toMatchObject({
      sellerId: (await getDeal(db, env.dealId))?.sellerId,
      title: "From another tool: Rosa: Hi Daniel, I need a website for my…",
      category: "web-and-software",
      currency: "EUR",
      status: "draft",
    });
    const entries = await readLedger(db, dealId);
    expect(entries.map((e) => e.type)).toEqual(["DEAL_CREATED", "SOURCE_ADDED"]);
    expect(entries[0]?.payload).toMatchObject({ via: "intake", keyEnding: env.secret.slice(-4) });
    expect(entries[1]?.payload).toMatchObject({
      filename: "intake-2026-10-02.txt",
      mediaType: "text/plain",
    });
    expect(JSON.stringify(entries)).not.toContain(env.secret);
    expect(env.logs.join("\n")).not.toMatch(new RegExp(`${env.secret}|bakery`));
  });

  it("take a title, category and currency from the post when given", async () => {
    const env = await withKey();
    const { dealId } = (
      await env.post({
        text: CHAT,
        title: "Bakery site",
        category: "art-and-design",
        currency: "USD",
      })
    ).json<{ dealId: string }>();
    expect(await getDeal(db, dealId)).toMatchObject({
      title: "Bakery site",
      category: "art-and-design",
      currency: "USD",
    });
  });

  it("refuse wrong, missing and turned-off keys alike, bad text, and posts past the daily limit", async () => {
    const env = await withKey();
    const refused = { error: "not a valid key" };
    expect((await env.post({ text: CHAT }, "ppk_wrong")).json()).toEqual(refused);
    expect((await env.post({ text: CHAT }, "")).statusCode).toBe(401);
    expect((await env.post({ text: "" })).statusCode).toBe(400);
    expect((await env.post({ text: CHAT, category: "weapons" })).statusCode).toBe(400);
    expect((await env.post({ text: "\n".repeat(10) })).statusCode).toBe(422);
    for (let i = 0; i < MAX_INTAKE_DEALS_PER_DAY; i++) await env.post({ text: CHAT });
    expect((await env.post({ text: CHAT })).statusCode).toBe(429);

    // A new key replaces the old; turning it off stops it.
    const again = (
      await env.call("POST", "/api/intake/key", env.seller, {
        defaultCategory: "art-and-design",
        defaultCurrency: "USD",
      })
    ).json<KeyView>();
    expect((await env.post({ text: CHAT })).json()).toEqual(refused);
    expect((await env.post({ text: CHAT }, again.secret)).statusCode).toBe(201);
    expect((await env.call("POST", "/api/intake/key/off", env.seller)).json()).toEqual({
      key: null,
    });
    expect((await env.post({ text: CHAT }, again.secret)).statusCode).toBe(401);
  });

  it("are managed only by a seller signed in with PayPal", async () => {
    const env = await withKey();
    const [, linkSession = ""] = await buyerVisitors(db, env.dealId, env.buyer.id);
    expect((await env.call("GET", "/api/intake/key", linkSession)).statusCode).toBe(403);
    expect(
      (
        await env.call("POST", "/api/intake/key", linkSession, {
          defaultCategory: "art-and-design",
          defaultCurrency: "USD",
        })
      ).statusCode,
    ).toBe(403);
    expect((await env.call("GET", "/api/intake/key")).statusCode).toBe(401);
    expect(
      (
        await env.call("POST", "/api/intake/key", env.seller, {
          defaultCategory: "x",
          defaultCurrency: "USD",
        })
      ).statusCode,
    ).toBe(400);
  });
});
