import type { DemoRefs } from "@pactpal/db";
import { describe, expect, it } from "vitest";
import { needRef, runStory, type DemoProgress, type DemoStep, type StepResult } from "./engine.js";

/** Progress kept in memory, like the table. */
function memoryProgress(): DemoProgress & { rows: Map<string, DemoRefs> } {
  const rows = new Map<string, DemoRefs>();
  return {
    rows,
    done: (story) =>
      Promise.resolve(
        new Map(
          [...rows]
            .filter(([key]) => key.startsWith(`${story}/`))
            .map(([key, refs]) => [key.slice(story.length + 1), refs]),
        ),
      ),
    record: (story, step, refs) => {
      if (!rows.has(`${story}/${step}`)) rows.set(`${story}/${step}`, refs);
      return Promise.resolve();
    },
  };
}

/** A clock that only moves when the run sleeps or a step says so. */
function clock() {
  let t = 0;
  const slept: number[] = [];
  return {
    now: () => t,
    advance: (ms: number) => (t += ms),
    sleep: (ms: number) => {
      slept.push(ms);
      t += ms;
      return Promise.resolve();
    },
    slept,
  };
}

const step = (
  id: string,
  result: StepResult | ((refs: DemoRefs) => StepResult),
  needsAi = false,
): DemoStep<{ calls: string[] }> => ({
  id,
  what: `do ${id}`,
  needsAi,
  run: (context, refs) => {
    context.calls.push(id);
    return Promise.resolve(typeof result === "function" ? result(refs) : result);
  },
});

const options = (
  time: ReturnType<typeof clock>,
  extra: { dryRun?: boolean; deadline?: number } = {},
) => ({
  dryRun: extra.dryRun ?? false,
  aiGapMs: 20_000,
  deadline: extra.deadline ?? 1e12,
  now: time.now,
  sleep: time.sleep,
});

describe("running a demo story (9b-2)", () => {
  it("runs steps in order, passing what each made to the next, then finishes", async () => {
    const progress = memoryProgress();
    const context = { calls: [] as string[] };
    const steps = [
      step("create", { status: "done", refs: { dealId: "d1" } }),
      step("use", (refs) => ({ status: "done", refs: { used: needRef(refs, "dealId") } })),
    ];
    const summary = await runStory("1", steps, context, progress, options(clock()));
    expect(summary.outcome).toEqual({ kind: "finished" });
    expect(summary.steps).toEqual(["create", "use"]);
    expect(progress.rows.get("1/use")).toEqual({ used: "d1" });
  });

  it("stops where a person is needed and carries on from there next time, never repeating a step", async () => {
    const progress = memoryProgress();
    let paid = false;
    const steps = [
      step("create", { status: "done", refs: { dealId: "d1" } }),
      step("pay", () =>
        paid
          ? { status: "done" }
          : { status: "waiting", instruction: "Pay invoice INV2-1 as Rosa" },
      ),
      step("after", (refs) => ({ status: "done", refs: { seen: needRef(refs, "dealId") } })),
    ];
    const first = { calls: [] as string[] };
    const one = await runStory("2", steps, first, progress, options(clock()));
    expect(one.outcome).toEqual({
      kind: "waiting",
      step: "pay",
      instruction: "Pay invoice INV2-1 as Rosa",
    });
    paid = true;
    const second = { calls: [] as string[] };
    const two = await runStory("2", steps, second, progress, options(clock()));
    expect(second.calls).toEqual(["pay", "after"]);
    expect(two).toMatchObject({
      alreadyDone: 1,
      steps: ["pay", "after"],
      outcome: { kind: "finished" },
    });
    expect(progress.rows.get("2/after")).toEqual({ seen: "d1" });
  });

  it("reports a failed or throwing step without recording it", async () => {
    const progress = memoryProgress();
    const broken: DemoStep<{ calls: string[] }> = {
      id: "broken",
      what: "break",
      run: () => Promise.reject(new Error("draft not valid")),
    };
    const summary = await runStory("3", [broken], { calls: [] }, progress, options(clock()));
    expect(summary.outcome).toEqual({ kind: "failed", step: "broken", reason: "draft not valid" });
    expect(progress.rows.size).toBe(0);
    const failed = await runStory(
      "3",
      [step("model", { status: "failed", reason: "out of quota" })],
      { calls: [] },
      progress,
      options(clock()),
    );
    expect(failed.outcome).toMatchObject({ kind: "failed", reason: "out of quota" });
  });

  it("spaces AI steps apart and stops before the deadline", async () => {
    const time = clock();
    const steps = [
      step("draft-1", { status: "done" }, true),
      step("draft-2", { status: "done" }, true),
    ];
    await runStory("4", steps, { calls: [] }, memoryProgress(), options(time));
    expect(time.slept).toEqual([20_000]);
    const late = clock();
    late.advance(100);
    const summary = await runStory(
      "5",
      steps,
      { calls: [] },
      memoryProgress(),
      options(late, { deadline: 50 }),
    );
    expect(summary.outcome).toEqual({ kind: "out-of-time", step: "draft-1" });
  });

  it("only lists the steps still to do in a dry run, touching nothing", async () => {
    const progress = memoryProgress();
    await progress.record("6", "create", {});
    const context = { calls: [] as string[] };
    const summary = await runStory(
      "6",
      [step("create", { status: "done" }), step("sign", { status: "done" })],
      context,
      progress,
      options(clock(), { dryRun: true }),
    );
    expect(summary).toMatchObject({ dryRun: true, steps: ["sign"], alreadyDone: 1 });
    expect(context.calls).toEqual([]);
    expect(() => needRef({}, "dealId")).toThrow(/missing dealId/);
  });
});
