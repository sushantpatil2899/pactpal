import { createDeal, getLatestScope, listArtifacts, readLedger } from "@pactpal/db";
import sharp from "sharp";
import { planExhibits } from "../disputes/packet.js";
import {
  TEST_NOW,
  createTestParties,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { TEST_LISTING } from "@pactpal/products/testing";
import type { ProductLookup } from "@pactpal/products";
import { agreementLines } from "@pactpal/qa";
import { beforeEach, describe, expect, it } from "vitest";
import { acceptanceDocument } from "../acceptance/document.js";
import { receiptBlocks } from "../acceptance/receipt.js";
import { dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

/** A real WebP picture, as Channel3's image server sends them. */
const WEBP = new Uint8Array(
  await sharp({ create: { width: 30, height: 20, channels: 3, background: "#246" } })
    .webp()
    .toBuffer(),
);
const PHOTO = "https://cdn.trychannel3.com/77fa?mid=FJaR";

/** A stand-in Channel3: the test listing for any page, and a WebP for each photo. */
const fakeLookup = (photo: Uint8Array | undefined = WEBP): ProductLookup => ({
  lookup: () => Promise.resolve({ ok: true, listing: TEST_LISTING }),
  photo: () => Promise.resolve(photo),
});

let parties: Awaited<ReturnType<typeof createTestParties>> | undefined;
beforeEach(() => {
  parties = undefined;
});

/** A draft deal of `category` (the `n`th in a test), the app with `products`, the seller's session. */
async function goodsDeal(
  products: ProductLookup | "off" = fakeLookup(),
  category: "handmade-goods" | "art-and-design" = "handmade-goods",
  n = 0,
) {
  parties ??= await createTestParties(db);
  const { seller, buyer } = parties;
  const { deal } = await createDeal(
    db,
    testDeal(seller.id, { id: testId(100 + n), category, buyerId: buyer.id }),
    TEST_NOW,
  );
  const env = dealTestApp(db, undefined, products === "off" ? {} : { products });
  const token = await signedInAs(db, seller.id);
  const base = `/api/deals/${deal.id}/listing`;
  return { ...env, deal, seller, buyer, token, base };
}

const SCOPE = {
  summary: "Running shoes",
  deliverables: ["One pair, size 10"],
  exclusions: [],
  milestones: [{ title: "Full price", amount: "50.00" }],
};

describe("what's being sold, from a listing link (8e)", () => {
  it("looks a listing up, saves its photos as files and signs it with the agreement", async () => {
    const env = await goodsDeal();
    const looked = await env.call("POST", `${env.base}/lookup`, env.token, {
      url: TEST_LISTING.url,
    });
    expect(looked.statusCode).toBe(200);
    const preview = looked.json<{ listing: typeof TEST_LISTING & { snapshotSha256: string } }>()
      .listing;
    expect(preview).toMatchObject({ title: "Men's Tree Runner", domain: "allbirds.com" });

    const saved = await env.call("POST", `${env.base}/photos`, env.token, {
      imageUrls: [PHOTO, PHOTO],
    });
    expect(saved.statusCode).toBe(201);
    const photos = saved.json<{
      photos: { artifactId: string; sha256: string; filename: string }[];
    }>().photos;
    expect(photos.map((p) => p.filename)).toEqual(["listing-photo-1.jpg", "listing-photo-2.jpg"]);
    // Saved as JPEG, so a dispute packet sends them to PayPal as they are (8h).
    const files = (await listArtifacts(db, env.deal.id, "source")).filter((f) =>
      f.filename.startsWith("listing-photo"),
    );
    expect(files.map((f) => f.mediaType)).toEqual(["image/jpeg", "image/jpeg"]);
    expect(
      planExhibits(
        files.map((f) => ({
          id: f.id,
          kind: f.kind,
          filename: f.filename,
          mediaType: f.mediaType,
          sizeBytes: f.sizeBytes,
          sha256: f.sha256,
          addedBy: "seller" as const,
          addedAt: f.createdAt,
        })),
        new Set(),
      ).map((plan) => plan.send),
    ).toEqual(["as-is", "as-is"]);
    expect(
      (await readLedger(db, env.deal.id)).filter((e) => e.type === "SOURCE_ADDED"),
    ).toHaveLength(2);

    const listing = { ...preview, photos };
    const stored = await env.call("POST", `/api/deals/${env.deal.id}/scope`, env.token, {
      ...SCOPE,
      listing,
    });
    expect(stored.statusCode).toBe(201);
    const scope = await getLatestScope(db, env.deal.id);
    expect(scope?.content.listing?.title).toBe("Men's Tree Runner");

    // The page the buyer signs carries it; so do the lines the AI reads and the receipt.
    if (!scope) throw new Error("no scope");
    const document = acceptanceDocument({ deal: env.deal, sellerName: "Maya", scope });
    expect(document.terms.listing?.photos).toHaveLength(2);
    const lines = agreementLines(document).map((l) => l.text);
    expect(lines).toContain("Listed care instructions: Machine washable, Hand wash, Line dry");
    expect(lines.some((l) => l.startsWith("Listed product: Men's Tree Runner (ALL BIRDS)"))).toBe(
      true,
    );
    const receipt = JSON.stringify(
      receiptBlocks(document, {
        typedName: "Chris",
        at: TEST_NOW,
        access: "paypal",
        documentSha256: "d".repeat(64),
        entry:
          (await readLedger(db, env.deal.id)).at(-1) ??
          (() => {
            throw new Error("no entry");
          })(),
      }),
    );
    expect(receipt).toContain("What is being sold, as listed on allbirds.com, 10 Nov 2026");
    expect(receipt).toContain("listing-photo-1.jpg");
    await env.app.close();
  });

  it("refuses listings whose facts or photos were changed", async () => {
    const env = await goodsDeal();
    const preview = (
      await env.call("POST", `${env.base}/lookup`, env.token, { url: TEST_LISTING.url })
    ).json<{ listing: Record<string, unknown> }>().listing;
    const save = (listing: object) =>
      env.call("POST", `/api/deals/${env.deal.id}/scope`, env.token, { ...SCOPE, listing });
    expect((await save({ ...preview, title: "Leather boots", photos: [] })).json()).toEqual({
      error: "invalid",
      fields: ["listing.snapshotSha256"],
    });
    const notOurs = [{ artifactId: testId(999), sha256: "a".repeat(64), filename: "x.webp" }];
    expect((await save({ ...preview, photos: notOurs })).json()).toEqual({
      error: "invalid",
      fields: ["listing.photos"],
    });
    await env.app.close();
  });

  it("is only for goods and digital products, set up, with real pictures from Channel3", async () => {
    const service = await goodsDeal(fakeLookup(), "art-and-design");
    expect(
      (
        await service.call("POST", `${service.base}/lookup`, service.token, {
          url: TEST_LISTING.url,
        })
      ).statusCode,
    ).toBe(409);
    await service.app.close();

    const off = await goodsDeal("off", "handmade-goods", 1);
    expect(
      (await off.call("POST", `${off.base}/lookup`, off.token, { url: TEST_LISTING.url })).json(),
    ).toEqual({ error: "product lookup is not set up yet" });
    expect(
      (await off.call("POST", `${off.base}/photos`, off.token, { imageUrls: [PHOTO] })).statusCode,
    ).toBe(503);
    await off.app.close();

    const env = await goodsDeal(
      fakeLookup(new TextEncoder().encode("<html>not a picture")),
      "handmade-goods",
      2,
    );
    expect(
      (await env.call("POST", `${env.base}/lookup`, env.token, { url: "ftp://x.example/p" }))
        .statusCode,
    ).toBe(400);
    expect(
      (
        await env.call("POST", `${env.base}/photos`, env.token, {
          imageUrls: ["https://evil.example/p.webp"],
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (await env.call("POST", `${env.base}/photos`, env.token, { imageUrls: [PHOTO] })).json(),
    ).toEqual({ error: "a listing photo could not be saved; try again" });
    const buyerToken = await signedInAs(db, env.buyer.id);
    expect(
      (await env.call("POST", `${env.base}/lookup`, buyerToken, { url: TEST_LISTING.url }))
        .statusCode,
    ).toBe(403);
    await env.app.close();
  });

  it("says why Channel3 could not read a page", async () => {
    const refusing = (reason: "not-found" | "unsupported" | "unavailable"): ProductLookup => ({
      lookup: () => Promise.resolve({ ok: false, reason }),
      photo: () => Promise.resolve(undefined),
    });
    for (const [n, [reason, status]] of (
      [
        ["not-found", 404],
        ["unsupported", 422],
        ["unavailable", 502],
      ] as const
    ).entries()) {
      const env = await goodsDeal(refusing(reason), "handmade-goods", n);
      expect(
        (await env.call("POST", `${env.base}/lookup`, env.token, { url: TEST_LISTING.url }))
          .statusCode,
      ).toBe(status);
      await env.app.close();
    }
  });
});
