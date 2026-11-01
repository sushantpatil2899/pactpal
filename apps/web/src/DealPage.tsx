import { useEffect, useState } from "react";
import { AcceptancePanel } from "./AcceptancePanel";
import { BuyerPanel } from "./BuyerPanel";
import { DraftPanel } from "./DraftPanel";
import type { DraftFill } from "./draft-fill";
import { when } from "./format";
import { FilesPanel } from "./FilesPanel";
import { ScopePanel } from "./ScopePanel";
import {
  SIGN_IN_PATH,
  checkLedger,
  getMe,
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
  SCOPE_VERSIONED: "Agreed work saved",
  SCOPE_DRAFTED: "AI draft made",
  SCOPE_CONFIRMED: "Agreed work confirmed from an AI draft",
  ACCEPTANCE_REQUESTED: "Sent to the buyer for acceptance",
  ACCEPTANCE_WITHDRAWN: "Acceptance request withdrawn",
  ACCEPTED: "Buyer signed",
  DECLINED: "Buyer declined",
  NOTE_ADDED: "Note added",
};

/** The entry's label; a saved version names its number, an added file its name. */
function labelOf(entry: LedgerEntryView): string {
  const label = EVENT_LABELS[entry.type] ?? entry.type;
  const { payload } = entry;
  const field = (name: string): unknown =>
    typeof payload === "object" && payload !== null && name in payload
      ? (payload as Record<string, unknown>)[name]
      : undefined;
  const version = field("version");
  const filename = field("filename");
  if (typeof version === "number") return `${label} (version ${String(version)})`;
  return typeof filename === "string" ? `${label}: ${filename}` : label;
}

const who = (entry: LedgerEntryView) =>
  entry.actor === "system" ? "PactPal" : (entry.actorName ?? entry.actor);

/** One deal and its evidence log, with a button that re-checks every fingerprint. */
export function DealPage({ dealId }: { dealId: string }) {
  const [deal, setDeal] = useState<DealSummary | undefined>();
  const [entries, setEntries] = useState<LedgerEntryView[] | undefined>();
  const [check, setCheck] = useState<LedgerCheck | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [linkOnly, setLinkOnly] = useState(false);
  const [fill, setFill] = useState<DraftFill | undefined>();
  // Changes each time the agreed work is saved, so the acceptance preview is read again.
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    Promise.all([getDeal(dealId), getLedger(dealId), getMe()]).then(
      ([found, log, me]) => {
        setDeal(found);
        setEntries(log);
        setLinkOnly(me !== null && me.access !== "full");
      },
      () => {
        setProblem("This deal was not found, or you cannot see it.");
      },
    );
  }, [dealId]);

  const refreshLog = () => {
    getLedger(dealId).then(setEntries, () => undefined);
  };
  /** The deal's status and the log, after a step that changes them. */
  const refreshDeal = () => {
    getDeal(dealId).then(setDeal, () => undefined);
    refreshLog();
  };

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
      {linkOnly && (
        <p>
          You opened this deal with a link.{" "}
          <a href={`${SIGN_IN_PATH}?return=${encodeURIComponent(`/deals/${deal.id}`)}`}>
            Sign in with PayPal
          </a>{" "}
          to keep access without it (use the PayPal account with the email the link was sent to).
        </p>
      )}
      {deal.role === "buyer" && (
        <AcceptancePanel deal={deal} revision={revision} onChange={refreshDeal} />
      )}
      {deal.role === "seller" && (
        <BuyerPanel
          deal={deal}
          onDealChange={(updated) => {
            setDeal(updated);
            refreshLog();
          }}
        />
      )}
      {deal.role === "seller" && !linkOnly && (
        <DraftPanel
          dealId={deal.id}
          canDraft={deal.status === "draft"}
          dealCategory={deal.categoryLabel}
          onUse={setFill}
          onLogChange={refreshLog}
        />
      )}
      {/* While the buyer is asked to sign, the acceptance page above is their one view of the terms. */}
      {(deal.role === "seller" || deal.status !== "awaiting_acceptance") && (
        <ScopePanel
          dealId={deal.id}
          currency={deal.currency}
          canEdit={deal.role === "seller" && deal.status === "draft"}
          fill={fill}
          onClearFill={() => {
            setFill(undefined);
          }}
          onSaved={() => {
            setFill(undefined);
            setRevision((n) => n + 1);
            refreshLog();
          }}
        />
      )}
      {deal.role === "seller" && (
        <AcceptancePanel deal={deal} revision={revision} onChange={refreshDeal} />
      )}
      <FilesPanel
        dealId={deal.id}
        canAdd={deal.role === "seller" && !linkOnly}
        onAdded={refreshLog}
      />
      <section aria-labelledby="evidence-log">
        <h3 id="evidence-log">Evidence log</h3>
        <ol>
          {entries.map((entry) => (
            <li key={entry.seq}>
              {labelOf(entry)} by {who(entry)}, {when(entry.serverTime)}{" "}
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
