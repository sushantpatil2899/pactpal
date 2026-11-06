import { useState } from "react";
import {
  checkAppeal,
  draftStatement,
  getAppeal,
  getStatements,
  type AppealCheckView,
  type AppealView,
  type StatementsView,
} from "./api";
import { CitedDraft } from "./CitedDraft";
import { CouncilPanel, ReviewFlag } from "./CouncilPanel";
import { DraftControls } from "./DraftControls";
import { useCouncilJobs } from "./useCouncilJobs";

/** One finished check: the summary, then each new item with the AI's judgement and entries. */
function Check({ view, items }: { view: AppealCheckView; items: AppealView["items"] }) {
  if (view.check === null) return null;
  const words = new Map(items.map((item) => [item.id, item.words]));
  return (
    <>
      <ReviewFlag council={view.council} />
      <p>
        <strong>AI summary:</strong> {view.check.summary}
      </p>
      <ul>
        {view.check.items.map((item) => (
          <li key={item.id}>
            {words.get(item.id) ?? item.id}
            <br />
            <strong>
              {item.answers ? "AI: speaks to the claim" : "AI: does not add to what was sent"}
            </strong>{" "}
            {item.why}
            {item.record.length > 0 && (
              <small> (log entries: {item.record.map((entry) => entry.text).join("; ")})</small>
            )}
          </li>
        ))}
      </ul>
      {view.council !== null && <CouncilPanel council={view.council} />}
    </>
  );
}

/**
 * The appeal statement (5i-2): a council drafts what the new evidence shows that was not sent
 * before, and the note for PayPal's appeal, from the newest check that found something.
 */
function Statement({ dealId, disputeId }: { dealId: string; disputeId: string }) {
  const [busy, setBusy] = useState(false);
  const { view, show, problem, setProblem } = useCouncilJobs(
    `${dealId}/${disputeId}/statement`,
    () => getStatements(dealId, disputeId),
    (next: StatementsView) => next.statements[0]?.status === "running",
    "appeal statement",
  );
  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  const latest = view.statements[0];
  const onDraft = () => {
    setBusy(true);
    setProblem(undefined);
    draftStatement(dealId, disputeId).then(
      (next) => {
        setBusy(false);
        show(next);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not start the statement.");
      },
    );
  };
  return (
    <>
      <h4>Appeal statement (AI draft)</h4>
      {problem && <p role="alert">{problem}</p>}
      {latest?.status === "ready" && latest.statement !== null && (
        <CitedDraft
          council={latest.council}
          sentences={latest.statement.sentences}
          note={latest.statement.note}
          noteLabel="Draft appeal note for PayPal"
        />
      )}
      <DraftControls
        latest={latest}
        canDraft={view.canDraft}
        busy={busy}
        onDraft={onDraft}
        first="Draft the appeal statement"
        off="The appeal check must find something that speaks to the claim first."
      />
    </>
  );
}

/**
 * The appeal check (5i), after PayPal decided for the buyer: what PactPal holds that was never sent
 * to PayPal (found by code, by fingerprint), and a council's neutral judgement of whether each
 * item speaks to the claim. It never predicts the outcome; nothing is sent from here.
 */
export function AppealPanel({ dealId, disputeId }: { dealId: string; disputeId: string }) {
  const [busy, setBusy] = useState(false);
  const { view, show, problem, setProblem } = useCouncilJobs(
    `${dealId}/${disputeId}`,
    () => getAppeal(dealId, disputeId),
    (next: AppealView) => next.checks[0]?.status === "running",
    "appeal check",
  );
  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  if (!view.applies) return null;
  const latest = view.checks[0];
  const onCheck = () => {
    setBusy(true);
    setProblem(undefined);
    checkAppeal(dealId, disputeId).then(
      (next) => {
        setBusy(false);
        show(next);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not start the appeal check.");
      },
    );
  };
  return (
    <section aria-labelledby="appeal-check">
      <h3 id="appeal-check">Appeal check (AI draft)</h3>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {view.items.length === 0 ? (
        <p>
          <strong>Nothing new:</strong> everything PactPal holds for this deal was already sent to
          PayPal, so there is nothing to appeal with from PactPal&apos;s record.
        </p>
      ) : (
        <>
          <p>
            Not sent to PayPal before (from PactPal&apos;s record, by fingerprint)
            {view.cut ? "; the list is long, so only the first 80 are shown" : ""}:
          </p>
          {latest?.status === "ready" ? (
            <Check view={latest} items={view.items} />
          ) : (
            <ul>
              {view.items.map((item) => (
                <li key={item.id}>{item.words}</li>
              ))}
            </ul>
          )}
          <p>
            AI models judge whether each item speaks to a part of the claim the evidence already
            sent did not. <strong>AI draft: check every line.</strong> It does not predict what
            PayPal will decide.
          </p>
          {latest?.check?.items.some((item) => item.answers) === true && (
            <Statement dealId={dealId} disputeId={disputeId} />
          )}
          <DraftControls
            latest={latest}
            canDraft={view.canCheck}
            busy={busy}
            onDraft={onCheck}
            first="Check these against the decision"
            off="No AI model is set up, so the check is off."
          />
        </>
      )}
    </section>
  );
}
