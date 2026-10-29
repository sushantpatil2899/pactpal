import { EvidenceFileError } from "./errors.js";

/** PayPal's per-file limit for dispute evidence. Its total limit is measured in sandbox test 6. */
export const MAX_EVIDENCE_FILE_BYTES = 10 * 1024 * 1024;

export type EvidenceContentType = "application/pdf" | "image/png" | "image/jpeg" | "image/gif";

/** A file to upload with evidence or an appeal. */
export interface EvidenceFile {
  filename: string;
  bytes: Uint8Array;
}

export interface CheckedEvidenceFile extends EvidenceFile {
  contentType: EvidenceContentType;
}

// Each accepted type, recognised by the bytes it starts with rather than by its name.
const SIGNATURES: { type: EvidenceContentType; prefix: number[] }[] = [
  { type: "application/pdf", prefix: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
  { type: "image/png", prefix: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { type: "image/jpeg", prefix: [0xff, 0xd8, 0xff] },
  { type: "image/gif", prefix: [0x47, 0x49, 0x46, 0x38] }, // GIF8
];

function detectType(bytes: Uint8Array): EvidenceContentType | undefined {
  return SIGNATURES.find(({ prefix }) => prefix.every((byte, i) => bytes[i] === byte))?.type;
}

/**
 * Checks files before upload: a plain name, not empty, at most 10 MB, and
 * really a PDF, PNG, JPEG or GIF. Throws EvidenceFileError naming the file.
 */
export function checkEvidenceFiles(files: readonly EvidenceFile[]): CheckedEvidenceFile[] {
  return files.map((file) => {
    const { filename, bytes } = file;
    if (!/^[^/\\]{1,255}$/.test(filename)) {
      throw new EvidenceFileError(filename, "file name must be 1-255 characters without slashes");
    }
    if (bytes.length === 0) throw new EvidenceFileError(filename, "file is empty");
    if (bytes.length > MAX_EVIDENCE_FILE_BYTES) {
      throw new EvidenceFileError(filename, "file is larger than 10 MB");
    }
    const contentType = detectType(bytes);
    if (contentType === undefined) {
      throw new EvidenceFileError(filename, "file is not a PDF, PNG, JPEG or GIF");
    }
    return { ...file, contentType };
  });
}
