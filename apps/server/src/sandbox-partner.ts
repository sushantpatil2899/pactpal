/**
 * `pnpm sandbox:partner`: spike S0a/S0c (docs/spike-results.md). The platform
 * app asks PayPal for a "Connect with PayPal" link, checks whether a second
 * seller connected, then works for that seller: a draft invoice that is never
 * sent, a dispute listing, and one MCP read. Writes are dry runs unless --send.
 */
import { randomUUID } from "node:crypto";
import { PayPalDisputes, PayPalInvoices, PayPalPartners } from "@pactpal/paypal";
import { valueOrExit } from "./cli-args.js";
import { appClients } from "./sandbox-clients.js";
import {
  USAGE,
  formatActPreview,
  formatActReport,
  formatLinkPreview,
  formatReferral,
  formatStatus,
  listsInvoice,
  parsePartnerArgs,
  spikeDraft,
  type StepResult,
} from "./sandbox-partner-report.js";

const parsed = valueOrExit(parsePartnerArgs(process.argv.slice(2)), USAGE);
const platform = appClients("platform");
const partners = new PayPalPartners(platform.rest);

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

async function step(work: () => Promise<string>): Promise<StepResult> {
  try {
    return { ok: true, detail: await work() };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

/** Steps 1–4 of S0a/S0c for one connected seller; each is reported on its own. */
async function actFor(merchantId: string): Promise<string> {
  const seller = appClients("platform", { actAs: merchantId });
  // REST only for the seller's writes: MCP takes no request id, so a repeat could duplicate.
  const invoices = new PayPalInvoices(seller.rest, undefined, seller.fallback);
  const disputes = new PayPalDisputes(seller.rest, undefined, seller.fallback);
  let draftId: string | undefined;
  try {
    const steps: [string, StepResult][] = [];
    steps.push([
      "1. Create draft",
      await step(async () => {
        const created = await invoices.createDraft(spikeDraft(`spike-s0a-${randomUUID()}`));
        draftId = created.invoiceId;
        return `${created.invoiceId} (debug id ${created.create.debugId ?? "none"})`;
      }),
    ]);
    const skipped: StepResult = { ok: false, error: "skipped: no draft was created" };
    steps.push([
      "2. Read it back",
      draftId === undefined
        ? skipped
        : await step(async () => {
            const { data } = await invoices.get(draftId ?? "");
            return `status ${data.status}, invoice from ${data.invoicerEmail ?? "not shown"}`;
          }),
    ]);
    steps.push([
      "3. List disputes",
      await step(async () => {
        const { data } = await disputes.list();
        return `${String(data.disputes.length)} dispute(s)${data.truncated ? ", more not read" : ""}`;
      }),
    ]);
    steps.push([
      "4. MCP (S0c)",
      draftId === undefined
        ? skipped
        : await step(async () => {
            const answer = await seller.mcp.callTool("list_invoices", { page: 1, page_size: 20 });
            if (!listsInvoice(answer, draftId ?? "")) {
              throw new Error("MCP answered, but the seller's draft is not in its list");
            }
            return "the seller's draft is listed";
          }),
    ]);
    if (!steps.every(([, result]) => result.ok)) process.exitCode = 1;
    return formatActReport(merchantId, steps);
  } finally {
    await seller.mcp.close();
  }
}

try {
  switch (parsed.kind) {
    case "link": {
      const trackingId = `pactpal-s0a-${randomUUID()}`;
      if (!parsed.send) {
        process.stdout.write(formatLinkPreview(trackingId, parsed.returnUrl, parsed.features));
        break;
      }
      const referral = await partners.createReferral({
        trackingId,
        returnUrl: parsed.returnUrl,
        features: parsed.features,
        requestId: `sandbox-partner-${trackingId}`,
      });
      process.stdout.write(formatReferral(trackingId, referral.actionUrl, referral.debugId));
      break;
    }
    case "status": {
      const partnerId = parsed.partnerId ?? (await partners.ownAccountId());
      const lookup = await partners.findMerchant(partnerId, parsed.trackingId);
      const status = lookup.connected
        ? await partners.merchantStatus(partnerId, lookup.merchantId)
        : undefined;
      process.stdout.write(
        formatStatus(parsed.trackingId, partnerId, platform.clientId, lookup, status),
      );
      break;
    }
    case "act":
      process.stdout.write(
        parsed.send
          ? await actFor(parsed.merchantId)
          : formatActPreview(parsed.merchantId, spikeDraft("dry-run")),
      );
      break;
  }
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await platform.mcp.close();
}
