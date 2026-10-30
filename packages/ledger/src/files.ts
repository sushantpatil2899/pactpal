import { sha256Hex } from "./canonical.js";

export interface FileFingerprint {
  sha256: string;
  size: number;
  filename: string;
}

export function hashFile(bytes: Uint8Array, filename: string): FileFingerprint {
  return { sha256: sha256Hex(bytes), size: bytes.byteLength, filename };
}

/** True only if the bytes are exactly the file that was fingerprinted. */
export function verifyFile(bytes: Uint8Array, expected: FileFingerprint): boolean {
  return bytes.byteLength === expected.size && sha256Hex(bytes) === expected.sha256;
}

/** File types recognised by their first bytes. Evidence uploads to PayPal accept exactly these. */
export type MediaType = "application/pdf" | "image/png" | "image/jpeg" | "image/gif";

// Each type, recognised by the bytes it starts with rather than by its name.
const SIGNATURES: { type: MediaType; prefix: number[] }[] = [
  { type: "application/pdf", prefix: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
  { type: "image/png", prefix: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { type: "image/jpeg", prefix: [0xff, 0xd8, 0xff] },
  { type: "image/gif", prefix: [0x47, 0x49, 0x46, 0x38] }, // GIF8
];

/** The type the bytes really are (PDF, PNG, JPEG or GIF), or undefined; the file name is never used. */
export function detectMediaType(bytes: Uint8Array): MediaType | undefined {
  return SIGNATURES.find(({ prefix }) => prefix.every((byte, i) => bytes[i] === byte))?.type;
}

/** A control character: below the space, or delete. */
const isControl = (code: number): boolean => code < 0x20 || code === 0x7f;
const isAllowedWhitespace = (code: number): boolean =>
  code === 0x09 || code === 0x0a || code === 0x0d;

/** True if the bytes are valid UTF-8 text with no control characters but tab and line breaks (a pasted chat, say). */
export function isPlainText(bytes: Uint8Array): boolean {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return false;
  }
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (isControl(code) && !isAllowedWhitespace(code)) return false;
  }
  return true;
}

/** A plain file name: 1 to 255 characters, no slashes, no control characters. */
export function isPlainFileName(name: string): boolean {
  if (name.length < 1 || name.length > 255 || name.includes("/") || name.includes("\\")) {
    return false;
  }
  for (const char of name) {
    if (isControl(char.charCodeAt(0))) return false;
  }
  return true;
}
