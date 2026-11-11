import type { DemoRefs } from "@pactpal/db";

/** What one step did: finished (with what it made), waiting for a person, or failed. */
export type StepResult =
  | { status: "done"; refs?: DemoRefs }
  | { status: "waiting"; instruction: string }
  | { status: "failed"; reason: string };

/**
 * One step of a demo story (9b-2). `run` acts through PactPal's own routes; `refs` holds what
 * earlier steps of the story made (deal ids and the like). `needsAi` steps are spaced out.
 */
export interface DemoStep<Context> {
  id: string;
  /** What the step does, in a few words, for the run's summary and dry runs. */
  what: string;
  needsAi?: boolean;
  run(context: Context, refs: DemoRefs): Promise<StepResult>;
}

/** Where a run keeps its progress (the `demo_seed_steps` table in the real seed). */
export interface DemoProgress {
  done(story: string): Promise<ReadonlyMap<string, DemoRefs>>;
  record(story: string, step: string, refs: DemoRefs): Promise<void>;
}

export interface RunOptions {
  dryRun: boolean;
  /** Least time between two AI steps, so free and paid quotas both last. */
  aiGapMs: number;
  /** The run stops before starting a step after this moment; the next run carries on. */
  deadline: number;
  now: () => number;
  sleep: (ms: number) => Promise<void>;
}

/** What a run did, for its log line and the person reading it. Ids only, never content. */
export interface RunSummary {
  story: string;
  dryRun: boolean;
  /** Steps finished in this run (or, in a dry run, the steps still to do). */
  steps: string[];
  /** Steps finished before this run. */
  alreadyDone: number;
  outcome:
    | { kind: "finished" }
    | { kind: "waiting"; step: string; instruction: string }
    | { kind: "failed"; step: string; reason: string }
    | { kind: "out-of-time"; step: string };
}

/**
 * Runs a story's steps in order (9b-2): skips finished ones, stops at the first that waits for a
 * person or fails, and records each finished step at once, so the next run carries on from
 * there and never repeats one. A dry run only lists the steps still to do.
 */
export async function runStory<Context>(
  story: string,
  steps: readonly DemoStep<Context>[],
  context: Context,
  progress: DemoProgress,
  options: RunOptions,
): Promise<RunSummary> {
  const done = await progress.done(story);
  const todo = steps.filter((step) => !done.has(step.id));
  const base = { story, dryRun: options.dryRun, alreadyDone: steps.length - todo.length };
  if (options.dryRun) {
    return { ...base, steps: todo.map((step) => step.id), outcome: { kind: "finished" } };
  }
  const refs: Record<string, string> = Object.assign({}, ...done.values()) as Record<
    string,
    string
  >;
  const finished: string[] = [];
  let lastAi: number | undefined;
  for (const step of todo) {
    if (options.now() >= options.deadline) {
      return { ...base, steps: finished, outcome: { kind: "out-of-time", step: step.id } };
    }
    if (step.needsAi === true && lastAi !== undefined) {
      const wait = lastAi + options.aiGapMs - options.now();
      if (wait > 0) await options.sleep(wait);
    }
    let result: StepResult;
    try {
      result = await step.run(context, refs);
    } catch (error) {
      result = { status: "failed", reason: error instanceof Error ? error.message : "unknown" };
    }
    if (step.needsAi === true) lastAi = options.now();
    if (result.status === "waiting") {
      return {
        ...base,
        steps: finished,
        outcome: { kind: "waiting", step: step.id, instruction: result.instruction },
      };
    }
    if (result.status === "failed") {
      return {
        ...base,
        steps: finished,
        outcome: { kind: "failed", step: step.id, reason: result.reason },
      };
    }
    const made = result.refs ?? {};
    await progress.record(story, step.id, made);
    Object.assign(refs, made);
    finished.push(step.id);
  }
  return { ...base, steps: finished, outcome: { kind: "finished" } };
}

/** The ref a step needs from an earlier one; a missing ref is a bug in the story, so it throws. */
export function needRef(refs: DemoRefs, name: string): string {
  const value = refs[name];
  if (value === undefined) throw new Error(`missing ${name} from an earlier step`);
  return value;
}
