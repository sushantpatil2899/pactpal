import { readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { listDemoSteps, recordDemoStep, type Database } from "@pactpal/db";
import { z } from "zod";
import { repoFolder } from "../email/templates.js";
import type { SeedContext } from "./actions.js";
import { bookSteps } from "./book.js";
import { runStory, type DemoProgress, type DemoStep } from "./engine.js";

/** The stories the seed can run (hackathon/demo-plan.md); more join as they are written. */
export const STORIES: Readonly<Record<string, () => DemoStep<SeedContext>[]>> = {
  book: bookSteps,
};

/** What a `seed-demo` run is asked to do: one story, or only list its steps. */
export const seedInputSchema = z.object({
  story: z.enum(Object.keys(STORIES) as [string, ...string[]]),
  dryRun: z.boolean().default(false),
});

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

/**
 * One run of the demo seed: builds the same app as the website from the settings, runs one
 * story's steps (or lists them in a dry run) and closes the app. Logs ids only.
 */
export async function runSeedTask(
  input: unknown,
  wiring: {
    app: () => Promise<{ app: SeedContext["app"]; database: Database | undefined }>;
    clock: () => Date;
    sleep: (ms: number) => Promise<void>;
    log: { info(details: object, msg: string): void };
  },
) {
  const { story, dryRun } = seedInputSchema.parse(input ?? {});
  const steps = STORIES[story];
  if (!steps) throw new Error(`no story ${story}`);
  const { app, database } = await wiring.app();
  try {
    if (!database) throw new Error("The demo seed needs DATABASE_URL");
    const context: SeedContext = {
      app,
      db: database,
      clock: wiring.clock,
      content: contentReader(demoContentDir()),
      sleep: wiring.sleep,
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
