import { describe, expect, it } from "vitest";
import { sizeWords } from "./sizes.js";

describe("sizeWords", () => {
  it("says bytes, KB or MB", () => {
    expect(sizeWords(512)).toBe("512 bytes");
    expect(sizeWords(37 * 1024)).toBe("37 KB");
    expect(sizeWords(2.4 * 1024 * 1024)).toBe("2.4 MB");
  });
});
