import type { FastifyInstance, FastifyRequest } from "fastify";

/** Where a request came from, for its evidence log entry. */
export interface RequestOrigin {
  ip?: string;
  userAgent?: string;
}

/**
 * The visitor's IP address and browser for a log entry. The address is given only when the
 * number of proxies in front of the server is known (`recordIp`); otherwise it would be the
 * proxy's address, which is not evidence of anything, so it is left out.
 */
export function requestOrigin(request: FastifyRequest, recordIp: boolean): RequestOrigin {
  const userAgent = request.headers["user-agent"];
  return {
    ...(recordIp && request.ip !== "" ? { ip: request.ip } : {}),
    ...(userAgent === undefined || userAgent === "" ? {} : { userAgent }),
  };
}

/** Forwarding headers a proxy may add; shown by the connection check. */
const FORWARDING_HEADERS = [
  "x-forwarded-for",
  "x-forwarded-proto",
  "x-real-ip",
  "true-client-ip",
  "cf-connecting-ip",
  "forwarded",
] as const;

/**
 * Temporary (until `TRUST_PROXY_HOPS` is measured on Render): shows a visitor only their own
 * connection, meaning the address the server sees and the forwarding headers, so the number of
 * proxies can be worked out. Read-only and never cached; the values are not logged.
 */
export function registerConnectionCheck(app: FastifyInstance, hops: number | undefined): void {
  app.get("/api/connection-check", (request, reply) => {
    const headers: Record<string, string> = {};
    for (const name of FORWARDING_HEADERS) {
      const value = request.headers[name];
      if (value !== undefined) headers[name] = Array.isArray(value) ? value.join(", ") : value;
    }
    return reply.header("cache-control", "no-store").send({
      socketAddress: request.socket.remoteAddress ?? null,
      trustProxyHops: hops ?? null,
      addressAsRecorded: requestOrigin(request, hops !== undefined).ip ?? null,
      headers,
    });
  });
}
