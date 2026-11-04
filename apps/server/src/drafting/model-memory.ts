import { rankModels, type ChatClient, type ModelRecord } from "@pactpal/ai";
import { recentModelRecords, type Database } from "@pactpal/db";

/** How many of this server's own recent outcomes are kept. */
const MEMORY = 100;

/**
 * This server's own recent model outcomes, kept in memory and shared by buyer questions (4k) and
 * image checks (4l), so a model that just failed for one is skipped by the other too. With the
 * newest council records from the database they choose the models to try for a task.
 */
export function modelMemory(clock: () => Date) {
  const records: ModelRecord[] = [];
  return {
    remember(model: string, ok: boolean, latencyMs?: number) {
      records.unshift({
        model,
        ok,
        ...(latencyMs === undefined ? {} : { latencyMs }),
        at: clock(),
      });
      records.length = Math.min(records.length, MEMORY);
    },
    /** The clients to try for one task, best first, at most `limit` of them. */
    async order<T extends ChatClient>(
      db: Database,
      clients: readonly T[],
      limit: number,
    ): Promise<T[]> {
      const all = [...records, ...(await recentModelRecords(db))];
      return rankModels(
        clients.map((client) => client.spec.name),
        all,
        clock(),
      )
        .slice(0, limit)
        .flatMap((name) => clients.find((client) => client.spec.name === name) ?? []);
    },
  };
}
export type ModelMemory = ReturnType<typeof modelMemory>;
