import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import { originOf } from "./acceptance.js";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { appendLedgerEvent } from "./ledger-store.js";

/** At most this many questions per deal, so a page cannot spend the models' free limits. */
export const MAX_QUESTIONS_PER_DEAL = 20;

export const QUESTION_STATUSES = ["asked", "answered", "forwarded", "seller-answered"] as const;
export type QuestionStatus = (typeof QUESTION_STATUSES)[number];

/** Why a question went to the seller. */
export const FORWARD_REASONS = [
  /** The model said the agreement does not answer it. */
  "not-in-agreement",
  /** The model's reply did not pass the check (a quote not on its line, or a bad shape). */
  "quote-not-found",
  /** No model could answer (none set up, or every one failed). */
  "no-model",
  /** The buyer asked the seller instead of taking the automatic answer. */
  "buyer-asked",
] as const;
export type ForwardReason = (typeof FORWARD_REASONS)[number];

/** Why a question step was refused. */
export type QuestionRefusal =
  /** Not this deal's buyer (asking) or seller (answering). */
  | "not-your-deal"
  /** Questions are asked only while the buyer is asked to sign. */
  | "not-awaiting"
  /** The deal already has the most questions allowed. */
  | "too-many"
  /** Another question is still being answered. */
  | "busy"
  /** No such question, or it is not at the stage this step needs. */
  | "wrong-question";

export class QuestionNotAllowedError extends Error {
  override readonly name = "QuestionNotAllowedError";
  constructor(readonly reason: QuestionRefusal) {
    super(`The question step was refused: ${reason}`);
  }
}

const refuse = (reason: QuestionRefusal) => new QuestionNotAllowedError(reason);

/** An automatic answer as kept apart from the log: a draft the buyer was shown. */
const aiAnswerSchema = z.object({
  text: z.string(),
  citations: z.array(z.object({ line: z.number().int(), quote: z.string() })),
  model: z.string(),
  promptVersion: z.number().int(),
});
export type AiAnswer = z.output<typeof aiAnswerSchema>;

const COLUMNS = `id, deal_id AS "dealId", version, document_sha256 AS "documentSha256", question,
  status, ai_answer AS "aiAnswer", forward_reason AS "forwardReason",
  seller_answer AS "sellerAnswer", asked_by AS "askedBy", created_at AS "createdAt",
  updated_at AS "updatedAt"`;

const questionRow = z.object({
  id: z.string(),
  dealId: z.string(),
  version: z.number().int(),
  documentSha256: z.string(),
  question: z.string(),
  status: z.enum(QUESTION_STATUSES),
  aiAnswer: aiAnswerSchema.nullable(),
  forwardReason: z.enum(FORWARD_REASONS).nullable(),
  sellerAnswer: z.string().nullable(),
  askedBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type BuyerQuestion = z.output<typeof questionRow>;

/** The question named, locked with its deal, if it is at one of `statuses`; or refused. */
async function lockedQuestion(
  tx: Queryable,
  step: { dealId: string; questionId: string },
  statuses: readonly QuestionStatus[],
) {
  const deal = await lockDeal(tx, step.dealId);
  const rows = await tx.query(
    `SELECT ${COLUMNS} FROM buyer_questions WHERE id = $1 AND deal_id = $2`,
    [step.questionId, step.dealId],
  );
  const question = rows[0] === undefined ? undefined : questionRow.parse(rows[0]);
  if (!question || !statuses.includes(question.status)) throw refuse("wrong-question");
  return { deal, question };
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const origin = { ip: z.string().min(1).max(100).optional(), userAgent: z.string().optional() };

export const askQuestionSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  buyerId: z.uuid(),
  /** The version and fingerprint of the page the buyer was shown. */
  version: z.number().int().min(1),
  documentSha256: sha256,
  question: z.string().trim().min(1).max(500),
  ...origin,
});
export type AskQuestion = z.input<typeof askQuestionSchema>;

/**
 * The buyer asks a question about the page they are asked to sign: with the deal row locked, a
 * `BUYER_QUESTION` entry records it (with where they connected from) and it waits while a model
 * answers. Only the buyer, only while signing is awaited, one question at a time, and at most
 * `MAX_QUESTIONS_PER_DEAL` per deal.
 */
export async function askQuestion(
  db: Database,
  input: AskQuestion,
  now: Date,
): Promise<{ question: BuyerQuestion; entry: LedgerEntry }> {
  const ask = askQuestionSchema.parse(input);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, ask.dealId);
    if (deal.buyer_id !== ask.buyerId) throw refuse("not-your-deal");
    if (deal.status !== "awaiting_acceptance") throw refuse("not-awaiting");
    const counts = z
      .object({ total: z.coerce.number().int(), asking: z.coerce.number().int() })
      .parse(
        (
          await tx.query(
            `SELECT count(*) AS total, count(*) FILTER (WHERE status = 'asked') AS asking
               FROM buyer_questions WHERE deal_id = $1`,
            [ask.dealId],
          )
        )[0],
      );
    if (counts.total >= MAX_QUESTIONS_PER_DEAL) throw refuse("too-many");
    if (counts.asking > 0) throw refuse("busy");
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: ask.dealId,
        type: "BUYER_QUESTION",
        actor: "buyer",
        actorId: ask.buyerId,
        payload: {
          questionId: ask.id,
          version: ask.version,
          documentSha256: ask.documentSha256,
          question: ask.question,
        },
        ...originOf(ask),
      },
      now,
    );
    const rows = await tx.query(
      `INSERT INTO buyer_questions (id, deal_id, version, document_sha256, question, status,
                                    asked_by, asked_seq, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'asked', $6, $7, $8, $8)
       RETURNING ${COLUMNS}`,
      [
        ask.id,
        ask.dealId,
        ask.version,
        ask.documentSha256,
        ask.question,
        ask.buyerId,
        entry.seq,
        now,
      ],
    );
    return { question: questionRow.parse(rows[0]), entry };
  });
}

/** Sets a question's new status and the columns that come with it. */
async function moveOn(
  tx: Queryable,
  questionId: string,
  status: QuestionStatus,
  columns: Record<string, unknown>,
  now: Date,
): Promise<BuyerQuestion> {
  const names = Object.keys(columns);
  const sets = names.map((name, n) => `${name} = $${String(n + 4)}`).join(", ");
  const rows = await tx.query(
    `UPDATE buyer_questions SET status = $2, updated_at = $3${sets === "" ? "" : `, ${sets}`}
      WHERE id = $1 RETURNING ${COLUMNS}`,
    [questionId, status, now, ...names.map((name) => columns[name])],
  );
  return questionRow.parse(rows[0]);
}

export const recordAiAnswerSchema = z.object({
  dealId: z.uuid(),
  questionId: z.uuid(),
  answer: aiAnswerSchema,
});
export type RecordAiAnswer = z.input<typeof recordAiAnswerSchema>;

/**
 * An automatic answer that passed the check is shown to the buyer: an `AI_ANSWER_SHOWN` entry (by
 * the system) records only its fingerprint, the model, the prompt version and the cited line
 * numbers; the text stays in the question's row, apart from the evidence.
 */
export async function recordAiAnswer(
  db: Database,
  input: RecordAiAnswer,
  now: Date,
): Promise<{ question: BuyerQuestion; entry: LedgerEntry }> {
  const shown = recordAiAnswerSchema.parse(input);
  return db.transaction(async (tx) => {
    await lockedQuestion(tx, shown, ["asked"]);
    const { answer } = shown;
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: shown.dealId,
        type: "AI_ANSWER_SHOWN",
        actor: "system",
        payload: {
          questionId: shown.questionId,
          answerSha256: sha256Hex(
            JSON.stringify({ text: answer.text, citations: answer.citations }),
          ),
          model: answer.model,
          promptVersion: answer.promptVersion,
          citedLines: [...new Set(answer.citations.map((c) => c.line))],
        },
      },
      now,
    );
    const question = await moveOn(
      tx,
      shown.questionId,
      "answered",
      { ai_answer: JSON.stringify(answer), answered_seq: entry.seq },
      now,
    );
    return { question, entry };
  });
}

export const forwardQuestionSchema = z.object({
  dealId: z.uuid(),
  questionId: z.uuid(),
  reason: z.enum(FORWARD_REASONS),
  /** For `buyer-asked`: the buyer who asked the seller instead, and where they connected from. */
  buyerId: z.uuid().optional(),
  ...origin,
});
export type ForwardQuestion = z.input<typeof forwardQuestionSchema>;

/**
 * The question goes to the seller: a `QUESTION_FORWARDED` entry records why. Done by the system
 * while it is being answered (the agreement does not answer it, the check failed, or no model
 * could answer), or by the buyer after an automatic answer ("ask the seller instead").
 */
export async function forwardQuestion(
  db: Database,
  input: ForwardQuestion,
  now: Date,
): Promise<{ question: BuyerQuestion; entry: LedgerEntry }> {
  const step = forwardQuestionSchema.parse(input);
  const byBuyer = step.reason === "buyer-asked";
  return db.transaction(async (tx) => {
    const { deal } = await lockedQuestion(tx, step, byBuyer ? ["answered"] : ["asked"]);
    if (byBuyer && (step.buyerId === undefined || deal.buyer_id !== step.buyerId)) {
      throw refuse("not-your-deal");
    }
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: step.dealId,
        type: "QUESTION_FORWARDED",
        payload: { questionId: step.questionId, reason: step.reason },
        ...(byBuyer && step.buyerId !== undefined
          ? { actor: "buyer" as const, actorId: step.buyerId, ...originOf(step) }
          : { actor: "system" as const }),
      },
      now,
    );
    const question = await moveOn(
      tx,
      step.questionId,
      "forwarded",
      { forward_reason: step.reason, forwarded_seq: entry.seq },
      now,
    );
    return { question, entry };
  });
}

export const answerQuestionSchema = z.object({
  dealId: z.uuid(),
  questionId: z.uuid(),
  sellerId: z.uuid(),
  answer: z.string().trim().min(1).max(2000),
});
export type AnswerQuestion = z.input<typeof answerQuestionSchema>;

/** The seller answers a question sent to them: a `QUESTION_ANSWERED` entry records their words. */
export async function answerQuestion(
  db: Database,
  input: AnswerQuestion,
  now: Date,
): Promise<{ question: BuyerQuestion; entry: LedgerEntry }> {
  const step = answerQuestionSchema.parse(input);
  return db.transaction(async (tx) => {
    const { deal } = await lockedQuestion(tx, step, ["forwarded"]);
    if (deal.seller_id !== step.sellerId) throw refuse("not-your-deal");
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: step.dealId,
        type: "QUESTION_ANSWERED",
        actor: "seller",
        actorId: step.sellerId,
        payload: { questionId: step.questionId, answer: step.answer },
      },
      now,
    );
    const question = await moveOn(
      tx,
      step.questionId,
      "seller-answered",
      { seller_answer: step.answer, seller_seq: entry.seq },
      now,
    );
    return { question, entry };
  });
}

/** A deal's questions, oldest first. */
export async function listQuestions(q: Queryable, dealId: string): Promise<BuyerQuestion[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM buyer_questions WHERE deal_id = $1 ORDER BY created_at, asked_by, id`,
    [dealId],
  );
  return rows.map((row) => questionRow.parse(row));
}

const councilAnswers = z.object({
  finished: z.date(),
  answers: z.array(
    z.object({
      modelName: z.string(),
      status: z.string(),
      latencyMs: z.number().optional(),
    }),
  ),
});

/**
 * How each model did in the newest finished council runs, across all deals: one record per
 * answer (a valid draft counts as a success), newest first. Used to choose a model for questions.
 */
export async function recentModelRecords(
  q: Queryable,
  runs = 20,
): Promise<{ model: string; ok: boolean; latencyMs?: number; at: Date }[]> {
  const rows = await q.query(
    `SELECT finished_at AS finished, council -> 'answers' AS answers FROM scope_drafts
      WHERE council IS NOT NULL AND finished_at IS NOT NULL
      ORDER BY finished_at DESC LIMIT $1`,
    [runs],
  );
  return rows.flatMap((row) => {
    const run = councilAnswers.safeParse(row);
    if (!run.success) return [];
    return run.data.answers.map((answer) => ({
      model: answer.modelName,
      ok: answer.status === "valid",
      ...(answer.latencyMs === undefined ? {} : { latencyMs: answer.latencyMs }),
      at: run.data.finished,
    }));
  });
}

/**
 * Sends every question still being answered to the seller ("no model could answer"). Run when the
 * server starts: an answer cut short by a restart must not block the buyer's next question.
 */
export async function forwardInterruptedQuestions(db: Database, now: Date): Promise<number> {
  const rows = await db.query(
    "SELECT id, deal_id AS \"dealId\" FROM buyer_questions WHERE status = 'asked'",
  );
  const waiting = z.array(z.object({ id: z.string(), dealId: z.string() })).parse(rows);
  for (const { id, dealId } of waiting) {
    await forwardQuestion(db, { dealId, questionId: id, reason: "no-model" }, now);
  }
  return waiting.length;
}
