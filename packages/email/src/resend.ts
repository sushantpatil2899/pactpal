import {
  defaultHttpDeps,
  sendWithRetry,
  type HttpDeps,
  type RetryPolicy,
  type Secret,
} from "@pactpal/net";
import { z } from "zod";
import {
  emailMessageSchema,
  type EmailFailure,
  type EmailMessage,
  type EmailSender,
  type SendResult,
} from "./message.js";

/** Resend's address for sending one email. */
export const RESEND_EMAILS_URL = "https://api.resend.com/emails";

/**
 * Sending is quick, so each try gets 15 seconds. Only emails with an idempotency key are retried
 * (Resend treats a repeated key as the same email); a host that asks to wait up to 30 seconds
 * is obeyed.
 */
export const EMAIL_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
  timeoutMs: 15_000,
  maxRetryAfterMs: 30_000,
};

const sentAnswer = z.looseObject({ id: z.string().min(1) });
/** Resend's error answers carry a short error name, e.g. "validation_error"; only that is shown. */
const errorAnswer = z.looseObject({ name: z.string().regex(/^[\w.-]{1,64}$/) });

/**
 * Domains set aside for examples and testing (RFC 2606 and 6761): they never receive mail.
 * PayPal sandbox accounts and test buyers use them, and sending there would only bounce.
 */
const RESERVED_DOMAINS = ["example.com", "example.net", "example.org"];
const RESERVED_ENDINGS = [".example", ".test", ".invalid", ".localhost"];

/** Whether an address is on a domain reserved for examples and testing (subdomains included). */
export function isReservedTestAddress(address: string): boolean {
  const domain = address.slice(address.lastIndexOf("@") + 1).toLowerCase();
  return (
    RESERVED_DOMAINS.some((name) => domain === name || domain.endsWith(`.${name}`)) ||
    RESERVED_ENDINGS.some((ending) => domain.endsWith(ending))
  );
}

class EmailNetworkError extends Error {
  constructor(readonly timedOut: boolean) {
    super(timedOut ? "timed out" : "could not reach Resend");
  }
}

function reasonFor(status: number): EmailFailure {
  if (status === 429) return "rate_limited";
  return status >= 500 ? "server" : "rejected";
}

/** Resend's short error name from an error answer, if it has a readable one. */
async function errorName(response: Response): Promise<string | undefined> {
  const body: unknown = await response.json().catch(() => undefined);
  const parsed = errorAnswer.safeParse(body);
  return parsed.success ? parsed.data.name : undefined;
}

export interface ResendOptions {
  /** Undefined when the key is not set; every send then fails as `not_configured`. */
  apiKey: Secret | undefined;
  /** The sender, e.g. `PactPal <receipts@send.example.com>`, on a domain verified in Resend. */
  from: string;
  deps?: HttpDeps;
  policy?: RetryPolicy;
}

/**
 * Sends email through Resend's API over HTTPS. Failures come back as values. Addresses on
 * domains reserved for testing are refused without calling Resend. The key goes only in
 * the request header; failure details hold the status and Resend's short error name, never the
 * address, the text or the key.
 */
export class ResendEmailSender implements EmailSender {
  readonly live = true;
  readonly #key: Secret | undefined;
  readonly #from: string;
  readonly #deps: HttpDeps;
  readonly #policy: RetryPolicy;

  constructor(options: ResendOptions) {
    this.#key = options.apiKey;
    this.#from = options.from;
    this.#deps = options.deps ?? defaultHttpDeps;
    this.#policy = options.policy ?? EMAIL_RETRY_POLICY;
  }

  async send(input: EmailMessage): Promise<SendResult> {
    const message = emailMessageSchema.parse(input);
    if (this.#key === undefined) {
      return { ok: false, reason: "not_configured", detail: "RESEND_API_KEY is not set" };
    }
    // A bounce would hurt the sending domain's reputation, so these are never sent.
    if (isReservedTestAddress(message.to)) {
      return { ok: false, reason: "rejected", detail: "reserved test address" };
    }
    const body = {
      from: this.#from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      ...(message.html === undefined ? {} : { html: message.html }),
      ...(message.attachments
        ? {
            attachments: message.attachments.map((file) => ({
              filename: file.filename,
              content: Buffer.from(file.bytes).toString("base64"),
            })),
          }
        : {}),
    };
    let response: Response;
    try {
      response = await sendWithRetry(
        {
          operation: "POST /emails",
          url: RESEND_EMAILS_URL,
          init: {
            method: "POST",
            headers: {
              authorization: `Bearer ${this.#key.reveal()}`,
              "content-type": "application/json",
              ...(message.idempotencyKey === undefined
                ? {}
                : { "idempotency-key": message.idempotencyKey }),
            },
            body: JSON.stringify(body),
          },
          // Without a key a repeat could send the email twice, so only keyed emails are retried.
          idempotent: message.idempotencyKey !== undefined,
        },
        this.#deps,
        this.#policy,
        (timedOut) => new EmailNetworkError(timedOut),
      );
    } catch (error) {
      if (!(error instanceof EmailNetworkError)) throw error;
      return { ok: false, reason: "network", detail: `Resend: ${error.message}` };
    }
    if (!response.ok) {
      const name = await errorName(response);
      return {
        ok: false,
        reason: reasonFor(response.status),
        detail: `Resend answered ${String(response.status)}${name === undefined ? "" : ` (${name})`}`,
      };
    }
    const sent = sentAnswer.safeParse(await response.json().catch(() => undefined));
    return sent.success
      ? { ok: true, id: sent.data.id }
      : { ok: false, reason: "server", detail: "Resend's answer had no message id" };
  }
}
