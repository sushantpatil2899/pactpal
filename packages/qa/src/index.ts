/**
 * Buyer questions on the signing page: the agreement as numbered lines, the prompt that asks a
 * model to answer only from it, and the check that every quote is on its line. Pure; the server makes the calls.
 */
export { agreementLines, numberedText, type AgreementLine, type AgreementPage } from "./lines.js";
export {
  QUESTION_PROMPT_VERSION,
  buildQuestionMessages,
  renderAgreement,
  type QuestionPrompt,
} from "./prompt.js";
export {
  checkAnswer,
  quoteOnLine,
  withoutLinePrefix,
  type AnswerRefusal,
  type CheckedAnswer,
} from "./check.js";
