/**
 * `pnpm sandbox:respond`: answers one sandbox dispute (evidence, offer,
 * accepting the claim, escalating, appeal), or takes a sandbox-only step
 * towards a verdict (require evidence, settle). A dry run unless --send is given.
 */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import {
  PayPalSandboxDisputes,
  checkEvidenceFiles,
  type DisputeAnswer,
  type EvidenceFile,
  type PayPalResult,
} from "@pactpal/paypal";
import { fail, sellerClients } from "./sandbox-clients.js";
import { USAGE, formatPlan, formatSent, parseRespondArgs } from "./sandbox-respond-report.js";

const parsed = parseRespondArgs(process.argv.slice(2));
if (!parsed.ok) fail(`${parsed.error}\n${USAGE}`);
const args = parsed.value;

const { rest, mcp, fallback } = sellerClients();
const disputes = new PayPalSandboxDisputes(rest, mcp, fallback);

function send(requestId: string, files: EvidenceFile[]): Promise<PayPalResult<DisputeAnswer>> {
  const { answer, note, id } = args;
  switch (answer.kind) {
    case "evidence":
      return disputes.provideEvidence(id, {
        evidenceType: answer.evidenceType,
        notes: note,
        files,
        requestId,
      });
    case "offer":
      return disputes.makeOffer(id, {
        offerType: answer.offerType,
        amount: answer.amount,
        note,
        requestId,
      });
    case "accept":
      return disputes.acceptClaim(id, {
        note,
        requestId,
        ...(answer.refundAmount && { refundAmount: answer.refundAmount }),
      });
    case "appeal":
      return disputes.appeal(id, { evidenceType: "OTHER", notes: note, files, requestId });
    case "escalate":
      return disputes.escalate(id, { note, requestId });
    case "require-evidence":
      return disputes.requireEvidence(id, answer.from, requestId);
    case "settle":
      return disputes.adjudicate(id, answer.winner, requestId);
  }
}

try {
  const paths = "files" in args.answer ? args.answer.files : [];
  const files: EvidenceFile[] = await Promise.all(
    paths.map(async (path) => ({ filename: basename(path), bytes: await readFile(path) })),
  );
  checkEvidenceFiles(files); // a dry run also reports bad files

  const { data: dispute } = await disputes.get(args.id);
  process.stdout.write(formatPlan(args, dispute));

  if (args.send) {
    process.stdout.write(formatSent(args, await send(`sandbox-respond-${randomUUID()}`, files)));
  }
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await mcp.close();
}
