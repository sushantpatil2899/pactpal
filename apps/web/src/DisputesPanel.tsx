import { plainCode } from "@pactpal/words";
import { useEffect, useState } from "react";
import { getDisputes, type DealSummary, type DisputesView } from "./api";
import { CheckNow } from "./DisputeCheck";
import { disputePageUrl } from "./DisputePage";
import { when } from "./format";
import { SCROLL_X } from "./styles";

const words = (code: string | null): string => (code === null ? "—" : plainCode(code));

/**
 * The seller's disputes on this deal, found by checking their PayPal disputes every few minutes,
 * and "Check now"; each opens its own page. Seller only: the buyer deals with a dispute in PayPal.
 */
export function DisputesPanel({ deal, onChange }: { deal: DealSummary; onChange: () => void }) {
  const [view, setView] = useState<DisputesView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();

  const load = () =>
    getDisputes(deal.id).then(
      (next) => {
        setView(next);
        return next;
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load the disputes.");
        return undefined;
      },
    );
  useEffect(() => {
    void load();
    // Loaded once per deal; "Check now" reads again.
  }, [deal.id]);

  if (deal.role !== "seller" || view === undefined) return null;
  return (
    <section aria-labelledby="disputes">
      <h3 id="disputes">Disputes</h3>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {view.disputes.length === 0 ? (
        <p>No PayPal dispute on this deal.</p>
      ) : (
        <div style={SCROLL_X}>
          <table>
            <thead>
              <tr>
                <th scope="col">PayPal dispute</th>
                <th scope="col">Reason</th>
                <th scope="col">Where it stands</th>
                <th scope="col">Respond by</th>
              </tr>
            </thead>
            <tbody>
              {view.disputes.map((dispute) => (
                <tr key={dispute.disputeId}>
                  <td>
                    <a href={disputePageUrl(deal.id, dispute.disputeId)}>{dispute.disputeId}</a>
                    {dispute.stage === null ? "" : ` (stage ${String(dispute.stage)})`}
                    {dispute.amount === null
                      ? ""
                      : `, ${dispute.amount.text} ${dispute.amount.currency}`}
                  </td>
                  <td>{words(dispute.reason)}</td>
                  <td>
                    {words(dispute.status)}
                    {dispute.paypalStage === null ? "" : ` (${words(dispute.paypalStage)})`}
                    {dispute.outcome === null ? "" : `: ${words(dispute.outcome)}`}
                  </td>
                  <td>{dispute.sellerDueAt === null ? "—" : when(dispute.sellerDueAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CheckNow
        dealId={deal.id}
        lastCheck={view.lastCheck}
        canCheck={view.canCheck}
        reload={load}
        onDone={onChange}
      />
    </section>
  );
}
