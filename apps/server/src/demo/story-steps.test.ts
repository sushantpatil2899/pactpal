import { TEST_NOW, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { paypalState, signedDispute } from "../disputes/test-support.js";
import type { SettleResult } from "../sellers/sandbox-settle.js";
import type { SeedContext } from "./actions.js";
import { disputeSteps } from "./story-steps.js";

const db = useMigratedTestDatabase();

describe("a story's dispute decision (9b-2c)", () => {
  it("asks PayPal's sandbox for the story's winner once allowed, and finishes on PayPal's outcome", async () => {
    const deal = await signedDispute(db, []);
    const asked: string[] = [];
    let answer: SettleResult = { kind: "not-allowed" };
    const context: SeedContext = {
      app: deal.app,
      db,
      clock: () => TEST_NOW,
      content: () => Buffer.from(""),
      sleep: () => Promise.resolve(),
      settle: (disputeId, winner) => {
        asked.push(`${disputeId} ${winner}`);
        return Promise.resolve(answer);
      },
    };
    const decided = disputeSteps({
      seller: deal.seller.email,
      dealKey: "deal",
      open: "open it",
      packet: false,
      decide: "Send the evidence first.",
      winner: "seller",
    }).find((step) => step.id === "dispute-decided");
    const refs = { deal: deal.dealId, disputeId: "PP-R-TEST-1" };
    const run = () => decided?.run(context, refs);

    await paypalState(db, deal.dealId, { allowedActions: ["escalate"] });
    // Without linked seller apps the seed can only say what the seller does next.
    expect(await decided?.run({ ...context, settle: undefined }, refs)).toEqual({
      status: "waiting",
      instruction: "Send the evidence first.",
    });
    expect(await run()).toEqual({ status: "waiting", instruction: "Send the evidence first." });
    answer = { kind: "asked" };
    expect(await run()).toMatchObject({
      status: "waiting",
      instruction: /deciding the case for the seller/,
    });
    answer = { kind: "failed", reason: "HTTP 500" };
    expect(await run()).toEqual({
      status: "failed",
      reason: "PayPal's sandbox could not decide: HTTP 500",
    });
    expect(asked).toEqual(Array<string>(3).fill("PP-R-TEST-1 seller"));

    await paypalState(db, deal.dealId, { allowedActions: [], outcome: "RESOLVED_SELLER_FAVOUR" });
    expect(await run()).toEqual({ status: "done" });
    expect(asked).toHaveLength(3);

    await deal.app.close();
  });
});
