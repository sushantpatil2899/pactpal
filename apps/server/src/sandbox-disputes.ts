/**
 * `pnpm sandbox:disputes [--id <dispute id>] [--as <payer id>]`: lists the seller
 * app's sandbox disputes, or a connected seller's with --as, or shows one in full.
 * Read-only.
 */
import { PayPalDisputes } from "@pactpal/paypal";
import { disputeClients, fail } from "./sandbox-clients.js";
import {
  formatDisputeDetails,
  formatDisputeList,
  parseDisputeArgs,
} from "./sandbox-disputes-report.js";

const parsed = parseDisputeArgs(process.argv.slice(2));
if (!parsed.ok) {
  fail(`${parsed.error}\nUsage: pnpm sandbox:disputes [--id <dispute id>] [--as <payer id>]`);
}

const { rest, mcp, fallback, close } = disputeClients(parsed.as);
const disputes = new PayPalDisputes(rest, mcp, fallback);
try {
  if (parsed.id === undefined) {
    const result = await disputes.list();
    process.stdout.write(formatDisputeList(result.data, result, parsed.as));
  } else {
    const result = await disputes.get(parsed.id);
    process.stdout.write(formatDisputeDetails(result.data, result));
  }
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await close();
}
