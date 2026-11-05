import { useEffect, useRef, useState } from "react";
import { checkDisputes, getDisputes, type DealSummary, type DisputesView } from "./api";
import { when } from "./format";
import { SCROLL_X } from "./styles";

/** PayPal's codes in plain words: "NOT_AS_DESCRIBED" becomes "not as described". */
const words = (code: string | null): string =>
  code === null ? "—" : code.replaceAll("_", " ").toLowerCase();

/** How often the page reads the disputes again after "Check now", and for how long. */
const POLL_MS = 3_000;
const POLL_FOR_MS = 60_000;

/** When PactPal last checked, and how it went. */
function lastChecked(check: DisputesView["lastCheck"]): string {
  if (check === null) return "Not checked yet.";
  if (check.ok === null) return `Checking since ${when(check.startedAt)}…`;
  const at = when(check.finishedAt ?? check.startedAt);
  return check.ok
    ? `Last checked ${at}.`
    : `The check at ${at} did not finish; PactPal tries again.`;
}

/**
 * The seller's disputes on this deal, found by checking their PayPal disputes every few minutes,
 * and "Check now". Seller only: the buyer deals with a dispute in PayPal.
 */
export function DisputesPanel({ deal, onChange }: { deal: DealSummary; onChange: () => void }) {
  const [view, setView] = useState<DisputesView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [checking, setChecking] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const load = () =>
    getDisputes(deal.id).then(
      (next) => {
        setView(next);
        return next;
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load the disputes.");
        return undefined;
      },
    );
  useEffect(() => {
    void load();
    return () => {
      window.clearTimeout(timer.current);
    };
    // Loaded once per deal; "Check now" reads again.
  }, [deal.id]);

  /** Reads again every 3 seconds until a check newer than `since` has finished, for up to a minute. */
  const follow = (since: number, until: number) => {
    timer.current = window.setTimeout(() => {
      void load().then((next) => {
        const done =
          next?.lastCheck?.finishedAt != null && Date.parse(next.lastCheck.startedAt) >= since;
        if (done) onChange();
        if (done || Date.now() > until) setChecking(false);
        else follow(since, until);
      });
    }, POLL_MS);
  };

  const onCheck = () => {
    const since = Date.now() - POLL_MS;
    setChecking(true);
    setProblem(undefined);
    checkDisputes(deal.id).then(
      () => {
        follow(since, Date.now() + POLL_FOR_MS);
      },
      (error: unknown) => {
        setChecking(false);
        setProblem(error instanceof Error ? error.message : "Could not start the check.");
      },
    );
  };

  if (deal.role !== "seller" || view === undefined) return null;
  return (
    <section aria-labelledby="disputes">
      <h3 id="disputes">Disputes</h3>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {view.disputes.length === 0 ? (
        <p>No PayPal dispute on this deal.</p>
      ) : (
        <div style={SCROLL_X}>
          <table>
            <thead>
              <tr>
                <th scope="col">PayPal dispute</th>
                <th scope="col">Reason</th>
                <th scope="col">Where it stands</th>
                <th scope="col">Respond by</th>
              </tr>
            </thead>
            <tbody>
              {view.disputes.map((dispute) => (
                <tr key={dispute.disputeId}>
                  <td>
                    {dispute.disputeId}
                    {dispute.stage === null ? "" : ` (stage ${String(dispute.stage)})`}
                    {dispute.amount === null
                      ? ""
                      : `, ${dispute.amount.text} ${dispute.amount.currency}`}
                  </td>
                  <td>{words(dispute.reason)}</td>
                  <td>
                    {words(dispute.status)}
                    {dispute.paypalStage === null ? "" : ` (${words(dispute.paypalStage)})`}
                    {dispute.outcome === null ? "" : `: ${words(dispute.outcome)}`}
                  </td>
                  <td>{dispute.sellerDueAt === null ? "—" : when(dispute.sellerDueAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p>
        {lastChecked(view.lastCheck)} PactPal checks your PayPal disputes every 5 minutes.{" "}
        {view.canCheck && (
          <button type="button" disabled={checking} onClick={onCheck}>
            {checking ? "Checking…" : "Check now"}
          </button>
        )}
      </p>
    </section>
  );
}
