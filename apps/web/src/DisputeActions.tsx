import { plainCode, sizeWords } from "@pactpal/words";
import { useEffect, useState } from "react";
import {
  escalateDispute,
  getDisputeActions,
  resendAction,
  sendEvidence,
  textFingerprint,
  type DisputeActionView,
  type DisputeActionsView,
} from "./api";
import { when } from "./format";

/** PayPal's longest note for an escalation or evidence. */
const MAX_NOTE_CHARS = 2000;

const KIND_WORDS = { escalate: "Escalation", evidence: "Evidence" } as const;
const STATUS_WORDS = {
  sending: "being sent",
  sent: "sent to PayPal",
  unknown: "PayPal may have received it: check the dispute before sending again",
  refused: "not sent",
} as const;

/** One past send, in a line: what, when, how it ended. */
function PastAction({
  action,
  onResend,
  busy,
}: {
  action: DisputeActionView;
  onResend: (id: string) => void;
  busy: boolean;
}) {
  const [ticked, setTicked] = useState(false);
  const files = action.files.length;
  return (
    <li>
      {when(action.createdAt)}: {KIND_WORDS[action.kind]}
      {action.evidenceType === null ? "" : ` (${plainCode(action.evidenceType)}`}
      {action.evidenceType === null
        ? ""
        : `; ${String(files)} file${files === 1 ? "" : "s"}, ${sizeWords(action.totalBytes)})`}{" "}
      — {STATUS_WORDS[action.status]}
      {action.failure === null || action.status === "unknown" ? "" : `: ${action.failure}`}
      {action.status === "unknown" && (
        <p>
          <label>
            <input
              type="checkbox"
              checked={ticked}
              onChange={() => {
                setTicked(!ticked);
              }}
            />{" "}
            I checked PayPal and it does not show this yet; send the same again
          </label>{" "}
          <button
            type="button"
            disabled={!ticked || busy}
            onClick={() => {
              onResend(action.id);
            }}
          >
            Send again
          </button>
        </p>
      )}
    </li>
  );
}

/** The note box with its character count; editing it clears the confirmation. */
function NoteBox({ note, onChange }: { note: string; onChange: (note: string) => void }) {
  return (
    <p>
      <label>
        Note to PayPal ({note.length} of {MAX_NOTE_CHARS} characters)
        <br />
        <textarea
          value={note}
          maxLength={MAX_NOTE_CHARS}
          rows={6}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          style={{ width: "100%", boxSizing: "border-box" }}
        />
      </label>
    </p>
  );
}

/**
 * Sending to PayPal (5g): escalating the case and sending evidence, each on a review screen that
 * shows exactly what will go. Nothing is sent until the seller ticks the box and presses the
 * button; the AI drafts (the note, the evidence type) are only starting points.
 */
export function DisputeActions({
  dealId,
  disputeId,
  onSent,
}: {
  dealId: string;
  disputeId: string;
  onSent: () => void;
}) {
  const [view, setView] = useState<DisputeActionsView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<"escalate" | "evidence" | undefined>();
  const [note, setNote] = useState("");
  const [type, setType] = useState("");
  const [ticked, setTicked] = useState(false);

  const load = () => {
    getDisputeActions(dealId, disputeId).then(setView, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load what can be sent.");
    });
  };
  useEffect(load, [dealId, disputeId]);

  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  const { packet } = view;

  // The review starts from what is current now: the newest packet, draft note and PayPal's state
  // may have changed since this section loaded (a summary drafted or a packet built above).
  const review = (kind: "escalate" | "evidence") => {
    setBusy(true);
    setProblem(undefined);
    getDisputeActions(dealId, disputeId).then(
      (fresh) => {
        setView(fresh);
        setBusy(false);
        setOpen(kind);
        setNote(fresh.draftNote ?? "");
        setType(fresh.suggestedType ?? fresh.evidenceTypes[0] ?? "OTHER");
        setTicked(false);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not load what can be sent.");
      },
    );
  };
  const run = (send: () => Promise<unknown>) => {
    setBusy(true);
    setProblem(undefined);
    send().then(
      () => {
        setBusy(false);
        setOpen(undefined);
        load();
        onSent();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Nothing was sent.");
        load();
      },
    );
  };
  const onSend = () => {
    run(async () => {
      const confirmed = { note, noteSha256: await textFingerprint(note) };
      if (open === "escalate") return escalateDispute(dealId, disputeId, confirmed);
      if (!packet) throw new Error("Build a packet first.");
      return sendEvidence(dealId, disputeId, {
        ...confirmed,
        packetId: packet.id,
        packetSha256: packet.packetSha256,
        evidenceType: type,
      });
    });
  };
  const editNote = (next: string) => {
    setNote(next);
    setTicked(false);
  };
  const canSubmit = ticked && !busy && note.trim() !== "";

  return (
    <div>
      <h4>Send to PayPal</h4>
      {!view.canSend && <p>Sending to PayPal is not set up on this server.</p>}
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {view.canSend && open === undefined && (
        <p>
          {view.allowed.escalate && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                review("escalate");
              }}
            >
              Escalate to PayPal…
            </button>
          )}{" "}
          {view.allowed.evidence && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                review("evidence");
              }}
            >
              Send evidence…
            </button>
          )}
        </p>
      )}
      {open === "escalate" && (
        <section aria-label="Review the escalation">
          <p>
            PayPal will decide the case from both sides&apos; evidence. After this you can send
            evidence (PayPal may take a few minutes to allow it).
          </p>
          <NoteBox note={note} onChange={editNote} />
        </section>
      )}
      {open === "evidence" && !packet && <p>Build an evidence packet above first.</p>}
      {open === "evidence" && packet && (
        <section aria-label="Review the evidence">
          <p>
            <label>
              Evidence type{" "}
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  setTicked(false);
                }}
              >
                {view.evidenceTypes.map((option) => (
                  <option key={option} value={option}>
                    {plainCode(option)}
                    {option === view.suggestedType ? " (AI suggestion)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </p>
          <NoteBox note={note} onChange={editNote} />
          <p>The files PayPal gets, from the packet built {when(packet.createdAt)}:</p>
          <ol style={{ paddingLeft: "1.4em" }}>
            {packet.files.map((file) => (
              <li key={file.name}>
                {file.exhibit === null ? "Packet" : `Exhibit ${String(file.exhibit)}`}: {file.name}{" "}
                ({sizeWords(file.bytes)})
              </li>
            ))}
          </ol>
          <p style={packet.overLimit ? { color: "#8a1c1c", fontWeight: 600 } : undefined}>
            {sizeWords(packet.totalBytes)} of {sizeWords(view.limits.maxTotalBytes)} in total.
          </p>
          {packet.newerEntries > 0 && (
            <p role="note">
              This packet was built before {packet.newerEntries} newer log{" "}
              {packet.newerEntries === 1 ? "entry" : "entries"}. Build a new packet above if they
              matter.
            </p>
          )}
        </section>
      )}
      {open !== undefined && (
        <>
          <p>
            <label>
              <input
                type="checkbox"
                checked={ticked}
                onChange={() => {
                  setTicked(!ticked);
                }}
              />{" "}
              {open === "escalate"
                ? "I have read this note; send it to PayPal"
                : "I have checked everything above; send it to PayPal"}
            </label>
          </p>
          <button
            type="button"
            disabled={!canSubmit || (open === "evidence" && (packet === null || packet.overLimit))}
            onClick={onSend}
          >
            {busy ? "Sending…" : open === "escalate" ? "Escalate" : "Send to PayPal"}
          </button>{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(undefined);
            }}
          >
            Cancel
          </button>
        </>
      )}
      {view.actions.length > 0 && (
        <>
          <h4>Sent so far</h4>
          <ul>
            {view.actions.map((action) => (
              <PastAction
                key={action.id}
                action={action}
                busy={busy}
                onResend={(id) => {
                  run(() => resendAction(dealId, disputeId, id));
                }}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
