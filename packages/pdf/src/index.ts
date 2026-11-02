/** Simple PDF documents (receipts, evidence packets) laid out from plain blocks. */
export { blockSchema, pdfDocumentSchema } from "./blocks.js";
export type { Block, PdfDocumentInput } from "./blocks.js";
export { renderPdf } from "./render.js";
export type { RenderedPdf } from "./render.js";
