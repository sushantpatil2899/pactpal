import type { ReactNode } from "react";
import type { DeliverableKind } from "./api";
import { KIND_CHOICES } from "./mark-words";
import { FULL_WIDTH } from "./styles";

/** The most rows each list of the agreement may have (the stored rules' own limits). */
export const MAX_STAGES = 20;
export const MAX_PROVIDES = 20;
export const MAX_LINES = 50;

/** A payment stage as typed: the amount as text, the date possibly empty. */
export interface StageRow {
  title: string;
  amount: string;
  dueDate: string;
}
export const EMPTY_STAGE: StageRow = { title: "", amount: "", dueDate: "" };

/** One thing the buyer provides, as typed: the date may be empty. */
export interface ProvideRow {
  text: string;
  dueDate: string;
}
export const EMPTY_PROVIDE: ProvideRow = { text: "", dueDate: "" };

/** One delivered line as typed, with its mark ("" when not marked) and, for a matter of taste, its stage. */
export interface LineRow {
  text: string;
  kind: "" | "objective" | "process" | "subjective";
  stage: string;
}
export const EMPTY_LINE: LineRow = { text: "", kind: "", stage: "1" };

export const lineRow = (text: string, mark: DeliverableKind | undefined): LineRow => ({
  text,
  kind: mark?.kind ?? "",
  stage: mark?.kind === "subjective" ? String(mark.approvalStage) : "1",
});

/** A typed line's mark as saved. */
export const markOf = (row: LineRow): DeliverableKind => {
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

/** A typed stage as sent, without an empty date. */
export const typedStage = (row: StageRow) => ({
  title: row.title.trim(),
  amount: row.amount.trim(),
  ...(row.dueDate === "" ? {} : { dueDate: row.dueDate }),
});

/** The buyer-provides rows as sent: blank rows dropped, empty dates left out. */
export const typedProvides = (rows: readonly ProvideRow[]) =>
  rows
    .map((row) => ({ text: row.text.trim(), dueDate: row.dueDate }))
    .filter((row) => row.text !== "" || row.dueDate !== "")
    .map((row) => ({ text: row.text, ...(row.dueDate === "" ? {} : { dueDate: row.dueDate }) }));

/** A row's required text (a delivered line, or something the buyer provides). */
export function TextField({
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
export function DueDateField({
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

/** One payment stage's fields: title, amount and an optional due date. */
export function StageFields({
  number,
  row,
  change,
}: {
  number: number;
  row: StageRow;
  change: (update: Partial<StageRow>) => void;
}) {
  return (
    <>
      <label>
        Stage {number}{" "}
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
  );
}

/** One thing the buyer provides: what, and by when. */
export function ProvideFields({
  number,
  row,
  change,
}: {
  number: number;
  row: ProvideRow;
  change: (update: Partial<ProvideRow>) => void;
}) {
  return (
    <>
      <TextField label={`What (item ${String(number)})`} row={row} change={change} />{" "}
      <DueDateField label="By (optional)" row={row} change={change} />
    </>
  );
}

/**
 * One delivered line with its mark and, for a matter of taste, the stage whose approval settles
 * it (`stages` are the titles of stage 1, 2, …). `children` adds hints below the line.
 */
export function LineFields({
  number,
  row,
  change,
  stages,
  children,
}: {
  number: number;
  row: LineRow;
  change: (update: Partial<LineRow>) => void;
  stages: readonly string[];
  children?: ReactNode;
}) {
  return (
    <>
      <TextField label={`Line ${String(number)}`} row={row} change={change} />{" "}
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
            {stages.map((title, i) => (
              <option key={i} value={String(i + 1)}>
                {i + 1}. {title === "" ? "(no title yet)" : title}
              </option>
            ))}
          </select>
        </label>
      )}
      {children}
    </>
  );
}
