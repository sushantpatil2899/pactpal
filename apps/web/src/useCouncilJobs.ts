import { useEffect, useRef, useState } from "react";

/** How often the page reads a running council job again (a council takes a minute or a few). */
const POLL_MS = 3_000;

/**
 * A dispute's council jobs (comparisons or summaries): loaded once per dispute and read again
 * every few seconds while the newest one is running. `show` takes an answer the page already has
 * (after starting a job) and keeps reading from there.
 */
export function useCouncilJobs<T>(
  key: string,
  load: () => Promise<T>,
  running: (view: T) => boolean,
  what: string,
) {
  const [view, setView] = useState<T | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const timer = useRef<number | undefined>(undefined);

  const show = (next: T) => {
    setView(next);
    window.clearTimeout(timer.current);
    if (running(next)) {
      timer.current = window.setTimeout(() => {
        load().then(show, () => {
          setProblem(`Could not read the ${what}; reload the page to try again.`);
        });
      }, POLL_MS);
    }
  };
  useEffect(() => {
    load().then(show, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : `Could not load the ${what}.`);
    });
    return () => {
      window.clearTimeout(timer.current);
    };
  }, [key]);

  return { view, show, problem, setProblem };
}
