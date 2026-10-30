import { describe, expect, it } from "vitest";
import { MigrationError, migrate, migrationStatus, type Migration } from "./migrate.js";
import { useTestDatabase } from "./testing.js";

const first: Migration = { id: "0001_first", sql: "CREATE TABLE one (id int)" };
const second: Migration = { id: "0002_second", sql: "CREATE TABLE two (id int)" };

const db = useTestDatabase();

const tableNames = async () =>
  (
    await db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1",
    )
  ).map((row) => row.table_name);

describe("migrate", () => {
  it("applies migrations in order, records them, and does nothing the second time", async () => {
    expect(await migrate(db, [first, second])).toEqual(["0001_first", "0002_second"]);
    expect(await tableNames()).toEqual(["one", "schema_migrations", "two"]);
    expect(await migrate(db, [first, second])).toEqual([]);
  });

  it("applies only the migrations added since the last run", async () => {
    await migrate(db, [first]);
    expect(await migrate(db, [first, second])).toEqual(["0002_second"]);
  });

  it("refuses to continue when an applied migration was edited", async () => {
    await migrate(db, [first]);
    const edited = { ...first, sql: "CREATE TABLE one (id bigint)" };
    await expect(migrate(db, [edited, second])).rejects.toThrow(MigrationError);
    expect(await tableNames()).not.toContain("two");
  });

  it("rolls a failing migration back completely and stops before later ones", async () => {
    const broken: Migration = {
      id: "0002_broken",
      sql: "CREATE TABLE half (id int); SELECT nope FROM nowhere",
    };
    await expect(migrate(db, [first, broken, { ...second, id: "0003_after" }])).rejects.toThrow();
    expect(await tableNames()).toEqual(["one", "schema_migrations"]);
    expect(await migrationStatus(db, [first, broken])).toEqual({
      upToDate: false,
      applied: 1,
      pending: ["0002_broken"],
    });
  });

  it("applies each migration once when two runners start together", async () => {
    const results = await Promise.all([migrate(db, [first, second]), migrate(db, [first, second])]);
    expect(results.flat().sort()).toEqual(["0001_first", "0002_second"]);
  });

  it.each([
    ["a badly named id", [{ id: "first", sql: "SELECT 1" }]],
    ["an id used twice", [first, first]],
    ["ids out of order", [second, first]],
  ])("rejects %s before touching the database", async (_name, migrations) => {
    await expect(migrate(db, migrations)).rejects.toThrow(MigrationError);
    expect(await tableNames()).toEqual([]);
  });
});

describe("migrationStatus", () => {
  it("reports everything pending on a new database, without creating anything", async () => {
    expect(await migrationStatus(db, [first, second])).toEqual({
      upToDate: false,
      applied: 0,
      pending: ["0001_first", "0002_second"],
    });
    expect(await tableNames()).toEqual([]);
  });

  it("reports up to date once every migration is applied", async () => {
    await migrate(db, [first, second]);
    expect(await migrationStatus(db, [first, second])).toEqual({ upToDate: true, applied: 2 });
  });

  it("reports the new migrations when the code is ahead of the database", async () => {
    await migrate(db, [first]);
    expect(await migrationStatus(db, [first, second])).toEqual({
      upToDate: false,
      applied: 1,
      pending: ["0002_second"],
    });
  });

  it("still counts as up to date when the database is ahead of the code", async () => {
    await migrate(db, [first, second]);
    expect(await migrationStatus(db, [first])).toEqual({ upToDate: true, applied: 2 });
  });

  it("refuses a database whose applied migration was edited", async () => {
    await migrate(db, [first]);
    await expect(migrationStatus(db, [{ ...first, sql: "SELECT 1" }])).rejects.toThrow(
      MigrationError,
    );
  });
});
