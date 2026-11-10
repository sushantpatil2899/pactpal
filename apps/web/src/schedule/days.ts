/** `day` (YYYY-MM-DD) moved by `count` days. */
export function addDays(day: string, count: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}

/** The later of two days. */
export const laterDay = (a: string, b: string): string => (a > b ? a : b);

/** The earlier of two days. */
export const earlierDay = (a: string, b: string): string => (a < b ? a : b);

/** Whole days from `from` to `to`. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}
