import { useEffect, useState, type FormEvent } from "react";
import { checkMessage, getMessages, type MessageReviewView, type MessagesView } from "./api";
import { when } from "./format";
import { LABEL_WORDS, revisionNote } from "./message-words";
import { FULL_WIDTH, WRAP } from "./styles";

const POLL_MS = 3000;
const ALERT = { color: "var(--color-alert-ink)" } as const;

/** One review: each request with its label and quotes, the drafted reply and change lines. */
function ReviewResult({
  review,
  revisions,
  onUseChange,
}: {
  review: MessageReviewView;
  revisions: MessagesView["revisions"];
  onUseChange: (lines: string[]) => void;
}) {
  const [copied, setCopied] = useState(false);
  if (review.status === "running") {
    return <p aria-busy="true">Checking with several models… (this takes about a minute)</p>;
  }
  if (!review.review) {
    return (
      <p role="status">
        The check did not finish ({review.failureReason ?? "unknown reason"}). The message is saved;
        you can paste it again to retry.
      </p>
    );
  }
  const { requests, reply, changeLines } = review.review;
  return (
    <div style={WRAP}>
      {review.needsReview && (
        <p role="status">
          <strong>The models did not fully agree; read this carefully.</strong>
        </p>
      )}
      {requests.length === 0 && <p>The models found no request in this message.</p>}
      <ul>
        {requests.map((request, i) => (
          <li key={i}>
            &ldquo;{request.quote}&rdquo;: <strong>{LABEL_WORDS[request.label]}</strong>
            {request.why === "" ? "" : `. ${request.why}`}
            {request.citations.map((c) => (
              <span key={`${String(c.line)}-${c.quote}`}>
                {" "}
                Agreement line {c.line}: &ldquo;{c.quote}&rdquo;.
              </span>
            ))}
            {request.label === "extra-revision" && revisions && <> {revisionNote(revisions)}</>}
          </li>
        ))}
      </ul>
      <p>
        <strong>Drafted reply</strong> (edit it and send it yourself; PactPal never sends it):
      </p>
      <blockquote style={{ whiteSpace: "pre-wrap" }}>{reply}</blockquote>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(reply).then(
            () => {
              setCopied(true);
            },
            () => undefined,
          );
        }}
      >
        {copied ? "Copied" : "Copy reply"}
      </button>
      {changeLines.length > 0 && (
        <>
          <p>
            <strong>Drafted change:</strong> {changeLines.map((line) => `"${line}"`).join(" · ")}
          </p>
          <button
            type="button"
            onClick={() => {
              onUseChange(changeLines);
            }}
          >
            Use these in a change order
          </button>
        </>
      )}
      <p>
        <small>Labels are AI advice and may be wrong; the signed agreement is what counts.</small>
      </p>
    </div>
  );
}

/**
 * The seller's message watcher (4m): paste a new message from the buyer; it is saved as a deal
 * file and a council of models labels each request against the signed agreement, drafts a reply
 * and lines for a change order. Only the seller sees the review; nothing goes to the buyer.
 */
export function MessagesPanel({
  dealId,
  onLogChange,
  onUseChange,
}: {
  dealId: string;
  onLogChange: () => void;
  onUseChange: (lines: string[]) => void;
}) {
  const [view, setView] = useState<MessagesView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const running = view?.reviews.some((r) => r.status === "running") === true;

  // While a review runs, check back until it is final or the page is left.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () => {
      getMessages(dealId).then(
        (next) => {
          if (cancelled) return;
          setView(next);
          if (next.reviews.some((r) => r.status === "running")) timer = setTimeout(load, POLL_MS);
        },
        () => undefined,
      );
    };
    if (view === undefined || running) load();
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
    };
    // Only a change in whether a review runs needs a new loop.
  }, [dealId, running]);

  if (!view || (!view.canCheck && view.reviews.length === 0)) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setProblem(undefined);
    checkMessage(dealId, text).then(
      (next) => {
        setBusy(false);
        setText("");
        setView(next);
        onLogChange();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not check the message.");
      },
    );
  };

  const [newest, ...earlier] = view.reviews;
  return (
    <section aria-labelledby="messages">
      <h3 id="messages">Messages from the buyer</h3>
      {problem && (
        <p role="alert" style={ALERT}>
          {problem}
        </p>
      )}
      {view.canCheck && (
        <form onSubmit={onSubmit}>
          <p>
            <label>
              Paste a new message from the buyer
              <textarea
                name="message"
                required
                maxLength={5000}
                rows={4}
                style={FULL_WIDTH}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                }}
              />
            </label>
          </p>
          <p>
            <small>
              The message is saved to the deal&apos;s files (the log shows it was added). Several AI
              models then compare it with the signed agreement; only you see their review.
            </small>
          </p>
          <button type="submit" disabled={busy || running}>
            {busy ? "Saving…" : "Check this message"}
          </button>
        </form>
      )}
      {newest && (
        <>
          <h4>
            {newest.file.filename}, {when(newest.createdAt)}
          </h4>
          <blockquote style={{ whiteSpace: "pre-wrap", ...WRAP }}>{newest.message}</blockquote>
          <ReviewResult review={newest} revisions={view.revisions} onUseChange={onUseChange} />
        </>
      )}
      {earlier.length > 0 && (
        <details>
          <summary>Earlier messages ({earlier.length})</summary>
          {earlier.map((review) => (
            <div key={review.id}>
              <h4>
                {review.file.filename}, {when(review.createdAt)}
              </h4>
              <blockquote style={{ whiteSpace: "pre-wrap", ...WRAP }}>{review.message}</blockquote>
              <ReviewResult review={review} revisions={view.revisions} onUseChange={onUseChange} />
            </div>
          ))}
        </details>
      )}
    </section>
  );
}
