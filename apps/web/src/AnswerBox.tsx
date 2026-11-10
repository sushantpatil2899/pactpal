import { useState, type FormEvent } from "react";
import { approveDelivery, requestChanges, type DeliveriesView, type DeliveryView } from "./api";
import { when } from "./format";
import { Button } from "./design/parts";
import { WRAP } from "./styles";

type Revisions = NonNullable<DeliveriesView["revisions"]>;

/** Where a change request stands, or would stand, against the revisions the agreement includes. */
export function revisionWords(revision: number, included: number | null, would: boolean): string {
  const verb = would ? "would be" : "is";
  if (included === null) return "The agreement states no revision limit.";
  return revision > included
    ? `This ${verb} beyond the ${String(included)} revisions included; the seller may treat it as extra work.`
    : `This ${verb} revision ${String(revision)} of the ${String(included)} included.`;
}

/**
 * A delivery's answer: what the buyer said (both sides see it), or, for the buyer on an opened
 * delivery, the choice to approve (after a confirmation) or to request changes.
 */
export function AnswerBox({
  dealId,
  delivery,
  revisions,
  canAnswer,
  busy,
  run,
}: {
  dealId: string;
  delivery: DeliveryView;
  revisions: Revisions;
  /** The buyer, on a delivery they have opened. */
  canAnswer: boolean;
  busy: boolean;
  run: (work: Promise<DeliveriesView>) => void;
}) {
  const [mode, setMode] = useState<"none" | "approve" | "changes">("none");
  const { answer } = delivery;

  if (answer) {
    return answer.kind === "approved" ? (
      <p role="status">Approved by the buyer on {when(answer.at)}.</p>
    ) : (
      <p role="status" style={WRAP}>
        Changes requested on {when(answer.at)}.{" "}
        {revisionWords(answer.revision ?? 1, revisions.included, false)} Request: &ldquo;
        {answer.request}&rdquo;
      </p>
    );
  }
  if (!canAnswer) return <p>Waiting for the buyer&apos;s answer.</p>;

  const onChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get("request");
    run(requestChanges(dealId, delivery.id, typeof text === "string" ? text : ""));
  };
  return (
    <div>
      {mode === "none" && (
        <p className="pp-actions">
          <Button
            look="primary"
            disabled={busy}
            onClick={() => {
              setMode("approve");
            }}
          >
            Approve this delivery
          </Button>{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setMode("changes");
            }}
          >
            Request changes
          </button>
        </p>
      )}
      {mode === "approve" && (
        <p>
          Approving tells the seller this stage is done and is recorded.{" "}
          {(delivery.mattersOfTaste ?? []).length > 0 && (
            <>
              Approving this stage also accepts these matters of taste in the agreement:{" "}
              {(delivery.mattersOfTaste ?? []).map((line) => `“${line}”`).join(", ")}.{" "}
            </>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              run(approveDelivery(dealId, delivery.id));
            }}
          >
            Approve
          </button>{" "}
          <button
            type="button"
            onClick={() => {
              setMode("none");
            }}
          >
            Cancel
          </button>
        </p>
      )}
      {mode === "changes" && (
        <form onSubmit={onChanges}>
          <p>{revisionWords(revisions.used + 1, revisions.included, true)}</p>
          <p>
            <label>
              What should change?
              <textarea name="request" required maxLength={2000} rows={3} className="pp-full" />
            </label>
          </p>
          <button type="submit" disabled={busy}>
            Send the request
          </button>{" "}
          <button
            type="button"
            onClick={() => {
              setMode("none");
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
