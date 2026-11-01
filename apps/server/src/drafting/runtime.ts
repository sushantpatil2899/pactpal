import { randomBytes, randomInt } from "node:crypto";
import type { ChatClient } from "@pactpal/ai";
import type { CouncilDeps } from "@pactpal/council";

/** How many councils may run at once across the whole server (each uses about ten model calls). */
export const MAX_CONCURRENT_COUNCILS = 2;

/**
 * What the draft routes need to run a council: the models that have keys, the council's effects
 * (random numbers, markers, clock), a limit on simultaneous councils and a way to run a job in
 * the background. Tests pass their own `run` so they can wait for a job to finish.
 */
export interface DraftingRuntime {
  clients: readonly ChatClient[];
  council: CouncilDeps;
  /** Takes a place for one council, or undefined when all places are taken. Call the result when done. */
  acquire(): (() => void) | undefined;
  /** Runs `job` in the background; `job` must never throw. */
  run(job: () => Promise<void>): void;
}

/** Shuffle values and markers from the operating system's random source. */
export const cryptoCouncilDeps = (now: () => number = Date.now): CouncilDeps => ({
  rng: () => randomInt(0, 2 ** 32) / 2 ** 32,
  newMarker: () => randomBytes(6).toString("hex"),
  now,
});

export function createDraftingRuntime(options: {
  clients: readonly ChatClient[];
  council?: CouncilDeps;
  maxConcurrent?: number;
  run?: DraftingRuntime["run"];
}): DraftingRuntime {
  const {
    clients,
    council = cryptoCouncilDeps(),
    maxConcurrent = MAX_CONCURRENT_COUNCILS,
  } = options;
  let active = 0;
  return {
    clients,
    council,
    acquire: () => {
      if (active >= maxConcurrent) return undefined;
      active += 1;
      let released = false;
      return () => {
        if (!released) active -= 1;
        released = true;
      };
    },
    run:
      options.run ??
      ((job) => {
        void job();
      }),
  };
}
