import { createHmac, timingSafeEqual } from "node:crypto";
import {
  defaultHttpDeps,
  sendWithRetry,
  type HttpDeps,
  type RetryPolicy,
  type Secret,
} from "@pactpal/net";
import { z } from "zod";
import type { EmailFailure } from "./message.js";
import { EMAIL_RETRY_POLICY } from "./resend.js";

/** Resend's address for one received email; the id goes at the end. */
export const RESEND_RECEIVED_URL = "https://api.resend.com/emails/receiving";

/** What a sender check reported: "pass", "fail", "none" and so on, as the receiving server said. */
export interface SenderChecks {
  spf: string | undefined;
  dkim: string | undefined;
}

/** One email received at a forwarding address, as read back from the inbox (4p-2). */
export interface ReceivedEmail {
  /** The bare sender address, lower case. */
  from: string;
  to: string[];
  subject: string;
  text: string | undefined;
  html: string | undefined;
  checks: SenderChecks;
}

export type ReadResult =
  { ok: true; email: ReceivedEmail } | { ok: false; reason: EmailFailure; detail: string };

/** Reading received email; `live` is false while no inbound key is set. */
export interface ReceivedEmails {
  readonly live: boolean;
  get(id: string): Promise<ReadResult>;
}

/** A check's result, which hosts give as a word or as `{ result: "pass" }`. */
const check = z
  .union([
    z.string(),
    z.looseObject({ result: z.string() }).transform((value) => value.result),
    z.looseObject({ status: z.string() }).transform((value) => value.status),
  ])
  .optional()
  .transform((value) => value?.toLowerCase());

const receivedAnswer = z.looseObject({
  from: z.string().min(3),
  to: z.array(z.string()).default([]),
  subject: z.string().nullable().optional(),
  text: z.string().nullable().optional(),
  html: z.string().nullable().optional(),
  authentication: z.looseObject({ spf: check, dkim: check }).optional(),
});

/** The bare address in `Name <address>` or `address`, lower case. */
export const bareAddress = (value: string): string =>
  (/<([^<>\s]+)>/.exec(value)?.[1] ?? value).trim().toLowerCase();

class InboxNetworkError extends Error {
  constructor(readonly timedOut: boolean) {
    super(timedOut ? "timed out" : "could not reach Resend");
  }
}

/**
 * Reads received emails from Resend's inbound API over HTTPS. Failures come back as values; the
 * details hold the status, never the email or the key. Reading is safe to repeat, so it retries.
 */
export class ResendReceivedEmails implements ReceivedEmails {
  readonly live: boolean;
  readonly #key: Secret | undefined;
  readonly #deps: HttpDeps;
  readonly #policy: RetryPolicy;

  constructor(options: { apiKey: Secret | undefined; deps?: HttpDeps; policy?: RetryPolicy }) {
    this.#key = options.apiKey;
    this.live = options.apiKey !== undefined;
    this.#deps = options.deps ?? defaultHttpDeps;
    this.#policy = options.policy ?? EMAIL_RETRY_POLICY;
  }

  async get(id: string): Promise<ReadResult> {
    if (this.#key === undefined) {
      return { ok: false, reason: "not_configured", detail: "RESEND_INBOUND_API_KEY is not set" };
    }
    if (!/^[\w-]{1,100}$/.test(id))
      return { ok: false, reason: "rejected", detail: "bad email id" };
    let response: Response;
    try {
      response = await sendWithRetry(
        {
          operation: "GET /emails/receiving",
          url: `${RESEND_RECEIVED_URL}/${id}`,
          init: { method: "GET", headers: { authorization: `Bearer ${this.#key.reveal()}` } },
          idempotent: true,
        },
        this.#deps,
        this.#policy,
        (timedOut) => new InboxNetworkError(timedOut),
      );
    } catch (error) {
      if (!(error instanceof InboxNetworkError)) throw error;
      return { ok: false, reason: "network", detail: `Resend: ${error.message}` };
    }
    if (!response.ok) {
      const reason: EmailFailure =
        response.status === 429 ? "rate_limited" : response.status >= 500 ? "server" : "rejected";
      return { ok: false, reason, detail: `Resend answered ${String(response.status)}` };
    }
    const parsed = receivedAnswer.safeParse(await response.json().catch(() => undefined));
    if (!parsed.success) {
      return { ok: false, reason: "server", detail: "Resend's answer was not a received email" };
    }
    const { from, to, subject, text, html, authentication } = parsed.data;
    return {
      ok: true,
      email: {
        from: bareAddress(from),
        to: to.map(bareAddress),
        subject: subject ?? "",
        text: text ?? undefined,
        html: html ?? undefined,
        checks: { spf: authentication?.spf, dkim: authentication?.dkim },
      },
    };
  }
}

/** How old (or how far ahead) a signed webhook may be: 5 minutes, as Svix recommends. */
export const WEBHOOK_TOLERANCE_SECONDS = 5 * 60;

/**
 * Checks a webhook signed in the Svix scheme (used by Resend): HMAC-SHA256 over
 * "id.timestamp.body" with the secret (base64 after "whsec_"), compared in constant time with
 * any "v1," signature in the header, and a timestamp within 5 minutes of `now`. Pure.
 */
export function verifyWebhookSignature(input: {
  secret: string;
  id: string;
  timestamp: string;
  signature: string;
  body: string;
  now: Date;
}): boolean {
  const { secret, id, timestamp, signature, body, now } = input;
  const seconds = Number(timestamp);
  if (!/^\d{1,12}$/.test(timestamp) || !Number.isFinite(seconds)) return false;
  if (Math.abs(now.getTime() / 1000 - seconds) > WEBHOOK_TOLERANCE_SECONDS) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  if (key.length === 0) return false;
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return signature.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || value === undefined) return false;
    const given = Buffer.from(value, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
