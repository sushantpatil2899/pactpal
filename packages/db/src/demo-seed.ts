import { z } from "zod";
import type { Queryable } from "./database.js";

/** What a finished demo step made, by name: deal, file and delivery ids (9b-2). */
export type DemoRefs = Readonly<Record<string, string>>;

const refsSchema = z.record(z.string(), z.string());
const rowSchema = z.object({ step: z.string(), refs: refsSchema });

/** The finished steps of one story, with what each made. */
export async function listDemoSteps(
  q: Queryable,
  story: string,
): Promise<ReadonlyMap<string, DemoRefs>> {
  const rows = await q.query("SELECT step, refs FROM demo_seed_steps WHERE story = $1", [story]);
  return new Map(rows.map((row) => rowSchema.parse(row)).map((row) => [row.step, row.refs]));
}

/** Records a step as finished; a second record of the same step keeps the first. */
export async function recordDemoStep(
  q: Queryable,
  step: { story: string; step: string; refs: DemoRefs },
  now: Date,
): Promise<void> {
  await q.query(
    `INSERT INTO demo_seed_steps (story, step, refs, done_at) VALUES ($1, $2, $3, $4)
     ON CONFLICT (story, step) DO NOTHING`,
    [step.story, step.step, JSON.stringify(step.refs), now],
  );
}
