import type { ScreenshotReading } from "./api";

const plural = (n: number, one: string, many: string) => `${String(n)} ${n === 1 ? one : many}`;

/** The notice above the chat box after screenshots were read: what to check, and what is missing. */
export function screenshotNotice(reading: ScreenshotReading): string {
  const read = reading.screenshots.filter((s) => s.read).length;
  const missed = reading.screenshots.filter((s) => !s.read).map((s) => s.filename);
  if (read === 0) {
    return "No screenshot could be read. Type or paste the chat instead.";
  }
  const parts = [
    `Read by AI from ${plural(read, "screenshot", "screenshots")}. Check every line against the screenshots before drafting; the AI can misread names, prices or dates.`,
  ];
  if (reading.unreadable > 0) {
    parts.push(
      `${plural(reading.unreadable, "word", "words")} could not be read and ${reading.unreadable === 1 ? "shows" : "show"} as [unreadable].`,
    );
  }
  if (missed.length > 0) parts.push(`Not read: ${missed.join(", ")}. Type or paste that part.`);
  return parts.join(" ");
}
