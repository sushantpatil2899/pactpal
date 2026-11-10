import { Secret, type HttpDeps } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { Channel3Lookup, MAX_PHOTO_BYTES } from "./channel3.js";
import { CHANNEL3_LOOKUP_ANSWER } from "./testing.js";

const URL_ = "https://www.allbirds.com/products/mens-tree-runners";
const NOW = new Date("2026-11-10T04:00:00.000Z");

/** A Channel3 that answers with `answers` in turn, keeping what it was sent. */
function fakeChannel3(answers: (Response | Error)[]) {
  const sent: { url: string; init: RequestInit | undefined }[] = [];
  const deps: HttpDeps = {
    fetch: (url, init) => {
      sent.push({ url: url instanceof Request ? url.url : url.toString(), init });
      const next = answers.shift() ?? new Error("no more answers");
      return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
    },
    now: () => NOW.getTime(),
    sleep: () => Promise.resolve(),
    random: () => 0,
  };
  return { lookup: new Channel3Lookup(new Secret("c3-test-key"), deps, () => NOW), sent };
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("Channel3 product lookup", () => {
  it("reads a listing page with the key in its header, as capped facts", async () => {
    const { lookup, sent } = fakeChannel3([json(200, CHANNEL3_LOOKUP_ANSWER)]);
    const found = await lookup.lookup(URL_);
    expect(sent[0]?.url).toBe("https://api.trychannel3.com/v1/lookup");
    expect(sent[0]?.init?.headers).toMatchObject({ "x-api-key": "c3-test-key" });
    expect(JSON.parse(sent[0]?.init?.body as string)).toEqual({ url: URL_ });
    if (!found.ok) throw new Error("expected a listing");
    expect(found.listing).toMatchObject({
      source: "channel3",
      productId: "biyIA8e",
      domain: "allbirds.com",
      retrievedAt: NOW.toISOString(),
      title: "Men's Tree Runner",
      brand: "ALL BIRDS",
      price: { amount: "50.00", currency: "USD" },
      weight: "7.3 oz",
    });
    expect(found.listing.imageUrls).toHaveLength(3);
    expect(found.listing.imageUrls[0]).toMatch(/^https:\/\/cdn\.trychannel3\.com\//);
    expect(found.listing.attributes.find((a) => a.name === "Care instructions")?.values).toContain(
      "Machine washable",
    );
  });

  it("says why a listing could not be read, retrying when Channel3 is down", async () => {
    expect(await fakeChannel3([json(404, { detail: "x" })]).lookup.lookup(URL_)).toEqual({
      ok: false,
      reason: "not-found",
    });
    expect(await fakeChannel3([json(422, { detail: [] })]).lookup.lookup(URL_)).toEqual({
      ok: false,
      reason: "unsupported",
    });
    expect(await fakeChannel3([json(401, { detail: "bad key" })]).lookup.lookup(URL_)).toEqual({
      ok: false,
      reason: "unavailable",
    });
    expect(await fakeChannel3([json(200, { product: { id: 1 } })]).lookup.lookup(URL_)).toEqual({
      ok: false,
      reason: "unavailable",
    });
    const down = fakeChannel3([new Error("reset"), new Error("reset"), new Error("reset")]);
    expect(await down.lookup.lookup(URL_)).toEqual({ ok: false, reason: "unavailable" });
    expect(down.sent).toHaveLength(3);
    const recovers = fakeChannel3([json(503, {}), json(200, CHANNEL3_LOOKUP_ANSWER)]);
    expect((await recovers.lookup.lookup(URL_)).ok).toBe(true);
  });

  it("fetches photos only from Channel3's image server, within the size limit", async () => {
    const photo = "https://cdn.trychannel3.com/77fa?mid=FJaR";
    const bytes = (n: number) => new Response(new Uint8Array(n), { status: 200 });
    const ok = fakeChannel3([bytes(10)]);
    expect((await ok.lookup.photo(photo))?.byteLength).toBe(10);
    const elsewhere = fakeChannel3([bytes(10)]);
    expect(await elsewhere.lookup.photo("https://evil.example/x.png")).toBeUndefined();
    expect(await elsewhere.lookup.photo("http://cdn.trychannel3.com/x")).toBeUndefined();
    expect(await elsewhere.lookup.photo("not a url")).toBeUndefined();
    expect(elsewhere.sent).toHaveLength(0);
    expect(await fakeChannel3([bytes(MAX_PHOTO_BYTES + 1)]).lookup.photo(photo)).toBeUndefined();
    const declared = new Response(new Uint8Array(1), {
      status: 200,
      headers: { "content-length": String(MAX_PHOTO_BYTES + 1) },
    });
    expect(await fakeChannel3([declared]).lookup.photo(photo)).toBeUndefined();
    expect(await fakeChannel3([json(404, {})]).lookup.photo(photo)).toBeUndefined();
    const down = fakeChannel3([new Error("x"), new Error("x"), new Error("x")]);
    expect(await down.lookup.photo(photo)).toBeUndefined();
  });
});
