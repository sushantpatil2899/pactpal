import type { ClaimAnalysis } from "./check.js";

/** One statement of a comparison as plain words: what the buyer said and what the record shows. */
export interface ComparisonRow {
  number: number;
  said: string;
  shows: string;
}

/**
 * A claim comparison (5d) as rows of plain words, with each cited record entry's own line. The
 * summary council reads these rows and the packet prints them, so both say the same thing. Pure.
 */
export function comparisonRows(
  analysis: ClaimAnalysis,
  recordText: ReadonlyMap<number, string>,
): ComparisonRow[] {
  return analysis.statements.map((statement, i) => {
    if (statement.finding === "not-covered") {
      return { number: i + 1, said: statement.quote, shows: "No record covers this." };
    }
    const cited = [
      ...statement.agreement.map((c) => `agreement line ${String(c.line)}: "${c.quote}"`),
      ...statement.record.map((n) => recordText.get(n) ?? `#${String(n)}`),
    ];
    const relation = statement.relation === "" ? "" : `${statement.relation} `;
    return { number: i + 1, said: statement.quote, shows: `${relation}(${cited.join("; ")})` };
  });
}

/** The rows as numbered lines, as the summary council reads them. */
export const comparisonText = (rows: readonly ComparisonRow[]): string[] =>
  rows.map(
    (row) => `${String(row.number)}: The buyer said "${row.said}". The record: ${row.shows}`,
  );
