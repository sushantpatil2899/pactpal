import { parseJsonReply, type ChatClient } from "@pactpal/ai";
import {
  MAX_QUESTIONS_PER_DEAL,
  QuestionNotAllowedError,
  answerQuestion,
  askQuestion,
  forwardQuestion,
  listQuestions,
  recentModelRecords,
  recordAiAnswer,
  type BuyerQuestion,
  type Database,
  type Deal,
  type ForwardReason,
} from "@pactpal/db";
import {
  QUESTION_PROMPT_VERSION,
  agreementLines,
  buildQuestionMessages,
  checkAnswer,
  rankModels,
  type AgreementLine,
  type CheckedAnswer,
  type ModelRecord,
} from "@pactpal/qa";
import type { FastifyBaseLogger, FastifyPluginAsync, FastifyReply } from "fastify";
import { z } from "zod";
import { currentDocument } from "../acceptance/document.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { requestOrigin } from "../request-origin.js";
import { readBody, type DealLookup, type FoundDeal } from "./access.js";
import { roleIn } from "./visibility.js";

export interface QuestionRouteOptions {
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  buyersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  recordIp: boolean;
  /** The models with keys and the random markers; without it every question goes to the seller. */
  drafting: DraftingRuntime | undefined;
}

/** At most this many models are asked for one question (the first may fail or be refused). */
export const MODELS_PER_QUESTION = 2;

/** This server's own recent answers per model, kept in memory to choose the next model. */
const MEMORY = 100;

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const askBody = z.object({ question: z.string().trim().min(1).max(500), documentSha256: sha256 });
const answerBody = z.object({ answer: z.string().trim().min(1).max(2000) });
const questionParams = z.object({ questionId: z.uuid() });

const REFUSALS: Record<QuestionNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "you cannot do this on this deal" },
  "not-awaiting": { status: 409, error: "questions can be asked only while you are asked to sign" },
  "too-many": {
    status: 429,
    error: `this deal already has ${String(MAX_QUESTIONS_PER_DEAL)} questions`,
  },
  busy: { status: 409, error: "another question is still being answered; try again in a moment" },
  "wrong-question": { status: 409, error: "this question is not at that stage any more" },
};

/** A question as both sides see it. The model's name stays in the log, not on the page. */
const questionView = (question: BuyerQuestion) => ({
  id: question.id,
  version: question.version,
  question: question.question,
  status: question.status,
  askedAt: question.createdAt.toISOString(),
  answer:
    question.aiAnswer === null
      ? null
      : { text: question.aiAnswer.text, citations: question.aiAnswer.citations },
  forwardReason: question.forwardReason,
  sellerAnswer: question.sellerAnswer,
  updatedAt: question.updatedAt.toISOString(),
});

/** How one model's attempt went: answered, refused to answer, or failed (try the next one). */
type Attempt =
  | { kind: "answered"; answer: CheckedAnswer }
  | { kind: "not-in-agreement" }
  | { kind: "failed"; reason: ForwardReason };

/**
 * Buyer questions on the signing page: the buyer asks; a model chosen from recent records answers
 * only from the agreement, and the answer is shown only if every quote is on its line; otherwise
 * the question goes to the seller, who answers it. Both sides see every question.
 */
export const questionRoutes: FastifyPluginAsync<QuestionRouteOptions> = (app, options) => {
  const { visibleDeal, sellersDeal, buyersDeal, clock, newId, recordIp, drafting } = options;
  const memory: ModelRecord[] = [];
  const remember = (record: ModelRecord) => {
    memory.unshift(record);
    memory.length = Math.min(memory.length, MEMORY);
  };

  async function view(db: Database, deal: Deal, buyer: boolean) {
    const questions = await listQuestions(db, deal.id);
    const asking = questions.some((q) => q.status === "asked");
    return {
      canAsk:
        buyer &&
        deal.status === "awaiting_acceptance" &&
        !asking &&
        questions.length < MAX_QUESTIONS_PER_DEAL,
      questions: questions.map(questionView),
    };
  }

  const answer = async (reply: FastifyReply, { db, deal, viewer }: FoundDeal) =>
    reply.send(await view(db, deal, roleIn(viewer, deal) === "buyer"));

  /** Runs a step, turning a refusal into its answer. */
  async function step(reply: FastifyReply, found: FoundDeal, work: () => Promise<unknown>) {
    try {
      await work();
    } catch (error) {
      if (!(error instanceof QuestionNotAllowedError)) throw error;
      const { status, error: message } = REFUSALS[error.reason];
      return reply.code(status).send({ error: message });
    }
    return answer(reply, found);
  }

  /** Asks one model and checks its reply; the outcome is remembered to choose the next model. */
  async function attempt(
    client: ChatClient,
    lines: readonly AgreementLine[],
    question: string,
  ): Promise<Attempt> {
    if (!drafting) return { kind: "failed", reason: "no-model" };
    const built = buildQuestionMessages({ lines, question, marker: drafting.council.newMarker() });
    if (!built.ok) return { kind: "failed", reason: "quote-not-found" };
    const outcome = await client.complete({
      messages: built.messages,
      // Room to think: some models spend part of the limit reasoning before they answer.
      maxTokens: 2000,
      temperature: 0,
      reply: "json",
    });
    const parsed = parseJsonReply(outcome);
    const checked = parsed.ok ? checkAnswer(parsed.value, lines) : undefined;
    const usable = checked?.ok === true || checked?.reason === "not-in-agreement";
    remember({
      model: client.spec.name,
      ok: usable,
      ...(outcome.ok ? { latencyMs: outcome.latencyMs } : {}),
      at: clock(),
    });
    if (!parsed.ok) return { kind: "failed", reason: "no-model" };
    if (checked?.ok === true) return { kind: "answered", answer: checked.answer };
    return checked?.reason === "not-in-agreement"
      ? { kind: "not-in-agreement" }
      : { kind: "failed", reason: "quote-not-found" };
  }

  /**
   * Answers a question just asked: models in the order their records suggest, at most two; the
   * first usable outcome decides. Whatever happens, the question does not stay "being answered".
   */
  async function settle(
    db: Database,
    deal: Deal,
    question: BuyerQuestion,
    lines: readonly AgreementLine[],
    log: FastifyBaseLogger,
  ) {
    const step = { dealId: deal.id, questionId: question.id };
    let reason: ForwardReason = "no-model";
    try {
      const clients = drafting?.clients ?? [];
      const records = [...memory, ...(await recentModelRecords(db))];
      const order = rankModels(
        clients.map((c) => c.spec.name),
        records,
        clock(),
      ).slice(0, MODELS_PER_QUESTION);
      for (const name of order) {
        const client = clients.find((c) => c.spec.name === name);
        if (!client) continue;
        const result = await attempt(client, lines, question.question);
        if (result.kind === "answered") {
          await recordAiAnswer(
            db,
            {
              ...step,
              answer: {
                ...result.answer,
                model: name,
                promptVersion: QUESTION_PROMPT_VERSION,
              },
            },
            clock(),
          );
          log.info({ dealId: deal.id, model: name }, "Question answered from the agreement");
          return;
        }
        if (result.kind === "not-in-agreement") {
          reason = "not-in-agreement";
          break;
        }
        reason = result.reason;
      }
    } catch (error) {
      log.error(
        { dealId: deal.id, err: error instanceof Error ? error.name : "unknown" },
        "Answering a question failed",
      );
      reason = "no-model";
    }
    await forwardQuestion(db, { ...step, reason }, clock());
    log.info({ dealId: deal.id, reason }, "Question sent to the seller");
  }

  app.get("/api/deals/:id/questions", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    return found ? answer(reply, found) : reply;
  });

  app.post("/api/deals/:id/questions", async (request, reply) => {
    const found = await buyersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(askBody, request, reply);
    if (!body) return reply;
    const { db, deal, viewer } = found;
    const current =
      deal.status === "awaiting_acceptance" ? await currentDocument(db, deal) : undefined;
    if (!current) return reply.code(409).send({ error: REFUSALS["not-awaiting"].error });
    if (current.documentSha256 !== body.documentSha256) {
      return reply.code(409).send({ error: "the terms changed; reload the page" });
    }
    return step(reply, found, async () => {
      const { question } = await askQuestion(
        db,
        {
          id: newId(),
          dealId: deal.id,
          buyerId: viewer.user.id,
          version: current.scope.version,
          documentSha256: current.documentSha256,
          question: body.question,
          ...requestOrigin(request, recordIp),
        },
        clock(),
      );
      // The question's text stays out of the server's logs; the evidence log has it.
      request.log.info({ dealId: deal.id }, "Buyer asked a question");
      await settle(db, deal, question, agreementLines(current.document), request.log);
    });
  });

  /** The question named in the path, or undefined after answering 404. */
  async function namedQuestion(found: FoundDeal, params: unknown, reply: FastifyReply) {
    const parsed = questionParams.safeParse(params);
    const questions = parsed.success ? await listQuestions(found.db, found.deal.id) : [];
    const question = questions.find((q) => q.id === (parsed.success ? parsed.data.questionId : ""));
    if (!question) await reply.code(404).send({ error: "not found" });
    return question;
  }

  // "Ask the seller instead": the buyer sends an automatically answered question on.
  app.post("/api/deals/:id/questions/:questionId/forward", async (request, reply) => {
    const found = await buyersDeal(request, reply);
    if (!found) return reply;
    const question = await namedQuestion(found, request.params, reply);
    if (!question) return reply;
    return step(reply, found, () =>
      forwardQuestion(
        found.db,
        {
          dealId: found.deal.id,
          questionId: question.id,
          reason: "buyer-asked",
          buyerId: found.viewer.user.id,
          ...requestOrigin(request, recordIp),
        },
        clock(),
      ),
    );
  });

  app.post("/api/deals/:id/questions/:questionId/answer", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(answerBody, request, reply);
    if (!body) return reply;
    const question = await namedQuestion(found, request.params, reply);
    if (!question) return reply;
    return step(reply, found, async () => {
      await answerQuestion(
        found.db,
        {
          dealId: found.deal.id,
          questionId: question.id,
          sellerId: found.viewer.user.id,
          answer: body.answer,
        },
        clock(),
      );
      request.log.info({ dealId: found.deal.id }, "Seller answered a question");
    });
  });

  return Promise.resolve();
};
