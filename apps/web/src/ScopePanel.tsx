import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  InvalidFieldsError,
  getScope,
  saveScope,
  type DeliverableKind,
  type ScopeInput,
  type ScopeView,
} from "./api";
import { ChatPane, FromTheChat, type LineRequest } from "./ChatPane";
import type { DraftFill, SourcedItem } from "./draft-fill";
import { EditableRows } from "./EditableRows";
import { KIND_CHOICES, draftHints } from "./mark-words";
import { ScopeDetails } from "./ScopeDetails";
import { FULL_WIDTH } from "./styles";

interface StageRow {
  title: string;
  amount: string;
  dueDate: string;
}

const EMPTY_STAGE: StageRow = { title: "", amount: "", dueDate: "" };
const MAX_STAGES = 20;

/** One thing the buyer provides, as typed: the date may be empty. */
interface ProvideRow {
  text: string;
  dueDate: string;
}

const EMPTY_PROVIDE: ProvideRow = { text: "", dueDate: "" };

/** One delivered line as typed, with its mark ("" when not marked) and, for a matter of taste, its stage. */
interface LineRow {
  text: string;
  kind: "" | "objective" | "process" | "subjective";
  stage: string;
}

const EMPTY_LINE: LineRow = { text: "", kind: "", stage: "1" };
const MAX_LINES = 50;

const lineRow = (text: string, mark: DeliverableKind | undefined): LineRow => ({
  text,
  kind: mark?.kind ?? "",
  stage: mark?.kind === "subjective" ? String(mark.approvalStage) : "1",
});

/** A typed line's mark as saved. */
const markOf = (row: LineRow): DeliverableKind => {
  switch (row.kind) {
    case "":
      return null;
    case "objective":
    case "process":
      return { kind: row.kind };
    case "subjective":
      return { kind: "subjective", approvalStage: Number(row.stage) };
  }
};
const MAX_PROVIDES = 20;

/** Wide enough for the chat beside the form. */
const WIDE_QUERY = "(min-width: 1000px)";

/** The form and the chat side by side, wider than the page column but never wider than the screen. */
const SIDE_BY_SIDE: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
  gap: "1.5rem",
  alignItems: "start",
  width: "min(1100px, calc(100vw - 32px))",
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)",
};

/** Whether the screen is wide enough for the chat beside the form; follows window resizes. */
function useWide(): boolean {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const update = () => {
      setWide(query.matches);
    };
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
    };
  }, []);
  return wide;
}

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
  if (name === "buyerProvides" && index !== undefined) {
    return `the buyer provides, item ${String(Number(index) + 1)}${part === "dueDate" ? ": date" : ""}`;
  }
  if (name === "deliverableKinds") {
    return index === undefined
      ? "what will be delivered: marks"
      : `what will be delivered, line ${String(Number(index) + 1)}: the stage that settles it`;
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

const linesFrom = (scope: ScopeView | null): LineRow[] =>
  scope
    ? scope.deliverables.map((text, n) => lineRow(text, scope.deliverableKinds?.[n]))
    : [{ ...EMPTY_LINE }];

const providesFrom = (scope: ScopeView | null): ProvideRow[] =>
  (scope?.buyerProvides ?? []).map((item) => ({ text: item.text, dueDate: item.dueDate ?? "" }));

/** A row's required text (a delivered line, or something the buyer provides). */
function TextField({
  label,
  row,
  change,
}: {
  label: string;
  row: { text: string };
  change: (update: { text: string }) => void;
}) {
  return (
    <label>
      {label}{" "}
      <input
        required
        maxLength={500}
        value={row.text}
        style={FULL_WIDTH}
        onChange={(e) => {
          change({ text: e.target.value });
        }}
      />
    </label>
  );
}

/** A row's optional date (a stage's due date, or when the buyer provides something). */
function DueDateField({
  label,
  row,
  change,
}: {
  label: string;
  row: { dueDate: string };
  change: (update: { dueDate: string }) => void;
}) {
  return (
    <label>
      {label}{" "}
      <input
        type="date"
        value={row.dueDate}
        onChange={(e) => {
          change({ dueDate: e.target.value });
        }}
      />
    </label>
  );
}

/** Drafted list items, each with the chat lines it was quoted from. */
function SourcedItems({ items, onShow }: { items: SourcedItem[]; onShow: (line: number) => void }) {
  if (items.length === 0) return null;
  return (
    <ul style={{ margin: "0.25rem 0" }}>
      {items.map((item, n) => (
        <li key={n}>
          <FromTheChat prefix={`“${item.text}”:`} lines={item.lines} onShow={onShow} />
        </li>
      ))}
    </ul>
  );
}

/** Tells the seller the form was filled from an AI draft, with the draft's wording hints. */
function FillNotice({
  fill,
  onClear,
  onShow,
}: {
  fill: DraftFill;
  onClear: () => void;
  onShow: (line: number) => void;
}) {
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
        <p>
          The chat says about payment: &ldquo;{fill.paymentTerms}&rdquo;.{" "}
          <FromTheChat lines={fill.sources.paymentTerms} onShow={onShow} />
        </p>
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
  const [provides, setProvides] = useState<ProvideRow[]>([]);
  const [lines, setLines] = useState<LineRow[]>([{ ...EMPTY_LINE }]);
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [lineRequest, setLineRequest] = useState<LineRequest | undefined>();
  const heading = useRef<HTMLHeadingElement>(null);
  const wide = useWide();
  const show = (line: number) => {
    setLineRequest((previous) => ({ line, nonce: (previous?.nonce ?? 0) + 1 }));
  };

  // Choosing a draft fills the form (the draft's one payment stage for the whole price) and moves
  // focus to this section so the seller lands on what to check.
  useEffect(() => {
    if (fill === undefined) return;
    setStages([
      fill.stage
        ? { title: fill.stage.title, amount: fill.stage.amount, dueDate: "" }
        : { ...EMPTY_STAGE },
    ]);
    // A draft has no "buyer provides" list or line marks yet (4n), so the seller writes them.
    setProvides([]);
    setLines(
      fill.deliverables.length === 0
        ? [{ ...EMPTY_LINE }]
        : fill.deliverables.map((text) => lineRow(text, null)),
    );
    setLineRequest(undefined);
    heading.current?.focus();
  }, [fill]);

  useEffect(() => {
    getScope(dealId).then(
      (found) => {
        setScope(found);
        setStages(stagesFrom(found));
        setProvides(providesFrom(found));
        setLines(linesFrom(found));
      },
      () => {
        setProblem("Could not load the agreed work.");
      },
    );
  }, [dealId]);

  const onSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const revisions = textOf(form.get("revisionsIncluded"));
    const dueDate = textOf(form.get("dueDate"));
    const delivered = lines
      .map((row) => ({ ...row, text: row.text.trim() }))
      .filter((row) => row.text !== "");
    const input: ScopeInput = {
      ...(fill
        ? {
            draftId: fill.draftId,
            ...(fill.draftLabel === undefined ? {} : { draftLabel: fill.draftLabel }),
          }
        : {}),
      summary: textOf(form.get("summary")),
      deliverables: delivered.map((row) => row.text),
      deliverableKinds: delivered.map(markOf),
      exclusions: linesOf(form.get("exclusions")),
      ...(revisions === "" ? {} : { revisionsIncluded: Number(revisions) }),
      ...(dueDate === "" ? {} : { dueDate }),
      milestones: stages.map((row) => ({
        title: row.title.trim(),
        amount: row.amount.trim(),
        ...(row.dueDate === "" ? {} : { dueDate: row.dueDate }),
      })),
      buyerProvides: provides
        .map((row) => ({ text: row.text.trim(), dueDate: row.dueDate }))
        .filter((row) => row.text !== "" || row.dueDate !== "")
        .map((row) => ({
          text: row.text,
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
        setProvides(providesFrom(saved));
        setLines(linesFrom(saved));
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
  const sources = fill?.sources;
  const form = canEdit && scope !== undefined && (
    <form
      key={`${String(scope?.version ?? 0)}-${fill?.draftId ?? ""}-${fill?.draftLabel ?? ""}`}
      onSubmit={onSave}
    >
      <h4>{scope ? "Change and save as a new version" : "Write down the agreed work"}</h4>
      {fill && (
        <FillNotice
          fill={fill}
          onShow={show}
          onClear={() => {
            setStages(stagesFrom(scope ?? null));
            setProvides(providesFrom(scope ?? null));
            setLines(linesFrom(scope ?? null));
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
        {sources && <FromTheChat lines={sources.summary} onShow={show} />}
      </p>
      <fieldset>
        <legend>What will be delivered</legend>
        <EditableRows
          rows={lines}
          setRows={setLines}
          min={1}
          max={MAX_LINES}
          empty={EMPTY_LINE}
          addLabel="Add a line"
          removeLabel={(n) => `Remove line ${String(n)}`}
        >
          {(row, n, change) => {
            const source = sources?.deliverables.find((item) => item.text === row.text);
            const hints = fill ? draftHints(row.text, fill.suggestions) : [];
            return (
              <>
                <TextField label={`Line ${String(n + 1)}`} row={row} change={change} />{" "}
                <label>
                  Mark{" "}
                  <select
                    value={row.kind}
                    onChange={(e) => {
                      const choice = KIND_CHOICES.find((c) => c.value === e.target.value);
                      if (choice) change({ kind: choice.value });
                    }}
                  >
                    {KIND_CHOICES.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </label>{" "}
                {row.kind === "subjective" && (
                  <label>
                    Settled when the buyer approves stage{" "}
                    <select
                      value={row.stage}
                      onChange={(e) => {
                        change({ stage: e.target.value });
                      }}
                    >
                      {stages.map((stage, i) => (
                        <option key={i} value={String(i + 1)}>
                          {i + 1}. {stage.title === "" ? "(no title yet)" : stage.title}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {hints.map((hint) => (
                  <span key={hint} style={{ display: "block", color: "#555", fontSize: 14 }}>
                    {hint}
                  </span>
                ))}
                {source && <FromTheChat lines={source.lines} onShow={show} />}
              </>
            );
          }}
        </EditableRows>
      </fieldset>
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
      {sources && <SourcedItems items={sources.exclusions} onShow={show} />}
      <p>
        <label>
          Revisions included (optional){" "}
          <input
            name="revisionsIncluded"
            type="number"
            min={0}
            max={20}
            defaultValue={fill ? (fill.revisionsIncluded ?? "") : (scope?.revisionsIncluded ?? "")}
          />
        </label>{" "}
        {sources && (
          <FromTheChat prefix="From the chat:" lines={sources.revisionsIncluded} onShow={show} />
        )}{" "}
        <label>
          Due date (optional){" "}
          <input
            name="dueDate"
            type="date"
            defaultValue={fill ? (fill.dueDate ?? "") : (scope?.dueDate ?? "")}
          />
        </label>{" "}
        {sources && <FromTheChat prefix="From the chat:" lines={sources.dueDate} onShow={show} />}
      </p>
      <fieldset>
        <legend>Payment stages ({currency})</legend>
        {sources && (
          <p>
            <FromTheChat prefix="Price, from the chat:" lines={sources.price} onShow={show} />
          </p>
        )}
        <EditableRows
          rows={stages}
          setRows={setStages}
          min={1}
          max={MAX_STAGES}
          empty={EMPTY_STAGE}
          addLabel="Add a payment stage"
          removeLabel={(n) => `Remove stage ${String(n)}`}
        >
          {(row, n, change) => (
            <>
              <label>
                Stage {n + 1}{" "}
                <input
                  required
                  maxLength={200}
                  value={row.title}
                  onChange={(e) => {
                    change({ title: e.target.value });
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
                    change({ amount: e.target.value });
                  }}
                />
              </label>{" "}
              <DueDateField label="Due (optional)" row={row} change={change} />
            </>
          )}
        </EditableRows>
      </fieldset>
      <fieldset>
        <legend>The buyer provides (optional)</legend>
        <EditableRows
          rows={provides}
          setRows={setProvides}
          min={0}
          max={MAX_PROVIDES}
          empty={EMPTY_PROVIDE}
          addLabel="Add an item"
          removeLabel={(n) => `Remove item ${String(n)}`}
        >
          {(row, n, change) => (
            <>
              <TextField label={`What (item ${String(n + 1)})`} row={row} change={change} />{" "}
              <DueDateField label="By (optional)" row={row} change={change} />
            </>
          )}
        </EditableRows>
      </fieldset>
      <p>
        <button type="submit" disabled={busy}>
          {scope ? "Save as new version" : "Save version 1"}
        </button>
      </p>
    </form>
  );
  const chat = form && fill?.chat;
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
      {chat ? (
        wide ? (
          <div style={SIDE_BY_SIDE}>
            {form}
            <ChatPane
              idPrefix="form-chat-line"
              lines={chat.lines}
              hidden={chat.hidden}
              request={lineRequest}
              layout="column"
            />
          </div>
        ) : (
          <>
            <ChatPane
              idPrefix="form-chat-line"
              lines={chat.lines}
              hidden={chat.hidden}
              request={lineRequest}
              layout="folded"
            />
            {form}
          </>
        )
      ) : (
        form
      )}
    </section>
  );
}
