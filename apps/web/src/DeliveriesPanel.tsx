import { useEffect, useState } from "react";
import {
  deliveryFileUrl,
  emailDeliveryAgain,
  getDeliveries,
  openDelivery,
  type DealSummary,
  type DeliveriesView,
  type DeliveryView,
} from "./api";
import { DeliverPanel } from "./DeliverPanel";
import { when } from "./format";
import { WRAP } from "./styles";

const sizeOf = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${String(Math.ceil(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** What the evidence log says about one delivery, in a sentence. */
function AccessLine({ delivery }: { delivery: DeliveryView }) {
  const { access } = delivery;
  const opened =
    access.opened.lastAt === null
      ? "Not opened by the buyer yet."
      : `Opened by the buyer ${String(access.opened.count)}× (last ${when(access.opened.lastAt)}).`;
  const downloads = delivery.files
    .map((f) => `${f.filename} downloaded ${String(access.downloads[f.id]?.count ?? 0)}×`)
    .join("; ");
  const emailed = access.emailedAt === null ? "Not emailed." : `Emailed ${when(access.emailedAt)}.`;
  return (
    <p>
      {emailed} {opened} {downloads}.
    </p>
  );
}

/**
 * Deliveries of a signed deal. The seller delivers work and sees what the buyer opened and
 * downloaded; the buyer opens each delivery (which is recorded) and downloads its files (each
 * download recorded with the file's fingerprint). Re-read when the deal's status changes.
 */
export function DeliveriesPanel({ deal, onChange }: { deal: DealSummary; onChange: () => void }) {
  const [view, setView] = useState<DeliveriesView | undefined>();
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  useEffect(() => {
    getDeliveries(deal.id).then(setView, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load the deliveries.");
    });
  }, [deal.id, deal.status]);

  if (!view?.signed) return null;
  const seller = deal.role === "seller";
  const show = (updated: DeliveriesView) => {
    setView(updated);
    onChange();
  };
  const run = (work: Promise<DeliveriesView>, then?: () => void) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (updated) => {
        setBusy(false);
        then?.();
        show(updated);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  };

  return (
    <section aria-labelledby="deliveries">
      <h3 id="deliveries">Deliveries</h3>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {view.deliveries.length === 0 && <p>Nothing delivered yet.</p>}
      {view.deliveries.map((delivery) => {
        // Opened before (the evidence log says so) or just now: the files show, also after a reload.
        const visible = seller || opened.has(delivery.id) || delivery.access.opened.count > 0;
        return (
          <article key={delivery.id} aria-label={`Delivery for stage ${String(delivery.stage)}`}>
            <h4>
              Stage {delivery.stage}: {delivery.stageTitle} · sent {when(delivery.sentAt)}
            </h4>
            {!visible && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  run(openDelivery(deal.id, delivery.id), () => {
                    setOpened(new Set([...opened, delivery.id]));
                  });
                }}
              >
                Open delivery
              </button>
            )}
            {visible && (
              <>
                {delivery.message !== null && (
                  <p style={WRAP}>Message: &ldquo;{delivery.message}&rdquo;</p>
                )}
                <ul>
                  {delivery.files.map((file) => (
                    <li key={file.id} style={WRAP}>
                      <a href={deliveryFileUrl(deal.id, delivery.id, file.id)} download>
                        Download {file.filename}
                      </a>{" "}
                      ({sizeOf(file.sizeBytes)}){" "}
                      <code title="Fingerprint (SHA-256)">{file.sha256.slice(0, 12)}…</code>
                    </li>
                  ))}
                </ul>
                {!seller && <p>Each download is recorded with the file&apos;s fingerprint.</p>}
              </>
            )}
            {seller && <AccessLine delivery={delivery} />}
            {seller && view.emailOn && delivery.access.emailCount < 3 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  run(emailDeliveryAgain(deal.id, delivery.id));
                }}
              >
                Email the delivery again
              </button>
            )}
          </article>
        );
      })}
      {seller && <DeliverPanel dealId={deal.id} stages={view.stages} onSent={show} />}
    </section>
  );
}
