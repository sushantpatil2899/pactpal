import {
  deadlineIsNear,
  deadlineWords,
  disputeActionWords,
  disputeReasonWords,
  plainCode,
} from "@pactpal/words";
import { useEffect, useState } from "react";
import { getDisputePage, type DisputePageView } from "./api";
import { ClaimPanel } from "./ClaimPanel";
import { CheckNow } from "./DisputeCheck";
import { when } from "./format";
import { WRAP } from "./styles";

/** The address of one dispute's page. */
export const disputePageUrl = (dealId: string, disputeId: string) =>
  `/deals/${encodeURIComponent(dealId)}/disputes/${encodeURIComponent(disputeId)}`;

const MINUTE_MS = 60_000;
const ADDED_BY = { seller: "the seller", buyer: "the buyer", system: "PactPal" } as const;

/** A log entry about this dispute in plain words. */
function eventWords(type: string, payload: unknown): string {
  const fields = typeof payload === "object" && payload !== null ? payload : {};
  switch (type) {
    case "DISPUTE_OPENED":
      return "PactPal found the dispute and tied it to this deal";
    case "DISPUTE_RESOLVED":
      return "outcome" in fields && typeof fields.outcome === "string"
        ? `PayPal decided: ${plainCode(fields.outcome)}`
        : "PayPal decided";
    case "DISPUTE_UPDATED": {
      const changes: [string, unknown][] =
        "changes" in fields && typeof fields.changes === "object" && fields.changes !== null
          ? Object.entries(fields.changes as Record<string, unknown>)
          : [];
      const what = changes.map(([name, change]) => {
        const to =
          typeof change === "object" && change !== null && "to" in change ? change.to : null;
        const label = name === "sellerDueAt" ? "respond-by date" : plainCode(name);
        if (typeof to !== "string") return `${label} cleared`;
        return `${label} now ${name === "sellerDueAt" ? when(to) : plainCode(to)}`;
      });
      return what.length === 0
        ? "PayPal changed the dispute"
        : `PayPal changed it: ${what.join("; ")}`;
    }
    default:
      return plainCode(type);
  }
}

/** The respond-by line: a countdown that turns red under two days and says when it has passed. */
function Deadline({ dueAt }: { dueAt: string | null }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = window.setInterval(() => {
      setNow(new Date());
    }, MINUTE_MS);
    return () => {
      window.clearInterval(tick);
    };
  }, []);
  if (dueAt === null) return <p>PayPal has not set a respond-by date for you right now.</p>;
  const due = new Date(dueAt);
  const urgent = deadlineIsNear(due, now) || due.getTime() <= now.getTime();
  return (
    <p style={urgent ? { color: "#8a1c1c", fontWeight: 600 } : undefined}>
      Respond by {when(dueAt)}: {deadlineWords(due, now)}.
    </p>
  );
}

/**
 * One dispute for the seller (5c): what the buyer says, what is at stake, where it stands, the
 * deadline, what PayPal allows right now and the dispute's history. Nothing is sent from here yet.
 */
export function DisputePage({ dealId, disputeId }: { dealId: string; disputeId: string }) {
  const [view, setView] = useState<DisputePageView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();

  const load = () =>
    getDisputePage(dealId, disputeId).then(
      (next) => {
        setView(next);
        return next;
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load the dispute.");
        return undefined;
      },
    );
  useEffect(() => {
    void load();
  }, [dealId, disputeId]);

  const back = <a href={`/deals/${encodeURIComponent(dealId)}`}>Back to the deal</a>;
  if (view === undefined) {
    return (
      <>
        <p>{back}</p>
        {problem ? <p role="alert">{problem}</p> : <p>Loading…</p>}
      </>
    );
  }
  const buyerMessages = view.messages.filter((m) => m.from === "BUYER");
  return (
    <article aria-labelledby="dispute-title" style={WRAP}>
      <p>{back}</p>
      <h2 id="dispute-title">PayPal dispute {view.disputeId}</h2>
      {problem && <p role="alert">{problem}</p>}

      <section aria-labelledby="claim">
        <h3 id="claim">What the buyer says</h3>
        <p>Reason: {view.reason === null ? "not given" : disputeReasonWords(view.reason)}.</p>
        {!view.messagesReadable ? (
          <p>The buyer's messages could not be read from PayPal's answer.</p>
        ) : buyerMessages.length === 0 ? (
          <p>
            PayPal shows no message from the buyer (a dispute opened through PayPal's API has none).
          </p>
        ) : (
          <>
            <p>The buyer's words, as PayPal shows them:</p>
            {buyerMessages.map((message, i) => (
              <blockquote key={i}>
                {message.text}
                {message.postedAt === null ? null : <footer>{when(message.postedAt)}</footer>}
              </blockquote>
            ))}
          </>
        )}
      </section>

      <section aria-labelledby="stake">
        <h3 id="stake">What is at stake</h3>
        <p>
          {view.amount === null
            ? "Amount not given"
            : `${view.amount.text} ${view.amount.currency}`}
          {view.stage === null ? "" : `, for payment stage ${String(view.stage)}`}
          {view.invoiceId === null ? "" : ` (PayPal invoice ${view.invoiceId})`}. Opened{" "}
          {when(view.openedAt)}.
        </p>
      </section>

      <section aria-labelledby="standing">
        <h3 id="standing">Where it stands</h3>
        <p>
          {plainCode(view.status)}
          {view.paypalStage === null ? "" : `, ${plainCode(view.paypalStage)} stage`}
          {view.outcome === null ? "" : `. PayPal decided: ${plainCode(view.outcome)}`}.
        </p>
        <Deadline dueAt={view.sellerDueAt} />
      </section>

      <ClaimPanel dealId={dealId} disputeId={disputeId} />

      <section aria-labelledby="actions">
        <h3 id="actions">What you can do now</h3>
        <p>As PayPal allowed when PactPal last read it ({when(view.checkedAt)}):</p>
        {view.allowedActions.length === 0 ? (
          <p>Nothing right now: PayPal is not waiting for you.</p>
        ) : (
          <ul>
            {view.allowedActions.map((action) => (
              <li key={action}>{disputeActionWords(action)}</li>
            ))}
          </ul>
        )}
        {view.offerTypes.length > 0 && (
          <p>Refund offers PayPal accepts now: {view.offerTypes.map(plainCode).join(", ")}.</p>
        )}
        <CheckNow
          dealId={dealId}
          lastCheck={view.lastCheck}
          canCheck={view.canCheck}
          reload={load}
          onDone={() => undefined}
        />
      </section>

      <section aria-labelledby="history">
        <h3 id="history">History</h3>
        <ol>
          {view.events.map((event) => (
            <li key={event.seq}>
              {when(event.at)}: {eventWords(event.type, event.payload)}
            </li>
          ))}
        </ol>
        <h4>Files added since the buyer opened it</h4>
        {view.filesSince.length === 0 ? (
          <p>None.</p>
        ) : (
          <ul>
            {view.filesSince.map((file) => (
              <li key={file.id}>
                {file.filename}, added by {ADDED_BY[file.addedBy]} on {when(file.addedAt)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
