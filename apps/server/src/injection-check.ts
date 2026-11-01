/**
 * `pnpm eval:injection`: runs the hostile chats and drafts against the real models and reports
 * which attacks worked. Options: `--council` (also run the council on each chat), `--runs <n>`
 * (repeat each case), `--case <id>` (one case only). Costs tokens; made-up data only.
 */
import { z } from "zod";
import { readChecked } from "./cli-args.js";
import { loadConfigOrExit } from "./cli-config.js";
import { councilClients, cryptoCouncilDeps } from "./drafting/runtime.js";
import { formatInjectionReport, councilFailures } from "./injection-report.js";
import { runInjectionCheck } from "./injection-runner.js";

const USAGE = "Usage: pnpm eval:injection [--council] [--runs <1-10>] [--case <id>]";

const parsed = readChecked(
  process.argv.slice(2),
  { council: { type: "boolean" }, runs: { type: "string" }, case: { type: "string" } },
  z
    .object({
      council: z.boolean().optional(),
      runs: z
        .string()
        .regex(/^(10|[1-9])$/, "--runs must be a whole number from 1 to 10")
        .optional(),
      case: z.string().min(1).optional(),
    })
    .transform((values) => ({
      council: values.council === true,
      runs: values.runs === undefined ? 1 : Number(values.runs),
      ...(values.case === undefined ? {} : { caseId: values.case }),
    })),
);
if (!parsed.ok) {
  process.stderr.write(`${parsed.error}\n${USAGE}\n`);
  process.exit(1);
}

const clients = councilClients(loadConfigOrExit().ai.keys);
if (clients.length === 0) {
  process.stderr.write("No AI model key is set, so there is nothing to test.\n");
  process.exit(1);
}

const run = await runInjectionCheck(clients, parsed.value, cryptoCouncilDeps(), (message) => {
  process.stderr.write(`${message}\n`);
});
process.stdout.write(formatInjectionReport(run));
if (councilFailures(run.records).length > 0) process.exitCode = 1;
