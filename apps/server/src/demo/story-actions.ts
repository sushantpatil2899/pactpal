import type { RouteAnswer } from "../agents/tools.js";
import { SEED_AGENT, SeedStepError, callAs, uploadBytes, type SeedContext } from "./actions.js";

/** The actions the six stories need beyond a deal's basics (hackathon/demo-plan.md). */

const JOB_POLL_MS = 15_000;
const JOB_WAIT_MS = 20 * 60_000;

type JobResult = { ready: true; id: string } | { ready: false; reason: string };

/**
 * Waits for the newest AI job a page lists (a comparison, summary, message check or appeal check)
 * to finish; its id when ready, or why not. Lists are newest first.
 */
async function newestJob(
  context: SeedContext,
  seller: string,
  path: string,
  list: string,
  what: string,
): Promise<JobResult> {
  for (let waited = 0; waited <= JOB_WAIT_MS; waited += JOB_POLL_MS) {
    const page = (await callAs(context, seller, { method: "GET", path })).body as Record<
      string,
      { id: string; status: string; failureReason: string | null }[] | undefined
    >;
    const job = page[list]?.[0];
    if (!job) throw new SeedStepError(`no ${what} was started`);
    if (job.status === "ready") return { ready: true, id: job.id };
    if (job.status === "failed") {
      return { ready: false, reason: `the ${what} failed: ${String(job.failureReason)}` };
    }
    await context.sleep(JOB_POLL_MS);
  }
  return { ready: false, reason: `the ${what} took longer than 20 minutes` };
}

/** Posts a chat script's lines ("who|text") in order, each as the person its key names. */
export async function postChat(
  context: SeedContext,
  dealId: string,
  lines: readonly string[],
  people: Readonly<Record<string, string>>,
): Promise<void> {
  for (const line of lines) {
    const [who = "", ...rest] = line.split("|");
    const email = people[who];
    if (email === undefined) throw new SeedStepError(`the chat names nobody called ${who}`);
    await callAs(context, email, {
      method: "POST",
      path: `/api/deals/${dealId}/chat`,
      body: { body: rest.join("|") },
    });
  }
}

/** A chat script's lines from a content file, from line `from` (1-based) to `to`, inclusive. */
export const chatLines = (context: SeedContext, path: string, from: number, to: number) =>
  context
    .content(path)
    .toString("utf8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .slice(from - 1, to);

/** The seller's message check (4m): a buyer's message read against the signed agreement. */
export async function checkMessage(
  context: SeedContext,
  seller: string,
  dealId: string,
  text: string,
): Promise<JobResult> {
  const path = `/api/deals/${dealId}/messages`;
  await callAs(context, seller, { method: "POST", path, body: { text } }, [202]);
  return newestJob(context, seller, path, "reviews", "message check");
}

interface ChangeOrders {
  orders: { id: string; status: string; documentSha256?: string }[];
}

/** The seller proposes a change to the signed agreement; the change's id and signing fingerprint. */
export async function proposeChange(
  context: SeedContext,
  seller: string,
  dealId: string,
  change: object,
): Promise<{ changeId: string; documentSha256: string }> {
  const path = `/api/deals/${dealId}/change-orders`;
  await callAs(context, seller, { method: "POST", path, body: change });
  const view = (await callAs(context, seller, { method: "GET", path })).body as ChangeOrders;
  const waiting = view.orders.find((order) => order.status === "proposed");
  if (!waiting?.documentSha256) throw new SeedStepError("the change was not listed as waiting");
  return { changeId: waiting.id, documentSha256: waiting.documentSha256 };
}

/** The buyer signs a waiting change with their typed name, or declines it with a reason. */
export async function answerChange(
  context: SeedContext,
  buyer: string,
  dealId: string,
  change: { changeId: string; documentSha256: string },
  answer: { typedName: string } | { reason: string },
): Promise<void> {
  const base = `/api/deals/${dealId}/change-orders/${change.changeId}`;
  await callAs(
    context,
    buyer,
    "typedName" in answer
      ? {
          method: "POST",
          path: `${base}/accept`,
          body: { documentSha256: change.documentSha256, typedName: answer.typedName },
        }
      : { method: "POST", path: `${base}/decline`, body: { reason: answer.reason } },
  );
}

/** The buyer downloads every file of a delivery, as the delivery page's links do (logged). */
export async function downloadDelivery(
  context: SeedContext,
  buyer: string,
  dealId: string,
  deliveryId: string,
  fileIds: readonly string[],
): Promise<void> {
  const base = `/api/deals/${dealId}/deliveries/${deliveryId}`;
  await callAs(context, buyer, { method: "POST", path: `${base}/open` });
  for (const fileId of fileIds) {
    await callAs(context, buyer, { method: "GET", path: `${base}/files/${fileId}` });
  }
}

/** The pre-delivery check (4l) of delivered images, with copies of the images for the models. */
export async function deliveryCheck(
  context: SeedContext,
  seller: string,
  dealId: string,
  check: { stage: number; files: { fileId: string; path: string }[] },
): Promise<void> {
  await callAs(context, seller, {
    method: "POST",
    path: `/api/deals/${dealId}/delivery-checks`,
    body: {
      stage: check.stage,
      fileIds: check.files.map((file) => file.fileId),
      copies: check.files.map((file) => ({
        fileId: file.fileId,
        mediaType: file.path.endsWith(".png") ? "image/png" : "image/jpeg",
        base64: context.content(file.path).toString("base64"),
      })),
    },
  });
}

/**
 * Reads a chat screenshot into text (4o) and keeps the text as the deal's pasted chat, as the
 * seller does after checking it; the text file's id, or why it could not be read.
 */
export async function screenshotToChat(
  context: SeedContext,
  seller: string,
  dealId: string,
  screenshot: { fileId: string; path: string; name: string },
): Promise<{ ok: true; fileId: string } | { ok: false; reason: string }> {
  const answer = await callAs(
    context,
    seller,
    {
      method: "POST",
      path: `/api/deals/${dealId}/screenshots/read`,
      body: {
        fileIds: [screenshot.fileId],
        copies: [
          {
            fileId: screenshot.fileId,
            mediaType: "image/png",
            base64: context.content(screenshot.path).toString("base64"),
          },
        ],
      },
    },
    [200, 422, 503],
  );
  const text = (answer.body as { text?: unknown } | null)?.text;
  if (answer.status !== 200 || typeof text !== "string" || text === "") {
    return { ok: false, reason: `the screenshot was not read (${String(answer.status)})` };
  }
  const fileId = await uploadBytes(context, seller, dealId, {
    bytes: Buffer.from(text),
    name: screenshot.name,
    kind: "source",
  });
  return { ok: true, fileId };
}

/** The listing as the agreement keeps it (8e): Channel3's facts and the photos saved as files. */
export async function listingFor(
  context: SeedContext,
  seller: string,
  dealId: string,
  url: string,
): Promise<object> {
  const base = `/api/deals/${dealId}/listing`;
  const looked = (
    await callAs(context, seller, { method: "POST", path: `${base}/lookup`, body: { url } })
  ).body as { listing: { imageUrls: string[] } & Record<string, unknown> };
  const imageUrls = looked.listing.imageUrls.slice(0, 3);
  const photos =
    imageUrls.length === 0
      ? []
      : (
          (
            await callAs(context, seller, {
              method: "POST",
              path: `${base}/photos`,
              body: { imageUrls },
            })
          ).body as { photos: object[] }
        ).photos;
  return { ...looked.listing, photos };
}

/**
 * The dispute PayPal opened on this deal, after asking PactPal to check now; undefined until the
 * buyer has opened it in the sandbox and the check has seen it.
 */
export async function disputeOf(
  context: SeedContext,
  seller: string,
  dealId: string,
): Promise<{ disputeId: string; outcome: string | null } | undefined> {
  const base = `/api/deals/${dealId}/disputes`;
  await callAs(context, seller, { method: "POST", path: `${base}/check` }, [202, 429, 503]);
  const list = (await callAs(context, seller, { method: "GET", path: base })).body as {
    disputes: { disputeId: string; outcome: string | null }[];
  };
  return list.disputes[0];
}

/** Starts the claim-against-record comparison (5d) and waits for it. */
export async function compareClaim(
  context: SeedContext,
  seller: string,
  dealId: string,
  disputeId: string,
): Promise<JobResult> {
  const path = `/api/deals/${dealId}/disputes/${disputeId}/analyses`;
  await callAs(context, seller, { method: "POST", path, body: {} }, [202]);
  return newestJob(context, seller, path, "analyses", "comparison");
}

/** Starts the council's summary (5f) from the newest ready comparison and waits for it. */
export async function summarise(
  context: SeedContext,
  seller: string,
  dealId: string,
  disputeId: string,
): Promise<JobResult> {
  const path = `/api/deals/${dealId}/disputes/${disputeId}/summaries`;
  await callAs(context, seller, { method: "POST", path, body: {} }, [202]);
  return newestJob(context, seller, path, "summaries", "summary");
}

/** Builds the evidence packet (5e) with the checked comparison and summary; nothing is sent. */
export async function buildPacket(
  context: SeedContext,
  seller: string,
  dealId: string,
  dispute: { disputeId: string; analysisId: string; summaryId: string },
): Promise<string> {
  const answer = await callAs(context, seller, {
    method: "POST",
    path: `/api/deals/${dealId}/disputes/${dispute.disputeId}/packet`,
    body: {
      leaveOut: [],
      includeAi: { analysisId: dispute.analysisId, summaryId: dispute.summaryId },
    },
  });
  const id = (answer.body as { id?: unknown } | null)?.id;
  if (typeof id !== "string") throw new SeedStepError("the packet answer had no id");
  return id;
}

/** The seller's agent: a new agent key and a way to call PactPal's MCP tools with it (8a–8c). */
export async function agentFor(context: SeedContext, seller: string) {
  const made = await callAs(context, seller, {
    method: "POST",
    path: "/api/intake/agent",
    body: { defaultCategory: "writing-and-translation", defaultCurrency: "USD" },
  });
  const key = (made.body as { secret?: unknown } | null)?.secret;
  if (typeof key !== "string") throw new SeedStepError("no agent key was made");
  let ids = 1;
  return async (name: string, args: object): Promise<Record<string, unknown>> => {
    const answer = await context.app.inject({
      method: "POST",
      url: "/mcp",
      headers: {
        authorization: `Bearer ${key}`,
        accept: "application/json, text/event-stream",
        "user-agent": SEED_AGENT,
      },
      payload: {
        jsonrpc: "2.0",
        id: ids++,
        method: "tools/call",
        params: { name, arguments: args },
      },
    });
    const body = JSON.parse(answer.body) as {
      result?: { content: { text: string }[]; isError?: boolean };
    };
    const text = body.result?.content[0]?.text ?? "";
    if (answer.statusCode !== 200 || body.result?.isError === true) {
      throw new SeedStepError(`the agent's ${name} failed: ${text || String(answer.statusCode)}`);
    }
    return JSON.parse(text) as Record<string, unknown>;
  };
}

/** The seller approves their agent's request in PactPal; the one-time code to give the agent. */
export async function approveAgentRequest(
  context: SeedContext,
  seller: string,
  requestId: string,
): Promise<string> {
  const answer: RouteAnswer = await callAs(context, seller, {
    method: "POST",
    path: `/api/agent-requests/${requestId}/approve`,
  });
  const code = (answer.body as { code?: unknown } | null)?.code;
  if (typeof code !== "string") throw new SeedStepError("the approval gave no code");
  return code;
}
