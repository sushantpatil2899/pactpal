import {
  PARTNER_FEATURES,
  referralBody,
  type InvoiceDraft,
  type MerchantLookup,
  type MerchantStatus,
  type PartnerFeature,
} from "@pactpal/paypal";
import { z } from "zod";
import { payPalIdOption, readChecked, type Checked } from "./cli-args.js";
import { formatAmount, rows } from "./format.js";

/** Where a connecting seller lands after approving, unless --return-url says otherwise. */
export const DEFAULT_RETURN_URL = "https://pact-pal.app/";

export type PartnerTask =
  | { kind: "link"; returnUrl: string; features: PartnerFeature[]; send: boolean }
  | { kind: "status"; trackingId: string; partnerId: string | undefined }
  | { kind: "act"; merchantId: string; send: boolean };

export const USAGE =
  "Usage: pnpm sandbox:partner (--link [--features <list>] [--return-url <https url>] | --status <tracking id> [--partner-id <id>] | --act <seller payer id>) [--send]";

const id = (option: string) => payPalIdOption(option).optional();

/**
 * `--features READ_SELLER_DISPUTE,UPDATE_SELLER_DISPUTE`: ask for fewer permissions. The sandbox
 * refused INVOICE_READ_WRITE for our platform app on 7 Nov 2026 (docs/spike-results.md, S0a).
 */
const featureList = z
  .string()
  .transform((value) => value.split(",").map((name) => name.trim()))
  .pipe(
    z
      .array(z.enum(PARTNER_FEATURES, `--features takes ${PARTNER_FEATURES.join(", ")}`))
      .transform((names) => [...new Set(names)]),
  )
  .optional();

const argsSchema = z.object({
  link: z.boolean().default(false),
  features: featureList,
  "return-url": z
    .url({ protocol: /^https$/, error: "--return-url needs an https address" })
    .default(DEFAULT_RETURN_URL),
  status: id("--status"),
  "partner-id": id("--partner-id"),
  act: id("--act"),
  send: z.boolean().default(false),
});

/** Reads the command line; exactly one task must be chosen, and only the writes take --send. */
export function parsePartnerArgs(argv: readonly string[]): Checked<PartnerTask> {
  const parsed = readChecked(
    argv,
    {
      link: { type: "boolean" },
      features: { type: "string" },
      "return-url": { type: "string" },
      status: { type: "string" },
      "partner-id": { type: "string" },
      act: { type: "string" },
      send: { type: "boolean" },
    },
    argsSchema,
  );
  if (!parsed.ok) return parsed;
  const v = parsed.value;
  if ([v.link, v.status !== undefined, v.act !== undefined].filter(Boolean).length !== 1) {
    return { ok: false, error: "give exactly one of --link, --status or --act" };
  }
  if (v.status !== undefined) {
    if (v.send) return { ok: false, error: "--send is only used with --link or --act" };
    return {
      ok: true,
      value: { kind: "status", trackingId: v.status, partnerId: v["partner-id"] },
    };
  }
  if (v["partner-id"] !== undefined) {
    return { ok: false, error: "--partner-id is only used with --status" };
  }
  if (v.features !== undefined && !v.link) {
    return { ok: false, error: "--features is only used with --link" };
  }
  if (v.act !== undefined)
    return { ok: true, value: { kind: "act", merchantId: v.act, send: v.send } };
  return {
    ok: true,
    value: {
      kind: "link",
      returnUrl: v["return-url"],
      features: v.features ?? [...PARTNER_FEATURES],
      send: v.send,
    },
  };
}

/** The draft invoice S0a creates for the connected seller: made-up recipient, never sent. */
export function spikeDraft(requestId: string): InvoiceDraft {
  return {
    recipientEmail: "spike-buyer@example.com",
    amount: { minor: 100, currency: "USD" },
    itemName: "PactPal spike S0a (draft, never sent)",
    description: "Created on the seller's behalf to test the platform connection",
    scopeReference: "spike S0a, no deal",
    requestId,
  };
}

const dryRun = "Dry run: nothing was sent. Add --send to do it.\n";

/** What --link would send, without contacting PayPal. */
export function formatLinkPreview(
  trackingId: string,
  returnUrl: string,
  features: readonly PartnerFeature[],
): string {
  const body = referralBody({ trackingId, returnUrl, features });
  return `Connect link (dry run)\n${rows([
    ["Tracking id", trackingId],
    ["Permissions", features.join(", ")],
    ["Return to", returnUrl],
  ])}\nRequest body:\n${JSON.stringify(body, null, 2)}\n\n${dryRun}`;
}

/** The connect link and what to do next. */
export function formatReferral(trackingId: string, actionUrl: string, debugId?: string): string {
  return `Connect link created\n${rows([
    ["Tracking id", trackingId],
    ["Debug id", debugId ?? "none"],
    ["Open on a computer", actionUrl],
  ])}\nAfter approving, run: pnpm sandbox:partner --status ${trackingId}\n`;
}

const yesNo = (value: boolean | undefined) =>
  value === undefined ? "not stated" : value ? "yes" : "no";

/** Whether the seller has connected, and what they granted to this platform app. */
export function formatStatus(
  trackingId: string,
  partnerId: string,
  platformClientId: string,
  lookup: MerchantLookup,
  status: MerchantStatus | undefined,
): string {
  const ids: [string, string][] = [
    ["Tracking id", trackingId],
    ["Partner id", partnerId],
  ];
  if (!lookup.connected || status === undefined) {
    return `Seller connection\n${rows(ids)}  Not connected yet. Open the link and approve, or wait a minute and run this again.\n`;
  }
  const ours = status.grants.filter((grant) => grant.partnerClientId === platformClientId);
  const scopes = ours.flatMap((grant) => grant.scopes);
  return `Seller connection\n${rows([
    ...ids,
    ["Seller payer id", status.merchantId],
    ["Payments receivable", yesNo(status.paymentsReceivable)],
    ["Email confirmed", yesNo(status.emailConfirmed)],
    [
      "Granted to our app",
      ours.length === 0 ? "nothing listed" : `${String(scopes.length)} permissions`,
    ],
  ])}${scopes.map((scope) => `    ${scope}\n`).join("")}\nNext: pnpm sandbox:partner --act ${status.merchantId}\n`;
}

/** What --act would do, without contacting PayPal. */
export function formatActPreview(merchantId: string, draft: InvoiceDraft): string {
  return `Act for seller ${merchantId} (dry run)\n${rows([
    ["1. Create draft", `${formatAmount(draft.amount)} to ${draft.recipientEmail}, never sent`],
    ["2. Read it back", "status and whose invoice it is"],
    ["3. List disputes", "read only"],
    ["4. MCP (S0c)", "list_invoices as the seller; the draft must be in it"],
  ])}\n${dryRun}`;
}

/** One step of --act: what PayPal answered, or why it failed. */
export type StepResult = { ok: true; detail: string } | { ok: false; error: string };

/** The outcome of each --act step; a failed step does not hide the others. */
export function formatActReport(
  merchantId: string,
  steps: readonly (readonly [string, StepResult])[],
): string {
  const passed = steps.filter(([, result]) => result.ok).length;
  return `Act for seller ${merchantId}: ${String(passed)} of ${String(steps.length)} steps passed\n${rows(
    steps.map(([label, result]) => [
      label,
      result.ok ? `ok: ${result.detail}` : `FAILED: ${result.error}`,
    ]),
  )}`;
}

/** Whether an MCP answer lists the invoice: its id appears anywhere in the answer. */
export function listsInvoice(answer: unknown, invoiceId: string): boolean {
  return JSON.stringify(answer ?? null).includes(`"${invoiceId}"`);
}
