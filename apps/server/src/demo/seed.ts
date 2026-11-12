import { readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { listDemoSteps, recordDemoStep, type Database } from "@pactpal/db";
import { z } from "zod";
import { repoFolder } from "../email/templates.js";
import type { SeedContext } from "./actions.js";
import { bookSteps } from "./book.js";
import { runStory, type DemoProgress, type DemoStep } from "./engine.js";
import { story1Steps } from "./stories/story1.js";
import { story2Steps } from "./stories/story2.js";
import { story3Steps } from "./stories/story3.js";
import { story4Steps } from "./stories/story4.js";
import { story5Steps } from "./stories/story5.js";
import { story6Steps } from "./stories/story6.js";

/** The stories the seed can run (hackathon/demo-plan.md): the six stories and Maya's book. */
export const STORIES: Readonly<Record<string, () => DemoStep<SeedContext>[]>> = {
  "1": story1Steps,
  "2": story2Steps,
  "3": story3Steps,
  "4": story4Steps,
  "5": story5Steps,
  "6": story6Steps,
  book: bookSteps,
};

/**
 * What a `seed-demo` run is asked to do: one story (or only list its steps), or have PayPal's
 * sandbox decide one named dispute, for a deal filmed live rather than seeded (9f).
 */
export const seedInputSchema = z.union([
  z.object({
    story: z.enum(Object.keys(STORIES) as [string, ...string[]]),
    dryRun: z.boolean().default(false),
  }),
  z.object({
    settle: z.object({
      disputeId: z
        .string()
        .max(64)
        .regex(/^PP-[A-Z0-9-]+$/),
      winner: z.enum(["seller", "buyer"]),
    }),
  }),
]);

/** The demo's content folder (`hackathon/demo/`) in the repository checkout. */
export function demoContentDir(from = dirname(fileURLToPath(import.meta.url))): string {
  const dir = repoFolder(join("hackathon", "demo"), join("chats", "story1-discord.txt"), from);
  if (dir === undefined) throw new Error("No hackathon/demo content folder found");
  return dir;
}

/**
 * Reads content files by their path inside the folder; a path that leaves it, or an image the
 * owner has not added yet, is refused with a message saying which file is missing.
 */
export function contentReader(dir: string): (path: string) => Buffer {
  return (path) => {
    const full = normalize(join(dir, path));
    if (!full.startsWith(dir)) throw new Error(`content path ${path} leaves the content folder`);
    try {
      return readFileSync(full);
    } catch {
      throw new Error(`add hackathon/demo/${path} before running this story`);
    }
  };
}

/** The seed's progress in the `demo_seed_steps` table. */
export function databaseProgress(db: Database, clock: () => Date): DemoProgress {
  return {
    done: (story) => listDemoSteps(db, story),
    record: (story, step, refs) => recordDemoStep(db, { story, step, refs }, clock()),
  };
}

/** The `seed-demo` Workflow task's name (9b-2), started by hand from Render's dashboard. */
export const SEED_TASK_NAME = "seed-demo";
/** A run stops starting new steps after this long; running the story again carries on. */
const RUN_LIMIT_MS = 25 * 60_000;
/** Least time between two AI steps, so model quotas last. */
const AI_GAP_MS = 20_000;

/** What a seed run is given: the app built from the settings, the clock, sleeping and the log. */
interface SeedWiring {
  app: () => Promise<{
    app: SeedContext["app"];
    database: Database | undefined;
    settle?: SeedContext["settle"];
  }>;
  clock: () => Date;
  sleep: (ms: number) => Promise<void>;
  log: { info(details: object, msg: string): void };
}

/**
 * One run of the demo seed: builds the same app as the website from the settings, runs one
 * story's steps (or lists them in a dry run), or asks for one dispute's decision, and closes the
 * app. Logs ids only.
 */
export async function runSeedTask(input: unknown, wiring: SeedWiring) {
  const asked = seedInputSchema.parse(input ?? {});
  if ("settle" in asked) return settleOne(asked.settle, wiring);
  const { story, dryRun } = asked;
  const steps = STORIES[story];
  if (!steps) throw new Error(`no story ${story}`);
  const { app, database, settle } = await wiring.app();
  try {
    if (!database) throw new Error("The demo seed needs DATABASE_URL");
    const context: SeedContext = {
      app,
      db: database,
      clock: wiring.clock,
      content: contentReader(demoContentDir()),
      sleep: wiring.sleep,
      settle,
    };
    const started = wiring.clock().getTime();
    const summary = await runStory(
      story,
      steps(),
      context,
      databaseProgress(database, wiring.clock),
      {
        dryRun,
        aiGapMs: AI_GAP_MS,
        deadline: started + RUN_LIMIT_MS,
        now: () => wiring.clock().getTime(),
        sleep: wiring.sleep,
      },
    );
    wiring.log.info({ ...summary }, "Demo seed run finished");
    return summary;
  } finally {
    await app.close();
  }
}

/**
 * Asks PayPal's sandbox to decide one dispute for `winner`, through the seller's own linked app
 * (the call a story's last step makes), for a dispute filmed live. Logs ids only.
 */
async function settleOne(
  { disputeId, winner }: { disputeId: string; winner: "seller" | "buyer" },
  wiring: SeedWiring,
) {
  const { app, database, settle } = await wiring.app();
  try {
    if (!database) throw new Error("The demo seed needs DATABASE_URL");
    if (!settle) throw new Error("Deciding a dispute needs PayPal's sandbox settings");
    const result = await settle(disputeId, winner);
    wiring.log.info({ disputeId, winner, result: result.kind }, "Demo seed asked for a decision");
    return { settle: disputeId, winner, result };
  } finally {
    await app.close();
  }
}
