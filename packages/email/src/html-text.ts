const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/** One HTML entity as its character; unknown named entities are left as written. */
function entity(match: string, name: string): string {
  if (name.startsWith("#x") || name.startsWith("#X")) {
    return String.fromCodePoint(Number.parseInt(name.slice(2), 16) || 32);
  }
  if (name.startsWith("#")) return String.fromCodePoint(Number(name.slice(1)) || 32);
  return ENTITIES[name.toLowerCase()] ?? match;
}

/**
 * The readable text of an HTML email, for one that has no plain-text part: scripts, styles and
 * comments are removed, line and block ends become line breaks, other tags are dropped, entities
 * are decoded and runs of spaces joined. Pure; the text is data, never run.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|head)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h[1-6]|blockquote)\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#?[a-zA-Z0-9]+);/g, entity)
    .split("\n")
    .map((line) => line.replace(/[ \t\u00a0]+/g, " ").trim())
    .filter((line, i, all) => line !== "" || (i > 0 && all[i - 1] !== ""))
    .join("\n")
    .trim();
}
