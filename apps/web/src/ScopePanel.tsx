import { useEffect, useRef, useState, type FormEvent } from "react";
import { InvalidFieldsError, getScope, saveScope, type ScopeInput, type ScopeView } from "./api";
import type { DraftFill } from "./draft-fill";
import { FULL_WIDTH } from "./styles";

interface StageRow {
  title: string;
  amount: string;
  dueDate: string;
}

const EMPTY_STAGE: StageRow = { title: "", amount: "", dueDate: "" };
const MAX_STAGES = 20;

const dateOf = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  });

/** Plain words for a field the server refused, e.g. "milestones.1.amount" → "payment stage 2: amount". */
function fieldLabel(field: string): string {
  const [name, index, part] = field.split(".");
  const labels: Record<string, string> = {
    summary: "summary",
    deliverables: "what will be delivered",
    exclusions: "not included",
    revisionsIncluded: "revisions included",
    dueDate: "due date",
    milestones: "payment stages",
  };
  if (name === "milestones" && index !== undefined) {
    return `payment stage ${String(Number(index) + 1)}${part ? `: ${part === "dueDate" ? "due date" : part}` : ""}`;
  }
  if ((name === "deliverables" || name === "exclusions") && index !== undefined) {
    return `${labels[name] ?? name}, line ${String(Number(index) + 1)}`;
  }
  return name === undefined || name === "" ? "the form" : (labels[name] ?? name);
}

/** One line per entry; blank lines are dropped. */
const linesOf = (text: FormDataEntryValue | null) =>
  typeof text === "string"
    ? text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
    : [];

const textOf = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const stagesFrom = (scope: ScopeView | null): StageRow[] =>
  scope
    ? scope.milestones.map((stage) => ({
        title: stage.title,
        amount: stage.amount.text,
        dueDate: stage.dueDate ?? "",
      }))
    : [{ ...EMPTY_STAGE }];

/** The newest saved version, read-only. */
function ScopeDetails({ scope }: { scope: ScopeView }) {
  return (
    <>
      <p>
        Version {scope.version} ·{" "}
        <code title="Fingerprint (SHA-256) of this version">
          {scope.contentSha256.slice(0, 12)}…
        </code>
      </p>
      <p>{scope.summary}</p>
      <h4>What will be delivered</h4>
      <ul>
        {scope.deliverables.map((item, n) => (
          <li key={n}>{item}</li>
        ))}
      </ul>
      {scope.exclusions.length > 0 && (
        <>
          <h4>Not included</h4>
          <ul>
            {scope.exclusions.map((item, n) => (
              <li key={n}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {scope.revisionsIncluded !== null && <p>Revisions included: {scope.revisionsIncluded}</p>}
      {scope.dueDate !== null && <p>Due: {dateOf(scope.dueDate)}</p>}
      <table>
        <caption>Payment stages</caption>
        <thead>
          <tr>
            <th scope="col">Stage</th>
            <th scope="col">Amount ({scope.currency})</th>
            <th scope="col">Due</th>
          </tr>
        </thead>
        <tbody>
          {scope.milestones.map((stage, n) => (
            <tr key={n}>
              <td>{stage.title}</td>
              <td>{stage.amount.text}</td>
              <td>{stage.dueDate === null ? "—" : dateOf(stage.dueDate)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{scope.total.text}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </>
  );
}

/** Tells the seller the form was filled from an AI draft, with the draft's wording hints. */
function FillNotice({ fill, onClear }: { fill: DraftFill; onClear: () => void }) {
  return (
    <div role="status">
      <p>
        <strong>
          Filled from{" "}
          {fill.draftLabel === undefined ? "an AI draft" : `AI draft ${fill.draftLabel}`}: check
          every line.
        </strong>{" "}
        Fields the chat did not state are left empty, and the price is one payment stage; split it
        into your real payment stages.{" "}
        <button type="button" onClick={onClear}>
          Start from a blank form instead
        </button>
      </p>
      {fill.paymentTerms !== undefined && (
        <p>The chat says about payment: &ldquo;{fill.paymentTerms}&rdquo;.</p>
      )}
      {fill.suggestions.length > 0 && (
        <>
          <p>Wording the draft suggests you make checkable (not part of the form yet):</p>
          <ul>
            {fill.suggestions.map((suggestion, n) => (
              <li key={n}>
                &ldquo;{suggestion.phrase}&rdquo; (
                {suggestion.kind === "subjective" ? "needs the buyer's approval" : "not measurable"}
                ): {suggestion.rewrite}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/**
 * What the deal covers and how the price is split into payment stages. Everyone on the deal sees
 * the newest version; the seller of a draft deal can save a new one (old versions are kept).
 */
export function ScopePanel({
  dealId,
  currency,
  canEdit,
  fill,
  onClearFill,
  onSaved,
}: {
  dealId: string;
  currency: string;
  canEdit: boolean;
  /** An AI draft the seller chose to start from; fills the form and is linked when saved. */
  fill: DraftFill | undefined;
  onClearFill: () => void;
  onSaved: () => void;
}) {
  const [scope, setScope] = useState<ScopeView | null | undefined>();
  const [stages, setStages] = useState<StageRow[]>([{ ...EMPTY_STAGE }]);
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  // Choosing a draft fills the form (the draft's one payment stage for the whole price) and moves
  // focus to this section so the seller lands on what to check.
  useEffect(() => {
    if (fill === undefined) return;
    setStages([
      fill.stage
        ? { title: fill.stage.title, amount: fill.stage.amount, dueDate: "" }
        : { ...EMPTY_STAGE },
    ]);
    heading.current?.focus();
  }, [fill]);

  useEffect(() => {
    getScope(dealId).then(
      (found) => {
        setScope(found);
        setStages(stagesFrom(found));
      },
      () => {
        setProblem("Could not load the agreed work.");
      },
    );
  }, [dealId]);

  const setStage = (index: number, change: Partial<StageRow>) => {
    setStages((rows) => rows.map((row, n) => (n === index ? { ...row, ...change } : row)));
  };

  const onSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const revisions = textOf(form.get("revisionsIncluded"));
    const dueDate = textOf(form.get("dueDate"));
    const input: ScopeInput = {
      ...(fill
        ? {
            draftId: fill.draftId,
            ...(fill.draftLabel === undefined ? {} : { draftLabel: fill.draftLabel }),
          }
        : {}),
      summary: textOf(form.get("summary")),
      deliverables: linesOf(form.get("deliverables")),
      exclusions: linesOf(form.get("exclusions")),
      ...(revisions === "" ? {} : { revisionsIncluded: Number(revisions) }),
      ...(dueDate === "" ? {} : { dueDate }),
      milestones: stages.map((row) => ({
        title: row.title.trim(),
        amount: row.amount.trim(),
        ...(row.dueDate === "" ? {} : { dueDate: row.dueDate }),
      })),
    };
    setBusy(true);
    setProblem(undefined);
    saveScope(dealId, input).then(
      (saved) => {
        setBusy(false);
        setScope(saved);
        setStages(stagesFrom(saved));
        onSaved();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(
          error instanceof InvalidFieldsError
            ? `Please check: ${[...new Set(error.fields.map(fieldLabel))].join("; ")}.`
            : error instanceof Error
              ? error.message
              : "Could not save the agreed work.",
        );
      },
    );
  };

  if (scope === undefined && !problem) return <p aria-busy="true">Loading the agreed work…</p>;
  return (
    <section aria-labelledby="agreed-work">
      <h3 id="agreed-work" ref={heading} tabIndex={-1}>
        Agreed work
      </h3>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {scope ? <ScopeDetails scope={scope} /> : <p>Nothing written down yet.</p>}
      {canEdit && scope !== undefined && (
        <form
          key={`${String(scope?.version ?? 0)}-${fill?.draftId ?? ""}-${fill?.draftLabel ?? ""}`}
          onSubmit={onSave}
        >
          <h4>{scope ? "Change and save as a new version" : "Write down the agreed work"}</h4>
          {fill && (
            <FillNotice
              fill={fill}
              onClear={() => {
                setStages(stagesFrom(scope ?? null));
                onClearFill();
              }}
            />
          )}
          <p>
            <label>
              Summary
              <br />
              <textarea
                style={FULL_WIDTH}
                name="summary"
                required
                maxLength={2000}
                rows={3}
                defaultValue={fill ? (fill.summary ?? "") : scope?.summary}
              />
            </label>
          </p>
          <p>
            <label>
              What will be delivered (one per line)
              <br />
              <textarea
                style={FULL_WIDTH}
                name="deliverables"
                required
                rows={4}
                defaultValue={(fill ? fill.deliverables : scope?.deliverables)?.join("\n")}
              />
            </label>
          </p>
          <p>
            <label>
              Not included (optional, one per line)
              <br />
              <textarea
                style={FULL_WIDTH}
                name="exclusions"
                rows={3}
                defaultValue={(fill ? fill.exclusions : scope?.exclusions)?.join("\n")}
              />
            </label>
          </p>
          <p>
            <label>
              Revisions included (optional){" "}
              <input
                name="revisionsIncluded"
                type="number"
                min={0}
                max={20}
                defaultValue={
                  fill ? (fill.revisionsIncluded ?? "") : (scope?.revisionsIncluded ?? "")
                }
              />
            </label>{" "}
            <label>
              Due date (optional){" "}
              <input
                name="dueDate"
                type="date"
                defaultValue={fill ? (fill.dueDate ?? "") : (scope?.dueDate ?? "")}
              />
            </label>
          </p>
          <fieldset>
            <legend>Payment stages ({currency})</legend>
            {stages.map((row, n) => (
              <p key={n}>
                <label>
                  Stage {n + 1}{" "}
                  <input
                    required
                    maxLength={200}
                    value={row.title}
                    onChange={(e) => {
                      setStage(n, { title: e.target.value });
                    }}
                  />
                </label>{" "}
                <label>
                  Amount{" "}
                  <input
                    required
                    inputMode="decimal"
                    pattern="\d+(\.\d{1,2})?"
                    placeholder="250.00"
                    size={10}
                    value={row.amount}
                    onChange={(e) => {
                      setStage(n, { amount: e.target.value });
                    }}
                  />
                </label>{" "}
                <label>
                  Due (optional){" "}
                  <input
                    type="date"
                    value={row.dueDate}
                    onChange={(e) => {
                      setStage(n, { dueDate: e.target.value });
                    }}
                  />
                </label>{" "}
                {stages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStages((rows) => rows.filter((_, i) => i !== n));
                    }}
                  >
                    Remove stage {n + 1}
                  </button>
                )}
              </p>
            ))}
            {stages.length < MAX_STAGES && (
              <button
                type="button"
                onClick={() => {
                  setStages((rows) => [...rows, { ...EMPTY_STAGE }]);
                }}
              >
                Add a payment stage
              </button>
            )}
          </fieldset>
          <p>
            <button type="submit" disabled={busy}>
              {scope ? "Save as new version" : "Save version 1"}
            </button>
          </p>
        </form>
      )}
    </section>
  );
}
