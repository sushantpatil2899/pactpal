import { z } from "zod";

const text = z.string();

/**
 * One piece of a simple document, laid out top to bottom. Kept deliberately small: enough for a
 * receipt or an evidence packet, with every layout decision made by the writer.
 */
export const blockSchema = z.discriminatedUnion("kind", [
  /** The document's main title, large and bold. */
  z.object({ kind: z.literal("title"), text }),
  /** A section heading; never left alone at the bottom of a page. */
  z.object({ kind: z.literal("heading"), text }),
  /** Running text; line breaks in the text start new lines. `small` is for notes and footers. */
  z.object({
    kind: z.literal("paragraph"),
    text,
    style: z.enum(["normal", "small", "bold"]).optional(),
  }),
  /** Bulleted, or numbered when `numbered` is true. */
  z.object({ kind: z.literal("list"), items: z.array(text), numbered: z.boolean().optional() }),
  /** Label and value pairs, the labels in bold. */
  z.object({
    kind: z.literal("fields"),
    rows: z.array(z.object({ label: text, value: text })),
  }),
  /** A table with a bold header row and an optional bold footer row; long cells wrap. */
  z.object({
    kind: z.literal("table"),
    columns: z.array(text).min(1),
    rows: z.array(z.array(text)),
    footer: z.array(text).optional(),
  }),
  /** A fingerprint or other code: a label, then the value in a fixed-width font, wrapped anywhere. */
  z.object({ kind: z.literal("code"), label: text, value: text }),
]);
export type Block = z.infer<typeof blockSchema>;

export const pdfDocumentSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  /** Written into the file's details, so the same input always gives the same bytes. */
  createdAt: z.date(),
  blocks: z.array(blockSchema),
  /** Small text at the bottom left of every page, next to "Page n of m". */
  footer: z.string().optional(),
  /**
   * Added as a last paragraph when some character could not be drawn with the standard fonts and
   * was printed as "?", so a reader knows the text on paper is not exact.
   */
  replacedCharactersNote: z.string().optional(),
});
export type PdfDocumentInput = z.input<typeof pdfDocumentSchema>;
