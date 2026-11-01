/** A date and time in UTC, as the pages show it. */
export const when = (iso: string): string =>
  `${new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`;

/** Milliseconds as seconds with one decimal, e.g. "12.5 s". */
export const seconds = (ms: number): string => `${(ms / 1000).toFixed(1)} s`;

/** How closely the models' rankings agreed, in words (the council flags anything under 0.5). */
export function agreementWords(agreement: number): string {
  if (agreement >= 0.7) return "high";
  if (agreement >= 0.5) return "moderate";
  return "low";
}

/** Line numbers in words: "line 5", "lines 5 and 21", "lines 2, 5 and 21". */
export function lineNumbers(numbers: readonly number[]): string {
  const words = numbers.map(String);
  const last = words.at(-1);
  if (words.length < 2 || last === undefined) return `line ${words.join("")}`;
  return `lines ${words.slice(0, -1).join(", ")} and ${last}`;
}
