import { describe, expect, it } from "vitest";
import { listDemoSteps, recordDemoStep } from "./index.js";
import { TEST_NOW, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();

describe("the demo seed's finished steps (9b-2)", () => {
  it("records each step once, with what it made, per story", async () => {
    await recordDemoStep(db, { story: "1", step: "create-deal", refs: { dealId: "d1" } }, TEST_NOW);
    await recordDemoStep(
      db,
      { story: "1", step: "create-deal", refs: { dealId: "other" } },
      TEST_NOW,
    );
    await recordDemoStep(db, { story: "book", step: "deal-1", refs: {} }, TEST_NOW);
    const one = await listDemoSteps(db, "1");
    expect([...one.entries()]).toEqual([["create-deal", { dealId: "d1" }]]);
    expect((await listDemoSteps(db, "book")).has("deal-1")).toBe(true);
    expect((await listDemoSteps(db, "2")).size).toBe(0);
    await expect(
      recordDemoStep(db, { story: "Bad Story", step: "x", refs: {} }, TEST_NOW),
    ).rejects.toThrow();
  });
});
