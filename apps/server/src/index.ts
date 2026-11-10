import { randomUUID } from "node:crypto";
import { defaultHttpDeps } from "@pactpal/net";
import { Channel3Lookup } from "@pactpal/products";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { MODEL_REGISTRY } from "@pactpal/ai";
import {
  connectPostgres,
  failRunningDrafts,
  failRunningMessageReviews,
  forwardInterruptedQuestions,
  listenPostgres,
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
  checkSellerApp,
  type PayPalAppCredentials,
} from "@pactpal/paypal";
import { ResendEmailSender, ResendReceivedEmails, StandInEmailSender } from "@pactpal/email";
import { Render } from "@renderinc/sdk";
import { buildApp, closeOnSignals } from "./app.js";
import { connectOwnApp } from "./sellers/connect-app.js";
import { sellerKeyBox } from "./sellers/key-box.js";
import { LinkedApps, linkedDisputeAccounts } from "./sellers/linked-apps.js";
import { councilClients, createDraftingRuntime } from "./drafting/runtime.js";
import { formatErrors, loadConfig } from "./config.js";
import {
  inProcessChecker,
  inProcessClaimRunner,
  renderClaimRunner,
  renderWorkflowChecker,
  sameWorkflowTask,
} from "./disputes/checker.js";
import {
  CLAIM_TASK_NAME,
  APPEAL_TASK_NAME,
  RESPONSE_TASK_NAME,
  STATEMENT_TASK_NAME,
  SUMMARY_TASK_NAME,
  runDisputeJob,
} from "./disputes/claim-job.js";
import { syncDisputes } from "./disputes/dispute-sync.js";
import { jsonLines } from "./disputes/task.js";
import { postgresBus, publishingBus } from "./chat/bus.js";
import { sendTimelineReminders } from "./chat/reminders.js";

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
// One client for the seller's disputes, so its reads and writes for a dispute go one at a time.
const sellerDisputes = sellerRest && new PayPalDisputes(sellerRest, undefined, new McpFallback());
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
// Without Resend's key and a sender the app uses its stand-in, which sends nothing.
const email = config.email ? new ResendEmailSender(config.email) : undefined;
// Dispute checks run as Render Workflow task runs when Render is set up; otherwise "Check now"
// runs the check inside this server (a local copy). Reads go over REST, like invoices.
const disputeLog = jsonLines((line) => process.stdout.write(line));
// Sellers' own PayPal apps (6h): their secrets are encrypted with this key before storing.
const sellerBox = config.sellerKeys && sellerKeyBox(config.sellerKeys.encryptionKey);
// A local copy checks linked apps' disputes in process too (6h-5).
const localLinked = database && sellerBox && new LinkedApps(database, sellerBox, connectOwnApp);
const disputes = config.render
  ? renderWorkflowChecker(
      new Render({ token: config.render.apiKey.reveal() }).workflows,
      config.render.taskSlug,
      clock,
      disputeLog,
    )
  : database && (sellerDisputes || localLinked)
    ? inProcessChecker(async (source) => {
        const result = await syncDisputes(
          {
            db: database,
            disputes: sellerDisputes,
            ...(localLinked
              ? { linkedAccounts: () => linkedDisputeAccounts(database, localLinked) }
              : {}),
            clock,
            newId: randomUUID,
            log: disputeLog,
            // The seller's dispute emails (5j), when email and the site address are set.
            ...(email && config.publicBaseUrl !== undefined
              ? { notices: { email, publicBaseUrl: config.publicBaseUrl } }
              : {}),
          },
          source,
        );
        // A local copy sends timeline reminders (7l) with each check, as the background task does.
        await sendTimelineReminders({
          db: database,
          bus: publishingBus(database),
          email: email ?? new StandInEmailSender(disputeLog),
          publicBaseUrl: config.publicBaseUrl,
          clock,
          newId: randomUUID,
          log: disputeLog,
        });
        return result;
      })
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
        response: sameWorkflowTask(config.render.taskSlug, RESPONSE_TASK_NAME),
        appeal: sameWorkflowTask(config.render.taskSlug, APPEAL_TASK_NAME),
        statement: sameWorkflowTask(config.render.taskSlug, STATEMENT_TASK_NAME),
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
const sellerApps =
  database && sellerBox
    ? {
        box: sellerBox,
        check: (credentials: PayPalAppCredentials) => checkSellerApp(credentials),
        connect: connectOwnApp,
      }
    : undefined;
// The live chat (7c): events between server copies and from the background worker go through
// Postgres notifications, on a connection of their own.
const databaseSettings = config.database;
const chatBus =
  database &&
  databaseSettings &&
  postgresBus(
    database,
    (handlers) => listenPostgres({ url: databaseSettings.url.reveal(), ...handlers }),
    disputeLog,
  );
const app = buildApp(report, {
  ...(sellerApps ? { sellerApps } : {}),
  ...(chatBus ? { chatBus } : {}),
  ...(disputes ? { disputes } : {}),
  ...(claims ? { claims } : {}),
  database,
  drafting,
  webDir: existsSync(webDir) ? webDir : undefined,
  // Invoices go over REST only: PayPal's MCP tool takes no request id, so a retry could create a
  // second invoice (docs/decisions.md, 4d). No MCP client means McpFallback goes straight to REST.
  ...(sellerRest ? { invoices: new PayPalInvoices(sellerRest, undefined, new McpFallback()) } : {}),
  // Escalations and evidence (5g) go from this server over REST, after the seller confirms.
  ...(sellerDisputes ? { disputeWriter: sellerDisputes } : {}),
  ...(email ? { email } : {}),
  // Product listings (8e) through Channel3, when its key is set.
  ...(config.channel3
    ? { products: new Channel3Lookup(config.channel3.apiKey, defaultHttpDeps, () => new Date()) }
    : {}),
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
