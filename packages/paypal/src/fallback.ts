import type { z } from "zod";
import { PayPalMcpError, PayPalResponseError } from "./errors.js";
import { issueList } from "./http.js";
import type { PayPalResult } from "./types.js";

export interface FallbackPolicy {
  /** Limit for the whole MCP attempt; REST takes over after it. */
  mcpTimeoutMs: number;
  /** MCP failures in a row before MCP is paused. */
  failureThreshold: number;
  /** How long MCP is skipped once paused. */
  pauseMs: number;
}

export const DEFAULT_FALLBACK_POLICY: FallbackPolicy = {
  mcpTimeoutMs: 10_000,
  failureThreshold: 3,
  pauseMs: 10 * 60_000,
};

export interface FallbackRequest<T> {
  /** Shown in errors and reasons, e.g. "create invoice". */
  operation: string;
  /**
   * Writes are never repeated over REST once MCP may have done the work: a
   * request id cannot be passed through PayPal's MCP tools, so REST could not
   * recognise the repeat and would do the work twice.
   */
  kind: "read" | "write";
  /** The MCP version, if PayPal offers a tool for this operation. */
  mcp?: { call: () => Promise<unknown>; schema: z.ZodType<T> };
  rest: () => Promise<{ data: T; debugId?: string | undefined }>;
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Runs each PayPal operation over MCP first and REST as fallback, recording
 * which one served it. After repeated MCP failures, MCP is skipped for a while
 * so a broken MCP server does not slow every call.
 */
export class McpFallback {
  readonly #policy: FallbackPolicy;
  readonly #now: () => number;
  #failures = 0;
  #pausedUntil = 0;

  constructor(options: { policy?: FallbackPolicy; now?: () => number } = {}) {
    this.#policy = options.policy ?? DEFAULT_FALLBACK_POLICY;
    this.#now = options.now ?? (() => Date.now());
  }

  async run<T>(request: FallbackRequest<T>): Promise<PayPalResult<T>> {
    const { mcp } = request;
    if (mcp === undefined) return { ...(await request.rest()), transport: "rest" };
    if (this.#now() < this.#pausedUntil) {
      return this.#rest(request, `MCP paused after ${this.#failures} failures in a row`);
    }

    let raw: unknown;
    try {
      raw = await this.#withinLimit(request.operation, mcp.call());
    } catch (error) {
      this.#recordFailure();
      const outcome = error instanceof PayPalMcpError ? error.outcome : "unknown";
      if (request.kind === "write" && outcome === "unknown") throw error;
      return this.#rest(request, reasonOf(error));
    }

    const parsed = mcp.schema.safeParse(raw);
    if (!parsed.success) {
      this.#recordFailure();
      const error = new PayPalResponseError(
        `MCP ${request.operation}`,
        issueList(parsed.error),
        undefined,
      );
      // The write went through on PayPal's side; only its answer is unreadable.
      if (request.kind === "write") throw error;
      return this.#rest(request, error.message);
    }

    this.#failures = 0;
    return { data: parsed.data, transport: "mcp" };
  }

  async #rest<T>(request: FallbackRequest<T>, fallbackReason: string): Promise<PayPalResult<T>> {
    return { ...(await request.rest()), transport: "rest", fallbackReason };
  }

  #recordFailure(): void {
    this.#failures += 1;
    if (this.#failures >= this.#policy.failureThreshold) {
      this.#pausedUntil = this.#now() + this.#policy.pauseMs;
    }
  }

  async #withinLimit<T>(operation: string, attempt: Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const limit = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => {
        reject(
          new PayPalMcpError(
            operation,
            "NO_ANSWER",
            "unknown",
            `no answer within ${this.#policy.mcpTimeoutMs} ms`,
          ),
        );
      }, this.#policy.mcpTimeoutMs);
    });
    try {
      return await Promise.race([attempt, limit]);
    } finally {
      clearTimeout(timer);
    }
  }
}
