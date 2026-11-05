import {
  findIntakeKey,
  getUser,
  recordWebhookEvent,
  useIntakeKey,
  type Database,
} from "@pactpal/db";
import {
  htmlToText,
  verifyWebhookSignature,
  type EmailSender,
  type ReceivedEmails,
} from "@pactpal/email";
import type { Secret } from "@pactpal/net";
import { numberSourceLines } from "@pactpal/scope-draft";
import type { FastifyBaseLogger, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { createIntakeDeal, intakeFilename } from "../deals/intake.js";
import { intakeEmail } from "../email/intake-email.js";

export const RESEND_INBOUND_PATH = "/api/intake/email";

export interface ResendInboundOptions {
  database: Database | undefined;
  clock: () => Date;
  newId: () => string;
  publicBaseUrl: string | undefined;
  email: EmailSender;
  /** Forwarding is on only with all three: the inbox reader, the signing secret and the domain. */
  inbound: { inbox: ReceivedEmails; webhookSecret: Secret; domain: string } | undefined;
}

const envelope = z.looseObject({
  type: z.string(),
  data: z.looseObject({
    email_id: z.string().min(1),
    to: z.array(z.string()).default([]),
    received_for: z.array(z.string()).default([]),
  }),
});

/** The forwarding code in `deals+<code>@<domain>` among the addresses, if one is there. */
export function forwardingCode(addresses: readonly string[], domain: string): string | undefined {
  const pattern = new RegExp(`^deals\\+([a-z0-9]{16})@${domain.replaceAll(".", "\\.")}$`, "i");
  for (const address of addresses) {
    const bare = (/<([^<>\s]+)>/.exec(address)?.[1] ?? address).trim();
    const code = pattern.exec(bare)?.[1];
    if (code !== undefined) return code.toLowerCase();
  }
  return undefined;
}

const passed = (result: string | undefined) => result === "pass";

/**
 * Email forwarding (4p-2): Resend posts `email.received` here. The signature is checked on the
 * raw body first; then the email is read back, saved once by Resend's event id, and becomes a
 * draft deal only when it went to a seller's forwarding address, came from that seller's own
 * address and passed SPF or DKIM. Anything else is dropped quietly (logged by reason only) and
 * nobody but the seller is ever emailed. Answers 200 unless Resend should try again later.
 */
export const resendInboundRoutes: FastifyPluginAsync<ResendInboundOptions> = (app, options) => {
  const { database, clock, newId, publicBaseUrl, email, inbound } = options;

  // Keep the body as text: the signature covers the bytes exactly as Resend sent them.
  app.addContentTypeParser("application/json", { parseAs: "string" }, (_request, body, done) => {
    done(null, body);
  });

  /** A forwarded email dropped on purpose: logged by reason only, answered 200 so it is not sent again. */
  const drop = (log: FastifyBaseLogger, reason: string) => {
    log.info({ reason }, "Forwarded email not used");
    return { ok: true };
  };

  app.post(RESEND_INBOUND_PATH, async (request, reply) => {
    if (!database || !inbound) return reply.code(503).send({ error: "forwarding is not set up" });
    const raw = typeof request.body === "string" ? request.body : "";
    const header = (name: string) => {
      const value = request.headers[name];
      return (Array.isArray(value) ? value[0] : value) ?? "";
    };
    const id = header("svix-id");
    const genuine = verifyWebhookSignature({
      secret: inbound.webhookSecret.reveal(),
      id,
      timestamp: header("svix-timestamp"),
      signature: header("svix-signature"),
      body: raw,
      now: clock(),
    });
    if (!genuine || id === "") {
      request.log.warn("Inbound email webhook refused: bad signature");
      return reply.code(400).send({ error: "not verified" });
    }
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return reply.code(400).send({ error: "body is not JSON" });
    }
    const event = envelope.safeParse(body);
    if (!event.success) return reply.code(400).send({ error: "not a Resend event" });
    if (event.data.type !== "email.received") return reply.send(drop(request.log, "other event"));
    const { data } = event.data;
    const code = forwardingCode([...data.to, ...data.received_for], inbound.domain);
    if (code === undefined) return reply.send(drop(request.log, "no forwarding address"));

    // Read the email before saving the event, so a failed read is tried again by Resend.
    const read = await inbound.inbox.get(data.email_id);
    if (!read.ok) {
      request.log.warn({ reason: read.reason }, "Forwarded email could not be read");
      return reply.code(500).send({ error: "could not read the email" });
    }
    const saved = await recordWebhookEvent(
      database,
      { source: "resend", eventId: id, eventType: event.data.type, body: z.json().parse(body) },
      clock(),
    );
    if (saved === "repeat") return reply.send(drop(request.log, "repeat"));

    const owner = await findIntakeKey(database, code, "address");
    if (!owner) return reply.send(drop(request.log, "unknown address"));
    const seller = await getUser(database, owner.sellerId);
    const received = read.email;
    if (seller?.email.toLowerCase() !== received.from) {
      return reply.send(drop(request.log, "sender is not the seller"));
    }
    if (!passed(received.checks.spf) && !passed(received.checks.dkim)) {
      return reply.send(drop(request.log, "sender checks failed"));
    }
    const plain = received.text?.trim() ?? "";
    const text = plain === "" ? htmlToText(received.html ?? "") : plain;
    const numbered = numberSourceLines(text);
    if (!numbered.ok) return reply.send(drop(request.log, `text ${numbered.reason}`));
    const used = await useIntakeKey(database, code, clock(), "address");
    if (!used.ok) return reply.send(drop(request.log, used.reason));

    const title = received.subject.trim().slice(0, 200) || "Forwarded email";
    const dealId = await createIntakeDeal(
      { db: database, clock, newId },
      {
        record: used.record,
        via: "email",
        title,
        text,
        filename: intakeFilename("email", clock()),
      },
    );
    request.log.info({ dealId, keyId: used.record.id }, "Deal created from a forwarded email");
    const sent = await email.send(
      intakeEmail({
        to: seller.email,
        dealTitle: title,
        forwardedAt: clock(),
        link: `${publicBaseUrl ?? ""}/deals/${dealId}`,
        idempotencyKey: `intake-email:${dealId}`,
      }),
    );
    if (!sent.ok && email.live) {
      request.log.warn({ dealId, reason: sent.reason }, "Forwarding confirmation not sent");
    }
    return reply.send({ ok: true });
  });

  return Promise.resolve();
};
