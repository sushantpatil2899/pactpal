import { MAX_CLIENT_FRAME_BYTES, parseClientFrame, type ServerFrame } from "@pactpal/live";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { WebSocket } from "ws";
import { z } from "zod";
import type { DealLookup, FoundDeal } from "../deals/access.js";
import { roleIn } from "../deals/visibility.js";
import type { LiveHub, LivePage } from "./live-hub.js";
import { rateLimiter } from "./rate-limit.js";

export interface LiveRouteOptions {
  visibleDeal: DealLookup;
  hub: LiveHub;
  clock: () => Date;
  /** The site's own address; pages from it may connect (as well as from the same host). */
  publicBaseUrl: string | undefined;
  /** How often the server checks a page is still there (30 s; shorter in tests). */
  keepAliveMs?: number;
}

/** Frames one page may send in `FRAME_WINDOW_MS` before it is disconnected. */
const FRAMES_PER_WINDOW = 40;
const FRAME_WINDOW_MS = 10_000;
/** Close codes: 1008 for a broken rule, 1011 for a server error, 1001 when going away. */
const POLICY = 1008;

const liveQuery = z.object({ after: z.coerce.number().int().min(0).default(0) });

/**
 * Whether a page may open a live connection from where it says it comes from: the site's own
 * address, or the host it connected to (local copies, the development proxy). Browsers always
 * send `Origin` with a WebSocket, so a missing one is refused; this stops other sites opening a
 * connection with a visitor's cookie.
 */
export function originAllowed(
  origin: string | undefined,
  host: string | undefined,
  publicBaseUrl: string | undefined,
): boolean {
  if (origin === undefined) return false;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (publicBaseUrl !== undefined && url.origin === new URL(publicBaseUrl).origin) return true;
  return host !== undefined && url.host === host;
}

/**
 * The live connection for a deal's chat (7c): `GET /api/deals/:id/live?after=<seq>` upgraded to
 * a WebSocket for the deal's seller or buyer. The deal and the person are checked before the
 * upgrade, with the same rules as every deal route. The page then gets the messages after
 * `after` and every change as it happens; it sends typing, read and keep-alive frames, each
 * checked, size-limited and rate-limited.
 */
export const liveRoutes: FastifyPluginAsync<LiveRouteOptions> = (app, options) => {
  const { visibleDeal, hub, clock, publicBaseUrl, keepAliveMs = 30_000 } = options;
  const allowed = new WeakMap<FastifyRequest, FoundDeal>();
  const allowFrame = rateLimiter(FRAMES_PER_WINDOW, FRAME_WINDOW_MS, clock);

  async function check(request: FastifyRequest, reply: FastifyReply) {
    if (!originAllowed(request.headers.origin, request.headers.host, publicBaseUrl)) {
      return reply.code(403).send({ error: "not allowed from this page" });
    }
    if (!liveQuery.safeParse(request.query).success) {
      return reply.code(400).send({ error: "invalid", fields: ["after"] });
    }
    // Returning nothing lets the upgrade go ahead; a refusal has already been answered.
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    allowed.set(request, found);
    return undefined;
  }

  app.get(
    "/api/deals/:id/live",
    { websocket: true, preValidation: check },
    async (socket: WebSocket, request) => {
      const found = allowed.get(request);
      if (!found) {
        socket.close(POLICY, "not allowed");
        return;
      }
      const { deal, viewer } = found;
      const page: LivePage = {
        dealId: deal.id,
        userId: viewer.user.id,
        role: roleIn(viewer, deal),
        send: (frame: ServerFrame) => {
          if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(frame));
        },
      };
      const socketKey = `${viewer.user.id}:${request.id}`;
      let alive = true;
      socket.on("pong", () => {
        alive = true;
      });
      // A page that stops answering is dropped, so its person stops showing as online.
      const keepAlive = setInterval(() => {
        if (!alive) {
          socket.terminate();
          return;
        }
        alive = false;
        socket.ping();
      }, keepAliveMs);

      const fail = (error: unknown) => {
        request.log.warn(
          { dealId: deal.id, err: error instanceof Error ? error.message : "unknown" },
          "Live chat frame failed",
        );
      };
      socket.on("message", (data, isBinary) => {
        const text = isBinary ? undefined : rawText(data);
        if (text === undefined || text.length > MAX_CLIENT_FRAME_BYTES || !allowFrame(socketKey)) {
          socket.close(POLICY, "frame refused");
          return;
        }
        const frame = parseClientFrame(text);
        if (!frame) {
          socket.close(POLICY, "frame refused");
          return;
        }
        switch (frame.type) {
          case "ping":
            page.send({ type: "pong" });
            return;
          case "typing":
            hub.typing(page, frame.typing).catch(fail);
            return;
          case "read":
            hub.read(page, frame.seq).catch(fail);
            return;
        }
      });

      const after = liveQuery.parse(request.query).after;
      const leave = await hub.join(page, after);
      request.log.info({ dealId: deal.id, role: page.role }, "Live chat opened");
      socket.on("close", () => {
        clearInterval(keepAlive);
        leave().catch(fail);
      });
      // The page may have gone while it was being joined.
      if (socket.readyState !== socket.OPEN) {
        clearInterval(keepAlive);
        await leave();
      }
    },
  );

  return Promise.resolve();
};

/** A text frame's characters; `ws` gives text frames as one or more buffers. */
function rawText(data: Buffer | ArrayBuffer | Buffer[]): string {
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  return Buffer.from(data instanceof ArrayBuffer ? new Uint8Array(data) : data).toString("utf8");
}
