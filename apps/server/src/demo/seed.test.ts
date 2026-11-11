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
    expect(summary.steps).toHaveLength(BOOK.length + 15 + 1 + 2 + 7);
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
