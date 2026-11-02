import type { FastifyRequest } from "fastify";

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
