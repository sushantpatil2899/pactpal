import { z } from "zod";
import type { PayPalRestClient } from "./rest.js";

const VERIFY_PATH = "/v1/notifications/verify-webhook-signature";
const WEBHOOKS_PATH = "/v1/notifications/webhooks";
const EVENTS_PATH = "/v1/notifications/webhooks-events";

/** Notifications PactPal registers for: invoices, payments and disputes. */
export const WEBHOOK_EVENT_TYPES = [
  "INVOICING.INVOICE.CREATED",
  "INVOICING.INVOICE.PAID",
  "INVOICING.INVOICE.CANCELLED",
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.REFUNDED",
  "CUSTOMER.DISPUTE.CREATED",
  "CUSTOMER.DISPUTE.UPDATED",
  "CUSTOMER.DISPUTE.RESOLVED",
] as const;

/** The signature headers PayPal sends with every notification, by verify-API field. */
const SIGNATURE_HEADERS = {
  auth_algo: "paypal-auth-algo",
  cert_url: "paypal-cert-url",
  transmission_id: "paypal-transmission-id",
  transmission_sig: "paypal-transmission-sig",
  transmission_time: "paypal-transmission-time",
} as const;

export type WebhookVerification = { verified: true } | { verified: false; reason: string };

export interface WebhookRegistration {
  webhookId: string;
  url: string;
  eventTypes: string[];
}

export interface WebhookEventRecord {
  eventId: string;
  eventType: string;
  createdAt: string | undefined;
  summary: string | undefined;
  /** PayPal's delivery attempts to registered addresses, when it reports them. */
  deliveries: {
    url: string | undefined;
    status: string | undefined;
    httpStatus: number | undefined;
  }[];
}

const verifyAnswer = z.looseObject({ verification_status: z.string() });

const registration = z
  .looseObject({
    id: z.string(),
    url: z.string(),
    event_types: z.array(z.looseObject({ name: z.string() })).default([]),
  })
  .transform((raw): WebhookRegistration => ({
    webhookId: raw.id,
    url: raw.url,
    eventTypes: raw.event_types.map((type) => type.name),
  }));

const registrations = z
  .looseObject({ webhooks: z.array(registration).default([]) })
  .transform((raw) => raw.webhooks);

const eventRecords = z
  .looseObject({
    events: z
      .array(
        z.looseObject({
          id: z.string(),
          event_type: z.string(),
          create_time: z.string().optional(),
          summary: z.string().optional(),
          transmissions: z
            .array(
              z.looseObject({
                webhook_url: z.string().optional(),
                status: z.string().optional(),
                http_status: z.number().optional(),
              }),
            )
            .default([]),
        }),
      )
      .default([]),
  })
  .transform((raw) =>
    raw.events.map((event): WebhookEventRecord => ({
      eventId: event.id,
      eventType: event.event_type,
      createdAt: event.create_time,
      summary: event.summary,
      deliveries: event.transmissions.map((t) => ({
        url: t.webhook_url,
        status: t.status,
        httpStatus: t.http_status,
      })),
    })),
  );

/** True for an https address on paypal.com, where PayPal keeps its signing certificates. */
function isPayPalCertUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "paypal.com" || url.hostname.endsWith(".paypal.com"))
    );
  } catch {
    return false;
  }
}

/**
 * PayPal notifications (webhooks) for one app: checking that a received
 * notification really came from PayPal, and managing where PayPal sends them.
 * PayPal has no MCP tools for these, so they use REST only.
 */
export class PayPalWebhooks {
  readonly #rest: Pick<PayPalRestClient, "request">;

  constructor(rest: Pick<PayPalRestClient, "request">) {
    this.#rest = rest;
  }

  /**
   * Asks PayPal whether a received notification is genuine. `rawBody` is sent
   * byte for byte, as PayPal requires; header names must be lower case.
   * Throws when PayPal cannot be asked, so the caller can have PayPal retry.
   */
  async verify(
    rawBody: string,
    headers: Readonly<Record<string, string | undefined>>,
    webhookId: string,
  ): Promise<WebhookVerification> {
    const values: Record<string, string> = {};
    for (const [field, header] of Object.entries(SIGNATURE_HEADERS)) {
      const value = headers[header];
      if (value === undefined || value === "")
        return { verified: false, reason: `missing ${header}` };
      values[field] = value;
    }
    if (!isPayPalCertUrl(values.cert_url ?? "")) {
      return { verified: false, reason: "certificate address is not on paypal.com" };
    }

    // The event goes in unchanged: re-serialising it could change bytes and fail verification.
    const head = JSON.stringify({ ...values, webhook_id: webhookId });
    const { data } = await this.#rest.request({
      method: "POST",
      path: VERIFY_PATH,
      requestId: `verify-${values.transmission_id ?? ""}`,
      rawJson: `${head.slice(0, -1)},"webhook_event":${rawBody}}`,
      schema: verifyAnswer,
    });
    return data.verification_status === "SUCCESS"
      ? { verified: true }
      : { verified: false, reason: `PayPal reported ${data.verification_status}` };
  }

  /** The app's registered notification addresses. */
  async list(): Promise<WebhookRegistration[]> {
    return (await this.#rest.request({ method: "GET", path: WEBHOOKS_PATH, schema: registrations }))
      .data;
  }

  /** Registers an https address for PactPal's notification types. */
  async register(url: string, requestId: string): Promise<WebhookRegistration> {
    const body = { url, event_types: WEBHOOK_EVENT_TYPES.map((name) => ({ name })) };
    return (
      await this.#rest.request({
        method: "POST",
        path: WEBHOOKS_PATH,
        body,
        requestId,
        schema: registration,
      })
    ).data;
  }

  /** Removes a registered address. */
  async remove(webhookId: string, requestId: string): Promise<void> {
    await this.#rest.request({
      method: "DELETE",
      path: `${WEBHOOKS_PATH}/${encodeURIComponent(webhookId)}`,
      requestId,
      schema: z.undefined(),
    });
  }

  /** PayPal's record of recent notifications for this app, newest first. */
  async recentEvents(pageSize = 10): Promise<WebhookEventRecord[]> {
    return (
      await this.#rest.request({
        method: "GET",
        path: EVENTS_PATH,
        query: { page_size: pageSize },
        schema: eventRecords,
      })
    ).data;
  }
}
