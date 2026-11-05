import { sizeWords } from "@pactpal/words";
import { useEffect, useState } from "react";
import {
  buildPacket,
  getPacketView,
  packetFileUrl,
  type PacketChoice,
  type PacketView,
} from "./api";
import { when } from "./format";

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

/**
 * The evidence packet (5e): every document PactPal can send PayPal for this dispute, ticked by
 * default, with PayPal's size limits; "Build the packet" writes the packet PDF from the record and
 * keeps it with its fingerprint. Nothing is sent to PayPal from here.
 */
export function PacketPanel({ dealId, disputeId }: { dealId: string; disputeId: string }) {
  const [view, setView] = useState<PacketView | undefined>();
  const [unticked, setUnticked] = useState<ReadonlySet<string>>(new Set());
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const load = () => {
    getPacketView(dealId, disputeId).then(setView, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load the packet.");
    });
  };
  useEffect(load, [dealId, disputeId]);

  if (view === undefined) return problem ? <p role="alert">{problem}</p> : null;
  const sendable = view.exhibits.filter((e) => e.send !== "left-out");
  const chosen = sendable.filter((e) => !unticked.has(e.id));
  const total = chosen.reduce((sum, e) => sum + (e.sentBytes ?? 0), 0);
  const largest = Math.max(0, ...chosen.map((e) => e.sentBytes ?? 0));
  const over = total > view.meter.maxTotalBytes;

  const toggle = (id: string) => {
    const next = new Set(unticked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setUnticked(next);
  };
  const onBuild = () => {
    setBusy(true);
    setProblem(undefined);
    buildPacket(dealId, disputeId, [...unticked]).then(
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

  return (
    <section aria-labelledby="packet">
      <h3 id="packet">Evidence packet</h3>
      <p>
        PactPal writes a packet PDF from the deal&apos;s record (cover, timeline, every file&apos;s
        fingerprint and the log&apos;s seal) and adds these documents. Untick any you do not want to
        send. <strong>Nothing goes to PayPal from here.</strong>
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
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
            </label>
          </li>
        ))}
      </ul>
      <p style={over ? { color: "#8a1c1c", fontWeight: 600 } : undefined}>
        {sizeWords(total)} of {sizeWords(view.meter.maxTotalBytes)} in total; largest file{" "}
        {sizeWords(largest)} of {sizeWords(view.meter.maxFileBytes)}. The packet PDF itself is added
        on top (usually well under 1 MB).
      </p>
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
                {sizeWords(packet.packetBytes)}; {sizeWords(packet.totalBytes)} with its exhibits){" "}
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
