/**
 * The message watcher (4m): the prompt that asks a council to label each request in a buyer's
 * new message against the signed agreement, draft a reply and change lines; the code checks
 * every answer must pass; and the council task. Pure; the server runs the council. Advice for
 * the seller only.
 */
export {
  MESSAGE_PROMPT_VERSION,
  buildReviewMessages,
  recordLines,
  reviewSource,
  type WorkRecord,
} from "./prompt.js";
export {
  REQUEST_LABELS,
  checkReview,
  messageReviewSchema,
  readReview,
  type MessageReview,
  type RequestLabel,
} from "./review.js";
export { messageReviewCouncilTask, type MessageReviewTask } from "./council-task.js";
