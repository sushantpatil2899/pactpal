import { createHash } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { renderPdf, type Block, type PdfDocumentInput } from "./index.js";
import { pdfTextLines as linesOf } from "./testing.js";

const AT = new Date("2026-11-01T22:06:00.000Z");

const doc = (blocks: Block[], extra: Partial<PdfDocumentInput> = {}): PdfDocumentInput => ({
  title: "Test document",
  author: "PactPal",
  createdAt: AT,
  blocks,
  ...extra,
});

const words = (count: number) =>
  Array.from({ length: count }, (_, n) => `word${String(n)}`).join(" ");

describe("renderPdf", () => {
  it("writes every kind of block, with the file's details fixed by the input", async () => {
    const { bytes, pageCount, replacedCharacters } = await renderPdf(
      doc(
        [
          { kind: "title", text: "Agreement receipt" },
          { kind: "heading", text: "The deal" },
          { kind: "paragraph", text: "First line\nSecond line" },
          { kind: "paragraph", text: "Bold words", style: "bold" },
          { kind: "paragraph", text: "Small print", style: "small" },
          { kind: "list", items: ["One item", "Another item"] },
          { kind: "list", items: ["Step one", "Step two"], numbered: true },
          { kind: "fields", rows: [{ label: "Seller", value: "Maya" }] },
          {
            kind: "table",
            columns: ["Stage", "Amount", "Due"],
            rows: [["Sketch", "120.00", ""]],
            footer: ["Total", "240.00", ""],
          },
          { kind: "code", label: "Signed page", value: "ab".repeat(32) },
        ],
        { footer: "PactPal sandbox demo" },
      ),
    );
    expect(Buffer.from(bytes.subarray(0, 5)).toString()).toBe("%PDF-");
    expect(pageCount).toBe(1);
    expect(replacedCharacters).toBe(false);
    const lines = linesOf(bytes);
    for (const expected of [
      "Agreement receipt",
      "The deal",
      "First line",
      "Second line",
      "Bold words",
      "Small print",
      "•".normalize() === "•" ? "One item" : "",
      "1.",
      "Step two",
      "Seller",
      "Maya",
      "Stage",
      "Sketch",
      "Total",
      "240.00",
      "Signed page",
      "PactPal sandbox demo",
      "Page 1 of 1",
    ]) {
      expect(lines).toContain(expected);
    }
    expect(lines.join("")).toContain("ab".repeat(32));

    const loaded = await PDFDocument.load(bytes, { updateMetadata: false });
    expect(loaded.getTitle()).toBe("Test document");
    expect(loaded.getAuthor()).toBe("PactPal");
    expect(loaded.getCreationDate()?.toISOString()).toBe(AT.toISOString());
    expect(loaded.getModificationDate()?.toISOString()).toBe(AT.toISOString());
  });

  it("gives exactly the same bytes for the same input", async () => {
    const input = doc([{ kind: "paragraph", text: words(40) }]);
    const [first, second] = await Promise.all([renderPdf(input), renderPdf(input)]);
    expect(Buffer.from(first.bytes).equals(Buffer.from(second.bytes))).toBe(true);
  });

  it("wraps long text, breaks words that are too long and starts new pages", async () => {
    const { bytes, pageCount } = await renderPdf(
      doc(
        [
          { kind: "paragraph", text: words(2000) },
          { kind: "code", label: "Long code", value: "f".repeat(300) },
          { kind: "paragraph", text: "x".repeat(400) },
        ],
        { footer: "Footer" },
      ),
    );
    expect(pageCount).toBeGreaterThan(2);
    const lines = linesOf(bytes);
    expect(lines).toContain(`Page ${String(pageCount)} of ${String(pageCount)}`);
    expect(lines.filter((line) => line === "Footer")).toHaveLength(pageCount);
    // Nothing lost: every word is drawn once, and the long word is split across lines.
    expect(
      lines
        .filter((line) => line.startsWith("word"))
        .join(" ")
        .split(" "),
    ).toHaveLength(2000);
    expect(lines.filter((line) => /^x+$/.test(line)).join("")).toBe("x".repeat(400));
    expect(lines.filter((line) => /^f+$/.test(line)).join("")).toBe("f".repeat(300));
  });

  it("keeps a heading with what follows it", async () => {
    // Enough lines to fill a page almost to the bottom, then a heading.
    const filler: Block[] = Array.from({ length: 49 }, (_, n) => ({
      kind: "paragraph" as const,
      text: `Line ${String(n)}`,
      style: "small" as const,
    }));
    const { bytes, pageCount } = await renderPdf(
      doc([
        ...filler,
        { kind: "heading", text: "Next section" },
        { kind: "paragraph", text: "Body" },
      ]),
    );
    expect(pageCount).toBe(2);
    const lines = linesOf(bytes);
    // Page 1's footer comes after the filler; the heading is drawn on page 2 with its body.
    expect(lines.indexOf("Next section")).toBeGreaterThan(lines.indexOf("Line 48"));
    expect(lines.indexOf("Body")).toBe(lines.indexOf("Next section") + 1);
  });

  it("shares a narrow page between wide table columns and wraps long cells", async () => {
    const long = words(40);
    const { bytes } = await renderPdf(
      doc([
        {
          kind: "table",
          columns: ["Short", "Wide one", "Wide two"],
          rows: [["A", long, long], ["B"]],
        },
        { kind: "table", columns: [long, long], rows: [] },
      ]),
    );
    const lines = linesOf(bytes);
    expect(lines).toContain("A");
    expect(lines).toContain("B");
    expect(lines.filter((line) => line.startsWith("word0")).length).toBeGreaterThanOrEqual(2);
  });

  it("prints characters the standard fonts cannot draw as '?' and adds the note", async () => {
    const note = "Some characters could not be shown here.";
    const { bytes, replacedCharacters } = await renderPdf(
      doc([{ kind: "fields", rows: [{ label: "Signed by", value: "José 李 \u{1F600}" }] }], {
        replacedCharactersNote: note,
      }),
    );
    expect(replacedCharacters).toBe(true);
    const lines = linesOf(bytes);
    expect(lines).toContain("José ? ?");
    expect(lines).toContain(note);
  });

  it("measures field labels and table cells as drawn, so no character makes it fail", async () => {
    const { bytes, replacedCharacters } = await renderPdf(
      doc(
        [
          { kind: "fields", rows: [{ label: "Non\u2011breaking", value: "ok" }] },
          { kind: "table", columns: ["Step", "Note"], rows: [["1", "re\u2011checked \u{1F600}"]] },
        ],
        { replacedCharactersNote: "Note" },
      ),
    );
    expect(replacedCharacters).toBe(true);
    const lines = linesOf(bytes);
    expect(lines).toContain("Non?breaking");
    expect(lines.join(" ")).toContain("re?checked ?");
  });

  it("adds no note when every character can be drawn, or when no note is given", async () => {
    const plain = await renderPdf(
      doc([{ kind: "paragraph", text: "Crème brûlée\tand\r\nmore" }], {
        replacedCharactersNote: "Note",
      }),
    );
    expect(plain.replacedCharacters).toBe(false);
    expect(linesOf(plain.bytes)).toEqual(["Crème brûlée and", "more", "Page 1 of 1"]);

    const withoutNote = await renderPdf(doc([{ kind: "heading", text: "李" }], { footer: "李" }));
    expect(withoutNote.replacedCharacters).toBe(true);
    expect(linesOf(withoutNote.bytes)).toEqual(["?", "Page 1 of 1", "?"]);
  });

  it("draws a plain document exactly as before the branded look existed (9h)", async () => {
    // Receipts signed before 9h are drawn again on every download; their bytes must not move.
    const { bytes } = await renderPdf({
      title: "T",
      author: "PactPal",
      createdAt: new Date("2026-11-02T10:00:00Z"),
      footer: "PactPal receipt, format 1",
      blocks: [
        { kind: "title", text: "PactPal agreement receipt" },
        { kind: "heading", text: "The deal" },
        { kind: "paragraph", text: "Hello world ".repeat(80) },
        { kind: "list", items: ["a", "b"] },
        { kind: "table", columns: ["x", "y"], rows: [["1", "2"]] },
        { kind: "code", label: "SHA", value: "a".repeat(64) },
      ],
    });
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(
      "aab75caf4fb2cf6a333caccc495b77d2db4da43c3f04cdee4c92d2255399486c",
    );
  });

  it("puts the logo, name and reference on every page of a branded document, the same every time", async () => {
    const input = doc(
      [
        { kind: "title", text: "Agreement receipt" },
        { kind: "heading", text: "The deal" },
        { kind: "paragraph", text: words(900) },
      ],
      { brand: { reference: "Receipt, version 2", headings: "accent" }, footer: "Receipt" },
    );
    const branded = await renderPdf(input);
    expect(branded.pageCount).toBeGreaterThan(1);
    const lines = linesOf(branded.bytes);
    expect(lines.filter((line) => line === "PactPal")).toHaveLength(branded.pageCount);
    expect(lines.filter((line) => line === "Receipt, version 2")).toHaveLength(branded.pageCount);
    expect((await renderPdf(input)).bytes).toEqual(branded.bytes);
    const plain = await renderPdf({ ...input, brand: undefined });
    expect(linesOf(plain.bytes)).not.toContain("Receipt, version 2");
    const ink = await renderPdf({ ...input, brand: { reference: "Packet", headings: "ink" } });
    expect(ink.bytes).not.toEqual(branded.bytes);
  });

  it("refuses a document without a title", async () => {
    await expect(renderPdf(doc([], { title: "" }))).rejects.toThrow();
  });
});
