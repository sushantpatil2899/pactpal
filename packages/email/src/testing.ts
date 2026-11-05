import type { HttpDeps } from "@pactpal/net";

// Test code only: a fake network for the Resend adapters.

/** A fake network answering each call with the next queued answer, recording every request. */
export function network(answers: (Response | Error)[]) {
  const calls: { url: string; init: RequestInit }[] = [];
  const waits: number[] = [];
  const deps: HttpDeps = {
    fetch: (url, init) => {
      calls.push({ url: url as string, init: init ?? {} });
      const next = answers.shift();
      if (next === undefined) throw new Error("no answer queued");
      return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
    },
    now: () => 0,
    sleep: (ms) => {
      waits.push(ms);
      return Promise.resolve();
    },
    random: () => 0.5,
  };
  return { deps, calls, waits };
}

export const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers });
