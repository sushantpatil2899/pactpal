import { answerFacts, plainCode, sizeWords } from "@pactpal/words";
import { useEffect, useState } from "react";
import {
  acceptDisputeClaim,
  escalateDispute,
  getDisputeActions,
  makeRefundOffer,
  resendAction,
  sendDisputeMessage,
  sendEvidence,
  textFingerprint,
  type DisputeActionView,
  type DisputeActionsView,
} from "./api";
import { when } from "./format";

/** PayPal's longest note or message for an answer. */
const MAX_NOTE_CHARS = 2000;

type Kind = DisputeActionView["kind"];

/** Each send: how it is listed, its button, its send button and what the seller confirms. */
const KINDS: Record<
  Kind,
  { words: string; open: string; send: string; tick: string; note: string; paypal: string }
> = {
  message: {
    words: "Message to the buyer",
    open: "Message the buyer…",
    send: "Send message",
    tick: "I have read this message; send it to the buyer through PayPal",
    note: "Message to the buyer",
    paypal: "send_message",
  },
  offer: {
    words: "Refund offer",
    open: "Offer a refund…",
    send: "Make offer",
    tick: "I have checked the amount and the note; send the offer through PayPal",
    note: "Note with the offer",
    paypal: "make_offer",
  },
  accept: {
    words: "Claim accepted",
    open: "Accept the claim…",
    send: "Accept the claim",
    tick: "I have read this note; send it to PayPal",
    note: "Note to PayPal",
    paypal: "accept_claim",
  },
  escalate: {
    words: "Escalation",
    open: "Escalate to PayPal…",
    send: "Escalate",
    tick: "I have read this note; send it to PayPal",
    note: "Note to PayPal",
    paypal: "escalate",
  },
  evidence: {
    words: "Evidence",
    open: "Send evidence…",
    send: "Send to PayPal",
    tick: "I have checked everything above; send it to PayPal",
    note: "Note to PayPal",
    paypal: "provide_evidence",
  },
};
const ORDER: readonly Kind[] = ["message", "offer", "accept", "escalate", "evidence"];

const STATUS_WORDS = {
  sending: "being sent",
  sent: "sent to PayPal",
  unknown: "PayPal may have received it: check the dispute before sending again",
  refused: "not sent",
} as const;

const money = (amount: { minor: number; currency: string }) =>
  `${(amount.minor / 100).toFixed(2)} ${amount.currency}`;

/** "60.00" as minor units (6000), or undefined when it is not an amount with at most 2 decimals. */
function minorOf(text: string): number | undefined {
  const match = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(text.trim());
  if (!match) return undefined;
  return Number(match[1]) * 100 + Number((match[2] ?? "0").padEnd(2, "0"));
}

/** What one past send was, in a few words. */
function sentWords(action: DisputeActionView): string {
  if (action.kind === "evidence") {
    const files = action.files.length;
    return ` (${plainCode(action.evidenceType ?? "OTHER")}; ${String(files)} file${files === 1 ? "" : "s"}, ${sizeWords(action.totalBytes)})`;
  }
  return action.amount === null ? "" : ` (${money(action.amount)})`;
}

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
  return (
    <li>
      {when(action.createdAt)}: {KINDS[action.kind].words}
      {sentWords(action)} — {STATUS_WORDS[action.status]}
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

/** A tick box the seller must check; changing it calls `onChange`. */
function Tick({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: string;
}) {
  return (
    <p>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} /> {children}
      </label>
    </p>
  );
}

/** The note box with its character count; editing it clears the confirmation. */
function NoteBox({
  label,
  note,
  onChange,
}: {
  label: string;
  note: string;
  onChange: (note: string) => void;
}) {
  return (
    <p>
      <label>
        {label} ({note.length} of {MAX_NOTE_CHARS} characters)
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

/** The AI draft each review starts from (5f's note, 5h's message or offer note), if any. */
function draftFor(kind: Kind, view: DisputeActionsView): string {
  switch (kind) {
    case "message":
      return view.draftMessage ?? "";
    case "offer":
      return view.draftOfferNote ?? "";
    case "accept":
      return "";
    case "escalate":
    case "evidence":
      return view.draftNote ?? "";
  }
}

/** The evidence review: the type, and every file with its size and the total. */
function EvidenceFiles({
  view,
  type,
  onType,
}: {
  view: DisputeActionsView;
  type: string;
  onType: (type: string) => void;
}) {
  const { packet } = view;
  if (!packet) return <p>Build an evidence packet above first.</p>;
  return (
    <>
      <p>
        <label>
          Evidence type{" "}
          <select
            value={type}
            onChange={(event) => {
              onType(event.target.value);
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
      <p>The files PayPal gets, from the packet built {when(packet.createdAt)}:</p>
      <ol style={{ paddingLeft: "1.4em" }}>
        {packet.files.map((file) => (
          <li key={file.name}>
            {file.exhibit === null ? "Packet" : `Exhibit ${String(file.exhibit)}`}: {file.name} (
            {sizeWords(file.bytes)})
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
    </>
  );
}

/**
 * Sending to PayPal: messaging the buyer, offering a refund, accepting the claim (5h), escalating
 * and sending evidence (5g), each on a review screen that shows exactly what will go. Nothing is
 * sent until the seller ticks the box (two for accepting) and presses the button; the AI drafts
 * are only starting points, and the amounts and what happens are written by code.
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
  const [open, setOpen] = useState<Kind | undefined>();
  const [note, setNote] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [ticked, setTicked] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const load = () => {
    getDisputeActions(dealId, disputeId).then(setView, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load what can be sent.");
    });
  };
  useEffect(load, [dealId, disputeId]);

  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  const { packet, disputed } = view;

  // The review starts from what is current now: the newest packet, drafts and PayPal's state may
  // have changed since this section loaded (a draft made or a packet built above).
  const review = (kind: Kind) => {
    setBusy(true);
    setProblem(undefined);
    getDisputeActions(dealId, disputeId).then(
      (fresh) => {
        setView(fresh);
        setBusy(false);
        setOpen(kind);
        setNote(draftFor(kind, fresh));
        setType(fresh.suggestedType ?? fresh.evidenceTypes[0] ?? "OTHER");
        setAmount("");
        setTicked(false);
        setUnderstood(false);
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
  const minor = minorOf(amount);
  const offerOk = disputed !== null && minor !== undefined && minor > 0 && minor <= disputed.minor;
  const onSend = () => {
    run(async () => {
      const confirmed = { note, noteSha256: await textFingerprint(note) };
      switch (open) {
        case "message":
          return sendDisputeMessage(dealId, disputeId, confirmed);
        case "offer":
          if (!disputed || minor === undefined) throw new Error("Type the amount to offer.");
          return makeRefundOffer(dealId, disputeId, {
            ...confirmed,
            amount: { minor, currency: disputed.currency },
          });
        case "accept":
          return acceptDisputeClaim(dealId, disputeId, confirmed);
        case "escalate":
          return escalateDispute(dealId, disputeId, confirmed);
        case "evidence":
        case undefined:
          if (!packet) throw new Error("Build a packet first.");
          return sendEvidence(dealId, disputeId, {
            ...confirmed,
            packetId: packet.id,
            packetSha256: packet.packetSha256,
            evidenceType: type,
          });
      }
    });
  };
  const editNote = (next: string) => {
    setNote(next);
    setTicked(false);
  };
  const ready =
    ticked &&
    !busy &&
    note.trim() !== "" &&
    (open !== "evidence" || (packet !== null && !packet.overLimit)) &&
    (open !== "offer" || offerOk) &&
    (open !== "accept" || understood);

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
        <p style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
          {ORDER.filter((kind) => view.allowed[kind]).map((kind) => (
            <button
              key={kind}
              type="button"
              disabled={busy}
              onClick={() => {
                review(kind);
              }}
            >
              {KINDS[kind].open}
            </button>
          ))}
        </p>
      )}
      {open !== undefined && (
        <section aria-label={`Review: ${KINDS[open].words}`}>
          {open === "escalate" && (
            <p>
              PayPal will decide the case from both sides&apos; evidence. After this you can send
              evidence (PayPal may take a few minutes to allow it).
            </p>
          )}
          {open !== "evidence" && open !== "escalate" && (
            <p>
              <strong>{answerFacts(KINDS[open].paypal, disputed?.words ?? null)}</strong>
            </p>
          )}
          {open === "evidence" && (
            <EvidenceFiles
              view={view}
              type={type}
              onType={(next) => {
                setType(next);
                setTicked(false);
              }}
            />
          )}
          {open === "offer" && disputed && (
            <p>
              <label>
                Refund amount ({disputed.currency}, up to {money(disputed)}){" "}
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setTicked(false);
                  }}
                  style={{ width: "8em" }}
                />
              </label>
              {amount !== "" && !offerOk && (
                <span role="alert"> Type an amount above 0 and at most {money(disputed)}.</span>
              )}
            </p>
          )}
          <NoteBox label={KINDS[open].note} note={note} onChange={editNote} />
          <Tick
            checked={ticked}
            onChange={() => {
              setTicked(!ticked);
            }}
          >
            {KINDS[open].tick}
          </Tick>
          {open === "accept" && (
            <Tick
              checked={understood}
              onChange={() => {
                setUnderstood(!understood);
              }}
            >
              {`I understand PayPal refunds the buyer ${disputed?.words ?? "the disputed amount"} from my account and closes the case`}
            </Tick>
          )}
          <button type="button" disabled={!ready} onClick={onSend}>
            {busy ? "Sending…" : KINDS[open].send}
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
        </section>
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
