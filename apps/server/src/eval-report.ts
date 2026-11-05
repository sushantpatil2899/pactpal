import { SCORED_FIELDS, type DraftScore } from "@pactpal/scope-draft/testing";
import type { AloneRecord, CouncilEvalRecord, EvalRun } from "./eval-runner.js";
import { table } from "./report-table.js";

const mean = (values: readonly number[]): number | undefined =>
  values.length === 0 ? undefined : values.reduce((sum, value) => sum + value, 0) / values.length;
const fixed = (value: number | undefined, digits = 2) =>
  value === undefined ? "-" : value.toFixed(digits);
const count = (n: number) => String(n);
const unique = (values: readonly string[]) => [...new Set(values)];
/** Whether two scores are the same, ignoring rounding in the division. */
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** The wrong fields of a scored draft, by name. */
const wrongFields = ({ score }: AloneRecord) =>
  score === undefined ? [] : SCORED_FIELDS.filter((field) => score.fields[field] === "wrong");

function aloneRow(model: string, records: readonly AloneRecord[]): string[] {
  const scored = records.filter((r) => r.status === "scored");
  const answered = records.filter((r) => r.status !== "failed");
  return [
    model,
    count(records.length),
    count(records.filter((r) => r.status === "failed").length),
    count(records.filter((r) => r.status === "dropped").length),
    count(scored.length),
    fixed(mean(scored.flatMap((r) => (r.score === undefined ? [] : [r.score.score])))),
    count(scored.reduce((sum, r) => sum + (r.score?.wrongValues ?? 0), 0)),
    fixed(mean(answered.map((r) => r.tokens)), 0),
    fixed(mean(answered.map((r) => r.seconds)), 1),
  ];
}

function aloneSection(alone: readonly AloneRecord[]): string {
  const models = unique(alone.map((r) => r.model));
  const rows = models.map((model) =>
    aloneRow(
      model,
      alone.filter((r) => r.model === model),
    ),
  );
  let text = "Each model alone (its own draft of each chat)\n";
  text +=
    rows.length === 0
      ? "  (none)\n"
      : table(
          ["model", "asked", "failed", "dropped", "scored", "score", "wrong", "tokens", "seconds"],
          rows,
        );
  text +=
    "  failed = no usable reply (often a free-tier limit); dropped = failed the citation check;\n" +
    "  score = average from 0 to 1 over scored drafts; wrong = a stated price, date, revision count\n" +
    "  or category that is wrong or that the chat does not give; tokens and seconds = per draft\n";
  const wrong = alone.flatMap((r) =>
    wrongFields(r).map((field) => `${r.model}, ${r.caseId}: ${field}`),
  );
  if (wrong.length > 0)
    text += `\nWrong values (model, chat: field)\n${wrong.map((w) => `  ${w}\n`).join("")}`;
  const failures = alone.filter((r) => r.status === "failed");
  if (failures.length > 0) {
    const kinds = unique(failures.map((r) => `${r.model}: ${r.failure ?? "unknown"}`));
    text += `\nCalls that failed (model: reason, count)\n${kinds
      .map(
        (kind) =>
          `  ${kind} (${count(failures.filter((r) => `${r.model}: ${r.failure ?? "unknown"}` === kind).length)})\n`,
      )
      .join("")}`;
  }
  return text;
}

/** One model's cell for a chat: its average score, or why it has none ("fail" = no reply, "drop" = checker). */
function cell(records: readonly AloneRecord[]): string {
  const scores = records.flatMap((r) => (r.score === undefined ? [] : [r.score.score]));
  if (scores.length > 0) return fixed(mean(scores));
  return records.some((r) => r.status === "dropped") ? "drop" : "fail";
}

function chatSection(alone: readonly AloneRecord[], council: readonly CouncilEvalRecord[]): string {
  const models = unique(alone.map((r) => r.model));
  const rows = unique(council.map((r) => r.caseId)).map((caseId) => {
    const mine = council.filter((r) => r.caseId === caseId);
    const picked = unique(mine.map((r) => r.winner ?? "none")).join("/");
    const scores = mine.flatMap((r) => (r.score === undefined ? [] : [r.score.score]));
    return [
      caseId,
      ...models.map((model) => cell(alone.filter((r) => r.caseId === caseId && r.model === model))),
      fixed(mean(scores)),
      picked,
    ];
  });
  return `\nBy chat: each model's own score, then the council's pick and which model's draft it chose\n${table(["chat", ...models, "council", "picked"], rows)}`;
}

function councilSection(council: readonly CouncilEvalRecord[]): string {
  const won = council.filter((r) => r.score !== undefined && r.best !== undefined);
  const flagged = won.filter((r) => r.flagged);
  const unflagged = won.filter((r) => !r.flagged);
  const pickScores = (records: readonly CouncilEvalRecord[]) =>
    records.flatMap((r) => (r.score === undefined ? [] : [r.score.score]));
  const row = [
    count(council.length),
    count(council.filter((r) => r.winner === null).length),
    fixed(mean(pickScores(won))),
    count(won.reduce((sum, r) => sum + (r.score?.wrongValues ?? 0), 0)),
    count(
      won.filter(
        (r) => r.score !== undefined && r.best !== undefined && same(r.score.score, r.best),
      ).length,
    ),
    count(flagged.length),
    fixed(mean(council.map((r) => r.calls)), 1),
    fixed(mean(council.map((r) => r.tokens)), 0),
    fixed(mean(council.map((r) => r.seconds)), 1),
  ];
  let text = "\nThe council (answers, then every model ranks them)\n";
  text += table(
    ["runs", "no winner", "score", "wrong", "picked best", "flagged", "calls", "tokens", "seconds"],
    [row],
  );
  text += "  calls, tokens and seconds = per chat, all answers and rankings together\n";
  const ties = council.filter((r) =>
    r.reviewReasons.some((reason) => reason.includes("almost the same")),
  ).length;
  text += `  flagged for review: ${count(flagged.length)} runs (average pick ${fixed(mean(pickScores(flagged)))}), not flagged: ${count(unflagged.length)} runs (average pick ${fixed(mean(pickScores(unflagged)))}); ties between the top drafts: ${count(ties)}\n`;
  return text;
}

/** The plain statement: council against the average draft and against always picking the best. */
function statement(alone: readonly AloneRecord[], council: readonly CouncilEvalRecord[]): string {
  const won = council.filter(
    (r) => r.score !== undefined && r.average !== undefined && r.best !== undefined,
  );
  if (won.length === 0)
    return "\nNo council pick could be scored, so there is nothing to compare.\n";
  const pick = mean(won.flatMap((r) => (r.score === undefined ? [] : [r.score.score])));
  const average = mean(won.flatMap((r) => (r.average === undefined ? [] : [r.average])));
  const best = mean(won.flatMap((r) => (r.best === undefined ? [] : [r.best])));
  const aloneTokens = mean(alone.filter((r) => r.status !== "failed").map((r) => r.tokens));
  const councilTokens = mean(council.map((r) => r.tokens));
  const multiple =
    aloneTokens === undefined || councilTokens === undefined || aloneTokens === 0
      ? "-"
      : (councilTokens / aloneTokens).toFixed(1);
  return (
    "\nIn plain words\n" +
    `  On the ${count(won.length)} runs where the council chose a draft, its pick scored ${fixed(pick)}.\n` +
    `  A single model's draft on the same runs scored ${fixed(average)} on average; always taking the best draft on offer would have scored ${fixed(best)}.\n` +
    `  The council used about ${multiple} times the tokens of one draft.\n` +
    "  Whether that is worth it is the owner's decision; these are a few made-up chats, so read the numbers as a tendency.\n"
  );
}

/** One row of the prompt version 3 parts, over scored drafts. */
function newPartsRow(name: string, scores: readonly DraftScore[]): string[] {
  const dates = scores.flatMap((s) =>
    s.buyerProvides.datesRight === null ? [] : [s.buyerProvides.datesRight],
  );
  const right = scores.reduce((sum, s) => sum + s.marks.right, 0);
  const judged = scores.reduce((sum, s) => sum + s.marks.judged, 0);
  return [
    name,
    count(scores.length),
    fixed(mean(scores.map((s) => s.buyerProvides.recall))),
    fixed(mean(dates)),
    judged === 0 ? "-" : `${count(right)} of ${count(judged)}`,
  ];
}

/** Prompt version 3's parts, apart from the score so it stays comparable with earlier runs. */
function newPartsSection(
  alone: readonly AloneRecord[],
  council: readonly CouncilEvalRecord[],
): string {
  const scoresOf = (records: readonly { score?: DraftScore }[]) =>
    records.flatMap((r) => (r.score === undefined ? [] : [r.score]));
  const rows = [
    ...unique(alone.map((r) => r.model)).map((model) =>
      newPartsRow(model, scoresOf(alone.filter((r) => r.model === model))),
    ),
    newPartsRow("council pick", scoresOf(council)),
  ];
  return (
    "\nBuyer duties and line marks (prompt version 3; not in the score above)\n" +
    table(["drafts of", "scored", "duties found", "dates right", "marks right"], rows) +
    "  duties found = share of the buyer duties the chats state; dates right = share of the found\n" +
    "  ones with the right date; marks right = expected marks the drafts got right\n"
  );
}

/**
 * The plain-text report of an evals run: each model alone, the chats, the council, and a short
 * statement. It shows chat ids, model names, field names and numbers only, never chat text or replies.
 */
export function formatEvalReport(run: EvalRun): string {
  const alone = run.records.filter((r): r is AloneRecord => r.kind === "alone");
  const council = run.records.filter((r): r is CouncilEvalRecord => r.kind === "council");
  const chats = unique(run.records.map((r) => r.caseId)).length;
  let text = `Drafting evals (${count(chats)} chats, ${count(run.runs)} run${run.runs === 1 ? "" : "s"} of each)\n\n`;
  text += aloneSection(alone);
  text += councilSection(council);
  text += newPartsSection(alone, council);
  text += chatSection(alone, council);
  text += statement(alone, council);
  text += `\n${(run.durationMs / 1000).toFixed(0)} s in all.\n`;
  return text;
}
