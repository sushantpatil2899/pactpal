/** How often and how long to keep checking, with the clock and pauses passed in for tests. */
export interface WaitOptions {
  intervalMs: number;
  timeoutMs: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  /** Called after each check that is not ready yet, e.g. to show progress. */
  onWaiting?: (attempt: number, error: unknown) => void;
}

export type WaitResult<T> = { ok: true; value: T } | { ok: false; lastError: unknown };

/**
 * Repeats `check` until it returns a value or time runs out. A check that
 * throws counts as "not ready yet", so a passing network error does not end
 * the wait; the last error is returned if time runs out.
 */
export async function waitFor<T>(
  check: () => Promise<T | undefined>,
  options: WaitOptions,
): Promise<WaitResult<T>> {
  const now = options.now ?? (() => Date.now());
  const sleep =
    options.sleep ??
    ((ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      }));
  const deadline = now() + options.timeoutMs;
  let lastError: unknown;
  for (let attempt = 1; ; attempt++) {
    try {
      const value = await check();
      if (value !== undefined) return { ok: true, value };
      lastError = undefined;
    } catch (error) {
      lastError = error;
    }
    options.onWaiting?.(attempt, lastError);
    if (now() + options.intervalMs > deadline) return { ok: false, lastError };
    await sleep(options.intervalMs);
  }
}
