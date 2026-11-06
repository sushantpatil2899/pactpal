import { describe, expect, it } from "vitest";
import { missingFromPacket } from "./appeal-coverage.js";

const exhibit = (sha: string, number?: number) => ({
  id: sha,
  filename: `${sha}.png`,
  addedBy: "seller" as const,
  sha256: sha.repeat(64),
  sizeBytes: 10,
  send: number === undefined ? ("left-out" as const) : ("as-is" as const),
  ...(number === undefined ? { reason: "unticked" as const } : { number }),
});

describe("what an appeal's packet leaves out", () => {
  it("needs each document among the included exhibits and each entry inside the timeline", () => {
    const packet = { chainEntries: 19, exhibits: [exhibit("a", 1), exhibit("b")] };
    expect(missingFromPacket(["Daaaaaa", "Dbbbbbb", "E19", "E20"], packet)).toEqual([
      "Dbbbbbb",
      "E20",
    ]);
    expect(missingFromPacket([], packet)).toEqual([]);
  });
});
