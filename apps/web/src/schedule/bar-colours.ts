/**
 * What a bar's colour means, the same on the deal's chart and on Deadlines: grey is done, green
 * is in hand, amber is held up or disputed, red is late or a dispute with no evidence prepared.
 */
export const BAR_COLOURS = {
  done: "var(--color-ink-3)",
  current: "var(--color-accent)",
  due: "var(--color-accent)",
  todo: "var(--color-accent-2)",
  held: "var(--color-wait)",
  dispute: "var(--color-wait)",
  late: "var(--color-alert)",
  "dispute-bare": "var(--color-alert)",
} as const;

/** The line that marks today on a chart. */
export const TODAY_LINE = { showCurrentTimeLine: true };
