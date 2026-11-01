/**
 * `pnpm eval:injection`: runs the hostile chats and drafts against the real models and reports
 * which attacks worked. Options: `--council` (also run the council on each chat), `--runs <n>`
 * (repeat each case), `--case <id>` (one case only), `--models a,b` (only these models, by name),
 * `--no-filter` (do not hide lines that look like orders to an AI; a test switch). Costs tokens;
 * made-up data only.
 */
import { z } from "zod";
import { logProgress, readChecked, valueOrExit } from "./cli-args.js";
import { modelNames, selectedClientsOrExit } from "./cli-models.js";
import { cryptoCouncilDeps } from "./drafting/runtime.js";
import { formatInjectionReport, councilFailures } from "./injection-report.js";
import { runInjectionCheck } from "./injection-runner.js";

const USAGE =
  "Usage: pnpm eval:injection [--council] [--runs <1-10>] [--case <id>] [--models <a,b>] [--no-filter]";

const parsed = valueOrExit(
  readChecked(
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
        models: modelNames(values.models),
        ...(values.case === undefined ? {} : { caseId: values.case }),
      })),
  ),
  USAGE,
);

const clients = selectedClientsOrExit(parsed.models);

const run = await runInjectionCheck(clients, parsed, cryptoCouncilDeps(), logProgress);
process.stdout.write(formatInjectionReport(run));
if (councilFailures(run.records).length > 0) process.exitCode = 1;
