import { createUser, listDealsForUser, readLedger } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { dealTestApp, standInMember, testDrafting } from "../deals/test-app.js";
import { fakePayPal } from "../payments/paypal-test-support.js";
import type { SeedContext } from "./actions.js";
import { BOOK, MAYA, bookSteps } from "./book.js";
import { runStory } from "./engine.js";
import { contentReader, databaseProgress, demoContentDir } from "./seed.js";

const db = useMigratedTestDatabase();
const runOptions = {
  dryRun: false,
  aiGapMs: 0,
  deadline: 1e15,
  now: () => 0,
  sleep: () => Promise.resolve(),
};

/** The app as the seed sees it: stand-in PayPal and models, the repository's real content. */
function seedApp(paypal: ReturnType<typeof fakePayPal>) {
  const drafting = testDrafting(["a", "b", "c"].map((name) => standInMember(name)));
  const env = dealTestApp(db, drafting, { invoices: paypal.invoices });
  const context: SeedContext = {
    app: env.app,
    db,
    clock: () => TEST_NOW,
    content: contentReader(demoContentDir()),
    sleep: () => Promise.resolve(),
  };
  return { env, context };
}

describe("Maya's book of deals (9b-2)", () => {
  it("creates all 18 deals through the routes, stops once for every payment, then finishes", async () => {
    await createUser(db, { id: testId(1), email: MAYA, displayName: "Maya Lin" }, TEST_NOW);
    const paypal = fakePayPal();
    const progress = databaseProgress(db, () => TEST_NOW);

    const first = seedApp(paypal);
    // The stand-in models' draft does not fit this chat, so PactPal's checks refuse it and the run
    // stops and says so; in the real run the models draft from the real thread.
    const refused = await runStory("book", bookSteps(), first.context, progress, runOptions);
    expect(refused.outcome).toEqual({
      kind: "failed",
      step: "deal-14-ai-draft",
      reason: "the AI draft failed: no model produced a valid draft",
    });
    await progress.record("book", "deal-14-ai-draft", {});
    const one = await runStory("book", bookSteps(), first.context, progress, runOptions);
    expect(one.outcome).toMatchObject({ kind: "waiting", step: "payments" });
    const paying = BOOK.flatMap((deal) => deal.pay ?? []).length;
    expect(one.outcome.kind === "waiting" && one.outcome.instruction).toMatch(
      new RegExp(`^${String(paying)} invoice\\(s\\) to pay`),
    );
    expect(paypal.drafts).toHaveLength(paying);
    await first.env.app.close();

    // The owner pays them all in the sandbox; the next run carries on and finishes.
    for (let n = 1; n <= paying; n += 1) paypal.paid.add(`INV2-TEST-${String(n)}`);
    const second = seedApp(paypal);
    const two = await runStory("book", bookSteps(), second.context, progress, runOptions);
    expect(two.outcome).toEqual({ kind: "finished" });
    await second.env.app.close();

    const deals = await listDealsForUser(db, testId(1));
    expect(deals).toHaveLength(18);
    const byTitle = new Map(deals.map((deal) => [deal.title, deal]));
    // A declined agreement goes back to the seller as a draft, with the decline in the log.
    const declined = byTitle.get("Achievement names and descriptions");
    expect(declined?.status).toBe("draft");
    expect((await readLedger(db, declined?.id ?? "")).map((e) => e.type).join(" ")).toMatch(
      /DECLINED/,
    );
    expect(byTitle.get("Patch notes voice and template")?.status).toBe("awaiting_acceptance");
    const pressKit = byTitle.get('Press kit "about the game"');
    const types = (await readLedger(db, pressKit?.id ?? "")).map((entry) => entry.type);
    expect(types.filter((type) => type === "DELIVERY_SENT")).toHaveLength(2);
    expect(types).toContain("CHANGE_REQUESTED");
    expect(types).toContain("MILESTONE_APPROVED");

    // A third run does nothing more.
    const third = seedApp(paypal);
    const three = await runStory("book", bookSteps(), third.context, progress, runOptions);
    expect(three).toMatchObject({ steps: [], outcome: { kind: "finished" } });
    await third.env.app.close();
  }, 120_000);
});
