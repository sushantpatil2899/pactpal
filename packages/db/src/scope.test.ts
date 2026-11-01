import { canonicalJson, sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  DealNotFoundError,
  addArtifact,
  failDraft,
  finishDraft,
  postgresContentStore,
  startDraft,
  MAX_MILESTONE_MINOR,
  ScopeIntegrityError,
  ScopeNotAllowedError,
  createDeal,
  getLatestScope,
  getScopeVersion,
  readLedger,
  saveScopeVersion,
  scopeContentSchema,
  verifyStoredLedger,
  type SaveScope,
  type ScopeContentInput,
} from "./index.js";
import { TEST_NOW, createTestDeal, testDeal, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);

/** Valid agreed work; override any field to test a rule. */
const content = (overrides: Partial<ScopeContentInput> = {}): ScopeContentInput => ({
  format: 1,
  summary: "A logo for a bakery",
  deliverables: ["Three logo concepts", "Final logo as SVG and PNG"],
  exclusions: ["Printing"],
  revisionsIncluded: 2,
  dueDate: "2026-11-20",
  milestones: [
    { title: "Concepts", amountMinor: 10_000 },
    { title: "Final files", amountMinor: 15_050, dueDate: "2026-11-20" },
  ],
  ...overrides,
});

describe("saveScopeVersion", () => {
  it("saves version 1, logs its fingerprint and total, and reads back unchanged", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const { scope, entry } = await saveScopeVersion(
      db,
      { dealId, sellerId: seller.id, content: content({ summary: "  A logo for a bakery " }) },
      at(1),
    );
    const expected = scopeContentSchema.parse(content());
    expect(scope).toEqual({
      dealId,
      version: 1,
      content: expected,
      contentSha256: sha256Hex(canonicalJson(expected)),
      createdBy: seller.id,
      ledgerSeq: 1,
      createdAt: at(1),
    });
    expect(entry).toMatchObject({
      seq: 1,
      type: "SCOPE_VERSIONED",
      actor: "seller",
      actorId: seller.id,
      payload: {
        version: 1,
        format: 1,
        contentSha256: scope.contentSha256,
        totalMinor: 25_050,
        currency: "USD",
        milestoneCount: 2,
      },
    });
    expect(await getLatestScope(db, dealId)).toEqual(scope);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("numbers each save, keeps the old versions and returns the newest", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const first = await saveScopeVersion(
      db,
      { dealId, sellerId: seller.id, content: content() },
      at(1),
    );
    const second = await saveScopeVersion(
      db,
      { dealId, sellerId: seller.id, content: content({ summary: "Changed" }) },
      at(2),
    );
    expect(second.scope.version).toBe(2);
    expect(await getLatestScope(db, dealId)).toEqual(second.scope);
    expect(await getScopeVersion(db, dealId, 1)).toEqual(first.scope);
    expect(await getScopeVersion(db, dealId, 3)).toBeUndefined();
    expect((await readLedger(db, dealId)).map((e) => e.type)).toEqual([
      "DEAL_CREATED",
      "SCOPE_VERSIONED",
      "SCOPE_VERSIONED",
    ]);
  });

  it("gives nothing for a deal without agreed work", async () => {
    const { dealId } = await createTestDeal(db);
    expect(await getLatestScope(db, dealId)).toBeUndefined();
  });

  it("refuses the buyer, an unknown deal and a deal that is no longer a draft", async () => {
    const { seller, buyer, dealId } = await createTestDeal(db);
    const refusal = (sellerId: string) =>
      saveScopeVersion(db, { dealId, sellerId, content: content() }, at(1)).catch(
        (e: unknown) => e,
      );

    expect(await refusal(buyer.id)).toMatchObject({ reason: "not-your-deal" });
    await expect(
      saveScopeVersion(db, { dealId: testId(555), sellerId: seller.id, content: content() }, at(1)),
    ).rejects.toThrow(DealNotFoundError);
    await db.query("UPDATE deals SET status = 'awaiting_acceptance' WHERE id = $1", [dealId]);
    const late = await refusal(seller.id);
    expect(late).toBeInstanceOf(ScopeNotAllowedError);
    expect(late).toMatchObject({ reason: "not-draft" });
    expect((await readLedger(db, dealId)).map((e) => e.type)).toEqual(["DEAL_CREATED"]);
  });

  it("logs the deal's own currency", async () => {
    const { seller } = await createTestDeal(db);
    const { deal } = await createDeal(
      db,
      testDeal(seller.id, { id: testId(150), currency: "EUR" }),
      TEST_NOW,
    );
    const { entry } = await saveScopeVersion(
      db,
      { dealId: deal.id, sellerId: seller.id, content: content() },
      at(1),
    );
    expect(entry.payload).toMatchObject({ currency: "EUR" });
  });
});

describe("scopeContentSchema", () => {
  it.each([
    ["no payment stages", { milestones: [] }],
    ["a zero amount", { milestones: [{ title: "Free", amountMinor: 0 }] }],
    ["a fraction of a cent", { milestones: [{ title: "Odd", amountMinor: 10.5 }] }],
    [
      "an amount over the limit",
      { milestones: [{ title: "Big", amountMinor: MAX_MILESTONE_MINOR + 1 }] },
    ],
    ["no deliverables", { deliverables: [] }],
    ["an empty deliverable", { deliverables: ["   "] }],
    [
      "too many deliverables",
      { deliverables: Array.from({ length: 51 }, (_, n) => `Item ${String(n)}`) },
    ],
    ["an empty summary", { summary: "" }],
    ["a summary over 2000 characters", { summary: "a".repeat(2001) }],
    ["too many revisions", { revisionsIncluded: 21 }],
    ["a date that is not a calendar date", { dueDate: "20 November" }],
    ["an unknown field", { notes: "extra" } as Partial<ScopeContentInput>],
  ])("refuses %s", (_name, overrides) => {
    expect(scopeContentSchema.safeParse(content(overrides)).success).toBe(false);
  });

  it("accepts the largest allowed stage and optional fields left out", () => {
    const parsed = scopeContentSchema.parse({
      ...content({ revisionsIncluded: undefined, dueDate: undefined }),
      exclusions: [],
      milestones: [{ title: "All", amountMinor: MAX_MILESTONE_MINOR }],
    });
    expect(parsed.milestones[0]?.amountMinor).toBe(MAX_MILESTONE_MINOR);
    expect(parsed.dueDate).toBeUndefined();
  });
});

describe("stored versions", () => {
  it("are checked against their fingerprint when read", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await saveScopeVersion(db, { dealId, sellerId: seller.id, content: content() }, at(1));
    await db.query("ALTER TABLE scope_versions DISABLE TRIGGER scope_versions_append_only");
    await db.query(
      "UPDATE scope_versions SET content = jsonb_set(content, '{summary}', '\"Something else\"')",
    );
    await expect(getLatestScope(db, dealId)).rejects.toThrow(ScopeIntegrityError);
    await db.query("UPDATE scope_versions SET content = '{\"format\": 9}'");
    await expect(getScopeVersion(db, dealId, 1)).rejects.toThrow(ScopeIntegrityError);
  });

  it.each([
    ["editing", "UPDATE scope_versions SET version = 5"],
    ["deleting", "DELETE FROM scope_versions"],
    ["emptying", "TRUNCATE scope_versions"],
  ])("cannot be changed by %s", async (_name, sql) => {
    const { seller, dealId } = await createTestDeal(db);
    await saveScopeVersion(db, { dealId, sellerId: seller.id, content: content() }, at(1));
    await expect(db.query(sql)).rejects.toThrow(/append-only/);
  });

  it("must point at a real log entry", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await expect(
      db.query(
        `INSERT INTO scope_versions (deal_id, version, format, content, content_sha256, created_by,
                                     ledger_seq, created_at)
         VALUES ($1, 1, 1, '{}', $2, $3, 99, now())`,
        [dealId, "a".repeat(64), seller.id],
      ),
    ).rejects.toThrow(/scope_versions_recorded_in_ledger/);
  });
});

describe("saveScopeVersion from an AI draft", () => {
  /** A ready draft (test id 900) of the test deal, made from a saved chat. */
  async function readyDraft() {
    const { seller, dealId } = await createTestDeal(db);
    const file = await addArtifact(
      db,
      postgresContentStore(db, () => TEST_NOW),
      {
        id: testId(500),
        dealId,
        kind: "source",
        filename: "chat.txt",
        bytes: new TextEncoder().encode("Maya: a logo for $250"),
        addedBy: { actor: "seller", actorId: seller.id },
      },
      at(1),
    );
    const start = (id: string) =>
      startDraft(
        db,
        {
          id,
          dealId,
          sellerId: seller.id,
          sourceArtifactId: file.id,
          sourceSha256: file.sha256,
          draftPromptVersion: 1,
          rankPromptVersion: 1,
        },
        at(2),
      );
    await start(testId(900));
    const { draft } = await finishDraft(
      db,
      { draftId: testId(900), draft: { format: 2 }, council: {}, ledgerPayload: {} },
      at(3),
    );
    return { seller, dealId, draft, start };
  }

  const fields = { summary: "unchanged", deliverables: "changed" };
  const save = (sellerId: string, confirmedFrom?: SaveScope["confirmedFrom"]) =>
    saveScopeVersion(
      db,
      {
        dealId: testId(100),
        sellerId,
        content: content(),
        ...(confirmedFrom ? { confirmedFrom } : {}),
      },
      at(10),
    );

  it("records SCOPE_VERSIONED and then SCOPE_CONFIRMED, linking the draft, in one go", async () => {
    const { seller, dealId, draft } = await readyDraft();
    const { scope, entry, confirmation } = await save(seller.id, {
      draftId: draft.id,
      draftSha256: draft.draftSha256 ?? "",
      fields,
    });
    expect(confirmation).toMatchObject({
      type: "SCOPE_CONFIRMED",
      actor: "seller",
      actorId: seller.id,
    });
    expect(confirmation?.seq).toBe(entry.seq + 1);
    expect(confirmation?.payload).toEqual({
      version: 1,
      contentSha256: scope.contentSha256,
      draftId: draft.id,
      draftSha256: draft.draftSha256,
      fields,
    });
    expect((await readLedger(db, dealId)).map((e) => e.type).slice(-3)).toEqual([
      "SCOPE_DRAFTED",
      "SCOPE_VERSIONED",
      "SCOPE_CONFIRMED",
    ]);
    expect(await verifyStoredLedger(db, dealId)).toMatchObject({ valid: true });
  });

  it("records which draft the seller chose when it names one, by letter and fingerprint", async () => {
    const { seller, draft } = await readyDraft();
    const usedCandidate = { label: "B", sha256: "a".repeat(64) };
    const { confirmation } = await save(seller.id, {
      draftId: draft.id,
      draftSha256: draft.draftSha256 ?? "",
      usedCandidate,
      fields,
    });
    expect(confirmation?.payload).toMatchObject({ usedCandidate, draftSha256: draft.draftSha256 });
    await expect(
      save(seller.id, {
        draftId: draft.id,
        draftSha256: draft.draftSha256 ?? "",
        usedCandidate: { label: "B", sha256: "not a fingerprint" },
        fields,
      }),
    ).rejects.toThrow();
  });

  it("writes no confirmation when no draft is named", async () => {
    const { seller, dealId } = await readyDraft();
    const result = await save(seller.id);
    expect(result.confirmation).toBeUndefined();
    expect((await readLedger(db, dealId)).map((e) => e.type)).not.toContain("SCOPE_CONFIRMED");
  });

  it("refuses an unknown draft, a running or failed one, and a fingerprint that does not match, saving nothing", async () => {
    const { seller, dealId, draft, start } = await readyDraft();
    await start(testId(901));
    await start(testId(902)).catch(() => undefined);
    const before = (await readLedger(db, dealId)).length;
    const sha = draft.draftSha256 ?? "";
    const attempts = [
      { draftId: testId(999), draftSha256: sha, fields },
      { draftId: testId(901), draftSha256: sha, fields },
      { draftId: draft.id, draftSha256: "0".repeat(64), fields },
    ];
    for (const attempt of attempts) {
      await expect(save(seller.id, attempt)).rejects.toMatchObject({ reason: "bad-draft" });
    }
    await failDraft(db, { draftId: testId(901), reason: "x" }, at(11));
    await expect(
      save(seller.id, { draftId: testId(901), draftSha256: sha, fields }),
    ).rejects.toMatchObject({
      reason: "bad-draft",
    });
    expect(await getLatestScope(db, dealId)).toBeUndefined();
    expect((await readLedger(db, dealId)).length).toBe(before);
  });
});
