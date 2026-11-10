import { randomUUID } from "node:crypto";
import type { ProductLookup } from "@pactpal/products";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyWebsocket from "@fastify/websocket";
import { MAX_CLIENT_FRAME_BYTES } from "@pactpal/live";
import { MIGRATIONS, migrationStatus, type Database, type Migration } from "@pactpal/db";
import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { linkRoutes } from "./auth/links.js";
import { signInRoutes, type SignInOptions } from "./auth/sign-in.js";
import type { InvoiceSender } from "./payments/invoice-sender.js";
import { dealRoutes } from "./deals/routes.js";
import type { DraftingRuntime } from "./drafting/runtime.js";
import { StandInEmailSender, type EmailSender } from "@pactpal/email";
import { missingRuntimeSettings, type ConfigReport } from "./config.js";
import { paymentNotifications } from "./payments/payment-sync.js";
import type { DisputeWriter } from "./disputes/action-service.js";
import type { ClaimRunner, DisputeChecker } from "./disputes/checker.js";
import { disputeNotifications } from "./disputes/notifications.js";
import { registerWebPages } from "./web-pages.js";
import {
  paypalWebhookRoutes,
  type PayPalWebhookOptions,
  type SellerAlertLookup,
} from "./webhooks/paypal-webhook.js";
import { resendInboundRoutes, type ResendInboundOptions } from "./webhooks/resend-inbound.js";
import { sellerAppRoutes, type SellerAppLinking } from "./sellers/app-link-routes.js";
import { LinkedApps } from "./sellers/linked-apps.js";
import { memoryBus, type ChatBus } from "./chat/bus.js";

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
  /** PayPal invoices from the seller app; absent until its keys are set. */
  invoices?: InvoiceSender;
  /** Email forwarding through Resend inbound (4p-2); off until its settings are set. */
  inbound?: ResendInboundOptions["inbound"];
  /** Starts dispute checks (5a); off ("not set up") until the database and seller app are set. */
  disputes?: DisputeChecker;
  /** Starts claim comparisons (5d); off until AI models (or Render) are set up. */
  claims?: ClaimRunner;
  /** Escalates disputes and sends evidence to PayPal (5g); off until the seller app is set. */
  disputeWriter?: DisputeWriter;
  /** Reads product listing pages (8e); off until `CHANNEL3_API_KEY` is set. */
  products?: ProductLookup;
  /** Linking sellers' own PayPal apps (6h-2); off until the database and encryption key are set. */
  sellerApps?: SellerAppLinking;
  /**
   * Carries chat events between server copies (7c): Postgres notifications in the running server;
   * one process only by default. Closed when the server stops.
   */
  chatBus?: ChatBus;
  /** This copy's id for chat presence; random by default. */
  serverId?: string;
}

/** The site's own WebSocket address (wss for https), for the pages' connection rule. */
export function socketOrigin(publicBaseUrl: string | undefined): string[] {
  if (publicBaseUrl === undefined) return [];
  const url = new URL(publicBaseUrl);
  return [`${url.protocol === "https:" ? "wss:" : "ws:"}//${url.host}`];
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
  // The live chat (7c) connects to this site's own wss: address, named because not every browser
  // counts it as 'self'.
  void app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        upgradeInsecureRequests: null,
        connectSrc: ["'self'", ...socketOrigin(opts.signIn?.publicBaseUrl)],
      },
    },
  });
  void app.register(fastifyCookie);
  // Pages send only small frames (typing, read, keep-alive); anything larger is refused.
  void app.register(fastifyWebsocket, { options: { maxPayload: MAX_CLIENT_FRAME_BYTES } });
  const chatBus = opts.chatBus ?? memoryBus();
  app.addHook("onClose", () => chatBus.close());

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
  // Sellers' own linked apps (6h-3): invoices, payment checks and (6h-5) disputes go through them.
  const linked =
    signIn.database && opts.sellerApps
      ? new LinkedApps(signIn.database, opts.sellerApps.box, opts.sellerApps.connect)
      : undefined;
  void app.register(linkRoutes, { database: signIn.database, clock: signIn.clock });
  void app.register(sellerAppRoutes, {
    database: signIn.database,
    clock: signIn.clock,
    newId: signIn.newId,
    sellerApps: opts.sellerApps,
    linked,
    publicBaseUrl: signIn.publicBaseUrl,
  });
  const email = opts.email ?? new StandInEmailSender(app.log);
  void app.register(dealRoutes, {
    database: signIn.database,
    clock: signIn.clock,
    newId: signIn.newId,
    publicBaseUrl: signIn.publicBaseUrl,
    email,
    drafting: opts.drafting,
    recordIp: trustProxyHops !== undefined,
    invoices: opts.invoices,
    linked,
    inboundDomain: opts.inbound?.domain,
    disputes: opts.disputes,
    claims: opts.claims,
    disputeWriter: opts.disputeWriter,
    products: opts.products,
    chatBus,
    serverId: opts.serverId ?? randomUUID(),
  });
  void app.register(resendInboundRoutes, {
    database: signIn.database,
    clock: signIn.clock,
    newId: signIn.newId,
    publicBaseUrl: signIn.publicBaseUrl,
    email,
    inbound: opts.inbound,
  });
  if (opts.webDir !== undefined) registerWebPages(app, opts.webDir);

  // A paid invoice's notification is checked with PayPal and recorded, when both are available.
  const webhooks = opts.webhooks ?? {
    verifier: undefined,
    webhookId: undefined,
    events: undefined,
  };
  // A dispute notification (PayPal has sent none so far) starts a dispute check.
  const handlers = [
    // The routes' database, as for every route (the same one in the running server).
    signIn.database && (opts.invoices || linked)
      ? paymentNotifications({
          db: signIn.database,
          invoices: opts.invoices,
          linked,
          email,
          clock: signIn.clock,
          log: app.log,
        })
      : undefined,
    opts.disputes && disputeNotifications(opts.disputes),
  ].filter((handler) => handler !== undefined);
  const process =
    webhooks.process ??
    (handlers.length === 0
      ? undefined
      : async (event: Parameters<NonNullable<PayPalWebhookOptions["process"]>>[0]) => {
          for (const handle of handlers) await handle(event);
        });
  // Each seller's own app has its own alert address, checked with that app (6h-4).
  const sellerAlerts: SellerAlertLookup | undefined =
    linked &&
    (async (connectionId) => {
      const found = await linked.get(connectionId);
      if (!found) return { ok: false, reason: "unknown" };
      return found.webhookId === undefined
        ? { ok: false, reason: "unregistered" }
        : { ok: true, verifier: found.clients.webhooks, webhookId: found.webhookId };
    });
  void app.register(paypalWebhookRoutes, {
    ...webhooks,
    ...(process ? { process } : {}),
    sellerAlerts,
  });

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
