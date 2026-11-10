import { useEffect, useRef, useState } from "react";
import { checkDisputes, type DisputesView } from "./api";
import { when } from "./format";

/** How often a page reads again after "Check now", and for how long. */
const POLL_MS = 3_000;
const POLL_FOR_MS = 60_000;

type LastCheck = DisputesView["lastCheck"];

/** When PactPal last checked, and how it went. */
function lastChecked(check: LastCheck): string {
  if (check === null) return "Not checked yet.";
  if (check.ok === null) return `Checking since ${when(check.startedAt)}…`;
  const at = when(check.finishedAt ?? check.startedAt);
  return check.ok
    ? `Last checked ${at}.`
    : `The check at ${at} did not finish; PactPal tries again.`;
}

/**
 * "Last checked …" and "Check now", shared by the deal page's Disputes box and the dispute page.
 * After a press it reads again every 3 seconds until a newer check has finished (up to a minute),
 * then tells the page.
 */
export function CheckNow({
  dealId,
  lastCheck,
  canCheck,
  reload,
  onDone,
}: {
  dealId: string;
  lastCheck: LastCheck;
  canCheck: boolean;
  reload: () => Promise<{ lastCheck: LastCheck } | undefined>;
  onDone: () => void;
}) {
  const [checking, setChecking] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();
  const timer = useRef<number | undefined>(undefined);
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );

  const follow = (since: number, until: number) => {
    timer.current = window.setTimeout(() => {
      void reload().then((next) => {
        const check = next?.lastCheck;
        const done = check?.finishedAt != null && Date.parse(check.startedAt) >= since;
        if (done) onDone();
        if (done || Date.now() > until) setChecking(false);
        else follow(since, until);
      });
    }, POLL_MS);
  };

  const onCheck = () => {
    const since = Date.now() - POLL_MS;
    setChecking(true);
    setProblem(undefined);
    checkDisputes(dealId).then(
      () => {
        follow(since, Date.now() + POLL_FOR_MS);
      },
      (error: unknown) => {
        setChecking(false);
        setProblem(error instanceof Error ? error.message : "Could not start the check.");
      },
    );
  };

  return (
    <>
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      <p>
        {lastChecked(lastCheck)} PactPal checks your PayPal disputes every 5 minutes.{" "}
        {canCheck && (
          <button type="button" disabled={checking} onClick={onCheck}>
            {checking ? "Checking…" : "Check now"}
          </button>
        )}
      </p>
    </>
  );
}
