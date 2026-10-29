/**
 * `pnpm sandbox:respond`: answers one sandbox dispute (evidence, offer,
 * accepting the claim, appeal). A dry run unless --send is given.
 */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { PayPalDisputes, checkEvidenceFiles, type EvidenceFile } from "@pactpal/paypal";
import { fail, sellerClients } from "./sandbox-clients.js";
import { USAGE, formatPlan, formatSent, parseRespondArgs } from "./sandbox-respond-report.js";

const parsed = parseRespondArgs(process.argv.slice(2));
if (!parsed.ok) fail(`${parsed.error}\n${USAGE}`);
const args = parsed.value;

const { rest, mcp, fallback } = sellerClients();
const disputes = new PayPalDisputes(rest, mcp, fallback);
try {
  const paths = "files" in args.answer ? args.answer.files : [];
  const files: EvidenceFile[] = await Promise.all(
    paths.map(async (path) => ({ filename: basename(path), bytes: await readFile(path) })),
  );
  checkEvidenceFiles(files); // a dry run also reports bad files

  const { data: dispute } = await disputes.get(args.id);
  process.stdout.write(formatPlan(args, dispute));

  if (args.send) {
    const requestId = `sandbox-respond-${randomUUID()}`;
    const { answer, note } = args;
    const result =
      answer.kind === "evidence"
        ? await disputes.provideEvidence(args.id, {
            evidenceType: answer.evidenceType,
            notes: note,
            files,
            requestId,
          })
        : answer.kind === "offer"
          ? await disputes.makeOffer(args.id, {
              offerType: answer.offerType,
              amount: answer.amount,
              note,
              requestId,
            })
          : answer.kind === "accept"
            ? await disputes.acceptClaim(args.id, {
                note,
                requestId,
                ...(answer.refundAmount && { refundAmount: answer.refundAmount }),
              })
            : await disputes.appeal(args.id, {
                evidenceType: "OTHER",
                notes: note,
                files,
                requestId,
              });
    process.stdout.write(formatSent(args, result));
  }
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await mcp.close();
}
