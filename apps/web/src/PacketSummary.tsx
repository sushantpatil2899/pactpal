import type { PacketSummariesView, PacketSummaryView } from "./api";
import { CouncilPanel, ReviewFlag } from "./CouncilPanel";
import { when } from "./format";

/** One finished summary: the sentences with their log entries, the note, and the council. */
function Summary({ view }: { view: PacketSummaryView }) {
  if (view.summary === null) return null;
  return (
    <>
      <ReviewFlag council={view.council} />
      <ol>
        {view.summary.summary.map((sentence, i) => (
          <li key={i}>
            {sentence.text}{" "}
            <small>(log entries: {sentence.record.map((entry) => entry.text).join("; ")})</small>
          </li>
        ))}
      </ol>
      <p>
        <strong>Draft note for PayPal</strong> (you can change it before anything is sent, in a
        later step):
      </p>
      <blockquote style={{ whiteSpace: "pre-wrap" }}>{view.summary.note}</blockquote>
      {view.council !== null && <CouncilPanel council={view.council} />}
    </>
  );
}

/**
 * The packet summary (5f): a council of AI models drafts a neutral summary of what the record
 * shows about the claim, picks the documents to send, and drafts PayPal's note, from the newest
 * comparison. An AI draft for the seller, kept apart from the evidence.
 */
export function PacketSummary({
  view,
  busy,
  onDraft,
}: {
  view: PacketSummariesView;
  busy: boolean;
  onDraft: () => void;
}) {
  const latest = view.summaries[0];
  const running = latest?.status === "running";
  return (
    <>
      <h4>Summary and document picks (AI draft)</h4>
      <p>
        AI models read the comparison above, the evidence log and the list below, then write a
        neutral summary, suggest which documents to send and draft PayPal&apos;s note.{" "}
        <strong>AI draft: check every line.</strong>
      </p>
      {latest?.status === "ready" && <Summary view={latest} />}
      {latest?.status === "failed" && (
        <p>The last summary did not finish: {latest.failureReason ?? "unknown reason"}.</p>
      )}
      {running && <p>Drafting… (started {when(latest.createdAt)}; this takes a minute or two)</p>}
      {view.canDraft ? (
        <button type="button" disabled={busy || running} onClick={onDraft}>
          {latest === undefined ? "Draft a summary and suggest documents" : "Draft again"}
        </button>
      ) : (
        <p>Compare the claim with the record first (and AI models must be set up).</p>
      )}
    </>
  );
}
