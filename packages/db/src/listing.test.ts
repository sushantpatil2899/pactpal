import { TEST_LISTING } from "@pactpal/products/testing";
import { describe, expect, it } from "vitest";
import {
  changeOf,
  checkedScopeContentSchema,
  listingSnapshotSha256,
  scopeContentSchema,
  scopeFingerprint,
  type ScopeContentInput,
} from "./index.js";

const BASE: ScopeContentInput = {
  format: 1,
  summary: "Running shoes",
  deliverables: ["One pair, size 10"],
  exclusions: [],
  milestones: [{ title: "Full price", amountMinor: 5_000 }],
};

/** The test listing as an agreement keeps it, with one saved photo and its fingerprint. */
const LISTING = {
  ...TEST_LISTING,
  photos: [
    {
      artifactId: "00000000-0000-4000-8000-000000000601",
      sha256: "a".repeat(64),
      filename: "listing-photo-1.jpg",
    },
  ],
  snapshotSha256: listingSnapshotSha256(TEST_LISTING),
};

describe("the product as listed, in the agreement (8e)", () => {
  it("is kept with its fingerprint, and leaves agreements without it unchanged", () => {
    const withListing = checkedScopeContentSchema.parse({ ...BASE, listing: LISTING });
    expect(withListing.listing?.title).toBe("Men's Tree Runner");
    expect(scopeFingerprint(scopeContentSchema.parse(BASE))).toBe(
      scopeFingerprint(scopeContentSchema.parse({ ...BASE, listing: undefined })),
    );
    // The fingerprint covers the facts only, not the photos saved with them.
    expect(listingSnapshotSha256({ ...LISTING, photos: [] } as typeof LISTING)).toBe(
      LISTING.snapshotSha256,
    );
  });

  it("refuses facts that do not match their fingerprint", () => {
    const changed = checkedScopeContentSchema.safeParse({
      ...BASE,
      listing: { ...LISTING, title: "Something else" },
    });
    expect(changed.success).toBe(false);
    expect(changed.error?.issues.map((i) => i.path.join("."))).toEqual(["listing.snapshotSha256"]);
  });

  it("cannot be changed or added by a change order", () => {
    const signed = scopeContentSchema.parse({ ...BASE, listing: LISTING });
    const replaced = scopeContentSchema.parse({ ...BASE, listing: { ...LISTING, photos: [] } });
    expect(changeOf(signed, replaced)).toEqual({ ok: false, problems: ["listing"] });
    expect(changeOf(scopeContentSchema.parse(BASE), signed)).toEqual({
      ok: false,
      problems: ["listing"],
    });
  });
});
