import { findUserByEmail, type Database } from "@pactpal/db";
import type { FastifyInstance } from "fastify";
import { actingAs } from "../acting-as.js";
import type { RouteAnswer } from "../agents/tools.js";
import { FILE_NAME_HEADER } from "../deals/file-routes.js";

/** Everything a demo step needs: the real app, its database, the clock and the content folder. */
export interface SeedContext {
  app: FastifyInstance;
  db: Database;
  clock: () => Date;
  /** A content file's bytes, by its path inside `hackathon/demo/`. */
  content: (path: string) => Buffer;
}

/** The browser name the seed's evidence entries carry, so nobody mistakes them for a person's. */
export const SEED_AGENT = "PactPal demo seed";

/** A route answered something other than what the step expected. */
export class SeedStepError extends Error {
  override readonly name = "SeedStepError";
}

/** Who a step acts as, by email; sellers sign in once themselves, buyers are added by a deal. */
async function userIdOf(context: SeedContext, email: string): Promise<string> {
  const user = await findUserByEmail(context.db, email);
  if (!user) throw new SeedStepError(`${email} has not signed in to PactPal yet`);
  return user.id;
}

/**
 * Calls one of PactPal's routes as the person with this email, through a session made for this
 * call alone, and checks the status: the same checks, log entries and emails as a person's click.
 */
export async function callAs(
  context: SeedContext,
  email: string,
  request: {
    method: "GET" | "POST";
    path: string;
    body?: object;
    headers?: Record<string, string>;
  },
  expect: readonly number[] = [200, 201],
): Promise<RouteAnswer> {
  const userId = await userIdOf(context, email);
  const answer = await actingAs(context.app, context.db, userId, context.clock(), (call) =>
    call(request.method, request.path, request.body, {
      "user-agent": SEED_AGENT,
      ...request.headers,
    }),
  );
  if (!expect.includes(answer.status)) {
    const said = (answer.body as { error?: unknown } | null)?.error;
    throw new SeedStepError(
      `${request.method} ${request.path} as ${email} answered ${String(answer.status)}${typeof said === "string" ? `: ${said}` : ""}`,
    );
  }
  return answer;
}

const idOf = (answer: RouteAnswer): string => {
  const id = (answer.body as { id?: unknown } | null)?.id;
  if (typeof id !== "string") throw new SeedStepError("the answer had no id");
  return id;
};

/** A new deal of the seller's; its id. */
export async function createDeal(
  context: SeedContext,
  seller: string,
  deal: { title: string; category: string; currency?: string },
): Promise<string> {
  const answer = await callAs(context, seller, {
    method: "POST",
    path: "/api/deals",
    body: { currency: "USD", ...deal },
  });
  return idOf(answer);
}

/** Adds the buyer to the deal by email and name, as the seller's form does. */
export async function addBuyer(
  context: SeedContext,
  seller: string,
  dealId: string,
  buyer: { email: string; name: string },
): Promise<void> {
  await callAs(context, seller, {
    method: "POST",
    path: `/api/deals/${dealId}/buyer`,
    body: buyer,
  });
}

/** Uploads a content file to the deal as a source (chat, brief) or a deliverable; its file id. */
export async function upload(
  context: SeedContext,
  who: string,
  dealId: string,
  file: { path: string; name: string; kind: "source" | "deliverable" },
): Promise<string> {
  const answer = await callAs(context, who, {
    method: "POST",
    path: `/api/deals/${dealId}/files?kind=${file.kind}`,
    body: context.content(file.path),
    headers: {
      "content-type": "application/octet-stream",
      [FILE_NAME_HEADER]: encodeURIComponent(file.name),
    },
  });
  return idOf(answer);
}

/** Posts one message to the deal's chat as this person. */
export async function chat(
  context: SeedContext,
  who: string,
  dealId: string,
  body: string,
): Promise<void> {
  await callAs(context, who, { method: "POST", path: `/api/deals/${dealId}/chat`, body: { body } });
}

/** The agreed work as the seller's form sends it: amounts typed ("120.00"), optional timeline. */
export interface AgreementForm {
  summary: string;
  deliverables: string[];
  exclusions: string[];
  revisionsIncluded?: number;
  milestones: { title: string; amount: string; dueDate?: string }[];
  timeline?: object[];
  draftId?: string;
}

/** Saves a version of the agreed work. */
export async function saveAgreement(
  context: SeedContext,
  seller: string,
  dealId: string,
  form: AgreementForm,
): Promise<void> {
  await callAs(context, seller, { method: "POST", path: `/api/deals/${dealId}/scope`, body: form });
}

/** Sends the newest version to the buyer to sign; the signing page's fingerprint. */
export async function sendForSigning(
  context: SeedContext,
  seller: string,
  dealId: string,
): Promise<string> {
  const base = `/api/deals/${dealId}/acceptance`;
  const preview = (await callAs(context, seller, { method: "GET", path: base })).body as {
    document: { terms: { version: number } } | null;
    documentSha256: string | null;
  };
  if (!preview.document || preview.documentSha256 === null) {
    throw new SeedStepError("there is no agreement to send yet");
  }
  await callAs(context, seller, {
    method: "POST",
    path: `${base}/request`,
    body: { version: preview.document.terms.version, documentSha256: preview.documentSha256 },
  });
  return preview.documentSha256;
}

/** The buyer signs the page they were sent, with their typed name. */
export async function sign(
  context: SeedContext,
  buyer: string,
  dealId: string,
  typedName: string,
): Promise<void> {
  const page = (
    await callAs(context, buyer, { method: "GET", path: `/api/deals/${dealId}/acceptance` })
  ).body as { documentSha256: string | null };
  if (page.documentSha256 === null) throw new SeedStepError("nothing was sent to sign");
  await callAs(context, buyer, {
    method: "POST",
    path: `/api/deals/${dealId}/acceptance/accept`,
    body: { documentSha256: page.documentSha256, typedName },
  });
}

interface StageView {
  stage: number;
  status: "not_invoiced" | "sending" | "sent" | "paid";
  payUrl: string | null;
  amount: { minor: number; currency: string };
  invoice?: { invoiceSha256: string };
}

const stagesOf = async (context: SeedContext, seller: string, dealId: string) =>
  (
    (await callAs(context, seller, { method: "GET", path: `/api/deals/${dealId}/milestones` }))
      .body as { stages: StageView[] }
  ).stages;

/** Sends one stage's PayPal invoice from the seller's own linked app, exactly as previewed. */
export async function sendInvoice(
  context: SeedContext,
  seller: string,
  dealId: string,
  stage: number,
): Promise<void> {
  const view = (await stagesOf(context, seller, dealId)).find((s) => s.stage === stage);
  if (!view) throw new SeedStepError(`the agreement has no stage ${String(stage)}`);
  if (view.status !== "not_invoiced") return;
  if (!view.invoice) throw new SeedStepError("PayPal invoicing is not set up for this seller");
  await callAs(context, seller, {
    method: "POST",
    path: `/api/deals/${dealId}/milestones/${String(stage)}/invoice`,
    body: { invoiceSha256: view.invoice.invoiceSha256 },
  });
}

/**
 * Whether the buyer has paid the stage, asking PayPal once if not yet known; when unpaid, the
 * instruction for the person running the seed.
 */
export async function paidOrInstruction(
  context: SeedContext,
  seller: string,
  dealId: string,
  stage: number,
  buyer: string,
): Promise<string | undefined> {
  let view = (await stagesOf(context, seller, dealId)).find((s) => s.stage === stage);
  if (view?.status === "sent") {
    await callAs(
      context,
      seller,
      { method: "POST", path: `/api/deals/${dealId}/milestones/check` },
      [200, 201, 429],
    );
    view = (await stagesOf(context, seller, dealId)).find((s) => s.stage === stage);
  }
  if (view?.status === "paid") return undefined;
  const amount = view ? `${(view.amount.minor / 100).toFixed(2)} ${view.amount.currency}` : "";
  return `Pay stage ${String(stage)} (${amount}) as ${buyer} in the PayPal sandbox${view?.payUrl ? `: ${view.payUrl}` : ""}, then run this story again.`;
}

/** Delivers files for a stage with a message; the delivery's id. */
export async function deliver(
  context: SeedContext,
  seller: string,
  dealId: string,
  delivery: { stage: number; fileIds: string[]; message?: string },
): Promise<string> {
  await callAs(context, seller, {
    method: "POST",
    path: `/api/deals/${dealId}/deliveries`,
    body: delivery,
  });
  const list = (
    await callAs(context, seller, { method: "GET", path: `/api/deals/${dealId}/deliveries` })
  ).body as { deliveries: { id: string; stage: number }[] };
  const made = list.deliveries.filter((d) => d.stage === delivery.stage).at(-1);
  if (!made) throw new SeedStepError("the delivery was not listed");
  return made.id;
}

/** The buyer opens a delivery, downloads its files, then approves it or asks for changes. */
export async function answerDelivery(
  context: SeedContext,
  buyer: string,
  dealId: string,
  deliveryId: string,
  answer: { approve: true } | { changes: string },
): Promise<void> {
  const base = `/api/deals/${dealId}/deliveries/${deliveryId}`;
  await callAs(context, buyer, { method: "POST", path: `${base}/open` });
  await callAs(
    context,
    buyer,
    "approve" in answer
      ? { method: "POST", path: `${base}/approve` }
      : { method: "POST", path: `${base}/request-changes`, body: { request: answer.changes } },
  );
}

/** Marks a timeline step (1-based) with a status and an optional note, as its owner. */
export async function updateStep(
  context: SeedContext,
  who: string,
  dealId: string,
  step: number,
  update: { status: string; note?: string },
): Promise<void> {
  await callAs(context, who, {
    method: "POST",
    path: `/api/deals/${dealId}/timeline/${String(step)}`,
    body: update,
  });
}
