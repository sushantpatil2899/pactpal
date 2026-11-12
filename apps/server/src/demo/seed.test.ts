import { TEST_NOW, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { dealTestApp } from "../deals/test-app.js";
import { BOOK } from "./book.js";
import { contentReader, demoContentDir, runSeedTask, seedInputSchema } from "./seed.js";

const db = useMigratedTestDatabase();

describe("the seed-demo task (9b-2)", () => {
  it("lists a story's steps in a dry run, logs the summary and closes the app", async () => {
    const env = dealTestApp(db);
    const lines: object[] = [];
    let closed = false;
    env.app.addHook("onClose", () => {
      closed = true;
    });
    const summary = await runSeedTask(
      { story: "book", dryRun: true },
      {
        app: () => Promise.resolve({ app: env.app, database: db }),
        clock: () => TEST_NOW,
        sleep: () => Promise.resolve(),
        log: { info: (details) => lines.push(details) },
      },
    );
    expect(summary).toMatchObject({ story: "book", dryRun: true, alreadyDone: 0 });
    if (!("steps" in summary)) throw new Error("expected a story run");
    expect(summary.steps).toHaveLength(1 + BOOK.length + 15 + 1 + 2 + 7);
    expect(lines).toHaveLength(1);
    expect(closed).toBe(true);
  });

  it("refuses an unknown story and a run without a database", async () => {
    expect(seedInputSchema.safeParse({ story: "nine" }).success).toBe(false);
    const env = dealTestApp(db);
    await expect(
      runSeedTask(
        { story: "book" },
        {
          app: () => Promise.resolve({ app: env.app, database: undefined }),
          clock: () => TEST_NOW,
          sleep: () => Promise.resolve(),
          log: { info: () => undefined },
        },
      ),
    ).rejects.toThrow(/DATABASE_URL/);
  });

  it("asks PayPal's sandbox to decide one named dispute, logs ids only and closes the app", async () => {
    const env = dealTestApp(db);
    const lines: object[] = [];
    const asked: [string, string][] = [];
    let closed = false;
    env.app.addHook("onClose", () => {
      closed = true;
    });
    const result = await runSeedTask(
      { settle: { disputeId: "PP-R-CGD-10199674", winner: "seller" } },
      {
        app: () =>
          Promise.resolve({
            app: env.app,
            database: db,
            settle: (disputeId, winner) => {
              asked.push([disputeId, winner]);
              return Promise.resolve({ kind: "asked" as const });
            },
          }),
        clock: () => TEST_NOW,
        sleep: () => Promise.resolve(),
        log: { info: (details) => lines.push(details) },
      },
    );
    expect(result).toEqual({
      settle: "PP-R-CGD-10199674",
      winner: "seller",
      result: { kind: "asked" },
    });
    expect(asked).toEqual([["PP-R-CGD-10199674", "seller"]]);
    expect(lines).toEqual([{ disputeId: "PP-R-CGD-10199674", winner: "seller", result: "asked" }]);
    expect(closed).toBe(true);
  });

  it("refuses a decision without PayPal's sandbox settings, a database or a proper id", async () => {
    const settleInput = { settle: { disputeId: "PP-D-1", winner: "buyer" } };
    for (const bad of [
      { settle: { disputeId: "INV2-1", winner: "seller" } },
      { settle: { disputeId: "PP-D-1", winner: "nobody" } },
      { settle: { disputeId: `PP-${"1".repeat(70)}`, winner: "seller" } },
    ]) {
      expect(seedInputSchema.safeParse(bad).success).toBe(false);
    }
    const env = dealTestApp(db);
    const wiring = (database: typeof db | undefined) => ({
      app: () => Promise.resolve({ app: env.app, database }),
      clock: () => TEST_NOW,
      sleep: () => Promise.resolve(),
      log: { info: () => undefined },
    });
    await expect(runSeedTask(settleInput, wiring(db))).rejects.toThrow(/sandbox settings/);
    await expect(runSeedTask(settleInput, wiring(undefined))).rejects.toThrow(/DATABASE_URL/);
  });

  it("reads content inside the folder only, and names a missing image", () => {
    const read = contentReader(demoContentDir());
    expect(read("chats/story1-discord.txt").toString("utf8")).toContain("Lanternlight");
    expect(read("images/maya-final.png").length).toBeGreaterThan(0);
    expect(() => read("../../package.json")).toThrow(/leaves the content folder/);
    expect(() => read("images/not-added-yet.png")).toThrow(
      "add hackathon/demo/images/not-added-yet.png before running this story",
    );
  });

  it("has every content file the book names", () => {
    const read = contentReader(demoContentDir());
    for (const deal of BOOK)
      for (const item of deal.deliveries ?? []) expect(read(item.path).length).toBeGreaterThan(0);
  });
});
