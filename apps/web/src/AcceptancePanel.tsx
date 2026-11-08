import { useEffect, useState } from "react";
import { AcceptanceDocument } from "./AcceptanceDocument";
import {
  acceptTerms,
  declineTerms,
  emailReceiptAgain,
  getAcceptance,
  receiptUrl,
  requestAcceptance,
  withdrawAcceptance,
  type AcceptanceView,
  type DealSummary,
} from "./api";
import { when } from "./format";
import { SignOrDecline } from "./SignOrDecline";

/**
 * When the receipt was emailed: the buyer sees their own; the seller sees both and can send it
 * again when one is missing or was lost.
 */
function ReceiptEmails({
  emails,
  role,
  busy,
  onResend,
}: {
  emails: { buyer: string | null; seller: string | null };
  role: "seller" | "buyer";
  busy: boolean;
  onResend: () => void;
}) {
  const line = (at: string | null, who: string) =>
    at === null
      ? `Receipt not emailed to ${who} yet.`
      : `Receipt emailed to ${who} on ${when(at)}.`;
  if (role === "buyer") return <p>{line(emails.buyer, "you")}</p>;
  return (
    <>
      <p>
        {line(emails.seller, "you")} {line(emails.buyer, "the buyer")}
      </p>
      <button type="button" disabled={busy} onClick={onResend}>
        Email the receipt again
      </button>
    </>
  );
}

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
        <p>
          <a href={receiptUrl(deal.id)} download>
            Download the receipt (PDF)
          </a>
        </p>
        {view.emailOn && view.receiptEmails && (
          <ReceiptEmails
            emails={view.receiptEmails}
            role={deal.role}
            busy={busy}
            onResend={() => {
              run(emailReceiptAgain(deal.id));
            }}
          />
        )}
        {alert}
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
    return (
      <section aria-labelledby="acceptance">
        <h3 id="acceptance">Please review and sign</h3>
        {alert}
        {shown}
        <SignOrDecline
          busy={busy}
          words={{
            sign: "I agree and sign",
            // The review loop (7j): asking for changes sends this version back, and the reason
            // goes into the deal's chat for both sides to talk through.
            decline: "Ask for changes",
            reasonLabel: "What should change? (optional; it goes into the chat with the seller)",
            sendDecline: "Send back for changes",
          }}
          onSign={(typedName) => {
            run(acceptTerms(deal.id, { documentSha256, typedName }));
          }}
          onDecline={(reason) => {
            run(
              declineTerms(deal.id, {
                documentSha256,
                ...(reason === undefined ? {} : { reason }),
              }),
            );
          }}
        />
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
