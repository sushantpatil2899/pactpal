/**
 * `pnpm sandbox:disputes [--id <dispute id>]`: lists the seller app's sandbox
 * disputes, or shows one in full. Read-only.
 */
import { PayPalDisputes } from "@pactpal/paypal";
import { fail, sellerClients } from "./sandbox-clients.js";
import {
  formatDisputeDetails,
  formatDisputeList,
  parseDisputeArgs,
} from "./sandbox-disputes-report.js";

const parsed = parseDisputeArgs(process.argv.slice(2));
if (!parsed.ok) fail(`${parsed.error}\nUsage: pnpm sandbox:disputes [--id <dispute id>]`);

const { rest, mcp, fallback } = sellerClients();
const disputes = new PayPalDisputes(rest, mcp, fallback);
try {
  if (parsed.id === undefined) {
    const result = await disputes.list();
    process.stdout.write(formatDisputeList(result.data, result));
  } else {
    const result = await disputes.get(parsed.id);
    process.stdout.write(formatDisputeDetails(result.data, result));
  }
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await mcp.close();
}
