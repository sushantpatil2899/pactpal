/** Plain words shared by the server and the web pages, so both say exactly the same thing. */
export { markWords, markedLine, type LineMark } from "./marks.js";
export { changeLines, dayWords, type ChangeFacts } from "./changes.js";
export { sizeWords } from "./sizes.js";
export {
  ANSWER_OPTIONS,
  answerFacts,
  deadlineIsNear,
  deadlineWords,
  disputeActionWords,
  disputeChangeWords,
  disputeReasonWords,
  plainCode,
} from "./disputes.js";
export { stepLine, type StepFacts } from "./steps.js";
export { listingLines, listingSource, type ListingFacts } from "./listing.js";
