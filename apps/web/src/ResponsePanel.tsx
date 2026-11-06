import { useState } from "react";
import { draftResponse, getResponses, type ResponseView, type ResponsesView } from "./api";
import { CouncilPanel, ReviewFlag } from "./CouncilPanel";
import { DraftControls } from "./DraftControls";
import { useCouncilJobs } from "./useCouncilJobs";

/**
 * One finished draft: each option's fixed facts and the AI's note, then the message and the offer
 * note when PayPal allowed sending them.
 */
function Draft({ view }: { view: ResponseView }) {
  if (view.draft === null) return null;
  // The message and the offer note show only when PayPal allowed that answer when this was drafted
  // (5k-fix-2): at the chargeback stage it allows neither.
  const offered = new Set(view.draft.options.map((option) => option.code));
  return (
    <>
      <ReviewFlag council={view.council} />
      <ul>
        {view.draft.options.map((option) => (
          <li key={option.code}>
            <strong>{option.facts}</strong>
            <br />
            AI note on this case: {option.fits}
            {option.record.length > 0 && (
              <small> (log entries: {option.record.map((entry) => entry.text).join("; ")})</small>
            )}
          </li>
        ))}
      </ul>
      {offered.has("send_message") && (
        <>
          <p>
            <strong>Draft message to the buyer</strong> (you can change it before sending, below):
          </p>
          <blockquote style={{ whiteSpace: "pre-wrap" }}>{view.draft.message}</blockquote>
        </>
      )}
      {offered.has("make_offer") && (
        <p>
          <strong>Draft note for a refund offer:</strong> {view.draft.offerNote}
        </p>
      )}
      {view.council !== null && <CouncilPanel council={view.council} />}
    </>
  );
}

/**
 * Answer help (5h): a council of AI models drafts a message to the buyer, a neutral note on how
 * each option PayPal allows relates to this case, and a note for a refund offer. The facts of
 * each option (what happens, the amount) are written by code; the AI never recommends one.
 */
export function ResponsePanel({ dealId, disputeId }: { dealId: string; disputeId: string }) {
  const [busy, setBusy] = useState(false);
  const { view, show, problem, setProblem } = useCouncilJobs(
    `${dealId}/${disputeId}`,
    () => getResponses(dealId, disputeId),
    (next: ResponsesView) => next.responses[0]?.status === "running",
    "answer help",
  );
  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  const latest = view.responses[0];
  const onDraft = () => {
    setBusy(true);
    setProblem(undefined);
    draftResponse(dealId, disputeId).then(
      (next) => {
        setBusy(false);
        show(next);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not start the answer help.");
      },
    );
  };
  return (
    <section aria-labelledby="answer-help">
      <h3 id="answer-help">Help me answer (AI draft)</h3>
      <p>
        AI models read the claim, the record and what PayPal allows now, then draft a message to the
        buyer and say how each option relates to this case. They do not pick one for you.{" "}
        <strong>AI draft: check every line.</strong>
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {latest?.status === "ready" && <Draft view={latest} />}
      <DraftControls
        latest={latest}
        canDraft={view.canDraft}
        busy={busy}
        onDraft={onDraft}
        first="Help me answer"
        off="PayPal allows no answer right now, or no AI model is set up."
      />
    </section>
  );
}
