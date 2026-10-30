import fastifyStatic from "@fastify/static";
import type { FastifyInstance } from "fastify";

/** Paths that belong to the server itself; everything else may be a page of the web app. */
const SERVER_PATHS = ["/api/", "/auth/", "/webhooks/", "/health", "/ready"];

/**
 * Serves the built web app from `root` at the site's own address, so the sign-in cookie is
 * first-party. Asset files have content hashes in their names and are cached for a year; the
 * page itself is always re-checked. Unknown page paths get the app's page, which routes itself.
 */
export function registerWebPages(app: FastifyInstance, root: string): void {
  void app.register(fastifyStatic, {
    root,
    setHeaders: (reply, filePath) => {
      void reply.header(
        "Cache-Control",
        filePath.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
      );
    },
  });
  app.setNotFoundHandler((request, reply) => {
    const path = request.url.split("?")[0] ?? "";
    const isPage =
      request.method === "GET" &&
      !SERVER_PATHS.some((prefix) => path.startsWith(prefix)) &&
      !/\.[a-z0-9]+$/i.test(path);
    if (isPage) return reply.header("Cache-Control", "no-cache").sendFile("index.html");
    return reply.code(404).send({ error: "not found" });
  });
}
