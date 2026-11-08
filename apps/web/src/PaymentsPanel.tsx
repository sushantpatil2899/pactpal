import { useEffect, useState } from "react";
import {
  checkPayments,
  getMilestones,
  sendInvoice,
  type DealSummary,
  type MilestonesView,
  type StageView,
} from "./api";
import { when } from "./format";
import { dateOf } from "./ScopeDetails";
import { SCROLL_X, WRAP } from "./styles";

const STATUS: Record<StageView["status"], string> = {
  not_invoiced: "Not invoiced",
  sending: "Sending did not finish",
  sent: "Invoice sent",
  paid: "Paid",
};

/** Exactly what PayPal will show the buyer, and the button that sends it. */
function Preview({
  stage,
  busy,
  onSend,
  onCancel,
}: {
  stage: StageView;
  busy: boolean;
  onSend: () => void;
  onCancel: () => void;
}) {
  const { invoice } = stage;
  if (!invoice) return null;
  return (
    <div role="group" aria-label={`Invoice for stage ${String(stage.stage)}`} style={WRAP}>
      <p>This invoice will be created and sent by PayPal (sandbox):</p>
      <ul>
        <li>To: {invoice.to}</li>
        <li>
          Amount: {stage.amount.text} {stage.amount.currency}
        </li>
        <li>Item: {invoice.itemName}</li>
        <li>Description: {invoice.description}</li>
        <li>Note: {invoice.note}</li>
      </ul>
      <p>
        {invoice.fromAccount === null ? (
          <>It will be sent from PactPal's sandbox seller account.</>
        ) : (
          <>
            It will be sent from your PayPal account <strong>{invoice.fromAccount}</strong>.
          </>
        )}{" "}
        The buyer will also get this link by email from PactPal.
      </p>
      <button type="button" disabled={busy} onClick={onSend}>
        Send to PayPal
      </button>{" "}
      <button type="button" disabled={busy} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

/**
 * The signed agreement's payment stages: each stage's status and PayPal pay link for both sides;
 * the seller previews and sends one stage's invoice at a time. The stages are read again when the
 * deal's status changes (for example once it is signed); `onChange` tells the page the log changed.
 */
export function PaymentsPanel({ deal, onChange }: { deal: DealSummary; onChange: () => void }) {
  const [view, setView] = useState<MilestonesView | undefined>();
  const [open, setOpen] = useState<number | undefined>();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  const load = () => {
    getMilestones(deal.id).then(setView, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load the payment stages.");
    });
  };
  useEffect(load, [deal.id, deal.status]);

  if (!view?.signed) return null;
  /** Runs a step that returns the new stages, then shows them and tells the page. */
  const run = (work: Promise<MilestonesView>, fallback: string) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (updated) => {
        setBusy(false);
        setOpen(undefined);
        setView(updated);
        onChange();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : fallback);
        load();
      },
    );
  };
  const onSend = (stage: StageView) => {
    if (stage.invoice) {
      run(
        sendInvoice(deal.id, stage.stage, stage.invoice.invoiceSha256),
        "Could not send the invoice.",
      );
    }
  };
  const waiting = view.stages.some((stage) => stage.status === "sent");
  const seller = deal.role === "seller";
  return (
    <section aria-labelledby="payments">
      <h3 id="payments">Payment stages</h3>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {seller && !view.invoicing && <p>PayPal invoicing is not set up on this server.</p>}
      <div style={SCROLL_X}>
        <table>
          <thead>
            <tr>
              <th scope="col">Stage</th>
              <th scope="col">Amount</th>
              <th scope="col">Due</th>
              <th scope="col">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {view.stages.map((stage) => (
              <tr key={stage.stage}>
                <td>
                  {stage.stage}. {stage.title}
                </td>
                <td>
                  {stage.amount.text} {stage.amount.currency}
                </td>
                <td>{stage.dueDate === null ? "—" : dateOf(stage.dueDate)}</td>
                <td>
                  {STATUS[stage.status]}
                  {stage.status === "paid" && stage.paidAt !== null
                    ? ` on ${when(stage.paidAt)}${stage.transactionId === null ? "" : ` (PayPal transaction ${stage.transactionId})`}`
                    : stage.sentAt !== null && ` on ${when(stage.sentAt)}`}
                  {stage.payUrl !== null && (
                    <>
                      {" "}
                      <a href={stage.payUrl} target="_blank" rel="noopener noreferrer">
                        {seller ? "View invoice on PayPal" : "View and pay on PayPal"}
                      </a>
                    </>
                  )}
                  {seller && view.invoicing && stage.invoice && open !== stage.stage && (
                    <>
                      {" "}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setOpen(stage.stage);
                        }}
                      >
                        {stage.status === "sending" ? "Try again" : "Send invoice"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {view.invoicing && waiting && (
        <p>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              run(checkPayments(deal.id), "Could not check the payments.");
            }}
          >
            Check payment status
          </button>{" "}
          Payments usually show here within a minute of paying on PayPal.
        </p>
      )}
      {view.stages
        .filter((stage) => stage.stage === open)
        .map((stage) => (
          <Preview
            key={stage.stage}
            stage={stage}
            busy={busy}
            onSend={() => {
              onSend(stage);
            }}
            onCancel={() => {
              setOpen(undefined);
            }}
          />
        ))}
    </section>
  );
}
