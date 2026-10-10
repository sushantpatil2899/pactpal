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
