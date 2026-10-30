/** `pnpm migrate`: brings the database up to date. Render runs it before each deploy. */
import { MIGRATIONS, connectPostgres, migrate } from "@pactpal/db";
import { formatErrors, loadConfig } from "./config.js";

const result = loadConfig(process.env);
if (!result.ok) {
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { database } = result.config;
if (database === undefined) {
  // Like every other missing setting, this only marks the feature as not ready.
  process.stdout.write("DATABASE_URL is not set; no migrations run.\n");
} else {
  const db = connectPostgres({
    url: database.url.reveal(),
    onError: (error) => process.stderr.write(`database connection error: ${error.message}\n`),
  });
  try {
    const applied = await migrate(db, MIGRATIONS);
    process.stdout.write(
      applied.length === 0
        ? "Database is up to date.\n"
        : `Applied ${applied.length.toString()} migration(s): ${applied.join(", ")}\n`,
    );
  } catch (error) {
    process.stderr.write(
      `Migration failed: ${error instanceof Error ? error.message : "unknown error"}\n`,
    );
    process.exitCode = 1;
  } finally {
    await db.close();
  }
}
