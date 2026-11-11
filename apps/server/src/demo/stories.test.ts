import { createUser, getLatestScope, listDealsForUser, readLedger } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { PHOTO_HOST, type ProductLookup } from "@pactpal/products";
import { describe, expect, it } from "vitest";
import { dealTestApp, standInMember, testDrafting } from "../deals/test-app.js";
import { fakePayPal } from "../payments/paypal-test-support.js";
import type { SeedContext } from "./actions.js";
import { runStory, type DemoStep, type RunSummary } from "./engine.js";
import { STORIES, contentReader, databaseProgress, demoContentDir } from "./seed.js";
import { LISTING_URL_FILE } from "./stories/story5.js";
import { DEMO_PEOPLE, signedUpWithPayPal } from "./test-support.js";

const db = useMigratedTestDatabase();
const read = contentReader(demoContentDir());
const LISTING_URL = "https://example.com/cameras/1970s-slr";

/** A stand-in Channel3: the camera's listing, with one photo from Channel3's photo host. */
const products: ProductLookup = {
  lookup: () =>
    Promise.resolve({
      ok: true,
      listing: {
        source: "channel3",
        productId: "camera-1",
        url: LISTING_URL,
        domain: "example.com",
        retrievedAt: TEST_NOW.toISOString(),
        title: "1970s 35mm SLR film camera with 50mm lens",
        description: "Fully working, light meter works. Minor haze on the rear lens element.",
        materials: [],
        keyFeatures: ["50mm f/1.8 lens", "Working light meter"],
        attributes: [],
        price: { amount: "185.00", currency: "USD" },
        imageUrls: [`https://${PHOTO_HOST}/camera-1.jpg`],
      },
    }),
  photo: () => Promise.resolve(new Uint8Array(read("images/camera-1-listing.jpg"))),
};

/** Each app numbers its ids from here, so the stories' apps never clash in one database. */
let nextIds = 100_000;

/**
 * Plays a story through on the test database with stand-in models and PayPal, as the owner would:
 * an AI step the stand-ins cannot do is noted and passed over, every invoice is paid when the run
 * asks, and each run is a new app. Stops when the story finishes or needs a dispute.
 */
async function playThrough(story: string) {
  const prefix = `INV2-STORY${story}`;
  const paypal = fakePayPal(prefix);
  const progress = databaseProgress(db, () => TEST_NOW);
  const steps: DemoStep<SeedContext>[] = (STORIES[story] ?? (() => []))();
  const passedOver: string[] = [];
  for (let run = 0; run < 30; run += 1) {
    const drafting = testDrafting(["a", "b", "c"].map((name) => standInMember(name)));
    const env = dealTestApp(db, drafting, {
      invoices: paypal.invoices,
      products,
      firstId: nextIds,
    });
    nextIds += 10_000;
    const context: SeedContext = {
      app: env.app,
      db,
      clock: () => TEST_NOW,
      content: (path) => (path === LISTING_URL_FILE ? Buffer.from(LISTING_URL) : read(path)),
      sleep: () => Promise.resolve(),
    };
    const summary: RunSummary = await runStory(story, steps, context, progress, {
      dryRun: false,
      aiGapMs: 0,
      deadline: 1e15,
      now: () => 0,
      sleep: () => Promise.resolve(),
    });
    await env.app.close();
    const { outcome } = summary;
    if (outcome.kind === "failed") {
      passedOver.push(`${outcome.step}: ${outcome.reason}`);
      await progress.record(story, outcome.step, {});
    } else if (outcome.kind === "waiting" && outcome.step.startsWith("paid-")) {
      for (let n = 1; n <= paypal.drafts.length; n += 1) paypal.paid.add(`${prefix}-${String(n)}`);
    } else return { outcome, passedOver, steps };
  }
  throw new Error(`story ${story} did not settle`);
}

/** Only AI steps (and nothing else) may be passed over with stand-in models. */
function expectOnlyAiPassedOver(played: Awaited<ReturnType<typeof playThrough>>) {
  for (const note of played.passedOver) {
    const id = note.split(":")[0];
    expect({ note, needsAi: played.steps.find((step) => step.id === id)?.needsAi }).toEqual({
      note,
      needsAi: true,
    });
  }
}

const dealOf = async (sellerN: number) => {
  const deals = await listDealsForUser(db, testId(sellerN));
  expect(deals).toHaveLength(1);
  const [deal] = deals;
  return { deal, types: (await readLedger(db, deal?.id ?? "")).map((entry) => entry.type) };
};

describe("the six demo stories (9b-2)", () => {
  it("play through PactPal's routes up to the point a person or PayPal's dispute is needed", async () => {
    await signedUpWithPayPal(db, DEMO_PEOPLE);

    const one = await playThrough("1");
    expect(one.outcome).toEqual({ kind: "finished" });
    expectOnlyAiPassedOver(one);
    const wren = await dealOf(1);
    expect(wren.deal?.status).toBe("completed");
    expect(wren.types.filter((t) => t === "PAYMENT_RECEIVED")).toHaveLength(2);
    expect(wren.types).toEqual(expect.arrayContaining(["CHANGE_REQUESTED", "MILESTONE_APPROVED"]));

    for (const [story, seller] of [
      ["2", 2],
      ["3", 3],
      ["4", 4],
      ["5", 5],
    ] as const) {
      const played = await playThrough(story);
      expect(played.outcome).toMatchObject({ kind: "waiting", step: "dispute-opened" });
      expect(played.outcome.kind === "waiting" && played.outcome.instruction).toMatch(
        /^In the PayPal sandbox, sign in as .+@pact-pal\.app and open a dispute/,
      );
      expectOnlyAiPassedOver(played);
      const { deal, types } = await dealOf(seller);
      expect(types).toContain("PAYMENT_RECEIVED");
      // Goods are shipped as a timeline step (with the tracking number), work is delivered.
      expect(types).toContain(story === "5" ? "STEP_DONE" : "DELIVERY_SENT");
      if (story === "5") {
        // The camera sold below its listed price, and the signed agreement says why.
        const scope = await getLatestScope(db, deal?.id ?? "");
        expect(scope?.content.deliverables).toContain(
          "Sold for $185, below the listed price of $299.99, as is because of the haze on the rear lens element",
        );
      }
      if (story === "2") {
        expect(types).toContain("CHANGE_ORDER_ACCEPTED");
        expect(types).toContain("CHANGE_ORDER_DECLINED");
      }
    }

    const six = await playThrough("6");
    expect(six.outcome).toEqual({ kind: "finished" });
    const letters = await listDealsForUser(db, testId(1));
    const nora = letters.find((deal) => deal.title === "Lighthouse keeper's letters");
    const noraLog = (await readLedger(db, nora?.id ?? "")).map((entry) => entry.type);
    expect(noraLog).toEqual(
      expect.arrayContaining(["ACCEPTED", "INVOICE_SENT", "PAYMENT_RECEIVED"]),
    );
  }, 240_000);

  it("stops before making anything until everyone in the story has signed in with PayPal", async () => {
    await signedUpWithPayPal(db, ["daniel.okafor@pact-pal.app"]);
    // Rosa exists only as an email a seller once added: she has not signed in with PayPal.
    await createUser(
      db,
      { id: testId(50), email: "rosa.alvarez@pact-pal.app", displayName: "Rosa" },
      TEST_NOW,
    );
    const played = await playThrough("2");
    expect(played.outcome).toEqual({
      kind: "waiting",
      step: "people",
      instruction:
        "Sign in to pact-pal.app with PayPal once as each of these sandbox accounts: rosa.alvarez@pact-pal.app. Then run this story again.",
    });
    expect(await listDealsForUser(db, testId(1))).toEqual([]);
  });

  it("names every content file the stories use, and lists each story's steps once", () => {
    for (const story of ["1", "2", "3", "4", "5", "6"]) {
      const ids = (STORIES[story] ?? (() => []))().map((step) => step.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
    for (const path of [
      "chats/story2-whatsapp.txt",
      "chats/story2-menu.txt",
      "chats/story3-inapp.txt",
      "chats/story4-marketplace-thread.png",
      "chats/story5-order-form.txt",
      "chats/story6-agent-text.txt",
      "deliverables/rosas-corner-bakery-site.html",
      "deliverables/jun-budget-planner.xlsx",
      "deliverables/priya-candle-5-lavender.jpg",
    ])
      expect(read(path).length).toBeGreaterThan(0);
  });
});
