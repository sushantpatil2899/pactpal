import type { DealTimeline } from "./useDealTimeline";
import { stripSteps } from "./deal-view";

const STATE_WORDS = {
  done: "done",
  now: "current step",
  late: "current step, late",
  todo: "to do",
};

/**
 * The deal's steps in one line across the top: what is done, where it stands now, what is left.
 * `role` decides whether the next step reads as the person's own.
 */
export function ProgressStrip({
  steps: { timeline, scope },
  role,
  onOpen,
}: {
  steps: DealTimeline;
  role: "seller" | "buyer";
  onOpen: () => void;
}) {
  if (timeline === undefined || scope === undefined) return null;
  const signed = timeline.signed;
  const source = signed ? timeline.steps : (scope?.steps ?? []);
  if (source.length === 0) {
    return (
      <section className="pp-strip" aria-label="Progress">
        <p className="pp-strip-empty">
          No agreement yet. The steps appear here once the seller writes the agreed work.
        </p>
      </section>
    );
  }
  const steps = stripSteps(source, signed, new Date().toISOString().slice(0, 10));
  const current = signed ? timeline.steps.find((step) => step.state !== "done") : undefined;
  return (
    <section className="pp-strip" aria-label="Progress">
      <ol>
        {steps.map((step) => (
          <li key={step.n} data-state={step.state}>
            <span className="pp-strip-node" aria-hidden="true">
              {step.state === "done" ? "✓" : step.n}
            </span>
            <span>
              <b>{step.title}</b>
              <small>{step.detail}</small>
              <span className="pp-hidden">({STATE_WORDS[step.state]})</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="pp-strip-next">
        <div>
          <b>
            {!signed && "Not signed yet"}
            {signed && (current ? current.next : "Every step is done")}
          </b>
          <small>
            {!signed && "The steps start once the buyer signs."}
            {current &&
              (current.waitingOn === role
                ? "Waiting for you"
                : `Waiting for the ${current.waitingOn ?? "other side"}`)}
          </small>
        </div>
        <button type="button" onClick={onOpen}>
          Open timeline
        </button>
      </div>
    </section>
  );
}
