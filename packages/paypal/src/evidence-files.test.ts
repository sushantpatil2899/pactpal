import { describe, expect, it } from "vitest";
import { EvidenceFileError } from "./errors.js";
import { MAX_EVIDENCE_FILE_BYTES, checkEvidenceFiles } from "./evidence-files.js";

const bytes = (...values: number[]) => new Uint8Array(values);
const pdf = bytes(0x25, 0x50, 0x44, 0x46, 0x2d, 0x31);

describe("checkEvidenceFiles", () => {
  it.each([
    ["receipt.pdf", pdf, "application/pdf"],
    ["shot.png", bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0), "image/png"],
    ["photo.jpg", bytes(0xff, 0xd8, 0xff, 0xe0), "image/jpeg"],
    ["anim.gif", bytes(0x47, 0x49, 0x46, 0x38, 0x39, 0x61), "image/gif"],
    // The type comes from the contents, not the name.
    ["misnamed.txt", pdf, "application/pdf"],
  ])("recognises %s", (filename, content, type) => {
    expect(checkEvidenceFiles([{ filename, bytes: content }])).toEqual([
      { filename, bytes: content, contentType: type },
    ]);
  });

  it.each([
    ["notes.txt", bytes(0x68, 0x69), "notes.txt: file is not a PDF, PNG, JPEG or GIF"],
    ["fake.pdf", bytes(0x25, 0x50), "fake.pdf: file is not a PDF, PNG, JPEG or GIF"],
    ["empty.pdf", bytes(), "empty.pdf: file is empty"],
    ["../etc.pdf", pdf, "../etc.pdf: file name must be 1-255 characters without slashes"],
    ["", pdf, ": file name must be 1-255 characters without slashes"],
  ])("rejects %j", (filename, content, message) => {
    expect(() => checkEvidenceFiles([{ filename, bytes: content }])).toThrow(
      new EvidenceFileError(filename, message.slice(filename.length + 2)),
    );
  });

  it("rejects a file over 10 MB but accepts exactly 10 MB", () => {
    const big = new Uint8Array(MAX_EVIDENCE_FILE_BYTES + 1);
    big.set(pdf);
    expect(() => checkEvidenceFiles([{ filename: "big.pdf", bytes: big }])).toThrow(
      "big.pdf: file is larger than 10 MB",
    );
    expect(
      checkEvidenceFiles([
        { filename: "max.pdf", bytes: big.subarray(0, MAX_EVIDENCE_FILE_BYTES) },
      ]),
    ).toHaveLength(1);
  });
});
