import { randomUUID } from "node:crypto";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import { MIGRATIONS, migrationStatus, type Database, type Migration } from "@pactpal/db";
import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { linkRoutes } from "./auth/links.js";
import { signInRoutes, type SignInOptions } from "./auth/sign-in.js";
import { dealRoutes } from "./deals/routes.js";
import type { DraftingRuntime } from "./drafting/runtime.js";
import { StandInEmailSender, type EmailSender } from "./email/sender.js";
import { missingRuntimeSettings, type ConfigReport } from "./config.js";
import { registerWebPages } from "./web-pages.js";
import { paypalWebhookRoutes, type PayPalWebhookOptions } from "./webhooks/paypal-webhook.js";

export interface AppOptions {
  /** Off, on (to standard output), or into a given stream (used by tests to read the logs). */
  logger?: boolean | { stream: { write(line: string): void } };
  webhooks?: PayPalWebhookOptions;
  /** Undefined until `DATABASE_URL` is set. Closed when the server stops. */
  database?: Database;
  /** The migrations the database must have; defaults to all of them. */
  migrations?: readonly Migration[];
  /** Sign in with PayPal; off (every sign-in "unavailable") when not given. */
  signIn?: SignInOptions;
  /** Folder of the built web app; when absent only the server's own routes exist. */
  webDir?: string;
  /** Sends email; defaults to a stand-in that sends nothing until an email service is chosen. */
  email?: EmailSender;
  /** Runs the council for scope drafts; absent until a database and an AI model key are set. */
  drafting?: DraftingRuntime;
  /**
   * How many proxies stand in front of the server (`TRUST_PROXY_HOPS`). Absent until measured:
   * visitors' IP addresses are then not recorded in the evidence log.
   */
  trustProxyHops?: number;
}

/**
 * Request logs show the path without its query string: sign-in returns carry PayPal's one-time
 * code and state there, which must never reach the logs. The address logged is the connection's
 * own (on Render, the proxy's), never the visitor's address worked out from forwarding headers,
 * so logs hold no visitor IP addresses.
 */
const requestLog = (request: FastifyRequest) => ({
  method: request.method,
  url: request.url.split("?")[0],
  host: request.host,
  remoteAddress: request.socket.remoteAddress,
});

export function buildApp(report: ConfigReport, opts: AppOptions = {}): FastifyInstance {
  const { logger = true, trustProxyHops } = opts;
  const app = Fastify({
    // With the number of proxies known, request.ip is the visitor's address; otherwise the proxy's.
    // Trusting the first n hops is what a number means to Fastify; its types only take a function.
    trustProxy: (_address: string, hop: number) => hop < (trustProxyHops ?? 0),
    logger:
      logger === false
        ? false
        : { ...(logger === true ? {} : logger), serializers: { req: requestLog } },
  });

  // Security headers on every answer: scripts, styles and frames only from this site. Upgrading
  // http requests is left off so the app also works on http://localhost; Render serves only https.
  void app.register(fastifyHelmet, {
    contentSecurityPolicy: { directives: { upgradeInsecureRequests: null } },
  });
  void app.register(fastifyCookie);

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

  const signIn = opts.signIn ?? {
    login: undefined,
    database: undefined,
    publicBaseUrl: undefined,
    clock: () => new Date(),
    newId: randomUUID,
  };
  void app.register(signInRoutes, signIn);
  void app.register(linkRoutes, { database: signIn.database, clock: signIn.clock });
  void app.register(dealRoutes, {
    database: signIn.database,
    clock: signIn.clock,
    newId: signIn.newId,
    publicBaseUrl: signIn.publicBaseUrl,
    email: opts.email ?? new StandInEmailSender(app.log),
    drafting: opts.drafting,
    recordIp: trustProxyHops !== undefined,
  });
  if (opts.webDir !== undefined) registerWebPages(app, opts.webDir);

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
