/**
 * Buyer questions on the signing page: the agreement as numbered lines, the prompt that asks a
 * model to answer only from it, the check that every quote is on its line, and the order to try
 * models in. Pure; the server makes the calls.
 */
export { agreementLines, type AgreementLine, type AgreementPage } from "./lines.js";
export {
  QUESTION_PROMPT_VERSION,
  buildQuestionMessages,
  renderAgreement,
  type QuestionPrompt,
} from "./prompt.js";
export { checkAnswer, type AnswerRefusal, type CheckedAnswer } from "./check.js";
export { DEFAULT_QUESTION_MODEL, RECENT_FAILURE_MS, rankModels, type ModelRecord } from "./rank.js";
