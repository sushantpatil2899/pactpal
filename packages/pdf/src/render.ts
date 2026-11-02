import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { pdfDocumentSchema, type Block, type PdfDocumentInput } from "./blocks.js";

/** US Letter, in points (1/72 inch): the demo runs on US sandbox accounts. */
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 56;
/** Room kept at the bottom of each page for the footer line. */
const FOOTER_SPACE = 24;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const LEADING = 1.35;
const SIZE = { title: 18, heading: 13, normal: 10.5, small: 8.5, code: 9 } as const;
const INK = rgb(0.1, 0.1, 0.1);
const MUTED = rgb(0.35, 0.35, 0.35);
const RULE = rgb(0.7, 0.7, 0.7);
const LIST_INDENT = 16;
const CELL_PADDING = 6;

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  mono: PDFFont;
}

interface Style {
  font: PDFFont;
  size: number;
  color?: ReturnType<typeof rgb>;
}

/** Characters the standard fonts can draw (Windows-1252), shared by all three of them. */
type CharacterSet = ReadonlySet<number>;

/** The text with every character the standard fonts cannot draw shown as "?", tabs as spaces. */
function drawable(text: string, characters: CharacterSet): string {
  let out = "";
  for (const char of text.replace(/\t/g, " ").replace(/\r/g, "")) {
    const code = char.codePointAt(0) ?? 0;
    out += characters.has(code) ? char : "?";
  }
  return out;
}

/** Whether any character (other than line breaks and tabs) would be replaced. */
function needsReplacing(text: string, characters: CharacterSet): boolean {
  for (const char of text) {
    if ("\n\r\t".includes(char)) continue;
    if (!characters.has(char.codePointAt(0) ?? 0)) return true;
  }
  return false;
}

/** Every piece of text in a block, for the replacement check. */
function textsOf(block: Block): string[] {
  switch (block.kind) {
    case "title":
    case "heading":
    case "paragraph":
      return [block.text];
    case "list":
      return block.items;
    case "fields":
      return block.rows.flatMap((row) => [row.label, row.value]);
    case "table":
      return [...block.columns, ...block.rows.flat(), ...(block.footer ?? [])];
    case "code":
      return [block.label, block.value];
  }
}

/** Splits a word that is wider than `width` into pieces that fit. */
function breakWord(word: string, fits: (text: string) => boolean): string[] {
  const pieces: string[] = [];
  let piece = "";
  for (const char of word) {
    if (piece !== "" && !fits(piece + char)) {
      pieces.push(piece);
      piece = "";
    }
    piece += char;
  }
  return [...pieces, piece];
}

/** Lays out one document onto pages: a cursor that moves down and starts new pages as needed. */
class Layout {
  readonly pages: PDFPage[] = [];
  private page!: PDFPage;
  private y = 0;

  constructor(
    private readonly pdf: PDFDocument,
    readonly fonts: Fonts,
    private readonly characters: CharacterSet,
  ) {
    this.newPage();
  }

  private newPage(): void {
    this.page = this.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pages.push(this.page);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  /** Starts a new page unless `height` points still fit above the footer. */
  ensure(height: number): void {
    const room = this.y - (MARGIN + FOOTER_SPACE);
    const fullPage = PAGE_HEIGHT - 2 * MARGIN - FOOTER_SPACE;
    if (height > room && room < fullPage) this.newPage();
  }

  gap(points: number): void {
    this.y -= points;
  }

  /** The text as lines that fit `width`, breaking at spaces and inside over-long words. */
  wrap(text: string, style: Style, width: number): string[] {
    const fits = (line: string) => style.font.widthOfTextAtSize(line, style.size) <= width;
    return text
      .split("\n")
      .map((paragraph) => drawable(paragraph, this.characters))
      .flatMap((paragraph) => {
        const lines: string[] = [];
        let line = "";
        for (const word of paragraph.split(/ +/).filter((w) => w !== "")) {
          const candidate = line === "" ? word : `${line} ${word}`;
          if (fits(candidate)) {
            line = candidate;
            continue;
          }
          if (line !== "") lines.push(line);
          const pieces = fits(word) ? [word] : breakWord(word, fits);
          lines.push(...pieces.slice(0, -1));
          line = pieces.at(-1) ?? "";
        }
        return [...lines, line];
      });
  }

  lineHeight = (style: Style) => style.size * LEADING;

  /**
   * Draws rows of columns line by line: each column is its lines and where it starts. A row is
   * kept on one page when it fits on one.
   */
  columns(cells: { lines: string[]; x: number; style: Style }[]): void {
    const height = Math.max(
      ...cells.map((cell) => cell.lines.length * this.lineHeight(cell.style)),
    );
    this.ensure(height);
    const lineHeight = Math.max(...cells.map((cell) => this.lineHeight(cell.style)));
    const count = Math.max(...cells.map((cell) => cell.lines.length));
    for (let n = 0; n < count; n++) {
      this.ensure(lineHeight);
      this.y -= lineHeight;
      for (const { lines, x, style } of cells) {
        const line = lines[n];
        if (line === undefined || line === "") continue;
        this.page.drawText(line, {
          x: MARGIN + x,
          y: this.y + (lineHeight - style.size) / 2 + style.size * 0.2,
          size: style.size,
          font: style.font,
          color: style.color ?? INK,
        });
      }
    }
  }

  /** Text across the full width (or from `indent`). */
  text(text: string, style: Style, indent = 0): void {
    this.columns([{ lines: this.wrap(text, style, CONTENT_WIDTH - indent), x: indent, style }]);
  }

  rule(): void {
    this.page.drawLine({
      start: { x: MARGIN, y: this.y - 2 },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y - 2 },
      thickness: 0.5,
      color: RULE,
    });
    this.gap(4);
  }

  /** "Page n of m" on every page, with the footer text at the left. */
  footers(footer: string | undefined): void {
    const style: Style = { font: this.fonts.regular, size: SIZE.small, color: MUTED };
    this.pages.forEach((page, n) => {
      const number = `Page ${String(n + 1)} of ${String(this.pages.length)}`;
      const numberWidth = style.font.widthOfTextAtSize(number, style.size);
      const y = MARGIN - SIZE.small;
      page.drawText(number, { ...style, x: PAGE_WIDTH - MARGIN - numberWidth, y });
      const note =
        footer === undefined
          ? undefined
          : this.wrap(footer, style, CONTENT_WIDTH - numberWidth - 12)[0];
      if (note !== undefined && note !== "") page.drawText(note, { ...style, x: MARGIN, y });
    });
  }
}

/** Column widths that fit the page: narrow columns keep their natural width, wide ones share the rest. */
function columnWidths(natural: number[]): number[] {
  const widths = [...natural];
  let spare = CONTENT_WIDTH;
  let open = widths.map((_, n) => n);
  // Give every column that fits in an equal share its natural width; repeat with what is left.
  for (;;) {
    const share = spare / open.length;
    const fitting = open.filter((n) => (natural[n] ?? 0) <= share);
    if (fitting.length === 0) break;
    for (const n of fitting) spare -= natural[n] ?? 0;
    open = open.filter((n) => !fitting.includes(n));
    if (open.length === 0) return widths;
  }
  for (const n of open) widths[n] = spare / open.length;
  return widths;
}

function drawBlock(layout: Layout, block: Block): void {
  const { regular, bold, mono } = layout.fonts;
  const normal: Style = { font: regular, size: SIZE.normal };
  const strong: Style = { font: bold, size: SIZE.normal };
  switch (block.kind) {
    case "title":
      layout.text(block.text, { font: bold, size: SIZE.title });
      layout.gap(4);
      return;
    case "heading": {
      const style: Style = { font: bold, size: SIZE.heading };
      layout.gap(10);
      // Keep the heading with at least two lines of what follows.
      layout.ensure(layout.lineHeight(style) + 2 * layout.lineHeight(normal));
      layout.text(block.text, style);
      layout.gap(2);
      return;
    }
    case "paragraph": {
      const styles: Record<NonNullable<typeof block.style>, Style> = {
        normal,
        bold: strong,
        small: { font: regular, size: SIZE.small, color: MUTED },
      };
      layout.text(block.text, styles[block.style ?? "normal"]);
      layout.gap(6);
      return;
    }
    case "list":
      block.items.forEach((item, n) => {
        const marker = block.numbered === true ? `${String(n + 1)}.` : "•";
        layout.columns([
          { lines: [marker], x: 0, style: normal },
          {
            lines: layout.wrap(item, normal, CONTENT_WIDTH - LIST_INDENT),
            x: LIST_INDENT,
            style: normal,
          },
        ]);
        layout.gap(2);
      });
      layout.gap(4);
      return;
    case "fields": {
      const widest = Math.max(
        ...block.rows.map((row) => bold.widthOfTextAtSize(row.label, SIZE.normal)),
      );
      const labelWidth = Math.min(widest + 12, CONTENT_WIDTH * 0.4);
      for (const row of block.rows) {
        layout.columns([
          { lines: layout.wrap(row.label, strong, labelWidth - 12), x: 0, style: strong },
          {
            lines: layout.wrap(row.value, normal, CONTENT_WIDTH - labelWidth),
            x: labelWidth,
            style: normal,
          },
        ]);
        layout.gap(2);
      }
      layout.gap(4);
      return;
    }
    case "table": {
      const all = [block.columns, ...block.rows, ...(block.footer ? [block.footer] : [])];
      const natural = block.columns.map(
        (_, c) =>
          Math.max(...all.map((row) => bold.widthOfTextAtSize(row[c] ?? "", SIZE.normal))) +
          CELL_PADDING * 2,
      );
      const widths = columnWidths(natural);
      const starts = widths.map((_, c) => widths.slice(0, c).reduce((sum, w) => sum + w, 0));
      const row = (cells: readonly string[], style: Style) => {
        layout.columns(
          block.columns.map((_, c) => ({
            lines: layout.wrap(cells[c] ?? "", style, (widths[c] ?? 0) - CELL_PADDING * 2),
            x: (starts[c] ?? 0) + CELL_PADDING,
            style,
          })),
        );
      };
      row(block.columns, strong);
      layout.rule();
      for (const cells of block.rows) row(cells, normal);
      if (block.footer) {
        layout.rule();
        row(block.footer, strong);
      }
      layout.gap(6);
      return;
    }
    case "code": {
      layout.text(block.label, { font: bold, size: SIZE.small });
      layout.text(block.value, { font: mono, size: SIZE.code });
      layout.gap(6);
      return;
    }
  }
}

/** What `renderPdf` made. */
export interface RenderedPdf {
  bytes: Uint8Array;
  pageCount: number;
  /** True when some character could not be drawn and was printed as "?". */
  replacedCharacters: boolean;
}

/**
 * Lays out a simple document as a PDF with the standard fonts (no font files to ship). Pure: the
 * same input always gives the same bytes, because the file's dates come from `createdAt` and
 * nothing random is written. Characters the standard fonts cannot draw are printed as "?".
 */
export async function renderPdf(input: PdfDocumentInput): Promise<RenderedPdf> {
  const document = pdfDocumentSchema.parse(input);
  const pdf = await PDFDocument.create({ updateMetadata: false });
  pdf.setTitle(document.title);
  pdf.setAuthor(document.author);
  pdf.setCreator("PactPal");
  pdf.setProducer("PactPal (pdf-lib)");
  pdf.setCreationDate(document.createdAt);
  pdf.setModificationDate(document.createdAt);
  const fonts: Fonts = {
    regular: pdf.embedStandardFont(StandardFonts.Helvetica),
    bold: pdf.embedStandardFont(StandardFonts.HelveticaBold),
    mono: pdf.embedStandardFont(StandardFonts.Courier),
  };
  const characters = new Set(fonts.regular.getCharacterSet());

  const texts = [...document.blocks.flatMap(textsOf), document.footer ?? ""];
  const replacedCharacters = texts.some((text) => needsReplacing(text, characters));
  const blocks: Block[] =
    replacedCharacters && document.replacedCharactersNote !== undefined
      ? [
          ...document.blocks,
          { kind: "paragraph", text: document.replacedCharactersNote, style: "small" },
        ]
      : document.blocks;

  const layout = new Layout(pdf, fonts, characters);
  for (const block of blocks) drawBlock(layout, block);
  layout.footers(document.footer);
  const bytes = await pdf.save({ useObjectStreams: false });
  return { bytes, pageCount: layout.pages.length, replacedCharacters };
}
