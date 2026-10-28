import Fastify, { type FastifyInstance } from "fastify";
import { missingSettings, type ConfigReport } from "./config.js";

export function buildApp(report: ConfigReport, opts: { logger?: boolean } = {}): FastifyInstance {
  const app = Fastify({ logger: opts.logger ?? true });

  app.get("/health", (_request, reply) =>
    reply.send({ status: "ok", service: "pactpal-server", missingEnv: missingSettings(report) }),
  );

  return app;
}
