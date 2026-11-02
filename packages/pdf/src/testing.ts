import { inflateSync } from "node:zlib";

/**
 * Test code only: the lines of text drawn in a PDF made by `renderPdf`, in drawing order. Page
 * streams are compressed, and the standard fonts write each line as a hex string
 * (`<48656C6C6F> Tj`) in Windows-1252, read here as Latin-1.
 */
export function pdfTextLines(bytes: Uint8Array): string[] {
  const raw = Buffer.from(bytes).toString("latin1");
  const lines: string[] = [];
  for (const match of raw.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
    let content: string;
    try {
      content = inflateSync(Buffer.from(match[1] ?? "", "latin1")).toString("latin1");
    } catch {
      continue;
    }
    for (const hex of content.matchAll(/<([0-9A-Fa-f]*)> Tj/g)) {
      lines.push(Buffer.from(hex[1] ?? "", "hex").toString("latin1"));
    }
  }
  return lines;
}
