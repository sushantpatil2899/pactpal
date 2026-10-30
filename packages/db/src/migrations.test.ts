import { describe, expect, it } from "vitest";
import { MIGRATIONS, migrate, migrationStatus } from "./index.js";
import { useTestDatabase } from "./testing.js";

const db = useTestDatabase();

describe("MIGRATIONS", () => {
  it("apply to a new database and leave it up to date", async () => {
    await migrate(db, MIGRATIONS);
    expect(await migrationStatus(db, MIGRATIONS)).toEqual({
      upToDate: true,
      applied: MIGRATIONS.length,
    });
  });

  it("provide a guard that stops updates and deletes but allows inserts", async () => {
    await migrate(db, MIGRATIONS);
    await db.query(`CREATE TABLE log (note text);
      CREATE TRIGGER log_append_only BEFORE UPDATE OR DELETE ON log
        FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change()`);
    await db.query("INSERT INTO log (note) VALUES ($1)", ["first"]);
    await expect(db.query("UPDATE log SET note = 'changed'")).rejects.toThrow(/append-only/);
    await expect(db.query("DELETE FROM log")).rejects.toThrow(/append-only/);
    expect(await db.query("SELECT note FROM log")).toEqual([{ note: "first" }]);
  });
});
