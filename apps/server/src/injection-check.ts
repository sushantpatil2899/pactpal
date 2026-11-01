/**
 * `pnpm eval:injection`: runs the hostile chats and drafts against the real models and reports
 * which attacks worked. Options: `--council` (also run the council on each chat), `--runs <n>`
 * (repeat each case), `--case <id>` (one case only), `--models a,b` (only these models, by name),
 * `--no-filter` (do not hide lines that look like orders to an AI; a test switch). Costs tokens;
 * made-up data only.
 */
import { z } from "zod";
import { readChecked } from "./cli-args.js";
import { loadConfigOrExit } from "./cli-config.js";
import { councilClients, cryptoCouncilDeps } from "./drafting/runtime.js";
import { formatInjectionReport, councilFailures } from "./injection-report.js";
import { pickModels, runInjectionCheck } from "./injection-runner.js";

const USAGE =
  "Usage: pnpm eval:injection [--council] [--runs <1-10>] [--case <id>] [--models <a,b>] [--no-filter]";

const parsed = readChecked(
  process.argv.slice(2),
  {
    council: { type: "boolean" },
    runs: { type: "string" },
    case: { type: "string" },
    models: { type: "string" },
    "no-filter": { type: "boolean" },
  },
  z
    .object({
      council: z.boolean().optional(),
      runs: z
        .string()
        .regex(/^(10|[1-9])$/, "--runs must be a whole number from 1 to 10")
        .optional(),
      case: z.string().min(1).optional(),
      models: z.string().min(1).optional(),
      "no-filter": z.boolean().optional(),
    })
    .transform((values) => ({
      council: values.council === true,
      runs: values.runs === undefined ? 1 : Number(values.runs),
      filter: values["no-filter"] !== true,
      models:
        values.models === undefined ? [] : values.models.split(",").map((name) => name.trim()),
      ...(values.case === undefined ? {} : { caseId: values.case }),
    })),
);
if (!parsed.ok) {
  process.stderr.write(`${parsed.error}\n${USAGE}\n`);
  process.exit(1);
}

const { picked: clients, unknown } = pickModels(
  councilClients(loadConfigOrExit().ai.keys),
  parsed.value.models,
);
if (unknown.length > 0) process.stderr.write(`Not a configured model: ${unknown.join(", ")}\n`);
if (clients.length === 0) {
  process.stderr.write(
    "No AI model key is set (or none matches --models), so there is nothing to test.\n",
  );
  process.exit(1);
}

const run = await runInjectionCheck(clients, parsed.value, cryptoCouncilDeps(), (message) => {
  process.stderr.write(`${message}\n`);
});
process.stdout.write(formatInjectionReport(run));
if (councilFailures(run.records).length > 0) process.exitCode = 1;
