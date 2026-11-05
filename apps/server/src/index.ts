import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { MODEL_REGISTRY } from "@pactpal/ai";
import {
  connectPostgres,
  failRunningDrafts,
  failRunningMessageReviews,
  forwardInterruptedQuestions,
  recordWebhookEvent,
} from "@pactpal/db";
import {
  AccessTokenProvider,
  McpFallback,
  PayPalDisputes,
  PayPalInvoices,
  PayPalLogin,
  PayPalRestClient,
  PayPalWebhooks,
} from "@pactpal/paypal";
import { ResendEmailSender, ResendReceivedEmails } from "@pactpal/email";
import { Render } from "@renderinc/sdk";
import { buildApp, closeOnSignals } from "./app.js";
import { councilClients, createDraftingRuntime } from "./drafting/runtime.js";
import { formatErrors, loadConfig } from "./config.js";
import {
  inProcessChecker,
  inProcessClaimRunner,
  renderClaimRunner,
  renderWorkflowChecker,
  sameWorkflowTask,
} from "./disputes/checker.js";
import { CLAIM_TASK_NAME, SUMMARY_TASK_NAME, runDisputeJob } from "./disputes/claim-job.js";
import { syncDisputes } from "./disputes/dispute-sync.js";
import { jsonLines } from "./disputes/task.js";

const result = loadConfig(process.env);
if (!result.ok) {
  // The logger lives on the app, which cannot be built without valid settings.
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { config, report } = result;
const seller = config.paypal.apps.seller;
// One login per seller app, shared by webhook checks and invoices.
const sellerRest = seller && new PayPalRestClient(new AccessTokenProvider(seller));
const database =
  config.database &&
  connectPostgres({
    url: config.database.url.reveal(),
    // Like the settings errors above, written before the logger exists; the message holds no secrets.
    onError: (error) => process.stderr.write(`database connection error: ${error.message}\n`),
  });
// The built web app sits two folders up from both src/ and dist/ (apps/web/dist).
const webDir = fileURLToPath(new URL("../../web/dist/", import.meta.url));
const clock = () => new Date();
// Dispute checks run as Render Workflow task runs when Render is set up; otherwise "Check now"
// runs the check inside this server (a local copy). Reads go over REST, like invoices.
const disputeLog = jsonLines((line) => process.stdout.write(line));
const disputes = config.render
  ? renderWorkflowChecker(
      new Render({ token: config.render.apiKey.reveal() }).workflows,
      config.render.taskSlug,
      clock,
      disputeLog,
    )
  : database && sellerRest
    ? inProcessChecker((source) =>
        syncDisputes(
          {
            db: database,
            disputes: new PayPalDisputes(sellerRest, undefined, new McpFallback()),
            clock,
            newId: randomUUID,
            log: disputeLog,
          },
          source,
        ),
      )
    : undefined;
// Every model whose key is set takes part in the council; with none, drafting answers "unavailable".
const members = councilClients(config.ai.keys);
const drafting =
  database && members.length > 0 ? createDraftingRuntime({ clients: members }) : undefined;
// Claim comparisons (5d) and packet summaries (5f) run as Render Workflow task runs when Render is set up (the workflow
// service holds the AI keys); otherwise in this server's background, within its council limit.
const claims = config.render
  ? renderClaimRunner(
      new Render({ token: config.render.apiKey.reveal() }).workflows,
      {
        claim: sameWorkflowTask(config.render.taskSlug, CLAIM_TASK_NAME),
        summary: sameWorkflowTask(config.render.taskSlug, SUMMARY_TASK_NAME),
      },
      disputeLog,
    )
  : database && drafting
    ? inProcessClaimRunner(drafting, (analysisId) =>
        runDisputeJob(
          {
            db: database,
            clients: drafting.clients,
            council: drafting.council,
            clock,
            log: disputeLog,
          },
          analysisId,
        ),
      )
    : undefined;
const app = buildApp(report, {
  ...(disputes ? { disputes } : {}),
  ...(claims ? { claims } : {}),
  database,
  drafting,
  webDir: existsSync(webDir) ? webDir : undefined,
  // Invoices go over REST only: PayPal's MCP tool takes no request id, so a retry could create a
  // second invoice (docs/decisions.md, 4d). No MCP client means McpFallback goes straight to REST.
  ...(sellerRest ? { invoices: new PayPalInvoices(sellerRest, undefined, new McpFallback()) } : {}),
  // Without Resend's key and a sender the app uses its stand-in, which sends nothing.
  ...(config.email ? { email: new ResendEmailSender(config.email) } : {}),
  // Forwarding to the private address needs Resend's inbound key, its webhook secret and the domain.
  ...(config.inbound
    ? {
        inbound: {
          inbox: new ResendReceivedEmails({ apiKey: config.inbound.apiKey }),
          webhookSecret: config.inbound.webhookSecret,
          domain: config.inbound.domain,
        },
      }
    : {}),
  ...(config.trustProxyHops === undefined ? {} : { trustProxyHops: config.trustProxyHops }),
  signIn: {
    // The seller app stands in for PactPal's own PayPal app until Phase 6.
    login: seller && new PayPalLogin(seller),
    database,
    publicBaseUrl: config.publicBaseUrl,
    clock: () => new Date(),
    newId: randomUUID,
  },
  webhooks: {
    verifier: sellerRest && new PayPalWebhooks(sellerRest),
    webhookId: config.paypal.webhookId,
    events: database && {
      record: (event) => recordWebhookEvent(database, event, new Date()),
    },
  },
});

if (!existsSync(webDir)) app.log.warn("Web pages not built; serving the server's routes only");
app.log.info(
  `AI models ready for scope drafting: ${String(members.length)} of ${String(MODEL_REGISTRY.length)}`,
);
// No draft job survives a restart (one server instance), so a draft still "running" was cut off.
if (database) {
  try {
    const interrupted = await failRunningDrafts(database, "interrupted by a restart", new Date());
    if (interrupted > 0)
      app.log.warn(`${String(interrupted)} running draft(s) marked as interrupted`);
    const reviews = await failRunningMessageReviews(
      database,
      "interrupted by a restart",
      new Date(),
    );
    if (reviews > 0)
      app.log.warn(`${String(reviews)} running message review(s) marked as interrupted`);
    // Likewise a buyer's question still being answered goes to the seller.
    const forwarded = await forwardInterruptedQuestions(database, new Date());
    if (forwarded > 0)
      app.log.warn(`${String(forwarded)} interrupted question(s) sent to the seller`);
  } catch (error) {
    // Like /health, the server stays up while the database is unreachable.
    app.log.warn(
      { err: error instanceof Error ? error.name : "unknown" },
      "Could not sweep interrupted drafts and questions",
    );
  }
}
for (const feature of report.features) {
  if (feature.missing.length > 0) {
    app.log.warn(`${feature.name} not ready: missing ${feature.missing.join(", ")}`);
  }
}

closeOnSignals(app, process, (code) => process.exit(code));

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
