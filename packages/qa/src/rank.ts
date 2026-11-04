/** One recent outcome of a model: from a council run, or from this server's own answers. */
export interface ModelRecord {
  model: string;
  ok: boolean;
  latencyMs?: number;
  at: Date;
}

/** The model used when there is no record to choose by (the owner's default, 4k). */
export const DEFAULT_QUESTION_MODEL = "qwen-groq";

/** A model that failed this recently is skipped (for example, rate-limited). */
export const RECENT_FAILURE_MS = 10 * 60_000;

/** How many of each model's newest records count. */
const WINDOW = 20;

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? Number.POSITIVE_INFINITY;
};

/**
 * The order to try models in for a question: those with a record first, by success rate over
 * their newest 20 records, then by median speed; then those without a record, the default first.
 * A model that failed in the last 10 minutes is left out. With no usable model, the default
 * alone (if it has a key). Pure.
 */
export function rankModels(
  available: readonly string[],
  records: readonly ModelRecord[],
  now: Date,
): string[] {
  const scored = available.flatMap((model) => {
    const own = records
      .filter((record) => record.model === model)
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, WINDOW);
    const failedRecently = own.some(
      (record) => !record.ok && now.getTime() - record.at.getTime() < RECENT_FAILURE_MS,
    );
    if (failedRecently) return [];
    const successes = own.filter((record) => record.ok);
    return [
      {
        model,
        rated: own.length > 0,
        rate: own.length === 0 ? 0 : successes.length / own.length,
        speed: median(successes.flatMap((record) => record.latencyMs ?? [])),
      },
    ];
  });
  const rated = scored
    .filter((entry) => entry.rated)
    .sort((a, b) => b.rate - a.rate || a.speed - b.speed);
  const unrated = scored
    .filter((entry) => !entry.rated)
    .sort(
      (a, b) =>
        Number(b.model === DEFAULT_QUESTION_MODEL) - Number(a.model === DEFAULT_QUESTION_MODEL),
    );
  const order = [...rated, ...unrated].map((entry) => entry.model);
  if (order.length > 0) return order;
  return available.includes(DEFAULT_QUESTION_MODEL) ? [DEFAULT_QUESTION_MODEL] : [];
}
