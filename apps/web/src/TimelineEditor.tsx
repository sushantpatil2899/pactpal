import {
  MAX_TIMELINE_STEPS,
  STEP_KIND_WORDS,
  moveStep,
  type TimelineStep,
} from "@pactpal/timeline";
import { FULL_WIDTH } from "./styles";

/** The parts of the form a step can point at: payment stages and what the buyer provides. */
export interface StepTargets {
  stages: readonly { title: string; amount: string }[];
  items: readonly { text: string }[];
  currency: string;
}

const LABEL = { display: "block", marginTop: 4 } as const;

/** The words of a step that points at a stage or item, read from the form as it is now. */
function pointedWords(step: TimelineStep, targets: StepTargets): string {
  switch (step.kind) {
    case "payment": {
      const stage = targets.stages[step.stage - 1];
      return `stage ${String(step.stage)}: ${stage?.title ?? ""} (${stage?.amount ?? ""} ${targets.currency})`;
    }
    case "buyer-provides":
      return targets.items[step.item - 1]?.text ?? "";
    case "delivery":
    case "review":
    case "other":
      return "";
  }
}

/** The fields of a step that has words of its own: what it is, by when, and (other) who does it. */
export function OwnFields({
  step,
  n,
  targets,
  change,
}: {
  step: Extract<TimelineStep, { kind: "review" | "delivery" | "other" }>;
  n: number;
  targets: StepTargets;
  change: (step: TimelineStep) => void;
}) {
  // An emptied field is left out when the form is sent (JSON drops undefined).
  const due = (dueDate: string) => {
    change({ ...step, dueDate: dueDate === "" ? undefined : dueDate });
  };
  return (
    <>
      {step.kind === "delivery" && (
        <label style={LABEL}>
          For payment stage{" "}
          <select
            value={step.stage}
            onChange={(event) => {
              change({ ...step, stage: Number(event.target.value) });
            }}
          >
            {targets.stages.map((stage, i) => (
              <option key={i} value={i + 1}>
                {i + 1}: {stage.title}
              </option>
            ))}
          </select>
        </label>
      )}
      {step.kind === "other" && (
        <label style={LABEL}>
          Done by the{" "}
          <select
            value={step.owner}
            onChange={(event) => {
              change({ ...step, owner: event.target.value === "buyer" ? "buyer" : "seller" });
            }}
          >
            <option value="seller">seller</option>
            <option value="buyer">buyer</option>
          </select>
        </label>
      )}
      <label style={LABEL}>
        {step.kind === "review"
          ? "What the seller shares for review (for example: pencil sketches)"
          : step.kind === "delivery"
            ? "What is delivered (optional)"
            : "What happens"}
        <input
          style={FULL_WIDTH}
          value={step.text ?? ""}
          maxLength={500}
          required={step.kind !== "delivery"}
          aria-label={`Step ${String(n)}: words`}
          onChange={(event) => {
            const text = event.target.value;
            change(
              step.kind === "delivery"
                ? { ...step, text: text === "" ? undefined : text }
                : { ...step, text },
            );
          }}
        />
      </label>
      <label style={LABEL}>
        Due (optional){" "}
        <input
          type="date"
          value={step.dueDate ?? ""}
          aria-label={`Step ${String(n)}: due date`}
          onChange={(event) => {
            due(event.target.value);
          }}
        />
      </label>
    </>
  );
}

/**
 * The agreed timeline (7f): every step in the order agreed. Payments and what the buyer provides
 * come from their own lists above (change them there); reviews, deliveries and other steps are
 * added here. Steps move up and down freely; the buyer signs them in this order.
 */
export function TimelineEditor({
  steps,
  setSteps,
  targets,
}: {
  steps: TimelineStep[];
  setSteps: (steps: TimelineStep[]) => void;
  targets: StepTargets;
}) {
  const replace = (n: number, step: TimelineStep) => {
    setSteps(steps.map((old, i) => (i === n ? step : old)));
  };
  const add = (step: TimelineStep) => {
    if (steps.length < MAX_TIMELINE_STEPS) setSteps([...steps, step]);
  };
  return (
    <fieldset>
      <legend>Timeline: every step, in the agreed order</legend>
      <p style={{ fontSize: 14, color: "#555" }}>
        Payments and what the buyer provides are added from their lists above. Add reviews (you
        share a sketch, the buyer approves it), deliveries and anything else, then put the steps in
        order. The buyer signs this order, and PactPal reminds whoever a step is waiting for.
      </p>
      <ol>
        {steps.map((step, n) => (
          <li key={n} style={{ marginBottom: "0.75rem" }}>
            <strong>{STEP_KIND_WORDS[step.kind]}</strong> {pointedWords(step, targets)}
            {(step.kind === "review" || step.kind === "delivery" || step.kind === "other") && (
              <OwnFields
                step={step}
                n={n + 1}
                targets={targets}
                change={(next) => {
                  replace(n, next);
                }}
              />
            )}
            <span style={{ display: "block", marginTop: 4 }}>
              <button
                type="button"
                disabled={n === 0}
                aria-label={`Move step ${String(n + 1)} up`}
                onClick={() => {
                  setSteps(moveStep(steps, n, -1));
                }}
              >
                ↑
              </button>{" "}
              <button
                type="button"
                disabled={n === steps.length - 1}
                aria-label={`Move step ${String(n + 1)} down`}
                onClick={() => {
                  setSteps(moveStep(steps, n, 1));
                }}
              >
                ↓
              </button>{" "}
              {step.kind !== "payment" && step.kind !== "buyer-provides" && (
                <button
                  type="button"
                  onClick={() => {
                    setSteps(steps.filter((_, i) => i !== n));
                  }}
                >
                  Remove step {n + 1}
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
      <p>
        <button
          type="button"
          onClick={() => {
            add({ kind: "review", text: "" });
          }}
        >
          Add a review
        </button>{" "}
        <button
          type="button"
          disabled={targets.stages.length === 0}
          onClick={() => {
            add({ kind: "delivery", stage: targets.stages.length });
          }}
        >
          Add a delivery
        </button>{" "}
        <button
          type="button"
          onClick={() => {
            add({ kind: "other", owner: "buyer", text: "" });
          }}
        >
          Add another step
        </button>
      </p>
    </fieldset>
  );
}
