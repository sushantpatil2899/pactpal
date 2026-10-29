import {
  WEBHOOK_EVENT_TYPES,
  type WebhookEventRecord,
  type WebhookRegistration,
} from "@pactpal/paypal";
import { z } from "zod";
import { readChecked, type Checked } from "./cli-args.js";
import { rows } from "./format.js";

export type WebhookTask =
  | { kind: "list" }
  | { kind: "events" }
  | { kind: "register"; url: string; send: boolean }
  | { kind: "delete"; webhookId: string; send: boolean };

export const USAGE =
  "Usage: pnpm sandbox:webhook (--list | --events | --register <https url> | --delete <webhook id>) [--send]";

const argsSchema = z.object({
  list: z.boolean().default(false),
  events: z.boolean().default(false),
  register: z.url({ protocol: /^https$/, error: "--register needs an https address" }).optional(),
  delete: z
    .string()
    .regex(/^[A-Za-z0-9_-]{1,64}$/, "--delete needs a webhook id")
    .optional(),
  send: z.boolean().default(false),
});

/** Reads the command line; exactly one task must be chosen. */
export function parseWebhookArgs(argv: readonly string[]): Checked<WebhookTask> {
  const parsed = readChecked(
    argv,
    {
      list: { type: "boolean" },
      events: { type: "boolean" },
      register: { type: "string" },
      delete: { type: "string" },
      send: { type: "boolean" },
    },
    argsSchema,
  );
  if (!parsed.ok) return parsed;
  const v = parsed.value;
  const chosen = [v.list, v.events, v.register !== undefined, v.delete !== undefined];
  if (chosen.filter(Boolean).length !== 1) {
    return { ok: false, error: "give exactly one of --list, --events, --register or --delete" };
  }
  if (v.send && v.register === undefined && v.delete === undefined) {
    return { ok: false, error: "--send is only used with --register or --delete" };
  }
  if (v.register !== undefined)
    return { ok: true, value: { kind: "register", url: v.register, send: v.send } };
  if (v.delete !== undefined)
    return { ok: true, value: { kind: "delete", webhookId: v.delete, send: v.send } };
  return { ok: true, value: { kind: v.list ? "list" : "events" } };
}

/** The app's registered notification addresses. */
export function formatRegistrations(list: readonly WebhookRegistration[]): string {
  if (list.length === 0) return "Registered notification addresses: none\n";
  return `Registered notification addresses: ${list.length}\n${list
    .map((r) => `  ${r.webhookId}  ${r.url}\n    ${r.eventTypes.join(", ")}\n`)
    .join("")}`;
}

/** What a registration or removal would do, before --send. */
export function formatPreview(task: Extract<WebhookTask, { kind: "register" | "delete" }>): string {
  const what =
    task.kind === "register"
      ? `register ${task.url}\n  for: ${WEBHOOK_EVENT_TYPES.join(", ")}`
      : `remove webhook ${task.webhookId}`;
  return `Would ${what}\nDry run: nothing was sent. Add --send to send it.\n`;
}

/** The result of a registration, with what to do next. */
export function formatRegistered(r: WebhookRegistration): string {
  return (
    `Registered.\n${rows([
      ["Webhook id", r.webhookId],
      ["Address", r.url],
      ["Events", r.eventTypes.join(", ")],
    ])}` + `Next: set PAYPAL_WEBHOOK_ID=${r.webhookId} in Render's Environment page.\n`
  );
}

/** PayPal's record of recent notifications and their deliveries. */
export function formatEvents(events: readonly WebhookEventRecord[]): string {
  if (events.length === 0) return "Recent notifications: none\n";
  return `Recent notifications: ${events.length}\n${events
    .map((e) => {
      const deliveries =
        e.deliveries.length === 0
          ? "    delivery: PayPal does not report it here; check the server's logs\n"
          : e.deliveries
              .map((d) => `    ${d.status ?? "-"} ${d.httpStatus ?? "-"} ${d.url ?? "-"}\n`)
              .join("");
      return `  ${e.createdAt ?? "-"}  ${e.eventType}  ${e.eventId}\n${deliveries}`;
    })
    .join("")}`;
}
