import { useEffect, useState, type FormEvent } from "react";
import { AcceptanceDocument } from "./AcceptanceDocument";
import {
  acceptTerms,
  declineTerms,
  getAcceptance,
  requestAcceptance,
  withdrawAcceptance,
  type AcceptanceView,
  type DealSummary,
} from "./api";
import { when } from "./format";
import { FULL_WIDTH } from "./styles";

const textOf = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

/**
 * Sending the agreed work for acceptance, and signing it. The seller previews exactly what the
 * buyer will see, sends it (editing locks) and can withdraw; the buyer reads one page and signs
 * with a typed name, or declines with an optional reason. `revision` changes when the agreed work
 * is saved, so the preview is read again.
 */
export function AcceptancePanel({
  deal,
  revision,
  onChange,
}: {
  deal: DealSummary;
  revision: number;
  onChange: () => void;
}) {
  const [view, setView] = useState<AcceptanceView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [declining, setDeclining] = useState(false);

  const load = () => {
    setProblem(undefined);
    getAcceptance(deal.id).then(setView, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load the acceptance.");
    });
  };
  useEffect(load, [deal.id, revision]);

  /** Runs a step, then shows the new state and tells the page (status and log changed). */
  const run = (work: Promise<AcceptanceView>) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (updated) => {
        setBusy(false);
        setPreviewing(false);
        setDeclining(false);
        setView(updated);
        onChange();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  };

  if (!view) {
    return problem ? (
      <p role="alert" style={{ color: "#8a1c1c" }}>
        {problem}
      </p>
    ) : null;
  }
  const { document, documentSha256 } = view;
  const shown = document && documentSha256 !== null && (
    <AcceptanceDocument document={document} documentSha256={documentSha256} />
  );
  const alert = problem && (
    <p role="alert" style={{ color: "#8a1c1c" }}>
      {problem}{" "}
      <button type="button" onClick={load}>
        Reload
      </button>
    </p>
  );

  if (view.accepted) {
    return (
      <section aria-labelledby="acceptance">
        <h3 id="acceptance">Agreement</h3>
        <p role="status">
          Signed by {view.accepted.typedName} on {when(view.accepted.at)} (version{" "}
          {view.accepted.version}).
        </p>
        {shown && (
          <details>
            <summary>The page as it was signed</summary>
            {shown}
          </details>
        )}
      </section>
    );
  }

  if (deal.role === "buyer") {
    if (view.status !== "awaiting_acceptance" || !document || documentSha256 === null) {
      return null;
    }
    const onSign = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const typedName = textOf(new FormData(event.currentTarget).get("typedName"));
      run(acceptTerms(deal.id, { documentSha256, typedName }));
    };
    const onDecline = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const reason = textOf(new FormData(event.currentTarget).get("reason"));
      run(declineTerms(deal.id, { documentSha256, ...(reason === "" ? {} : { reason }) }));
    };
    return (
      <section aria-labelledby="acceptance">
        <h3 id="acceptance">Please review and sign</h3>
        {alert}
        {shown}
        <form onSubmit={onSign}>
          <p>
            <label>
              Type your full name{" "}
              <input name="typedName" required minLength={2} maxLength={200} autoComplete="name" />
            </label>
          </p>
          <button type="submit" disabled={busy}>
            I agree and sign
          </button>{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setDeclining(!declining);
            }}
          >
            Decline
          </button>
        </form>
        {declining && (
          <form onSubmit={onDecline}>
            <p>
              <label>
                Why are you declining? (optional; the seller sees this)
                <textarea name="reason" maxLength={1000} rows={3} style={FULL_WIDTH} />
              </label>
            </p>
            <button type="submit" disabled={busy}>
              Send my decline
            </button>
          </form>
        )}
      </section>
    );
  }

  // The seller.
  if (view.status === "awaiting_acceptance") {
    return (
      <section aria-labelledby="acceptance">
        <h3 id="acceptance">Acceptance</h3>
        {alert}
        <p role="status">
          Waiting for the buyer to sign version {document?.terms.version ?? "?"}. The agreed work is
          locked until they answer or you withdraw.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            run(withdrawAcceptance(deal.id));
          }}
        >
          Withdraw the request
        </button>
        {shown && (
          <details>
            <summary>What the buyer sees</summary>
            {shown}
          </details>
        )}
      </section>
    );
  }
  if (view.status !== "draft") return null;
  const missing = !document
    ? "Save the agreed work first."
    : !deal.hasBuyer
      ? "Add the buyer first."
      : undefined;
  return (
    <section aria-labelledby="acceptance">
      <h3 id="acceptance">Acceptance</h3>
      {alert}
      {view.lastDecline && (
        <p role="status">
          The buyer declined on {when(view.lastDecline.at)}
          {view.lastDecline.reason === null ? "." : `: "${view.lastDecline.reason}"`} Change the
          agreed work if needed, then send it again.
        </p>
      )}
      {missing !== undefined && <p>{missing}</p>}
      {missing === undefined && !previewing && (
        <button
          type="button"
          onClick={() => {
            setPreviewing(true);
          }}
        >
          Preview and send for acceptance
        </button>
      )}
      {missing === undefined && previewing && document && documentSha256 !== null && (
        <>
          <p>
            This is exactly what the buyer will see. After you send it, the agreed work is locked
            until the buyer answers or you withdraw. Send the buyer their link from the Buyer
            section.
          </p>
          {shown}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              run(requestAcceptance(deal.id, { version: document.terms.version, documentSha256 }));
            }}
          >
            Send to the buyer
          </button>{" "}
          <button
            type="button"
            onClick={() => {
              setPreviewing(false);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </section>
  );
}
