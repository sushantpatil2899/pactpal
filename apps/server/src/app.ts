import Fastify, { type FastifyInstance } from "fastify";
import { missingSettings, type ConfigReport } from "./config.js";
import { paypalWebhookRoutes, type PayPalWebhookOptions } from "./webhooks/paypal-webhook.js";
import { MemorySeenEvents } from "./webhooks/seen-events.js";

export interface AppOptions {
  /** Off, on (to standard output), or into a given stream (used by tests to read the logs). */
  logger?: boolean | { stream: { write(line: string): void } };
  webhooks?: PayPalWebhookOptions;
}

export function buildApp(report: ConfigReport, opts: AppOptions = {}): FastifyInstance {
  const app = Fastify({ logger: opts.logger ?? true });

  app.get("/health", (_request, reply) =>
    reply.send({ status: "ok", service: "pactpal-server", missingEnv: missingSettings(report) }),
  );

  void app.register(
    paypalWebhookRoutes,
    opts.webhooks ?? { verifier: undefined, webhookId: undefined, seen: new MemorySeenEvents() },
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
