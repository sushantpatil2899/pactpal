import { findUserByEmail, type Database } from "@pactpal/db";
import { renderPdf } from "@pactpal/pdf";
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
  /** Waits, for steps that wait on an AI draft; tests pass one that returns at once. */
  sleep: (ms: number) => Promise<void>;
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
 * The people among `emails` who have not yet signed in to PactPal with PayPal. The seed acts only
 * for people who have: a buyer it added by email alone could never sign in with PayPal later.
 */
export async function notSignedInWithPayPal(
  context: SeedContext,
  emails: readonly string[],
): Promise<string[]> {
  const missing: string[] = [];
  for (const email of emails) {
    const user = await findUserByEmail(context.db, email);
    if (user?.paypalUserId === undefined) missing.push(email);
  }
  return missing;
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

/** Uploads bytes to the deal as a source (chat, brief) or a deliverable; the file's id. */
export async function uploadBytes(
  context: SeedContext,
  who: string,
  dealId: string,
  file: { bytes: Buffer; name: string; kind: "source" | "deliverable" },
): Promise<string> {
  const answer = await callAs(context, who, {
    method: "POST",
    path: `/api/deals/${dealId}/files?kind=${file.kind}`,
    body: file.bytes,
    headers: {
      "content-type": "application/octet-stream",
      [FILE_NAME_HEADER]: encodeURIComponent(file.name),
    },
  });
  return idOf(answer);
}

/** Uploads a content file to the deal as a source (chat, brief) or a deliverable; its file id. */
export const upload = (
  context: SeedContext,
  who: string,
  dealId: string,
  file: { path: string; name: string; kind: "source" | "deliverable" },
): Promise<string> =>
  uploadBytes(context, who, dealId, { ...file, bytes: context.content(file.path) });

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
  dueDate?: string;
  buyerProvides?: { text: string; dueDate?: string }[];
  /** One mark per deliverable (4i-2): objective, process, or a matter of taste and its stage. */
  deliverableKinds?: (
    { kind: "objective" | "process" } | { kind: "subjective"; approvalStage: number }
  )[];
  /** What is being sold, as its listing describes it (8e). */
  listing?: object;
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

/** The fingerprint of the signing page the buyer was sent; nothing sent is an error. */
async function signingPage(context: SeedContext, buyer: string, dealId: string): Promise<string> {
  const page = (
    await callAs(context, buyer, { method: "GET", path: `/api/deals/${dealId}/acceptance` })
  ).body as { documentSha256: string | null };
  if (page.documentSha256 === null) throw new SeedStepError("nothing was sent to sign");
  return page.documentSha256;
}

/** The buyer signs the page they were sent, with their typed name. */
export async function sign(
  context: SeedContext,
  buyer: string,
  dealId: string,
  typedName: string,
): Promise<void> {
  const documentSha256 = await signingPage(context, buyer, dealId);
  await callAs(context, buyer, {
    method: "POST",
    path: `/api/deals/${dealId}/acceptance/accept`,
    body: { documentSha256, typedName },
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
  update: { status: string; note?: string; fileIds?: string[] },
): Promise<void> {
  await callAs(context, who, {
    method: "POST",
    path: `/api/deals/${dealId}/timeline/${String(step)}`,
    body: update,
  });
}

/**
 * A content text file as a PDF document, laid out with PactPal's own renderer: its first line is
 * the title, its second the byline, blank lines start paragraphs. Uploaded like any file.
 */
export async function uploadTextAsPdf(
  context: SeedContext,
  who: string,
  dealId: string,
  file: { path: string; name: string; kind: "source" | "deliverable" },
): Promise<string> {
  const [title = file.name, byline = "", ...rest] = context
    .content(file.path)
    .toString("utf8")
    .split("\n");
  const { bytes } = await renderPdf({
    title,
    author: "Maya Lin Studio",
    createdAt: context.clock(),
    blocks: [
      { kind: "title", text: title },
      { kind: "paragraph", text: byline, style: "small" },
      ...rest
        .join("\n")
        .split(/\n{2,}/)
        .filter((paragraph) => paragraph.trim() !== "")
        .map((paragraph) => ({ kind: "paragraph" as const, text: paragraph.trim() })),
    ],
  });
  return uploadBytes(context, who, dealId, { ...file, bytes: Buffer.from(bytes) });
}

/** The buyer asks a question on the signing page they were sent. */
export async function askQuestion(
  context: SeedContext,
  buyer: string,
  dealId: string,
  question: string,
): Promise<void> {
  const documentSha256 = await signingPage(context, buyer, dealId);
  await callAs(context, buyer, {
    method: "POST",
    path: `/api/deals/${dealId}/questions`,
    body: { question, documentSha256 },
  });
}

/** The buyer declines the page they were sent, with a reason. */
export async function decline(
  context: SeedContext,
  buyer: string,
  dealId: string,
  reason: string,
): Promise<void> {
  const documentSha256 = await signingPage(context, buyer, dealId);
  await callAs(context, buyer, {
    method: "POST",
    path: `/api/deals/${dealId}/acceptance/decline`,
    body: { documentSha256, reason },
  });
}

/**
 * Makes a draft deal from text with the seller's private intake key (4p), as an order form on
 * their own site would: a new key is made, used once, and stays the seller's.
 */
export async function dealFromText(
  context: SeedContext,
  seller: string,
  text: string,
  title: string,
  defaultCategory = "writing-and-translation",
): Promise<string> {
  const made = await callAs(context, seller, {
    method: "POST",
    path: "/api/intake/key",
    body: { defaultCategory, defaultCurrency: "USD" },
  });
  const secret = (made.body as { secret?: unknown } | null)?.secret;
  if (typeof secret !== "string") throw new SeedStepError("no intake key was made");
  const answer = await context.app.inject({
    method: "POST",
    url: "/api/intake/deals",
    headers: { authorization: `Bearer ${secret}`, "user-agent": SEED_AGENT },
    payload: { text, title },
  });
  if (answer.statusCode !== 201) {
    throw new SeedStepError(`making a deal from text answered ${String(answer.statusCode)}`);
  }
  const dealId = (JSON.parse(answer.body) as { dealId?: unknown }).dealId;
  if (typeof dealId !== "string") throw new SeedStepError("the intake answer had no deal id");
  return dealId;
}

const DRAFT_POLL_MS = 15_000;
const DRAFT_WAIT_MS = 20 * 60_000;

/**
 * Starts an AI draft from the deal's pasted chats, or (`"update"`) an update of the agreement from
 * the in-app chat since the last draft (7i), then waits for the council to finish; the ready
 * draft's id, or a failure the step reports.
 */
export async function draftAgreement(
  context: SeedContext,
  seller: string,
  dealId: string,
  source: string[] | "update",
): Promise<{ ready: true; draftId: string } | { ready: false; reason: string }> {
  const started = await callAs(
    context,
    seller,
    {
      method: "POST",
      path: `/api/deals/${dealId}/drafts/from-chat`,
      body:
        source === "update" ? { chat: true, update: true } : { chat: false, pastedFileIds: source },
    },
    [202],
  );
  const draftId = (started.body as { draft?: { id?: unknown } } | null)?.draft?.id;
  if (typeof draftId !== "string") throw new SeedStepError("the draft answer had no id");
  for (let waited = 0; waited <= DRAFT_WAIT_MS; waited += DRAFT_POLL_MS) {
    const read = await callAs(context, seller, {
      method: "GET",
      path: `/api/deals/${dealId}/drafts/${draftId}`,
    });
    const draft = (read.body as { draft?: { status?: unknown; failureReason?: unknown } }).draft;
    if (draft?.status === "ready") return { ready: true, draftId };
    if (draft?.status === "failed") {
      return { ready: false, reason: `the AI draft failed: ${String(draft.failureReason)}` };
    }
    await context.sleep(DRAFT_POLL_MS);
  }
  return { ready: false, reason: "the AI draft took longer than 20 minutes" };
}
