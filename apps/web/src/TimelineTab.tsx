import type { StepUpdateStatus } from "@pactpal/timeline";
import { stepLine } from "@pactpal/words";
import { useEffect, useState, type FormEvent } from "react";
import { getScope, listFiles, type DealFile, type ScopeView } from "./api";
import { getTimeline, updateStep, type RunningStepView, type TimelineView } from "./chat-api";
import { when } from "./format";
import { FULL_WIDTH } from "./styles";

const STATE_WORDS: Record<RunningStepView["state"], string> = {
  open: "To do",
  submitted: "Waiting for an answer",
  changes: "Changes asked for",
  done: "Done",
};

const UPDATE_WORDS: Record<StepUpdateStatus, string> = {
  submitted: "shared it for review",
  approved: "approved it",
  changes: "asked for changes",
  done: "marked it done",
};

/** The buttons for what this person may record on a step now. */
const ACTION_WORDS: Record<StepUpdateStatus, string> = {
  submitted: "Share for review",
  approved: "Approve",
  changes: "Ask for changes",
  done: "Mark done",
};

/** One step's update form: a note, files already on the deal, and the allowed actions. */
function StepActions({
  dealId,
  step,
  files,
  onDone,
}: {
  dealId: string;
  step: RunningStepView;
  files: readonly DealFile[];
  onDone: (view: TimelineView) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();
  const act = (status: StepUpdateStatus) => (event: FormEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;
    const data = new FormData(form);
    const raw = data.get("note");
    const note = typeof raw === "string" ? raw.trim() : "";
    const fileIds = data.getAll("file").filter((id): id is string => typeof id === "string");
    setBusy(true);
    setProblem(undefined);
    updateStep(dealId, step.n, {
      status,
      ...(note === "" ? {} : { note }),
      ...(fileIds.length === 0 ? {} : { fileIds }),
    }).then(
      (view) => {
        setBusy(false);
        onDone(view);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not update the step.");
      },
    );
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      <label>
        Note (optional; the other side sees it)
        <textarea name="note" rows={2} maxLength={1000} style={FULL_WIDTH} />
      </label>
      {files.length > 0 && (
        <fieldset>
          <legend>Files to go with it (add new ones in the Files tab)</legend>
          {files.map((file) => (
            <label key={file.id} style={{ display: "block" }}>
              <input type="checkbox" name="file" value={file.id} /> {file.filename}
            </label>
          ))}
        </fieldset>
      )}
      {step.canDo.map((status) => (
        <button key={status} type="button" disabled={busy} onClick={act(status)}>
          {ACTION_WORDS[status]}
        </button>
      ))}
    </form>
  );
}

/**
 * The deal's timeline: every agreed step in order (7f). Once signed (7k), each step shows where it
 * stands, who it waits for, what happened so far, and the buttons for whoever is next. Payments
 * and deliveries follow PayPal and the deliveries below; every update is in the evidence log.
 */
export function TimelineTab({
  dealId,
  role,
  refreshKey,
}: {
  dealId: string;
  role: "seller" | "buyer";
  /** Changes when something may have moved (a saved version, a chat card). */
  refreshKey: number;
}) {
  const [timeline, setTimeline] = useState<TimelineView | undefined>();
  const [scope, setScope] = useState<ScopeView | null | undefined>();
  const [files, setFiles] = useState<DealFile[]>([]);
  useEffect(() => {
    getTimeline(dealId).then(setTimeline, () => undefined);
    getScope(dealId).then(setScope, () => {
      setScope(null);
    });
    // PactPal's own copies of the chat (what a draft read) are not offered as attachments.
    listFiles(dealId).then(
      (all) => {
        setFiles(all.filter((file) => !file.filename.startsWith("pactpal-chat-")));
      },
      () => undefined,
    );
  }, [dealId, refreshKey]);

  if (timeline === undefined || scope === undefined) {
    return <p aria-busy="true">Loading the timeline…</p>;
  }
  if (!timeline.signed) {
    return (
      <section aria-labelledby="timeline-heading">
        <h3 id="timeline-heading">Timeline</h3>
        {scope === null ? (
          <p>No agreement yet: the timeline appears once the seller writes the agreed work.</p>
        ) : (
          <>
            <p>Version {scope.version} · not signed yet. The steps start once the buyer signs.</p>
            <ol style={{ listStyle: "none", paddingLeft: 0 }}>
              {scope.steps.map((step) => (
                <li key={step.n}>{stepLine(step, scope.currency)}</li>
              ))}
            </ol>
          </>
        )}
      </section>
    );
  }
  const current = timeline.steps.find((step) => step.state !== "done");
  return (
    <section aria-labelledby="timeline-heading">
      <h3 id="timeline-heading">Timeline</h3>
      <p>
        Signed version {timeline.version} ·{" "}
        {current
          ? `next: step ${String(current.n)}, waiting for the ${current.waitingOn ?? "other side"}`
          : "every step is done"}
      </p>
      <ol style={{ listStyle: "none", paddingLeft: 0 }}>
        {timeline.steps.map((step) => (
          <li
            key={step.n}
            style={{
              margin: "0.75rem 0",
              padding: "0.5rem",
              border: `1px solid var(${step === current ? "--color-wait" : "--color-line-strong"})`,
              borderRadius: 8,
            }}
          >
            <strong>{stepLine(step, timeline.currency)}</strong>
            <br />
            {STATE_WORDS[step.state]}
            {step.waitingOn !== null && (
              <>
                {" · "}
                {step.waitingOn === role ? "your turn" : `waiting for the ${step.waitingOn}`}:{" "}
                {step.next}
              </>
            )}
            {step.updates.length > 0 && (
              <ul>
                {step.updates.map((update, i) => (
                  <li key={i}>
                    The {update.actor} {UPDATE_WORDS[update.status]}, {when(update.at)}
                    {update.note !== null && `: "${update.note}"`}
                    {update.files.length > 0 &&
                      ` (files: ${update.files.map((f) => f.filename).join(", ")})`}
                  </li>
                ))}
              </ul>
            )}
            {step.canDo.length > 0 && (
              <StepActions dealId={dealId} step={step} files={files} onDone={setTimeline} />
            )}
            {(step.kind === "payment" || step.kind === "delivery") && step.state !== "done" && (
              <p data-tone="note">
                {step.kind === "payment"
                  ? "Payments go through PayPal invoices, below."
                  : "Deliveries are sent and answered below."}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
