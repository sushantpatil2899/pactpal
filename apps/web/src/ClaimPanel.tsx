import { disputeActionWords, plainCode } from "@pactpal/words";
import { useState, type FormEvent } from "react";
import {
  compareClaim,
  getClaimAnalyses,
  type ClaimAnalysesView,
  type ClaimAnalysisView,
  type ClaimStatement,
} from "./api";
import { CouncilPanel, ReviewFlag } from "./CouncilPanel";
import { when } from "./format";
import { useCouncilJobs } from "./useCouncilJobs";

/** What the record shows about one statement: the agreement lines and log entries cited. */
function Statement({ statement }: { statement: ClaimStatement }) {
  return (
    <li>
      <blockquote>The buyer said: “{statement.quote}”</blockquote>
      {statement.finding === "not-covered" ? (
        <p>
          <strong>No record covers this.</strong>
        </p>
      ) : (
        <>
          <p>What the record shows: {statement.relation}</p>
          <ul>
            {statement.agreement.map((citation) => (
              <li key={`a${String(citation.line)}`}>
                Agreement line {citation.line}: “{citation.quote}”
              </li>
            ))}
            {statement.record.map((entry) => (
              <li key={`r${String(entry.n)}`}>Log entry {entry.text}</li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

/** One finished comparison: each statement, the suggestion, and how the council worked. */
function Analysis({ view }: { view: ClaimAnalysisView }) {
  if (view.analysis === null) return null;
  const { statements, suggestion } = view.analysis;
  return (
    <>
      <ReviewFlag council={view.council} />
      <ol>
        {statements.map((statement, i) => (
          <Statement key={i} statement={statement} />
        ))}
      </ol>
      <p>
        <strong>AI suggestion (check it against PayPal&apos;s page):</strong>{" "}
        {suggestion.action === null
          ? "nothing to do right now."
          : disputeActionWords(suggestion.action)}
        {suggestion.evidenceType === null
          ? ""
          : ` Evidence type: ${plainCode(suggestion.evidenceType)}.`}{" "}
        {suggestion.why}
      </p>
      {view.council !== null && <CouncilPanel council={view.council} />}
    </>
  );
}

/**
 * Comparing the buyer's claim with the record (5d): a council of AI models splits the claim into
 * statements and, for each, cites the agreement lines and log entries that speak to it, or says
 * no record covers it. An AI draft for the seller, kept apart from the evidence.
 */
export function ClaimPanel({
  dealId,
  disputeId,
  onSettled,
}: {
  dealId: string;
  disputeId: string;
  /** Called when a comparison this page saw running has finished. */
  onSettled?: () => void;
}) {
  const { view, show, problem, setProblem } = useCouncilJobs(
    `${dealId}/${disputeId}`,
    () => getClaimAnalyses(dealId, disputeId),
    (next: ClaimAnalysesView) => next.analyses[0]?.status === "running",
    "comparison",
    onSettled,
  );
  const [pasted, setPasted] = useState("");
  const [busy, setBusy] = useState(false);

  const onCompare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setProblem(undefined);
    const text = pasted.trim();
    compareClaim(dealId, disputeId, text === "" ? undefined : text).then(
      (next) => {
        setBusy(false);
        setPasted("");
        show(next);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not start the comparison.");
      },
    );
  };

  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  const latest = view.analyses[0];
  const running = latest?.status === "running";
  return (
    <section aria-labelledby="claim-record">
      <h3 id="claim-record">The claim against the record (AI draft)</h3>
      <p>
        AI models compare the buyer&apos;s claim with the signed agreement and this deal&apos;s
        evidence log. <strong>AI draft: check every line.</strong> It shows what the record holds;
        it does not decide who is right.
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {latest?.status === "ready" && <Analysis view={latest} />}
      {latest?.status === "failed" && (
        <p>The last comparison did not finish: {latest.failureReason ?? "unknown reason"}.</p>
      )}
      {running && <p>Comparing… (started {when(latest.createdAt)}; this takes a minute or two)</p>}
      {view.canCompare ? (
        <form onSubmit={onCompare}>
          {view.canPaste && (
            <p>
              <label>
                The buyer&apos;s claim, if PayPal shows none (it is saved as a file of this deal)
                <br />
                <textarea
                  value={pasted}
                  onChange={(event) => {
                    setPasted(event.target.value);
                  }}
                  rows={4}
                  maxLength={20_000}
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </label>
            </p>
          )}
          <button type="submit" disabled={busy || running}>
            {latest === undefined ? "Compare the claim with the record" : "Compare again"}
          </button>
        </form>
      ) : (
        <p>No AI model is set up on this server, so comparisons are off.</p>
      )}
    </section>
  );
}
