import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import type { ChatOutcome, ChatRequest } from "@pactpal/ai";
import { addArtifact, postgresContentStore, readLedger } from "@pactpal/db";
import {
  TEST_NOW,
  createAwaitingTestDeal,
  createSignedTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { figure, jpeg, png } from "@pactpal/delivery-check/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs, testDrafting } from "./test-app.js";

const db = useMigratedTestDatabase();
const store = postgresContentStore(db, () => TEST_NOW);

interface CheckView {
  id: string;
  stage: number;
  files: { fileId: string; filename: string }[];
  report: {
    lines: { n: number; text: string }[];
    code: { line: number; results: { kind: string; result: string }[] }[];
    looks: Record<string, unknown>[];
  };
}

const COPY = "iVBORw0KGgo=";
const shown = JSON.stringify({
  description: "A red figure on a clear background.",
  lines: [{ line: 1, verdict: "shown", note: "A full-body character." }],
});
const FAILED: ChatOutcome = {
  ok: false,
  model: "x",
  kind: "rate_limited",
  message: "x: rate limited",
  status: 429,
};

/** A stand-in model; `vision` marks the ones that read images. */
const model = (name: string, answer: (r: ChatRequest) => string | ChatOutcome, vision = true) =>
  new FakeChatClient(testSpec({ name, vision }), answer);

/** A signed deal with delivered files (ids from 600), the app with these models, and both sides. */
async function signedDeal(
  clients: FakeChatClient[] | undefined,
  make: typeof createAwaitingTestDeal | typeof createSignedTestDeal = createSignedTestDeal,
  marks: { kind: "objective" | "process" }[] = [{ kind: "objective" }],
) {
  const deal = await make(db, { deliverableKinds: marks });
  const add = (
    n: number,
    filename: string,
    bytes: Uint8Array,
    kind: "deliverable" | "source" = "deliverable",
  ) =>
    addArtifact(
      db,
      store,
      {
        id: testId(600 + n),
        dealId: deal.dealId,
        kind,
        filename,
        bytes,
        addedBy: { actor: "seller", actorId: deal.seller.id },
      },
      TEST_NOW,
    );
  const drafting = testDrafting(clients);
  const env = dealTestApp(db, drafting);
  const seller = await signedInAs(db, deal.seller.id);
  const url = `/api/deals/${deal.dealId}/delivery-checks`;
  const check = (fileIds: string[], copies: object[] = [], stage = 1, who = seller) =>
    env.call("POST", url, who, { stage, fileIds, copies });
  return { ...env, ...deal, add, seller, url, check };
}

const copyOf = (fileId: string) => ({ fileId, mediaType: "image/png", base64: COPY });

describe("pre-delivery checks", () => {
  it("check the files by code and show the model's look, for the seller only", async () => {
    const qwen = model("qwen-groq", () => shown);
    const textOnly = model("gpt-oss-groq", () => shown, false);
    const env = await signedDeal([textOnly, qwen]);
    const file = await env.add(
      1,
      "courier.png",
      png({ width: 8, height: 12, pixel: figure(8, 12) }),
    );
    const logged = (await readLedger(db, env.dealId)).length;

    const res = await env.check([file.id], [copyOf(file.id)]);
    expect(res.statusCode).toBe(200);
    const [check] = res.json<{ checks: CheckView[] }>().checks;
    expect(check?.report.lines).toEqual([{ n: 1, text: "Full-body character, transparent PNG" }]);
    expect(check?.report.code[0]?.results).toEqual([
      { kind: "format", format: "png", result: "met", file: "courier.png" },
      { kind: "transparent", result: "met", file: "courier.png" },
    ]);
    expect(check?.report.looks).toEqual([
      {
        fileId: file.id,
        promptVersion: 1,
        look: {
          description: "A red figure on a clear background.",
          lines: [{ line: 1, verdict: "shown", note: "A full-body character." }],
        },
      },
    ]);
    expect(textOnly.requests).toHaveLength(0);
    expect(qwen.requests[0]?.messages[1]).toMatchObject({
      content:
        "<lines-abcdef123456>\n1: Full-body character, transparent PNG\n</lines-abcdef123456>",
      images: [{ mediaType: "image/png", base64: COPY }],
    });

    // Kept for the seller, never logged; the buyer cannot see it.
    expect(
      (await env.call("GET", env.url, env.seller)).json<{ checks: unknown[] }>().checks,
    ).toHaveLength(1);
    expect(await readLedger(db, env.dealId)).toHaveLength(logged);
    const [, buyer = ""] = await buyerVisitors(db, env.dealId, env.buyer.id);
    expect((await env.call("GET", env.url, buyer)).statusCode).toBe(403);
    expect((await env.check([file.id], [], 1, buyer)).statusCode).toBe(403);
    expect(env.logs.join("\n")).not.toMatch(/courier|red figure/);
  });

  it("try the next image model when a reply fails its check, and say when none answered", async () => {
    const broken = model("qwen-groq", () => JSON.stringify({ description: "x", lines: [] }));
    const second = model("mistral", () => shown);
    const env = await signedDeal([broken, second]);
    const file = await env.add(1, "courier.jpg", jpeg(2400, 3200));
    const [check] = (await env.check([file.id], [copyOf(file.id)])).json<{ checks: CheckView[] }>()
      .checks;
    expect(check?.report.looks[0]).toMatchObject({ look: { lines: [{ verdict: "shown" }] } });
    expect(check?.report.code[0]?.results.map((r) => r.result)).toEqual(["not-met", "not-met"]);
  });

  it("say when no image model answered", async () => {
    const env = await signedDeal([model("qwen-groq", () => FAILED)]);
    const file = await env.add(1, "courier.png", png({ width: 4, height: 4 }));
    const [check] = (await env.check([file.id], [copyOf(file.id)])).json<{ checks: CheckView[] }>()
      .checks;
    expect(check?.report.looks).toEqual([{ fileId: file.id, unavailable: true }]);
  });

  it("run the code checks alone with no model, no copy, or no line to look for", async () => {
    const env = await signedDeal(undefined);
    const file = await env.add(1, "courier.png", png({ width: 4, height: 4 }));
    const pdf = await env.add(2, "notes.pdf", new TextEncoder().encode("%PDF-1.7"));
    const [check] = (await env.check([file.id, pdf.id], [copyOf(file.id), copyOf(pdf.id)])).json<{
      checks: CheckView[];
    }>().checks;
    // Only the image's copy is looked at; with no model it is unavailable.
    expect(check?.report.looks).toEqual([{ fileId: file.id, unavailable: true }]);
    expect(check?.files.map((f) => f.filename)).toEqual(["courier.png", "notes.pdf"]);
  });

  it("look at nothing when no line can be checked", async () => {
    const qwen = model("qwen-groq", () => shown);
    const env = await signedDeal([qwen], createSignedTestDeal, [{ kind: "process" }]);
    const file = await env.add(1, "sketch.png", png({ width: 4, height: 4 }));
    const [check] = (await env.check([file.id], [copyOf(file.id)])).json<{ checks: CheckView[] }>()
      .checks;
    expect(check?.report).toMatchObject({ lines: [], code: [], looks: [] });
    expect(qwen.requests).toHaveLength(0);
  });

  it("are refused before signing, for a stage the agreement lacks, and for other files", async () => {
    const env = await signedDeal(undefined);
    const chat = await env.add(1, "chat.txt", new TextEncoder().encode("hi"), "source");
    const file = await env.add(2, "courier.png", png({ width: 4, height: 4 }));
    expect((await env.check([chat.id])).statusCode).toBe(400);
    expect((await env.check([testId(699)])).statusCode).toBe(400);
    expect((await env.check([file.id], [], 3)).statusCode).toBe(400);
    expect((await env.check([file.id, file.id])).statusCode).toBe(400);
    const bad = [{ fileId: file.id, mediaType: "image/png", base64: "not base64!" }];
    expect((await env.check([file.id], bad)).statusCode).toBe(400);
  });

  it("need a signed deal", async () => {
    const env = await signedDeal(undefined, createAwaitingTestDeal);
    const file = await env.add(1, "courier.png", png({ width: 4, height: 4 }));
    expect((await env.check([file.id])).statusCode).toBe(409);
  });
});
