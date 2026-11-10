import {
  deadlineIsNear,
  deadlineWords,
  disputeActionWords,
  disputeChangeWords,
  disputeReasonWords,
  plainCode,
} from "@pactpal/words";
import { useEffect, useState } from "react";
import { getDisputePage, type DisputePageView } from "./api";
import { AppealPanel } from "./AppealPanel";
import { ClaimPanel } from "./ClaimPanel";
import { DisputeActions } from "./DisputeActions";
import { PacketPanel } from "./PacketPanel";
import { ResponsePanel } from "./ResponsePanel";
import { CheckNow } from "./DisputeCheck";
import { when } from "./format";
import { StatusBadge } from "./design/Badge";
import { Alert, Field, Skeleton } from "./design/parts";
import "./deal/deal.css";
import "./deal/dispute.css";

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
      const what = disputeChangeWords("changes" in fields ? fields.changes : undefined, when);
      return what.length === 0
        ? "PayPal changed the dispute"
        : `PayPal changed it: ${what.join("; ")}`;
    }
    case "DISPUTE_ESCALATED":
      return "You asked PayPal to decide the case (escalated)";
    case "DISPUTE_MESSAGE_SENT":
      return "You messaged the buyer through PayPal";
    case "OFFER_MADE":
      return "amountMinor" in fields &&
        typeof fields.amountMinor === "number" &&
        "currency" in fields &&
        typeof fields.currency === "string"
        ? `You offered a refund of ${(fields.amountMinor / 100).toFixed(2)} ${fields.currency}`
        : "You offered a refund";
    case "APPEAL_SUBMITTED":
      return "You sent PayPal an appeal with new evidence";
    case "CLAIM_ACCEPTED":
      return "You accepted the claim: PayPal refunds the buyer";
    case "EVIDENCE_UPLOADED": {
      const files = "files" in fields && Array.isArray(fields.files) ? fields.files.length : 0;
      return `You sent evidence to PayPal (${String(files)} file${files === 1 ? "" : "s"})`;
    }
    default:
      return plainCode(type);
  }
}

const NOTICE_WORDS = {
  opened: "new dispute",
  changed: "PayPal changed it",
  decided: "PayPal decided it",
  reminder: "reminder of the respond-by date",
} as const;

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
    <p className="pp-deadline" data-urgent={urgent}>
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
  /** Counts comparisons finished while the page is open, so the summary section reads again. */
  const [comparisonsDone, setComparisonsDone] = useState(0);
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
        {problem ? (
          <Alert problem>{problem}</Alert>
        ) : (
          <Skeleton label="Loading the dispute…" lines={6} />
        )}
      </>
    );
  }
  const buyerMessages = view.messages.filter((m) => m.from === "BUYER");
  return (
    <article aria-labelledby="dispute-title" className="pp-deal pp-dispute">
      <header className="pp-deal-head">
        <p>{back}</p>
        <h1 id="dispute-title">PayPal dispute {view.disputeId}</h1>
        <p>
          <StatusBadge status="disputed">{plainCode(view.status)}</StatusBadge>
          {view.paypalStage !== null && <span>{plainCode(view.paypalStage)} stage</span>}
        </p>
      </header>
      {problem && <Alert problem>{problem}</Alert>}

      <div className="pp-panel pp-dispute-facts">
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
      </div>

      <div className="pp-dispute-work">
        <div className="pp-dispute-main">
          <section aria-labelledby="claim" className="pp-panel">
            <h3 id="claim">What the buyer says</h3>
            <Field caption="Reason">
              {view.reason === null ? "not given" : disputeReasonWords(view.reason)}
            </Field>
            {!view.messagesReadable ? (
              <p>The buyer&apos;s messages could not be read from PayPal&apos;s answer.</p>
            ) : buyerMessages.length === 0 ? (
              <p>
                PayPal shows no message from the buyer (a dispute opened through PayPal&apos;s API
                has none).
              </p>
            ) : (
              <>
                <p>The buyer&apos;s words, as PayPal shows them:</p>
                {buyerMessages.map((message, i) => (
                  <blockquote key={i}>
                    {message.text}
                    {message.postedAt === null ? null : <footer>{when(message.postedAt)}</footer>}
                  </blockquote>
                ))}
              </>
            )}
          </section>
          <div className="pp-panel">
            <ClaimPanel
              dealId={dealId}
              disputeId={disputeId}
              onSettled={() => {
                setComparisonsDone((n) => n + 1);
              }}
            />
          </div>
          <div className="pp-panel">
            <PacketPanel dealId={dealId} disputeId={disputeId} comparisonsDone={comparisonsDone} />
          </div>
          <div className="pp-panel">
            <ResponsePanel dealId={dealId} disputeId={disputeId} />
          </div>
          <div className="pp-panel">
            <AppealPanel dealId={dealId} disputeId={disputeId} />
          </div>
        </div>

        <aside className="pp-dispute-side">
          <section aria-labelledby="actions" className="pp-panel">
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
            <DisputeActions
              dealId={dealId}
              disputeId={disputeId}
              onSent={() => {
                void load();
              }}
            />
            <CheckNow
              dealId={dealId}
              lastCheck={view.lastCheck}
              canCheck={view.canCheck}
              reload={load}
              onDone={() => undefined}
            />
          </section>

          <section aria-labelledby="history" className="pp-panel">
            <h3 id="history">History</h3>
            <ol>
              {view.events.map((event) => (
                <li key={event.seq}>
                  {when(event.at)}: {eventWords(event.type, event.payload)}
                </li>
              ))}
            </ol>
            <h4>Emails to you</h4>
            {view.notices.length === 0 ? (
              <p>
                None yet. PactPal emails you about changes and 72, 24 and 6 hours before the
                respond-by date.
              </p>
            ) : (
              <ul>
                {view.notices.map((notice) => (
                  <li key={`${notice.kind}-${notice.sentAt}`}>
                    {when(notice.sentAt)}: {NOTICE_WORDS[notice.kind]}
                    {notice.sent ? "" : " (not delivered: the address was refused)"}
                  </li>
                ))}
              </ul>
            )}
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
        </aside>
      </div>
    </article>
  );
}
