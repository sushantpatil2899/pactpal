import { detectMediaType, isPlainFileName, type MediaType } from "@pactpal/ledger";
import { EvidenceFileError } from "./errors.js";

/** PayPal's per-file limit for dispute evidence. Its total limit is measured in sandbox test 6. */
export const MAX_EVIDENCE_FILE_BYTES = 10 * 1024 * 1024;

export type EvidenceContentType = MediaType;

/** A file to upload with evidence or an appeal. */
export interface EvidenceFile {
  filename: string;
  bytes: Uint8Array;
}

export interface CheckedEvidenceFile extends EvidenceFile {
  contentType: EvidenceContentType;
}

/**
 * Checks files before upload: a plain name, not empty, at most 10 MB, and
 * really a PDF, PNG, JPEG or GIF. Throws EvidenceFileError naming the file.
 */
export function checkEvidenceFiles(files: readonly EvidenceFile[]): CheckedEvidenceFile[] {
  return files.map((file) => {
    const { filename, bytes } = file;
    if (!isPlainFileName(filename)) {
      throw new EvidenceFileError(filename, "file name must be 1-255 characters without slashes");
    }
    if (bytes.length === 0) throw new EvidenceFileError(filename, "file is empty");
    if (bytes.length > MAX_EVIDENCE_FILE_BYTES) {
      throw new EvidenceFileError(filename, "file is larger than 10 MB");
    }
    const contentType = detectMediaType(bytes);
    if (contentType === undefined) {
      throw new EvidenceFileError(filename, "file is not a PDF, PNG, JPEG or GIF");
    }
    return { ...file, contentType };
  });
}
