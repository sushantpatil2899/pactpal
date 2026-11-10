import { sizeWords } from "@pactpal/words";
import { useEffect, useRef, useState } from "react";
import {
  buildPacket,
  draftSummary,
  getPacketView,
  getSummaries,
  packetFileUrl,
  type PacketChoice,
  type PacketSummariesView,
  type PacketView,
} from "./api";
import { when } from "./format";
import { PacketSummary } from "./PacketSummary";
import { useCouncilJobs } from "./useCouncilJobs";

const ADDED_BY = {
  seller: "added by you",
  buyer: "added by the buyer",
  system: "made by PactPal",
} as const;
const LEFT_OUT = {
  type: "PayPal does not accept this type",
  "too-large": "over PayPal's 10 MB a file",
  unticked: "left out",
} as const;

/** How one document goes to PayPal, in a few words. */
function howSent(choice: PacketChoice): string {
  if (choice.send === "left-out") return LEFT_OUT[choice.reason ?? "unticked"];
  const size = choice.sentBytes === null ? "" : `, ${sizeWords(choice.sentBytes)}`;
  return choice.send === "text-as-pdf" ? `text, sent as a PDF${size}` : `sent as it is${size}`;
}

/** The AI's suggestion for one document, beside its tick box; the seller decides. */
function AiPick({ pick }: { pick: { use: boolean; why: string } | undefined }) {
  if (pick === undefined) return null;
  return (
    <small style={{ display: "block", marginLeft: "1.6em" }}>
      AI: {pick.use ? "send" : "leave out"}
      {pick.why === "" ? "" : ` (${pick.why})`}
    </small>
  );
}

/**
 * The evidence packet (5e): every document PactPal can send PayPal for this dispute, ticked by
 * default, with PayPal's size limits; "Build the packet" writes the packet PDF from the record and
 * keeps it with its fingerprint. The AI summary (5f) suggests picks the seller can take, and its
 * checked comparison and summary go in only when the seller ticks that they checked them.
 * Nothing is sent to PayPal from here.
 */
export function PacketPanel({
  dealId,
  disputeId,
  comparisonsDone = 0,
}: {
  dealId: string;
  disputeId: string;
  /** Bumped when a comparison finishes, so whether a summary can be drafted is read again. */
  comparisonsDone?: number;
}) {
  const [view, setView] = useState<PacketView | undefined>();
  const [unticked, setUnticked] = useState<ReadonlySet<string>>(new Set());
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [drafting, setDrafting] = useState(false);
  /** The summary the seller ticked as checked; a newer summary needs a new tick. */
  const [checkedId, setCheckedId] = useState<string | undefined>();
  const summaries = useCouncilJobs(
    `${dealId}/${disputeId}/${String(comparisonsDone)}`,
    () => getSummaries(dealId, disputeId),
    (next: PacketSummariesView) => next.summaries[0]?.status === "running",
    "summary",
  );

  /** Pasted buyer claims already unticked once, so a later reload keeps the seller's choice. */
  const seenPasted = useRef<ReadonlySet<string>>(new Set());
  const load = () => {
    getPacketView(dealId, disputeId).then(
      (next) => {
        const fresh = next.exhibits
          .filter((e) => e.pastedClaim === true && !seenPasted.current.has(e.id))
          .map((e) => e.id);
        if (fresh.length > 0) {
          seenPasted.current = new Set([...seenPasted.current, ...fresh]);
          setUnticked((now) => new Set([...now, ...fresh]));
        }
        setView(next);
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load the packet.");
      },
    );
  };
  // Read again when a comparison finishes: a claim pasted for it is a new document.
  useEffect(load, [dealId, disputeId, comparisonsDone]);

  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  const sendable = view.exhibits.filter((e) => e.send !== "left-out");
  const chosen = sendable.filter((e) => !unticked.has(e.id));
  const total = chosen.reduce((sum, e) => sum + (e.sentBytes ?? 0), 0);
  const largest = Math.max(0, ...chosen.map((e) => e.sentBytes ?? 0));
  const over = total > view.meter.maxTotalBytes;
  const latest = summaries.view?.summaries[0];
  const ready = latest?.status === "ready" && latest.summary !== null ? latest : undefined;
  const picks = new Map(ready?.summary?.exhibits.map((pick) => [pick.id, pick]));
  const includeAi =
    ready !== undefined && ready.basedOn !== null && checkedId === ready.id
      ? { analysisId: ready.basedOn, summaryId: ready.id }
      : undefined;

  const toggle = (id: string) => {
    const next = new Set(unticked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setUnticked(next);
  };
  const onBuild = () => {
    setBusy(true);
    setProblem(undefined);
    buildPacket(dealId, disputeId, [...unticked], includeAi).then(
      () => {
        setBusy(false);
        load();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not build the packet.");
      },
    );
  };

  const onDraft = () => {
    setDrafting(true);
    summaries.setProblem(undefined);
    draftSummary(dealId, disputeId).then(
      (next) => {
        setDrafting(false);
        summaries.show(next);
      },
      (error: unknown) => {
        setDrafting(false);
        summaries.setProblem(
          error instanceof Error ? error.message : "Could not start the summary.",
        );
      },
    );
  };
  const useAiPicks = () => {
    setUnticked(new Set([...picks.values()].filter((pick) => !pick.use).map((pick) => pick.id)));
  };

  return (
    <section aria-labelledby="packet">
      <h3 id="packet">Evidence packet</h3>
      <p>
        PactPal writes a packet PDF from the deal&apos;s record (cover, timeline, every file&apos;s
        fingerprint and the log&apos;s seal) and adds these documents. Untick any you do not want to
        send. <strong>Nothing goes to PayPal from here.</strong>
      </p>
      {summaries.view !== undefined && (
        <PacketSummary view={summaries.view} busy={drafting} onDraft={onDraft} />
      )}
      {[problem, summaries.problem].map(
        (text) =>
          text !== undefined && (
            <p key={text} role="alert" data-tone="problem">
              {text}
            </p>
          ),
      )}
      <h4>Documents</h4>
      {picks.size > 0 && (
        <button type="button" onClick={useAiPicks}>
          Use the AI&apos;s picks
        </button>
      )}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {view.exhibits.map((choice) => (
          <li key={choice.id}>
            <label>
              <input
                type="checkbox"
                checked={choice.send !== "left-out" && !unticked.has(choice.id)}
                disabled={choice.send === "left-out"}
                onChange={() => {
                  toggle(choice.id);
                }}
              />{" "}
              {choice.filename} ({ADDED_BY[choice.addedBy]}; {howSent(choice)})
              {choice.pastedClaim === true && (
                <small> The buyer&apos;s claim you pasted; left out unless you tick it.</small>
              )}
            </label>
            <AiPick pick={picks.get(choice.id)} />
          </li>
        ))}
      </ul>
      <p style={over ? { color: "var(--color-alert-ink)", fontWeight: 600 } : undefined}>
        {sizeWords(total)} of {sizeWords(view.meter.maxTotalBytes)} in total; largest file{" "}
        {sizeWords(largest)} of {sizeWords(view.meter.maxFileBytes)}. The packet PDF itself is added
        on top (usually well under 1 MB).
      </p>
      {ready !== undefined && (
        <p>
          <label>
            <input
              type="checkbox"
              checked={includeAi !== undefined}
              onChange={() => {
                setCheckedId(includeAi === undefined ? ready.id : undefined);
              }}
            />{" "}
            Put the AI comparison and summary in the packet (I have checked them)
          </label>
        </p>
      )}
      <button type="button" disabled={busy || over} onClick={onBuild}>
        {busy ? "Building…" : "Build the packet"}
      </button>
      {view.packets.length > 0 && (
        <>
          <h4>Packets built</h4>
          <ul>
            {view.packets.map((packet) => (
              <li key={packet.id}>
                {when(packet.createdAt)}:{" "}
                <a href={packetFileUrl(dealId, disputeId, packet.id)}>packet PDF</a> (
                {sizeWords(packet.packetBytes)}; {sizeWords(packet.totalBytes)} with its exhibits
                {packet.summaryId === null ? "" : "; with the AI comparison and summary"}){" "}
                <code title="The packet's fingerprint (SHA-256)">
                  {packet.packetSha256.slice(0, 12)}…
                </code>
                <ul>
                  {packet.exhibits.flatMap((exhibit) =>
                    exhibit.number === undefined
                      ? []
                      : [
                          <li key={exhibit.id}>
                            <a href={packetFileUrl(dealId, disputeId, packet.id, exhibit.number)}>
                              Exhibit {exhibit.number}: {exhibit.filename}
                            </a>
                          </li>,
                        ],
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
