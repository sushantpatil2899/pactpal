/** A file type code can recognise from the bytes. */
export type CheckedFormat = "png" | "jpeg" | "gif" | "pdf";

/**
 * Something a delivered line asks for that code can check, read from the line's words by fixed
 * rules (never by AI): a file type, a transparent background, a minimum or exact pixel size; or a
 * file type it names that code cannot check (for example SVG).
 */
export type Requirement =
  | { kind: "format"; format: CheckedFormat }
  | { kind: "transparent" }
  | { kind: "min"; side: "height" | "width"; px: number }
  | { kind: "exact"; width: number; height: number }
  | { kind: "unchecked-format"; name: string };

const FORMATS: { format: CheckedFormat; pattern: RegExp }[] = [
  { format: "png", pattern: /\bpng\b/i },
  { format: "jpeg", pattern: /\bjpe?g\b/i },
  { format: "gif", pattern: /\bgif\b/i },
  { format: "pdf", pattern: /\bpdf\b/i },
];

/** Formats people name for deliveries that code does not recognise from the bytes. */
const OTHER_FORMATS = /\b(svg|psd|eps|tiff?|webp|heic|mp4|mov|zip|docx?|xlsx?|pptx?|ai file)\b/gi;

/** A matched group as a number, commas removed. */
const number = (match: RegExpMatchArray, group: number) =>
  Number((match[group] ?? "").replaceAll(",", ""));

/** What a line asks for that code can check, in a fixed order, each once. Pure. */
export function lineRequirements(text: string): Requirement[] {
  const found: Requirement[] = FORMATS.filter(({ pattern }) => pattern.test(text)).map(
    ({ format }) => ({ kind: "format", format }),
  );
  if (/\btransparen(t|cy)\b/i.test(text)) found.push({ kind: "transparent" });
  for (const match of text.matchAll(
    /(?:at least|min(?:imum)?\.?)?\s*(\d[\d,]*)\s*(?:px|pixels?)\s+(tall|high|wide)\b/gi,
  )) {
    const side = /wide/i.test(match[2] ?? "") ? "width" : "height";
    found.push({ kind: "min", side, px: number(match, 1) });
  }
  for (const match of text.matchAll(/\b(\d{2,5})\s*[x×]\s*(\d{2,5})\b/gi)) {
    found.push({ kind: "exact", width: number(match, 1), height: number(match, 2) });
  }
  const others = new Set([...text.matchAll(OTHER_FORMATS)].map((m) => m[0].toUpperCase()));
  for (const name of others) found.push({ kind: "unchecked-format", name });
  return found;
}
