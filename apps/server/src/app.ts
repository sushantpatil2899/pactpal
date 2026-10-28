import Fastify, { type FastifyInstance } from "fastify";
import type { ConfigStatus } from "./config.js";

export function buildApp(config: ConfigStatus, opts: { logger?: boolean } = {}): FastifyInstance {
  const app = Fastify({ logger: opts.logger ?? true });

  app.get("/health", (_request, reply) =>
    reply.send({ status: "ok", service: "pactpal-server", missingEnv: config.missing }),
  );

  return app;
}
