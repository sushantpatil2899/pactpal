import { MIGRATIONS, migrationStatus, type Database, type Migration } from "@pactpal/db";
import Fastify, { type FastifyInstance } from "fastify";
import { missingRuntimeSettings, type ConfigReport } from "./config.js";
import { paypalWebhookRoutes, type PayPalWebhookOptions } from "./webhooks/paypal-webhook.js";

export interface AppOptions {
  /** Off, on (to standard output), or into a given stream (used by tests to read the logs). */
  logger?: boolean | { stream: { write(line: string): void } };
  webhooks?: PayPalWebhookOptions;
  /** Undefined until `DATABASE_URL` is set. Closed when the server stops. */
  database?: Database;
  /** The migrations the database must have; defaults to all of them. */
  migrations?: readonly Migration[];
}

export function buildApp(report: ConfigReport, opts: AppOptions = {}): FastifyInstance {
  const app = Fastify({ logger: opts.logger ?? true });

  // Liveness only: it must stay green when the database is down, or the host would restart a
  // healthy server. /ready is the check that includes the database.
  app.get("/health", (_request, reply) =>
    reply.send({
      status: "ok",
      service: "pactpal-server",
      missingEnv: missingRuntimeSettings(report),
    }),
  );

  const { database, migrations = MIGRATIONS } = opts;
  app.get("/ready", async (request, reply) => {
    if (database === undefined) {
      return reply.code(503).send({ status: "not ready", database: "not configured" });
    }
    let status;
    try {
      status = await migrationStatus(database, migrations);
    } catch (error) {
      request.log.error({ err: error }, "database check failed");
      return reply.code(503).send({ status: "not ready", database: "unavailable" });
    }
    if (!status.upToDate) {
      return reply
        .code(503)
        .send({ status: "not ready", database: "behind", pendingMigrations: status.pending });
    }
    return reply.send({ status: "ready", database: "ok", migrations: status.applied });
  });
  if (database) app.addHook("onClose", () => database.close());

  void app.register(
    paypalWebhookRoutes,
    opts.webhooks ?? { verifier: undefined, webhookId: undefined, events: undefined },
  );

  return app;
}

/** Closes the server cleanly (finishing open requests) when the host asks it to stop. */
export function closeOnSignals(
  app: Pick<FastifyInstance, "close" | "log">,
  signals: { once(signal: "SIGTERM" | "SIGINT", listener: () => void): unknown },
  exit: (code: number) => void,
): void {
  for (const signal of ["SIGTERM", "SIGINT"] as const) {
    signals.once(signal, () => {
      app.log.info(`${signal} received; closing`);
      app.close().then(
        () => {
          exit(0);
        },
        (error: unknown) => {
          app.log.error(error);
          exit(1);
        },
      );
    });
  }
}
