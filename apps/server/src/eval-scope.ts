/**
 * `pnpm eval:scope`: asks the real models for a draft of each made-up chat with a known right
 * answer, runs the council vote on those drafts, and reports how each model alone and the council
 * scored, and what each cost. Options: `--runs <1-5>` (repeat each chat), `--case <id>` (one chat
 * only), `--models a,b` (only these models, by name). Costs tokens; made-up data only.
 */
import { EVAL_CASES } from "@pactpal/scope-draft/testing";
import { z } from "zod";
import { logProgress, readChecked, valueOrExit } from "./cli-args.js";
import { modelNames, selectedClientsOrExit } from "./cli-models.js";
import { cryptoCouncilDeps } from "./drafting/runtime.js";
import { formatEvalReport } from "./eval-report.js";
import { runEvals } from "./eval-runner.js";

const USAGE = "Usage: pnpm eval:scope [--runs <1-5>] [--case <id>] [--models <a,b>]";

const parsed = valueOrExit(
  readChecked(
    process.argv.slice(2),
    { runs: { type: "string" }, case: { type: "string" }, models: { type: "string" } },
    z
      .object({
        runs: z
          .string()
          .regex(/^[1-5]$/, "--runs must be a whole number from 1 to 5")
          .optional(),
        case: z
          .string()
          .refine((id) => EVAL_CASES.some((c) => c.id === id), {
            message: `--case must be one of: ${EVAL_CASES.map((c) => c.id).join(", ")}`,
          })
          .optional(),
        models: z.string().min(1).optional(),
      })
      .transform((values) => ({
        options: {
          runs: values.runs === undefined ? 1 : Number(values.runs),
          ...(values.case === undefined ? {} : { caseId: values.case }),
        },
        models: modelNames(values.models),
      })),
  ),
  USAGE,
);

const clients = selectedClientsOrExit(parsed.models);

const run = await runEvals(clients, parsed.options, cryptoCouncilDeps(), logProgress);
process.stdout.write(formatEvalReport(run));
