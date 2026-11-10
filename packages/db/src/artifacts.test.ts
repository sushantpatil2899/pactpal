import { describe, expect, it } from "vitest";
import type { Database } from "./database.js";
import {
  ArtifactIntegrityError,
  ArtifactNotFoundError,
  ArtifactRejectedError,
  DealNotFoundError,
  LedgerActorError,
  ARTIFACT_LIMITS,
  addArtifact,
  getArtifact,
  listArtifacts,
  postgresContentStore,
  readLedger,
  verifyStoredLedger,
  type ArtifactLimits,
  type ContentStore,
  type NewArtifact,
} from "./index.js";
import { TEST_NOW, createTestDeal, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const store = postgresContentStore(db, () => TEST_NOW);
const text = (value: string) => new TextEncoder().encode(value);
const pdf = text("%PDF-1.4 a small document");
const chat = text("Maya: can you do a logo?\nChris: yes, $200 by Friday");
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);

/** A valid new file for the deal's seller; override any field to test a rule. */
const file = (sellerId: string, overrides: Partial<NewArtifact> = {}): NewArtifact => ({
  id: testId(500),
  dealId: testId(100),
  kind: "source",
  filename: "chat.txt",
  bytes: chat,
  addedBy: { actor: "seller", actorId: sellerId },
  ...overrides,
});

const counts = async () => ({
  artifacts: (await db.query("SELECT 1 FROM artifacts")).length,
  contents: (await db.query("SELECT 1 FROM file_contents")).length,
  ledger: (await readLedger(db, testId(100))).length,
});

describe("addArtifact", () => {
  it("stores a pasted chat as a source, records it in the ledger and reads it back", async () => {
    const { seller } = await createTestDeal(db);
    const artifact = await addArtifact(
      db,
      store,
      file(seller.id, { ip: "203.0.113.7", userAgent: "Mozilla/5.0" }),
      at(1),
    );
    expect(artifact).toMatchObject({
      id: testId(500),
      dealId: testId(100),
      kind: "source",
      filename: "chat.txt",
      mediaType: "text/plain",
      sizeBytes: chat.byteLength,
      addedBy: seller.id,
      ledgerSeq: 1,
      createdAt: at(1),
    });
    const entry = (await readLedger(db, testId(100)))[1]!;
    expect(entry).toMatchObject({
      seq: 1,
      type: "SOURCE_ADDED",
      actor: "seller",
      actorId: seller.id,
      ip: "203.0.113.7",
      userAgent: "Mozilla/5.0",
      payload: {
        artifactId: testId(500),
        filename: "chat.txt",
        mediaType: "text/plain",
        sizeBytes: chat.byteLength,
        sha256: artifact.sha256,
      },
    });
    expect((await verifyStoredLedger(db, testId(100))).valid).toBe(true);
    expect(await getArtifact(db, store, testId(500))).toEqual({ artifact, bytes: chat });
  });

  it("records a delivered file as a deliverable", async () => {
    const { seller } = await createTestDeal(db);
    const artifact = await addArtifact(
      db,
      store,
      file(seller.id, { kind: "deliverable", filename: "logo.pdf", bytes: pdf }),
      at(1),
    );
    expect(artifact).toMatchObject({ kind: "deliverable", mediaType: "application/pdf" });
    expect((await readLedger(db, testId(100)))[1]?.type).toBe("DELIVERABLE_ADDED");
  });

  it.each([
    ["a PDF named .png", "logo.png", pdf, "application/pdf"],
    ["text named .pdf", "notes.pdf", chat, "text/plain"],
    [
      "a program named .txt",
      "tool.txt",
      Uint8Array.of(0x4d, 0x5a, 0x00, 0x01),
      "application/octet-stream",
    ],
  ])("types %s by its bytes, not its name", async (_name, filename, bytes, mediaType) => {
    const { seller } = await createTestDeal(db);
    const artifact = await addArtifact(db, store, file(seller.id, { filename, bytes }), at(1));
    expect(artifact.mediaType).toBe(mediaType);
  });

  it("lets the system add a file, with no person recorded", async () => {
    await createTestDeal(db);
    const artifact = await addArtifact(
      db,
      store,
      file(testId(1), { addedBy: { actor: "system" } }),
      at(1),
    );
    expect(artifact.addedBy).toBeUndefined();
    expect((await readLedger(db, testId(100)))[1]).toMatchObject({ actor: "system" });
  });

  it("keeps one stored copy when the same file is added twice", async () => {
    const { seller } = await createTestDeal(db);
    await addArtifact(db, store, file(seller.id), at(1));
    await addArtifact(db, store, file(seller.id, { id: testId(501) }), at(2));
    expect(await counts()).toEqual({ artifacts: 2, contents: 1, ledger: 3 });
    expect((await listArtifacts(db, testId(100))).map(({ id }) => id)).toEqual([
      testId(500),
      testId(501),
    ]);
  });

  it.each([
    ["a name with a slash", { filename: "a/b.txt" }, "bad-name"],
    ["an empty name", { filename: "" }, "bad-name"],
    ["an empty file", { bytes: new Uint8Array() }, "empty"],
  ])("refuses %s and stores nothing", async (_name, overrides, reason) => {
    const { seller } = await createTestDeal(db);
    const error = await addArtifact(db, store, file(seller.id, overrides), at(1)).catch(
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(ArtifactRejectedError);
    expect((error as ArtifactRejectedError).reason).toBe(reason);
    expect(await counts()).toEqual({ artifacts: 0, contents: 0, ledger: 1 });
  });

  const small: ArtifactLimits = { maxFileBytes: 60, maxDealBytes: 100 };

  it("refuses a file over the size limit and one that would fill the deal", async () => {
    const { seller } = await createTestDeal(db);
    await expect(
      addArtifact(db, store, file(seller.id, { bytes: new Uint8Array(61).fill(65) }), at(1), small),
    ).rejects.toMatchObject({ reason: "file-too-large" });
    await addArtifact(
      db,
      store,
      file(seller.id, { bytes: new Uint8Array(60).fill(66) }),
      at(2),
      small,
    );
    await expect(
      addArtifact(
        db,
        store,
        file(seller.id, { id: testId(501), bytes: new Uint8Array(41).fill(67) }),
        at(3),
        small,
      ),
    ).rejects.toMatchObject({ reason: "deal-full" });
    expect(await counts()).toEqual({ artifacts: 1, contents: 1, ledger: 2 });
  });

  it.each([
    ["an id that is not a uuid", { id: "file-1" }],
    // Since 5b a buyer adds reference files, but never delivered work.
    [
      "a buyer adding delivered work",
      { kind: "deliverable", addedBy: { actor: "buyer", actorId: testId(2) } },
    ],
  ])("rejects %s before touching the database", async (_name, overrides) => {
    const { seller } = await createTestDeal(db);
    await expect(
      addArtifact(db, store, file(seller.id, overrides as Partial<NewArtifact>), at(1)),
    ).rejects.toThrow();
    expect(await counts()).toEqual({ artifacts: 0, contents: 0, ledger: 1 });
  });

  it("refuses an unknown deal, and a seller entry naming someone else, before storing", async () => {
    const { buyer } = await createTestDeal(db);
    await expect(
      addArtifact(db, store, file(buyer.id, { dealId: testId(555) }), at(1)),
    ).rejects.toThrow(DealNotFoundError);
    await expect(addArtifact(db, store, file(buyer.id), at(1))).rejects.toThrow(LedgerActorError);
    expect(await counts()).toEqual({ artifacts: 0, contents: 0, ledger: 1 });
  });
});

describe("files added by the buyer", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
  const byBuyer = (buyerId: string, n: number, overrides: Partial<NewArtifact> = {}) =>
    file(buyerId, {
      id: testId(600 + n),
      filename: `reference-${String(n)}.png`,
      bytes: png,
      addedBy: { actor: "buyer", actorId: buyerId },
      ...overrides,
    });

  it("records a buyer's reference file as a source added by the buyer, with IP and browser", async () => {
    const { buyer } = await createTestDeal(db);
    const added = await addArtifact(
      db,
      store,
      byBuyer(buyer.id, 1, { ip: "198.51.100.4", userAgent: "Phone" }),
      at(1),
    );
    expect(added).toMatchObject({ kind: "source", mediaType: "image/png", addedBy: buyer.id });
    expect((await readLedger(db, testId(100))).at(-1)).toMatchObject({
      type: "SOURCE_ADDED",
      actor: "buyer",
      actorId: buyer.id,
      ip: "198.51.100.4",
      userAgent: "Phone",
      payload: { filename: "reference-1.png", mediaType: "image/png" },
    });
  });

  it("refuses a buyer's delivered work, other types, someone else, and more than the buyer's share", async () => {
    const { seller, buyer } = await createTestDeal(db);
    await expect(
      addArtifact(db, store, byBuyer(buyer.id, 1, { kind: "deliverable" }), at(1)),
    ).rejects.toThrow(/source/);
    await expect(
      addArtifact(
        db,
        store,
        byBuyer(buyer.id, 2, { bytes: new Uint8Array([0, 1, 2, 255]) }),
        at(1),
      ),
    ).rejects.toMatchObject({ reason: "buyer-type" });
    // The seller cannot add a file as if the buyer had.
    await expect(addArtifact(db, store, byBuyer(seller.id, 3), at(1))).rejects.toBeInstanceOf(
      LedgerActorError,
    );
    const two: ArtifactLimits = { ...ARTIFACT_LIMITS, maxBuyerFiles: 2, maxBuyerBytes: 30 };
    await addArtifact(db, store, byBuyer(buyer.id, 4), at(2), two);
    await addArtifact(db, store, byBuyer(buyer.id, 5), at(3), two);
    await expect(addArtifact(db, store, byBuyer(buyer.id, 6), at(4), two)).rejects.toMatchObject({
      reason: "buyer-files-full",
    });
    await expect(
      addArtifact(
        db,
        store,
        byBuyer(buyer.id, 7, { bytes: new Uint8Array([...png, ...new Uint8Array(10)]) }),
        at(4),
        { ...two, maxBuyerFiles: 5 },
      ),
    ).rejects.toMatchObject({ reason: "buyer-files-full" });
    // The seller's own files do not count against the buyer's share.
    await addArtifact(db, store, file(seller.id, { id: testId(699) }), at(5), two);
    expect(await listArtifacts(db, testId(100))).toHaveLength(3);
  });
});

describe("when something fails part way", () => {
  /** The same database, but statements containing `fragment` fail. */
  const failing = (fragment: string): Database => ({
    ...db,
    transaction: (work) =>
      db.transaction((tx) =>
        work({
          query: (sql, params) =>
            sql.includes(fragment) ? Promise.reject(new Error("disk full")) : tx.query(sql, params),
        }),
      ),
  });

  it("records nothing when the bytes cannot be saved", async () => {
    const { seller } = await createTestDeal(db);
    const broken: ContentStore = {
      put: () => Promise.reject(new Error("store down")),
      get: () => Promise.resolve(undefined),
    };
    await expect(addArtifact(db, broken, file(seller.id), at(1))).rejects.toThrow("store down");
    expect(await counts()).toEqual({ artifacts: 0, contents: 0, ledger: 1 });
  });

  it("takes back the ledger entry when the record cannot be saved, leaving only unused bytes", async () => {
    const { seller } = await createTestDeal(db);
    await expect(
      addArtifact(failing("INSERT INTO artifacts"), store, file(seller.id), at(1)),
    ).rejects.toThrow("disk full");
    expect(await counts()).toEqual({ artifacts: 0, contents: 1, ledger: 1 });
  });

  it("checks the deal's size again under the lock, in case another upload arrived meanwhile", async () => {
    const { seller } = await createTestDeal(db);
    const limits: ArtifactLimits = { maxFileBytes: 60, maxDealBytes: 100 };
    await addArtifact(
      db,
      store,
      file(seller.id, { bytes: new Uint8Array(60).fill(65) }),
      at(1),
      limits,
    );
    // The early check reads the total before the other upload, so it sees room; the one under the lock does not.
    let early = true;
    const stale: Database = {
      ...db,
      query: (sql, params) => {
        if (early && sql.includes("SUM(size_bytes)")) {
          early = false;
          return Promise.resolve([{ total: 0 }]);
        }
        return db.query(sql, params);
      },
    };
    await expect(
      addArtifact(
        stale,
        store,
        file(seller.id, { id: testId(501), bytes: new Uint8Array(60).fill(66) }),
        at(2),
        limits,
      ),
    ).rejects.toMatchObject({ reason: "deal-full" });
    expect(await counts()).toMatchObject({ artifacts: 1, ledger: 2 });
  });
});

describe("getArtifact", () => {
  it("refuses an artifact that does not exist", async () => {
    await expect(getArtifact(db, store, testId(999))).rejects.toThrow(ArtifactNotFoundError);
  });

  it("treats a file of another deal as not found when a deal is given", async () => {
    const { seller } = await createTestDeal(db);
    await addArtifact(db, store, file(seller.id), at(1));
    await expect(getArtifact(db, store, testId(500), testId(999))).rejects.toThrow(
      ArtifactNotFoundError,
    );
    const found = await getArtifact(db, store, testId(500), testId(100));
    expect(found.artifact.id).toBe(testId(500));
  });

  it("reports bytes that are missing", async () => {
    const { seller } = await createTestDeal(db);
    await addArtifact(db, store, file(seller.id), at(1));
    await db.query("ALTER TABLE file_contents DISABLE TRIGGER file_contents_no_delete");
    await db.query("DELETE FROM file_contents");
    await expect(getArtifact(db, store, testId(500))).rejects.toThrow(/missing/);
  });

  it("reports bytes that were changed behind the database's back", async () => {
    const { seller } = await createTestDeal(db);
    await addArtifact(db, store, file(seller.id), at(1));
    await db.query("ALTER TABLE file_contents DISABLE TRIGGER file_contents_append_only");
    await db.query("UPDATE file_contents SET bytes = decode(repeat('41', $1::int), 'hex')", [
      chat.byteLength,
    ]);
    await expect(getArtifact(db, store, testId(500))).rejects.toThrow(ArtifactIntegrityError);
  });
});

describe("the database's own protection", () => {
  it.each([
    ["editing", "UPDATE artifacts SET filename = 'other.txt'"],
    ["deleting", "DELETE FROM artifacts"],
    ["emptying", "TRUNCATE artifacts"],
  ])("refuses %s a file's record", async (_name, sql) => {
    const { seller } = await createTestDeal(db);
    await addArtifact(db, store, file(seller.id), at(1));
    // Draft records point at files, so Postgres itself also refuses to empty the table.
    await expect(db.query(sql)).rejects.toThrow(/append-only|referenced in a foreign key/);
  });

  it("refuses a record that does not point at a real ledger entry", async () => {
    await createTestDeal(db);
    await expect(
      db.query(
        `INSERT INTO artifacts (id, deal_id, kind, filename, media_type, size_bytes, sha256, ledger_seq, created_at)
         VALUES ($1, $2, 'source', 'a.txt', 'text/plain', 1, $3, 99, now())`,
        [testId(500), testId(100), "a".repeat(64)],
      ),
    ).rejects.toThrow(/artifacts_recorded_in_ledger/);
  });
});
