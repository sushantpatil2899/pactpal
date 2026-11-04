import { markWords } from "@pactpal/words";
import { useEffect, useState, type FormEvent } from "react";
import { AcceptanceDocument } from "./AcceptanceDocument";
import {
  InvalidFieldsError,
  acceptChange,
  declineChange,
  getChangeOrders,
  getScope,
  proposeChange,
  withdrawChange,
  type ChangeOrderView,
  type ChangeOrdersView,
  type ChangeView,
  type DealSummary,
  type ScopeView,
} from "./api";
import { EditableRows } from "./EditableRows";
import { when } from "./format";
import {
  EMPTY_LINE,
  EMPTY_PROVIDE,
  EMPTY_STAGE,
  LineFields,
  MAX_LINES,
  MAX_PROVIDES,
  MAX_STAGES,
  ProvideFields,
  StageFields,
  markOf,
  typedProvides,
  typedStage,
  type LineRow,
  type ProvideRow,
  type StageRow,
} from "./FormRows";
import { dateOf } from "./ScopeDetails";
import { SignOrDecline } from "./SignOrDecline";
import { FULL_WIDTH, WRAP } from "./styles";

const ALERT = { color: "#8a1c1c" } as const;

/** What a change adds or changes, one line each. `stages` are the new version's stage titles. */
function ChangeSummary({
  change,
  currency,
  stages,
}: {
  change: ChangeView;
  currency: string;
  stages: readonly { title: string }[];
}) {
  const items = [
    ...change.addedLines.map((line) => {
      const words = markWords(line.mark, stages);
      return `Added: ${line.text}${words === "" ? "" : ` ${words}`}`;
    }),
    ...change.addedExclusions.map((text) => `Added to "not included": ${text}`),
    ...change.addedBuyerProvides.map(
      (item) =>
        `The buyer also provides: ${item.text}${item.dueDate === null ? "" : ` (by ${dateOf(item.dueDate)})`}`,
    ),
    ...change.addedStages.map(
      (stage) =>
        `Added payment stage ${String(stage.stage)}: ${stage.title}, ${stage.amount.text} ${currency}${stage.dueDate === null ? "" : ` (due ${dateOf(stage.dueDate)})`}`,
    ),
    ...(change.dueDate === null
      ? []
      : [
          `Due date: ${change.dueDate.from === null ? "none" : dateOf(change.dueDate.from)} → ${change.dueDate.to === null ? "none" : dateOf(change.dueDate.to)}`,
        ]),
    ...(change.revisionsIncluded === null
      ? []
      : [
          `Revisions included: ${String(change.revisionsIncluded.from)} → ${String(change.revisionsIncluded.to)}`,
        ]),
    `Total: ${change.total.from.text} → ${change.total.to.text} ${currency}`,
  ];
  return (
    <ul style={WRAP}>
      {items.map((item, n) => (
        <li key={n}>{item}</li>
      ))}
    </ul>
  );
}

/** The stage titles of a change's new version: the signed ones, then the added ones. */
const stagesAfter = (signed: ScopeView | null, change: ChangeView) => [
  ...(signed?.milestones ?? []),
  ...change.addedStages,
];

/** How an answered change ended, in one line. */
function outcome(order: ChangeOrderView): string {
  const at = order.answeredAt === null ? "" : ` on ${when(order.answeredAt)}`;
  switch (order.status) {
    case "accepted":
      return `Change accepted${order.acceptedBy === null ? "" : ` by ${order.acceptedBy}`}${at} (now version ${String(order.toVersion)}).`;
    case "declined":
      return `Change declined${at}${order.reason === null ? "." : `: “${order.reason}”`}`;
    case "withdrawn":
      return `Change withdrawn${at}.`;
    case "proposed":
      return `Change proposed (version ${String(order.toVersion)}) on ${when(order.proposedAt)}, waiting for the buyer.`;
  }
}

/** Plain words for a part of the proposal the server refused. */
function partLabel(field: string): string {
  const [part, index, ...rest] = field.split(".");
  const n = index === undefined ? "" : ` ${String(Number(index) + 1)}`;
  switch (part ?? "") {
    case "addLines":
      return `added line${n}${rest.includes("mark") ? ": the stage that settles it" : ""}`;
    case "addStages":
      return `added payment stage${n}${rest[0] === "amount" ? ": amount" : ""}`;
    case "addBuyerProvides":
      return `added buyer-provides item${n}`;
    case "addExclusions":
      return `added "not included" line${n}`;
    case "revisionsIncluded":
      return "revisions included (only more than now, and only when the agreement states a number)";
    case "nothing":
      return "add something to the agreement";
    default:
      return field;
  }
}

const textOf = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

/** The seller's form: it only adds to the signed agreement. */
function ProposeForm({
  signed,
  currency,
  busy,
  onSend,
  onCancel,
}: {
  signed: ScopeView;
  currency: string;
  busy: boolean;
  onSend: (
    form: HTMLFormElement,
    rows: { lines: LineRow[]; provides: ProvideRow[]; stages: StageRow[] },
  ) => void;
  onCancel: () => void;
}) {
  const [lines, setLines] = useState<LineRow[]>([]);
  const [provides, setProvides] = useState<ProvideRow[]>([]);
  const [stages, setStages] = useState<StageRow[]>([]);
  const firstNew = signed.milestones.length + 1;
  const titles = [...signed.milestones.map((stage) => stage.title), ...stages.map((s) => s.title)];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(event.currentTarget, { lines, provides, stages });
  };
  return (
    <form onSubmit={submit}>
      <h4>Propose a change to the signed agreement</h4>
      <p>You can add to the agreement; what the buyer signed stays as it is.</p>
      <fieldset>
        <legend>Add delivered lines</legend>
        <EditableRows
          rows={lines}
          setRows={setLines}
          min={0}
          max={MAX_LINES - signed.deliverables.length}
          empty={EMPTY_LINE}
          addLabel="Add a line"
          removeLabel={(n) => `Remove line ${String(n)}`}
        >
          {(row, n, change) => (
            <LineFields
              number={signed.deliverables.length + n + 1}
              row={row}
              change={change}
              stages={titles}
            />
          )}
        </EditableRows>
      </fieldset>
      <p>
        <label>
          Add to &lsquo;not included&rsquo; (one per line)
          <br />
          <textarea name="exclusions" rows={2} style={FULL_WIDTH} />
        </label>
      </p>
      <fieldset>
        <legend>Add what the buyer provides</legend>
        <EditableRows
          rows={provides}
          setRows={setProvides}
          min={0}
          max={MAX_PROVIDES - (signed.buyerProvides?.length ?? 0)}
          empty={EMPTY_PROVIDE}
          addLabel="Add an item"
          removeLabel={(n) => `Remove item ${String(n)}`}
        >
          {(row, n, change) => (
            <ProvideFields
              number={(signed.buyerProvides?.length ?? 0) + n + 1}
              row={row}
              change={change}
            />
          )}
        </EditableRows>
      </fieldset>
      <fieldset>
        <legend>Add payment stages ({currency})</legend>
        <EditableRows
          rows={stages}
          setRows={setStages}
          min={0}
          max={MAX_STAGES - signed.milestones.length}
          empty={EMPTY_STAGE}
          addLabel="Add a payment stage"
          removeLabel={(n) => `Remove stage ${String(firstNew + n - 1)}`}
        >
          {(row, n, change) => <StageFields number={firstNew + n} row={row} change={change} />}
        </EditableRows>
      </fieldset>
      <p>
        <label>
          New due date (optional) <input name="dueDate" type="date" />
        </label>{" "}
        {signed.revisionsIncluded !== null && (
          <label>
            Revisions included{" "}
            <input
              name="revisionsIncluded"
              type="number"
              min={signed.revisionsIncluded}
              max={20}
              defaultValue={signed.revisionsIncluded}
            />
          </label>
        )}
      </p>
      <p>
        <label>
          Message to the buyer (optional)
          <br />
          <textarea name="message" rows={2} maxLength={1000} style={FULL_WIDTH} />
        </label>
      </p>
      <button type="submit" disabled={busy}>
        Send the change to the buyer
      </button>{" "}
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

/**
 * Change orders on a signed deal: the seller proposes additions to the agreement and can
 * withdraw one still waiting; the buyer reads what changes and the full new agreement, then signs
 * or declines. Both see every change and how it ended. `onChange` tells the page the agreement
 * (and the log) may have changed.
 */
export function ChangeOrderPanel({ deal, onChange }: { deal: DealSummary; onChange: () => void }) {
  const [view, setView] = useState<ChangeOrdersView | undefined>();
  const [signed, setSigned] = useState<ScopeView | null>(null);
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [proposing, setProposing] = useState(false);

  const load = () => {
    Promise.all([getChangeOrders(deal.id), getScope(deal.id)]).then(
      ([orders, scope]) => {
        setView(orders);
        setSigned(scope);
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load the changes.");
      },
    );
  };
  useEffect(load, [deal.id, deal.status]);

  if (!view || (!view.signed && view.orders.length === 0)) return null;
  const seller = deal.role === "seller";

  /** Runs a step, then shows the changes again and tells the page. */
  const run = (work: Promise<ChangeOrdersView>, done?: () => void) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (updated) => {
        setBusy(false);
        setProposing(false);
        setView(updated);
        done?.();
        load();
        onChange();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(
          error instanceof InvalidFieldsError
            ? `Please check: ${[...new Set(error.fields.map(partLabel))].join("; ")}.`
            : error instanceof Error
              ? error.message
              : "Something went wrong.",
        );
      },
    );
  };

  const onSend = (
    form: HTMLFormElement,
    rows: { lines: LineRow[]; provides: ProvideRow[]; stages: StageRow[] },
  ) => {
    const data = new FormData(form);
    const revisions = textOf(data.get("revisionsIncluded"));
    const dueDate = textOf(data.get("dueDate"));
    const message = textOf(data.get("message"));
    const lines = rows.lines
      .map((row) => ({ ...row, text: row.text.trim() }))
      .filter((row) => row.text !== "");
    run(
      proposeChange(deal.id, {
        addLines: lines.map((row) => ({ text: row.text, mark: markOf(row) })),
        addExclusions: textOf(data.get("exclusions"))
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== ""),
        addBuyerProvides: typedProvides(rows.provides),
        addStages: rows.stages.map(typedStage),
        ...(dueDate === "" ? {} : { dueDate }),
        ...(revisions === "" || Number(revisions) === signed?.revisionsIncluded
          ? {}
          : { revisionsIncluded: Number(revisions) }),
        ...(message === "" ? {} : { message }),
      }),
    );
  };

  const waiting = view.orders.find((order) => order.status === "proposed");
  const answered = view.orders.filter((order) => order.status !== "proposed");
  return (
    <section aria-labelledby="change-orders" style={WRAP}>
      <h3 id="change-orders">
        {!seller && waiting
          ? `Proposed change to your agreement (version ${String(waiting.toVersion)})`
          : "Changes to the agreement"}
      </h3>
      {problem && (
        <p role="alert" style={ALERT}>
          {problem}
        </p>
      )}
      {waiting && (
        <div>
          {seller && (
            <p role="status">
              {outcome(waiting)}{" "}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  run(withdrawChange(deal.id, waiting.id));
                }}
              >
                Withdraw the change
              </button>
            </p>
          )}
          {waiting.message !== null && (
            <p>
              Message from {deal.seller?.name ?? "the seller"}: &ldquo;{waiting.message}&rdquo;
            </p>
          )}
          <p>What changes:</p>
          <ChangeSummary
            change={waiting.change}
            currency={deal.currency}
            stages={waiting.document?.terms.milestones ?? stagesAfter(signed, waiting.change)}
          />
          {waiting.document && waiting.documentSha256 !== undefined && (
            <details open={!seller}>
              <summary>
                {seller ? "What the buyer sees" : "The full agreement if you agree:"}
              </summary>
              <AcceptanceDocument
                document={waiting.document}
                documentSha256={waiting.documentSha256}
              />
            </details>
          )}
          {!seller && waiting.documentSha256 !== undefined && (
            <SignOrDecline
              busy={busy}
              words={{
                sign: "I agree to this change",
                reasonLabel: "Reason (optional; the seller sees this)",
                sendDecline: "Decline the change",
              }}
              onSign={(typedName) => {
                run(
                  acceptChange(deal.id, waiting.id, {
                    documentSha256: waiting.documentSha256 ?? "",
                    typedName,
                  }),
                );
              }}
              onDecline={(reason) => {
                run(declineChange(deal.id, waiting.id, reason === undefined ? {} : { reason }));
              }}
            />
          )}
        </div>
      )}
      {seller && view.canPropose && signed && !proposing && (
        <p>
          <button
            type="button"
            onClick={() => {
              setProposing(true);
            }}
          >
            Propose a change
          </button>
        </p>
      )}
      {seller && view.canPropose && signed && proposing && (
        <ProposeForm
          signed={signed}
          currency={deal.currency}
          busy={busy}
          onSend={onSend}
          onCancel={() => {
            setProposing(false);
          }}
        />
      )}
      {answered.length > 0 && (
        <ul>
          {answered.map((order) => (
            <li key={order.id}>
              {outcome(order)}
              <details>
                <summary>What it changed (version {order.toVersion})</summary>
                <ChangeSummary
                  change={order.change}
                  currency={deal.currency}
                  stages={stagesAfter(signed, order.change)}
                />
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
