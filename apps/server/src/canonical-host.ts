import type { FastifyInstance } from "fastify";

/**
 * Paths machines call, never redirected (9i): PayPal and Resend do not follow redirects for their
 * notifications, agents and pages call the API by its address, Render checks health on the
 * service's own name, and emails already sent show the logo from the old address.
 */
const NEVER_MOVED = ["/webhooks/", "/mcp", "/api/", "/health", "/ready", "/brand/"];

/**
 * Where a page request should go instead (9i): the same path and query on the site's own address
 * when it arrived on another name (the old `onrender.com` one), or undefined to serve it here.
 * Only page reads move; the target is always the configured address, never one from the request.
 */
export function canonicalRedirect(
  request: { method: string; host: string; url: string },
  publicBaseUrl: string | undefined,
): string | undefined {
  if (publicBaseUrl === undefined) return undefined;
  if (request.method !== "GET" && request.method !== "HEAD") return undefined;
  const site = new URL(publicBaseUrl);
  const host = request.host.toLowerCase();
  const name = host.replace(/:\d+$/, "");
  if (host === site.host || name === "localhost" || name === "127.0.0.1") return undefined;
  if (NEVER_MOVED.some((path) => request.url.startsWith(path))) return undefined;
  return `${site.origin}${request.url}`;
}

/** Sends page requests on any other name to the site's own address, permanently. */
export function registerCanonicalHost(app: FastifyInstance, publicBaseUrl: string | undefined) {
  if (publicBaseUrl === undefined) return;
  app.addHook("onRequest", async (request, reply) => {
    const target = canonicalRedirect(request, publicBaseUrl);
    if (target !== undefined) await reply.redirect(target, 301);
  });
}
