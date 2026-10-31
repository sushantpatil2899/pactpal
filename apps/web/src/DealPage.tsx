import { useEffect, useState } from "react";
import { BuyerPanel } from "./BuyerPanel";
import {
  checkLedger,
  getDeal,
  getLedger,
  type DealSummary,
  type LedgerCheck,
  type LedgerEntryView,
} from "./api";

/** Plain words for the evidence log's event types; unknown types are shown as they are. */
const EVENT_LABELS: Record<string, string> = {
  DEAL_CREATED: "Deal created",
  BUYER_ADDED: "Buyer added",
  SOURCE_ADDED: "Source added",
  DELIVERABLE_ADDED: "Delivery file added",
  SCOPE_CONFIRMED: "Agreed work confirmed",
  ACCEPTED: "Buyer accepted",
  NOTE_ADDED: "Note added",
};

const when = (iso: string) =>
  `${new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`;

const who = (entry: LedgerEntryView) =>
  entry.actor === "system" ? "PactPal" : (entry.actorName ?? entry.actor);

/** One deal and its evidence log, with a button that re-checks every fingerprint. */
export function DealPage({ dealId }: { dealId: string }) {
  const [deal, setDeal] = useState<DealSummary | undefined>();
  const [entries, setEntries] = useState<LedgerEntryView[] | undefined>();
  const [check, setCheck] = useState<LedgerCheck | undefined>();
  const [problem, setProblem] = useState<string | undefined>();

  useEffect(() => {
    Promise.all([getDeal(dealId), getLedger(dealId)]).then(
      ([found, log]) => {
        setDeal(found);
        setEntries(log);
      },
      () => {
        setProblem("This deal was not found, or you cannot see it.");
      },
    );
  }, [dealId]);

  const onCheck = () => {
    setCheck(undefined);
    checkLedger(dealId).then(setCheck, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not check the log.");
    });
  };

  if (problem) {
    return (
      <p role="alert" style={{ color: "#8a1c1c" }}>
        {problem} <a href="/">Back to your deals</a>
      </p>
    );
  }
  if (!deal || !entries) return <p aria-busy="true">Loading the deal…</p>;
  return (
    <>
      <p>
        <a href="/">← Your deals</a>
      </p>
      <h2>{deal.title}</h2>
      <p>
        {deal.categoryLabel} · {deal.currency} · status: {deal.status} · you are the {deal.role}
        {!deal.hasBuyer && " · no buyer added yet"}
      </p>
      {deal.seller && <p>Seller: {deal.seller.name}</p>}
      {deal.role === "seller" && (
        <BuyerPanel
          deal={deal}
          onDealChange={(updated) => {
            setDeal(updated);
            getLedger(dealId).then(setEntries, () => undefined);
          }}
        />
      )}
      <section aria-labelledby="evidence-log">
        <h3 id="evidence-log">Evidence log</h3>
        <ol>
          {entries.map((entry) => (
            <li key={entry.seq}>
              {EVENT_LABELS[entry.type] ?? entry.type} by {who(entry)}, {when(entry.serverTime)}{" "}
              <code title="This entry's fingerprint">{entry.entryHash.slice(0, 12)}…</code>
            </li>
          ))}
        </ol>
        <button type="button" onClick={onCheck}>
          Check this log
        </button>
        {check?.status === "unchanged" && (
          <p role="status">
            Unchanged:{" "}
            {check.entries === 1
              ? "the 1 entry matches its fingerprint"
              : `all ${String(check.entries)} entries match their fingerprints`}{" "}
            (latest <code>{check.latestFingerprint.slice(0, 12)}…</code>).
          </p>
        )}
        {check?.status === "changed" && (
          <p role="alert" style={{ color: "#8a1c1c" }}>
            Changed at entry {check.atEntry + 1}: {check.reason}.
          </p>
        )}
      </section>
    </>
  );
}
