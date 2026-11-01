import { ALL_MISSING_DRAFT, MAYA_DRAFT } from "@pactpal/scope-draft/testing";
import { describe, expect, it } from "vitest";
import { councilRecordOf } from "../council-test-support.js";
import { isUnranked } from "./council-record.js";

const two = [
  { modelName: "a", draft: MAYA_DRAFT },
  { modelName: "b", draft: ALL_MISSING_DRAFT },
];

describe("isUnranked", () => {
  it("is true with at least two valid drafts and no counted ranking", () => {
    expect(isUnranked(councilRecordOf(two, 0))).toBe(true);
    expect(isUnranked(councilRecordOf([...two, { modelName: "c", draft: MAYA_DRAFT }], 0))).toBe(
      true,
    );
  });

  it("is false when any ranking was counted", () => {
    expect(isUnranked(councilRecordOf(two, 1))).toBe(false);
    expect(isUnranked(councilRecordOf([...two, { modelName: "c", draft: MAYA_DRAFT }], 2))).toBe(
      false,
    );
  });

  it("is false with a single valid draft, where there is nothing to choose between", () => {
    expect(isUnranked(councilRecordOf(two.slice(0, 1), 0))).toBe(false);
    expect(isUnranked(councilRecordOf([], 0))).toBe(false);
  });
});
