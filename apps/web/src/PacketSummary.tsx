import type { PacketSummariesView, PacketSummaryView } from "./api";
import { CitedDraft } from "./CitedDraft";
import { DraftControls } from "./DraftControls";

/** One finished summary: the sentences with their log entries, the note, and the council. */
function Summary({ view }: { view: PacketSummaryView }) {
  if (view.summary === null) return null;
  return (
    <CitedDraft
      council={view.council}
      sentences={view.summary.summary}
      note={view.summary.note}
      noteLabel="Draft note for PayPal"
    />
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
  return (
    <>
      <h4>Summary and document picks (AI draft)</h4>
      <p>
        AI models read the comparison above, the evidence log and the list below, then write a
        neutral summary, suggest which documents to send and draft PayPal&apos;s note.{" "}
        <strong>AI draft: check every line.</strong>
      </p>
      {latest?.status === "ready" && <Summary view={latest} />}
      <DraftControls
        latest={latest}
        canDraft={view.canDraft}
        busy={busy}
        onDraft={onDraft}
        first="Draft a summary and suggest documents"
        off="Compare the claim with the record first (and AI models must be set up)."
      />
    </>
  );
}
