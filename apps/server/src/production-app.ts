import { randomUUID } from "node:crypto";
import { connectKeyValue } from "./keyvalue.js";
import { defaultHttpDeps } from "@pactpal/net";
import { Channel3Lookup } from "@pactpal/products";
import { existsSync } from "node:fs";
import { connectPostgres, listenPostgres, recordWebhookEvent } from "@pactpal/db";
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
import { buildApp } from "./app.js";
import type { Config, ConfigReport } from "./config.js";
import { connectOwnApp } from "./sellers/connect-app.js";
import { sellerKeyBox } from "./sellers/key-box.js";
import { LinkedApps, linkedDisputeAccounts } from "./sellers/linked-apps.js";
import { sandboxSettler } from "./sellers/sandbox-settle.js";
import { councilClients, createDraftingRuntime } from "./drafting/runtime.js";
import {
  inProcessChecker,
  inProcessClaimRunner,
  renderClaimRunner,
  renderWorkflowChecker,
  renderDraftStarter,
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
import { DRAFT_TASK_NAME, jsonLines } from "./disputes/task.js";
import { postgresBus, publishingBus } from "./chat/bus.js";
import { sendTimelineReminders } from "./chat/reminders.js";

/**
 * The website as it runs on Render, built from the checked settings: PayPal, email, drafting,
 * disputes, sellers' own apps, the shared store and the chat bus. The server (`index.ts`) listens
 * with it; the demo seed (9b-2) acts through the same app, so its steps meet every real check.
 * `webDir` is the built web pages, when they exist.
 */
export async function productionApp(config: Config, report: ConfigReport, webDir: string) {
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
    ...(sellerRest
      ? { invoices: new PayPalInvoices(sellerRest, undefined, new McpFallback()) }
      : {}),
    // Escalations and evidence (5g) go from this server over REST, after the seller confirms.
    ...(sellerDisputes ? { disputeWriter: sellerDisputes } : {}),
    ...(email ? { email } : {}),
    // Scope drafts (9R-1) run as Render Workflow runs when Render is set up, like dispute jobs.
    ...(config.render
      ? {
          remoteDrafts: renderDraftStarter(
            new Render({ token: config.render.apiKey.reveal() }).workflows,
            sameWorkflowTask(config.render.taskSlug, DRAFT_TASK_NAME),
            disputeLog,
          ),
        }
      : {}),
    // Counters and cached listings shared by every server copy (9R-2), when Key Value is set.
    ...(config.keyValue
      ? { store: await connectKeyValue(config.keyValue.url.reveal(), disputeLog) }
      : {}),
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
  // The demo seed decides its sandbox disputes through the sellers' own linked apps (9b-2c).
  const settle = database && sellerBox && sandboxSettler(database, sellerBox);
  return { app, database, members, settle };
}
