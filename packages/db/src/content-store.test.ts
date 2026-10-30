import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import { ContentMismatchError, postgresContentStore } from "./index.js";
import { TEST_NOW, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const store = postgresContentStore(db, () => TEST_NOW);

/** Bytes that differ from place to place, so a mix-up would show. */
const sample = (length: number, seed = 0) =>
  Uint8Array.from({ length }, (_, i) => (i * 31 + seed) % 256);

describe("postgresContentStore", () => {
  it("returns exactly the bytes it was given", async () => {
    const bytes = sample(1_000_000);
    await store.put(sha256Hex(bytes), bytes);
    expect(await store.get(sha256Hex(bytes))).toEqual(bytes);
  });

  it("keeps one copy when the same bytes are saved again", async () => {
    const bytes = sample(100);
    await store.put(sha256Hex(bytes), bytes);
    await postgresContentStore(db, () => new Date("2027-01-01T00:00:00.000Z")).put(
      sha256Hex(bytes),
      bytes,
    );
    expect(await db.query("SELECT created_at FROM file_contents")).toEqual([
      { created_at: TEST_NOW },
    ]);
  });

  it("refuses bytes that are not the file the fingerprint names", async () => {
    await expect(store.put(sha256Hex(sample(10)), sample(10, 1))).rejects.toThrow(
      ContentMismatchError,
    );
    expect(await db.query("SELECT 1 FROM file_contents")).toEqual([]);
  });

  it("returns nothing for bytes it does not hold", async () => {
    expect(await store.get("0".repeat(64))).toBeUndefined();
  });

  it.each([
    ["editing", "UPDATE file_contents SET created_at = now()"],
    ["deleting", "DELETE FROM file_contents"],
    ["emptying", "TRUNCATE file_contents"],
  ])("refuses %s stored bytes", async (_name, sql) => {
    const bytes = sample(10);
    await store.put(sha256Hex(bytes), bytes);
    await expect(db.query(sql)).rejects.toThrow(/append-only/);
  });

  it("refuses a row whose size is not the real length", async () => {
    await expect(
      db.query(
        "INSERT INTO file_contents (sha256, size_bytes, bytes, created_at) VALUES ($1, 5, $2, now())",
        ["a".repeat(64), sample(10)],
      ),
    ).rejects.toThrow(/file_contents_size_matches/);
  });
});
